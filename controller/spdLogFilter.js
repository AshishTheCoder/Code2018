import { ReactiveVar } from 'meteor/reactive-var';

Template.spdLogFilter.onCreated(function spdLogFilter() {
    this.spdStateList =  new ReactiveVar;
    this.spdArrList =  new ReactiveVar;
    this.isStateAndSPDselected =  new ReactiveVar;
    this.filterTypeSelected =  new ReactiveVar;
    this.financialYearSelected =  new ReactiveVar;
    this.spdAllData =  new ReactiveVar;
});

Template.spdLogFilter.rendered = function () {
  SessionStore.set("isLoading", false);
  var instance = Template.instance();
  Meteor.call('gettingSPDStateListForLogFilter', function(error, result) {
    if (error) {
      swal('Please try again!');
    }else {
      if (result.status) {
        instance.spdStateList.set(result.data);
      }
    }
  });
  Meteor.setTimeout(function () {
    $('#ddlSPDState').multiselect({
       buttonWidth: '360px',
       includeSelectAllOption: true,
   });
  },1000);
};

Template.spdLogFilter.events({
  "focus .txtFromClass": function() {
      $('.txtFromClass').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  'change #ddlScheme': function (e, instance) {
    $('#ddlSPDState').val('');
    instance.spdArrList.set();
    instance.spdAllData.set();
    instance.filterTypeSelected.set();
    instance.financialYearSelected.set();
    instance.isStateAndSPDselected.set();
  },
  'change #ddlSPDState': function (e, instance) {
    instance.spdArrList.set();
    var stateArr = $(e.currentTarget).val();
    var scheme = $('#ddlScheme').val();
    if (stateArr != null) {
      Meteor.call('gettingFilteredSPDSList',stateArr,scheme, function(error, result) {
        if (error) {
          swal('Please try again!');
        }else {
          if (result.status) {
            instance.spdArrList.set(result.data);
            Meteor.setTimeout(function () {
              $('#ddlSPDList').multiselect({
                 buttonWidth: '360px',
                 includeSelectAllOption: true,
             });
            },1000);
          }
        }
      });
    }else {
      instance.spdAllData.set();
      instance.spdArrList.set();
    }
  },
  'change #ddlSPDList': function (e, instance) {
    var stateArr = $('#ddlSPDState').val();
    var spdListArr = $(e.currentTarget).val();
    if (stateArr != null && spdListArr != null) {
      instance.isStateAndSPDselected.set(true);
    }else {
      $('#ddlFilterType').val('');
      instance.spdAllData.set();
      instance.isStateAndSPDselected.set();
    }
  },
  'change #ddlFilterType': function (e, instance) {
    $('#ddlFinancialYear').val('');
    var type = $(e.currentTarget).val();
    if (type == 'Financial Year') {
      instance.filterTypeSelected.set(type);
      instance.financialYearSelected.set();
    }else if (type == 'Month') {
      instance.filterTypeSelected.set(type);
    }else {
      instance.spdAllData.set();
      instance.filterTypeSelected.set();
    }
  },
  'change #ddlFinancialYear': function (e, instance) {
    var financialYear = $(e.currentTarget).val();
    var type = $('#ddlFilterType').val();
    var stateArr = $('#ddlSPDState').val();
    var spdListArr = $('#ddlSPDList').val();
    if (financialYear != '') {
      if (type == 'Month') {
        instance.financialYearSelected.set(type);
        Meteor.setTimeout(function () {
          $('#ddlMonth').multiselect({
             buttonWidth: '360px',
             includeSelectAllOption: true,
         });
        },1000);
      }else {
        var monthArr = ['04','05','06','07','08','09','10','11','12','01','02','03'];
        var json = {monthArr:monthArr, financialYear:financialYear, stateArr:stateArr, spdListArr:spdListArr};
        SessionStore.set("isLoading", true);
        Meteor.call('getingSPDLogFilterData',json, function(error, result) {
          if (error) {
            SessionStore.set("isLoading", false);
            swal('Please try again!');
          }else {
            if (result.status) {
              SessionStore.set("isLoading", false);
              instance.spdAllData.set(result.data);
            }
          }
        });
      }
    }else {
      instance.spdAllData.set();
      instance.financialYearSelected.set();
      swal('Please select financial year!');
    }
  },
  'change #ddlMonth': function (e, instance) {
    var monthArr = $(e.currentTarget).val();
    var financialYear = $('#ddlFinancialYear').val();
    var type = $('#ddlFilterType').val();
    var stateArr = $('#ddlSPDState').val();
    var spdListArr = $('#ddlSPDList').val();
    if (monthArr != null) {
      var json = {monthArr:monthArr, financialYear:financialYear, stateArr:stateArr, spdListArr:spdListArr};
      SessionStore.set("isLoading", true);
      Meteor.call('getingSPDLogFilterData',json, function(error, result) {
        if (error) {
          SessionStore.set("isLoading", false);
          swal('Please try again!');
        }else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.spdAllData.set(result.data);
          }
        }
      });
    }else {
      swal('Please select month!');
      instance.singleMonth.set();
    }
  },
  'keyup #txtPaymentAmount': function(e, instance){
    var index = $(e.currentTarget).attr('attrInd');
    var invoiceAmount = $(e.currentTarget).attr('attrInvoiceAmount');
    var paymentAmount = $(e.currentTarget).val();
    if (paymentAmount.match(/^[0-9]*\.?[0-9]*$/)) {} else {
        swal("Oops...", "Enter only digits!", "error");
        throw new Error("Use only digits!");
    }
    var shortPayment = Number(Number(invoiceAmount) - Number(paymentAmount)).toFixed(2);
    $('.clsShortPayment'+index).val(shortPayment);
  },

  'click #btnSubmitForAll': function (e, instance) {
    var dataArr = instance.spdAllData.get();
    var dataLen = dataArr.length;
    var jsonDataArr = [];
    for (var i = 0; i < dataLen; i++) {
      var json = dataArr[i];
      json.paymentMode = $('.clsPaymentAmount'+i).val();
      json.shortPaymentDone = $('.clsShortPayment'+i).val();
      json.dateOfPayment = $('.clsDateOfPayment'+i).val();
      json.remark = $('.clsRemarks'+i).val();
      json.timeStamp = new Date();
      jsonDataArr.push(json);
    }
    swal({
        title: "Are you sure?",
        text: "You want to submit!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#55dd6b",
        confirmButtonText: "Yes, submit it!",
        closeOnConfirm: false
    }, function(isConfirm) {
        if (isConfirm) {
          SessionStore.set("isLoading", true);
          Meteor.call("submitSPDInvoiceLogFilterDataToLogBook", jsonDataArr, function(error, result) {
              if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Oops...", "Please try again!", "error");
              } else {
                  if (result.status) {
                      SessionStore.set("isLoading", false);
                      swal("Submitted!", "Data Successfully Submitted.", "success");
                      instance.spdAllData.set();
                      instance.financialYearSelected.set();
                      $('#ddlFinancialYear').val('');
                      $('#ddlMonth').val('');
                  }
              }
          });
        } else {

        }
    });
  },
});

Template.spdLogFilter.helpers({
  monthShow() {
      return monthReturn();
  },
  yearShow() {
      return dynamicYear();
  },
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  serial(index){
    return index+1;
  },
  returnSPDStateList(){
    if (Template.instance().spdStateList.get()) {
      return Template.instance().spdStateList.get();
    }else {
      return false;
    }
  },
  isSPDArrListAvailable(){
    if (Template.instance().spdArrList.get()) {
      return true;
    }else {
      return false;
    }
  },
  returnSPDArrList(){
    if (Template.instance().spdArrList.get()) {
      return Template.instance().spdArrList.get();
    }else {
      return false;
    }
  },
  isStateAndSPDbothAreSelected(){
    if (Template.instance().isStateAndSPDselected.get()) {
      return true;
    }else {
      return false;
    }
  },
  isFinancialYearSelected(){
    if (Template.instance().filterTypeSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  isMonthlySelected(){
    if (Template.instance().financialYearSelected.get() == 'Month') {
      return true;
    }else {
      return false;
    }
  },
  isDataAvailable(){
    if (Template.instance().spdAllData.get()) {
      return true;
    }else {
      return false;
    }
  },
  returnSPDTable(){
    if (Template.instance().spdAllData.get()) {
      return Template.instance().spdAllData.get();
    }else {
      return false;
    }
  },
  breakData1(invoiceNum) {
    return invoiceNum.substring(0,20);
  },
  breakData2(invoiceNum) {
    return invoiceNum.substring(20,40);
  },
  breakData3(invoiceNum) {
    return invoiceNum.substring(40,60);
  },
  breakData4(invoiceNum) {
    return invoiceNum.substring(60,80);
  },
  "returnSchemes": function() {
    var data = Schemes.find().fetch();
    return data;
  },

});

import { ReactiveVar } from 'meteor/reactive-var';

Template.spdLogFilterReporting.onCreated(function spdLogFilterReporting() {
    this.spdStateList =  new ReactiveVar;
    this.spdArrList =  new ReactiveVar;
    this.isStateAndSPDselected =  new ReactiveVar;
    this.filterTypeSelected =  new ReactiveVar;
    this.financialYearSelected =  new ReactiveVar;
    this.paymentDateSelected =  new ReactiveVar;
    this.spdAllData =  new ReactiveVar;
});

Template.spdLogFilterReporting.rendered = function () {
  SessionStore.set("isLoading", false);
  var instance = Template.instance();
  SessionStore.set("isLoading", true);
  Meteor.call('gettingSPDStateListForLogFilter', function(error, result) {
    if (error) {
      SessionStore.set("isLoading", false);
      swal('Please try again!');
    }else {
      if (result.status) {
        SessionStore.set("isLoading", false);
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

Template.spdLogFilterReporting.events({
  "focus #txtFromDate": function() {
      $('#txtFromDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  "focus #txtToDate": function() {
      $('#txtToDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
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
      SessionStore.set("isLoading", true);
      Meteor.call('gettingFilteredSPDSList',stateArr,scheme, function(error, result) {
        if (error) {
          SessionStore.set("isLoading", false);
          swal('Please try again!');
        }else {
          if (result.status) {
            SessionStore.set("isLoading", false);
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
    $('#ddlFinancialYear').val('');
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
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
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
    var type = $(e.currentTarget).val();
    if (type == 'Financial Year' || type == 'Month') {
      instance.filterTypeSelected.set(type);
      instance.financialYearSelected.set();
      instance.paymentDateSelected.set();
    }else if(type == 'Payment Date'){
      instance.financialYearSelected.set();
      instance.paymentDateSelected.set(type);
      instance.filterTypeSelected.set();
    }else {
      instance.financialYearSelected.set();
      instance.paymentDateSelected.set();
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
      }else if(type == 'Financial Year'){
        var monthArr = ['04','05','06','07','08','09','10','11','12','01','02','03'];
        var json = {monthArr:monthArr, financialYear:financialYear, type:type, stateArr:stateArr, spdListArr:spdListArr};
        SessionStore.set("isLoading", true);
        Meteor.call('getingspdLogFilterReportingData',json, function(error, result) {
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
      var json = {monthArr:monthArr, financialYear:financialYear, type:type, stateArr:stateArr, spdListArr:spdListArr};
      SessionStore.set("isLoading", true);
      Meteor.call('getingspdLogFilterReportingData',json, function(error, result) {
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
  'change #txtFromDate': function(e, instance) {
    var fromDate = $(e.currentTarget).val();
    $('#txtToDate').val('');
  },
  'change #txtToDate': function(e, instance) {
    var toDate = $(e.currentTarget).val();
    var fromDate = $('#txtFromDate').val();
    var type = $('#ddlFilterType').val();
    var stateArr = $('#ddlSPDState').val();
    var spdListArr = $('#ddlSPDList').val();
    if (type != '' && fromDate != '') {
      var timeDifferenceInDays = getDateDifferenceFromTwoDates(fromDate, toDate);
      if (timeDifferenceInDays >= 0) {
        var json = {fromDate:fromDate, toDate:toDate, type:type, stateArr:stateArr, spdListArr:spdListArr};
        SessionStore.set("isLoading", true);
        Meteor.call('getingspdLogFilterReportingData',json, function(error, result) {
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
        swal('To date must be greater than or equal to from date!');
      }
    }else {
      swal('From date is required!');
    }
  }
});

Template.spdLogFilterReporting.helpers({
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
    var type = Template.instance().filterTypeSelected.get();
    if (type == 'Financial Year' || type == 'Month') {
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
  isPaymentDateSelected(){
    if (Template.instance().paymentDateSelected.get() == 'Payment Date') {
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

getDateDifferenceFromTwoDates = function(fromDate, toDate) {
  fromDate = fromDate.split('-');
  toDate = toDate.split('-');
  fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
  toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
  date1_unixtime = parseInt(fromDate.getTime() / 1000);
  date2_unixtime = parseInt(toDate.getTime() / 1000);
  var timeDifference = date2_unixtime - date1_unixtime;
  var timeDifferenceInHours = timeDifference / 60 / 60;
  var timeDifferenceInDays = timeDifferenceInHours / 24;
  return Number(timeDifferenceInDays);
}

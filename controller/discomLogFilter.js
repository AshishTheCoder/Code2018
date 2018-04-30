import { ReactiveVar } from 'meteor/reactive-var';

Template.discomLogFilter.onCreated(function discomLogFilter() {
    this.invoiceTypeSelected =  new ReactiveVar;
    this.filterTypeSelected =  new ReactiveVar;
    this.financialYear =  new ReactiveVar;
    this.singleFY =  new ReactiveVar;
    this.singleMonth =  new ReactiveVar;
    this.discomSelected =  new ReactiveVar;
    this.viewTable =  new ReactiveVar;
});

Template.discomLogFilter.rendered = function () {
  SessionStore.set("isLoading", false);
  Meteor.setTimeout(function () {
    $('#ddlInvoiceType').multiselect({
       buttonWidth: '360px',
       includeSelectAllOption: true,
   });
  },1000);
};

Template.discomLogFilter.events({
  "focus #txtFromDate": function() {
      $('#txtFromDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  "focus #txtToDate": function() {
      $('#txtToDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  "focus .txtFromClass": function() {
      $('.txtFromClass').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  'change #ddlInvoiceType': function (e, instance) {
    var invoiceArr = $(e.currentTarget).val();
    if (invoiceArr != null) {
      instance.invoiceTypeSelected.set(true);
    }else {
      instance.viewTable.get();
      swal('Please select invoice type!');
      instance.invoiceTypeSelected.set();
    }
  },
//'---------------------------------------111';
  'change #ddlFilterType': function (e, instance) {
    var type = $(e.currentTarget).val();
    if (type == 'Payment Received') {
      instance.filterTypeSelected.set(type);
      Meteor.setTimeout(function () {
          $('#ddlDiscomList').multiselect({
             buttonWidth: '360px',
             includeSelectAllOption: true,
         });
      },1000);
      Meteor.call('getDiscomList', function(error, result) {
        if (error) {
          swal('Please try again!');
        }else {
          if (result.status) {
            instance.discomSelected.set(result.data);
          }
        }
      });
    }else if (type == '') {
      instance.filterTypeSelected.set();
    }else {
      instance.filterTypeSelected.set(type);
      // Meteor.setTimeout(function () {
      //     $('#ddlFinancialYear').multiselect({
      //        buttonWidth: '360px',
      //        includeSelectAllOption: true,
      //    });
      // },1000);
    }
  },
//'---------------------------------------222';
  'change #ddlFinancialYear': function (e, instance) {
    Meteor.setTimeout(function () {
      $('#ddlDiscomList').multiselect({
         buttonWidth: '360px',
         includeSelectAllOption: true,
     });
    },1000);
    var financialYearArr = $(e.currentTarget).val();
    if (financialYearArr != '') {
      Meteor.call('getDiscomList', function(error, result) {
        if (error) {
          swal('Please try again!');
        }else {
          if (result.status) {
            instance.discomSelected.set(result.data);
          }
        }
      });
    }else {
      swal('Please select invoice type!');
      instance.discomSelected.set();
    }
  },
  'change #ddlFinancialYearSingle': function (e, instance) {
    var fyear = $(e.currentTarget).val();
    if (fyear != '') {
      instance.singleFY.set(true);
      Meteor.setTimeout(function () {
        $('#ddlMonth').multiselect({
           buttonWidth: '360px',
           includeSelectAllOption: true,
       });
      },1000);
    }else {
      swal('Please select invoice type!');
      instance.singleFY.set();
    }
  },
  'change #ddlMonth': function (e, instance) {
    var fyear = $(e.currentTarget).val();
    if (fyear != null) {
      instance.singleMonth.set(true);
      Meteor.setTimeout(function () {
        $('#ddlDiscomList').multiselect({
           buttonWidth: '360px',
           includeSelectAllOption: true,
       });
      },1000);
     Meteor.call('getDiscomList', function(error, result) {
       if (error) {
         swal('Please try again!');
       }else {
         if (result.status) {
           instance.discomSelected.set(result.data);
         }
       }
     });
    }else {
      swal('Please select invoice type!');
      instance.singleMonth.set();
    }
  },
  'change #ddlDiscomList': function (e, instance) {
    var discomArr = $(e.currentTarget).val();
    var checkArr = [];
    if (discomArr !=  null) {
      var invoiceTypeArr = $('#ddlInvoiceType').val();
      var filterTypeArr = $('#ddlFilterType').val();
      if (invoiceTypeArr != null) {
        if (filterTypeArr == 'Financial Year') {
          var fyArr = $('#ddlFinancialYear').val();
          if (fyArr != '') {
            var monthArr = ['04','05','06','07','08','09','10','11','12','01','02','03'];
            var json = {typeOfInvoiceArr:invoiceTypeArr,filterType:filterTypeArr, financialYear:fyArr, monthArr:monthArr, discomArr:discomArr};
            checkArr.push('Financial Year');
          }
        }else if (filterTypeArr == 'Month') {
          var singleFyArr = $('#ddlFinancialYearSingle').val();
          var monthArr = $('#ddlMonth').val();
          if (singleFyArr != '' && monthArr != null) {
            var json = {typeOfInvoiceArr:invoiceTypeArr,filterType:filterTypeArr, financialYear:singleFyArr,monthArr:monthArr, discomArr:discomArr};
            checkArr.push('Month');
          }
        }
        // else if (filterTypeArr == 'Payment Received') {
        //   var fromDate = $('#txtFromDate').val();
        //   var toDate = $('#txtToDate').val();
        //   if (fromDate != '' &&  toDate != '') {
        //   var json = {typeOfInvoiceArr:invoiceTypeArr,filterType:filterTypeArr, fromDate:fromDate,toDate:toDate, discomArr:discomArr};
        //   checkArr.push('Payment Received');
        //   }
        // }
        if (checkArr.length > 0) {
          SessionStore.set("isLoading", true);
          Meteor.call('gettingAllInvoiceData',json, function(error, result) {
            if (error) {
              SessionStore.set("isLoading", false);
              swal('Please try again!');
            }else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                console.log(result.data);
                instance.viewTable.set(result.data);
                // instance.discomSelected.set(result.data);
              }
            }
          });
        }else {
          swal('All fields are required!');
        }
      }else {
        swla('Please select invoice type!');
      }
    }else {
      swal('Please select discom state!');
      instance.viewTable.set();
    }
  },


  'click #btnSubmitForAll': function (e, instance) {
    var invoiceType = 'Energy Invoice';
    var dataArr = instance.viewTable.get();
    var dataLen = dataArr.length;
    var jsonDataArr = [];
    for (var i = 0; i < dataLen; i++) {
      var json = dataArr[i].data;
      json.payment_amount = $('.clsPaymentAmount'+i).val();
      json.short_payment = $('.clsShortPayment'+i).val();
      json.date_of_payment = $('.clsDateOfPayment'+i).val();
      json.sir_charge_amount = $('.clsSurChargeAmount'+i).val();
      json.remarks = $('.clsRemarks'+i).val();
      jsonDataArr.push(json);
    }

    swal({
        title: "Are you sure?",
        text: "You want to submit!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#55dd6b",
        confirmButtonText: "Yes, submit it!",
        closeOnConfirm: true
    }, function(isConfirm) {
        if (isConfirm) {
          SessionStore.set("isLoading", true);
          Meteor.call("submitInvoiceLogFilterData", jsonDataArr, invoiceType, function(error, result) {
              if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Oops...", "Please try again!", "error");
              } else {
                  if (result.status) {
                      SessionStore.set("isLoading", false);
                      swal("Submitted!", "Data Successfully Submitted.", "success");
                      instance.invoiceTypeSelected.set();
                      instance.filterTypeSelected.set();
                      instance.discomSelected.set();
                      instance.singleMonth.set();
                      instance.viewTable.set()
                  }
              }
          });
        } else {

        }
    });
  },
  'keyup #txtPaymentAmount': function(e, instance){
    var index = $(e.currentTarget).attr('attrInd');
    var invoiceAmount = $(e.currentTarget).attr('attrInvoiceAmount');
    var paymentAmount = $(e.currentTarget).val();
    // instance.spdIndex.set(index);
    if (paymentAmount.match(/^[0-9]*\.?[0-9]*$/)) {} else {
        swal("Oops...", "Enter only digits!", "error");
        throw new Error("Use only digits!");
    }
    var shortPayment = Number(Number(invoiceAmount) - Number(paymentAmount)).toFixed(2);
    $('.clsShortPayment'+index).val(shortPayment);
  },
  "change #txtDateOfPayment": function(e, instance) {
      if ($(e.currentTarget).val()) {
          var payment = $(e.currentTarget).val();
          var index = $(e.currentTarget).attr('attrInd');
          var dueDateNew = $(e.currentTarget).attr('attrDueDate');
          var dueValue = dueDateNew.split('-');
          dueValueSplit = dueValue[2] + '/' + dueValue[1] + '/' + dueValue[0];
          dueValueSplit = moment(dueValueSplit, 'YYYY-MM-DD');
          var paymentValue = payment.split('-');
          paymentValueSplit = paymentValue[2] + '/' + paymentValue[1] + '/' + paymentValue[0];
          paymentValueSplit = moment(paymentValueSplit, 'YYYY-MM-DD');
          var daysDifference = Number(dueValueSplit.diff(paymentValueSplit, 'days')) + 30;
          if (daysDifference < 0) {
              var amountRecieved = $('.clsPaymentAmount'+index).attr('attrInvoiceAmount');
              var difference = Math.abs(daysDifference);
              var multiply = Number(amountRecieved) * 0.0125 * 12 * Number(difference);
              var sirCharge = Number(Number(multiply) / Number(365)).toFixed(2);
              $('.clsSurChargeAmount'+index).val(sirCharge);
          } else {
            $('.clsSurChargeAmount'+index).val(0);
          }
      }
  }
});

Template.discomLogFilter.helpers({
  monthShow() {
      return monthReturn();
  },
  yearShow() {
      return dynamicYear();
  },
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  ifInvoiceTypeSelected(){
    if (Template.instance().invoiceTypeSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  discomListArr(){
    if (Template.instance().discomSelected.get()) {
      return Template.instance().discomSelected.get();
    }else {
      return false;
    }
  },
  isFilterTypeSelected(){
    if (Template.instance().filterTypeSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  isFilterTypeFYSelected(){
    if (Template.instance().filterTypeSelected.get() == 'Financial Year') {
      return true;
    }else {
      return false;
    }
  },
  isFilterTypeMonth(){
    if (Template.instance().filterTypeSelected.get() == 'Month') {
      return true;
    }else {
      return false;
    }
  },
  isFilterTypePaymentReceived(){
    if (Template.instance().filterTypeSelected.get() == 'Payment Received') {
      return true;
    }else {
      return false;
    }
  },
  isSingleFYSelected(){
    if (Template.instance().singleFY.get()) {
      return true;
    }else {
      return false;
    }
  },
  isDisomSeletcted(){
    if (Template.instance().discomSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  isFYandMonthSeletcted(){
    if (Template.instance().singleMonth.get()) {
      return true;
    }else {
      return false;
    }
  },
  isDataAvailable(){
    if (Template.instance().viewTable.get()) {
      return true;
    }else {
      return false;
    }
  },
  returnDiscomTable(){
    if (Template.instance().viewTable.get()) {
      return Template.instance().viewTable.get();
    }else {
      return false;
    }
  },
  serial(index){
    return index+1;
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
  isProvisional(type){
    if (type == 'Provisional_Invoice') {
      return 'Provisional';
    }else {
      return type;
    }
  }
});

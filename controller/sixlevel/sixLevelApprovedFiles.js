import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.sixLevelApprovedFiles.onCreated(function sixLevelApprovedFiles() {
    this.radioBtnValue = new ReactiveVar;
    this.filterType = new ReactiveVar();
    this.fYSelected = new ReactiveVar();
    this.fYForMonthlySelected = new ReactiveVar();
    this.isMonthSelected = new ReactiveVar();
    this.schemeSelected = new ReactiveVar();
    this.datesAreSelected = new ReactiveVar();
    this.schemesDetails = new ReactiveVar();
    this.spdListArr = new ReactiveVar();
    this.paymentNoteData = new ReactiveVar();
    this.paymentNoteType = new ReactiveVar();

});
Template.sixLevelApprovedFiles.rendered = function() {
  SessionStore.set("isLoading", false);

};
Template.sixLevelApprovedFiles.events({
  "focus #txtFromDate": function() {
      $('#txtFromDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  "focus #txtToDate": function() {
      $('#txtToDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  'click #radioBtnForType': function(e, instance) {
    var selectedValue = $(e.currentTarget).val();
    instance.filterType.set();
    instance.fYSelected.set();
    instance.schemeSelected.set();
    instance.fYForMonthlySelected.set();
    instance.datesAreSelected.set();
    instance.schemesDetails.set();
    instance.spdListArr.set();
    instance.isMonthSelected.set();
    instance.paymentNoteData.set();
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
    if (selectedValue) {
      instance.radioBtnValue.set(selectedValue);
    }
  },
  'change #ddlFilterType': function(e, instance) {
    var filterType = $(e.currentTarget).val();
    instance.schemeSelected.set();
    instance.fYSelected.set();
    instance.fYForMonthlySelected.set();
    instance.datesAreSelected.set();
    instance.schemesDetails.set();
    instance.spdListArr.set();
    instance.isMonthSelected.set();
    instance.paymentNoteData.set();
    $('#txtFromDate').val('');
    $('#txtToDate').val('');
    if (filterType) {
      instance.filterType.set(filterType);
      Meteor.setTimeout(function () {
        $('#ddlFinancialYear').multiselect({
           buttonWidth: '370px',
           includeSelectAllOption: true,
       });
      },1000);
    }else {
      instance.filterType.set();
    }
  },
  'change #ddlFinancialYear': function(e, instance) {
    var financialYear = $(e.currentTarget).val();
    var filterType = $('#ddlFilterType').val();
    instance.schemeSelected.set();
    instance.fYSelected.set();
    instance.schemesDetails.set();
    instance.spdListArr.set();
    instance.isMonthSelected.set();
    instance.fYForMonthlySelected.set();
    instance.paymentNoteData.set();
    if (financialYear != null && filterType == 'month') {
      instance.fYForMonthlySelected.set(true);
      Meteor.setTimeout(function () {
        $('#ddlMonth').multiselect({
           buttonWidth: '370px',
           includeSelectAllOption: true,
       });
      },1000);
    }else if (financialYear != null) {
      SessionStore.set("isLoading", true);
      Meteor.call('gettingSchemeForUtility', function(error, result) {
        if (error) {
          SessionStore.set("isLoading", false);
          swal('Please try again!');
        }else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.schemesDetails.set(result.data);
          }
        }
      });
      instance.fYSelected.set(true);
      Meteor.setTimeout(function () {
        $('#ddlScheme').multiselect({
           buttonWidth: '370px',
           includeSelectAllOption: true,
       });
      },1000);
    }
  },
  'change #ddlMonth': function(e, instance){
    instance.paymentNoteData.set();
    var month = $(e.currentTarget).val();
    if (month) {
      SessionStore.set("isLoading", true);
      Meteor.call('gettingSchemeForUtility', function(error, result) {
        if (error) {
          SessionStore.set("isLoading", false);
          swal('Please try again!');
        }else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.schemesDetails.set(result.data);
          }
        }
      });
      instance.isMonthSelected.set(true);
      Meteor.setTimeout(function () {
        $('#ddlScheme').multiselect({
           buttonWidth: '370px',
           includeSelectAllOption: true,
       });
      },1000);
    }
  },
  'change #txtFromDate': function(e, instance) {
    instance.datesAreSelected.set();
    instance.paymentNoteData.set();
    $('#txtToDate').val('');
    var fromDate = $(e.currentTarget).val();
  },
  'change #txtToDate': function(e, instance) {
    instance.paymentNoteData.set();
    var toDate = $(e.currentTarget).val();
    var fromDate = $('#txtFromDate').val();
    if (fromDate != '') {
      if (toDate != '') {
        var timeDifferenceInDays = getDateDifferenceFromTwoDates(fromDate, toDate);
        if (timeDifferenceInDays >= 0) {
          instance.datesAreSelected.set(true);
          Meteor.setTimeout(function () {
            $('#ddlScheme').multiselect({
               buttonWidth: '370px',
               includeSelectAllOption: true,
           });
          },1000);
          SessionStore.set("isLoading", true);
          Meteor.call('gettingSchemeForUtility', function(error, result) {
            if (error) {
              SessionStore.set("isLoading", false);
              swal('Please try again!');
            }else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                instance.schemesDetails.set(result.data);
              }
            }
          });
        }else {
          instance.datesAreSelected.set();
          swal('To date must be greater than or equal to from date!');
        }
      }
    }else {
      instance.datesAreSelected.set();
      swal('From date is required!');
    }
  },
  'change #ddlScheme': function(e, instance) {
    instance.schemeSelected.set(false);
    instance.spdListArr.set();
    instance.paymentNoteData.set();
    var schemeVar = $(e.currentTarget).val();
    if (schemeVar) {
      SessionStore.set("isLoading", true);
      Meteor.call('gettingSPDonTheBasisOfScheme',schemeVar, function(error, result) {
        if (error) {
          SessionStore.set("isLoading", false);
          swal('Please try again!');
        }else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.schemeSelected.set(true);
            instance.spdListArr.set(result.data);
            Meteor.setTimeout(function () {
              $('#ddlSPDList').multiselect({
                 buttonWidth: '370px',
                 includeSelectAllOption: true,
             });
            },1000);
          }
        }
      });

    }else {
      instance.schemeSelected.set();
      instance.spdListArr.set();
    }
  },
  'change #ddlSPDList': function(e, instance) {
    var financialYearArr = $('#ddlFinancialYear').val();
    var filterType = $('#ddlFilterType').val();
    var schemeArr = $('#ddlScheme').val();
    var spdListArr = $(e.currentTarget).val();
    if (spdListArr != null) {
      if (filterType == 'financialYear') {
        var monthArr = ['04','05','06','07','08','09','10','11','12','01','02','03'];
        var json = {filterType:filterType, financialYearArr:financialYearArr, monthArr:monthArr, schemeArr:schemeArr, spdListArr:spdListArr};
      }else if (filterType == 'month') {
        var monthArr = $('#ddlMonth').val();
        var json = {filterType:filterType, financialYearArr:financialYearArr, monthArr:monthArr, schemeArr:schemeArr, spdListArr:spdListArr};
      }else if (filterType == 'dueDate' || filterType == 'dateOfPayment') {
        var fromDate = $('#txtFromDate').val();
        var toDate = $('#txtToDate').val();
        var json = {filterType:filterType,schemeArr:schemeArr, fromDate:fromDate, toDate : toDate, spdListArr:spdListArr};
      }
      SessionStore.set("isLoading", true);
      Meteor.call('gettingApprovedPaymentNote',json, function(error, result) {
        if (error) {
          SessionStore.set("isLoading", false);
          swal('Please try again!');
        }else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.paymentNoteData.set(result.data);
          }
        }
      });
    }
  },
// --------------------------------------------------------------------------------------------------------------------------//
  'change #ddlPaymentNoteType': function(e, instance) {
    instance.paymentNoteType.set();
    instance.paymentNoteData.set();
    var data = $(e.currentTarget).val();
    if (data != '') {
      instance.paymentNoteType.set(data);
    }
  },
  'change #ddlStateForRLDC': function(e, instance) {
    instance.paymentNoteData.set();
    var rldc = $(e.currentTarget).val();
    var filterType = $('#ddlFilterType').val();
    var financialYearArr = $('#ddlFinancialYear').val();
    var paymentNoteType = $('#ddlPaymentNoteType').val();
    if (rldc) {
      instance.paymentNoteType.set(paymentNoteType);
      if (filterType == 'financialYear') {
        var monthArr = ['04','05','06','07','08','09','10','11','12','01','02','03'];
        var json = {filterType:filterType, financialYearArr:financialYearArr, monthArr:monthArr, paymentNoteType:paymentNoteType, stateForRLDC:rldc};
      }else if (filterType == 'month') {
        var monthArr = $('#ddlMonth').val();
        var json = {filterType:filterType, financialYearArr:financialYearArr, monthArr:monthArr, paymentNoteType:paymentNoteType, stateForRLDC:rldc};
      }
      SessionStore.set("isLoading", true);
      Meteor.call('gettingApprovedSLDCAndRLDCPaymentNote',json, function(error, result) {
        if (error) {
          SessionStore.set("isLoading", false);
          swal('Please try again!');
        }else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.paymentNoteData.set(result.data);
          }
        }
      });
    }
  },
  'click #viewInvoicePdf': function(e, instance){
    var filePath = $(e.currentTarget).attr("filePath");
    window.open('/upload/'+filePath);
  },
});

Template.sixLevelApprovedFiles.helpers({
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
  "paymentMadeToSPD": function() {
    if (Template.instance().radioBtnValue.get() == 'paymentMadeToSPD') {
      return true;
    }else {
      return false;
    }
  },
  "paymentMadeToSLDCRLDC": function() {
    if (Template.instance().radioBtnValue.get() == 'paymentMadeToSLDCRLDC') {
      return true;
    }else {
      return false;
    }
  },
  "financialYearSelected": function() {
    if (Template.instance().filterType.get() == 'financialYear') {
      return true;
    }else {
      return false;
    }
  },
  "monthFilterSelected": function() {
    if (Template.instance().filterType.get() == 'month') {
      return true;
    }else {
      return false;
    }
  },
  "dueDateSelected": function() {
    var type = Template.instance().filterType.get();
    if (type == 'dueDate' || type == 'dateOfPayment') {
      return true;
    }else {
      return false;
    }
  },
  "isFySelected": function() {
    if (Template.instance().fYSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  "isFyForMonthSelected": function() {
    if (Template.instance().fYForMonthlySelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  "isMonthSelected": function() {
    if (Template.instance().isMonthSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  "isSchemeSelected": function() {
    if (Template.instance().schemeSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  "datesAreSelected": function() {
    if (Template.instance().datesAreSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  "returnSchemes": function() {
    if (Template.instance().schemesDetails.get()) {
      return Template.instance().schemesDetails.get();
    }else {
      return false;
    }
  },
  "returnSPDlist": function() {
    if (Template.instance().spdListArr.get()) {
      return Template.instance().spdListArr.get();
    }else {
      return false;
    }
  },
  isDataReceived(){
    if (Template.instance().paymentNoteData.get()) {
      return true;
    }else {
      return false;
    }
  },
  returnDataToUI(){
    if (Template.instance().paymentNoteData.get()) {
      return Template.instance().paymentNoteData.get();
    }else {
      return false;
    }
  },
  isFNYearSelected(){
    if (Template.instance().fYForMonthlySelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  ispaymentNoteTypeSelected(){
    if (Template.instance().paymentNoteType.get()) {
      return true;
    }else {
      return false;
    }
  },
  sldcTypeSelected(){
    if (Template.instance().paymentNoteType.get() == 'SLDC') {
      return true;
    }else {
      return false;
    }
  },
  rldcTypeSelected(){
    if (Template.instance().paymentNoteType.get() == 'RLDC') {
      return true;
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

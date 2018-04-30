Template.logFilterTransmissionInvoice.onCreated( function logFIlter() {
  this.filterTypeVar = new ReactiveVar();
  this.discomStateForTC = new ReactiveVar();
  this.getFilteredDataForTC = new ReactiveVar();
  this.spdStateSelected = new ReactiveVar();
  this.discomStateSelected = new ReactiveVar();
  this.checkDataFilter = new ReactiveVar();
  this.SPDStateTypeDiscomSelcted = new ReactiveVar(false);
  this.getTotalData = new ReactiveVar();
});

Template.logFilterTransmissionInvoice.rendered = function () {
  SessionStore.set("isLoading", false);
};

Template.logFilterTransmissionInvoice.events({
  "focus #RaisedFromDate": function() {
      $('#RaisedFromDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  "focus #RaisedToDate": function() {
      $('#RaisedToDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  "focus #DueDateFrom": function() {
      $('#DueDateFrom').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
  "focus #DueDateTo": function() {
      $('#DueDateTo').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },

  "change #ddlFilterType": function(e, instance) {
    var type = $(e.currentTarget).val();
    instance.filterTypeVar.set(type);
    instance.discomStateForTC.set();
    instance.getFilteredDataForTC.set();
    instance.getTotalData.set();
    instance.spdStateSelected.set();
    instance.discomStateSelected.set();
    instance.checkDataFilter.set();
    instance.SPDStateTypeDiscomSelcted.set(false);
    $('#ddlSPDState').val('');
    $('#ddlDiscomState').val('');
    $('#ddlMonthTC').val('');
    $('#ddlFinancialyearTC').val('');
    Meteor.setTimeout(function () {
      $('#ddlSPDState').multiselect({
         buttonWidth: '310px',
         includeSelectAllOption: true,
     });
     $('#ddlMonthTC').multiselect({
        buttonWidth: '310px',
        includeSelectAllOption: true,
    });
     $('#ddlFinancialyearTC').multiselect({
        buttonWidth: '310px',
        includeSelectAllOption: true,
    });
    },1000);
  },
  "change #ddlSPDState": function(e, instance) {
    var state = $(e.currentTarget).val();
    instance.getFilteredDataForTC.set();
    instance.getTotalData.set();
    instance.checkDataFilter.set();
    instance.SPDStateTypeDiscomSelcted.set(false);
    $('#ddlDiscomState').val('');
    $('#ddlMonthTC').val('');
    $('#ddlFinancialyearTC').val('');
    $('#RaisedToDate').val('');
    $('#RaisedFromDate').val('');
    $('#DueDateFrom').val('');
    $('#DueDateTo').val('');
    instance.spdStateSelected.set(state);
    if (state != null) {
      SessionStore.set("isLoading", true);
      Meteor.call("gettingDiscomStateTCLogFilter",state, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try agian!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  instance.discomStateForTC.set(result.data);
                  Meteor.setTimeout(function () {
                    $('#ddlDiscomState').multiselect({
                       buttonWidth: '310px',
                       includeSelectAllOption: true,
                   });
                  },1000);
              }else {
                SessionStore.set("isLoading", false);
                swal(result.message);
              }
          }
      });
    }else {
      instance.discomStateForTC.set();
    }
  },
  "change #ddlDiscomState": function(e, instance) {
    $('#ddlMonthTC').val('');
    $('#ddlFinancialyearTC').val('');
    $('#RaisedToDate').val('');
    $('#RaisedFromDate').val('');
    $('#DueDateFrom').val('');
    $('#DueDateTo').val('');
    instance.checkDataFilter.set(true);
    instance.SPDStateTypeDiscomSelcted.set(true);
    instance.getFilteredDataForTC.set();
    instance.getTotalData.set();
    Meteor.setTimeout(function () {
     $('#ddlMonthTC').multiselect({
        buttonWidth: '310px',
        includeSelectAllOption: true,
    });
     $('#ddlFinancialyearTC').multiselect({
        buttonWidth: '310px',
        includeSelectAllOption: true,
    });
    },1000);
  },
  "change #ddlMonthTC": function(e, instance) {
    $('#ddlFinancialyearTC').val(null);
    instance.getFilteredDataForTC.set();
    instance.getTotalData.set();
  },
  "change #ddlFinancialyearTC": function(e, instance) {
    var financialYear = $(e.currentTarget).val();
    var spdState = $('#ddlSPDState').val();
    var discomState = $('#ddlDiscomState').val();
    var filterType = $('#ddlFilterType').val();
      if (filterType == 'Month') {
        var month = $('#ddlMonthTC').val();
        if (financialYear != null && spdState != null && discomState != null && month != null) {
          var json = {filterType:filterType,spdState:spdState,discomState:discomState,month:month,financialYear:financialYear};
        }else {
          // swal("All fields are required!");
          throw new Error("All fields are required!");
        }
      }
      else if (filterType == 'Year') {
        var year = $('#ddlFinancialyearTC').val();
        if (spdState != null && discomState != null && year != null) {
          var json = {filterType:filterType,spdState:spdState,discomState:discomState,year:year};
        }else {
          // swal("All fields are required!");
          throw new Error("All fields are required!");
        }
      }else if (filterType == 'FinancialYear') {
        if (financialYear != null && spdState != null && discomState != null) {
          var json = {filterType:filterType,spdState:spdState,discomState:discomState,financialYear:financialYear};
        }else {
          // swal("All fields are required!");
          throw new Error("All fields are required!");
        }
      }
      SessionStore.set("isLoading", true);
      Meteor.call("gettingFilteredData",json, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try agian!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.getFilteredDataForTC.set(json.dataArray);
                  instance.getTotalData.set(json.total);
              }else {
                SessionStore.set("isLoading", false);
                swal(result.message);
              }
          }
      });
  },
  "change #RaisedFromDate": function(e, instance) {
      $('#RaisedToDate').val('');
      instance.getFilteredDataForTC.set();
      instance.getTotalData.set();
  },
  "change #RaisedToDate": function(e, instance) {
    var fromDate = $('#RaisedFromDate').val();
    var toDate = $(e.currentTarget).val();
    var spdState = $('#ddlSPDState').val();
    var discomState = $('#ddlDiscomState').val();
        if (spdState != null && discomState != null && fromDate != '') {
          var json = {fromDate:fromDate,toDate:toDate,spdState:spdState,discomState:discomState};
        }else {
          swal("All fields are required!");
          instance.getFilteredDataForTC.set();
          instance.getTotalData.set();
          throw new Error("All fields are required!");
        }
    if (toDate != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("callDiscomReportOfPaymentTC",json, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try again!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.getFilteredDataForTC.set(json.dataArray);
                  instance.getTotalData.set(json.total);
              }else {
                SessionStore.set("isLoading", false);
                instance.getFilteredDataForTC.set();
                instance.getTotalData.set();
                swal(result.message);
              }
          }
      })
    }
  },
  "change #DueDateFrom": function(e, instance) {
      $('#DueDateTo').val('');
      instance.getFilteredDataForTC.set();
      instance.getTotalData.set();
  },
  "change #DueDateTo": function(e, instance) {
    var fromDate = $('#DueDateFrom').val()
    var toDate = $(e.currentTarget).val();
    var spdState = $('#ddlSPDState').val();
    var discomState = $('#ddlDiscomState').val();
    if (spdState != null && discomState != null && fromDate != '') {
      var json = {fromDate:fromDate,toDate:toDate,spdState:spdState,discomState:discomState};
    }else {
      swal("All fields are required!");
      instance.getFilteredDataForTC.set();
      instance.getTotalData.set();
      throw new Error("All fields are required!");
    }
    if (toDate != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("DueDateWiseTCLog",json, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try again!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.getFilteredDataForTC.set(json.dataArray);
                  instance.getTotalData.set(json.total);
              }else {
                SessionStore.set("isLoading", false);
                instance.getFilteredDataForTC.set();
                instance.getTotalData.set();
                swal(result.message);
              }
          }
      });
    }
  },
  "click #exportTransmissionLog": function(e, instance) {
    var excelNameVar = 'transmission_invoice_log';
    tableToExcel('exportToExcelTransmissionLog', 'SHEET1', excelNameVar);
  }
});
Template.logFilterTransmissionInvoice.helpers({
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  isSPDStateTypeDiscomSelcted(){
    if (Template.instance().SPDStateTypeDiscomSelcted.get()) {
      return true;
    }else {
      return false;
    }
  },
  isSPDStateTypeAllSelected(){
    if (Template.instance().spdStateSelected.get() !=  null) {
      return true;
    }else {
      return false;
    }
  },
  isFilterTypeSelected(){
    if (Template.instance().filterTypeVar.get()) {
      return true;
    }else {
      return false;
    }
  },
  filterTypeMonthly(){
    if (Template.instance().filterTypeVar.get() == 'Month' && Template.instance().checkDataFilter.get()) {
      return true;
    }else {
      return false;
    }
  },
  filterTypeYearly(){
    if (Template.instance().filterTypeVar.get() == 'Year') {
      return true;
    }else {
      return false;
    }
  },
  filterTypeFinancialYear(){
    if (Template.instance().filterTypeVar.get() == 'FinancialYear') {
      return true;
    }else {
      return false;
    }
  },
  PaymentRecievedFilterSelected(){
    if (Template.instance().filterTypeVar.get() == 'PaymentRecieved') {
      return true;
    }else {
      return false;
    }
  },
  dueDateFilterSelected(){
    if (Template.instance().filterTypeVar.get() == 'DueDate') {
      return true;
    }else {
      return false;
    }
  },
  discomStateList(){
    if (Template.instance().discomStateForTC.get()) {
      return Template.instance().discomStateForTC.get();
    }else {
      return false;
    }
  },
  returnMonthToUI(){
    return monthReturn();
  },
  yearHelper(){
    return dynamicYear();
  },
  serial(index){
    return index+1;
  },
  isDataFetchedgetData(){
    if (Template.instance().getFilteredDataForTC.get()) {
      return true;
    }else {
      return false;
    }
  },
  getData(){
    if (Template.instance().getFilteredDataForTC.get()) {
      return Template.instance().getFilteredDataForTC.get();
    }else {
      return false;
    }
  },
  fixedTwoDecimal(fixValue){
    return Number(fixValue).toFixed(2);
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
  returnTotal(){
    if (Template.instance().getTotalData.get()) {
      return Template.instance().getTotalData.get();
    }else {
      return false;
    }
  }
});

var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        }
    return function(table, name, data) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = data+ ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

Template.logFilterSLDCInvoice.onCreated( function logFIlter() {
  this.filterTypeVar = new ReactiveVar();
  this.discomStateForSLDC = new ReactiveVar();
  this.getFilteredDataForSLDC = new ReactiveVar();
  this.spdStateSelected = new ReactiveVar(false);
  this.discomStateSelected = new ReactiveVar(false);
  this.getTotalData = new ReactiveVar();
});

Template.logFilterSLDCInvoice.rendered = function () {
  SessionStore.set("isLoading", false);
};

Template.logFilterSLDCInvoice.events({
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
    instance.discomStateForSLDC.set();
    instance.getFilteredDataForSLDC.set();
    instance.getTotalData.set();
    instance.spdStateSelected.set(false);
    instance.discomStateSelected.set(false);
    $('#ddlSPDState').val('');
    $('#ddlDiscomState').val('');
    $('#ddlFinancialyearSLDC').val('');
    $('#RaisedToDate').val('');
    $('#RaisedFromDate').val('');
    $('#DueDateFrom').val('');
    $('#DueDateTo').val('');
    Meteor.setTimeout(function () {
      $('#ddlSPDState').multiselect({
         buttonWidth: '310px',
         includeSelectAllOption: true,
     });
    },1000);
  },
  "change #ddlSPDState": function(e, instance) {
    var state = $(e.currentTarget).val();
    instance.getFilteredDataForSLDC.set();
    instance.getTotalData.set();
    instance.discomStateForSLDC.set();
    instance.spdStateSelected.set(false);
    instance.discomStateSelected.set(false);
    $('#ddlDiscomState').val('');
    $('#ddlFinancialyearSLDC').val('');
    $('#RaisedToDate').val('');
    $('#RaisedFromDate').val('');
    $('#DueDateFrom').val('');
    $('#DueDateTo').val('');
    if (state != null) {
      instance.spdStateSelected.set(true);
      SessionStore.set("isLoading", true);
      Meteor.call("gettingDiscomStateSLDCLogFilter",state, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try agian!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  instance.discomStateForSLDC.set(result.data);
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
      instance.spdStateSelected.set(false);
      instance.discomStateSelected.set(false);
      instance.discomStateForSLDC.set();
    }
  },
  "change #ddlDiscomState": function(e, instance) {
    $('#ddlFinancialyearSLDC').val('');
    $('#RaisedToDate').val('');
    $('#RaisedFromDate').val('');
    $('#DueDateFrom').val('');
    $('#DueDateTo').val('');
    instance.getFilteredDataForSLDC.set();
    instance.getTotalData.set();
    if ($(e.currentTarget).val() != null) {
      instance.discomStateSelected.set(true);
      Meteor.setTimeout(function () {
        $('#ddlFinancialyearSLDC').multiselect({
           buttonWidth: '310px',
           includeSelectAllOption: true,
       });
      },1000);
    }else {
      instance.discomStateSelected.set(false);
    }
  },
  "change #ddlFinancialyearSLDC": function(e, instance) {
    var financialYear = $(e.currentTarget).val();
    var spdState = $('#ddlSPDState').val();
    var discomState = $('#ddlDiscomState').val();
    var filterType = $('#ddlFilterType').val();
      if (filterType == 'Year') {
        var year = $('#ddlFinancialyearSLDC').val();
        if (spdState != null && discomState != null && year != null) {
          var json = {filterType:filterType,spdState:spdState,discomState:discomState,year:year};
        }else {
          swal("All fields are required!");
          instance.getFilteredDataForSLDC.set();
          instance.getTotalData.set();
          throw new Error("All fields are required!");
        }
      }else if (filterType == 'FinancialYear') {
        if (financialYear != null && spdState != null && discomState != null) {
          var json = {filterType:filterType,spdState:spdState,discomState:discomState,financialYear:financialYear};
        }else {
          swal("All fields are required!");
          instance.getFilteredDataForSLDC.set();
          instance.getTotalData.set();
          throw new Error("All fields are required!");
        }
      }
      SessionStore.set("isLoading", true);
      Meteor.call("gettingFilteredDataSLDCInvoice",json, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try agian!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.getFilteredDataForSLDC.set(json.dataArray);
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
      instance.getFilteredDataForSLDC.set();
      instance.getTotalData.set();
  },
  "change #RaisedToDate": function(e, instance) {
    var fromDate = $('#RaisedFromDate').val()
    var toDate = $(e.currentTarget).val();
    var spdState = $('#ddlSPDState').val();
    var discomState = $('#ddlDiscomState').val();
      if (fromDate != '' && spdState != null && discomState != null) {
          var json = {fromDate:fromDate,toDate:toDate,spdState:spdState,discomState:discomState};
      }else {
        swal("All fields are required!");
        instance.getFilteredDataForSLDC.set();
        instance.getTotalData.set();
        throw new Error("All fields are required!");
      }
    if (toDate != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("callDiscomReportOfPaymentSLDC",json, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try again!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.getFilteredDataForSLDC.set(json.dataArray);
                  instance.getTotalData.set(json.total);
              }else {
                SessionStore.set("isLoading", false);
                instance.getFilteredDataForSLDC.set();
                instance.getTotalData.set();
                swal(result.message);
              }
          }
      });
    }
  },
  "change #DueDateFrom": function(e, instance) {
      $('#DueDateTo').val('');
      instance.getFilteredDataForSLDC.set();
      instance.getTotalData.set();
  },
  "change #DueDateTo": function(e, instance) {
    var fromDate = $('#DueDateFrom').val()
    var toDate = $(e.currentTarget).val();
    var spdState = $('#ddlSPDState').val();
    var discomState = $('#ddlDiscomState').val();
      if (fromDate != '' && spdState != null && discomState != null) {
          var json = {fromDate:fromDate,toDate:toDate,spdState:spdState,discomState:discomState};
      }else {
        swal("All fields are required!");
        instance.getFilteredDataForSLDC.set();
        instance.getTotalData.set();
        throw new Error("All fields are required!");
      }
    if (toDate != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("DueDateWiseSLDCLog",json, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try again!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.getFilteredDataForSLDC.set(json.dataArray);
                  instance.getTotalData.set(json.total);
              }else {
                SessionStore.set("isLoading", false);
                instance.getFilteredDataForSLDC.set();
                instance.getTotalData.set();
                swal(result.message);
              }
          }
      });
    }
  },
  "click #exportSLDCLog": function(e, instance) {
    var excelNameVar = 'sldc_invoice_log';
    tableToExcel('exportToExcelSLDCLog', 'SHEET1', excelNameVar);
  }
});
Template.logFilterSLDCInvoice.helpers({
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  yearHelper(){
    return dynamicYear();
  },
  isSPDStateTypeAllSelected(){
    if (Template.instance().spdStateSelected.get()) {
      return true;
    }else{
      return false;
    }
  },
  isfilterTypeSelected(){
    if (Template.instance().filterTypeVar.get()) {
      return true;
    }else {
      return false;
    }
  },
  filterTypeYearly(){
    if (Template.instance().filterTypeVar.get() == 'Year' && Template.instance().spdStateSelected.get() && Template.instance().discomStateSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  filterTypeFinancialYear(){
    if (Template.instance().filterTypeVar.get() == 'FinancialYear' && Template.instance().spdStateSelected.get() && Template.instance().discomStateSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  PaymentRecievedFilterSelected(){
    if (Template.instance().filterTypeVar.get() == 'PaymentRecieved' && Template.instance().spdStateSelected.get() && Template.instance().discomStateSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  dueDateFilterSelected(){
    if (Template.instance().filterTypeVar.get() == 'DueDate' && Template.instance().spdStateSelected.get() && Template.instance().discomStateSelected.get()) {
      return true;
    }else {
      return false;
    }
  },
  discomStateList(){
    if (Template.instance().discomStateForSLDC.get()) {
      return Template.instance().discomStateForSLDC.get();
    }else {
      return false;
    }
  },
  serial(index){
    return index+1;
  },
  isDataFetchedgetData(){
    if (Template.instance().getFilteredDataForSLDC.get()) {
      return true;
    }else {
      return false;
    }
  },
  getData(){
    if (Template.instance().getFilteredDataForSLDC.get()) {
      return Template.instance().getFilteredDataForSLDC.get();
    }else {
      return false;
    }
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

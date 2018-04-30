Template.logFilterIncentiveInvoice.onCreated( function logFIlter() {
  this.filterTypeVar = new ReactiveVar();
  this.isDiscomStateSelected = new ReactiveVar();
  this.gettingDISCOMState = new ReactiveVar();
  this.fetchedDataFromServer = new ReactiveVar();
  this.getTotalData = new ReactiveVar();
});

Template.logFilterIncentiveInvoice.rendered = function () {
  SessionStore.set("isLoading", true);
  var instance = Template.instance();
  Meteor.call("gettingDISCOMStateIC", function(error, result) {
      if (error) {
          SessionStore.set("isLoading", false);
          swal("Please try agian!");
      } else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.gettingDISCOMState.set(result.data);
            Meteor.setTimeout(function () {
              $('#ddlDiscomState').multiselect({
                 buttonWidth: '310px',
                 includeSelectAllOption: true,
             });
            },1000);
          }
      }
  });
};

Template.logFilterIncentiveInvoice.events({
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
  "change #ddlDiscomState": function(e, instance) {
    var discomState = $(e.currentTarget).val();
    $('#ddlFilterType').val('');
    instance.fetchedDataFromServer.set();
    instance.getTotalData.set();
    instance.filterTypeVar.set();
    if (discomState != null) {
      instance.isDiscomStateSelected.set(discomState);
    }else {
      instance.isDiscomStateSelected.set();
    }

  },
  "change #ddlFilterType": function(e, instance) {
    var type = $(e.currentTarget).val();
    instance.fetchedDataFromServer.set();
    instance.getTotalData.set();
    if (type != '') {
      Meteor.setTimeout(function () {
        $('#ddlFinancialyear').multiselect({
           buttonWidth: '310px',
           includeSelectAllOption: true,
       });
      },1000);
      instance.filterTypeVar.set(type);
    }else {
      instance.filterTypeVar.set();
    }
  },
  "change #ddlFinancialyear": function(e, instance) {
    var financialYear = $(e.currentTarget).val();
    var discomState =  $('#ddlDiscomState').val();
    var type =  $('#ddlFilterType').val();
    if (financialYear != null && discomState != null && type != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("gettingFinancialYearWiseReport",financialYear, discomState, type, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try agian!");
          } else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                var json = result.data;
                instance.fetchedDataFromServer.set(json.dataArray);
                instance.getTotalData.set(json.total);
              }else {
                SessionStore.set("isLoading", false);
                swal("Data not found!");
              }
          }
      });
    }else {
      swal('All fields are required!');
    }
  },
  "change #RaisedToDate": function(e, instance) {
    var toDate = $(e.currentTarget).val();
    var fromDate =  $('#RaisedFromDate').val();
    var discomState =  $('#ddlDiscomState').val();
    var type =  $('#ddlFilterType').val();
    if (type != '' && discomState != null && fromDate != '') {
      if (toDate != '') {
        SessionStore.set("isLoading", true);
        Meteor.call("gettingPaymentReceivedWiseReport",fromDate,toDate, discomState, type, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try agian!");
            } else {
                if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.fetchedDataFromServer.set(json.dataArray);
                  instance.getTotalData.set(json.total);
                }
            }
        });
      }
    }else {
      swal('All fields are required!');
    }
  },
  "change #DueDateTo": function(e, instance) {
    var toDate = $(e.currentTarget).val();
    var fromDate =  $('#DueDateFrom').val();
    var discomState =  $('#ddlDiscomState').val();
    var type =  $('#ddlFilterType').val();
    if (type != '' && discomState != null && fromDate != '') {
      if (toDate != '') {
        if (toDate > fromDate) {
          console.log('Correct Date');
        }else {
          swal('To date should be greater than from date!');
        }
        SessionStore.set("isLoading", true);
        Meteor.call("gettingDueDateWiseReport",fromDate,toDate, discomState, type, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try agian!");
            } else {
                if (result.status) {
                  SessionStore.set("isLoading", false);
                  var json = result.data;
                  instance.fetchedDataFromServer.set(json.dataArray);
                  instance.getTotalData.set(json.total);
                }
            }
        });
      }
    }else {
      swal('All fields are required!');
    }
  },
  "click #exportIncentiveLog": function(e, instance) {
    var excelNameVar = 'incentive_invoice_log';
    tableToExcel('exportToExcelIncentiveLog', 'SHEET1', excelNameVar);
  }
});
Template.logFilterIncentiveInvoice.helpers({
  serial(index){
    return index + 1;
  },
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  isDiscomStateSelected(){
    if (Template.instance().isDiscomStateSelected.get()) {
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
    if (Template.instance().gettingDISCOMState.get()) {
      return Template.instance().gettingDISCOMState.get();
    }else {
      return false;
    }
  },
  fetchedDataHelper(){
    if (Template.instance().fetchedDataFromServer.get()) {
      return Template.instance().fetchedDataFromServer.get();
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
  },
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

import {  ReactiveVar } from 'meteor/reactive-var';

Template.SpdActualGenerationReport.onCreated(function ActualGenerationReport() {
    this.isDateSeleected = new ReactiveVar();
    this.generationReport = new ReactiveVar();
});

Template.SpdActualGenerationReport.rendered = function() {
SessionStore.set("isLoading",false);
};

Template.SpdActualGenerationReport.events({
    "focus .txtDate": function() {
        $('.txtDate').datepicker({
            format: 'dd-mm-yyyy',
            endDate: '0d',
            autoclose: true
        });
    },
    'change #txtFromDate': function(e, instance){
      var fromDateVar = $(e.currentTarget).val();
      var toDateVar = $('#txtToDate').val();
      if (fromDateVar != '' &&toDateVar != '') {
        instance.isDateSeleected.set(true);
      }else {
        instance.isDateSeleected.set(false);
        instance.generationReport.set('');
      }
    },
    'change #txtToDate': function(e, instance){
      var toDateVar = $(e.currentTarget).val();
      var fromDateVar = $('#txtFromDate').val();
      if (fromDateVar != '' &&toDateVar != '') {
        instance.isDateSeleected.set(true);
      }else {
        instance.isDateSeleected.set(false);
        instance.generationReport.set('');
      }
    },
    "click #buttonView": function(e, instance) {
        var txtFromDate = $('#txtFromDate').val();
        var txtToDate = $('#txtToDate').val();
        if (txtFromDate != '' && txtToDate != '') {
            fromDate = txtFromDate.split('-');
            toDate = txtToDate.split('-');
            fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
            toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
            date1_unixtime = parseInt(fromDate.getTime() / 1000);
            date2_unixtime = parseInt(toDate.getTime() / 1000);
            var timeDifference = date2_unixtime - date1_unixtime;
            var timeDifferenceInHours = timeDifference / 60 / 60;
            var timeDifferenceInDays = timeDifferenceInHours / 24;
            if (timeDifferenceInDays >= 0) {
                Meteor.call("gettingDailyActualGenerationReport",timeDifferenceInDays,fromDate, function(error, result) {
                    if (error) {
                        swal('Please try again !');
                    } else {
                        if (result.status) {
                            instance.generationReport.set(result.data);
                        }
                    }
                });
            } else {
                instance.generationReport.set('');
                swal('To date should be greater than from date!');
            }
        } else {
            instance.generationReport.set('');
            swal('All fields are required !');
        }
    },
    "click #exportRevisons": function() {
        tableToExcel('actualGenerationExport', 'SHEET1');
    },
});

Template.SpdActualGenerationReport.helpers({
  dateSelected(){
    if (Template.instance().isDateSeleected.get()) {
      return true;
    }else {
      return false;
    }
  },
  generationReport(){
    if (Template.instance().generationReport.get() != '') {
      return Template.instance().generationReport.get();
    }else {
      return false;
    }
  },
  serial(index){
    return index+1;
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
    return function(table, name) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        // var excelname = state+'_' + currentDate + ".xls";
        var excelname = "actualGeneration.xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

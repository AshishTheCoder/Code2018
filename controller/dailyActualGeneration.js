import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.daily_actual_Generation.onCreated(function ss() {
    this.initialValue = new ReactiveVar;
    this.selectedDate = new ReactiveVar;
});

Template.daily_actual_Generation.rendered = function() {
  SessionStore.set("isLoading",false);
    $('.selectDateValue').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true
    })
};
Template.daily_actual_Generation.events({
    "change .selectDateValue": function(e) {
        if ($('.selectDateValue').val()) {
            var instance = Template.instance();
            instance.selectedDate.set($('.selectDateValue').val());
            Meteor.call("callDailyActual", $('.selectDateValue').val(), function(error, result) {
                if (error) {
                    swal("Server error");
                } else {
                    if (result.status) {
                        instance.initialValue.set(result.data);
                    } else {
                        instance.initialValue.set('');
                        swal(result.message);
                    }
                }
            });
        }
    },
    'click #triggerMail': function() {
      $('#triggerMail').hide();
      swal({
              title: "Are you sure?",
              text: "You want to sent Actual generation report!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#55dd6b",
              confirmButtonText: "Yes, sent it!",
              closeOnConfirm: false
          },
          function(isConfirm) {
            if (isConfirm) {
              swal("Sent!", "Email successfully sent", "success");
              Meteor.call("dailyScheduleReportForRajasthan", $('.selectDateValue').val(), function(error, result) {
                  if (error) {
                      $('#triggerMail').show();
                      swal("Oops...", "Please try again", "error");
                  } else {
                      if (result.status) {
                          $('#triggerMail').show();
                          // swal(result.message);
                      }
                  }
              });
            }else {
              $('#triggerMail').show();
            }
          });
    },
    "click #dailyJmrDataExcel": function() {
        var date = $('.selectDateValue').val();
        tableToExcel('dailyJmrData', 'SHEET1',date);
    },
});
Template.daily_actual_Generation.helpers({
    showTable() {
        if (Template.instance().initialValue.get()) {
            return true;
        }
    },
    showAll() {
        if (Template.instance().initialValue.get()) {
            return Template.instance().initialValue.get();
        }
    },
    showDate() {
        if (Template.instance().selectedDate.get()) {
            return Template.instance().selectedDate.get();
        }
    },
    serial(index) {
        return index + 1;
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
    return function(table, name, date) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = 'daily_actual_Generation'+'_' + date + ".xls";
        // var excelname = "actualGeneration.xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

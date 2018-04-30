import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.MP_monthly_revision.onCreated(function abcd() {
    this.monthSelected = new ReactiveVar;
    this.yearSelected = new ReactiveVar;
    this.serverFetched = new ReactiveVar;
})
Template.MP_monthly_revision.rendered = function() {
SessionStore.set("isLoading",false);
};

Template.MP_monthly_revision.events({
    'change #selectMonth' (e, instance) {
        Template.instance().serverFetched.set('');
        Template.instance().monthSelected.set($(e.currentTarget).val());
    },
    'change #selectYear' (e, instance) {
        Template.instance().serverFetched.set('');
        Template.instance().yearSelected.set($(e.currentTarget).val());
    },
    'click #getMPreport' (e, instance) {
        SessionStore.set("isLoading", true);
        Meteor.call('getMpRevisions', instance.monthSelected.get(), instance.yearSelected.get(), function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Oops...", "Please try again", "error");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.serverFetched.set(result.data);
                }
            }
        })
    },
    "click #exportMPRevision": function() {
      var month = $('#selectMonth').val();
      var year = $('#selectYear').val();
      var excelName = 'MP_revision_report_'+month+'_'+year;
        tableToExcel('exportMPDataTable', 'SHEET1',excelName);
    },
    'click #sendMPrevision' (e, instance) {
      var month = $("#selectMonth").find(':selected').attr("monthInWord");
      var year = $('#selectYear').val();
        if (instance.serverFetched.get()) {
          swal({
                  title: "Are you sure?",
                  text: "You want to send MP revision report!",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#55dd6b",
                  confirmButtonText: "Yes, submit it!",
                  closeOnConfirm: false
              },
              function(isConfirm) {
                  if (isConfirm) {
                    Meteor.call('sendMpRevisions', instance.serverFetched.get(),month,year, function(error, result) {
                        if (error) {
                            swal("Oops...", "Please try again", "error");
                        } else {
                            if (result.status) {
                                swal("Send successfully!", "MP revision report successfully send.", "success");
                            }
                        }
                    })
                  } else {
                  }
              });
        } else {
            swal('error no data to send file');
        }
    }
})

Template.MP_monthly_revision.helpers({
    monthShow() {
        return monthReturn();
    },
    yearHelper() {
        return dynamicYear();
    },
    viewTabularTable() {
        if (Template.instance().monthSelected.get()) {
            if (Template.instance().yearSelected.get()) {
                return true;
            }
        }
    },
    selectedMonth() {
        if (Template.instance().monthSelected.get()) {
            var monthVar = Template.instance().monthSelected.get()
            return monthInWords(monthVar);
        }
    },
    selectedYear() {
        if (Template.instance().yearSelected.get()) {
            return Template.instance().yearSelected.get();
        }
    },
    showTabublarData() {
        if (Template.instance().serverFetched.get()) {
            return true;
        }
    },
    returnFetchedValues() {
        if (Template.instance().serverFetched.get()) {
            return Template.instance().serverFetched.get();
        }
    },
    returningDataHelper(array, index, values) {
        if (array) {
            return array[values][index];
        }
    },
    returningColoum(array, index) {
        if (array) {
            return array[index];
        }
    },
})

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
    return function(table, name, excelName) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = excelName + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

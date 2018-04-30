import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.checkRRFdata.onCreated(function ss() {
    this.dateSelected = new ReactiveVar;
    this.fetchedValues = new ReactiveVar;
});

Template.checkRRFdata.rendered = function() {
  SessionStore.set("isLoading",false);
    $('#selectDate').datepicker({
        format: 'dd-mm-yyyy',
        endDate: '+1d',
        autoclose: true
    })
};

Template.checkRRFdata.events({
    'change #selectDate' (e, instance) {
        instance.dateSelected.set($(e.currentTarget).val())
    },
    'click #viewRRF' (e, instance) {
        SessionStore.set("isLoading", true);
        Meteor.call("callCheckRRF", instance.dateSelected.get(), function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Oops...", "Please try again", "error");
            } else {
                if (result.status) {
                    instance.fetchedValues.set(result.data);
                    SessionStore.set("isLoading", false);
                    // console.log(result.data);
                } else {
                    SessionStore.set("isLoading", false);
                    swal(result.message);
                }
            }
        })
    },
    "click #exportMPData": function(e, instance) {
        var date = $('#selectDate').val();
        var revisionNo = instance.fetchedValues.get().revisionNumber;
        var excelName = 'RRF_R'+revisionNo+'_'+date;
        tableToExcel('exportMPDataTable', 'SHEET1',excelName);
    },
    'click #verifyMPrrf' (e, instance) {
        swal({
                title: "Are you sure?",
                text: "You want to approve RRF!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, approve it!",
                closeOnConfirm: false
            },
            function(isConfirm) {
              if (isConfirm) {
                SessionStore.set("isLoading", true);
                Meteor.call("callVerifyRRF", $('#verifyMPrrf').attr('attr'), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.fetchedValues.set('');
                            swal("Approved!", "RRF successfully approved.", "success");
                        } else {
                            SessionStore.set("isLoading", false);
                            swal(result.message);
                        }
                    }
                });
              }else {
                SessionStore.set("isLoading", false);
              }
            });
    },
    'click #rejectMPrrf' (e, instance) {
        var id = $('#rejectMPrrf').attr('attrID');
        var filePath = $('#rejectMPrrf').attr('attrFilePath');
        swal({
                title: "Are you sure?",
                text: "You want to reject RRF!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, reject it!",
                closeOnConfirm: false
            },
            function(isConfirm) {
              if (isConfirm) {
                SessionStore.set("isLoading", true);
                Meteor.call("callRejectRRF", id, filePath, function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.fetchedValues.set('');
                            swal("Rejected!", "RRF successfully rejected.", "success");
                        } else {
                            SessionStore.set("isLoading", false);
                            swal(result.message);
                        }
                    }
                });
              }else {
                SessionStore.set("isLoading", false);
              }
            });
    }
});

Template.checkRRFdata.helpers({
    viewDateSelected() {
        if (Template.instance().dateSelected.get()) {
            return Template.instance().dateSelected.get();
        }
    },
    viewTable() {
        if (Template.instance().dateSelected.get()) {
            return true;
        }
    },
    serial(index) {
        return index + 1;
    },
    blockCount() {
        var array = [];
        for (var i = 0; i < 96; i++) {
            array.push(i);
        }
        return array;
    },
    returnSlots(type, index) {
        var slots = mySlotFunction();
        if (type == "from") {
            return slots[index];
        } else if (type == "to") {
            var ret = Number(index) + 1;
            return slots[ret];
        }
    },
    returnFetchedValues() {
        if (Template.instance().fetchedValues.get()) {
            return Template.instance().fetchedValues.get();
        }
    },
    returningDataHelper(array, index, values) {
        if (Template.instance().fetchedValues.get()) {
            return array[values][index];
        }
    },
    returningColoum(array, index) {
        if (Template.instance().fetchedValues.get()) {
            return array[index];
        }
    },
    showTabublarData() {
        if (Template.instance().fetchedValues.get()) {
            return true;
        }
    },
    colourCheckCha(array, index){
      if (Template.instance().fetchedValues.get()) {
          if (Number(array[index])==0) {
            return "null";
          }else {
            return "yellow";
          }
      }
    },
    colourCheckAll(array, index, values){
      if (Template.instance().fetchedValues.get()) {
          if (Number(array[values][index])==0) {
            return "null";
          }else {
            return "yellow";
          }
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
    return function(table, name,excelName) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = excelName+".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

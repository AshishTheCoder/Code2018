import {ReactiveVar} from 'meteor/reactive-var';

Template.sldc_report.onCreated(function ss() {
    this.dateSelected = new ReactiveVar;
    this.stateSelected = new ReactiveVar;
    this.goaShow = new ReactiveVar;
    this.biharShow = new ReactiveVar;
    this.gujaratShow = new ReactiveVar;
    this.rajasthanShow = new ReactiveVar;
    this.sldcMPreport = new ReactiveVar;
});
Template.sldc_report.rendered = function() {
    SessionStore.set("isLoading", false);
    $('#selectDate').datepicker({format: 'dd-mm-yyyy', endDate: '+1d', autoclose: true});
};

Template.sldc_report.events({
    "change #selectDate": function(e, instance) {
        if ($(e.currentTarget).val()) {
            Template.instance().dateSelected.set($(e.currentTarget).val());
        }
    },
    "change #selectStateDiscom": function(e, instance) {
        if ($(e.currentTarget).val()) {
            instance.stateSelected.set($(e.currentTarget).val());
        }
    },
    "click #viewAllData": function(e, instance) {
        instance.rajasthanShow.set('');
        instance.sldcMPreport.set('');
        instance.goaShow.set('');
        instance.gujaratShow.set('');
        if (instance.stateSelected.get() == "MP") {
            SessionStore.set("isLoading", true);
            Meteor.call("getSldcDataMP", instance.dateSelected.get(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.sldcMPreport.set(result.data);
                        SessionStore.set("isLoading", false);
                        // console.log(result.data);
                    } else {
                        swal(result.message);
                        SessionStore.set("isLoading", false);
                    }
                }
            })
        } else if (instance.stateSelected.get() == "Gujarat") {
            instance.sldcMPreport.set('');
            SessionStore.set("isLoading", true);
            Meteor.call("getSldcDataGujarat", instance.dateSelected.get(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.gujaratShow.set(result.data);
                        SessionStore.set("isLoading", false);
                    } else {
                        swal(result.message);
                        SessionStore.set("isLoading", false);
                    }
                }
            })
        } else if (instance.stateSelected.get() == "Rajasthan") {
            instance.sldcMPreport.set('');
            SessionStore.set("isLoading", true);
            Meteor.call("getSldcDataRajasthan", instance.dateSelected.get(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.rajasthanShow.set(result.data);
                        SessionStore.set("isLoading", false);
                        // console.log(result.data);
                    } else {
                        swal(result.message);
                        SessionStore.set("isLoading", false);
                    }
                }
            })
        }
    },
    'click #shootRajasthanMail': function() {
        swal({
            title: "Are you sure?",
            text: "You want to send Rajasthan SLDC report!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, send it!",
            closeOnConfirm: false
        }, function() {
            swal("Sent!", "Rajasthan SLDC report successfully sent.", "success");
            Meteor.call('sldcReportShootRajasthan', function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        // swal(result.message);
                    }
                }
            });
        });
    },
    'click #shootMPMail': function() {
        swal({
            title: "Are you sure?",
            text: "You want to send MP SLDC report!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, send it!",
            closeOnConfirm: false
        }, function() {
            swal("Sent!", "MP SLDC report successfully sent.", "success");
            Meteor.call('sldcReportShootMPWithAvaibility', function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        // swal(result.message);
                    }
                }
            });
        });

    },
    'click #shootGujaratMail': function() {
        swal({
            title: "Are you sure?",
            text: "You want to send Gujarat SLDC report!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, send it!",
            closeOnConfirm: false
        }, function() {
            swal("Sent!", "Gujarat SLDC report successfully sent.", "success");
            Meteor.call('sldcReportShootGujarat', function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        // swal(result.message);
                    }
                }
            });
        });

    },
    "click #exportMPdata": function() {
        var state = 'MP';
        var currntDate = $('#selectDate').val();
        tableToExcel('exportMPdataTable', 'SHEET1',state,currntDate);
    },
    "click #exportGujaratData": function() {
        var state = 'Gujarat';
        var currntDate = $('#selectDate').val();
        tableToExcel('exportGujaratDataTable', 'SHEET1',state,currntDate);
    },
    "click #exportRajasthanData": function() {
        var state = 'Rajasthan';
        var currntDate = $('#selectDate').val();
        tableToExcel('exportRajasthanDataTable', 'SHEET1',state,currntDate);
    }
});

Template.sldc_report.helpers({
    stateIsMP() {
        if (Template.instance().stateSelected.get() == "MP") {
            if (Template.instance().sldcMPreport.get()) {
                return true;
            }
        }
    },
    stateIsRajasthan() {
        if (Template.instance().stateSelected.get() == "Rajasthan") {
            if (Template.instance().rajasthanShow.get()) {
                return true;
            }
        }
    },
    stateIsGujarat() {
        if (Template.instance().stateSelected.get() == "Gujarat") {
            if (Template.instance().gujaratShow.get()) {
                return true;
            }
        }
    },
    viewDateSelected() {
        if (Template.instance().dateSelected.get()) {
            return Template.instance().dateSelected.get();
        }
    },
    viewTable() {
        if (Template.instance().dateSelected.get()) {
            if (Template.instance().stateSelected.get()) {
                return true;
            }
        }
    },
    viewStateSelected() {
        if (Template.instance().stateSelected.get()) {
            return Template.instance().stateSelected.get();
        }
    },
    returnMPsldc() {
        if (Template.instance().sldcMPreport.get()) {
            return Template.instance().sldcMPreport.get();
        }
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
    returningDataHelper(array, index, values) {
        if (Template.instance().sldcMPreport.get() != '' || Template.instance().gujaratShow.get() != '' || Template.instance().rajasthanShow.get() != '') {
            return array[values][index];
        }
    },
    returningColoum(array, index) {
        if (Template.instance().rajasthanShow.get()) {
            return array[index];
        }
    },
    returningData(array, index, value) {
        if (array) {
            return array[index][value];
        }
    },
    blockCount() {
        var array = [];
        for (var i = 0; i < 96; i++) {
            array.push(i);
        }
        return array;
    },
    returnGujarat() {
        if (Template.instance().gujaratShow.get()) {
            return Template.instance().gujaratShow.get();
        }
    },
    returnRajasthan() {
        if (Template.instance().rajasthanShow.get()) {
            return Template.instance().rajasthanShow.get();
        }
    },
    serial(index) {
        return index + 1;
    },
    generateHref() {
        if (Template.instance().stateSelected.get()) {
            var date = Template.instance().dateSelected.get();
            var state = Template.instance().stateSelected.get()
            return 'upload/sldcReports/' + date + '_' + state + '.xlsx';
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
    return function(table, name, state, currentDate) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = state+ 'SLDC_' + currentDate + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

import {ReactiveVar} from 'meteor/reactive-var';

Template.billingReportSECIL.onCreated(function abcd() {
    this.monthSelected = new ReactiveVar;
    this.yearSelected = new ReactiveVar;
    this.stateSelected = new ReactiveVar;
    this.viewTable = new ReactiveVar;
    this.headValue = new ReactiveVar;
    this.discomStateSelected = new ReactiveVar;
    this.listOfDiscom = new ReactiveVar;
    this.showOrissaDropdown = new ReactiveVar;
    this.showMaharashtraDropdown = new ReactiveVar;
    this.listOrissaDynamic = new ReactiveVar;
    this.specialGujarat = new ReactiveVar;
    this.returnJson = new ReactiveVar;
    this.perStateValue = new ReactiveVar;
    this.afterCalculation = new ReactiveVar;
    this.saveAdjusted = new ReactiveVar;
    this.hrefReport = new ReactiveVar;
});

Template.billingReportSECIL.rendered = function() {
    SessionStore.set("isLoading", false);
};
Template.billingReportSECIL.events({
    "change #selectMonth": function(e, t) {
        Template.instance().monthSelected.set($(e.currentTarget).val());
        Template.instance().viewTable.set(false);
        Template.instance().returnJson.set('');
        Template.instance().yearSelected.set(false);
        $("#selectYear").val('');
    },
    'click #add' (e, instance) {
        if ($('#textValue').val()) {
            var currentREA = instance.returnJson.get().lossTotal;
            var change = $('#textValue').val();
            var newValue = Number(Number(currentREA) + Number(change)).toFixed(7);
            var set = ' + ' + currentREA + ' = ' + newValue;
            var save = {
                sign: 'add',
                change: change
            };
            Template.instance().saveAdjusted.set(save);
            Template.instance().afterCalculation.set(set);
        } else {
            Template.instance().saveAdjusted.get('');
            Template.instance().afterCalculation.get('');
            swal('Enter value to change REA');
        }
    },
    'click #subtract' (e, instance) {
        if ($('#textValue').val()) {
            var currentREA = instance.returnJson.get().lossTotal;
            var change = $('#textValue').val();
            var newValue = Number(Number(currentREA) - Number(change)).toFixed(7);
            var set = ' - ' + currentREA + ' = ' + newValue;
            var save = {
                sign: 'subtract',
                change: change
            };
            Template.instance().saveAdjusted.set(save);
            Template.instance().afterCalculation.set(set);
        } else {
            Template.instance().saveAdjusted.get('');
            Template.instance().afterCalculation.get('');
            swal('Enter value to change REA');
        }
    },
    'click #addGujarat' (e, instance) {
        if ($('#textValueGujarat').val()) {
            var currentREA = instance.returnJson.get().lossTotal;
            var change = $('#textValueGujarat').val();
            var newValue = Number(currentREA) + Number(change);
            var set = ' + ' + currentREA + ' = ' + newValue;
            var save = {
                sign: 'add',
                change: change
            };
            Template.instance().saveAdjusted.set(save);
            Template.instance().afterCalculation.set(set);
        } else {
            Template.instance().saveAdjusted.get('');
            Template.instance().afterCalculation.get('');
            swal('Enter value to change REA');
        }
    },
    'click #subtractGujarat' (e, instance) {
        if ($('#textValueGujarat').val()) {
            var currentREA = instance.returnJson.get().lossTotal;
            var change = $('#textValueGujarat').val();
            var newValue = Number(currentREA) - Number(change);
            var set = ' - ' + currentREA + ' = ' + newValue;
            var save = {
                sign: 'subtract',
                change: change
            };
            Template.instance().saveAdjusted.set(save);
            Template.instance().afterCalculation.set(set);
        } else {
            Template.instance().saveAdjusted.get('');
            Template.instance().afterCalculation.get('');
            swal('Enter value to change REA');
        }
    },
    'click #submitChange' (e, instance) {
        if (Template.instance().saveAdjusted.get()) {
            var spdList = instance.returnJson.get().spdList;
            var month = instance.monthSelected.get();
            var year = instance.yearSelected.get();
            var discomState = instance.returnJson.get().discomState;
            if (spdList[0].state == 'MP') {
                // swal('Under Process');
                Meteor.call("saveAdjustedREA_MP", instance.saveAdjusted.get(), spdList, month, year, discomState, function(error, result) {
                    if (error) {
                        swal("server error")
                    } else {
                        if (result.status) {
                            instance.returnJson.set('');
                            instance.viewTable.set('');
                            instance.afterCalculation.set('');
                            instance.saveAdjusted.set('');
                            $('#closeModal').click();
                            swal(result.message);
                        }
                    }
                });
            } else {
              var discomStateVar = $('#selectStateDiscom').val();
                Meteor.call("saveAdjustedREA", instance.saveAdjusted.get(), spdList, month, year,discomStateVar, function(error, result) {
                    if (error) {
                        swal("server error")
                    } else {
                        if (result.status) {
                            instance.returnJson.set('');
                            instance.viewTable.set('');
                            instance.afterCalculation.set('');
                            instance.saveAdjusted.set('');
                            $('#closeModal').click();
                            swal(result.message);
                        }
                    }
                });
            }
        }
    },
    "change #selectYear": function(e, instance) {
        instance.yearSelected.set($(e.currentTarget).val());
        instance.viewTable.set(false);
    },
    "change #selectStateDiscom": function(e, instance) {
        instance.viewTable.set(false);
        instance.showOrissaDropdown.set(false);
        $('#selectDiscomData').val('');
        instance.discomStateSelected.set($(e.currentTarget).val());
        instance.stateSelected.set($(e.currentTarget).val());
        if ($(e.currentTarget).val()) {
            SessionStore.set("isLoading", true);
            Meteor.call("callDiscomSpdIdsBilling", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("server error")
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        if (result.data.length > 0) {
                            SessionStore.set("isLoading", false);
                            instance.listOfDiscom.set(result.data);
                        } else {
                            SessionStore.set("isLoading", false);
                            instance.listOfDiscom.set('');
                            swal("Discom not available");
                        }
                    }
                }
            });
        }
    },
    "change #selectDiscomData": function(e, instance) {
        var selectedMonthVar = $('#selectMonth').val();
        var selectedYearVar = $('#selectYear').val();
        if (Number(selectedYearVar) == Number(2016) && Number(selectedMonthVar) != Number(12)) {
            swal("In 2016 you can only see the billing report of december month.");
        } else {
            instance.viewTable.set(false);
            if ($(e.currentTarget).val()) {
                if (instance.discomStateSelected.get() == "Odisha") {
                    instance.showOrissaDropdown.set(true);
                } else if (instance.discomStateSelected.get() == "Maharashtra") {
                    instance.showMaharashtraDropdown.set(true);
                } else {
                    var headValue = instance.listOfDiscom.get();
                    var state = headValue[0].state;
                    if (state == "MP") {
                        // instance.headValue.set("WRLDC");
                        instance.headValue.set("WRPC");
                    } else if (state == "Gujarat") {
                        instance.headValue.set("WRPC");
                        // instance.headValue.set("WRLDC");
                    } else if (state == "Rajasthan") {
                        instance.headValue.set("NRPC");
                        // instance.headValue.set("NRLDC");
                    }
                    if (instance.listOfDiscom.get()[0].state == 'MP') {
                        console.log('for MP');
                        SessionStore.set("isLoading", true);
                        Meteor.call("callBillingDiscomMP", instance.listOfDiscom.get(), instance.monthSelected.get(), instance.yearSelected.get(), instance.stateSelected.get(), instance.headValue.get(), function(error, result) {
                            if (error) {
                                SessionStore.set("isLoading", false);
                                swal("server error")
                            } else {
                                if (result.status) {
                                    console.log(result.data);
                                    SessionStore.set("isLoading", false);
                                    instance.returnJson.set(result.data);
                                    instance.viewTable.set(true);
                                    instance.hrefReport.set('');
                                    instance.saveAdjusted.set('');
                                    instance.afterCalculation.set('');
                                } else {
                                    SessionStore.set("isLoading", false);
                                    swal(result.message);
                                }
                            }
                        })
                    } else {
                        console.log('for else');
                        SessionStore.set("isLoading", true);
                        Meteor.call("callBillingDiscom", instance.listOfDiscom.get(), instance.monthSelected.get(), instance.yearSelected.get(), instance.stateSelected.get(), instance.headValue.get(), function(error, result) {
                            if (error) {
                                SessionStore.set("isLoading", false);
                                swal("server error")
                            } else {
                                if (result.status) {
                                    console.log(result.data);
                                    SessionStore.set("isLoading", false);
                                    instance.returnJson.set(result.data);
                                    instance.viewTable.set(true);
                                    instance.hrefReport.set('');
                                    instance.saveAdjusted.set('');
                                    instance.afterCalculation.set('');
                                } else {
                                    SessionStore.set("isLoading", false);
                                    swal(result.message);
                                }
                            }
                        })
                    }
                }
            }

        }
    },
    "change #selectOrissa": function(e, instance) {
        if ($(e.currentTarget).val()) {
            var list = [];
            var aryAll = instance.listOfDiscom.get();
            aryAll.forEach(function(item) {
                if (item.state == $(e.currentTarget).val()) {
                    list.push(item);
                }
            })
            instance.listOrissaDynamic.set(list);

            if ($(e.currentTarget).val() == "Gujarat") {
                instance.specialGujarat.set(true);
                instance.headValue.set("WRPC");
            } else if ($(e.currentTarget).val() == "Rajasthan") {
                instance.specialGujarat.set(false);
                instance.headValue.set("NRLDC");
            }
            SessionStore.set("isLoading", true);
            Meteor.call("callBillingDiscom", list, instance.monthSelected.get(), instance.yearSelected.get(), instance.stateSelected.get(), instance.headValue.get(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("server error")
                } else {
                    if (result.status) {
                        console.log(result.data);
                        SessionStore.set("isLoading", false);
                        instance.returnJson.set(result.data);
                        instance.viewTable.set(true);
                        instance.hrefReport.set('');
                        instance.saveAdjusted.set('');
                        instance.afterCalculation.set('');
                    } else {
                        SessionStore.set("isLoading", false);
                        swal(result.message);
                    }
                }
            })
        }
    },
    "change #selectMaharashtra": function(e, instance) {
        if ($(e.currentTarget).val()) {
            var list = [];
            var aryAll = instance.listOfDiscom.get();
            aryAll.forEach(function(item) {
                if (item.state == $(e.currentTarget).val()) {
                    list.push(item);
                }
            })
            instance.listOrissaDynamic.set(list);

            if ($(e.currentTarget).val() == "MP") {
                instance.specialGujarat.set(false);
                instance.headValue.set("WRPC");
            } else if ($(e.currentTarget).val() == "Rajasthan") {
                instance.specialGujarat.set(false);
                instance.headValue.set("NRPC");
            }
            if (list[0].state == 'MP') {
                console.log('for MP');
                SessionStore.set("isLoading", true);
                Meteor.call("callBillingDiscomMP", list, instance.monthSelected.get(), instance.yearSelected.get(), instance.stateSelected.get(), instance.headValue.get(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("server error")
                    } else {
                        if (result.status) {
                            console.log(result.data);
                            SessionStore.set("isLoading", false);
                            instance.returnJson.set(result.data);
                            instance.viewTable.set(true);
                            instance.hrefReport.set('');
                            instance.saveAdjusted.set('');
                            instance.afterCalculation.set('');
                        } else {
                            SessionStore.set("isLoading", false);
                            swal(result.message);
                        }
                    }
                })
            } else {
                console.log('for else');
                SessionStore.set("isLoading", true);
                Meteor.call("callBillingDiscom", list, instance.monthSelected.get(), instance.yearSelected.get(), instance.stateSelected.get(), instance.headValue.get(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("server error")
                    } else {
                        if (result.status) {
                            console.log(result.data);
                            SessionStore.set("isLoading", false);
                            instance.returnJson.set(result.data);
                            instance.viewTable.set(true);
                            instance.hrefReport.set('');
                            instance.saveAdjusted.set('');
                            instance.afterCalculation.set('');
                        } else {
                            SessionStore.set("isLoading", false);
                            swal(result.message);
                        }
                    }
                })
            }
        }
    },
    "click #discomInterAll": function() {
      var month = $('#selectMonth').val();
      var year = $('#selectYear').val();
      var discomState = $('#selectStateDiscom').val();
      var excelName = discomState+'_Billing_Report_'+month+'_'+year;
        tableToExcel('discomInterAllTable', 'SHEET1',excelName);
    },
    "click #discomOrissa": function() {
      var month = $('#selectMonth').val();
      var year = $('#selectYear').val();
      var discomState = $('#selectStateDiscom').val();
      var state = $('#selectOrissa').val();
      var excelName = discomState+'-'+state+'_Billing_Report_'+month+'_'+year;
        tableToExcel('discomOrissaTable', 'SHEET1',excelName);
    },
    'click #generateReport' (e, instance) {
        instance.hrefReport.set('');
        Meteor.call("billingExcel", instance.returnJson.get(), function(error, result) {
            if (error) {
                swal("server error");
            } else {
                if (result.status) {
                    instance.hrefReport.set(result.data);
                }
            }
        })
    }
});
Template.billingReportSECIL.helpers({
    monthShow() {
        return monthReturn();
    },
    yearHelper() {
        return dynamicYear();
    },
    showHref() {
        if (Template.instance().hrefReport.get()) {
            return Template.instance().hrefReport.get();
        }
    },
    reaUpdated() {
        if (Template.instance().afterCalculation.get()) {
            return Template.instance().afterCalculation.get();
        }
    },
    "viewMonthAndYear": function() {
        return Template.instance().monthSelected.get() + '/' + Template.instance().yearSelected.get();
    },
    "viewStateName": function() {
        return Template.instance().stateSelected.get();
    },
    returningValues() {
        if (Template.instance().returnJson.get()) {
            return Template.instance().returnJson.get();
        }
    },
    isDateOfAdjustAvailable() {
        if (Template.instance().returnJson.get().dateOfAdjust) {
            return true;
        } else {
            return false;
        }
    },
    showOrissaCaseState() {
        if (Template.instance().discomStateSelected.get() == "Odisha") {
            if (Template.instance().showOrissaDropdown.get()) {
                return true;
            }
        }
    },
    showMaharashtraCaseState() {
        if (Template.instance().discomStateSelected.get() == "Maharashtra") {
            if (Template.instance().showMaharashtraDropdown.get()) {
                return true;
            }
        }
    },
    showStuOnly(stu, index) {
        if (index == 8 || index == 16 || index == 25 || index == Template.instance().returnJson.get().monthLength) {
            return ' ';
        } else {
            return stu;
        }
    },
    "viewTabularTable": function() {
        return Template.instance().viewTable.get();
    },
    "showingTotal": function(array, loopBig) {
        if (array) {
            return array[loopBig];
        }
    },
    "viewStateDiscom": function() {
        if (Template.instance().yearSelected.get()) {
            return true;
        } else {
            Template.instance().listOfDiscom.set('');
        }
    },
    "showDiscomlistUsingTransactionType": function() {
        if (Template.instance().listOfDiscom.get()) {
            if (Template.instance().listOfDiscom.get().length > 0) {
                return true;
            }
        }
    },
    "weeklyAllDiscom": function() {
        return Template.instance().listOfDiscom.get();
    },
    "DiscomTransactionTypeHelperInter": function() {
        if (Template.instance().listOfDiscom.get()) {
            return true;
        }
    },
    "isStateOrissa": function() {
        if (Template.instance().discomStateSelected.get() == "Odisha") {
            return true;
        }
    },
    uniqGujarat() {
        return Template.instance().specialGujarat.get();
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
    return function(table, name, excelNameVar) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            }
            // dynamic name in excelname
        var excelname = excelNameVar + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

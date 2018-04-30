import {ReactiveVar} from 'meteor/reactive-var';

Template.rldc_comparision.onCreated(function abcd() {
    this.selectedRldc = new ReactiveVar;
    this.getStates = new ReactiveVar;
    this.setRadio = new ReactiveVar;
    this.showERLDCodisha = new ReactiveVar(false);
    this.showWRLDCmaharashtra = new ReactiveVar(false);
    this.showSpecial = new ReactiveVar(false);
    this.fetchedData = new ReactiveVar;
    this.showTabularData = new ReactiveVar;
    this.allInRldc = new ReactiveVar;
    this.showSelectedLogs = new ReactiveVar;
    this.getAllStates = new ReactiveVar;
    this.specialAll = new ReactiveVar;
    this.specialState = new ReactiveVar;
    this.comparisionVariable = new ReactiveVar;
    this.spdList = new ReactiveVar;
    this.allTransaction = new ReactiveVar;
    this.showAllTransactionData = new ReactiveVar;
});

Template.rldc_comparision.rendered = function() {
    SessionStore.set("isLoading", false);
};
Template.rldc_comparision.events({
    'focus .showDatepicker' () {
        $('.showDatepicker').datepicker({format: 'dd-mm-yyyy', autoclose: true})
    },
    'change #inlineRadio' (e, instance) {
        instance.showWRLDCmaharashtra.set(false);
        instance.showSpecial.set(false);
        instance.showERLDCodisha.set(false);
        instance.fetchedData.set('');
        instance.showSelectedLogs.set('');
        if ($(e.currentTarget).val()) {
            instance.setRadio.set($(e.currentTarget).val());
        }
    },
    'change #selectRldc' (e, instance) {
        instance.showERLDCodisha.set(false);
        instance.showSpecial.set(false);
        instance.fetchedData.set('');
        instance.specialState.set('');
        instance.allInRldc.set('');
        instance.showAllTransactionData.set(false);
        instance.allTransaction.set('');
        instance.showWRLDCmaharashtra.set(false);
        $("#selectRldcDiscom").val('');
        if ($(e.currentTarget).val()) {
            instance.selectedRldc.set($(e.currentTarget).val());
            if ($(e.currentTarget).val() != 'All') {
                SessionStore.set("isLoading", true);
                Meteor.call("callStates", $(e.currentTarget).val(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Oops...", "Please try again!", "error");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.getStates.set(result.data);
                        }
                    }
                })
            } else if ($(e.currentTarget).val() == 'All') {
                SessionStore.set("isLoading", true);
                Meteor.call("callAllStates", function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Oops...", "Please try again!", "error");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.getAllStates.set(result.data);
                        }
                    }
                })
            }
        }
    },
    'change #selectDate' (e, instance) {
      $("#selectRldc").val("");
      $("#selectDiscom").val("");
      instance.allTransaction.set();
      instance.showAllTransactionData.set(false);

    },
    'change #selectDiscom' (e, instance) {
        instance.showAllTransactionData.set(false);
        instance.allTransaction.set('');
        instance.specialState.set('');
        instance.comparisionVariable.set('');
        instance.spdList.set('');
        if ($(e.currentTarget).val()) {
            if ($("#selectDate").val()) {
                var rldcarea = $('#selectDiscom').find(':selected').attr('rldcarea');
                var valueSpds = $('#selectDiscom').find(':selected').attr('spds');
                var spdState = $('#selectDiscom').find(':selected').attr('spdState');
                if (rldcarea.split(',')) {
                    var comparisionArray = rldcarea.split(',');
                    instance.comparisionVariable.set(comparisionArray);
                }
                if (valueSpds.split(',')) {
                    var valueSpdsArray = valueSpds.split(',');
                    instance.spdList.set(valueSpdsArray);
                }
                if ($(e.currentTarget).val() == 'Odisha') {
                    instance.specialState.set($(e.currentTarget).val());
                } else if ($(e.currentTarget).val() == 'Maharashtra') {
                    instance.specialState.set($(e.currentTarget).val());
                } else {
                    var toServer = {
                        date: $("#selectDate").val(),
                        discomState: $(e.currentTarget).val(),
                        comparisionArray: comparisionArray,
                        valueSpdsArray: valueSpdsArray,
                        spdState: spdState
                    }
                    SessionStore.set("isLoading", true);
                    Meteor.call("callReportInAllCase", toServer, function(error, result) {
                        if (error) {
                            SessionStore.set("isLoading", false);
                            swal("Oops...", "Please try again!", "error");
                        } else {
                            if (result.status) {
                                SessionStore.set("isLoading", false);
                                instance.allTransaction.set(result.data);
                            }
                        }
                    })
                }
            } else {
                swal('select date to continue');
            }
        }
    },
    'change #selectBiferAll' (e, instance) {
        instance.showAllTransactionData.set(false);
        instance.allTransaction.set('');
        if ($(e.currentTarget).val()) {
            var discomState = instance.specialState.get();
            var spdState = $(e.currentTarget).val();
            var toServer = {
                date: $("#selectDate").val(),
                discomState: discomState,
                comparisionArray: instance.comparisionVariable.get(),
                valueSpdsArray: instance.spdList.get(),
                spdState: spdState
            }
            SessionStore.set("isLoading", true);
            Meteor.call("callReportInAllCase", toServer, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.allTransaction.set(result.data);
                    }
                }
            })
        }
    },
    'change #selectRldcDiscom' (e, instance) {
        instance.showWRLDCmaharashtra.set(false);
        instance.showSpecial.set(false);
        instance.fetchedData.set('');
        instance.showERLDCodisha.set(false);
        instance.allInRldc.set('');
        if ($("#selectDate").val()) {
            if ($("#selectRldcDiscom").val()) {
                if ($("#selectRldcDiscom").val() == 'All') {
                    SessionStore.set("isLoading", true);
                    Meteor.call("callReportForAllState", instance.getStates.get(), $("#selectDate").val(), function(error, result) {
                        if (error) {
                            SessionStore.set("isLoading", false);
                            swal("Oops...", "Please try again!", "error");
                        } else {
                            if (result.status) {
                                SessionStore.set("isLoading", false);
                                instance.allInRldc.set(result.data);
                            }
                        }
                    })
                } else {
                    if ($("#selectRldcDiscom").val() == 'Odisha' && instance.selectedRldc.get() == 'ERLDC') {
                        instance.showERLDCodisha.set(true);
                        instance.showSpecial.set(true);
                    } else if ($("#selectRldcDiscom").val() == 'Maharashtra' && instance.selectedRldc.get() == 'WRLDC') {
                        instance.showSpecial.set(true);
                        instance.showWRLDCmaharashtra.set(true);
                    } else {
                        SessionStore.set("isLoading", true);
                        Meteor.call("callReport", $("#selectDate").val(), $("#selectRldcDiscom").val(), instance.selectedRldc.get(), function(error, result) {
                            if (error) {
                                SessionStore.set("isLoading", false);
                                swal("Oops...", "Please try again!", "error");
                            } else {
                                if (result.status) {
                                    SessionStore.set("isLoading", false);
                                    instance.fetchedData.set(result.data);
                                }
                            }
                        })
                    }
                }
            }

        } else {
            swal('select date to continue');
        }
    },
    'change #selectBifer' (e, instance) {
        instance.fetchedData.set('');
        Template.instance().showTabularData.set(false);
        instance.allInRldc.set('');
        if ($("#selectBifer").val()) {
            var toServer = {
                date: $("#selectDate").val(),
                discomState: $("#selectRldcDiscom").val(),
                rldc: instance.selectedRldc.get(),
                spdState: $("#selectBifer").val()
            }
            SessionStore.set("isLoading", true);
            Meteor.call("callReportForBifer", toServer, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.fetchedData.set(result.data);
                    }
                }
            })
        }
    },
    'click #viewReport' () {
        Template.instance().showTabularData.set(true);
    },
    'click #viewAllTransaction' (e, instance) {
        Template.instance().showAllTransactionData.set(true);
    },
    "click #exportIndiData": function() {
      var regionalArea = $('#selectRldc').val();
      var discomState = $('#selectRldcDiscom').val();
      var date = $("#selectDate").val();
      var excelNameVar = regionalArea+'_'+discomState+'_'+date;
      tableToExcel('exportIndiDataTable', 'SHEET1', excelNameVar);
    },
    "click #exportAllData": function() {
      var regionalArea = $('#selectRldc').val();
      var discomState = $('#selectRldcDiscom').val();
      var date = $("#selectDate").val();
      var excelNameVar = regionalArea+'_'+discomState+'_'+date;
        tableToExcel('exportAllDataTable', 'SHEET1', excelNameVar);
    },
    "click #exportAllComparision": function() {
      var regionalArea = $('#selectRldc').val();
      var discomState = $('#selectDiscom').val();
      var date = $("#selectDate").val();
      var excelNameVar = regionalArea+'_'+discomState+'_'+date;
      tableToExcel('exportAllComparisionDataTable', 'SHEET1', excelNameVar);
    },
    'click #createLog' (e, instance) {
        var data = Template.instance().fetchedData.get();
        if (data.diffSLots) {
            var serverJson = {
                diffSLots: data.diffSLots,
                discomState: data.discomState,
                spdState: data.spdState,
                selectedDate: data.selectedDate,
                selectedRldc: data.selectedRldc
            }

            swal({
                title: "Are you sure?",
                text: "You want to create Discrepancy Log!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, save it!",
                closeOnConfirm: false
            }, function(isConfirm) {
                if (isConfirm) {
                    Meteor.call("saveDiscrepancy", serverJson, function(error, result) {
                        if (error) {
                            swal("Oops...", "Please try again!", "error");
                        } else {
                            if (result.status) {
                                swal("OK!", result.message, "success");
                            }
                        }
                    });
                }
            });
        } else {
            swal("Oops...", "Required Disparancy not available!", "error");
        }

    },
    'change #selectDateLogs' (e, instance) {
        instance.showSelectedLogs.set('');
        if ($(e.currentTarget).val()) {
            Meteor.call("callDiscrepancy", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.showSelectedLogs.set(result.data);
                    } else {
                        swal(result.message)
                    }
                }
            })
        }
    },
    'click #sendReport' (e, instance) {
        var data = instance.showSelectedLogs.get();
        var index = $(e.currentTarget).attr('attr');
        var regionRLDCVar = $(e.currentTarget).attr('region');
        var sendData = data[index];
        var date = sendData.selectedDate;
        var stateArray = [];
        stateArray.push(sendData.discomState);
        var uniqSpdStateList = [];
        uniqSpdStateList.push(sendData.spdState);


        swal({
            title: "Are you sure?",
            text: "You want to send report!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, send it!",
            closeOnConfirm: false
        }, function() {
          if (uniqSpdStateList[0] == 'MP') {
              Meteor.call("respectiveMPDiscomMailForRLDC", date, sendData.discomState,regionRLDCVar, function(error, result) {
                  if (error) {
                      swal("Oops...", "Please try again!", "error");
                  } else {
                      if (result.status) {
                          swal("Report Sent!", "Discrepancy report sent successfully.", "success");
                      } else {
                          swal(result.message)
                      }
                  }
              })
          } else {
              Meteor.call("respectiveDiscomMailForRLDC", date, stateArray, uniqSpdStateList,regionRLDCVar, function(error, result) {
                  if (error) {
                      swal("Oops...", "Please try again!", "error");
                  } else {
                      if (result.status) {
                          swal("Report Sent!", "Discrepancy report sent successfully.", "success");
                      } else {
                          swal(result.message)
                      }
                  }
              })
          }
        });
    }
})

Template.rldc_comparision.helpers({
    allTransactionTable() {
        if (Template.instance().allTransaction.get()) {
            return Template.instance().allTransaction.get();
        }
    },
    allTransactionTableView() {
        if (Template.instance().allTransaction.get()) {
            Template.instance().showAllTransactionData.set(false);
            return true;
        }
    },
    showAllStates() {
        if (Template.instance().getAllStates.get()) {
            return Template.instance().getAllStates.get();
        }
    },
    firstAndLast(array) {
        if (array) {
            var first = _.first(array);
            var length = Number(array.length);
            var secondLast = array[length - 2];
            return first + '-' + secondLast;
        }
    },
    colspan(array) {
        if (array) {
            return array.length;
        }
    },
    showLogsTable() {
        if (Template.instance().showSelectedLogs.get()) {
            return true;
        }
    },
    returnLogsValue() {
        if (Template.instance().showSelectedLogs.get()) {
            return Template.instance().showSelectedLogs.get();
        }
    },
    showBiferAllState() {
        if (Template.instance().specialState.get()) {
            return true;
        }
    },
    showState() {
        if (Template.instance().specialState.get()) {
            return Template.instance().specialState.get();
        }
    },
    checkState(state) {
        if (state) {
            if (state == 'Odisha') {
                return true;
            } else {
                return false;
            }
        }
    },
    showBiferRldc() {
        Template.instance().showTabularData.set(false);
        return Template.instance().showSpecial.get();
    },
    showOdisha() {
        Template.instance().showTabularData.set(false);
        return Template.instance().showERLDCodisha.get();
    },
    showMaharashtra() {
        return Template.instance().showWRLDCmaharashtra.get();
    },
    checkReports() {
        if (Template.instance().setRadio.get() == 'checkReports') {
            Template.instance().showTabularData.set(false);
            return true;
        }
    },
    checkLogs() {
        if (Template.instance().setRadio.get() == 'checkLogs') {
            Template.instance().showTabularData.set(false);
            return true;
        }
    },
    allRldc() {
        if (Template.instance().selectedRldc.get() == 'All') {
            Template.instance().allTransaction.set('');
            Template.instance().showAllTransactionData.set(false);
            Template.instance().showTabularData.set(false);
            return true;
        }
    },
    IndiRldc() {
        if (Template.instance().selectedRldc.get() != 'All') {
            if (Template.instance().selectedRldc.get()) {
                Template.instance().showTabularData.set(false);
                return true;
            }
        }
    },
    showStates() {
        if (Template.instance().getStates.get()) {
            Template.instance().showTabularData.set(false);
            return Template.instance().getStates.get();
        }
    },
    viewTable() {
        if (Template.instance().fetchedData.get()) {
            Template.instance().showTabularData.set(false);
            return true;
        }
    },
    returnFetchedValues() {
        if (Template.instance().fetchedData.get()) {
            return Template.instance().fetchedData.get();
        }
    },
    returnAllTransaction() {
        if (Template.instance().allTransaction.get()) {
            return Template.instance().allTransaction.get();
        }
    },
    showServerData(array, index) {
        if (array) {
            if (array == 'NRLDC') {
                var data = Template.instance().allTransaction.get().NRData;
                return data[index];
            } else if (array == 'WRLDC') {
                var data = Template.instance().allTransaction.get().WRData;
                return data[index];
            } else if (array == 'ERLDC') {
                var data = Template.instance().allTransaction.get().ERData;
                return data[index];
            } else if (array == 'NERLDC') {
                var data = Template.instance().allTransaction.get().NERData;
                return data[index];
            }
        }
    },
    showDifference(array, index) {
        if (array) {
            if (array == 'NRLDC') {
                var data = Template.instance().allTransaction.get().differenceNR;
                return data[index];
            } else if (array == 'WRLDC') {
                var data = Template.instance().allTransaction.get().differenceWR;
                return data[index];
            } else if (array == 'ERLDC') {
                var data = Template.instance().allTransaction.get().differenceER;
                return data[index];
            } else if (array == 'NERLDC') {
                var data = Template.instance().allTransaction.get().differenceNER;
                return data[index];
            }
        }
    },
    colourCheckAllState(array, index) {
        if (array) {
            if (array == 'NRLDC') {
                var data = Template.instance().allTransaction.get().differenceNR;
                if (Number(data[index]) == 0) {
                    return 'null';
                } else {
                    return "yellow";
                }
            } else if (array == 'WRLDC') {
                var data = Template.instance().allTransaction.get().differenceWR;
                if (Number(data[index]) == 0) {
                    return 'null';
                } else {
                    return "yellow";
                }
            } else if (array == 'ERLDC') {
                var data = Template.instance().allTransaction.get().differenceER;
                if (Number(data[index]) == 0) {
                    return 'null';
                } else {
                    return "yellow";
                }
            } else if (array == 'NERLDC') {
                var data = Template.instance().allTransaction.get().differenceNER;
                if (Number(data[index]) == 0) {
                    return 'null';
                } else {
                    return "yellow";
                }
            }
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
    returnHelperRLDC(array, index, toShow, loopBig) {
        if (array) {
            if (array[index][toShow]) {
                return array[index][toShow][loopBig];
            }
        }
    },
    colourCheckAll(array, index, toShow, loopBig) {
        if (array) {
            if (array[index][toShow]) {
                if (Number(array[index][toShow][loopBig]) == 0) {
                    return "null";
                } else {
                    return "yellow";
                }
            }
        }
    },
    returningColoum(array, index) {
        if (array) {
            return array[index];
        }
    },
    colourCheckCha(array, index) {
        if (array) {
            if (Number(array[index]) == 0) {
                return "null";
            } else {
                return "yellow";
            }
        }
    },
    allRLDCSelected() {
        if (Template.instance().allInRldc.get()) {
            Template.instance().showTabularData.set(false);
            return true;
        }
    },
    returnAllNRLDC() {
        if (Template.instance().allInRldc.get()) {
            return Template.instance().allInRldc.get();
        }
    },
    showTabublarData() {
        return Template.instance().showTabularData.get();
    },
    showAllTransactionData() {
        if (Template.instance().showAllTransactionData.get()) {
            return Template.instance().showAllTransactionData.get();
        }
    },
    hideAllAssam() {
        if (Template.instance().selectedRldc.get() == 'NERLDC') {
            return false;
        } else {
            return true;
        }
    }
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
    return function(table, name, data) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        var excelname = data + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

import {ReactiveVar} from 'meteor/reactive-var';

Template.logFilter.onCreated(function ss() {
    this.radioValue = new ReactiveVar;
    this.selectedFilter = new ReactiveVar;
    this.listOfSpds = new ReactiveVar;
    this.listOfSpdsStateArr = new ReactiveVar;
    this.listOfTableData = new ReactiveVar;
    this.cumulativeValue = new ReactiveVar;
    this.rateValue = new ReactiveVar;
    this.selectedSpdId = new ReactiveVar('');
    this.overLoadActive = new ReactiveVar;
    this.dcrValue = new ReactiveVar;
    this.stateSelectedValue = new ReactiveVar('');
    this.raisedAllDiscoms = new ReactiveVar;
    this.discomTableData = new ReactiveVar;
    this.energyData = new ReactiveVar;
    this.selectedDiscomId = new ReactiveVar;
    this.overLoadPercentage = new ReactiveVar;
    this.getTotalForAll = new ReactiveVar;
    this.isSchemeWasSelected = new ReactiveVar;
    this.isMonthAndYearSelectedFilter = new ReactiveVar;
});

Template.logFilter.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.logFilter.events({
    "focus .selectDueDate": function() {
        $('.selectDueDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
    },
    "focus .selectPaymentDate": function() {
        $('.selectPaymentDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
    },
    "change #inlineRadio": function(e, instance) {
        Template.instance().isSchemeWasSelected.set(false);
        Template.instance().selectedFilter.set('');
        Template.instance().discomTableData.set('');
        Template.instance().overLoadActive.set(false);
        instance.radioValue.set($(e.currentTarget).val());
    },
    "change #selectFilter": function(e, instance) {
      instance.isMonthAndYearSelectedFilter.set('');
      instance.selectedFilter.set('');
      instance.isSchemeWasSelected.set(false);
        Meteor.setTimeout(function () {
          $('#raisedByFinancialYear').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#raisedByMonth').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#raisedByFinancialYearinMonth').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#raisedToMonth').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#selectMonthFinancial').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#selectYear').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#selectDCR').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#selectSpd').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#selectState').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
          $('#selectYearAsSpd').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
       },100);
        instance.listOfTableData.set('');
        instance.discomTableData.set('');
        instance.listOfSpds.set('');
        instance.selectedSpdId.set('');
        instance.stateSelectedValue.set('');
        instance.listOfSpdsStateArr.set();
        instance.overLoadActive.set(false);
        $('#ddlSchemeForDiscom').val('');
        $('#selectDiscom').val('');
        $('#raisedToMonth').val('');
        $('#selectSpd').val('');
        $('#selectYearAsSpd').val('');
        $('#selectDCR').val('');
        if ($(e.currentTarget).val()) {
            Template.instance().selectedFilter.set($(e.currentTarget).val());
        }
    },
    "change #ddlSchemeForDiscom": function(e, instance) {
      instance.isSchemeWasSelected.set(false);
      var schemeName = $(e.currentTarget).val();
      var selectFilter = $('#selectFilter').val();
      var raisedByFinancialYearinMonth = $('#raisedByFinancialYearinMonth').val();
      var raisedByFinancialYear = $('#raisedByFinancialYear').val();
      var raisedByMonth = $('#raisedByMonth').val();
      if (selectFilter == 'year') {
        if (schemeName != '' && raisedByFinancialYear != null) {
          SessionStore.set("isLoading", true);
          Meteor.call("callRaisedBySeci",schemeName, function(error, result) {
              if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Please try again!");
              } else {
                  if (result.status) {
                      SessionStore.set("isLoading", false);
                      instance.raisedAllDiscoms.set(result.data);
                      instance.isSchemeWasSelected.set(true);
                      Meteor.setTimeout(function () {
                        $('#selectDiscom').multiselect({
                           buttonWidth: '310px',
                           includeSelectAllOption: true,
                       });
                     },200);
                  }
              }
          });
       }else {
         swal("Please select financial year!")
       }
      }else if (selectFilter == 'month') {
        if (schemeName != '' && raisedByFinancialYearinMonth != null && raisedByMonth != null) {
          SessionStore.set("isLoading", true);
          Meteor.call("callRaisedBySeci",schemeName, function(error, result) {
              if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Please try again!");
              } else {
                  if (result.status) {
                      SessionStore.set("isLoading", false);
                      instance.raisedAllDiscoms.set(result.data);
                      instance.isSchemeWasSelected.set(true);
                      Meteor.setTimeout(function () {
                        $('#selectDiscom').multiselect({
                           buttonWidth: '310px',
                           includeSelectAllOption: true,
                       });
                     },200);
                  }
              }
          });
       }else {
         swal("Please select month and financial year!")
       }
      }
    },
    "change #raisedToMonth": function(e, instance) {
        instance.listOfTableData.set('');
        $('#selectMonthFinancial').val('');
    },
    'change #selectMonthFinancial' (e, instance) {
        instance.listOfTableData.set('');
        instance.listOfSpdsStateArr.set();
        if ($('#raisedToMonth').val()) {
            if ($(e.currentTarget).val()) {
                SessionStore.set("isLoading", true);
                Meteor.call("callMonthFilter", $('#raisedToMonth').val(), $(e.currentTarget).val(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            var json = result.data;
                            instance.listOfTableData.set(json.dataArray);
                            instance.getTotalForAll.set(json.total);
                        } else {
                            SessionStore.set("isLoading", false);
                            instance.listOfTableData.set('');
                            swal(result.message);
                        }
                    }
                })
            }
        } else {
            swal('Please select Month!');
        }

    },
    "change #selectYear": function(e, instance) {
        instance.listOfTableData.set('');
        instance.listOfSpdsStateArr.set();
        if ($(e.currentTarget).val()) {
            SessionStore.set("isLoading", true);
            Meteor.call("callYearFilter", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again!");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        var json = result.data;
                        instance.listOfTableData.set(json.dataArray);
                        instance.getTotalForAll.set(json.total);
                    } else {
                        SessionStore.set("isLoading", false);
                        instance.listOfTableData.set('');
                        swal(result.message);
                    }
                }
            })
        }
    },
    "change #ddlScheme": function(e, instance) {
      instance.dcrValue.set();
      instance.listOfSpdsStateArr.set();
      instance.listOfSpds.set();
    },
    "change #selectDCR": function(e, instance) {
        $('#selectSpd').val('');
        $('#selectYearAsSpd').val('');
        instance.listOfSpds.set('');
        instance.dcrValue.set('');
        instance.listOfTableData.set('');
        instance.listOfSpdsStateArr.set();
        var scheme = $('#ddlScheme').val();
        if ($(e.currentTarget).val() != null && $('#selectFilter').val() != '') {
            if (instance.selectedFilter.get() == "state") {
                instance.dcrValue.set($(e.currentTarget).val());
                SessionStore.set("isLoading", true);
                Meteor.call("getingSPDStateUniq", instance.selectedFilter.get(),$(e.currentTarget).val(),scheme, function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.listOfSpdsStateArr.set(result.data);
                        }
                    }
                })
                Meteor.setTimeout(function () {
                  $('#selectState').multiselect({
                     buttonWidth: '310px',
                     includeSelectAllOption: true,
                 });
               },1000);
            } else {
                SessionStore.set("isLoading", true);
                Meteor.call("callLogSpdList", $(e.currentTarget).val(),scheme, function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.listOfSpds.set(result.data);
                        }
                    }
                })
            }
            Meteor.setTimeout(function () {
              $('#selectSpd').multiselect({
                 buttonWidth: '310px',
                 includeSelectAllOption: true,
             });
           },1000);
        }else {
          swal('All fields are required!');
        }
    },
    "change #selectSpd": function(e, instance) {
        $('#selectYearAsSpd').val('');
        Meteor.setTimeout(function () {
          $('#selectYearAsSpd').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
       },1000);
        instance.listOfTableData.set('');
        if ($(e.currentTarget).val()) {
            Template.instance().selectedSpdId.set($(e.currentTarget).val());
        }
    },
    "change #selectYearAsSpd": function(e, instance) {
        instance.listOfTableData.set('');
        instance.cumulativeValue.set('');
        if ($(e.currentTarget).val() != null && $('#selectDCR').val() != null) {
            if (instance.selectedFilter.get() == "state") {
                SessionStore.set("isLoading", true);
                Meteor.call("callStateFilter", instance.dcrValue.get(), instance.stateSelectedValue.get(), $(e.currentTarget).val(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            var json = result.data;
                            instance.listOfTableData.set(json.dataArray);
                            instance.getTotalForAll.set(json.total);
                            instance.cumulativeValue.set(json.cumulative);
                        } else {
                            SessionStore.set("isLoading", false);
                            instance.listOfTableData.set('');
                            instance.getTotalForAll.set('');
                            swal(result.message);

                        }
                    }
                })
            } else {
                SessionStore.set("isLoading", true);
                var idToServer = instance.selectedSpdId.get();
                Meteor.call("callSpdFilter", idToServer, $(e.currentTarget).val(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            var json = result.data;
                            instance.listOfTableData.set(json.dataArray);
                            instance.getTotalForAll.set(json.total);
                            instance.cumulativeValue.set(json.count);
                            instance.rateValue.set(json.valuesReturn);
                        } else {
                            SessionStore.set("isLoading", false);
                            instance.listOfTableData.set('');
                            instance.getTotalForAll.set('');
                            swal(result.message);
                        }
                    }
                })
            }
        }else {
          swal('All fields are required!');
        }
    },
    "change .selectDueDate": function(e, instance) {
        if ($(e.currentTarget).val()) {
            SessionStore.set("isLoading", true);
            Meteor.call("callDueDateFilter", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again!");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        var json = result.data;
                        instance.listOfTableData.set(json.dataArray);
                        instance.getTotalForAll.set(json.total);
                    } else {
                        SessionStore.set("isLoading", false);
                        instance.listOfTableData.set('');
                        swal(result.message);
                    }
                }
            })
        }
    },
    "change #selectState": function(e) {
        if ($(e.currentTarget).val()) {
            Template.instance().stateSelectedValue.set($(e.currentTarget).val());
        }
        Meteor.setTimeout(function () {
          $('#selectYearAsSpd').multiselect({
             buttonWidth: '310px',
             includeSelectAllOption: true,
         });
       },1000);
    },
    "change #raisedByMonth": function(e, instance) {
      instance.isMonthAndYearSelectedFilter.set();
        $('#selectDiscom').val('');
        $('#raisedByFinancialYearinMonth').val('');
        if ($('#raisedByMonth').val()) {
          instance.isMonthAndYearSelectedFilter.set(true);
          Meteor.setTimeout(function () {
            $('#raisedByFinancialYearinMonth').multiselect({
               buttonWidth: '310px',
               includeSelectAllOption: true,
           });
         },100);
        }
    },
    "change #raisedByFinancialYear": function() {
        $('#selectDiscom').val('');
        Template.instance().discomTableData.set('');
    },
    "change #raisedByFinancialYearinMonth": function() {
        $('#selectDiscom').val('');
        Template.instance().discomTableData.set('');
    },
    "change #selectDiscom": function(e, instance) {
        Template.instance().discomTableData.set('');
        Template.instance().selectedDiscomId.set($(e.currentTarget).val());
        if ($(e.currentTarget).val()) {
            Template.instance().selectedDiscomId.set($(e.currentTarget).val());
            if ($('#raisedByMonth').val()) {
              if ($(e.currentTarget).val() != null && $('#raisedByMonth').val() != null && $('#raisedByFinancialYearinMonth').val() != null) {
                SessionStore.set("isLoading", true);
                Meteor.call("callDiscomReportOfMonth", $(e.currentTarget).val(), $('#raisedByMonth').val(), $('#raisedByFinancialYearinMonth').val(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.discomTableData.set(result.data.list);
                            instance.getTotalForAll.set(result.data.totalJson);
                        } else {
                            SessionStore.set("isLoading", false);
                            swal(result.message);
                        }
                    }
                });
              }else {
                swal('All fields are required!');
              }
            } else {
              if ($(e.currentTarget).val() != null && $('#raisedByFinancialYear').val() != null) {
                SessionStore.set("isLoading", true);
                Meteor.call("callDiscomReport", $(e.currentTarget).val(), $('#raisedByFinancialYear').val(), function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading", false);
                            instance.discomTableData.set(result.data.list);
                            instance.cumulativeValue.set(result.data.cumulative);
                            instance.getTotalForAll.set(result.data.totalJson);
                        } else {
                            SessionStore.set("isLoading", false);
                            swal(result.message);
                        }
                    }
                });
              }else {
                swal('All fields are required!');
              }
            }
        }
    },

    "change #RaisedFromDate": function() {
        $('#RaisedToDate').val('');
    },
    "change #RaisedToDate": function(e, instance) {
        if ($(e.currentTarget).val()) {
            SessionStore.set("isLoading", true);
            Meteor.call("callDiscomReportOfPayment", $('#RaisedFromDate').val(), $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again!");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.discomTableData.set(result.data.list);
                        instance.getTotalForAll.set(result.data.totalJson);
                    }
                }
            })
        }
    },
    "click #createAlert": function() {
        var spdName = Template.instance().listOfTableData.get();
        var userDetails = {
            userId: Template.instance().selectedSpdId.get(),
            name: spdName[0].nameOfEntity,
            reason: "BilledUnits of SPD Exceding more than 85% in" + ' ' + $('#selectYearAsSpd').val(),
            FinancialYear: $('#selectYearAsSpd').val()
        };
        SessionStore.set("isLoading", true);
        Meteor.call("createAlertDataByLogFilter", userDetails, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try again!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    swal("Alert Created");
                }
            }
        });
    },
    "click #createAlertForDiscom": function() {
        var discomName = Template.instance().discomTableData.get();
        var userDetails = {
            userId: Template.instance().selectedDiscomId.get(),
            name: discomName[0].discom_name,
            reason: "Total Energy of DISCOM Exceding more than " + Template.instance().overLoadPercentage.get() + "%" + " in" + ' ' + $('#raisedByFinancialYear').val(),
            FinancialYear: $('#raisedByFinancialYear').val()
        };
        SessionStore.set("isLoading", true);
        Meteor.call("alertCreatedForDiscom", userDetails, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try again!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    swal("Alert Created");
                }
            }
        });
    },
    "click #sendMail": function() {
        swal("send mail active");
    },
    'click #btnSend' () {
        swal('Email send not configure!!')
    },
    "click #exportData": function(e) {
        e.preventDefault();
        tableToExcel('exportToExcel', 'SHEET1', 'download');
    },
    "click #exportDataForDiscom": function(e) {
        e.preventDefault();
        tableToExcel('exportToExcelDiscom', 'SHEET1', 'download');
    }
})

Template.logFilter.helpers({
    financialYearHelper(){
      return dynamicFinancialYear();
    },
    // dynamicMonthHelper(){
    //   return dynamicMonth();
    // },
    showSpdList() {
        if (Template.instance().listOfSpds.get()) {
            return Template.instance().listOfSpds.get();
        }
    },
    returnEnergyData() {
        if (Template.instance().energyData.get()) {
            return Template.instance().energyData.get();
        }
    },
    showSpdDropdown() {
        if (Template.instance().listOfSpds.get()) {
            return true;
        }
    },
    showListofDiscoms() {
        if (Template.instance().selectedFilter.get() == "year" || Template.instance().selectedFilter.get() == "month") {
            return true;
        }
    },
    ifFYselectedForDiscom() {
        if (Template.instance().selectedFilter.get() == "year") {
            return true;
        }
    },
    isSchemeWasSelected() {
        if (Template.instance().isSchemeWasSelected.get()) {
            return true;
        }else {
          return false;
        }
    },
    yearFilterSelectedAsSpdSelected() {
        if (Template.instance().selectedSpdId.get() != '' || Template.instance().stateSelectedValue.get() != '') {
            return true;
        }
    },
    serial(index) {
        return index + 1;
    },
    showRaisedtoTable() {
        if (Template.instance().listOfTableData.get()) {
            return true;
        }
    },
    cumulative(index) {
        if (Template.instance().cumulativeValue.get()) {
            if (index == 0) {
                return Template.instance().cumulativeValue.get();
            }
        }
    },
    retAsPerId() {
        if (Template.instance().rateValue.get()) {
            return Template.instance().rateValue.get();
        }
    },
    invoiceTypeFilter(type) {
        if (type == 'Provisional_Invoice') {
            return 'Provisional';
        }else if (type == 'Credit' || type == ' Debit') {
          return type;
        }else {
          return false;
        }
    },
    // minValue(value, index) {
    //     if (index == 0) {
    //         return value;
    //     } else {
    //         return " ";
    //     }
    // },
    // maxValue(value, index) {
    //     if (index == 0) {
    //         return value;
    //     } else {
    //         return " ";
    //     }
    // },
    getMonthValue(monthIndex) {
        return monthInWords(monthIndex);
    },
    tabularRaisedToData() {
        if (Template.instance().listOfTableData.get()) {
            return Template.instance().listOfTableData.get();
        }else {
          return false;
        }
    },
    spdFilterSelected() {
        if (Template.instance().selectedFilter.get() == "spd") {
            return true;
        }else {
          return false;
        }
    },
    showDcrSelectionList() {
        if (Template.instance().selectedFilter.get() == "spd" || Template.instance().selectedFilter.get() == "state") {
            return true;
        }else {
          return false;
        }
    },
    isMonthFilterSelected() {
        if (Template.instance().isMonthAndYearSelectedFilter.get()) {
            return true;
        }else {
          return false;
        }
    },
    monthFilterSelected() {
        if (Template.instance().selectedFilter.get() == "month") {
            return true;
        }else {
          return false;
        }
    },
    "viewTodayDate": function() {
        return moment().format('DD-MM-YYYY');
    },
    showEmail() {
        return "Email id";
    },
    dueDateFilterSelected() {
        if (Template.instance().selectedFilter.get() == "dueDate") {
            return true;
        }else {
          return false;
        }
    },
    getDifferencePer(maxValue, index) {
        if (Template.instance().cumulativeValue.get()) {
            if (index == 0) {
                var cumValue = Template.instance().cumulativeValue.get();
                var diff = Number(maxValue) - Number(cumValue);
                var percentage = (Number(diff) / Number(maxValue)) * 100;
                var returnPercentage = Number(100) - Number(percentage.toFixed(2));
                Template.instance().overLoadActive.set(false);
                if (returnPercentage > 85) {
                    Template.instance().overLoadActive.set(true);
                    Template.instance().overLoadPercentage.set(returnPercentage.toFixed(2));
                    return returnPercentage.toFixed(2) + "%";
                }
            }
        }
    },
    discoms() {
        return Template.instance().raisedAllDiscoms.get();
    },
    showOverLoadOptions(alert) {
      console.log(alert);
      if (alert) {
        return true;
      }else {
        return false;
      }
    },
    yearFilterSelected() {
        if (Template.instance().selectedFilter.get() == "year") {
            return true;
        }else {
          return false;
        }
    },
    falseForPayment() {
        if (Template.instance().selectedFilter.get() == "dueDate" || Template.instance().selectedDiscomId.get() == 'all') {
            return false;
        } else {
            return true;
        }
    },
    stateFilterSelected() {
        if (Template.instance().selectedFilter.get() == "state") {
            if (Template.instance().dcrValue.get()) {
                return true;
            }
        }
    },
    listOfSpdsStateArr() {
        if (Template.instance().listOfSpdsStateArr.get()) {
            if (Template.instance().listOfSpdsStateArr.get()) {
                return Template.instance().listOfSpdsStateArr.get();
            }else {
              return false;
            }
        }
    },
    returnDiscomTable() {
        if (Template.instance().discomTableData.get()) {
            return Template.instance().discomTableData.get();
        }else {
          return false;
        }
    },
    returnTotalForAll() {
        if (Template.instance().getTotalForAll.get()) {
            return Template.instance().getTotalForAll.get();
        }else {
          return false;
        }
    },
    showDiscomTable() {
        if (Template.instance().discomTableData.get()) {
            return true;
        }else {
          return false;
        }
    },
    invoiceRaisedBy() {
        if (Template.instance().radioValue.get() == "raisedBySeci") {
            return true;
        }else {
          return false;
        }
    },
    invoiceRaisedTo() {
        if (Template.instance().radioValue.get() == "raisedToSeci") {
            return true;
        }else {
          return false;
        }
    },
    serial(index) {
        return index + 1;
    },
    monthReturn() {
        return monthReturn();
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
    "returnSchemes": function() {
      var data = Schemes.find().fetch();
      return data;
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

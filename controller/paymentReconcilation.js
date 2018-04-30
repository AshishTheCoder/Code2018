import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.payment_reconciliation.onCreated(function abc() {
    this.typeValue = new ReactiveVar();
    this.radioValue = new ReactiveVar;
    this.selectedQuarterDataVar = new ReactiveVar('');
    this.financial_yearDataVar = new ReactiveVar();
    this.discomorSPDType = new ReactiveVar();
    this.userDataReactiveVar = new ReactiveVar();
    this.discomReactiveVar = new ReactiveVar();
    this.returnedpath = new ReactiveVar();
    this.isDiscomORspdSelected = new ReactiveVar(false);
})

Template.payment_reconciliation.rendered = function() {
    var instance = Template.instance();
    SessionStore.set("isLoading", false);
}

Template.payment_reconciliation.events({
    "change #inlineRadio": function(e, instance) {
        instance.typeValue.set('');
        $("#ddlSelectQuarter").val('');
        $("#selectType").val('');
        instance.selectedQuarterDataVar.set('');
        instance.financial_yearDataVar.set('');
        instance.isDiscomORspdSelected.set(false);
        instance.discomorSPDType.set('');
        var selectedRadioData = $(e.currentTarget).val();
        if (selectedRadioData != '') {
            instance.radioValue.set(selectedRadioData);
        } else {
            instance.radioValue.set();
        }
    },
    "change #ddlSelectQuarter": function(e, instance) {
      $("#financial_year").val('');
      $("#ddldiscomList").val('');
        var quarter = $(e.currentTarget).val();
        instance.isDiscomORspdSelected.set(false);
        if (quarter != '') {
            instance.selectedQuarterDataVar.set(quarter);
        } else {
            instance.selectedQuarterDataVar.set('');
        }
    },
    "change #financial_year": function(e, instance) {
      $("#ddldiscomList").val('');
      $("#ddlSPDList").val('');
        var financialYear = $(e.currentTarget).val();
        instance.isDiscomORspdSelected.set(false);
        var radioType = instance.radioValue.get();
        if (financialYear != '') {
            instance.discomorSPDType.set(radioType);
            instance.financial_yearDataVar.set(financialYear);
            Meteor.call("gettingSPDandDiscomData1", radioType, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again!");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.userDataReactiveVar.set(result.data);
                    } else {
                        SessionStore.set("isLoading", false);
                        instance.userDataReactiveVar.set(result.data);
                        var myData = monthInWordsShort(month);
                    }
                }
            });
        } else {
            instance.discomorSPDType.set();l
            instance.financial_yearDataVar.set();
        }
    },
    "change #ddldiscomList": function(e, instance) {
      var data =  $(e.currentTarget).val();
      instance.isDiscomORspdSelected.set(false);
      if (data != '') {
        instance.isDiscomORspdSelected.set(true);
      }
    },
    "click #btnGeneratePDfforDiscom": function(e, instance) {
        var discomlist = $('#ddldiscomList').val();
        var discomId = $("#ddldiscomList option:selected").attr("attrId");
        var Quarter = $("#ddlSelectQuarter").val();
        var financialYear = $("#financial_year").val();
        if (discomlist != '') {
          SessionStore.set("isLoading", true);
            Meteor.call("gettingDiscomDataTable2", Quarter, discomId, discomlist, financialYear, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again!");
                } else {
                    if (result) {
                        setTimeout(
                          function () {
                            SessionStore.set("isLoading", false);
                            instance.isDiscomORspdSelected.set(false);
                            $("#ddldiscomList").val('');
                            window.open(result);
                          }, 5000);
                    } else {
                        SessionStore.set("isLoading", false);
                        swal("result is not showing");
                    }
                }
            })
        } else {
            swal('Please select discom name!');
            instance.returnedpath.set();
        }
    },
    "change #ddlSPDList": function(e, instance) {
      var data =  $(e.currentTarget).val();
      instance.isDiscomORspdSelected.set(false);
      if (data != '') {
        instance.isDiscomORspdSelected.set(true);
      }
    },
    "click #btnGeneratePDfforSPD": function(e, instance) {
        var spdlist = $('#ddlSPDList').val();
        var spdId = $("#ddlSPDList option:selected").attr("attrId");
        var Quarter = $("#ddlSelectQuarter").val();
        var financialYear = $("#financial_year").val();
        if (spdlist != '') {
          SessionStore.set("isLoading", true);
            Meteor.call("gettingSPDTable2", Quarter, spdId, spdlist, financialYear, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again!");
                } else {
                    if (result) {
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading", false);
                          instance.isDiscomORspdSelected.set(false);
                          $("#ddlSPDList").val('');
                          window.open(result);
                        }, 4000);
                    } else {
                        SessionStore.set("isLoading", false);
                        swal("result is not showing");
                    }
                }
            })
        } else {
            swal('Please select SPD name!');
            instance.returnedpath.set();
        }
    }
})

Template.payment_reconciliation.helpers({
    "isSDPorDiscomSelected": function() {
        if (Template.instance().radioValue.get()) {
            return true;
        } else {
            return false;
        }
    },
    "showDiscom": function() {
        if (Template.instance().discomorSPDType.get() == "discom") {
            return true;
        } else {
            return false;
        }
    },
    "showSpd": function() {
        if (Template.instance().discomorSPDType.get() == "spd") {
            return true;
        } else {
            return false;
        }
    },
    "returnJson": function() {
        if (Template.instance().userDataReactiveVar.get()) {
            return Template.instance().userDataReactiveVar.get();
        } else {
            return false;
        }
    },
    isMonthlyorQuaterlySelected() {
        if (Template.instance().selectedQuarterDataVar.get() != '') {
            return true;
        } else {
            return false;
        }
    },
    isFinancialyearIsSelected() {
        if (Template.instance().financial_yearDataVar.get()) {
            return true;
        } else {
            return false;
        }
    },
    isDiscomORspdSelected() {
        if (Template.instance().isDiscomORspdSelected.get()) {
            return true;
        } else {
            return false;
        }
    },
    monthReturn() {
        return monthReturn();
    },
    dynamicFinancialYear() {
        return dynamicFinancialYear();
    }
})

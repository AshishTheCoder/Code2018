import {ReactiveVar} from 'meteor/reactive-var';

Template.jmr.onCreated(function ss() {
    this.initialData = new ReactiveVar;
    this.jmrAmount = new ReactiveVar;
    this.reaBilledAmount = new ReactiveVar;
    this.calculateImport = new ReactiveVar;
    this.calculateExport = new ReactiveVar;
    this.BilledUnitsData = new ReactiveVar;
    this.seaAmountValue = new ReactiveVar;
    this.exceedEnergy = new ReactiveVar;
    this.exceedAmountValue = new ReactiveVar;
});
Template.jmr.rendered = function() {
    SessionStore.set("isLoading", false);
    SessionStore.set("changeFinancialYear", "");
    SessionStore.set("changeMonth", "");
    SessionStore.set("selectRadio", false);
};

Template.jmr.events({
    "change #txtfinancialyear": function(e, t) {
        SessionStore.set("changeFinancialYear", $(e.currentTarget).val());
        $('#month').val('');
        SessionStore.set("changeMonth", "");
    },
    "change #month": function(e, t) {
        if ($(e.currentTarget).val() != '') {
          SessionStore.set("changeMonth", $(e.currentTarget).val());
        }else {
          SessionStore.set("changeMonth", "");
        }
    },
    "change .inlineRadio": function(e, instance) {
        var radioValue = $(e.currentTarget).val();
        Template.instance().jmrAmount.set('');
        Template.instance().calculateImport.set('');
        Template.instance().BilledUnitsData.set('');
        Template.instance().calculateExport.set('');
        Template.instance().reaBilledAmount.set('');
        Template.instance().seaAmountValue.set('');
        Template.instance().exceedEnergy.set('');
        Template.instance().exceedAmountValue.set('');
        SessionStore.set("selectRadio", radioValue);
        Meteor.call("callTypeDetails", radioValue, SessionStore.get("changeMonth"), SessionStore.get("changeFinancialYear"), function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                    instance.initialData.set(result.data);
                }
            }
        })
    },
    "keyup #importCurrent": function() {
        var match = $('#importCurrent').val();
        if (match.match(/^[0-9]*\.?[0-9]*$/)) {
            var pre = $('#importPrevious').val();
            var setData = Number(match) - Number(pre);
            Template.instance().calculateImport.set(Number(setData).toFixed(3));
        } else {
            swal("Enter only digits");
            throw new Error("Use only digits!");
        }
    },
    "keyup #exportCurrent": function() {
        var match = $('#exportCurrent').val();
        if (match.match(/^[0-9]*\.?[0-9]*$/)) {
            var pre = $('#exportPrevious').val();
            var setData = Number(match) - Number(pre);
            Template.instance().calculateExport.set(Number(setData).toFixed(3));
        } else {
            swal("Enter only digits");
            throw new Error("Use only digits!");
        }
    },
    "keyup #MF": function() {
        var match = $('#MF').val();
        if (match.match(/^[0-9]*\.?[0-9]*$/)) {
            var importData = $('#import').val();
            var exportData = $('#export').val();
            var toReturn = Number(Number(Number(exportData) - Number(importData)) * Number(match)).toFixed(3);
            Template.instance().BilledUnitsData.set(toReturn);

            var maxValue = Meteor.user().profile.registration_form.spd_max_energy_as_per_ppa;
            var justNow = Template.instance().BilledUnitsData.get();
            var lastValue = Template.instance().initialData.get();
            var total = Number(lastValue.tillDateBilledUnits) + Number(justNow);
            var maxEnergyInKwh = Number(maxValue) * 1000000;
            if (total > maxEnergyInKwh) {
                var exceed = Number(total) - Number(maxEnergyInKwh);
                var showValue = Number(Number(justNow) - Number(exceed));
                Template.instance().BilledUnitsData.set(Number(showValue).toFixed(3));
                Template.instance().exceedEnergy.set(exceed);
                var exceedAmount = Number(exceed) * 3;
                Template.instance().exceedAmountValue.set(exceedAmount);
            } else {
                Template.instance().exceedEnergy.set("0");
                Template.instance().exceedAmountValue.set("0");
            }
            var jmrValue = Template.instance().BilledUnitsData.get()
            var calAmount = Number(jmrValue) * Number($('#jmrUnits').val());
            Template.instance().jmrAmount.set(Number(calAmount).toFixed(3));
        } else {
            swal("Enter only digits");
            throw new Error("Use only digits!");
        }
    },
    "click .jqUploadclass": function(e, t) {
        $(e.currentTarget).attr('url', "");
        $(e.currentTarget).attr('isUploaded', "NO");
    },
    "click .done": function(e, t) {
        $('.jqUploadclass').attr('url', "");
        $('.jqUploadclass').attr('isUploaded', "NO");
    },
    "click #submitJmr": function(e) {
        e.preventDefault();
        $('.validate').each(function() {
            var validate = $(this).val();
            if ($(this).val() == '') {
                swal("All fields are required");
                throw new Error("All fields are required!");
            } else {}
        })

        $('.number').each(function() {
            var checkNumber = $(this).val();
            if (checkNumber.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Enter only digits");
                throw new Error("Enter only digits!");
            }
        });
        if ($('.jqUploadclass').attr('url') == "" && $('.jqUploadclass').attr('isUploaded') == "NO") {
            swal("Please Upload File To Submit");
            return 0;
        };
        var jmrJson = {
            financial_year: $('#txtfinancialyear').val(),
            month: $('#month').val(),
            importPrevious: $('#importPrevious').val(),
            importCurrent: $('#importCurrent').val(),
            exportPrevious: $('#exportPrevious').val(),
            exportCurrent: $('#exportCurrent').val(),
            type: SessionStore.get("selectRadio"),
            import: $('#import').val(),
            export: $('#export').val(),
            MF: $('#MF').val(),
            billedUnits: $('#jmrBilledUnits').val(),
            rate: $('#jmrUnits').val(),
            amount: $('#jmrAmount').val(),
            meterNumber: $('#jmrMeterNumber').val(),
            filehref: $('.jqUploadclass').attr('hrefValue'),
            filepath: $('.jqUploadclass').attr('fileUploadedPath'),
            invoiceNumber: $('#jmrInvoice').val(),
            exceedEnergy: Template.instance().exceedEnergy.get(),
            exceedAmount: Template.instance().exceedAmountValue.get(),
            userId: Meteor.userId(),
            userState: Meteor.user().profile.registration_form.spd_state,
            timestamp: new Date()
        };
        swal({
            title: "Are you sure?",
            text: "You want to submit it",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                Meteor.call("saveJmrJson", jmrJson, function(error, result) {
                    if (error) {
                        swal("Please try again !");
                    } else {
                        if (result.status) {
                            swal("Submitted!",result.message, "success");
                            SessionStore.set("selectRadio", false);
                            SessionStore.set("calculateExport", false);
                            $(".inlineRadio").prop("checked", false);
                        } else {
                            swal("Oops...",result.message, "error");
                        }
                    }
                });
            }
        });
    },

    "keyup #seaBilledUnits": function() {
        var justNow = $('#seaBilledUnits').val();
        if (justNow.match(/^[0-9]*\.?[0-9]*$/)) {
          var maxValue = Meteor.user().profile.registration_form.spd_max_energy_as_per_ppa;
          var maxEnergyInKwh = Number(maxValue) * 1000000;
          var lastValue = Template.instance().initialData.get();
          var total = Number(lastValue.tillDateBilledUnits) + Number(justNow);
          if (total > maxEnergyInKwh) {
              var exceed = Number(total) - Number(maxEnergyInKwh);
              var showValue = Number(justNow) - Number(exceed);
              Template.instance().BilledUnitsData.set(showValue);
              var amountValue = Number(showValue) * Number($('#seaUnits').val());
              var amountInDecimal = Number(amountValue).toFixed(3);
              Template.instance().seaAmountValue.set(amountInDecimal);
              Template.instance().exceedEnergy.set(exceed);
              var exceedAmount = Number(exceed) * 3;
              Template.instance().exceedAmountValue.set(exceedAmount);
          } else {
              var ret = Number(justNow) * Number($('#seaUnits').val());
              var amountInDecimal = Number(ret).toFixed(3);
              Template.instance().seaAmountValue.set(amountInDecimal);
              Template.instance().BilledUnitsData.set(justNow);
              Template.instance().exceedEnergy.set("0");
              Template.instance().exceedAmountValue.set("0");
          }
        } else {
            swal("Enter only digits");
            throw new Error("Enter only digits!");
        }
    },
    "click #submitSea": function(e) {
        e.preventDefault();
        $('.validate').each(function() {
            var validate = $(this).val();
            if ($(this).val() == '') {
                swal("All fields are required");
                throw new Error("All fields are required");
            } else {}
        })
        $('.number').each(function() {
            var checkNumber = $(this).val();
            if (checkNumber.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Enter only digits");
                throw new Error("Enter only digits!");
            }
        })
        if ($('.jqUploadclass').attr('url') == "" && $('.jqUploadclass').attr('isUploaded') == "NO") {
            swal("Please Upload File To Submit");
            return 0;
        };
        var seaJson = {
            financial_year: $('#txtfinancialyear').val(),
            month: $('#month').val(),
            type: SessionStore.get("selectRadio"),
            billedUnits: Template.instance().BilledUnitsData.get(),
            rate: $('#seaUnits').val(),
            amount: $('#seaAmount').val(),
            filehref: $('.jqUploadclass').attr('hrefValue'),
            filepath: $('.jqUploadclass').attr('fileUploadedPath'),
            invoiceNumber: $('#seaInvoice').val(),
            exceedEnergy: Template.instance().exceedEnergy.get(),
            exceedAmount: Template.instance().exceedAmountValue.get(),
            userId: Meteor.userId(),
            userState: Meteor.user().profile.registration_form.spd_state,
            timestamp: new Date()
        };
        swal({
            title: "Are you sure?",
            text: "You want to submit it",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
              Meteor.call("saveSeaJson", seaJson, function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                          SessionStore.set("selectRadio", false);
                          SessionStore.set("calculateExport", false);
                          $(".inlineRadio").prop("checked", false);
                          swal("Submitted!",result.message, "success");
                      } else {
                          swal("Oops...",result.message, "error");
                      }
                  }
              })
            }
        });
    },
    "keyup #reaBilledUnits": function() {
        var justNow = $('#reaBilledUnits').val();
        if (justNow.match(/^[0-9]*\.?[0-9]*$/)) {
          var maxValue = Meteor.user().profile.registration_form.spd_max_energy_as_per_ppa;
          var maxEnergyInKwh = Number(maxValue) * 1000000;
          var lastValue = Template.instance().initialData.get();
          var total = Number(lastValue.tillDateBilledUnits) + Number(justNow);
          if (total > maxEnergyInKwh) {
              var exceed = Number(total) - Number(maxEnergyInKwh);
              var showValue = Number(justNow) - Number(exceed);
              Template.instance().BilledUnitsData.set(showValue);
              var amountValue = Number(showValue) * Number($('#reaUnits').val());
              var amountInDecimal = Number(amountValue).toFixed(3);
              Template.instance().reaBilledAmount.set(amountInDecimal);
              Template.instance().exceedEnergy.set(exceed);
              var exceedAmount = Number(exceed) * 3;
              Template.instance().exceedAmountValue.set(exceedAmount);
          } else {
              var ret = Number(justNow) * Number($('#reaUnits').val());
              var amountInDecimal = Number(ret).toFixed(3);
              Template.instance().reaBilledAmount.set(amountInDecimal);
              Template.instance().BilledUnitsData.set(justNow);
              Template.instance().exceedEnergy.set("0");
              Template.instance().exceedAmountValue.set("0");
          }
        } else {
            swal("Enter only digits");
            throw new Error("Enter only digits!");
        }
    },
    "click #submitRea": function() {
        $('.validate').each(function() {
            var validate = $(this).val();
            if ($(this).val() == '') {
                swal("All fields are required");
                throw new Error("All fields are required");
            } else {}
        })
        $('.number').each(function() {
            var checkNumber = $(this).val();
            if (checkNumber.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Enter only digits");
                throw new Error("Enter only digits!");
            }
        })
        if ($('.jqUploadclass').attr('url') == "" && $('.jqUploadclass').attr('isUploaded') == "NO") {
            swal("Please Upload File To Submit");
            return 0;
        };
        // console.log($('.jqUploadclass').attr('url'));
        var reaJson = {
            financial_year: $('#txtfinancialyear').val(),
            month: $('#month').val(),
            type: SessionStore.get("selectRadio"),
            billedUnits: Template.instance().BilledUnitsData.get(),
            rate: $('#reaUnits').val(),
            amount: $('#reaAmount').val(),
            // reaFile: $('#reaFile').val(),
            filehref: $('.jqUploadclass').attr('hrefValue'),
            filepath: $('.jqUploadclass').attr('fileUploadedPath'),
            invoiceNumber: $('#reaInvoice').val(),
            exceedEnergy: Template.instance().exceedEnergy.get(),
            exceedAmount: Template.instance().exceedAmountValue.get(),
            userId: Meteor.userId(),
            userState: Meteor.user().profile.registration_form.spd_state,
            timestamp: new Date()
        };
        swal({
            title: "Are you sure?",
            text: "You want to submit it",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
              Meteor.call("saveReaJson", reaJson, function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                          SessionStore.set("selectRadio", false);
                          SessionStore.set("calculateExport", false);
                          $(".inlineRadio").prop("checked", false);
                          swal("Submitted!",result.message, "success");
                      } else {
                          swal("Oops...",result.message, "error");
                      }
                  }
              })
            }
        });
    }
});

Template.jmr.helpers({
    specificFormData: function() {
        return {uploadedFrom: 'uploadJMR'};
    },
    myCallbacks: function() {
        return {
            finished: function(index, fileInfo, context) {
                var setName = fileInfo.baseUrl + fileInfo.name;
                $(".jqUploadclass").eq(index).attr('url', setName);
                $(".jqUploadclass").eq(index).attr('hrefValue', fileInfo.hrefValue);
                $(".jqUploadclass").eq(index).attr('fileUploadedPath', fileInfo.actualPath);
                $(".jqUploadclass").eq(index).attr('isUploaded', "YES");
                // console.log(fileInfo);
            }
        }
    },
    initialValues() {
        return Template.instance().initialData.get();
    },
    importValue() {
        return Template.instance().calculateImport.get();
    },
    exportValue() {
        return Template.instance().calculateExport.get();
    },
    "showJmr": function() {
        if (SessionStore.get("selectRadio") === "JMR" && SessionStore.get("changeMonth") != "" && SessionStore.get("changeFinancialYear") != "") {
            return true;
        } else {
            return false;
        }
    },
    "showSea": function() {
        if (SessionStore.get("selectRadio") === "SEA" && SessionStore.get("changeMonth") != "" && SessionStore.get("changeFinancialYear") != "") {
            return true;
        } else {
            return false;
        }
    },
    "showRea": function() {
        if (SessionStore.get("selectRadio") === "REA" && SessionStore.get("changeMonth") != "" && SessionStore.get("changeFinancialYear") != "") {
            return true;
        } else {
            return false;
        }
    },
    "BilledCalculate": function() {
        if (Template.instance().BilledUnitsData.get()) {
            return Template.instance().BilledUnitsData.get();
        } else {
            return "0";
        }
    },
    showExceedEnergy() {
        if (Template.instance().exceedEnergy.get()) {
            return Template.instance().exceedEnergy.get();
        }
    },
    showExceedAmount() {
        if (Template.instance().exceedAmountValue.get()) {
            return Template.instance().exceedAmountValue.get();
        }
    },
    jmrAmount() {
        if (Template.instance().jmrAmount.get()) {
            return Template.instance().jmrAmount.get();
        } else {
            return "0";
        }
    },
    seaAmount() {
        if (Template.instance().seaAmountValue.get()) {
            return Template.instance().seaAmountValue.get();
        } else {
            return "0";
        }
    },
    reaAmount() {
        if (Template.instance().reaBilledAmount.get()) {
            return Template.instance().reaBilledAmount.get();
        } else {
            return "0";
        }
    },
    showMaxPpa() {
        if (Meteor.user().profile.registration_form) {
            return Meteor.user().profile.registration_form.spd_max_energy_as_per_ppa;
        }
    },
    showRadio() {
        if (Meteor.user().profile.registration_form) {
            if (Meteor.user().profile.registration_form.transaction_type == "Inter") {
                return true;
            }
        }
    },
    "monthReturn": function() {
        return monthReturn();
    },
});

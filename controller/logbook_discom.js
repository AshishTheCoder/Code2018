import {ReactiveVar} from 'meteor/reactive-var';
Template.logbook_discom.onCreated(function staticdata() {
    this.staticmodal = new ReactiveVar;
    this.paymentAmount = new ReactiveVar(0);
    this.allDiscomNames = new ReactiveVar;
    this.initialDiscomData = new ReactiveVar;
    this.sirChargeAmount = new ReactiveVar(0);
    this.selectedDiscomState = new ReactiveVar;
    this.maharashtraAndRajasthanProvisional = new ReactiveVar;
    this.ddlEnergyType = new ReactiveVar;
    this.discomStateForTC = new ReactiveVar;
    this.ddlSelectedStateTC = new ReactiveVar;
    this.fetchedDataForTC = new ReactiveVar;
    this.shortPaymentTC = new ReactiveVar(0);
    this.sirChargeAmountForTC = new ReactiveVar(0);
    this.spdStateSelectedForTC = new ReactiveVar;
    this.discomStateForSLDC = new ReactiveVar;
    this.gettingSLDCInvoicePeriod = new ReactiveVar;
    this.gettingSLDCInvoiceDocument = new ReactiveVar;
    this.shortPaymentSLDC = new ReactiveVar(0);
    this.surChargeAmountForSLDC = new ReactiveVar(0);
    this.getDiscomNameForIC = new ReactiveVar();
    this.incetiveFetchedData = new ReactiveVar();
    this.shortPaymentIC = new ReactiveVar(0);
    this.surChargeAmountForIC = new ReactiveVar(0);
});
Template.logbook_discom.rendered = function() {
    SessionStore.set("isLoading", false);
    $("#logbookdiscumform").validate({
        rules: {
            discomId: {
                required: true
            },
            financial_year: {
                required: true
            },
            total_energy: {
                required: true,
                number: true
            },
            rate_per_unit: {
                required: true,
                number: true
            },
            amount_of_invoice: {
                required: true,
                number: true
            },
            invoice_no: {
                required: true
            },
            month: {
                required: true
            },
            invoice_date: {
                required: true
            },
            payment_amount: {
                number: true
            },
            short_payment: {
                required: true,
                number: true
            },
            period: {
                required: true
            }
        },
        messages: {
            discomId: {
                required: "Please enter name"
            },
            financial_year: {
                required: "Please select financial year"
            },
            total_energy: {
                required: "Please enter units",
                number: "Please enter only number"
            },
            rate_per_unit: {
                required: "Please enter rate",
                number: "Please enter only number"
            },
            amount_of_invoice: {
                required: "Please enter amount",
                number: "Please enter only number"
            },
            invoice_no: {
                required: "Please enter invoice number"
            },
            month: {
                required: "Please select month"
            },
            invoice_date: {
                required: "Please enter invoice date"
            },
            payment_amount: {
                required: "Please enter payment amount",
                number: "Please enter only number"
            },
            short_payment: {
                required: "Please enter short payment",
                number: "Please enter only number"
            },
            period: {
                required: "Please enter period"
            }
        }
    });

    // $('.dateoflogbookdiscomPayment').datepicker({format: 'dd-mm-yyyy'}).on('changeDate', function(ev) {
    //     $("form").validate().element(".dateoflogbookdiscomPayment");
    //     $(this).datepicker('hide');
    // });
    var instance = Template.instance();
    SessionStore.set("isLoading", true);
    Meteor.call("callDiscomAllNames", function(error, result) {
        if (error) {
            SessionStore.set("isLoading", false);
            swal("Please try again!");
        } else {
            if (result.status) {
                SessionStore.set("isLoading", false);
                instance.allDiscomNames.set(result.data);
            } else {
                SessionStore.set("isLoading", false);
                swal(result.message);
            }
        }
    });
};

Template.logbook_discom.events({
    "focus .dateoflogbookdiscomPayment": function() {
        $('.dateoflogbookdiscomPayment').datepicker({format: 'dd-mm-yyyy', autoclose: true});
    },
    "focus #txtdDateOfPaymentTC": function() {
        $('#txtdDateOfPaymentTC').datepicker({format: 'dd-mm-yyyy', autoclose: true});
    },
    "focus #txtdDateOfPaymentSLDC": function() {
        $('#txtdDateOfPaymentSLDC').datepicker({format: 'dd-mm-yyyy', autoclose: true});
    },
    "focus #txtdDateOfPaymentIC": function() {
        $('#txtdDateOfPaymentIC').datepicker({format: 'dd-mm-yyyy', autoclose: true});
    },
    "change #ddlEnergyType": function(e, instance) {
      var energyTypeVar = $(e.currentTarget).val();
      instance.ddlEnergyType.set(energyTypeVar);
      $('#ddlStateForTC').val('');
      $('#ddlStateForTC').val('');
      $('#ddlMonthTC').val('');
      $('#ddlFinancialyearTC').val('');
      instance.discomStateForTC.set();
      instance.fetchedDataForTC.set();
      instance.spdStateSelectedForTC.set();
      instance.discomStateForSLDC.set();
      instance.gettingSLDCInvoicePeriod.set();
      instance.gettingSLDCInvoiceDocument.set();
      instance.shortPaymentSLDC.set(0);
      instance.surChargeAmountForSLDC.set(0);
      instance.shortPaymentTC.set(0);
      instance.sirChargeAmountForTC.set(0);
      instance.getDiscomNameForIC.set();
      if (energyTypeVar == 'Incentive Invoice') {
        SessionStore.set("isLoading", true);
        Meteor.call("getDiscomAllNamesForIC", function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try again!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.getDiscomNameForIC.set(result.data);
                } else {
                    SessionStore.set("isLoading", false);
                    swal(result.message);
                }
            }
        });
      }
    },
    //---------------------------TC Invoice Log Book Events-----------------------//
    "change #ddlStateForTC": function(e, instance) {
      var state = $(e.currentTarget).val();
      instance.spdStateSelectedForTC.set(state);
      SessionStore.set("isLoading", true);
      Meteor.call("gettingDiscomState",state, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Please try agian!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  instance.discomStateForTC.set(result.data);
              }
          }
      });
      $('#ddlDiscomSateForTC').val('');
      $('#ddlMonthTC').val('');
      $('#ddlFinancialyearTC').val('');
      instance.fetchedDataForTC.set();
      instance.shortPaymentTC.set(0);
      instance.sirChargeAmountForTC.set(0);
      instance.ddlSelectedStateTC.set(state);
    },
    "change #ddlDiscomSateForTC": function(e, instance) {
      $('#ddlMonthTC').val('');
      $('#ddlFinancialyearTC').val('');
      instance.fetchedDataForTC.set();
      instance.shortPaymentTC.set(0);
      instance.sirChargeAmountForTC.set(0);
    },
    "change #ddlMonthTC": function(e, instance) {
      $('#ddlFinancialyearTC').val('');
      instance.fetchedDataForTC.set();
      instance.shortPaymentTC.set(0);
      instance.sirChargeAmountForTC.set(0);
    },
    "change #ddlFinancialyearTC": function(e, instance) {
      var financialYear = $(e.currentTarget).val();
      instance.shortPaymentTC.set(0);
      instance.sirChargeAmountForTC.set(0);
      var monthVar = $('#ddlMonthTC').val();
      var spdState = $('#ddlStateForTC').val();
      var discomState = $('#ddlDiscomSateForTC').val();
      if (financialYear != '' && monthVar != '' && discomState != '') {
        SessionStore.set("isLoading", true);
        Meteor.call("gettingTCdataForLogBook",monthVar,spdState,discomState,financialYear, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try agian!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.fetchedDataForTC.set(result.data);
                }else {
                  SessionStore.set("isLoading", false);
                  instance.fetchedDataForTC.set();
                  swal(result.message);
                }
            }
        });
      }
    },
    "keyup #txtPaymentAmountTC" (e, instance){
      var paymentAmount = $(e.currentTarget).val();
      if (paymentAmount != '') {
        var invoiceAmount = $('#txtInvoiceAmount').val();
        var shortPayment = Number(invoiceAmount) - Number(paymentAmount);
        instance.shortPaymentTC.set(shortPayment);
      }else {
        instance.shortPaymentTC.set(0);
      }
    },
    "change #txtdDateOfPaymentTC"(e, instance){
      instance.sirChargeAmountForTC.set(0);
      var dateOfPayment = $(e.currentTarget).val();
      if (dateOfPayment != '') {
          var payment = $(e.currentTarget).val();
          var dueDateVar = $('#txtDueDateTC').val();
          var dueValue = dueDateVar.split('-');
          dueValueSplit = dueValue[2] + '/' + dueValue[1] + '/' + dueValue[0];
          dueValueSplit = moment(dueValueSplit, 'YYYY-MM-DD');
          var paymentValue = payment.split('-');
          paymentValueSplit = paymentValue[2] + '/' + paymentValue[1] + '/' + paymentValue[0];
          paymentValueSplit = moment(paymentValueSplit, 'YYYY-MM-DD');
          var daysDifference = dueValueSplit.diff(paymentValueSplit, 'days');
          if (daysDifference < 0) {
              var amountRecieved = $('#txtInvoiceAmount').val();
              var difference = Math.abs(daysDifference);
              var multiply = Number(amountRecieved) * 0.0125 * 12 * Number(difference);
              var sirCharge = Number(multiply) / Number(365);
              instance.sirChargeAmountForTC.set(Math.round(sirCharge));
          } else {
              instance.sirChargeAmountForTC.set(0);
          }
      }
    },
    //----------------------------------------------------------------------------//
    //---------------------------SLDC Invoice Log Book Events-----------------------//
    "change #ddlStateForSLDC": function(e, instance) {
      var state = $(e.currentTarget).val();
      if (state != '') {
        SessionStore.set("isLoading", true);
        Meteor.call("gettingDiscomState",state, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try agian!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.discomStateForSLDC.set(result.data);
                }
            }
        });
      }
      $('#ddlDiscomSateForSLDC').val('');
      $('#ddlFinancialyearSLDC').val('');
      $('#ddlPeriodSLDC').val('');
      $('#txtPaymentAmountSLDC').val('');
      $('#txtdDateOfPaymentSLDC').val('');
      instance.gettingSLDCInvoicePeriod.set();
      instance.gettingSLDCInvoiceDocument.set();
      instance.shortPaymentSLDC.set(0);
      instance.surChargeAmountForSLDC.set(0);
    },
    "change #ddlDiscomSateForSLDC": function(e, instance) {
      $('#ddlFinancialyearSLDC').val('');
      $('#ddlPeriodSLDC').val('');
      $('#txtPaymentAmountSLDC').val('');
      $('#txtdDateOfPaymentSLDC').val('');
      instance.gettingSLDCInvoicePeriod.set();
      instance.gettingSLDCInvoiceDocument.set();
      instance.shortPaymentSLDC.set(0);
      instance.surChargeAmountForSLDC.set(0);
    },
    "change #ddlFinancialyearSLDC": function(e, instance) {
      $('#ddlPeriodSLDC').val('');
      $('#txtPaymentAmountSLDC').val('');
      $('#txtdDateOfPaymentSLDC').val('');
      instance.shortPaymentSLDC.set(0);
      instance.surChargeAmountForSLDC.set(0);
      instance.gettingSLDCInvoiceDocument.set();
      var financialYear = $(e.currentTarget).val();
      var discomState = $('#ddlDiscomSateForSLDC').val();
      if (financialYear != '' && discomState != '') {
        SessionStore.set("isLoading", true);
        Meteor.call("gettingSLDCInvoicePeriod",financialYear,discomState, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try agian!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.gettingSLDCInvoicePeriod.set(result.data);
                }else {
                  SessionStore.set("isLoading", false);
                  instance.gettingSLDCInvoicePeriod.set();
                  swal(result.message);
                }
            }
        });
      }else {
        instance.gettingSLDCInvoicePeriod.set();
      }
    },
    "change #ddlPeriodSLDC": function(e, instance) {
      var id = $(e.currentTarget).val();
      $('#txtPaymentAmountSLDC').val('');
      $('#txtdDateOfPaymentSLDC').val('');
      instance.shortPaymentSLDC.set(0);
      instance.surChargeAmountForSLDC.set(0);
      if (id != '') {
        SessionStore.set("isLoading", true);
        Meteor.call("gettingDocumentForSLDCInvoice",id, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try agian!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.gettingSLDCInvoiceDocument.set(result.data);
                }
            }
        });
      }else {
        instance.gettingSLDCInvoiceDocument.set();
      }
    },
    "keyup #txtPaymentAmountSLDC" (e, instance){
      var paymentAmount = $(e.currentTarget).val();
      if (paymentAmount != '') {
        var invoiceAmount = $('#txtInvoiceAmount').val();
        var shortPayment = Number(invoiceAmount) - Number(paymentAmount);
        instance.shortPaymentSLDC.set(shortPayment);
      }else {
        instance.shortPaymentSLDC.set(0);
        instance.surChargeAmountForSLDC.set(0);
      }
    },
    "change #txtdDateOfPaymentSLDC"(e, instance){
      instance.surChargeAmountForSLDC.set(0);
      var dateOfPayment = $(e.currentTarget).val();
      if (dateOfPayment != '') {
          var payment = $(e.currentTarget).val();
          var dueDateVar = $('#txtDueDateSLDC').val();
          var dueValue = dueDateVar.split('-');
          dueValueSplit = dueValue[2] + '/' + dueValue[1] + '/' + dueValue[0];
          dueValueSplit = moment(dueValueSplit, 'YYYY-MM-DD');
          var paymentValue = payment.split('-');
          paymentValueSplit = paymentValue[2] + '/' + paymentValue[1] + '/' + paymentValue[0];
          paymentValueSplit = moment(paymentValueSplit, 'YYYY-MM-DD');
          var daysDifference = dueValueSplit.diff(paymentValueSplit, 'days');
          if (daysDifference < 0) {
              var amountRecieved = $('#txtInvoiceAmount').val();
              var difference = Math.abs(daysDifference);
              var multiply = Number(amountRecieved) * 0.0125 * 12 * Number(difference);
              var sirCharge = Number(multiply) / Number(365);
              instance.surChargeAmountForSLDC.set(Math.round(sirCharge));
          } else {
              instance.surChargeAmountForSLDC.set(0);
          }
      }
    },

   //----------------------------------------------------------------------------//
   //---------------------------Incentive Invoice Log Book Events-----------------------//
   "change #ddlDiscomStateIC": function(e, instance) {
     $('#ddlFinancialyearIncentive').val('');
     $('#txtPaymentAmountIncentive').val('');
     $('#txtdDateOfPaymentIC').val('');
     instance.incetiveFetchedData.set();
     instance.shortPaymentIC.set(0);
     instance.surChargeAmountForIC.set(0);
   },
   "change #ddlFinancialyearIncentive": function(e, instance) {
     instance.incetiveFetchedData.set();
     instance.shortPaymentIC.set(0);
     instance.surChargeAmountForIC.set(0);
     $('#txtPaymentAmountIncentive').val('');
     $('#txtdDateOfPaymentIC').val('');
     var financialYear = $(e.currentTarget).val();
     var discomId = $('#ddlDiscomStateIC').val();
     var discomState = $("#ddlDiscomStateIC").find(':selected').attr("state");
     if (discomId != '' && financialYear != '') {
       SessionStore.set("isLoading", true);
       Meteor.call("gettingIncentiveInvoice",financialYear,discomState,discomId, function(error, result) {
           if (error) {
               SessionStore.set("isLoading", false);
               swal("Please try agian!");
           } else {
               if (result.status) {
                   SessionStore.set("isLoading", false);
                   instance.incetiveFetchedData.set(result.data);
               }else {
                 SessionStore.set("isLoading", false);
                 instance.incetiveFetchedData.set();
                 instance.shortPaymentIC.set(0);
                 instance.surChargeAmountForIC.set(0);
                 swal(result.message);
               }
           }
       });
     }else {
       instance.incetiveFetchedData.set();
       instance.shortPaymentIC.set(0);
       instance.surChargeAmountForIC.set(0);
     }
   },
   "keyup #txtPaymentAmountIncentive" (e, instance){
     var paymentAmount = $(e.currentTarget).val();
     if (paymentAmount != '') {
       if (paymentAmount.match(/^[0-9]*\.?[0-9]*$/)) {
         var invoiceAmount = $('#txtInvoiceAmount').val();
         var shortPayment = Number(invoiceAmount) - Number(paymentAmount);
         instance.shortPaymentIC.set(shortPayment);
       } else {
          instance.shortPaymentIC.set(0);
           swal("Oops...", "Please enter only number!", "error");
           throw new Error("Use only numbers!");
       }
     }else {
       instance.shortPaymentIC.set(0);
       instance.surChargeAmountForIC.set(0);
     }
   },
   "change #txtdDateOfPaymentIC"(e, instance){
     instance.surChargeAmountForIC.set(0);
     var dateOfPayment = $(e.currentTarget).val();
     if (dateOfPayment != '') {
         var payment = $(e.currentTarget).val();
         var dueDateVar = $('#txtDueDateIC').val();
         var dueValue = dueDateVar.split('-');
         dueValueSplit = dueValue[2] + '/' + dueValue[1] + '/' + dueValue[0];
         dueValueSplit = moment(dueValueSplit, 'YYYY-MM-DD');
         var paymentValue = payment.split('-');
         paymentValueSplit = paymentValue[2] + '/' + paymentValue[1] + '/' + paymentValue[0];
         paymentValueSplit = moment(paymentValueSplit, 'YYYY-MM-DD');
         var daysDifference = dueValueSplit.diff(paymentValueSplit, 'days');
         if (daysDifference < 0) {
             var amountRecieved = $('#txtInvoiceAmount').val();
             var difference = Math.abs(daysDifference);
             var multiply = Number(amountRecieved) * 0.0125 * 12 * Number(difference);
             var sirCharge = Number(multiply) / Number(365);
             instance.surChargeAmountForIC.set(Math.round(sirCharge));
         } else {
             instance.surChargeAmountForIC.set(0);
         }
     }
   },

    "change #discomName": function(e, instance) {
        $('#month').val('');
        $('#invoice_type').val('');
        $('#invoice_from').val('');
        $('#selectFinancialyear').val('');
        var discomState = $("#discomName").find(':selected').attr("state");
        instance.initialDiscomData.set();
        instance.maharashtraAndRajasthanProvisional.set('');
        instance.selectedDiscomState.set(discomState);
        instance.paymentAmount.set(0);
    },
    "change #month": function(e,instance) {
        $('#invoice_type').val('');
        $('#invoice_from').val('');
        $('#selectFinancialyear').val('');
        instance.initialDiscomData.set();
        instance.paymentAmount.set(0);
    },
    'change #invoice_type' (e, instance) {
        $('#invoice_from').val('');
        $('#selectFinancialyear').val('');
        instance.maharashtraAndRajasthanProvisional.set($(e.currentTarget).val());
    },
    "change #invoice_from": function(e,instance) {
        $('#selectFinancialyear').val('');
        instance.initialDiscomData.set();
        instance.paymentAmount.set(0);
    },
    "change #selectFinancialyear": function(e, instance) {
        instance.initialDiscomData.set();
        instance.paymentAmount.set(0);
        if ($(e.currentTarget).val()) {
            var json = {
                discomId: $('#discomName').val(),
                month: $('#month').val(),
                financialYear: $(e.currentTarget).val(),
                discomState: instance.selectedDiscomState.get(),
                city: $('#invoice_from').val(),
                invoice_type: $('#invoice_type').val()
            }
            SessionStore.set("isLoading", true);
            Meteor.call("callDiscomData", json, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again!");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.initialDiscomData.set(result.data);
                    } else {
                        SessionStore.set("isLoading", false);
                        swal(result.message);
                    }
                }
            });

        }
    },
    "keyup #paymentAmountId": function(e, instance) {
      if ($('#paymentAmountId').val() != '') {
        var paymentAmount = $('#paymentAmountId').val();
        var invoiceAmt = $('.amountValue').val();
        var toReturn = Number(invoiceAmt) - Number(paymentAmount);
        instance.paymentAmount.set(toReturn);
      }else {
        instance.paymentAmount.set(0);
      }
    },
    "submit form#logbookdiscumform": function(e, instance) {
        e.preventDefault();
        if (instance.ddlEnergyType.get() == 'Energy Invoice') {//--------------------------------------Energy Invoice-------//
          var logbook_discom = '{';
          $("input.logbookdiscom,select.logbookdiscom").each(function(value, element) {
              logbook_discom += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
          });
          logbook_discom = $.parseJSON(logbook_discom.replace(/,\s*$/, '') + '}');
          if ($('#paymentAmountId').val() == '') {
            logbook_discom.payment_amount = '0';
          }else {
            logbook_discom.payment_amount = $('#paymentAmountId').val();
            if ($('#txtDateOfPaymentEnergy').val() == '') {
              swal("Please select date of payment!");
              throw new Error("Date of payment required!");
            }
          }
          if ($('#txtSirChargeAmount').val() == '') {
            logbook_discom.sur_charge_amount = '0';
          }else {
            logbook_discom.sur_charge_amount = $('#txtSirChargeAmount').val();
          }
          logbook_discom.sur_charge = "1.25%";
          logbook_discom.discom_name = $("#discomName").find(':selected').attr("discomName");
          logbook_discom.discomState = $("#discomName").find(':selected').attr("state");
          if (instance.selectedDiscomState.get() == 'Rajasthan') {
              logbook_discom.actual_energy = instance.initialDiscomData.get().actual_energy;
          } else if (instance.selectedDiscomState.get() == 'MP' || instance.selectedDiscomState.get() == 'Maharashtra') {
              logbook_discom.spdId = instance.initialDiscomData.get().spdId;
          }
          logbook_discom.year = instance.initialDiscomData.get().year;
        }
        else if (instance.ddlEnergyType.get() == 'Transmission Invoice') {//--------------------------------------Transmission Invoice-------//
          var logbook_discom = '{';
          $("input.logbookdiscom,select.logbookdiscom").each(function(value, element) {
              logbook_discom += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
          });
          logbook_discom = $.parseJSON(logbook_discom.replace(/,\s*$/, '') + '}');
          if ($('#txtPaymentAmountTC').val() == "") {
            logbook_discom.payment_amount = '0';
          }else {
            logbook_discom.payment_amount = $('#txtPaymentAmountTC').val();
            if ($('#txtdDateOfPaymentTC').val() == '') {
              swal("Please select date of payment!");
              throw new Error("Date of payment required!");
            }
          }
          if ($('#txtSirChargeAmount').val() == '') {
            logbook_discom.sur_charge_amount = '0';
          }else {
            logbook_discom.sur_charge_amount = $('#txtSirChargeAmount').val();
          }
          logbook_discom.sur_charge = "1.25%";
          logbook_discom.year = instance.fetchedDataForTC.get().year;
          logbook_discom.transmission_charges = instance.fetchedDataForTC.get().transmission_charges;
          logbook_discom.timestamp = new Date();
          logbook_discom.remarks = $('#remarks').val();
          if (logbook_discom.discom_state == 'North') {

          }
        }
        else if (instance.ddlEnergyType.get() == 'SLDC Invoice') {//--------------------------------------SLDC Invoice-------//
          var logbook_discom = '{';
          $("input.logbookdiscom,select.logbookdiscom").each(function(value, element) {
              logbook_discom += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
          });
          logbook_discom = $.parseJSON(logbook_discom.replace(/,\s*$/, '') + '}');
          if ($('#txtPaymentAmountSLDC').val() == "") {
            logbook_discom.payment_amount = '0';
          }else {
            logbook_discom.payment_amount = $('#txtPaymentAmountSLDC').val();
            if ($('#txtdDateOfPaymentSLDC').val() == '') {
              swal("Please select date of payment!");
              throw new Error("Date of payment required!");
            }
          }
          if ($('#txtSurChargeAmount').val() == '') {
            logbook_discom.sur_charge_amount = '0';
          }else {
            logbook_discom.sur_charge_amount = $('#txtSurChargeAmount').val();
          }
          logbook_discom.sur_charge = "1.25%";
          logbook_discom.sldc_charges = instance.gettingSLDCInvoiceDocument.get().sldc_charges;
          logbook_discom.sldc_charges_from = instance.gettingSLDCInvoiceDocument.get().sldc_charges_from;
          logbook_discom.sldc_charges_to = instance.gettingSLDCInvoiceDocument.get().sldc_charges_to;
          logbook_discom.year = instance.gettingSLDCInvoiceDocument.get().year;
          logbook_discom.month = instance.gettingSLDCInvoiceDocument.get().month;
          logbook_discom.timestamp = new Date();
          logbook_discom.remarks = $('#remarks').val();
        }
        else if (instance.ddlEnergyType.get() == 'Incentive Invoice') {//--------------------------------------Incentive Invoice-------//
          var logbook_discom = '{';
          $("input.logbookdiscom,select.logbookdiscom").each(function(value, element) {
              logbook_discom += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
          });
          logbook_discom = $.parseJSON(logbook_discom.replace(/,\s*$/, '') + '}');

          if ($('#txtPaymentAmountIncentive').val() == "") {
            logbook_discom.payment_amount = '0';
          }else {
            logbook_discom.payment_amount = $('#txtPaymentAmountIncentive').val();
            if ($('#txtdDateOfPaymentIC').val() == '') {
              swal("Please select date of payment!");
              throw new Error("Date of payment required!");
            }
          }
          if ($('#txtSurChargeAmount').val() == '') {
            logbook_discom.sur_charge_amount = '0';
          }else {
            logbook_discom.sur_charge_amount = $('#txtSurChargeAmount').val();
          }
          logbook_discom.sur_charge = "1.25%";
          logbook_discom.discom_state = $("#ddlDiscomStateIC").find(':selected').attr("state");
          logbook_discom.rate_per_unit = instance.incetiveFetchedData.get().rate_per_unit;
          logbook_discom.timestamp = new Date();
          logbook_discom.remarks = $('#remarks').val();
        }
        var invoiceType = $('#ddlEnergyType').val();
        // var invoiceType = 'Energy Invoice';
        swal({
            title: "Are you sure?",
            text: "You want to save Discom Logbook",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                Meteor.call("saveDiscomLogbook", logbook_discom,invoiceType, function(error, result) {
                    if (error) {
                        swal("Please try again !");
                    } else {
                        if (result.status) {
                            $('.logbookdiscom').each(function() {
                                $(this).val('');
                            });
                            instance.initialDiscomData.set();
                            instance.sirChargeAmount.set(0);
                            instance.paymentAmount.set(0);
                            instance.shortPaymentTC.set(0);
                            instance.sirChargeAmountForTC.set(0);
                            instance.shortPaymentSLDC.set(0);
                            instance.surChargeAmountForSLDC.set(0);
                            instance.shortPaymentIC.set(0);
                            instance.surChargeAmountForIC.set(0);
                            swal("Submitted!", "Successfully submitted.", "success");
                            $('#paymentAmountId').val('');
                            $('#txtPaymentAmountTC').val('')
                            $('#txtPaymentAmountSLDC').val('')
                            $('#txtPaymentAmountIncentive').val('');
                            $('#txtdDateOfPaymentIC').val('');
                            $('#remarks').val('');
                        }
                    }
                });
            }
        });
    },
    "click #btnEditForm": function(e, instance) {
      var discomId = $(e.currentTarget).attr('discomId');
      var financeYear = $('#selectFinancialyear').val();
      var month = $('#month').val();
      // if (discomId != '' && financeYear != ''  && month != '') {
      //   console.log('Discom Id = '+discomId);
      //   console.log('Financial Year = '+financeYear);
      //   console.log('Month = '+month);
      //
      //   SessionStore.set("isLoading", true);
      //   Meteor.call("getEnergyDataToEdit",month,financeYear,discomId, function(error, result) {
      //       if (error) {
      //           SessionStore.set("isLoading", false);
      //           swal("Please try again!");
      //       } else {
      //           if (result.status) {
      //               SessionStore.set("isLoading", false);
      //               instance.initialDiscomData.set(result.data);
      //           } else {
      //               SessionStore.set("isLoading", false);
      //               swal(result.message);
      //           }
      //       }
      //   });
      // }
    },
    "click #btnpreview": function(e) {
        e.preventDefault();
        var logbook_discom_btnp = '{';
        $("input.logbookdiscom,select.logbookdiscom").each(function(value, element) {
            logbook_discom_btnp += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        logbook_discom_btnp = $.parseJSON(logbook_discom_btnp.replace(/,\s*$/, '') + '}');
        var prvwdata = Template.instance();
        prvwdata.staticmodal.set(logbook_discom_btnp);
    },
    "change .dateoflogbookdiscomPayment": function(e, instance) {
        instance.sirChargeAmount.set(0);
        if ($(e.currentTarget).val()) {
            var payment = $(e.currentTarget).val();
            var dueDateNew = $('#newDueDate').val();
            var dueValue = dueDateNew.split('-');
            dueValueSplit = dueValue[2] + '/' + dueValue[1] + '/' + dueValue[0];
            dueValueSplit = moment(dueValueSplit, 'YYYY-MM-DD');
            var paymentValue = payment.split('-');
            paymentValueSplit = paymentValue[2] + '/' + paymentValue[1] + '/' + paymentValue[0];
            paymentValueSplit = moment(paymentValueSplit, 'YYYY-MM-DD');
            var daysDifference = Number(dueValueSplit.diff(paymentValueSplit, 'days')) + 30;
            if (daysDifference < 0) {
                var amountRecieved = $('.amountValue').val();
                var difference = Math.abs(daysDifference);
                var multiply = Number(amountRecieved) * 0.0125 * 12 * Number(difference);
                var sirCharge = Number(multiply) / Number(365);
                instance.sirChargeAmount.set(Math.round(sirCharge));
            } else {
                instance.sirChargeAmount.set(0);
            }
        }
    }
});
Template.logbook_discom.helpers({
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  isEnergyTypeSelected(){
    if (Template.instance().ddlEnergyType.get() == 'Energy Invoice') {
      return true;
    }else {
      return false;
    }
  },
  isTransmissionTypeSelected(){
    if (Template.instance().ddlEnergyType.get() == 'Transmission Invoice') {
      return true;
    }else {
      return false;
    }
  },
  isSLDCTypeSelected(){
    if (Template.instance().ddlEnergyType.get() == 'SLDC Invoice') {
      return true;
    }else {
      return false;
    }
  },
  isIncentiveTypeSelected(){
    if (Template.instance().ddlEnergyType.get() == 'Incentive Invoice') {
      return true;
    }else {
      return false;
    }
  },
  isMPspdStateSelectedTC(){
    if (Template.instance().spdStateSelectedForTC.get() == 'MP') {
      return true;
    }else {
      return false;
    }
  },
  isDataAvailableForEnergy(){
    if (Template.instance().initialDiscomData.get()) {
        return true;
    }else {
      return false;
    }
  },
  discomStateList(){
    if (Template.instance().discomStateForTC.get()) {
      return Template.instance().discomStateForTC.get();
    }else {
      return false;
    }
  },
  discomStateListForSLDC(){
    if (Template.instance().discomStateForSLDC.get()) {
      return Template.instance().discomStateForSLDC.get();
    }else {
      return false;
    }
  },
  periodForSLDC(){
    if (Template.instance().gettingSLDCInvoicePeriod.get()) {
      return Template.instance().gettingSLDCInvoicePeriod.get();
    }else {
      return false;
    }
  },
  returnDataToSLDCInvoice(){
    if (Template.instance().gettingSLDCInvoiceDocument.get()) {
      return Template.instance().gettingSLDCInvoiceDocument.get();
    }else {
      return false;
    }
  },
  returnTcData(){
    if (Template.instance().fetchedDataForTC.get()) {
      return Template.instance().fetchedDataForTC.get();
    }else {
      return false;
    }
  },
  shortPaymentAmountTC(){
    if (Template.instance().shortPaymentTC.get()) {
      return Template.instance().shortPaymentTC.get();
    }else {
      return '0';
    }
  },
  shortPaymentAmountSLDC(){
    var shortPayment = Template.instance().shortPaymentSLDC.get();
    if (Template.instance().shortPaymentSLDC.get()) {
      return Number(shortPayment).toFixed(2);
    }else {
      return '0';
    }
  },
  sirChargeAmountTC(){
    if (Template.instance().sirChargeAmountForTC.get()) {
      return Template.instance().sirChargeAmountForTC.get();
    }else {
      return '0';
    }
  },
  surChargeAmountSLDC(){
    if (Template.instance().surChargeAmountForSLDC.get()) {
      return Template.instance().surChargeAmountForSLDC.get();
    }else {
      return '0';
    }
  },
    shortPaymentData() {
      if (Template.instance().paymentAmount.get()) {
          return Template.instance().paymentAmount.get();
      } else {
          return '0';
      }
    },
    returnDiscomNamesIC() {
        if (Template.instance().getDiscomNameForIC.get()) {
            return Template.instance().getDiscomNameForIC.get();
        }
    },
    incentiveChargesHelper() {
        if (Template.instance().incetiveFetchedData.get()) {
            return Template.instance().incetiveFetchedData.get();
        }
    },
    shortPaymentAmountIC(){
      var shortPayment = Template.instance().shortPaymentIC.get();
      if (Template.instance().shortPaymentIC.get()) {
        return Number(shortPayment).toFixed(2);
      }else {
        return Template.instance().shortPaymentIC.get();
      }
    },
    surChargeAmountIC(){
      if (Template.instance().surChargeAmountForIC.get()) {
        return Template.instance().surChargeAmountForIC.get();
      }else {
        return '0';
      }
    },
    returnDiscomNames() {
        if (Template.instance().allDiscomNames.get()) {
            return Template.instance().allDiscomNames.get();
        }
    },
    "returnModalData": function() {
        if (Template.instance().staticmodal.get()) {
            return Template.instance().staticmodal.get();
        } else {
            return false;
        }
    },
    returnInitialData() {
        if (Template.instance().initialDiscomData.get()) {
            return Template.instance().initialDiscomData.get();
        }
    },
    // plusDaysInDueDate(dueDate) {
    // if (Template.instance().initialDiscomData.get()) {
    //     if (Template.instance().initialDiscomData.get().year) {
    //         var dueValue = dueDate.split('-');
    //         dueValueSplit = dueValue[2] + '-' + dueValue[1] + '-' + dueValue[0];
    //         dueValueSplit = moment(dueValueSplit, 'YYYY-MM-DD');
    //         var myDate = dueValueSplit.add(30, 'days');
    //         return moment(myDate).format('DD-MM-YYYY');
    //     } else {
    //         return Template.instance().initialDiscomData.get().energy_invoice_due_date;
    //     }
    //   }
    // },
    isDataFromLogBook() {
        if (Template.instance().initialDiscomData.get()) {
          var data = Template.instance().initialDiscomData.get();
          // --------------------------------Edit Option Is Time Taking,,,, thats why we can add delecte option for  last submitted invoice-------------------------
          // if (data.usedCollection == 'LogbookDiscom') {
          if (data.usedCollection == 'Above line commented due to hide table,,,,,') {
            return true;
          }else {
            return false;
          }
        }else {
          return false;
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
    sldcIncoiceAmountFixedTo2(amount){
      return Number(amount).toFixed(2);
    },
    showSirCharge() {
        if (Template.instance().initialDiscomData.get()) {
            if (Template.instance().sirChargeAmount.get()) {
                return Template.instance().sirChargeAmount.get();
            }else {
              return '0';
            }
        }else {
          return '0';
        }
    },
    periodValue(month, year) {
        if (Template.instance().initialDiscomData.get()) {
            if (year) {
                var myData = monthInWords(month)
                return myData + "'" + year;
            } else {
                return Template.instance().initialDiscomData.get().period;
            }
        }
    },
    monthReturn() {
        return monthReturn()
    },
    returnDynamicOption() {
        if (Template.instance().selectedDiscomState.get()) {
            if (dynamicOption(Template.instance().selectedDiscomState.get())) {
                return dynamicOption(Template.instance().selectedDiscomState.get());
            } else {
                return false
            }
        }
    },
    showCreditDebit() {
        if (Template.instance().selectedDiscomState.get() == 'Rajasthan' || Template.instance().selectedDiscomState.get() == 'Maharashtra') {
            return true;
        } else {
            return false
        }
    },
    isMaharashtraAndRajasthanProvisional(){
      var state = Template.instance().selectedDiscomState.get();
      if (state == 'Maharashtra') {
        if (Template.instance().maharashtraAndRajasthanProvisional.get() == 'Provisional_Invoice') {
          return false;
        }else {
          return true;
        }
      }else {
        return true;
      }
    }
});

function dynamicOption(selectedState) {
    var value = [
        {
            state: 'Rajasthan',
            option: [
                {
                    value: 'ajmer_discom',
                    key: 'Ajmer'
                }, {
                    value: 'jaipur_discom',
                    key: 'Jaipur'
                }, {
                    value: 'jodhpur_discom',
                    key: 'Jodhpur'
                }
            ]
        }, {
            state: 'Odisha',
            option: [
                {
                    key: 'Gujarat',
                    value: 'Gujarat'
                }, {
                    key: 'Rajasthan',
                    value: 'Rajasthan'
                }
            ]
        }, {
            state: 'Bihar',
            option: [
                {
                    value: 'North',
                    key: 'North Bihar'
                }, {
                    value: 'South',
                    key: 'South Bihar'
                }
            ]
        }, {
            state: 'MP',
            option: [
                {
                    value: 'cleanSolarJson',
                    key: 'Clean Solar'
                }, {
                    value: 'seiSitaraJson',
                    key: 'SEI Sitara'
                }, {
                    value: 'seiVoltaJson',
                    key: 'SEI Volta'
                }, {
                    value: 'finnSuryaJson',
                    key: 'Fortum Finnsurya'
                }, {
                    value: 'focalPhotoJson',
                    key: 'Focal Photovoltaic'
                }
            ]
        }, {
            state: 'Maharashtra',
            option: [
                {
                    value: 'jsonILFS',
                    key: 'IL & FS'
                }, {
                    value: 'JsonTodayGreen',
                    key: 'TodayGreen 5RJ'
                }, {
                    value: 'jsonShardaConstruction',
                    key: 'Sharda Construction'
                }, {
                    value: 'jsnVishvajEnergy',
                    key: 'Vishvaj Energy'
                }, {
                    value: 'jsonSunilHitech',
                    key: 'Sunil Hitech'
                }
            ]
        }
    ]
    var toReturn = '';
    _.each(value, function(item, key) {
        if (selectedState == item.state) {
            toReturn = item.option;
        }
    })
    return toReturn;
}

Template.creditDebitNote.onCreated(function paymnetNote() {
    this.gettingEnergyStateFromLogBookSPD = new ReactiveVar;
    this.gettingDiscomStateCreditDebit = new ReactiveVar;
    this.typeOfCreditDebit = new ReactiveVar;
    this.creditStateType = new ReactiveVar;
    this.discomListForTC = new ReactiveVar('');
    this.gettingSLDCInvoicePeriod = new ReactiveVar('');
    this.energyInvoicedetails = new ReactiveVar('');
    this.getTransmissiondetails = new ReactiveVar('');
    this.ifBiharIsSelected = new ReactiveVar();
    this.gettingsldcperioddetails = new ReactiveVar('');
});

Template.creditDebitNote.rendered = function() {
    $("#CreditDebit").validate({
        rules: {
            transmisionPrevRate: {
                number: true
            },
            transmisioncurrRate: {
                number: true
            },
            TransPrevEnergy: {
                number: true
            },
            TransCurrEnergy: {
                number: true
            },
        },
        messages: {
            transmisionPrevRate: {
                number: "Please enter only digits"
            },
            transmisioncurrRate: {
                number: "Please enter only digits"
            },
            TransCurrEnergy: {
                required: "Please enter only digits"
            },
            TransPrevEnergy: {
                required: "Please enter only digits"
            },
        }
    });
    var instance = Template.instance();
    Meteor.call('gettingDiscomStateCreditDebit', function(error, result) {
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        } else {
            instance.gettingDiscomStateCreditDebit.set(result.data);
        }
    });
}

Template.creditDebitNote.events({
    "submit form#CreditDebit": function(e) {
        e.preventDefault();
        var Month = $('#creditMonthTranmissionCharges').val();
        var Year = $('#creditYearTranmissionCharges').val();
        var CreditState = $('#CreditTranmissionChargesState').val();
        var FinancialYear = $('#creditFinancialYearTransmision').val();
        var DiscomState = $('#discomCreditState').val();
        var Signature = $('#TransSignatureCredit').val();
        var PrevRate = $('#transmisionPrevRate').val();
        var CurrRate = $('#transmisioncurrRate').val();
        var FromDate = $('#Credtransmission_from_date').val();
        var ToDate = $('#Credtransmission_to_date').val();
        var PrevEnergy = $('#TransPrevEnergy').val();
        var CurrEnergy = $('#TransCurrEnergy').val();
        var Invoicedate = $('#transInvoiceDateCD').val();
        var InvoiceNumOne = $('#transmisionInvoiceNumOne').val();
        var authorisedPersonName = $('#TransSignatureCredit').val();
        var authorisedPersonDesignation = $("#TransSignatureCredit").find(':selected').attr("attrDesignation");
        var authorisedPersonDesignationFull = $("#TransSignatureCredit").find(':selected').attr("attrDesignationFull");
        var authorisedPersonPhone = $("#TransSignatureCredit").find(':selected').attr("attrPhone");
        var signatureJson = {
            name: authorisedPersonName,
            designation: authorisedPersonDesignation,
            full_form: authorisedPersonDesignationFull,
            phone: authorisedPersonPhone
        };
        var Rajasjson = {
            month: Month,
            Year: Year,
            CreditState: CreditState,
            FinancialYear: FinancialYear,
            Signature: Signature,
            DiscomState: DiscomState,
            PrevRate: PrevRate,
            CurrRate: CurrRate,
        };
        var MPjson = {
            month: Month,
            Year: Year,
            CreditState: CreditState,
            DiscomState: DiscomState,
            FinancialYear: FinancialYear,
            Signature: Signature,
            PrevRate: PrevRate,
            CurrRate: CurrRate,
            FromDate: FromDate,
            ToDate: ToDate,
            PrevEnergy: PrevEnergy,
            CurrEnergy: CurrEnergy,
        };
        var Gujrjson = {
            month: Month,
            Year: Year,
            CreditState: CreditState,
            FinancialYear: FinancialYear,
            Signature: Signature,
            DiscomState: DiscomState,
            PrevRate: PrevRate,
            CurrRate: CurrRate,
            Invoicedate: Invoicedate,
            InvoiceNumOne: InvoiceNumOne,
        };

        if (CreditState == 'MP') {
            if (Month != '' && Year != '' && CreditState != '' && FinancialYear != '' && DiscomState != '' && Signature != '' && FromDate != '' && ToDate != '' && PrevEnergy != '' && CurrEnergy != '' && PrevRate != '' && CurrRate != '') {
                    SessionStore.set("isLoading",true);
                Meteor.call("TransmissionCreditPdf", MPjson, signatureJson, function(error, result) {
                    if (error) {
                      SessionStore.set("isLoading",false);
                      swal('Please try again!');
                    } else {
                        if (result.status) {
                          setTimeout(
                            function () {
                              SessionStore.set("isLoading",false);
                                window.open(result.data);
                            }, 5000);
                        } else {
                          SessionStore.set("isLoading",false);
                            swal(result.message);
                        }
                    }
                });
            } else {
                swal("Please fill all fields");
            }
        } else if (CreditState == 'Rajasthan') {
            if (Month != '' && Year != '' && CreditState != '' && FinancialYear != '' && DiscomState != '' && Signature != '' && PrevRate != '' && CurrRate != '') {
             SessionStore.set("isLoading",true);
                Meteor.call("TransmissionCreditPdf", Rajasjson, signatureJson, function(error, result) {
                    if (error) {
                      SessionStore.set("isLoading",false);
                      swal('Please try again!');
                    } else {
                        if (result.status) {
                          setTimeout(
                            function () {
                              SessionStore.set("isLoading",false);
                                window.open(result.data);
                            }, 5000);
                        } else {
                          SessionStore.set("isLoading",false);
                            swal(result.message);
                        }
                    }
                });
            } else {
                swal("Please fill all fields");
            }
        } else if (CreditState == 'Gujarat') {
            if (Month != '' && Year != '' && CreditState != '' && FinancialYear != '' && DiscomState != '' && Signature != '' && PrevRate != '' && CurrRate != '' && Invoicedate != '' && InvoiceNumOne != '') {
                 SessionStore.set("isLoading",true);
                Meteor.call("TransmissionCreditPdf", Gujrjson, signatureJson, function(error, result) {
                    if (error) {
                      SessionStore.set("isLoading",false);
                      swal('Please try again!');
                    } else {
                        if (result.status) {
                          setTimeout(
                            function () {
                              SessionStore.set("isLoading",false);
                                window.open(result.data);
                            }, 5000);
                        } else {
                          SessionStore.set("isLoading",false);
                            swal(result.message);
                        }
                    }
                });
            } else {
                swal("Please fill all fields");
            }
        }
    },
    'change #TypeOfCreditNote': function(e, instance) {
        $('#ViewCDtransDetails').hide();
        var type_of_credit = $('#TypeOfCreditNote').val();
        instance.typeOfCreditDebit.set(type_of_credit);
        instance.getTransmissiondetails.set('');
        instance.gettingSLDCInvoicePeriod.set('');
        instance.gettingsldcperioddetails.set('');
        instance.creditStateType.set('');
        instance.energyInvoicedetails.set('');

        // $('#ViewCDtransDetails').hide();
        $('ViewCDtransDetails').addClass('hidden');
    },
    'change #ddlFinancialYearSLDC': function(e, instance) {
        $('#SLDCchargesDisomDDL').val('');
        $('#ddlPeriodSLDC').val('');
        $('#CreditSLDCChargesState').val('');
        instance.gettingSLDCInvoicePeriod.set('');
        instance.gettingsldcperioddetails.set('');
        instance.ifBiharIsSelected.set();
    },
    'change #ddlPeriodSLDC':function(e, instance) {
         var period=$(e.currentTarget).val();
         var periodId= $("#ddlPeriodSLDC option:selected").attr("attr");
         if (periodId != '') {
           Meteor.call("gettingsldcperioddetails", periodId, function(error, result) {
               if (error) {
                 SessionStore.set("isLoading",false);
                 swal('Please try again!');
               } else {
                   if (result.status) {
                       instance.gettingsldcperioddetails.set(result.data);
                   } else {
                       instance.gettingsldcperioddetails.set('');
                       swal(result.message);
                   }
               }
           });
         }
           else{
               instance.gettingsldcperioddetails.set('');
           }
    },
    'change #SLDCchargesDisomDDL': function(e, instance) {
        var discomState = $(e.currentTarget).val();
        var financialYear = $('#ddlFinancialYearSLDC').val();
        instance.gettingSLDCInvoicePeriod.set('');
        instance.gettingsldcperioddetails.set('');
        if (financialYear != '' && discomState != '') {
            Meteor.call("gettingcreditSLDCInvoicePeriod", financialYear, discomState, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading",false);
                  swal('Please try again!');
                } else {
                    if (result.status) {
                        instance.gettingSLDCInvoicePeriod.set(result.data);
                    } else {
                        instance.gettingSLDCInvoicePeriod.set('');
                        swal(result.message);
                    }
                }
            });
        } else {
            instance.gettingSLDCInvoicePeriod.set('');
        }
    },
    'focus #Credtransmission_to_date' () {
        $('#Credtransmission_to_date').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        })
    },
    'focus #Credtransmission_from_date' () {
        $('#Credtransmission_from_date').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        })
    },
    'focus #transInvoiceDateCD' () {
        $('#transInvoiceDateCD').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        })
    },
    'change #CreditSLDCChargesState': function(e, instance) {
        var CreditState = $(e.currentTarget).val();
        $('#SLDCchargesDisomDDL').val('');
        $('#ddlPeriodSLDC').val('');
        instance.gettingSLDCInvoicePeriod.set('');
        instance.gettingsldcperioddetails.set('');
        instance.discomListForTC.set('');
        instance.getTransmissiondetails.set('');
        instance.creditStateType.set(CreditState);
        if (CreditState == 'Rajasthan') {
            Meteor.call("CreditRajasthanSPDListForTransmissionCharges", CreditState, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading",false);
                  swal('Please try again!');
                } else {
                    if (result.status) {
                        instance.discomListForTC.set(result.data);
                    }
                }
            });
            // show privious invoice number for gujarat only
        } else {
            var odisha = ["Odisha"];
            instance.discomListForTC.set(odisha);
        }
    },
    'change #CreditTranmissionChargesState': function(e, instance) {
        var CreditState = $(e.currentTarget).val();
        instance.getTransmissiondetails.set('');
        instance.creditStateType.set(CreditState);
        if (CreditState == 'Gujarat') {
            var discomState = 'Odisha';
            var month = $('#creditMonthTranmissionCharges').val();
            var state = $('#CreditTranmissionChargesState').val();
            var financial_year = $('#creditFinancialYearTransmision').val();
            instance.getTransmissiondetails.set('');
            Meteor.call("getTransmissionDetails", month, financial_year, state, discomState, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading",false);
                  swal('Please try again!');
                } else {
                    if (result.status) {
                        console.log(result.data);
                        instance.getTransmissiondetails.set(result.data);
                    } else {
                        swal(result.message);
                    }
                }
            });
        } else if (CreditState == 'Rajasthan') {
            Meteor.call("CreditRajasthanSPDListForTransmissionCharges", CreditState, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading",false);
                  swal('Please try again!');
                } else {
                    if (result.status) {
                        instance.discomListForTC.set(result.data);
                    }
                }
            });
            // show privious invoice number for gujarat only
        } else {
            var odisha = ["Odisha"];
            instance.discomListForTC.set(odisha);
        }
    },
    'change #creditDebitMonth': function(e, instance) {
        $('.invoice-number').val('');
        instance.energyInvoicedetails.set('');
    },
    'change #YearCreditDebit': function(e, instance) {
        $('.invoice-number').val('');
        instance.energyInvoicedetails.set('');
    },
    'change #creditMonthTranmissionCharges': function(e, instance) {
        instance.getTransmissiondetails.set('');
        $('.MPdiscomState').val('');
        $('#CreditTranmissionChargesState').val('');
    },
    'change #creditFinancialYearTransmision': function(e, instance) {
        instance.getTransmissiondetails.set('');
        $('.MPdiscomState').val('');
        $('#CreditTranmissionChargesState').val('');
    },
    'change .MPdiscomState': function(e, instance) {
        var discomState = $(e.currentTarget).val();
        var month = $('#creditMonthTranmissionCharges').val();
        var state = $('#CreditTranmissionChargesState').val();
        var financial_year = $('#creditFinancialYearTransmision').val();
        instance.getTransmissiondetails.set('');
        Meteor.call("getTransmissionDetails", month, financial_year, state, discomState, function(error, result) {
            if (error) {
              SessionStore.set("isLoading",false);
              swal('Please try again!');
            } else {
                if (result.status) {
                    instance.getTransmissiondetails.set(result.data);
                } else {
                    swal(result.message);
                }
            }
        });
    },
    'change .invoice-number': function(e, instance) {
        var discomState = $(e.currentTarget).val();
        var month = $('#creditDebitMonth').val();
        var financial_year = $('#YearCreditDebit').val();
        instance.ifBiharIsSelected.set();
        if (discomState == "Bihar") {
          instance.ifBiharIsSelected.set(true);
          instance.energyInvoicedetails.set('');
        }else {
          SessionStore.set("isLoading",false);
          instance.energyInvoicedetails.set('');
          Meteor.call("InvoiceEnergyDetails", month, financial_year, discomState, function(error, result) {
              if (error) {
                SessionStore.set("isLoading",false);
                swal('Please try again!');
              } else {
                  if (result.status) {
                    SessionStore.set("isLoading",false);
                      instance.energyInvoicedetails.set(result.data);
                  } else {
                    SessionStore.set("isLoading",false);
                      swal(result.message);
                  }
              }
          });
        }
    },
    'change #ddlBiharStateRegions': function(e, instance) {
        var region = $(e.currentTarget).val();
        var discomState = $('.invoice-number').val();
        var month = $('#creditDebitMonth').val();
        var financial_year = $('#YearCreditDebit').val();
        if (region != "") {
          SessionStore.set("isLoading",true);
          instance.energyInvoicedetails.set('');
          Meteor.call("InvoiceEnergyDetails", month, financial_year, discomState,region, function(error, result) {
              if (error) {
                SessionStore.set("isLoading",false);
                swal('Please try again!');
              } else {
                  if (result.status) {
                    SessionStore.set("isLoading",false);
                      instance.energyInvoicedetails.set(result.data);
                  } else {
                    SessionStore.set("isLoading",false);
                      swal(result.message);
                  }
              }
          });
        }
    },
    'focus #fromCreditdate' () {
        $('#fromCreditdate').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        })
    },
    'focus #ToCreditdate' () {
        var todate = $('#fromCreditdate').val();
        var todateArr = todate.split('-');
        todateArr1 = Number(todateArr[0]) + 1;
        var startdate1 = todateArr1 + "-" + todateArr[1] + "-" + todateArr[2];
        $('#ToCreditdate').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true,
            startDate: startdate1,
        })
    },
    'click #energyPdfGenerate': function(e, instance) {
        var month = $('#creditDebitMonth').val();
        var year = $('#YearCreditDebit').val();
        var stateId = $('#discomCreditState').val();
        var biharRegion = $('#ddlBiharStateRegions').val();
        var invoiceNumber = $('#credit_invoice_number').val();
        var previous_rate = $('#credit_previous_rate').val();
        // var current_rate= $('#credit_current_rate').val();
        var invoiceDate = $('#credit_invoive_date').val();
        var prevEnergy = $('#credit_previous_energy').val();
        var currEnergy = $('#credit_current_energy').val();
        var authorisedPersonName = $('#SignatureCreditState').val();
        var authorisedPersonDesignation = $("#SignatureCreditState").find(':selected').attr("attrDesignation");
        var authorisedPersonDesignationFull = $("#SignatureCreditState").find(':selected').attr("attrDesignationFull");
        var authorisedPersonPhone = $("#SignatureCreditState").find(':selected').attr("attrPhone");
        var signatureJson = {
            name: authorisedPersonName,
            designation: authorisedPersonDesignation,
            full_form: authorisedPersonDesignationFull,
            phone: authorisedPersonPhone
        };

        if (month != '' && year != '' && stateId != '' && authorisedPersonName != '' && invoiceNumber != '' && previous_rate != '' && invoiceDate != '' && prevEnergy != '' && currEnergy != '') {
            if (currEnergy.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Oops...", "Enter only digits!", "error");
                throw new Error("Use only digits!");
            }
            SessionStore.set("isLoading",true);
            Meteor.call('CreditDebitPdf', month, year, stateId, invoiceNumber, previous_rate, invoiceDate, prevEnergy, currEnergy, signatureJson,biharRegion, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading",false);
                  swal('Please try again!');
                } else {
                    if (result.status) {
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading",false);
                          instance.energyInvoicedetails.set('');
                            window.open(result.data);
                        }, 5000);
                    } else {
                      SessionStore.set("isLoading",false);
                        swal(result.message);
                    }
                }
            });
        } else {
            swal("Please fill all fields");
        }
    },
    'click #SLDCCreditDebitPdf': function(e, instance) {
        var financial_year = $('#ddlFinancialYearSLDC').val();
        var state = $('#CreditSLDCChargesState').val();
        var discomState = $('#SLDCchargesDisomDDL').val();
        var period = $('#ddlPeriodSLDC').val();
        var periodId = $("#ddlPeriodSLDC").find(':selected').attr("attr");
        var previous_rate = $('#sldcPrevRate').val();
        var current_rate = $('#sldcCurrRate').val();
        var authorisedPersonName = $('#ddlSLDCInvoiceAthorisedPerson').val();
        var authorisedPersonDesignation = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
        var authorisedPersonDesignationFull = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
        var authorisedPersonPhone = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
        var signatureJson = {
            name: authorisedPersonName,
            designation: authorisedPersonDesignation,
            full_form: authorisedPersonDesignationFull,
            phone: authorisedPersonPhone
        };

        if (financial_year != '' && state != '' && discomState != '' && period != '' && previous_rate != '' && current_rate != '' && authorisedPersonName != '') {
           SessionStore.set("isLoading",true);
            Meteor.call('SLDCCreditDebitPdf', financial_year, state, discomState, period, previous_rate, current_rate, periodId, signatureJson, function(error, result) {
                if (previous_rate.match(/^[0-9]*\.?[0-9]*$/) && current_rate.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                    swal("Oops...", "Enter only digits!", "error");
                    throw new Error("Use only digits!");
                }
                if (error) {
                  SessionStore.set("isLoading",false);
                    swal("Please try again !");
                } else {
                    if (result.status) {
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading",false);
                            window.open(result.data);
                        }, 5000);
                    } else {
                      SessionStore.set("isLoading",false);
                        swal(result.message);
                    }
                }
            });
        } else {
            swal("Please fill all fields");
        }
    }
});
Template.creditDebitNote.helpers({
    monthShow() {
        return monthReturn();
    },
    yearShow() {
        return dynamicYear();
    },
    financialYearHelper() {
        return dynamicFinancialYear();
    },
    discomState() {
        if (Template.instance().gettingDiscomStateCreditDebit.get()) {
            return Template.instance().gettingDiscomStateCreditDebit.get();
        } else {
            return false;
        }
    },
    isEnergyDebitSelected() {
        if (Template.instance().typeOfCreditDebit.get() == 'Energy') {
            return true;
        } else {
            return false;
        }
    },
    isTransmissionDebitSelected() {
        if (Template.instance().typeOfCreditDebit.get() == 'Transmission') {
            return true;
        } else {
            return false;
        }
    },
    isSLDCDebitSelected() {
        if (Template.instance().typeOfCreditDebit.get() == 'SLDC') {
            return true;
        } else {
            return false;
        }
    },
    isMPSelectedTransmissionCharges() {
        if (Template.instance().creditStateType.get() == 'MP') {
            return true;
        } else {
            return false;
        }
    },
    isRajasthanSelectedTransmissionCharges() {
        if (Template.instance().creditStateType.get() == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    isGujaratSelectedTransmissionCharges() {
        if (Template.instance().creditStateType.get() == 'Gujarat') {
            var returnData = Template.instance().getTransmissiondetails.get();
            if (returnData != '') {
                return returnData;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    authorisedSignatureArr() {
        return authorisedSignature();
    },
    "RajasthanInterSPDlistHelper": function() {
        var data = Template.instance().discomListForTC.get();
        if (data != '') {
            return data;
        } else {
            return false;
        }
    },
    periodForSLDC() {
        if (Template.instance().gettingSLDCInvoicePeriod.get()) {
            return Template.instance().gettingSLDCInvoicePeriod.get();
        } else {
            return false;
        }
    },
    energyInvoicedetails() {
        var returnData = Template.instance().energyInvoicedetails.get();
        if (returnData != '') {
            return returnData;
        } else {
            return false;
        }
    },
    getTransmissiondetailsMP() {
        if (Template.instance().creditStateType.get() == 'MP') {
            var returnData = Template.instance().getTransmissiondetails.get();
            if (returnData != '') {
                return returnData;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    getTransmissiondetailsRajasthan() {
        if (Template.instance().creditStateType.get() == 'Rajasthan') {
            var returnData = Template.instance().getTransmissiondetails.get();
            if (returnData != '') {
                return returnData;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    getTransmissiondetailsGujarat() {
        var returnData = Template.instance().getTransmissiondetails.get();
        if (returnData != '') {
            return returnData;
        } else {
            return false;
        }
    },
    ifBiharDiscomSelectedFroEnergy(){
      if (Template.instance().ifBiharIsSelected.get()) {
        return true;
      }else {
        return false;
      }
    },
    gettingsldcperioddetails(){
      var returnData = Template.instance().gettingsldcperioddetails.get();
      if (returnData != '') {
          return returnData;
      } else {
          return false;
      }
    }
});

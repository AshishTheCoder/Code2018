import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.generateInvoice.onCreated(function abcd() {
    //-----------------------Used for energy invoice---------------------//
    this.energyDataRecivedToSendOnServer = new ReactiveVar('');
    this.tcDataRecivedToSendOnServer = new ReactiveVar('');
    this.sldcDataRecivedToSendOnServer = new ReactiveVar('');
    this.rldcDataRecivedToSendOnServer = new ReactiveVar('');
    this.incentiveDataRecivedToSendOnServer = new ReactiveVar('');
    this.TypeOfInvoice = new ReactiveVar();
    this.radioBtnSelection = new ReactiveVar();
    this.discomState = new ReactiveVar();
    this.discomStateForAmendementDate = new ReactiveVar();
    this.selectedTransactionTypeVar = new ReactiveVar('');
    this.discomAddress = new ReactiveVar('');
    this.discomMonthStringVar = new ReactiveVar();
    this.discomData = new ReactiveVar();
    this.monthlyData = new ReactiveVar();
    this.monthSelected = new ReactiveVar();
    this.yearSelected = new ReactiveVar();
    this.amountWords = new ReactiveVar('');
    this.energyData = new ReactiveVar('');
    this.DiscomStateForInvoice = new ReactiveVar('');
    this.energyInvoiceReferenceNumber = new ReactiveVar('');
    this.radioValue = new ReactiveVar('');
    this.gettingTemporarySavedData = new ReactiveVar('');
    //-----------------------Used for Transmission charges---------------------//
    this.selectedYearAndMonthConCatTC = new ReactiveVar('');
    this.discomAddressTC = new ReactiveVar('');
    this.discomListForTC = new ReactiveVar('');
    this.selectedStateForTransmission = new ReactiveVar('');
    this.isStateSelectedForForTransmissionInvoice = new ReactiveVar('');
    this.SelectedSpdStateNameTC = new ReactiveVar('');
    this.dateArrTC = new ReactiveVar('');
    this.transmissionData = new ReactiveVar('');
    this.totalTC = new ReactiveVar('');
    this.transmissionInvoiceNumber = new ReactiveVar('');
    this.priviousInvoiceNumberTC = new ReactiveVar('');
    this.currentInvoiceNumberTC = new ReactiveVar('');
    //-----------------------Used for SLDC charges---------------------//
    this.discomAddressSLDC = new ReactiveVar('');
    this.SelectedSpdStateNameSLDC = new ReactiveVar('');
    this.SLDCfromDate = new ReactiveVar('');
    this.SLDCtoDate = new ReactiveVar('');
    this.selectedYearAndMonthConCatSLDCdate = new ReactiveVar('');
    this.sldcData = new ReactiveVar('');
    this.sldcAmountAndMonth = new ReactiveVar('');
    this.grandTotal = new ReactiveVar('');
    this.discomStateListForSLDC = new ReactiveVar('');
    this.typeOfInvoiceVar = new ReactiveVar('');
    this.discomDataForIncentive = new ReactiveVar('');
    this.IncentiveChargesAllData = new ReactiveVar();
    this.EditDueDateReactVar = new ReactiveVar();
    this.amount_arrReactVar = new ReactiveVar();
});
Template.generateInvoice.rendered = function() {
    SessionStore.set("isLoading",false);
    $('#loadercls').hide();
    $(function() {
        $(".uichargesform").datepicker({
            autoclose: true
        });
    });

    var instance = Template.instance();
    SessionStore.set("isLoading",true);
    Meteor.call("generateEnergyDataInvoice", function(error, result) {
        if (error) {
            SessionStore.set("isLoading",false);
            swal("Please try again !");
        } else {
            if (result.status) {
                SessionStore.set("isLoading",false);
                instance.discomState.set(result.data);
            }
        }
    });
    Meteor.call("generateIncentiveChargesData", function(error, result) {
        if (error) {
            swal("Please try again !");
        } else {
            if (result.status) {
                instance.discomDataForIncentive.set(result.data);
            }
        }
    });
};

Template.generateInvoice.events({
    "focus .txtDate": function() {
        $('.txtDate').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        });
    },
    "focus #txtInvoiceDateTC": function() {
        $('#txtInvoiceDateTC').datepicker({
            autoclose: true
        });
    },
    'change #typeOfInvoiceRadioBtn': function(e, instance){
      instance.radioValue.set('');
      instance.typeOfInvoiceVar.set('');
      instance.IncentiveChargesAllData.set('');
      instance.selectedStateForTransmission.set('');
      instance.isStateSelectedForForTransmissionInvoice.set('');
      instance.energyDataRecivedToSendOnServer.set('');
      instance.selectedTransactionTypeVar.set('');
      var redioValue = $(e.currentTarget).val();
      instance.typeOfInvoiceVar.set(redioValue);
      $('#ddlenergyInvoiceDisomCreditDebit').val('');
    },
    "change #inlineRadioForBill": function(e, t) {
        var instance = Template.instance();
        instance.DiscomStateForInvoice.set('');
        instance.energyDataRecivedToSendOnServer.set('');
        $('#ddlenergyInvoiceDisomCreditDebit').val('');
        instance.selectedTransactionTypeVar.set('');
        instance.radioValue.set($(e.currentTarget).val());
    },
    //-----------------------Events used for Energy invoice---------------------//
    "change #ddlMonthEnergyInvoice": function(e, instance) {
      instance.DiscomStateForInvoice.set('');
      instance.gettingTemporarySavedData.set('');
      $('#energyInvoiceDisom').val('');
      $('#ddlFinancialYearInvoice').val('');

      $('#ddlYearEnergyInvoice').val('');
      $('#ddlenergyInvoiceDisomCreditDebit').val('');
      $('#ddlFinancialYearEnergyInvoice').val('');
    },
    "change #ddlYearEnergyInvoice": function(e, instance) {
      instance.DiscomStateForInvoice.set('');
      instance.gettingTemporarySavedData.set('');
      $('#energyInvoiceDisom').val('');
      $('#ddlFinancialYearInvoice').val('');

      $('#ddlenergyInvoiceDisomCreditDebit').val('');
      $('#ddlFinancialYearEnergyInvoice').val('');
    },
    "change #energyInvoiceDisom": function(e, instance) {
        var discomState = $('#energyInvoiceDisom').val();
        instance.discomData.set('');
        $('#ddlFinancialYearInvoice').val('');
        instance.energyDataRecivedToSendOnServer.set('');
        instance.DiscomStateForInvoice.set(discomState);
    },
    "change #energyInvoiceSPDstate": function(e, instance){
      instance.gettingTemporarySavedData.set('');
      $('#ddlFinancialYearInvoice').val('');
    },
    "change #ddlFinancialYearInvoice": function(e, instance){
      var monthVar = $('#ddlMonthEnergyInvoice').val();
      var yearVar = $('#ddlYearEnergyInvoice').val();
      var discomVar = $('#energyInvoiceDisom').val();
      var financialYear = $('#ddlFinancialYearInvoice').val();
      var getFyear =  getCurrentFinancialYear();
      if (getFyear == financialYear) {
        var spdStateVar = $('#energyInvoiceSPDstate').val();
        if(monthVar != '' && yearVar != '' && discomVar != '' && financialYear != ''){
          Meteor.call("getTemporarySavedDataForProvisional", monthVar, yearVar, discomVar,financialYear,spdStateVar, function(error, result) {
              if (error) {
                  swal("Please try again !");
              } else {
                  if (result.status) {
                  instance.gettingTemporarySavedData.set(result.data);
                  }
              }
          });
        }
      }else {
        swal({
            title: "It is not a current financal year. Are you sure?",
            text: "You want to generate energy invoice!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, i want!",
            closeOnConfirm: true
        }, function(isConfirm) {
            if (isConfirm) {
              var spdStateVar = $('#energyInvoiceSPDstate').val();
              if(monthVar != '' && yearVar != '' && discomVar != '' && financialYear != ''){
                Meteor.call("getTemporarySavedDataForProvisional", monthVar, yearVar, discomVar,financialYear,spdStateVar, function(error, result) {
                    if (error) {
                        swal("Please try again !");
                    } else {
                        if (result.status) {
                        instance.gettingTemporarySavedData.set(result.data);
                        }
                    }
                });
              }
            } else {

            }
      });
      }
    },
    "change #ddlenergyInvoiceDisomCreditDebit": function(e, instance) {
        instance.selectedTransactionTypeVar.set('');
        instance.gettingTemporarySavedData.set('');
        var discomState = $('#ddlenergyInvoiceDisomCreditDebit').val();
        instance.DiscomStateForInvoice.set(discomState);
        $('#ddlFinancialYearEnergyInvoice').val('');
    },
    "change #ddlFinancialYearEnergyInvoice": function(e, instance){
      instance.gettingTemporarySavedData.set('');
      instance.selectedTransactionTypeVar.set('');
      var financialYear = $(e.currentTarget).val();
      var monthVar = $('#ddlMonthEnergyInvoice').val();
      var yearVar = $('#ddlYearEnergyInvoice').val();
      var discomVar = $('#ddlenergyInvoiceDisomCreditDebit').val();
      if(discomVar == 'Maharashtra' || discomVar == 'Rajasthan'){
        var getFyear =  getCurrentFinancialYear();
        if (getFyear == financialYear) {
          if(monthVar != '' && yearVar != '' && discomVar != '' && financialYear != ''){
            Meteor.call("getTemporarySavedData", monthVar, yearVar, discomVar,financialYear, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                    instance.gettingTemporarySavedData.set(result.data);
                    }
                }
            });
          }
        }else {
          swal({
              title: "It is not a current financal year. Are you sure?",
              text: "You want to generate energy invoice!",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#55dd6b",
              confirmButtonText: "Yes, i want!",
              closeOnConfirm: true
          }, function(isConfirm) {
              if (isConfirm) {
                if(monthVar != '' && yearVar != '' && discomVar != '' && financialYear != ''){
                  Meteor.call("getTemporarySavedData", monthVar, yearVar, discomVar,financialYear, function(error, result) {
                      if (error) {
                          swal("Please try again !");
                      } else {
                          if (result.status) {
                          instance.gettingTemporarySavedData.set(result.data);
                          }
                      }
                  });
                }
              } else {
                instance.gettingTemporarySavedData.set();
              }
        });
        }
      }
    },
    "click #energyBtnView": function(e, instance) {
        instance.discomData.set('');
        instance.energyDataRecivedToSendOnServer.set('');
        instance.selectedTransactionTypeVar.set('');
        $('#PrintBtnAllEnergyInvoice').show();
        instance.TypeOfInvoice.set('Energy_Invoice');
        var monthVar = $('#ddlMonthEnergyInvoice').val();
        var yearVar = $('#ddlYearEnergyInvoice').val();
        var discomVar = $('#energyInvoiceDisom').val();
        var provisonalEnergyVar = $('#provisonalEnergy').val();
        var financialYearVar = $('#ddlFinancialYearInvoice').val();
        var signatureVar = $('#ddlEnergyInvoiceAthorisedPerson').val();
        var authorisedPersonName = $('#ddlEnergyInvoiceAthorisedPerson').val();
        var authorisedPersonDesignation = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
        var authorisedPersonDesignationFull = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
        var authorisedPersonPhone = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
        var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};
        if (instance.radioValue.get() == 'provisional_invoice') {
            var spdStateVar = $('#energyInvoiceSPDstate').val();
            instance.discomListForTC.set(spdStateVar);
            instance.monthSelected.set(monthVar);
            instance.yearSelected.set(yearVar);
            if (monthVar != '' && yearVar != '' && discomVar != '' && financialYearVar != '' && provisonalEnergyVar != '' && authorisedPersonName != '') {
                if (discomVar == 'Odisha' || discomVar == 'Maharashtra') {
                    if (spdStateVar != '') {} else {
                        swal('SPD state required !');
                        throw new Error('SPD state required !');
                    }
                }
                if (discomVar == 'Bihar') {
                    if (spdStateVar != '') {} else {
                        swal('All fields are required!');
                        throw new Error('All fields are required!');
                    }
                }
                if (discomVar == 'MP') {
                  var FortumVar = $('#provisonalEnergyForFortum').val();
                  var CleanSolarVar = $('#provisonalEnergyForCleanSolar').val();
                  var FocalPhotovoltaicVar = $('#provisonalEnergyForFocalPhotovoltaic').val();
                  var JMRseiSitara = $('#JMRseiSitara').val();
                  var JMRseiVolta = $('#JMRseiVolta').val();
                  var SEAaccounting = $('#SEAaccounting').val();
                  if (FortumVar != '' && CleanSolarVar != '' && FocalPhotovoltaicVar != '' && JMRseiSitara != '' && JMRseiVolta != '' && SEAaccounting != '') {
                    Meteor.call("MPprovisionalInvoiceGeneration", monthVar, yearVar,financialYearVar,discomVar,signatureJson,FortumVar,CleanSolarVar,FocalPhotovoltaicVar,JMRseiSitara,JMRseiVolta,SEAaccounting, function(error, result) {
                        if (error) {
                            swal("Please try again !");
                        } else {
                            if (result.status) {
                              var data = result.data;
                              instance.discomData.set(data.invoiceCoverJson);
                              instance.energyDataRecivedToSendOnServer.set(data.jsonToInsert);
                            $("#modalOpenEnergyInvoice").click();
                          }
                        }
                    });
                  } else {
                      swal('All fields are required!');
                      throw new Error('All fields are required!');
                  }
                }else if (discomVar == 'Gujarat') {
                  var provVarOne = $('#provisonalEnergy1').val();
                  var provVarTwo = $('#provisonalEnergy2').val();
                  var provVarThree = $('#provisonalEnergy3').val();
                  if (provVarOne != '' && provVarTwo != '' && provVarThree != '') {
                    var json = {
                      month:monthVar,
                      year:yearVar,
                      financialYear:financialYearVar,
                      discomVar:discomVar,
                      signature:signatureJson,
                      energyOne:provVarOne,
                      energyTwo:provVarTwo,
                      energyThree:provVarThree,
                    };
                    $('#loadercls').show();
                    // setTimeout(
                      // function () {
                        Meteor.call("GujartaProvisionalInvoice",json, function(error, result) {
                            if (error) {
                                swal("Please try again !");
                                $('#loadercls').hide();
                            } else {
                                if (result.status) {
                                  setTimeout(
                                    function () {
                                        window.open(result.data);
                                        $('#loadercls').hide();
                                    }, 12000);
                                }
                            }
                        });
                      // }, 8000);
                  } else {
                      swal('All fields are required!');
                      throw new Error('All fields are required!');
                  }
                }else {
                  instance.discomStateForAmendementDate.set(discomVar);
                  var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                  var myData = getArray(dateArr, monthVar);
                  var selectedMonth = myData + "'" + yearVar;
                  instance.discomMonthStringVar.set(selectedMonth);
                  Meteor.call("ViewEnergyInvoiceData", monthVar, yearVar, discomVar, spdStateVar,provisonalEnergyVar,financialYearVar,signatureJson, function(error, result) {
                      if (error) {
                          swal("Please try again !");
                      } else {
                          if (result.status) {
                            var data = result.data;
                            if(discomVar == 'Rajasthan'){
                              instance.discomData.set(data.returnJson);
                              instance.energyDataRecivedToSendOnServer.set(data.jsonToInsert);
                              $("#modalOpenEnergyInvoice").click();
                            }else{
                              instance.discomData.set(data[0]);
                              instance.discomAddress.set(data[1]);
                              instance.energyDataRecivedToSendOnServer.set(data[2]);
                              $("#modalOpenEnergyInvoice").click();
                            }
                          }
                      }
                  });
                }
            } else {
                swal('All fields are required !');
            }
        }else if(instance.radioValue.get() == 'credit_debit_note'){
          var discomVar = $('#ddlenergyInvoiceDisomCreditDebit').val();
          var financialYear = $('#ddlFinancialYearEnergyInvoice').val();
          //for Rajasthan and Credit Debit Note
          if(discomVar == 'Rajasthan'){
            var stuLossVar = $('#energy_invoice_loss').val();
            if (monthVar != '' && yearVar != '' && discomVar != '' && stuLossVar != '' && financialYear != '' && authorisedPersonName != '') {
              if (stuLossVar.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                  swal("Enter only digits");
                  throw new Error("Use only digits!");
              }
              var annexureDataArr = [];
              var actualEnergyTotal = 0;
              $("input.annexureOneData,select.annexureOneData").each(function(value, element) {
                if($(this).val() == ''){
                  swal('All fields are required!');
                  throw new Error("All fields are required!");
                }
                if ($(this).val().match(/^[0-9]*\.?[0-9]*$/)) {} else {
                    swal("Enter only numbers!");
                    throw new Error("Use only digits!");
                }
                  actualEnergyTotal += Number($(this).val());
                  annexureDataArr.push({name:$(this).attr("name"),energy:$(this).val()});
              });

              var JaipurPreviousSellEnergyVar = $('#PreviousSellEnergyJaipur').val();
              var AjmerPreviousSellEnergyVar = $('#PreviousSellEnergAjmer').val();
              var JodhpurPreviousSellEnergyVar = $('#PreviousSellEnergyJodhpur').val();
              var totalProvisionalVar = Number(JaipurPreviousSellEnergyVar) + Number(AjmerPreviousSellEnergyVar) + Number(JodhpurPreviousSellEnergyVar);
              var gettingCalculation = Number(actualEnergyTotal) - Number(totalProvisionalVar);
              // if (gettingCalculation < 0) {
              //   var transactionVar = 'Credit';
              // }else if (gettingCalculation > 0) {
              //   var transactionVar = 'Debit';
              // }
              Meteor.call("ViewEnergyInvoiceDataForCreditDebitNote",monthVar, yearVar, discomVar,stuLossVar,annexureDataArr, JaipurPreviousSellEnergyVar, AjmerPreviousSellEnergyVar, JodhpurPreviousSellEnergyVar,financialYear,signatureJson,totalProvisionalVar, function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                        var data = result.data;
                          instance.monthlyData.set('');
                          instance.discomData.set('');
                          instance.energyData.set('');
                          instance.discomAddress.set('');
                          //same reactive variable used in provisional invoice because only one case run at a time
                          instance.monthlyData.set(data[0]);
                          instance.discomData.set(data[1]);
                          instance.energyData.set(data[2]);
                          instance.discomAddress.set(data[3]);
                          instance.energyDataRecivedToSendOnServer.set(data[4]);
                          instance.selectedTransactionTypeVar.set(data[5]);
                          $("#modalOpenEnergyInvoice").click();
                      }
                  }
              });
            }else{
              swal('All fields are required !');
            }
          }else{
            // Maharashtra Provisional Invoice and Credit Debit Note
            var annexureMonthVar = $('#ddlMonthForMaharashtra').val();
            var annexureYearVar = $('#ddlAnnexureYearEnergyInvoice').val();
            var previousProvisionalVar = $('#PreviousProvisionalEnergy').val();
            var invoiceDate = $('#txtInvoiceDate').val();
            if (monthVar != '' && yearVar != '' && invoiceDate != '' && discomVar != '' && annexureMonthVar != '' && previousProvisionalVar != '' && financialYear != '' && annexureYearVar != '' && authorisedPersonName != '') {
              if (previousProvisionalVar.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                  swal("Enter only digits");
                  throw new Error("Use only digits!");
              }
              var annexureDataArr = [];
              var actualEnergyTotal = 0;
              $("input.annexureOneData,select.annexureOneData").each(function(value, element) {
                if($(this).val() == ''){
                  swal('All fields are required!');
                  throw new Error("All fields are required!");
                }
                if ($(this).val().match(/^[0-9]*\.?[0-9]*$/)) {} else {
                    swal("Enter only numbers!");
                    throw new Error("Use only digits!");
                }
                  actualEnergyTotal += Number($(this).val());
                  annexureDataArr.push({name:$(this).attr("name"),energy:$(this).val()});
              });
              var gettingCalculation = Number(actualEnergyTotal) - Number(previousProvisionalVar);
              if (gettingCalculation < 0) {
                var transactionVar = 'Credit';
              }else if (gettingCalculation > 0) {
                var transactionVar = 'Debit';
              }
              instance.selectedTransactionTypeVar.set(transactionVar);
              Meteor.call("MaharashtraProvisionalandCreditDebitNote",monthVar, yearVar, discomVar,transactionVar,annexureDataArr,annexureMonthVar,previousProvisionalVar,financialYear,annexureYearVar,signatureJson,invoiceDate,function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                        var data = result.data;
                        instance.discomData.set('');
                        instance.discomData.set(data.returnJson);
                        instance.energyDataRecivedToSendOnServer.set(data.returnJsonForInsertData);
                          $("#modalOpenEnergyInvoice").click();
                      }
                  }
              });
            }else{
              swal('All fields are required !');
            }
          }
        }
    },
    //-----------------------Used for Transmission charges---------------------//
    "change #TranmissionChargesDisom": function(e, instance) {
      instance.tcDataRecivedToSendOnServer.set('');
      var selectedState = $(e.currentTarget).val();
        if(selectedState != ''){
          if (selectedState == 'Rajasthan') {
            instance.selectedStateForTransmission.set(selectedState);
              instance.priviousInvoiceNumberTC.set('');
              Meteor.call("RajasthanSPDListForTransmissionCharges", selectedState, function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                          instance.discomListForTC.set(result.data);
                      }
                  }
              });
              // show privious invoice number for gujarat only
          } else if ($(e.currentTarget).val() == 'Gujarat') {
              instance.selectedStateForTransmission.set(selectedState);
              instance.discomListForTC.set('');
              Meteor.call("InvoiceNumberTransmissionCharges", selectedState, function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                          instance.priviousInvoiceNumberTC.set(result.data);
                      }
                  }
              });
          }else if (selectedState == 'MP') {
              instance.selectedStateForTransmission.set(selectedState);
              // instance.discomListForTC.set('');
              // instance.priviousInvoiceNumberTC.set('');

          }
        }else{
          swal("All fields are required!")
        }
    },
    "click #transmissionChargesBtnView": function(e, instance) {
        instance.tcDataRecivedToSendOnServer.set('');
        $('#PrintBtnAllEnergyInvoice').show();
        instance.TypeOfInvoice.set('Transmission_Charges');
        var monthVar = $('#ddlMonthTranmissionCharges').val();
        var yearVar = $('#ddlYearTranmissionCharges').val();
        var discomVar = $('#TranmissionChargesDisom').val();
        var financialYearVar = $('#ddlFinancialYearTransmision').val();
        var discomStateVar = $('#TranmissionChargesSPDList').val();
        var invoiceDateVar = $('#txtInvoiceDateTC').val();
        var transmisionInvoiceNumOne = $('#transmisionInvoiceNumOne').val();
        var transmisionInvoiceNumTwo = $('#transmisionInvoiceNumTwo').val();
        var transmisionInvoiceNumThree = $('#transmisionInvoiceNumThree').val();
        var transmisionInvoiceNumFour = $('#transmisionInvoiceNumFour').val();
        var formDateForMP = $('#transmission_from_date').val();
        var toDateForMP = $('#transmission_to_date').val();
        var discomState = $('#TranmissionChargesDiscomState').val();
        var totalEnergy = $('#transmisionTotalEnergy').val();
        var authorisedPersonName = $('#ddlTranmissionAthorisedPerson').val();
        var authorisedPersonDesignation = $("#ddlTranmissionAthorisedPerson").find(':selected').attr("attrDesignation");
        var authorisedPersonDesignationFull = $("#ddlTranmissionAthorisedPerson").find(':selected').attr("attrDesignationFull");
        var authorisedPersonPhone = $("#ddlTranmissionAthorisedPerson").find(':selected').attr("attrPhone");
        var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};
        if (discomVar == 'Rajasthan') {
          console.log(discomVar);
            if (monthVar != '' && yearVar != '' && discomVar != '' && financialYearVar != '' && discomStateVar != '' && authorisedPersonName != '') {
              var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              var myData = getArray(dateArr, monthVar);
              var selectedMonth = myData + "'" + yearVar;
              instance.selectedYearAndMonthConCatTC.set(selectedMonth);
              Meteor.call("ViewTransmissionChargesData", monthVar, yearVar, discomVar, discomStateVar, invoiceArr,financialYearVar,discomState,formDateForMP,toDateForMP,totalEnergy,invoiceDateVar,signatureJson, function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                          var data = result.data;
                          instance.discomAddressTC.set(data[0]);
                          instance.SelectedSpdStateNameTC.set(data[1]);
                          instance.dateArrTC.set(data[2]);
                          instance.transmissionData.set(data[3]);
                          instance.totalTC.set(data[4]);
                          instance.transmissionInvoiceNumber.set(data[5]);
                          instance.tcDataRecivedToSendOnServer.set(data[6]);
                          instance.isStateSelectedForForTransmissionInvoice.set(discomVar);
                          $("#modalOpenTransmissionCharges").click();
                      }
                  }
              });
            }else{
              swal('All fields are required!');
            }
        }else if (discomVar == 'Gujarat') {
          var invoiceArr = [];
              if (transmisionInvoiceNumOne != '' && transmisionInvoiceNumTwo != '' && transmisionInvoiceNumThree != '' && transmisionInvoiceNumFour != '' && invoiceDateVar != '') {
                  invoiceArr.push({
                      sn: 1,
                      invoice_number: transmisionInvoiceNumOne
                  });
                  invoiceArr.push({
                      sn: 2,
                      invoice_number: transmisionInvoiceNumTwo
                  });
                  invoiceArr.push({
                      sn: 3,
                      invoice_number: transmisionInvoiceNumThree
                  });
                  invoiceArr.push({
                      sn: 4,
                      invoice_number: transmisionInvoiceNumFour
                  });
              } else {
                  swal('All fields are required!');
                  throw new Error('Invoice Number required!');
              }
          instance.currentInvoiceNumberTC.set(invoiceArr);
          if (monthVar != '' && yearVar != '' && discomVar != '' && financialYearVar != '' && authorisedPersonName != '') {
            Meteor.call("ViewTransmissionChargesData", monthVar, yearVar, discomVar, discomStateVar, invoiceArr,financialYearVar,discomState,formDateForMP,toDateForMP,totalEnergy,invoiceDateVar,signatureJson, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        var data = result.data;
                        instance.discomAddressTC.set(data[0]);
                        instance.SelectedSpdStateNameTC.set(data[1]);
                        instance.dateArrTC.set(data[2]);
                        instance.transmissionData.set(data[3]);
                        instance.totalTC.set(data[4]);
                        instance.transmissionInvoiceNumber.set(data[5]);
                        instance.tcDataRecivedToSendOnServer.set(data[6]);
                        instance.isStateSelectedForForTransmissionInvoice.set(discomVar);
                        $("#modalOpenTransmissionCharges").click();
                    }
                }
            });
          }else{
            swal('All fields are required!');
          }
        }else if (discomVar == 'MP') {
          console.log(discomVar);

          if(formDateForMP != '' && toDateForMP != '' && discomState != '' && totalEnergy != '' && authorisedPersonName != ''){
            if (totalEnergy.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Oops...", "Enter only digits!", "error");
                throw new Error("Use only digits!");
            }
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var myData = getArray(dateArr, monthVar);
            var selectedMonth = myData + "'" + yearVar;
            instance.selectedYearAndMonthConCatTC.set(selectedMonth);
            Meteor.call("ViewTransmissionChargesData", monthVar, yearVar, discomVar, discomStateVar, invoiceArr,financialYearVar,discomState,formDateForMP,toDateForMP,totalEnergy,invoiceDateVar,signatureJson, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        var data = result.data;
                        instance.discomAddressTC.set(data[0]);
                        instance.SelectedSpdStateNameTC.set(data[1]);
                        instance.dateArrTC.set(data[2]);
                        instance.transmissionData.set(data[3]);
                        instance.totalTC.set(data[4]);
                        instance.transmissionInvoiceNumber.set(data[5]);
                        instance.tcDataRecivedToSendOnServer.set(data[6]);
                        instance.isStateSelectedForForTransmissionInvoice.set(discomVar);
                        $("#modalOpenTransmissionCharges").click();
                    }
                }
            });
          }else{
            swal('All fields are required!');
            throw new Error("All fields are required!");
          }
        }
    },
    //-----------------------Used for SLDC charges---------------------//
    "change #StateForSLDCCharges": function(e, instance) {
        instance.sldcDataRecivedToSendOnServer.set('');
        instance.discomStateListForSLDC.set('');
        if ($(e.currentTarget).val() == 'Rajasthan') {
            Meteor.call("InvoiceForSLDC", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.discomStateListForSLDC.set(result.data);
                    }
                }
            });
        }
    },
    "click #SLDCChargesBtnView": function(e, instance) {
        $('#PrintBtnAllEnergyInvoice').show();
        instance.sldcDataRecivedToSendOnServer.set('');
        instance.TypeOfInvoice.set('SLDC_Charges');
        var FromDateVar = $('#sldc_from_date').val();
        var ToDateVar = $('#sldc_to_date').val();
        var discomVar = $('#StateForSLDCCharges').val();
        var discomState = $('#SLDCchargesDisomDDL').val();
        var financialYear = $('#ddlFinancialYearSLDC').val();
        var authorisedPersonName = $('#ddlSLDCInvoiceAthorisedPerson').val();
        var authorisedPersonDesignation = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
        var authorisedPersonDesignationFull = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
        var authorisedPersonPhone = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
        var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};
        if (FromDateVar != '' && ToDateVar != '' && discomVar != '' && financialYear != '' && authorisedPersonName != '') {
            if (discomVar == 'Rajasthan') {
                if (discomState == '') {
                    swal('Please select Discom State!');
                    throw new Error('Please select Discom State!');
                }
            }
            var fromDateSplit = FromDateVar.split('-');
            var toDateSplit = ToDateVar.split('-');
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var fromDateMonth = getArray(dateArr, Number(fromDateSplit[1]));
            var toDateMonth = getArray(dateArr, Number(toDateSplit[1]));
            var createdDate = fromDateMonth +"'"+fromDateSplit[2]+ ' to ' + toDateMonth + "'" + toDateSplit[2];
            instance.selectedYearAndMonthConCatSLDCdate.set(createdDate);
            instance.SLDCfromDate.set(FromDateVar);
            instance.SLDCtoDate.set(ToDateVar);
            Meteor.call("ViewSLDCChargesData", FromDateVar, ToDateVar, discomVar, discomState,financialYear,signatureJson,fromDateSplit[1],toDateSplit[1], function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        var data = result.data;
                        instance.SelectedSpdStateNameSLDC.set(data[0]);
                        instance.discomAddressSLDC.set(data[1]);
                        instance.sldcData.set(data[2]);
                        instance.sldcAmountAndMonth.set(data[3]);
                        instance.grandTotal.set(data[4]);
                        instance.sldcDataRecivedToSendOnServer.set(data[5]);
                        $("#modalOpenSLDCCharges").click();
                    }
                }
            });
        } else {
            swal('All fields are required !');
        }
    },
    //------------------------------Incentive Charges-----------------------//
    "click #IncentiveBtnSubmit": function(e, instance){
      instance.incentiveDataRecivedToSendOnServer.set('');
      instance.TypeOfInvoice.set('Incentive_Charges');
      var discomVar = $('#energyIncentiveCharges').val();
      var financialYear = $('#ddlFinancialYearIncentiveCharges').val();
      var incentiveRefVar = $('#incentiveRef').val();
      var incentiveRateVar = $('#incentiveRate').val();
      if(discomVar != '' && financialYear != '' && incentiveRefVar != '' && incentiveRateVar != ''){
        Meteor.call("IncentiveChargesData", discomVar, financialYear, incentiveRefVar, incentiveRateVar, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                  var data = result.data;
                  instance.IncentiveChargesAllData.set(data.returnJson);
                  instance.incentiveDataRecivedToSendOnServer.set(data.jsonToInsert);
                  $("#modalOpenIncentiveCharges").click();
                }
            }
        });
      }else{
        swal('All fields are required!');
      }
    },
    //------------------------------PDF Converter----------------------//
    "click #PrintBtnAllEnergyInvoice": function (e, instance) {
          $('#PrintBtnAllEnergyInvoice').hide();
        var spdState = '';
        var type = instance.TypeOfInvoice.get();
        if(type == 'Energy_Invoice'){
          var invoiceType = instance.radioValue.get();
          if (invoiceType == 'credit_debit_note') {
            var state = $('#ddlenergyInvoiceDisomCreditDebit').val();
            if(state == 'Rajasthan'){
              var databaseId = instance.energyDataRecivedToSendOnServer.get();
              var AllDiscomRowVar = $("#AllDiscomRow").html();
              var JaipurDiscomRowVar = $("#JaipurDiscomRow").html();
              var AjmerDiscomRowVar = $("#AjmerDiscomRow").html();
              var JodhpurDiscomRowVar = $("#JodhpurDiscomRow").html();
              var annexureOneRowVar = $("#annexureOneRow").html();
              var annexureTwoRowVar = $("#annexureTwoRow").html();
              AllDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              JaipurDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              AjmerDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              JodhpurDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              annexureOneRowVar +="<style> div,table{font-size:10px} </style>";
              annexureTwoRowVar +="<style> div,table{font-size:12px} </style>";
              var mainArr = [AllDiscomRowVar, JaipurDiscomRowVar, AjmerDiscomRowVar, JodhpurDiscomRowVar, annexureOneRowVar, annexureTwoRowVar];
            }else if(state == 'Maharashtra'){
              var databaseId = instance.energyDataRecivedToSendOnServer.get();
              var AllDiscomRowVar = $("#AllDiscomRow").html();
              var JaipurDiscomRowVar = $("#JaipurDiscomRow").html();
              var AjmerDiscomRowVar = $("#AjmerDiscomRow").html();
              var JodhpurDiscomRowVar = $("#JodhpurDiscomRow").html();
              AllDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              JaipurDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              AjmerDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              JodhpurDiscomRowVar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              var mainArr = [AllDiscomRowVar, JaipurDiscomRowVar, AjmerDiscomRowVar, JodhpurDiscomRowVar];
            }
          }
          else if(invoiceType == 'provisional_invoice'){
            var state = $('#energyInvoiceDisom').val();
            if(state == 'Rajasthan'){
              var databaseId = instance.energyDataRecivedToSendOnServer.get();
              var AllDiscomRowForProvisional = $("#AllDiscomRowForProvisional").html();
              var RUVNLmainSheetForProvisional = $("#RUVNLmainSheetForProvisional").html();
              var JaipurDiscomRowForProvisional = $("#JaipurDiscomRowForProvisional").html();
              var AjmerDiscomRowForProvisional = $("#AjmerDiscomRowForProvisional").html();
              var JodhpurDiscomRowForProvisional = $("#JodhpurDiscomRowForProvisional").html();
              AllDiscomRowForProvisional +="<style> .givePdfMargin{margin-top:12%}div,table{font-size:12px} </style>";
              RUVNLmainSheetForProvisional +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              JaipurDiscomRowForProvisional +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              AjmerDiscomRowForProvisional +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              JodhpurDiscomRowForProvisional +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              var mainArr = [AllDiscomRowForProvisional, RUVNLmainSheetForProvisional, JaipurDiscomRowForProvisional, AjmerDiscomRowForProvisional, JodhpurDiscomRowForProvisional];
            }else if(state == 'MP'){
              var databaseId = instance.energyDataRecivedToSendOnServer.get();
              var coverLetterMP = $("#coverLetterMP").html();
              var InvoiceForSeiSitara = $("#InvoiceForSeiSitara").html();
              var InvoiceForSeiVolta = $("#InvoiceForSeiVolta").html();
              var InvoiceForFinnSurya = $("#InvoiceForFinnSurya").html();
              var InvoiceForCleanSolar = $("#InvoiceForCleanSolar").html();
              var InvoiceForFocalPhoto = $("#InvoiceForFocalPhoto").html();
              var bifurcationSheetOfMP = $("#bifurcationSheetOfMP").html();
              coverLetterMP +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px;}, </style>";
              InvoiceForSeiSitara +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              InvoiceForSeiVolta +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              InvoiceForFinnSurya +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px;}, </style>";
              InvoiceForCleanSolar +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              InvoiceForFocalPhoto +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px;}, </style>";
              bifurcationSheetOfMP +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
              var mainArr = [coverLetterMP, InvoiceForSeiSitara, InvoiceForSeiVolta, InvoiceForFinnSurya, InvoiceForCleanSolar, InvoiceForFocalPhoto, bifurcationSheetOfMP];
            }else{
              var databaseId = instance.energyDataRecivedToSendOnServer.get();
              var coverLetterForAll = $("#coverLetterForAll").html();
              var InvoiceForAll = $("#InvoiceForAll").html();
              coverLetterForAll +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px;}, </style>";
              InvoiceForAll +="<style> .givePdfMargin{margin-top:12%}div,table{font-size:12px} </style>";
              var mainArr = [coverLetterForAll, InvoiceForAll];
            }
          }
        }else if(type == 'Transmission_Charges'){
          var databaseId = instance.tcDataRecivedToSendOnServer.get();
          var state = $('#TranmissionChargesDisom').val();
          var TransmissionCoverLetter = $("#TransmissionCoverLetter").html();
          var TransmissionInvoice = $("#TransmissionInvoice").html();
          TransmissionCoverLetter +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
          TransmissionInvoice +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
          var mainArr = [TransmissionCoverLetter,TransmissionInvoice];
        }else if(type == 'SLDC_Charges'){
          var databaseId = instance.sldcDataRecivedToSendOnServer.get();
          var state = $('#StateForSLDCCharges').val();
          var SLDCCoverLetter = $("#SLDCCoverLetter").html();
          var SLDCInvoice = $("#SLDCInvoice").html();
          SLDCCoverLetter +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
          SLDCInvoice +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
          var mainArr = [SLDCCoverLetter,SLDCInvoice];
        }else if(type == 'RLDC_Charges'){
          var databaseId = instance.rldcDataRecivedToSendOnServer.get();
          var state = $('#StateForRLDCcharges').val();
          var RLDCCoverLetter = $("#RLDCCoverLetter").html();
          RLDCCoverLetter +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
          var mainArr = [RLDCCoverLetter];
        }else if(type == 'Incentive_Charges'){
          var databaseId = instance.incentiveDataRecivedToSendOnServer.get();
          var state = $('#energyIncentiveCharges').val();
          var IncentiveCoverLetter = $("#IncentiveCoverLetter").html();
          var IncentiveInvoice = $("#IncentiveInvoice").html();
          IncentiveCoverLetter +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
          IncentiveInvoice +="<style> .givePdfMargin{margin-top:13%}div,table{font-size:12px} </style>";
          var mainArr = [IncentiveCoverLetter,IncentiveInvoice];
        }
        var isConverted = 0;
        var count = 0;
        var currentDate = new Date();
        var TodayDate = moment(currentDate).format('DD-MM-YYYY');
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        $('#loadercls').show();
            Meteor.call("convertPdf", mainArr, function (error, result) {
                if (error) {
                    swal("Error Please Contact Admin");
                } else {
                    if (result.status) {
                          var pdfLength = mainArr.length;
                            setTimeout(
                              function () {
                                  Meteor.call("mergePDF",count,invoiceType,state,spdState,TodayDate,random,type,databaseId, function (error, result) {
                                      if (error) {
                                          swal("Please try again!");
                                        $('#loadercls').hide();
                                      } else {
                                          if (result.status) {
                                              setTimeout(
                                                function () {
                                                    window.open(result.data);
                                                    $('#loadercls').hide();
                                                    var arrLength = mainArr.length;
                                                    Meteor.call("deletePDFfiles",arrLength, function () {});
                                                    instance.TypeOfInvoice.set('');
                                                }, 5000);
                                          }
                                      }
                                  });
                              }, 15000);
                    }
                }
            });

    }
});


Template.generateInvoice.helpers({
    //-----------------------Helpers used for energy invoice---------------------//
    monthShow() {
        return monthReturn();
    },
    yearShow() {
        return dynamicYear();
    },
    financialYearHelper(){
      return dynamicFinancialYear();
    },
    authorisedSignatureArr(){
      return authorisedSignature();
    },
    returnMonthToUI(value1,value2){
      if (value1 == value2) {
        return 'selected';
      }
    },
    returnYearToUI(value1,value2){
      if (value1 == value2) {
        return 'selected';
      }
    },
    isEnergyInvoiceSelected (){
      if(Template.instance().typeOfInvoiceVar.get() == 'Energy_Invoice'){
        return true;
      }else{
        return false;
      }
    },
    isTransmisioChargeseSelected (){
      if(Template.instance().typeOfInvoiceVar.get() == 'Transmission_Charges'){
        return true;
      }else{
        return false;
      }
    },
    isSLDCInvoiceSelected (){
      if(Template.instance().typeOfInvoiceVar.get() == 'SLDC_Charges'){
        return true;
      }else{
        return false;
      }
    },
    isRLDCInvoiceSelected (){
      if(Template.instance().typeOfInvoiceVar.get() == 'RLDC_Charges'){
        return true;
      }else{
        return false;
      }
    },
    isUIChargesInvoiceSelected (){
      if(Template.instance().typeOfInvoiceVar.get() == 'UI_Charges'){
        return true;
      }else{
        return false;
      }
    },
    isIncentiveChargesSelected (){
      if(Template.instance().typeOfInvoiceVar.get() == 'Incentive_Charges'){
        return true;
      }else{
        return false;
      }
    },
    isProvisionSeletedByRadio: function() {
        if (Template.instance().radioValue.get() == 'provisional_invoice') {
            return true;
        } else {
            return false;
        }
    },
    temporarySavedData: function(){
      if(Template.instance().gettingTemporarySavedData.get() != ''){
       return Template.instance().gettingTemporarySavedData.get();
      }else{
        return false;
      }
    },
    annexureTwoAllTableData:function(){
      if(Template.instance().monthlyData.get() != ''){
        return Template.instance().monthlyData.get();
      }else{
        return false;
      }
    },
    annexureTwoTotalBeforeAndAfterHelper:function(){
      if(Template.instance().discomData.get() != ''){
        return Template.instance().discomData.get();
      }else{
        return false;
      }
    },
    isCreditDebitNoteSeletedByRadio: function() {
        if (Template.instance().radioValue.get() == 'credit_debit_note') {
            return true;
        } else {
            return false;
        }
    },
    isTransactionTypeCreditSelected(){
      if(Template.instance().selectedTransactionTypeVar.get() == 'Credit'){
        return false;
      }else{
        return true;
      }
    },
    annexureOneAllDataHelper:function(){
      if(Template.instance().energyData.get() != ''){
        var data = Template.instance().energyData.get();
        return data;
      }else{
        return false;
      }
    },
    individualDataTransferByHelper:function(){
      if(Template.instance().discomAddress.get() != ''){
        var data = Template.instance().discomAddress.get();
        return data;
      }else{
        return false;
      }
    },
    "isIndividualDataTransferByHelperLineTwoAddressAvailabel": function() {
      if(Template.instance().discomAddress.get()){
        var data = Template.instance().discomAddress.get();
        if (data.addressJson.address_line_two != '') {
            return true;
        } else {
            return false;
        }
      }else{
        return false;
      }
        var data = Template.instance().discomAddress.get();
        if (data.addressJson.address_line_two != '') {
            return true;
        } else {
            return false;
        }
    },
    isRajasthanStateSelectedForProvisional: function() {
        var data = Template.instance().DiscomStateForInvoice.get();
        if (data == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    isMPStateSelectedForProvisional: function() {
        var instance = Template.instance();
        var data = instance.DiscomStateForInvoice.get();
        if (data == 'MP') {
            return true;
        } else {
            return false;
        }
    },
    isGujaratSelected: function() {
        var instance = Template.instance();
        var data = instance.DiscomStateForInvoice.get();
        if (data == 'Gujarat') {
            return true;
        } else {
            return false;
        }
    },
    mpInvoiceHelper(){
      if(Template.instance().discomData.get()){
        return Template.instance().discomData.get();
      }else{
        return false;
      }
    },
    isRestAllStateSelectedForProvisional: function() {
        var data = Template.instance().DiscomStateForInvoice.get();
          if (data == 'MP' || data == 'Rajasthan') {
              return false;
          } else {
              return true;
          }
    },
    RajasthanProvisionalInvoice: function(){
      var data = Template.instance().DiscomStateForInvoice.get();
      if (data == 'Rajasthan') {
          return Template.instance().discomData.get();
      } else {
          return false;
      }
    },
    "isRajasthanProvisionalInvoiceLineTwoAddressAvailabel": function() {
        var data = Template.instance().discomData.get();
        if(Template.instance().discomData.get()){
          if (data.cover_leter.addressJson.address_line_two != '') {
              return true;
          } else {
              return false;
          }
        }else{
          return false;
        }
    },
    maharashtraProvisionalHelper:function(){
      var instance = Template.instance();
      var data = instance.discomData.get();
      if (data != '') {
          return data;
      } else {
          return false;
      }
    },
    "isMaharashtraProvisionalHelperLineTwoAddressAvailabel": function() {
      if(Template.instance().discomData.get()){
        var data = Template.instance().discomData.get();
        if (data.addressJson.address_line_two != '') {
            return true;
        } else {
            return false;
        }
      }else{
        return false;
      }
    },
    isNewDelhiSlectedForEnergyInvoice: function() {
        var instance = Template.instance();
        var data = instance.discomListForTC.get();
        if (instance.DiscomStateForInvoice.get() == 'New Delhi') {
            return true;
        } else {
            return false;
        }
    },
    isNTPCslectedForEnergyInvoice: function() {
        var instance = Template.instance();
        var data = instance.discomListForTC.get();
        if (instance.DiscomStateForInvoice.get() == 'New Delhi(NTPC)') {
            return true;
        } else {
            return false;
        }
    },
    isTransactionTypeIntra: function() {
      if(Template.instance().discomAddress.get()){
        var data = Template.instance().discomAddress.get();
        if (data.discom_address.transaction_type == 'Intra') {
            return true;
        } else {
            return false;
        }
      }else{
        return false;
      }
    },
    isTamilNaduiSlectedForEnergyInvoice: function() {
        var instance = Template.instance();
        var data = instance.discomListForTC.get();
        if (instance.DiscomStateForInvoice.get() == 'Tamil Nadu') {
            return true;
        } else {
            return false;
        }
    },
    isAzurePowerMarsSlectedForEnergyInvoice() {
        var instance = Template.instance();
        var data = instance.discomListForTC.get();
        if (instance.DiscomStateForInvoice.get() == 'Rajasthan(APMPL)') {
            return true;
        } else {
            return false;
        }
    },
    "dataForDiscomName": function() {
        var returnData = Template.instance().discomState.get();
        if (returnData) {
            return returnData;
        } else {
            return false;
        }
    },
    "dataForIncentiveCharges": function() {
        var returnData = Template.instance().discomDataForIncentive.get();
        if (returnData) {
            return returnData;
        } else {
            return false;
        }
    },
    "currentDateForInvoice": function() {
        var todayDate = new Date();
        return moment(todayDate).format('DD MMMM YYYY');
    },
    "currentYearForInvoice": function() {
        var todayDate = new Date();
        return moment(todayDate).format('YYYY');
    },
    "viewDiscomData": function() {
        if (Template.instance().discomData.get()) {
            var data = Template.instance().discomData.get();
            return data;
        } else {
            return false;
        }
    },
    "isLineTwoAddressAvailabel": function() {
        var data = Template.instance().discomData.get();
        if(Template.instance().discomData.get()){
          if (data.discom_address.address_line_two != '') {
              return true;
          } else {
              return false;
          }
        }else{
          return false;
        }
    },
    "checkIndex": function(array, index) {
        if ((array.length - 2) == index) {
            return '&';
        } else if ((array.length - 2) > index) {
            return ',';
        }
    },
    "discomDataHelper": function() {
        var discmoAddress = Template.instance().discomAddress.get();
        if (discmoAddress != '') {
            return discmoAddress;
        } else {
            return false;
        }
    },
    "totalEnergy": function() {
        if (Template.instance().energyData.get()) {
            return Template.instance().energyData.get().toFixed(2);
        } else {
            return '0.00';
        }
    },
    "dateCount": function() {
        var month = Template.instance().monthSelected.get();
        var year = Template.instance().yearSelected.get();
        var dates = getDaysArray(year, month);
        return dates;
    },
    "returnAllData": function() {
        if (Template.instance().monthlyData.get()) {
            return Template.instance().monthlyData.get();
        } else {
            return "null";
        }
    },
    "showHelper": function(array, index, value) {
        if (Template.instance().monthlyData.get()) {
            var data = getMyDataReport(array, index, value);
            return data;
        } else {
            return false;
        }
    },
    "errorFind": function(array, index, value) {
        if (Template.instance().monthlyData.get()) {
            var data = getMyDataReport(array, index, value);
            var error = Number(data) * Number(0.0363);
            var withError = Number(data) - Number(error);
            return withError.toFixed(2);
        } else {
            return false;
        }
    },
    "collspanLengthTotal": function() {
        if (Template.instance().discomData.get()) {
            var data = Template.instance().discomData.get().length;
            return data;
        } else {
            return false;
        }
    },
    "collspanLength": function() {
        if (Template.instance().discomData.get()) {
            var data = Template.instance().discomData.get().length;
            return data + 1;
        } else {
            return false;
        }
    },
    "isOdishaDiscomSelectedForEnergyInvoice": function() {
        if (Template.instance().DiscomStateForInvoice.get() == 'Odisha') {
            return true;
        } else {
            return false;
        }
    },
    isBiharStateSelectedForEnergyInvoice: function() {
        if (Template.instance().DiscomStateForInvoice.get() == 'Bihar') {
            return true;
        } else {
            return false;
        }
    },
    isBiharOrOdishaSelected: function(){
      if(Template.instance().DiscomStateForInvoice.get() == 'Bihar' || Template.instance().DiscomStateForInvoice.get() == 'Odisha'){
        return false;
      }else{
        return true;
      }
    },
    isRajasthanStateSelectedForAzurePowerMarsComdition: function() {
        var instance = Template.instance();
        var data = instance.DiscomStateForInvoice.get();
        if (instance.DiscomStateForInvoice.get() == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    isRajasthanSelectedCreditDebit: function() {
        var instance = Template.instance();
        var data = instance.DiscomStateForInvoice.get();
        if (instance.DiscomStateForInvoice.get() == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    isMaharashtraSelectedCreditDebit: function() {
        var instance = Template.instance();
        var data = instance.DiscomStateForInvoice.get();
        if (instance.DiscomStateForInvoice.get() == 'Maharashtra') {
            return true;
        } else {
            return false;
        }
    },
    "isRajasthanForAmendmntDate": function() {
        var discomNameVar = Template.instance().discomStateForAmendementDate.get();
        if (discomNameVar == 'MP') {
            return true;
        } else {
            return false;
        }
    },
    "isRestAllDiscomSelected": function(){
      var data = Template.instance().DiscomStateForInvoice.get();
      if(data == 'Odisha' || data == 'Bihar'){
        return false;
      }else{
        return true;
      }
    },
    //-----------------------Helpers used for Transmission charges---------------------//
    "isRajasthanSelectedTransmissionCharges": function() {
        var returnData = Template.instance().selectedStateForTransmission.get();
        if (returnData == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    isGujaratSelectedTransmissionCharges: function() {
        var returnData = Template.instance().selectedStateForTransmission.get();
        if (returnData == 'Gujarat') {
            return true;
        } else {
            return false;
        }
    },
    isMPSelectedTransmissionCharges: function() {
        var returnData = Template.instance().selectedStateForTransmission.get();
        if (returnData == 'MP') {
            return true;
        } else {
            return false;
        }
    },
    "isRajasthanSelectedTransmissionChargesAndSPDSelected": function() {
        if (Template.instance().isStateSelectedForForTransmissionInvoice.get() == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    priviousInvoiceTC: function() {
        var returnData = Template.instance().priviousInvoiceNumberTC.get();
        if (returnData != '') {
            return returnData;
        } else {
            return false;
        }
    },
    "RajasthanInterSPDlistHelper": function() {
        var data = Template.instance().discomListForTC.get();
        if (data != '') {
            return data;
        } else {
            return false;
        }
    },
    "transmissionAllDataReturn": function() {
        var data = Template.instance().transmissionData.get();
        if (data != '') {
            return data;
        } else {
            return false;
        }
    },
    "selectedMonthForInvoiceTC": function() {
        var selectedDate = Template.instance().selectedYearAndMonthConCatTC.get();
        if (selectedDate != '') {
            return selectedDate;
        } else {
            return false;
        }
    },
    "discomAddressTChelper": function() {
        var discmoAddress = Template.instance().discomAddressTC.get();
        if (discmoAddress != '') {
            return discmoAddress;
        } else {
            return false;
        }
    },
    "discomAddressTChelperLineTwo": function() {
        var discmoAddress = Template.instance().discomAddressTC.get();
        if (discmoAddress != '') {
          if (discmoAddress.address_line_two != '') {
            return true;
          }else {
            return false;
          }
        } else {
            return false;
        }
    },
    "spdNameTC": function() {
        var spdName = Template.instance().SelectedSpdStateNameTC.get();
        if (spdName != '') {
            return spdName;
        } else {
            return false;
        }
    },
    isMaharashtraSelectedForTC(state){
      if (state == 'Maharashtra') {
        return true;
      }else {
        return false;
      }
    },
    "FirstAndLastDateHelper": function() {
        var dateArr = Template.instance().dateArrTC.get();
        if (dateArr != '') {
            return dateArr;
        } else {
            return false;
        }
    },
    "tranmissinTotalHelper": function() {
        var total = Template.instance().totalTC.get();
        if (total != '') {
            return total;
        } else {
            return false;
        }
    },
    "transmissionInvoiceNumberhelper": function() {
        var invoiceNum = Template.instance().transmissionInvoiceNumber.get();
        if (invoiceNum != '') {
            return invoiceNum;
        } else {
            return false;
        }
    },
    "checkIndexTC": function(array, index) {
        if ((array.length - 2) == index) {
            return ' & ';
        } else if ((array.length - 2) > index) {
            return ', ';
        }
    },
    "currentInvoiceHelper": function() {
        var current = Template.instance().currentInvoiceNumberTC.get();
        if (current != '') {
            return current;
        } else {
            return false;
        }
    },
    "convertToStringData": function(data) {
        if (data) {
            return data.toString();;
        } else {
            return false;
        }
    },
    //-----------------------Used for SLDC charges---------------------//
    "DiscomStateListForSLDC": function() {
        var returnData = Template.instance().discomStateListForSLDC.get();
        if (returnData != '') {
            return returnData;
        } else {
            return false;
        }
    },
    "isRajasthanSelectedForSLDC": function() {
        var returnData = Template.instance().discomStateListForSLDC.get();
        if (returnData != '') {
            return true;
        } else {
            return false;
        }
    },
    "discomAddressSLDChelper": function() {
        var discmoAddress = Template.instance().discomAddressSLDC.get();
        if (discmoAddress != '') {
            return discmoAddress;
        } else {
            return false;
        }
    },
    "isLineTwoAddressAvailbleSLDChelper": function() {
        var data = Template.instance().discomAddressSLDC.get();
        if (data != '') {
          if (data.address_line_two != '') {
            return true;
          }else {
            return false;
          }
        } else {
            return false;
        }
    },
    "SelectedSPDstateHelper": function() {
        var spdSatate = Template.instance().SelectedSpdStateNameSLDC.get();
        if (spdSatate != '') {
            return spdSatate;
        } else {
            return false;
        }
    },
    "SLDCfromDateHelper": function() {
        var fromDate = Template.instance().SLDCfromDate.get();
        if (fromDate != '') {
            return fromDate;
        } else {
            return false;
        }
    },
    "SLDCtoDateHelper": function() {
        var toDate = Template.instance().SLDCtoDate.get();
        if (toDate != '') {
            return toDate;
        } else {
            return false;
        }
    },
    "SLDCdateForCoverLetter": function() {
        var dateVar = Template.instance().selectedYearAndMonthConCatSLDCdate.get();
        if (dateVar != '') {
            return dateVar;
        } else {
            return false;
        }
    },
    "SLDCdataHelper": function() {
        var data = Template.instance().sldcData.get();
        if (data != '') {
            return data;
        } else {
            return false;
        }
    },
    "SLDCAllDataAmountAndMonth": function() {
        var Alldata = Template.instance().sldcAmountAndMonth.get();
        if (Alldata != '') {
            return Alldata;
        } else {
            return false;
        }
    },
    "SLDCgrandTotal": function() {
        var grnadTotal = Template.instance().grandTotal.get();
        if (grnadTotal != '') {
            return grnadTotal;
        } else {
            return false;
        }
    },
    isIncentiveChargesDataAvailable(){
    if(Template.instance().IncentiveChargesAllData.get()){
      return true;
    }else{
      return false;
    }
    },
    incentiveChargesHelper(){
      if(Template.instance().IncentiveChargesAllData.get()){
        return Template.instance().IncentiveChargesAllData.get();
      }else{
        return false;
      }
    },
    isLineTwoAddressForIC(){
      var data = Template.instance().IncentiveChargesAllData.get();
      if(Template.instance().IncentiveChargesAllData.get()){
        if (data.addressJson.address_line_two) {
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    //-----------------------------------------------RLDC Helpers------------------------
    "isGujaratSelectedForRLDC": function() {
        var data = Template.instance().rldcAllDataInJson.get();
        if (data.state == 'Gujarat') {
            return true;
        } else {
            return false;
        }
    },
    "rldcDataHelper": function() {
        var data = Template.instance().rldcAllDataInJson.get();
        if (data.state != '') {
            return data;
        } else {
            return false;
        }
    },
    collpaseNo: function(index) {
        var weekarr = [];
        for (var i = 1; i <= index + 1; i++) {
            weekarr.push(i);
        }
        return index + 1;
    },
    dueDate: function(index) {
        var arr1 = [],
            arr2 = [];
        arr1 = Template.instance().EditDueDateReactVar.get();
        arr2 = arr1.slice(index, index + 1);
        var data1 = arr2[0];
        return data1;
    },
    Amount1: function(index) {
        var arr1 = [],
            arr2 = [];
        arr1 = Template.instance().amount_arrReactVar.get();
        arr2 = arr1.slice(index * 2, index * 2 + 2);
        var data1 = arr2[0];
        return data1;
    },
    Amount2: function(index) {
        var instance = Template.instance();
        var arr1 = [],
            arr2 = [];
        arr1 = Template.instance().amount_arrReactVar.get();
        arr2 = arr1.slice(index * 2, index * 2 + 2);
        var data2 = arr2[1];
        return data2;
    },
    defaultSelectedDate(){
      return moment().format('DD-MM-YYYY');
    },
    ifNumberIsNegative(data){
      if (Number(data) < 0) {
        return (Number(data) * (-1));
      }else {
        return data;
      }
    },
    ifNumberIsNegative2(data){
      if (Number(data) < 0) {
        return (Number(data) * (-1));
      }else {
        return data;
      }
    }
});

function getArray(ary, month) {
    return ary[month - 1];
};

function getMyDataReport(array, index, value) {
    var toReturn = array[value][index];
    return toReturn;
};

function getDaysArray(year, month) {
    var date = new Date(year, month - 1, 1);
    var result = [];
    while (date.getMonth() == month - 1) {
        var update = date.getDate() + "-" + month + "-" + year;
        var newDate = update.split("-");
        var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
        result.push(moment(myObject).format('DD-MM-YYYY'));
        date.setDate(date.getDate() + 1);
    }
    return result;
};

function getDatesArr(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    while (currentDate < stopDate) {
      var currDate = moment(currentDate).format('DD-MM-YYYY');
      var currentDateVar = currentDate;
      var currentDatePlusOne = moment(currentDateVar).add(6, 'days');

      if(currentDatePlusOne < stopDate){
        var dateJson = {start_week:currDate, end_week:moment(currentDatePlusOne).format('DD-MM-YYYY')};
        dateArray.push(dateJson);
      }else{
        var dateJson = {start_week:currDate, end_week:moment(stopDate).format('DD-MM-YYYY')};
        dateArray.push(dateJson);
      }
        currentDate = moment(currentDate).add(7, 'days');
    }
    return dateArray;
}

// getCurrentFinancialYear =  function() {
//   var currentYear = moment().format('YYYY');
//   if (Number(currentMonth) < 4) {
//     var financialYear = Number(Number(currentYear) - 1)+'-'+currentYear;
//   }else {
//     var financialYear = currentYear+'-'+Number(Number(currentYear) + 1);
//   }
//   return financialYear;
// }

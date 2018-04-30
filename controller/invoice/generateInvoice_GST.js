import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.generateInvoiceGSTFormat.onCreated(function abcd() {
    //-----------------------Used for energy invoice---------------------//
    this.TypeOfInvoice = new ReactiveVar();
    this.discomState = new ReactiveVar();
    this.selectedTransactionTypeVar = new ReactiveVar('');
    this.discomData = new ReactiveVar();
    this.DiscomStateForInvoice = new ReactiveVar('');
    this.radioValue = new ReactiveVar('');
    this.gettingTemporarySavedData = new ReactiveVar('');
    //-----------------------Used for Transmission charges---------------------//
    this.discomListForTC = new ReactiveVar('');
    this.selectedStateForTransmission = new ReactiveVar('');
    this.priviousInvoiceNumberTC = new ReactiveVar('');
    //-----------------------Used for SLDC charges---------------------//
    this.discomStateListForSLDC = new ReactiveVar('');
    this.typeOfInvoiceVar = new ReactiveVar('');
    this.discomDataForIncentive = new ReactiveVar('');
});
Template.generateInvoiceGSTFormat.rendered = function() {
    SessionStore.set("isLoading",false);
    $('#loadercls').hide();
    $(function() {
        $(".uichargesform").datepicker({
            autoclose: true
        });
    });

    var instance = Template.instance();
    SessionStore.set("isLoading",true);
    Meteor.call("generateEnergyDataInvoice_GST", function(error, result) {
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
    Meteor.call("generateIncentiveChargesData_GST", function(error, result) {
        if (error) {
            swal("Please try again !");
        } else {
            if (result.status) {
                instance.discomDataForIncentive.set(result.data);
            }
        }
    });
};

Template.generateInvoiceGSTFormat.events({
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
      instance.selectedStateForTransmission.set('');
      instance.selectedTransactionTypeVar.set('');
      var redioValue = $(e.currentTarget).val();
      instance.typeOfInvoiceVar.set(redioValue);
      $('#ddlenergyInvoiceDisomCreditDebit').val('');
    },
    "change #inlineRadioForBill": function(e, t) {
        var instance = Template.instance();
        instance.DiscomStateForInvoice.set('');
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
          Meteor.call("getTemporarySavedDataForProvisional_GST", monthVar, yearVar, discomVar,financialYear,spdStateVar, function(error, result) {
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
                Meteor.call("getTemporarySavedDataForProvisional_GST", monthVar, yearVar, discomVar,financialYear,spdStateVar, function(error, result) {
                    if (error) {
                        swal("Please try again !");
                    } else {
                        if (result.status) {
                        instance.gettingTemporarySavedData.set(result.data);
                        }
                    }
                });
              }
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
            Meteor.call("getTemporarySavedData_GST", monthVar, yearVar, discomVar,financialYear, function(error, result) {
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
                  Meteor.call("getTemporarySavedData_GST", monthVar, yearVar, discomVar,financialYear, function(error, result) {
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
                    $('#loadercls').show();
                    Meteor.call("MPprovisionalInvoiceGeneration_GST", monthVar, yearVar,financialYearVar,discomVar,signatureJson,FortumVar,CleanSolarVar,FocalPhotovoltaicVar,JMRseiSitara,JMRseiVolta,SEAaccounting, function(error, result) {
                        if (error) {
                            $('#loadercls').hide();
                            swal("Please try again !");
                        } else {
                          if (result.status) {
                            setTimeout(
                              function () {
                                $('#loadercls').hide();
                                window.open(result.data);
                              }, 10000);
                          }else {
                            $('#loadercls').hide();
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
                        Meteor.call("GujartaProvisionalInvoice_GST",json, function(error, result) {
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
                  var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                  var myData = getArray(dateArr, monthVar);
                  var selectedMonth = myData + "'" + yearVar;
                  $('#loadercls').show();
                  Meteor.call("ViewEnergyInvoiceData_GST", monthVar, yearVar, discomVar, spdStateVar,provisonalEnergyVar,financialYearVar,signatureJson, function(error, result) {
                      if (error) {
                          $('#loadercls').hide();
                          swal("Please try again !");
                      } else {
                        if (result.status) {
                          setTimeout(
                            function () {
                              $('#loadercls').hide();
                              window.open(result.data);
                            }, 10000);
                        }else {
                          $('#loadercls').hide();
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
              $('#loadercls').show();
              Meteor.call("ViewEnergyInvoiceDataForCreditDebitNote_GST",monthVar, yearVar, discomVar,stuLossVar,annexureDataArr, JaipurPreviousSellEnergyVar, AjmerPreviousSellEnergyVar, JodhpurPreviousSellEnergyVar,financialYear,signatureJson,totalProvisionalVar, function(error, result) {
                  if (error) {
                    $('#loadercls').hide();
                    swal("Please try again !");
                  } else {
                    if (result.status) {
                      setTimeout(
                        function () {
                          $('#loadercls').hide();
                          window.open(result.data);
                        }, 10000);
                    }else {
                      $('#loadercls').hide();
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
              $('#loadercls').show();
              Meteor.call("MaharashtraProvisionalandCreditDebitNote_GST",monthVar, yearVar, discomVar,transactionVar,annexureDataArr,annexureMonthVar,previousProvisionalVar,financialYear,annexureYearVar,signatureJson,invoiceDate,function(error, result) {
                  if (error) {
                    $('#loadercls').hide();
                      swal("Please try again !");
                  } else {
                    if (result.status) {
                      setTimeout(
                        function () {
                          $('#loadercls').hide();
                          window.open(result.data);
                        }, 11000);
                    }else {
                      $('#loadercls').hide();
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
      var selectedState = $(e.currentTarget).val();
        if(selectedState != ''){
          if (selectedState == 'Rajasthan') {
            instance.selectedStateForTransmission.set(selectedState);
              instance.priviousInvoiceNumberTC.set('');
              Meteor.call("RajasthanSPDListForTransmissionCharges_GST", selectedState, function(error, result) {
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
              Meteor.call("InvoiceNumberTransmissionCharges_GST", selectedState, function(error, result) {
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
          }
        }else{
          swal("All fields are required!")
        }
    },
    "click #transmissionChargesBtnView": function(e, instance) {
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
            if (monthVar != '' && yearVar != '' && discomVar != '' && financialYearVar != '' && discomStateVar != '' && authorisedPersonName != '') {
              var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              var myData = getArray(dateArr, monthVar);
              var selectedMonth = myData + "'" + yearVar;
              $('#loadercls').show();
              Meteor.call("ViewTransmissionChargesData_GST", monthVar, yearVar, discomVar, discomStateVar, invoiceArr,financialYearVar,discomState,formDateForMP,toDateForMP,totalEnergy,invoiceDateVar,signatureJson, function(error, result) {
                  if (error) {
                      $('#loadercls').hide();
                      swal("Please try again !");
                  } else {
                    if (result.status) {
                      setTimeout(
                        function () {
                          $('#loadercls').hide();
                          window.open(result.data);
                        }, 11000);
                    }else {
                      $('#loadercls').hide();
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
          if (monthVar != '' && yearVar != '' && discomVar != '' && financialYearVar != '' && authorisedPersonName != '') {
            $('#loadercls').show();
            Meteor.call("ViewTransmissionChargesData_GST", monthVar, yearVar, discomVar, discomStateVar, invoiceArr,financialYearVar,discomState,formDateForMP,toDateForMP,totalEnergy,invoiceDateVar,signatureJson, function(error, result) {
                if (error) {
                    $('#loadercls').hide();
                    swal("Please try again !");
                } else {
                  if (result.status) {
                    setTimeout(
                      function () {
                        $('#loadercls').hide();
                        window.open(result.data);
                      }, 11000);
                  }else {
                    $('#loadercls').hide();
                  }
                }
            });
          }else{
            swal('All fields are required!');
          }
        }else if (discomVar == 'MP') {
          if(formDateForMP != '' && toDateForMP != '' && discomState != '' && totalEnergy != '' && authorisedPersonName != ''){
            if (totalEnergy.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Oops...", "Enter only digits!", "error");
                throw new Error("Use only digits!");
            }
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var myData = getArray(dateArr, monthVar);
            var selectedMonth = myData + "'" + yearVar;
            $('#loadercls').show();
            Meteor.call("ViewTransmissionChargesData_GST", monthVar, yearVar, discomVar, discomStateVar, invoiceArr,financialYearVar,discomState,formDateForMP,toDateForMP,totalEnergy,invoiceDateVar,signatureJson, function(error, result) {
                if (error) {
                    $('#loadercls').hide();
                    swal("Please try again !");
                } else {
                  if (result.status) {
                    setTimeout(
                      function () {
                        $('#loadercls').hide();
                        window.open(result.data);
                      }, 11000);
                  }else {
                    $('#loadercls').hide();
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
        instance.discomStateListForSLDC.set('');
        if ($(e.currentTarget).val() == 'Rajasthan') {
            Meteor.call("InvoiceForSLDC_GST", $(e.currentTarget).val(), function(error, result) {
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
            $('#loadercls').show();
            Meteor.call("ViewSLDCChargesData_GST", FromDateVar, ToDateVar, discomVar, discomState,financialYear,signatureJson,fromDateSplit[1],toDateSplit[1],createdDate, function(error, result) {
                if (error) {
                    $('#loadercls').hide();
                    swal("Please try again !");
                } else {
                    if (result.status) {
                      setTimeout(
                        function () {
                          $('#loadercls').hide();
                          window.open(result.data);
                        }, 11000);
                    }else {
                      $('#loadercls').hide();
                    }
                }
            });
        } else {
            swal('All fields are required !');
        }
    },
    //------------------------------Incentive Charges-----------------------//
    "click #IncentiveBtnSubmit": function(e, instance){
      instance.TypeOfInvoice.set('Incentive_Charges');
      var discomVar = $('#energyIncentiveCharges').val();
      var financialYear = $('#ddlFinancialYearIncentiveCharges').val();
      var incentiveRefVar = $('#incentiveRef').val();
      var incentiveRateVar = $('#incentiveRate').val();
      var authorisedPersonName = $('#ddlSLDCInvoiceAthorisedPerson').val();
      var authorisedPersonDesignation = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
      var authorisedPersonDesignationFull = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
      var authorisedPersonPhone = $("#ddlSLDCInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
      var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};
      if(discomVar != '' && financialYear != '' && incentiveRefVar != '' && incentiveRateVar != '' && authorisedPersonName != ''){
        $('#loadercls').show();
        Meteor.call("IncentiveChargesData_GST", discomVar, financialYear, incentiveRefVar, incentiveRateVar,signatureJson, function(error, result) {
            if (error) {
              $('#loadercls').hide();
              swal("Please try again !");
            } else {
                if (result.status) {
                  setTimeout(
                    function () {
                      $('#loadercls').hide();
                      window.open(result.data);
                    }, 11000);
                }else {
                  $('#loadercls').hide();
                }
            }
        });
      }else{
        swal('All fields are required!');
      }
    }
});

Template.generateInvoiceGSTFormat.helpers({
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
    isCreditDebitNoteSeletedByRadio: function() {
        if (Template.instance().radioValue.get() == 'credit_debit_note') {
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
    defaultSelectedDate(){
      return moment().format('DD-MM-YYYY');
    },
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

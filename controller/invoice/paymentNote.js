import { ReactiveVar } from 'meteor/reactive-var';

Template.paymentNoteForSPDInvoice.onCreated(function paymnetNote(){
  this.typeOfInvoiceVar = new ReactiveVar;
  this.selectedTransmissionState = new ReactiveVar;
  this.selectedSLDCState = new ReactiveVar;
  this.selectedIncentiveState = new ReactiveVar;
  this.gettingEnergyStateFromLogBookSPD = new ReactiveVar;
  this.getEnergySPDListFromLogBookSPD = new ReactiveVar;
  this.getSPDDataForPaymentNote = new ReactiveVar;
  this.checkPaymentNote = new ReactiveVar();
  this.checkGeneratedTCPaymentNote = new ReactiveVar(0);
  this.checkGeneratedSLDCPaymentNote = new ReactiveVar(0);
  this.checkGeneratedRLDCPaymentNote = new ReactiveVar(0);
  this.checkGeneratedIncentivePaymentNote = new ReactiveVar(0);
  this.noOfSPDSelected = new ReactiveVar;
  this.spdIndex = new ReactiveVar;
  this.GettingDetailsForPaymentNote = new ReactiveVar;
});

Template.paymentNoteForSPDInvoice.rendered = function(){
    SessionStore.set("isLoading", false);
};

Template.paymentNoteForSPDInvoice.events({
  'focus .datepicker' () {
      $('.datepicker').datepicker({format: 'dd-mm-yyyy', autoclose: true})
  },
  'focus .datepickerDot' () {
      $('.datepickerDot').datepicker({format: 'dd.mm.yyyy', autoclose: true})
  },
  'change #ddlTypeOfPaymentNote': function(e, instance){
    var paymentNoteType = $(e.currentTarget).val();
    instance.typeOfInvoiceVar.set(paymentNoteType);
    instance.selectedTransmissionState.set('');
    instance.selectedSLDCState.set('');
    instance.selectedIncentiveState.set('');
    instance.gettingEnergyStateFromLogBookSPD.set('');
    instance.getEnergySPDListFromLogBookSPD.set('');
    instance.getSPDDataForPaymentNote.set('');
    instance.checkPaymentNote.set();
    instance.checkGeneratedTCPaymentNote.set(0);
    instance.checkGeneratedSLDCPaymentNote.set(0);
    instance.checkGeneratedRLDCPaymentNote.set(0);
    instance.checkGeneratedIncentivePaymentNote.set(0);
  },
  'change #ddlMonthEnergyPaymentNote': function(e, instance){
    var month = $(e.currentTarget).val();
    $('#ddlFinancialYearEnergy').val('');
    $('#StateForEnergyPaymentNote').val('');
    $('#ddlSPDListEnergy').val('');
    instance.gettingEnergyStateFromLogBookSPD.set('');
    instance.getEnergySPDListFromLogBookSPD.set('');
    instance.getSPDDataForPaymentNote.set('');
    instance.checkPaymentNote.set();
  },
  'change #ddlFinancialYearEnergy': function(e, instance){
    var financialYear = $(e.currentTarget).val();
    var month = $('#ddlMonthEnergyPaymentNote').val();
    $('#StateForEnergyPaymentNote').val('');
    $('#ddlSPDListEnergy').val('');
    instance.gettingEnergyStateFromLogBookSPD.set('');
    instance.getEnergySPDListFromLogBookSPD.set('');
    instance.getSPDDataForPaymentNote.set('');
    instance.checkPaymentNote.set();
    if(month != '' && financialYear != ''){
      SessionStore.set("isLoading",true);
      Meteor.call('gettingSPDStateLogBookSPD',month,financialYear, function(error, result){
        if (error) {
            SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
          if(result.status){
            SessionStore.set("isLoading",false);
            instance.gettingEnergyStateFromLogBookSPD.set(result.data);
          }else {
            SessionStore.set("isLoading",false);
            instance.gettingEnergyStateFromLogBookSPD.set('');
          }
        }
      });
      Meteor.setTimeout(function () {
        $('#StateForEnergyPaymentNote').multiselect({
           buttonWidth: '360px',
           includeSelectAllOption: true,
       });
      },1000);
    }
  },
  'change #StateForEnergyPaymentNote': function(e, instance){
    Meteor.setTimeout(function () {
      $('#ddlSPDListEnergy').multiselect({
         buttonWidth: '360px',
         includeSelectAllOption: true,
     });
    },1000);
    $('#btnEnergyPayment').show();
    instance.getEnergySPDListFromLogBookSPD.set('');
    instance.getSPDDataForPaymentNote.set('');
    instance.checkPaymentNote.set();
    $('#ddlSPDListEnergy').val('');
    var state = $(e.currentTarget).val();
    var month = $('#ddlMonthEnergyPaymentNote').val();
    var financialYear = $('#ddlFinancialYearEnergy').val();
    if (state != null) {
      if(month != '' && financialYear != '' ){
        var json = {month:month,financialYear:financialYear,state:state};
        SessionStore.set("isLoading",true);
        Meteor.call('gettingSPDListFromLogBookSPD',json, function(error, result){
          if (error) {
              SessionStore.set("isLoading",false);
            swal('Please try again!');
          }else {
            if(result.status){
              SessionStore.set("isLoading",false);
              instance.getEnergySPDListFromLogBookSPD.set(result.data);
            }else {
              SessionStore.set("isLoading",false);
              instance.getEnergySPDListFromLogBookSPD.set('');
              swal(result.message);
            }
          }
        });
      }
    }
    // if(month != '' && financialYear != '' && state != ''){
    //   var json = {month:month,financialYear:financialYear,state:state};
    //   SessionStore.set("isLoading",true);
    //   Meteor.call('gettingSPDListFromLogBookSPD',json, function(error, result){
    //     if (error) {
    //         SessionStore.set("isLoading",false);
    //       swal('Please try again!');
    //     }else {
    //       if(result.status){
    //         SessionStore.set("isLoading",false);
    //         instance.getEnergySPDListFromLogBookSPD.set(result.data);
    //       }else {
    //         SessionStore.set("isLoading",false);
    //         instance.getEnergySPDListFromLogBookSPD.set('');
    //         swal(result.message);
    //       }
    //     }
    //   });
    // }

  },
  'change #ddlSPDListEnergy': function(e, instance){
    $('#btnEnergyPayment').show();
    var spdIds = $(e.currentTarget).val();
    var state = $('#StateForEnergyPaymentNote').val();
    var month = $('#ddlMonthEnergyPaymentNote').val();
    var financialYear = $('#ddlFinancialYearEnergy').val();
    instance.getSPDDataForPaymentNote.set('');
    instance.checkPaymentNote.set();
    if(spdIds != null){
      instance.spdIndex.set(spdIds.length);
      SessionStore.set("isLoading",true);
      Meteor.call('getDataFromLogBookForPaymentNote',month, financialYear, state, spdIds, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
          if(result.status){
            SessionStore.set("isLoading",false);
            var data = result.data;
            instance.getSPDDataForPaymentNote.set(true);
            instance.noOfSPDSelected.set(data);
            instance.checkPaymentNote.set(data.getData);
          }else {
            SessionStore.set("isLoading",false);
            instance.getSPDDataForPaymentNote.set('');
            swal(result.message);
          }
        }
      });
    }
  },
  'keyup #txtDeducation': function(e, instance){
    var index = $(e.currentTarget).attr('attrInd');
    $('.clsPaymentToReleased'+index).val('');
  },
  'keyup #txtPaymentToReleased': function(e, instance){
    var index = $(e.currentTarget).attr('attrInd');
    var invoiceAmount = $('.clsInvoiceAmount'+index).val();
    var deducationIf = $('.clsDeducation'+index).val();
    var paymentReleased = $('.clsPaymentToReleased'+index).val();
    if(paymentReleased != ''){
      if(deducationIf != ''){
        if (deducationIf.match(/^[0-9]*\.?[0-9]*$/)) {
          var deductionVar = deducationIf;
        } else {
            swal("Oops...", "Enter only digits if deducation available!", "error");
            throw new Error("Use only digits!");
        }
      }else {
        var deductionVar = 0;
      }
        if (paymentReleased.match(/^[0-9]*\.?[0-9]*$/)) {
          var paymentReleasedVar = paymentReleased;
        } else {
            swal("Oops...", "Enter only digits!", "error");
            throw new Error("Use only digits!");
        }
       var remaningAmount = Number(Number(invoiceAmount) - Number(deductionVar) - Number(paymentReleasedVar)).toFixed(2);
       $('.clsDeducation'+index).val(deducationIf);
       $('.clsPaymentToReleased'+index).val(paymentReleased);
       $('.clsRemaningAmount'+index).val(remaningAmount);
    }else{
      $('.clsDeducation'+index).val('');
      $('.clsPaymentToReleased'+index).val('');
      $('.clsRemaningAmount'+index).val('');
    }
  },
  'click #btnEnergyPayment': function(e, instance){
    var numberOfSPD = instance.spdIndex.get();
    var jsonArr = [];
    var random = Math.floor((Math.random() * 10000) + 1).toString();
    for (var i = 0; i < Number(numberOfSPD); i++) {
      var deducationIf = $('.clsDeducation'+i).val();
      var paymentReleased = $('.clsPaymentToReleased'+i).val();
      var remaningAmount = $('.clsRemaningAmount'+i).val();
      var state = $('#StateForEnergyPaymentNote').val();
      var energyPurchased = $('.clsEnergyPurchased'+i).val();
      var remarks = $('.clsRemarks'+i).val();
      var jsonDataArr = instance.noOfSPDSelected.get();
      var jsonData = jsonDataArr[i].returnJson;
      var spdId = jsonData.clientId;
        var json = {
          spd_id:spdId,
          month:jsonData.month,
          year:jsonData.year,
          state:jsonData.clientState,
          energyPurchased:energyPurchased,
          period:monthInWords(jsonData.month)+"'"+jsonData.year,
          random:random,
          financialYear:jsonData.financial_year,
          generatedDate:moment().format('DD-MM-YYYY'),
          clientId:jsonData.clientId,
          clientState:jsonData.clientState,
          nameOfEntity:jsonData.nameOfEntity,
          invoiceNumber:jsonData.invoiceNumber,
          dateOfReceipt:jsonData.dateOfReceipt,
          dueDate:jsonData.dueDate,
          capacity:jsonData.capacity,
          billedUnits:jsonData.billedUnits,
          rate:jsonData.rate,
          invoiceAmount:jsonData.invoiceAmount,
          exceedEnergy : jsonData.exceedEnergy,
          exceedAmount : jsonData.exceedAmount,
          minkWh : jsonData.minkWh,
          maxkWh : jsonData.maxkWh,
          deducationIfAny:deducationIf,
          releasedPayment:paymentReleased,
          remaningAmount:remaningAmount,
          remark:remarks,
          delete_status: false,
          initialisedForApproval: false,
          sixLevelStatus:'',
          timestamp:new Date()
        };
        jsonArr.push(json);
    }
      var checkData = instance.checkPaymentNote.get();
        swal({
            title: "Are you sure?",
            text: "You want to generate payment note ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, generate it!",
            closeOnConfirm: true
        }, function(isConfirm) {
            if (isConfirm) {
                SessionStore.set("isLoading",true);
                Meteor.call('generatePaymentNoteOfEnergy',jsonArr, function(error, result){
                  if (error) {
                      SessionStore.set("isLoading",false);
                      swal('Please try again!');
                  }else {
                    if(result.status){
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading",false);
                          $('#ddlSPDListEnergy').val('');
                          instance.getSPDDataForPaymentNote.set('');
                          instance.checkPaymentNote.set();
                          window.open('/upload/'+result.data);
                        }, 10000);
                    }else {
                      SessionStore.set("isLoading",false);
                      swal(result.message);
                    }
                  }
                });
            } else {
                // if user do not want to generate
            }
        });
  },
  'change #ddlFinancialYearRLDC': function(e, instance) {
    var month = $('#ddlMonthRLDCPaymentNote').val();
    var year = $('#ddlYearRLDCPaymentNote').val();
    var state = $('#StateForRLDCPaymentNote').val();
    var financialYear = $(e.currentTarget).val();
    if(month != '' && year != '' && state != '' && financialYear){
      SessionStore.set("isLoading",true);
      Meteor.call('checkGeneratedRLDCPaymentNote',month,year,state,financialYear, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
          if(result.status){
          SessionStore.set("isLoading",false);
          instance.checkGeneratedRLDCPaymentNote.set(result.data);
          }
        }
      });
    }
  },
  'click #btnRLDCPayment': function(e, instance){
    var month = $('#ddlMonthRLDCPaymentNote').val();
    var year = $('#ddlYearRLDCPaymentNote').val();
    var state = $('#StateForRLDCPaymentNote').val();
    var financialYear = $('#ddlFinancialYearRLDC').val();
    var paymentNoteType = $('#ddlTypeOfPaymentNote').val();
    var socVar = $('#socRLDC').val();
    var mocVar = $('#mocRLDC').val();
    var checkData = instance.checkGeneratedRLDCPaymentNote.get();
    if(month != '' && year != '' && state != '' && financialYear != '' && socVar != '' && mocVar != ''){
      var random = Math.floor((Math.random() * 10000) + 1).toString();
      var json = {random:random,month:month,year:year,state:state,financialYear:financialYear,socVar:socVar,mocVar:mocVar,appType:paymentNoteType+'_'+state};
      if (Number(checkData) > 0) {
        swal({
            title: "Are you sure?",
            text: "It is already generated, Do you want to generate it again ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, generate it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
              SessionStore.set("isLoading",true);
              Meteor.call('paymentNoteOfRLDC',json, function(error, result){
                if (error) {
                    SessionStore.set("isLoading",false);
                  swal('Please try again!');
                }else {
                  if(result.status){
                    setTimeout(
                      function () {
                        SessionStore.set("isLoading",false);
                        window.open('/upload/'+result.data);
                        $('#StateForRLDCPaymentNote').val('');
                        $('#ddlFinancialYearRLDC').val('');
                        $('#socRLDC').val('');
                        $('#mocRLDC').val('');
                      }, 10000);
                  }
                }
              });
            } else {
                // if user do not want to generate
            }
        });
      }else {
        SessionStore.set("isLoading",true);
        Meteor.call('paymentNoteOfRLDC',json, function(error, result){
          if (error) {
              SessionStore.set("isLoading",false);
            swal('Please try again!');
          }else {
            if(result.status){
              setTimeout(
                function () {
                  SessionStore.set("isLoading",false);
                  window.open('/upload/'+result.data);
                  $('#StateForRLDCPaymentNote').val('');
                  $('#ddlFinancialYearRLDC').val('');
                  $('#socRLDC').val('');
                  $('#mocRLDC').val('');
                }, 10000);
            }
          }
        });
      }
    }else{
      swal('All fields are required!');
    }
  },
  'change #ddlMonthTransmissionPaymentNote': function(e, instance){
    $('#StateForTransmissionPaymentNote').val('');
    instance.selectedTransmissionState.set();
    instance.GettingDetailsForPaymentNote.set();
  },
  'change #ddlYearTransmissionPaymentNote': function(e, instance){
    instance.selectedTransmissionState.set();
    instance.GettingDetailsForPaymentNote.set();
    $('#StateForTransmissionPaymentNote').val('');
  },
  'change #StateForTransmissionPaymentNote': function(e, instance){
    var stateVar = $(e.currentTarget).val();
    instance.selectedTransmissionState.set();
    instance.GettingDetailsForPaymentNote.set();
    instance.selectedTransmissionState.set(stateVar);
    // $('#ddlFinancialYearTransmission').val('');
    instance.checkGeneratedTCPaymentNote.set(0);
    var month = $('#ddlMonthTransmissionPaymentNote').val();
    var financial_year = $('#ddlFinancialYearTransmission').val();
    var paymentNoteType= $('#ddlTypeOfPaymentNote').val();
    if(month !='' && financial_year !='' && stateVar != '' && paymentNoteType != ''){
      SessionStore.set("isLoading",true);
      Meteor.call('GettingDetailsForPaymentNote',month,financial_year,stateVar,paymentNoteType, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
            if(result.status==true){
          SessionStore.set("isLoading",false);
          instance.GettingDetailsForPaymentNote.set(result.data);
        }else{
          SessionStore.set("isLoading",false);
        }
        }
      });
    }else{
      swal("Please fill all fields");
    }
  },
  'change #ddlFinancialYearTransmission': function(e, instance){
    $('#StateForTransmissionPaymentNote').val('');
    instance.selectedTransmissionState.set();
    instance.GettingDetailsForPaymentNote.set();
    var month = $('#ddlMonthTransmissionPaymentNote').val();
    var year = $('#ddlYearTransmissionPaymentNote').val();
    var state = $('#StateForTransmissionPaymentNote').val();
    var financialYear = $(e.currentTarget).val();
    if (month != '' && year != '' && state != '' && financialYear != '') {
      SessionStore.set("isLoading",true);
      Meteor.call('checkGeneratedTCPaymentNote',month,year,state,financialYear, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
          if(result.status){
          SessionStore.set("isLoading",false);
          instance.checkGeneratedTCPaymentNote.set(result.data);
          }
        }
      });
    }
  },
  'click #btnTransmissionPayment': function (e, instance) {
    var month = $('#ddlMonthTransmissionPaymentNote').val();
    var year = $('#ddlYearTransmissionPaymentNote').val();
    var state = $('#StateForTransmissionPaymentNote').val();
    var financialYear = $('#ddlFinancialYearTransmission').val();
    var checkData = instance.checkGeneratedTCPaymentNote.get();
    if(state == 'Gujarat'){
      var raisedDate = $('.raisedDate').val();
      var receivedDate = $('.recievedDate').val();
      var invoiceNumber = [];
      $('.invoiceNumber').each(function() {
          if ($(this).val()) {
              invoiceNumber.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var invoiceAmount = [];
      $('.invoiceAmount').each(function() {
          if ($(this).val()) {
              invoiceAmount.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var invoiceDate = [];
      $('.invoiceDate').each(function() {
          if ($(this).val()) {
              invoiceDate.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var dueDate = [];
      $('.dueDate').each(function() {
          if ($(this).val()) {
              dueDate.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var deduct = [];
      $('.invoiceDeduction').each(function() {
          if ($(this).val()) {
              deduct.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var json = {
        month:month,
        year:year,
        state:state,
        financialYear:financialYear,
        raisedDate:raisedDate,
        receivedDate:receivedDate,
        invoiceNumber:invoiceNumber,
        invoiceAmount:invoiceAmount,
        invoiceDate:invoiceDate,
        dueDate:dueDate,
        deduct:deduct,
        initialisedForApproval: false,
        sixLevelStatus:''
      };
      if(month != '' && year != '' && state != '' && financialYear != '' && raisedDate != '' && receivedDate != ''){
        if (Number(checkData) > 0) {
          swal({
              title: "Are you sure?",
              text: "It is already generated, Do you want to generate it again ?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#55dd6b",
              confirmButtonText: "Yes, generate it!",
              closeOnConfirm: false
          }, function(isConfirm) {
              if (isConfirm) {
                SessionStore.set("isLoading",true);
                Meteor.call('paymentNoteOfGujaratTransmission',json, function(error, result){
                  if (error) {
                      SessionStore.set("isLoading",false);
                      swal('Please try again!');
                  }else {
                    if(result.status){
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading",false);
                          $('#ddlFinancialYearTransmission').val('');
                          $('#StateForTransmissionPaymentNote').val('');
                          instance.selectedTransmissionState.set();
                          instance.checkGeneratedTCPaymentNote.set(0);
                          window.open('/upload/'+result.data);
                        }, 10000);
                    }
                  }
                });
              } else {
                  // if user do not want to generate
              }
          });
        }else {
          SessionStore.set("isLoading",true);
          Meteor.call('paymentNoteOfGujaratTransmission',json, function(error, result){
            if (error) {
                SessionStore.set("isLoading",false);
                swal('Please try again!');
            }else {
              if(result.status){
                setTimeout(
                  function () {
                    SessionStore.set("isLoading",false);
                    $('#ddlFinancialYearTransmission').val('');
                    $('#StateForTransmissionPaymentNote').val('');
                    instance.selectedTransmissionState.set();
                    instance.checkGeneratedTCPaymentNote.set(0);
                    window.open('/upload/'+result.data);
                  }, 10000);
              }
            }
          });
        }
      }else {
        swal('All fields are required!');
      }
    }
    else if(state == 'Rajasthan'){
      var billNumberArr = [];
      $('.txtbillNumber').each(function() {
          if ($(this).val()) {
              billNumberArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var billDateArr = [];
      $('.txtbillDate').each(function() {
          if ($(this).val()) {
              billDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodFromArr = [];
      $('.txtperiodFrom').each(function() {
          if ($(this).val()) {
              periodFromArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodToArr = [];
      $('.txtperiodTo').each(function() {
          if ($(this).val()) {
              periodToArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var transPeriod = [];
      for (var i = 0; i < periodFromArr.length; i++) {
          transPeriod.push(periodFromArr[i] + ' - ' + periodToArr[i]);
      }

      var capacityArr = [];
      $('.txtCapacity').each(function() {
          if ($(this).val()) {
              capacityArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var dueDateArr = [];
      $('.txtDueDate').each(function() {
          if ($(this).val()) {
              dueDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var totalAmountArr = [];
      $('.txtTotalAmount').each(function() {
          if ($(this).val()) {
              totalAmountArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var excessPaymentArr = [];
      $('.txtExcessPayment').each(function() {
          if ($(this).val()) {
              excessPaymentArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var raisedDate = $('.invoiceRaisedDateTC').val();
      var receivedDate = $('.recievedDate').val();
      var json = {
        month:month,
        year:year,
        state:state,
        invoiceRaisedDateTC:raisedDate,
        invoiceReceivedDateTC:receivedDate,
        financialYear:financialYear,
        billNumber:billNumberArr,
        billDate:billDateArr,
        transPeriod:transPeriod,
        capacity:capacityArr,
        dueDate:dueDateArr,
        totalAmount:totalAmountArr,
        excessPayment:excessPaymentArr,
        generatedDate:moment().format('DD-MM-YYYY'),
        delete_status: false,
        initialisedForApproval: false,
        sixLevelStatus:'',
        timestamp: new Date()
      };
      if(month != '' && year != '' && state != '' && financialYear != '' && invoiceRaisedDateTC != ''){
        if (Number(checkData) > 0) {
          swal({
              title: "Are you sure?",
              text: "It is already generated, Do you want to generate it again ?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#55dd6b",
              confirmButtonText: "Yes, generate it!",
              closeOnConfirm: false
          }, function(isConfirm) {
              if (isConfirm) {
                SessionStore.set("isLoading",true);
                Meteor.call('paymentNoteOfRajasthanTransmission',json, function(error, result){
                  if (error) {
                    SessionStore.set("isLoading",false);
                    swal('Please try again!');
                  }else {
                    if(result.status){
                      SessionStore.set("isLoading",false);
                      swal("Success!", "Payment Note Successfully Generated", "success");
                      $('#ddlFinancialYearTransmission').val('');
                      $('#StateForTransmissionPaymentNote').val('');
                      instance.selectedTransmissionState.set();
                      instance.checkGeneratedTCPaymentNote.set(0);
                    }
                  }
                });
              } else {
                  // if user do not want to generate
              }
          });
        }else {
          SessionStore.set("isLoading",true);
          Meteor.call('paymentNoteOfRajasthanTransmission',json, function(error, result){
            if (error) {
                SessionStore.set("isLoading",false);
              swal('Please try again!');
            }else {
              if(result.status){
                setTimeout(
                  function () {
                    SessionStore.set("isLoading",false);
                    $('#ddlFinancialYearTransmission').val('');
                    $('#StateForTransmissionPaymentNote').val('');
                    instance.selectedTransmissionState.set();
                    instance.checkGeneratedTCPaymentNote.set(0);
                    window.open('/upload/'+result.data);
                  }, 10000);
              }
            }
          });
        }
      }else {
        swal('All fields are required!');
      }
    }
    else if(state == 'MP'){
      var txtEncloserDate = $('#txtEncloserDateMP').val();
      var txtbillNumber = $('.txtbillNumber').val();
      var txtbillDate = $('.txtbillDate').val();
      var txtperiodFrom = $('.txtperiodFrom').val();
      var txtperiodTo = $('.txtperiodTo').val();
      var txtCapacity = $('.txtCapacity').val();
      var txtDueDate = $('.txtDueDate').val();
      var txtTotalAmount = $('.txtTotalAmount').val();
      var txtExcessPayment = $('.txtExcessPayment').val();
      var invoiceRaisedDateTC = $('.invoiceRaisedDateTC').val();
      var transPeriod = txtperiodFrom+"-"+txtperiodTo;
      var json = {
        month:month,
        year:year,
        state:state,
        financialYear:financialYear,
        invoiceRaisedDateTC:invoiceRaisedDateTC,
        encloserDate : txtEncloserDate,
        billNumber:txtbillNumber,
        billDate:txtbillDate,
        transPeriod:transPeriod,
        capacity:txtCapacity,
        dueDate:txtDueDate,
        totalAmount:txtTotalAmount,
        excessPayment:txtExcessPayment,
        generatedDate:moment().format('DD-MM-YYYY'),
        delete_status: false,
        initialisedForApproval: false,
        sixLevelStatus:'',
        timestamp: new Date()
      };
      if(month != '' && year != '' && state != '' && financialYear != '' && invoiceRaisedDateTC != '' && txtEncloserDate != '' && txtbillNumber != '' && txtbillDate != '' && txtperiodFrom != '' && txtperiodTo != '' && txtCapacity != '' && txtDueDate != '' && txtTotalAmount != '' && txtExcessPayment != ''){
        if (Number(checkData) > 0) {
          swal({
              title: "Are you sure?",
              text: "It is already generated, Do you want to generate it again ?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#55dd6b",
              confirmButtonText: "Yes, generate it!",
              closeOnConfirm: false
          }, function(isConfirm) {
              if (isConfirm) {
                SessionStore.set("isLoading",true);
                Meteor.call('paymentNoteOfMPTransmission',json, function(error, result){
                  if (error) {
                      SessionStore.set("isLoading",false);
                    swal('Please try again!');
                  }else {
                    if(result.status){
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading",false);
                          $('#ddlFinancialYearTransmission').val('');
                          $('#StateForTransmissionPaymentNote').val('');
                          instance.selectedTransmissionState.set();
                          instance.checkGeneratedTCPaymentNote.set(0);
                          window.open('/upload/'+result.data);
                        }, 10000);
                    }
                  }
                });
              } else {
                  // if user do not want to generate
              }
          });
        }else {
          SessionStore.set("isLoading",true);
          Meteor.call('paymentNoteOfMPTransmission',json, function(error, result){
            if (error) {
                SessionStore.set("isLoading",false);
              swal('Please try again!');
            }else {
              if(result.status){
                setTimeout(
                  function () {
                    SessionStore.set("isLoading",false);
                    $('#ddlFinancialYearTransmission').val('');
                    $('#StateForTransmissionPaymentNote').val('');
                    instance.selectedTransmissionState.set();
                    instance.checkGeneratedTCPaymentNote.set(0);
                    window.open('/upload/'+result.data);
                  }, 10000);
              }
            }
          });
        }
      }else {
        swal('All fields are required!');
      }
    }
  },
  'change #StateForSLDCPaymentNote': function(e, instance){
    var stateVar = $(e.currentTarget).val();
    instance.selectedSLDCState.set(stateVar);
    var month=$('#ddlMonthSLDCPaymentNote').val();
    var financial_year=$('#ddlFinancialYearSLDC').val();
    var paymentNoteType=$('#ddlTypeOfPaymentNote').val();
    if(month !='' && financial_year !='' && stateVar != '' && paymentNoteType != ''){
      SessionStore.set("isLoading",true);
      Meteor.call('GettingDetailsForPaymentNote',month,financial_year,stateVar,paymentNoteType, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
            if(result.status==true){
          SessionStore.set("isLoading",false);
          instance.GettingDetailsForPaymentNote.set(result.data);
          console.log(result.data);
        }else{
          SessionStore.set("isLoading",false);
        }
        }
      });
    }else{
      swal("Please fill all fields");
    }
  },
 'change #ddlMonthSLDCPaymentNote': function(e, instance){
   instance.selectedSLDCState.set()
   instance.GettingDetailsForPaymentNote.set();
   $('#StateForSLDCPaymentNote').val('');
 },
 'change #ddlMonthSLDCPaymentNote': function(e, instance){
   instance.selectedSLDCState.set()
   instance.GettingDetailsForPaymentNote.set();
   $('#StateForSLDCPaymentNote').val('');
 },
  'change #ddlFinancialYearSLDC': function(e, instance){
    instance.selectedSLDCState.set()
    instance.GettingDetailsForPaymentNote.set();
    $('#StateForSLDCPaymentNote').val('');
    var month = $('#ddlMonthSLDCPaymentNote').val();
    var year = $('#ddlYearSLDCPaymentNote').val();
    var state = $('#StateForSLDCPaymentNote').val();
    var financialYear = $(e.currentTarget).val();
    if (month != '' && year != '' && state != '' && financialYear != '') {
      SessionStore.set("isLoading",true);
      Meteor.call('checkGeneratedSLDCPaymentNote',month,year,state,financialYear, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
          if(result.status){
          SessionStore.set("isLoading",false);
          instance.checkGeneratedSLDCPaymentNote.set(result.data);
          }
        }
      });
    }
  },
  'click #btnSLDCPayment': function (e, instance) {
    var month = $('#ddlMonthSLDCPaymentNote').val();
    var year = $('#ddlYearSLDCPaymentNote').val();
    var state = $('#StateForSLDCPaymentNote').val();
    var financialYear = $('#ddlFinancialYearSLDC').val();
    var checkData = instance.checkGeneratedSLDCPaymentNote.get();
    if(state == 'Rajasthan'){
      var billNumberArr = [];
      $('.txtbillNumber').each(function() {
          if ($(this).val()) {
              billNumberArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var billDateArr = [];
      $('.txtbillDate').each(function() {
          if ($(this).val()) {
              billDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodFromArr = [];
      $('.txtperiodFrom').each(function() {
          if ($(this).val()) {
              periodFromArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodToArr = [];
      $('.txtperiodTo').each(function() {
          if ($(this).val()) {
              periodToArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var sldcPeriod = [];
      for (var i = 0; i < periodFromArr.length; i++) {
          sldcPeriod.push(periodFromArr[i] + ' - ' + periodToArr[i]);
      }
      var capacityArr = [];
      $('.txtCapacity').each(function() {
          if ($(this).val()) {
              capacityArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var dueDateArr = [];
      $('.txtDueDate').each(function() {
          if ($(this).val()) {
              dueDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var random = Math.floor((Math.random() * 10000) + 1).toString();
      var invoiceRaisedDate = $('.invoiceRaisedDateSLDC').val();
      var invoiceRecievedDate = $('.invoiceRecievedDateSLDC').val();
      var json = {
        random:random,
        month:month,
        year:year,
        state:state,
        periodFromArr:periodFromArr,
        periodToArr:periodToArr,
        invoiceRaisedDate:invoiceRaisedDate,
        invoiceRecievedDate:invoiceRecievedDate,
        financialYear:financialYear,
        billNumber:billNumberArr,
        billDate:billDateArr,
        sldcPeriod:sldcPeriod,
        capacity:capacityArr,
        dueDate:dueDateArr,
        generatedDate:moment().format('DD-MM-YYYY'),
        delete_status: false,
        initialisedForApproval: false,
        sixLevelStatus:'',
        timestamp: new Date()
      };
      if(month != '' && year != '' && state != '' && financialYear != '' && invoiceRaisedDate != ''){
        if (Number(checkData) > 0) {
          swal({
              title: "Are you sure?",
              text: "It is already generated, Do you want to generate it again ?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#55dd6b",
              confirmButtonText: "Yes, generate it!",
              closeOnConfirm: false
          }, function(isConfirm) {
              if (isConfirm) {
                SessionStore.set("isLoading",true);
                Meteor.call('paymentNoteOfRajasthanSLDC',json, function(error, result){
                  if (error) {
                      SessionStore.set("isLoading",false);
                    swal('Please try again!');
                  }else {
                    if(result.status){
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading",false);
                          $('#StateForSLDCPaymentNote').val('');
                          $('#ddlFinancialYearSLDC').val('');
                          instance.selectedSLDCState.set();
                          instance.checkGeneratedSLDCPaymentNote.set(0);
                          window.open('/upload/'+result.data);
                        }, 10000);
                    }
                  }
                });
              } else {
                  // if user do not want to generate
              }
          });
        }else {
          SessionStore.set("isLoading",true);
          Meteor.call('paymentNoteOfRajasthanSLDC',json, function(error, result){
            if (error) {
                SessionStore.set("isLoading",false);
              swal('Please try again!');
            }else {
              if(result.status){
                setTimeout(
                  function () {
                    SessionStore.set("isLoading",false);
                    $('#StateForSLDCPaymentNote').val('');
                    $('#ddlFinancialYearSLDC').val('');
                    instance.selectedSLDCState.set();
                    instance.checkGeneratedSLDCPaymentNote.set(0);
                    window.open('/upload/'+result.data);
                  }, 10000);
              }
            }
          });
        }
      }else {
        swal('All fields are required!');
      }
    }else {

    }
  },
  'change #StateForIncentivePaymentNote': function(e, instance){
    var stateVar = $(e.currentTarget).val();
    instance.selectedIncentiveState.set(stateVar);
    var month = $('#ddlMonthTransmissionPaymentNote').val();
    var financial_year = $('#ddlFinancialYearIncentive').val();
    var paymentNoteType= $('#ddlTypeOfPaymentNote').val();
    if(financial_year !='' && stateVar != '' && paymentNoteType != ''){
      SessionStore.set("isLoading",true);
      Meteor.call('GettingDetailsForPaymentNote',month,financial_year,stateVar,paymentNoteType, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
            if(result.status==true){
              SessionStore.set("isLoading",false);
              instance.GettingDetailsForPaymentNote.set(result.data);
            }else{
              SessionStore.set("isLoading",false);
            }
        }
      });
    }else{
      swal("Please fill all fields");
    }
  },
  'change #ddlFinancialYearIncentive': function(e, instance){
    $('#StateForIncentivePaymentNote').val('');
    instance.selectedIncentiveState.set();
    instance.GettingDetailsForPaymentNote.set();
    var year = $('#ddlYearIncentivePaymentNote').val();
    var state = $('#StateForIncentivePaymentNote').val();
    var financialYear = $(e.currentTarget).val();
    if (year != '' && state != '' && financialYear != '') {
      SessionStore.set("isLoading",true);
      Meteor.call('checkGeneratedIncentivePaymentNote',year,state,financialYear, function(error, result){
        if (error) {
          SessionStore.set("isLoading",false);
          swal('Please try again!');
        }else {
          if(result.status){
          SessionStore.set("isLoading",false);
          instance.checkGeneratedIncentivePaymentNote.set(result.data);
          }
        }
      });
    }
  },
  'change #ddlYearIncentivePaymentNote': function(e, instance){
    $('#StateForIncentivePaymentNote').val('');
    $('#ddlFinancialYearIncentive').val('');
    instance.selectedIncentiveState.set();
    instance.GettingDetailsForPaymentNote.set();
  },
  'click #btnIncentivePayment': function(e, instance){
    var year = $('#ddlYearIncentivePaymentNote').val();
    var state = $('#StateForIncentivePaymentNote').val();
    var financialYear = $('#ddlFinancialYearIncentive').val();
    var checkData = instance.checkGeneratedIncentivePaymentNote.get();
    var random = Math.floor((Math.random() * 10000) + 1).toString();
    if(state == 'Rajasthan'){
      var capacityArr = [];
      var countCapacity = 0;
      var serialNumber = [];
      var serial = 1;
      $('.txtCapacity').each(function() {
          var match = $(this).val();
          if (match.match(/^[0-9]*\.?[0-9]*$/)) {
              countCapacity += Number($(this).val());
              capacityArr.push(Number($(this).val()));
          } else {
              swal("Enter only digits in Capacity fields");
              throw new Error("Use only digits!");
          }
          serialNumber.push(serial);
          serial++;
      })
      serialNumber.push('Total');
      capacityArr.push(countCapacity.toFixed(2));
      var countbyRVPN = 0;
      var raisedByRVPN = [];
      $('.txtRaisedByRVPN').each(function() {
          var match = $(this).val();
          if (match.match(/^[0-9]*\.?[0-9]*$/)) {
              countbyRVPN += Number($(this).val());
              raisedByRVPN.push(Number($(this).val()));
          } else {
              swal("Enter only digits in Amount(Rs) Raised by RVPN");
              throw new Error("Use only digits!");
          }
      })
      raisedByRVPN.push(countbyRVPN.toFixed(2));

      var countbySECI = 0;
      var raisedBySeciArr = [];
      $('.txtRaisedBySeci').each(function() {
          var match = $(this).val();
          if (match.match(/^[0-9]*\.?[0-9]*$/)) {
              countbySECI += Number($(this).val());
              raisedBySeciArr.push(Number($(this).val()));
          } else {
              swal("Enter only digits in Amount(Rs) to be raised by SECI");
              throw new Error("Use only digits!");
          }
      });
      raisedBySeciArr.push(countbySECI.toFixed(2));

      var difference = [];
      for (var i = 0; i < raisedByRVPN.length; i++) {
          var value = Number(raisedByRVPN[i]) - Number(raisedBySeciArr[i]);
          difference.push(value.toFixed(2));
      }

      var remarksArr = [];
      $('.txtRemarks').each(function() {
          if ($(this).val()) {
              remarksArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      remarksArr.push(' ');

      var json = {
        random:random,
        year:year,
        state:state,
        financialYear:financialYear,
        countbyRVPN:countbyRVPN,
        countbySECI:countbySECI,
        serialNumber:serialNumber,
        capacity:capacityArr,
        total_capacity:countCapacity,
        byRVPN:raisedByRVPN,
        bySECI:raisedBySeciArr,
        difference:difference,
        total_difference:value,
        remarks:remarksArr,
        generatedDate:moment().format('DD-MM-YYYY'),
        delete_status: false,
        initialisedForApproval: false,
        sixLevelStatus:'',
        timestamp: new Date()
      };
      if(year != '' && state != '' && financialYear != ''){
        if (Number(checkData) > 0) {
          swal({
              title: "Are you sure?",
              text: "It is already generated, Do you want to generate it again ?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#55dd6b",
              confirmButtonText: "Yes, generate it!",
              closeOnConfirm: false
          }, function(isConfirm) {
              if (isConfirm) {
                SessionStore.set("isLoading",true);
                Meteor.call('paymentNoteOfRajasthanIncentive',json, function(error, result){
                  if (error) {
                      SessionStore.set("isLoading",false);
                    swal('Please try again!');
                  }else {
                    if(result.status){
                      setTimeout(
                        function () {
                          SessionStore.set("isLoading",false);
                          $('#StateForIncentivePaymentNote').val('');
                          $('#ddlFinancialYearIncentive').val('');
                          instance.selectedIncentiveState.set();
                          instance.checkGeneratedIncentivePaymentNote.set(0);
                          window.open('/upload/'+result.data);
                        }, 10000);
                    }
                  }
                });
              } else {
                  // if user do not want to generate
              }
          });
        }else {
          SessionStore.set("isLoading",true);
          Meteor.call('paymentNoteOfRajasthanIncentive',json, function(error, result){
            if (error) {
                SessionStore.set("isLoading",false);
              swal('Please try again!');
            }else {
              if(result.status){
                setTimeout(
                  function () {
                    SessionStore.set("isLoading",false);
                    $('#StateForIncentivePaymentNote').val('');
                    $('#ddlFinancialYearIncentive').val('');
                    instance.selectedIncentiveState.set();
                    instance.checkGeneratedIncentivePaymentNote.set(0);
                    window.open('/upload/'+result.data);
                  }, 10000);
              }
            }
          });
        }
      }else {
        swal('All fields are required!');
      }
    }
  },
});

Template.paymentNoteForSPDInvoice.helpers({
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
  isEnergyPaymentNoteSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'Energy'){
      return true;
    }else{
      return false;
    }
  },
  isRLDCInvoiceSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'RLDC'){
      return true;
    }else{
      return false;
    }
  },
  isTransmissionInvoiceSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'Transmission'){
      return true;
    }else{
      return false;
    }
  },
  isSLDCInvoiceSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'SLDC'){
      return true;
    }else{
      return false;
    }
  },
  isIncentiveInvoiceSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'Incentive'){
      return true;
    }else{
      return false;
    }
  },
  isGujaratSelectedTransmissionInvoiceSelected (){
    if(Template.instance().selectedTransmissionState.get() == 'Gujarat'){
      return true;
    }else{
      return false;
    }
  },
  isRajasthanSelectedTransmissionInvoiceSelected (){
    if(Template.instance().selectedTransmissionState.get() == 'Rajasthan'){
      return true;
    }else{
      return false;
    }
  },
  isMPSelectedTransmissionInvoiceSelected (){
    if(Template.instance().selectedTransmissionState.get() == 'MP'){
      return true;
    }else{
      return false;
    }
  },
  isGujaratTransmissionInvoiceSelected(){
    if (Template.instance().selectedTransmissionState.get() == 'Gujarat') {
        var returnData = Template.instance().GettingDetailsForPaymentNote.get();
        if (returnData != '') {
            return returnData;
        } else {
            return false;
        }
    } else {
        return false;
    }
  },
  isRajasthanTransmissionInvoiceSelected (){
    if(Template.instance().selectedTransmissionState.get() == 'Rajasthan'){
      var returnData = Template.instance().GettingDetailsForPaymentNote.get();
      if (returnData != '') {
          return returnData;
      } else {
          return false;
      }
    }else{
      return false;
    }
  },
    isMPTransmissionInvoiceSelected (){
    if(Template.instance().selectedTransmissionState.get() == 'MP'){
      var returnData = Template.instance().GettingDetailsForPaymentNote.get();
      if (returnData != '') {
          return returnData;
      } else {
          return false;
      }
    }else{
      return false;
    }
  },
  isRajasthanSelectedSLDCInvoiceSelected(){
    if(Template.instance().selectedSLDCState.get() == 'Rajasthan'){
      return true;
    }else{
      return false;
    }
  },
  isRajasthanSLDCInvoiceSelected(){
    if(Template.instance().selectedSLDCState.get() == 'Rajasthan'){
      var returnData = Template.instance().GettingDetailsForPaymentNote.get();
      if (returnData != '') {
          return returnData;
      } else {
          return false;
      }
    }else{
      return false;
    }
  },
  isRajasthanSelectedIncentiveInvoiceSelected(){
    if(Template.instance().selectedIncentiveState.get() == 'Rajasthan'){
      return true;
    }else{
      return false;
    }
  },
  isRajasthanIncentiveInvoiceSelected(){
    if(Template.instance().selectedIncentiveState.get() == 'Rajasthan'){
      var returnData = Template.instance().GettingDetailsForPaymentNote.get();
      if (returnData != '') {
          return returnData;
      } else {
          return false;
      }
    }else{
      return false;
    }
  },
  spdStateForEnergy(){
    if(Template.instance().gettingEnergyStateFromLogBookSPD.get()){
      return Template.instance().gettingEnergyStateFromLogBookSPD.get();
    }else{
      return false;
    }
  },
  spdListForEnergy(){
    if(Template.instance().getEnergySPDListFromLogBookSPD.get()){
      return Template.instance().getEnergySPDListFromLogBookSPD.get();
    }else{
      return false;
    }
  },
  spdDataReturnForEnergy(){
    if(Template.instance().getSPDDataForPaymentNote.get()){
      return true;
    }else{
      return false;
    }
  },
  index(){
    var dd = [0,1,2,3,4];
    return dd;
  },
  loopArr(){
    var dd = [1,2,3,4,5];
    return dd;
  },
  loopArrSLDC(){
    var dd = [1,2,3,4,5];
    return dd;
  },
  loopArrIncentive(){
    var dd = [1,2,3,4];
    return dd;
  },
  usingFixToDecimal(value){
    return Number(value).toFixed(2);
  },
  spdListArrForPaymentNote(){
    if (Template.instance().noOfSPDSelected.get()) {
      var dataArr = Template.instance().noOfSPDSelected.get();
      return dataArr;
    }else {
      return flase;
    }
  },
  getArrValue(dataArr, index){
    console.log('-----------------------------------!!!');
    console.log(dataArr);
    console.log(index);
    return dataArr[index];
  }
});

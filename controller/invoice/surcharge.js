import {
  ReactiveVar
} from 'meteor/reactive-var';

Template.surcharge.onCreated(function abc() {
  this.typeOfInvoiceVar = new ReactiveVar('');
  this.discomScheme = new ReactiveVar;
  this.discomName = new ReactiveVar;
  this.discomNameTrans = new ReactiveVar;
  this.discomNameIncen = new ReactiveVar('');
  this.discomNameSLDC = new ReactiveVar('');
  this.monthTypeSelected = new ReactiveVar(false);
  this.YearTypeSelected = new ReactiveVar(false);
  this.DiscomSchemeSelected = new ReactiveVar;
  this.DiscomSelected = new ReactiveVar(false);
  this.returnedpath = new ReactiveVar;
  this.gettingInvoiceData = new ReactiveVar;
});

Template.surcharge.onRendered(function abc() {
    var instance = Template.instance();
    $('#loadercls').hide();
    Meteor.call("discomStateForIncen", function(error, result) {
        if (error) {
            swal("Please try again !");
        } else {
            if (result.status) {
              instance.discomNameIncen.set(result.data);
            }
        }
    });
    Meteor.call("discomStateForSLDC", function(error, result) {
        if (error) {
          swal("Please try again !");
        } else {
            if (result.status) {
              instance.discomNameSLDC.set(result.data);
            }
        }
    });
  });

Template.surcharge.events({

'change #ddlTypeOfSurcharge': function(e, instance){
    var surchargeType = $(e.currentTarget).val();
    instance.typeOfInvoiceVar.set(surchargeType);
    instance.monthTypeSelected.set(false);
    instance.DiscomSchemeSelected.set(false);
    instance.YearTypeSelected.set(false);
    instance.discomName.set();
    instance.gettingInvoiceData.set();

},
'change #month' (e, instance) {
    var month = $(e.currentTarget).val();
    $('#financial_year').val('');
    $("#scheme").val('');
    $("#discom_state").val('');
    instance.gettingInvoiceData.set(false);
    instance.YearTypeSelected.set(false);
    instance.DiscomSchemeSelected.set(false);
    instance.discomName.set();
    if (month != '') {
      instance.monthTypeSelected.set(true);
    } else {
      swal('Please select month!');
      instance.monthTypeSelected.set(false);
    }
  },
  'change #financial_year' (e, instance) {
   var financialYearArr = $(e.currentTarget).val();
   instance.DiscomSchemeSelected.set(false);
   instance.discomName.set();
    if (financialYearArr != '') {
      instance.YearTypeSelected.set(true);
      instance.gettingInvoiceData.set();
      $('#scheme').val('');
      $('#discom_state').val('');
      Meteor.call('getDiscomSchemeForSurcharge', function(error, result) {
        if (error) {
          swal('Please try again!');
        } else {
          if (result.status) {
            instance.discomScheme.set(result.data);
          }
        }
      });
    } else {
      swal('Please select year!');
      instance.discomScheme.set(false);
    }
  },

  'change #scheme' (e, instance) {
    instance.DiscomSchemeSelected.set('');
    instance.DiscomSelected.set('');
    instance.gettingInvoiceData.set();
    var discomScheme = $(e.currentTarget).val();
    if (discomScheme != '') {
      Meteor.call('getDiscomForSurcharge', discomScheme, function(error, result) {
        instance.DiscomSchemeSelected.set(true);
        if (error) {
          swal('Please try again!');
        } else {
          if (result.status) {
            instance.discomName.set(result.data);
          }
        }
      });
    } else {
      swal('Please select discom scheme!');
      instance.discomName.set();
    }
  },
  'change #discom_state' (e, instance) {
    var month=$("#month").val();
    var financialYear= $("#financial_year").val();
    var discomState = $(e.currentTarget).val();
    var discomId = $(e.currentTarget).find(':selected').attr('attrId');
    if (discomState != '') {
      SessionStore.set("isLoading",true);
      Meteor.call("gettingSurchargeFromEnergyInvoice", month,financialYear,discomId, discomState,function(error,result){
        if(error){
          SessionStore.set("isLoading",false);
          swal("Please try again!");
        }else {
           if (result.status) {
              SessionStore.set("isLoading",false);
              instance.gettingInvoiceData.set(result.data);
              $('.energy').removeClass('hidden');
           }else {
              SessionStore.set("isLoading", false);
              instance.gettingInvoiceData.set();
              swal(result.message);
          }
        }
      })
      }
    },
  'click #btnEnergySurcharge' (e, instance) {
    var discomState = $('#discom_state').val();
    var discomIdVar = $('#discom_state').find(':selected').attr('attrId');
    var month=$("#month").val();
    var financialYear= $("#financial_year").val();
    var signatureVar = $('#ddlEnergyInvoiceAthorisedPerson').val();
    var authorisedPersonName = $('#ddlEnergyInvoiceAthorisedPerson').val();
    var authorisedPersonDesignation = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
    var authorisedPersonDesignationFull = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
    var authorisedPersonPhone = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
    var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};

    if(discomState !='' && month !='' && financialYear !='' && signatureVar != ''){
      var surchargeAmt =  instance.gettingInvoiceData.get().surChargeAmt;
      if (Number(surchargeAmt) > 0) {
        SessionStore.set("isLoading",true);
        Meteor.call("gettingDiscomDataTableEnergy", month, financialYear, discomIdVar, discomState,signatureJson,function(error,result){
          if(error){
            SessionStore.set("isLoading",false);
            swal("Please try again!");
          }else {
            if (result != false || result != undefined) {
              setTimeout(
                function () {
                  SessionStore.set("isLoading",false);
                    window.open(result);
                }, 5000);
            }else {
              SessionStore.set("isLoading", false);
              swal("There is no surchrge amount for this particular discom");
           }
          }
        });
      }else {
        swal("Surchrge amount must be greater than zero!");
      }
    }else{
      swal('Please select all fields!');
      instance.returnedpath.set();
    }
  },
    // events occur for transmission.........
  'change #ddlMonthTrans' (e, instance) {
    e.preventDefault();
    $("#ddlFinancialYearTrans").val('');
    $("#spdStateForTransmission").val('');
    $("#discom_stateTrans").val('');
      instance.gettingInvoiceData.set(false);
  },
  'change #ddlFinancialYearTrans' (e, instance) {
    e.preventDefault();
    $("#spdStateForTransmission").val('');
    $("#discom_stateTrans").val('');
      instance.gettingInvoiceData.set(false);
  },

'change #spdStateForTransmission' (e, instance) {
  e.preventDefault();
  $("#discom_stateTrans").val('');
  instance.discomNameTrans.set('');
  instance.gettingInvoiceData.set(false);
  var spdState = $(e.currentTarget).val();
  if (spdState != '') {
     Meteor.call('getDiscomStateTrans', spdState, function(error, result) {
        if (error) {
          swal('Please try again!');
        } else {
          if (result.status) {
            instance.discomNameTrans.set(result.data);
          }
        }
      });
  } else {
    swal('Please select spd state!');
    instance.discomNameTrans.set();
  }
},
'change #discom_stateTrans' (e, instance) {
  e.preventDefault();
  var month=$("#ddlMonthTrans").val();
  var financialYear= $("#ddlFinancialYearTrans").val();
  var discomState = $(e.currentTarget).val();
  if (discomState != '') {
    SessionStore.set("isLoading",true);
    Meteor.call("gettingSurchargeFromTransmInvoice", month,financialYear,discomState,function(error,result){
        if(error){
          SessionStore.set("isLoading",false);
          swal("Please try again!");
        }else {
           if (result.status) {
              instance.gettingInvoiceData.set(result.data);
              $('.transmission').removeClass('hidden');
              SessionStore.set("isLoading",false);
           }else {
              SessionStore.set("isLoading", false);
              instance.gettingInvoiceData.set();
              swal(result.message);
          }
        }
      })
    }
},
'click #btnTransSurcharge' (e, instance) {
   var discomState = $("#discom_stateTrans").val();
   var month=$("#ddlMonthTrans").val();
   var financialYear= $("#ddlFinancialYearTrans").val();
   var signatureVar = $('#ddlEnergyInvoiceAthorisedPerson').val();
   var authorisedPersonName = $('#ddlEnergyInvoiceAthorisedPerson').val();
   var authorisedPersonDesignation = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
   var authorisedPersonDesignationFull = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
   var authorisedPersonPhone = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
   var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};

   if(discomState !='' && month !='' && financialYear !='' && signatureVar != ''){
     var surchargeAmt =  instance.gettingInvoiceData.get().surChargeAmt;
     if (Number(surchargeAmt) > 0) {
       SessionStore.set("isLoading",true);
       Meteor.call("gettingDiscomDataTableTrans", month, discomState, financialYear,signatureJson, function(error,result){
         if(error){
           SessionStore.set("isLoading",false);
           swal("Please try again!");
         }else {
            if (result != false || result != undefined) {
              setTimeout(
                function () {
                  SessionStore.set("isLoading",false);
                    window.open(result);
                }, 5000);
            }else{
              SessionStore.set("isLoading", false);
              swal("There is no surchrge amount for this particular discom");
           }
         }
       })
     }else {
       swal("Surchrge amount must be greater than zero!");
      }
   }else{
     swal('Please select all fields!');
     instance.returnedpath.set();
   }
},
// events occur for incentive surcharge.......
'change #ddlMonthIncenSurcharge' (e,instance) {
  e.preventDefault();
  $("#ddlYearIncentiveSurcharge").val('');
  $("#discom_stateIncentive").val('');
  instance.gettingInvoiceData.set(false);
},
'change #ddlYearIncentiveSurcharge' (e,instance) {
  e.preventDefault();
  $("#discom_stateIncentive").val('');
  instance.gettingInvoiceData.set(false);
},

'change #discom_stateIncentive' (e,instance) {
  e.preventDefault();
  var month=$("#ddlMonthIncenSurcharge").val();
  var financialYear= $("#ddlYearIncentiveSurcharge").val();
  var discomState = $(e.currentTarget).val();
  // var discomId = $(e.currentTarget).find(':selected').attr('attrId');
  if (discomState != '') {
    SessionStore.set("isLoading",true);
    Meteor.call("gettingSurchargeFromIncentiveInvoice", month,financialYear,discomState,function(error,result){
        if(error){
          SessionStore.set("isLoading",false);
          swal("Please try again!");
        }else {
           if (result.status) {
              instance.gettingInvoiceData.set(result.data);
              $('.incentive').removeClass('hidden');
              SessionStore.set("isLoading",false);
           }else {
              SessionStore.set("isLoading", false);
              instance.gettingInvoiceData.set();
              swal(result.message);
          }
        }
      })
    }
},

'click #btnIncenSurch' (e,instance) {
  var discomState = $('#discom_stateIncentive').val();
  var month=$("#ddlMonthIncenSurcharge").val();
  var financialYear= $("#ddlYearIncentiveSurcharge").val();
  var signatureVar = $('#ddlEnergyInvoiceAthorisedPerson').val();
  var authorisedPersonName = $('#ddlEnergyInvoiceAthorisedPerson').val();
  var authorisedPersonDesignation = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
  var authorisedPersonDesignationFull = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
  var authorisedPersonPhone = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
  var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};

  if(discomState !='' && month !='' && financialYear !='' && signatureVar != ''){
    var surchargeAmt =  instance.gettingInvoiceData.get().surChargeAmt;
    if (Number(surchargeAmt) > 0) {
      SessionStore.set("isLoading",true);
    Meteor.call("gettingDiscomDataTableIncentive", month, discomState, financialYear,signatureJson,function(error,result){
      if(error){
        SessionStore.set("isLoading",false);
        swal("Please try again!");
      }else {
        if (result != false || result != undefined) {
          setTimeout(
            function () {
              SessionStore.set("isLoading",false);
                window.open(result);
            }, 5000);
         }else{
           SessionStore.set("isLoading", false);
          swal("There is no surchrge amount for this particular discom");
        }
      }
    })
  }else{
    swal("Surchrge amount must be greater than zero!");
  }
  }else{
    swal('Please fill all fields');
    instance.returnedpath.set();
  }
},
// events occur for SLDC surcharge.......
'change #ddlMonthSLDCSurcharge' (e,instance) {
  e.preventDefault();
  $("#ddlYearSLDCSurcharge").val('');
  $("#discom_stateSLDC").val('');
  instance.gettingInvoiceData.set(false);
},
'change #ddlYearSLDCSurcharge' (e,instance) {
    e.preventDefault();
    $("#discom_stateSLDC").val('');
    instance.gettingInvoiceData.set(false);
},
'change #discom_stateSLDC' (e,instance) {
  e.preventDefault();
  var month=$("#ddlMonthSLDCSurcharge").val();
  var financialYear= $("#ddlYearSLDCSurcharge").val();
  var discomState = $(e.currentTarget).val();
  // var discomId = $(e.currentTarget).find(':selected').attr('attrId');
  if (discomState != '') {
    SessionStore.set("isLoading",true);
    Meteor.call("gettingSurchargeFromSLDCInvoice", month,financialYear,discomState,function(error,result){
        if(error){
          SessionStore.set("isLoading",false);
          swal("Please try again!");
        }else {
           if (result.status) {
              instance.gettingInvoiceData.set(result.data);
              $('.SLDC').removeClass('hidden');
              SessionStore.set("isLoading",false);
           }else {
              SessionStore.set("isLoading", false);
              instance.gettingInvoiceData.set();
              swal(result.message);
          }
        }
      })
    }
},
'click #btnSLDCSurcharge' (e,instance) {
  var discomState = $('#discom_stateSLDC').val();
  var month=$("#ddlMonthSLDCSurcharge").val();
  var financialYear= $("#ddlYearSLDCSurcharge").val();
  var signatureVar = $('#ddlEnergyInvoiceAthorisedPerson').val();
  var authorisedPersonName = $('#ddlEnergyInvoiceAthorisedPerson').val();
  var authorisedPersonDesignation = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignation");
  var authorisedPersonDesignationFull = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrDesignationFull");
  var authorisedPersonPhone = $("#ddlEnergyInvoiceAthorisedPerson").find(':selected').attr("attrPhone");
  var signatureJson = {name:authorisedPersonName,designation:authorisedPersonDesignation,full_form:authorisedPersonDesignationFull,phone:authorisedPersonPhone};

  if(discomState !='' && month !='' && financialYear !='' && signatureVar != ''){
  SessionStore.set("isLoading",true);
   Meteor.call("gettingDiscomDataTableSLDC", month, discomState, financialYear,signatureJson,function(error,result){
     if(error){
       SessionStore.set("isLoading",false);
       swal("Please try again!");
     } else {
       if (result != false || result != undefined) {
         setTimeout(
           function () {
             SessionStore.set("isLoading",false);
               window.open(result);
           }, 5000);
      }else{
        SessionStore.set("isLoading", false);
       swal("There is no surchrge amount for this particular discom");
     }
     }
   })
  }else{
    swal('Please select all fields');
    instance.returnedpath.set();
   }
 }
});

Template.surcharge.helpers({
  authorisedSignatureArr(){
    return authorisedSignature();
  },
  isEnergySurchargeSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'Energy'){
      return true;
    }else{
      return false;
    }
  },
  isreturnInvoiceInfoTrue (){
    if(Template.instance().gettingInvoiceData.get()){
      return true;
    }else{
      return false;
    }
  },
  returnInvoiceInfo (){
    if(Template.instance().gettingInvoiceData.get()){
      return Template.instance().gettingInvoiceData.get();
    }else{
      return false;
    }
  },
  isDateOfPaymentBlank(dateOfPayment){
    if (dateOfPayment != "") {
      return dateOfPayment;
    }else {
      return 'N/A';
    }
  },
 isTransmissionSurchargeSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'Transmission'){
      return true;
    }else{
      return false;
    }
  },
  isSLDCSurchargeSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'SLDC'){
      return true;
    }else{
      return false;
    }
  },
  isIncentiveSurchargeSelected (){
    if(Template.instance().typeOfInvoiceVar.get() == 'Incentive'){
      return true;
    }else{
      return false;
    }
  },
  monthShow() {
    return monthReturn();
  },
  yearHelper() {
    return dynamicFinancialYear();
  },
  discomSchemeArr() {
    if (Template.instance().discomScheme.get()) {
      return Template.instance().discomScheme.get();
    } else {
      return false;
    }
  },
  discomListArr() {
    if (Template.instance().discomName.get()) {
      return Template.instance().discomName.get();
    } else {
      return false;
    }
  },
  discomListArrTrans() {
    if (Template.instance().discomNameTrans.get()) {
      return Template.instance().discomNameTrans.get();
    } else {
      return false;
    }
  },
  discomListArrIncentive() {
    if (Template.instance().discomNameIncen.get()) {
      return Template.instance().discomNameIncen.get();
    } else {
      return false;
    }
  },
  discomListArrSLDC() {
    if (Template.instance().discomNameSLDC.get()) {
      return Template.instance().discomNameSLDC.get();
    } else {
      return false;
    }
  },
  ifMonthTypeSelected() {
    if (Template.instance().monthTypeSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifYearTypeSelected() {
    if (Template.instance().YearTypeSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifDiscomSchemeSelected() {
    if (Template.instance().DiscomSchemeSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifDiscomSelected() {
    if (Template.instance().DiscomSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  filepath(){
      if(Template.instance().returnedpath.get()!= undefined){
        return Template.instance().returnedpath.get();
      }
    }
});

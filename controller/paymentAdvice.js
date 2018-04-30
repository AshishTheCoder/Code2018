import {ReactiveVar} from 'meteor/reactive-var';

Template.paymentAdviceBySECI.onCreated(function ss() {
    this.radioBtnType = new ReactiveVar;
    this.uniqSPDStateListArr = new ReactiveVar;
    this.spdListArr = new ReactiveVar;
    this.getLogBookSPDData = new ReactiveVar;
    this.getSPDID = new ReactiveVar;
    this.getGeneatedPaymentAdviceData = new ReactiveVar;
});
Template.paymentAdviceBySECI.rendered = function() {
  SessionStore.set("isLoading",false);
};
Template.paymentAdviceBySECI.events({
  'change #inlineRadioBtn': function(e, instance) {
    var selectedType = $(e.currentTarget).val();
    instance.radioBtnType.set(selectedType);
    $("input.clsPaymentAdvice,select.clsPaymentAdvice").each(function(value, element) {
        $(this).val('');
    });
    instance.spdListArr.set();
    instance.uniqSPDStateListArr.set();
    instance.getLogBookSPDData.set();
    instance.getGeneatedPaymentAdviceData.set();
  },
  'change #ddlMonthList': function(e, instance) {
    $('#ddlFinancialYear').val('');
    $('#ddlSPDStateList').val('');
    $('#ddlSPDList').val('');
    $('#ddlSPDListView').val('');
    instance.uniqSPDStateListArr.set();
    instance.spdListArr.set();
    instance.getLogBookSPDData.set();
    instance.getSPDID.set();
    instance.getGeneatedPaymentAdviceData.set();
  },
  'change #ddlFinancialYear': function(e, instance) {
      $('#ddlSPDStateList').val('');
      $('#ddlSPDList').val('');
      $('#ddlSPDListView').val('');
      instance.uniqSPDStateListArr.set();
      instance.spdListArr.set();
      instance.getLogBookSPDData.set();
      instance.getSPDID.set();
      instance.getGeneatedPaymentAdviceData.set();
      var financialYear = $(e.currentTarget).val();
      if (financialYear != '') {
          SessionStore.set("isLoading", true);
          Meteor.call("gettingSPLDStateListUniqForPaymentAdvice", function(error, result) {
              if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Oops...", "Please try again!", "error");
              } else {
                  if (result.status) {
                      instance.uniqSPDStateListArr.set(result.data);
                      SessionStore.set("isLoading", false);
                  }
              }
          });
      } else {
          instance.uniqSPDStateListArr.set();
          instance.spdListArr.set();
      }
  },
  'change #ddlSPDStateList': function(e, instance) {
      $('#ddlSPDList').val('');
      $('#ddlSPDListView').val('');
      instance.spdListArr.set();
      instance.getLogBookSPDData.set();
      instance.getSPDID.set();
      var spdState = $(e.currentTarget).val();
      if (spdState != '') {
          SessionStore.set("isLoading", true);
          Meteor.call("gettingSPDListForPaymentAdvice", spdState, function(error, result) {
              if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Oops...", "Please try again!", "error");
              } else {
                  if (result.status) {
                      instance.spdListArr.set(result.data);
                      SessionStore.set("isLoading", false);
                  }
              }
          });
      } else {
          instance.spdListArr.set();
      }
  },
  'change #ddlSPDList': function(e, instance) {
    var spdName = $(e.currentTarget).val();
    var sdpId = $(e.currentTarget).find(':selected').attr('attrId');
    var spdState = $('#ddlSPDStateList').val();
    var financialYear = $('#ddlFinancialYear').val();
    var month = $('#ddlMonthList').val();
    instance.getSPDID.set(sdpId);
    instance.getLogBookSPDData.set();
    if (month != '' && financialYear != '' && spdState != '' && spdName != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("gettingDataForPaymentAdvice", sdpId,spdName,spdState,financialYear,month, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
          } else {
              if (result.status) {
                // console.log(result.data);
                  instance.getLogBookSPDData.set(result.data);
                  SessionStore.set("isLoading", false);
              }else {
                SessionStore.set("isLoading", false);
                swal(result.message);
              }
          }
      });
    }else {
      swal('All fields are required!');
    }
  },
  'click #btnGenratePaymentAdvice': function(e, instance) {
    var spdId = instance.getSPDID.get();
    var json = '{';
    $("input.clsPaymentAdvice,select.clsPaymentAdvice").each(function(value, element) {
        json += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
    });
    json = $.parseJSON(json.replace(/,\s*$/, '') + '}');
    var remarks = $('#txtRemarks').val();
    json.remarks = remarks;
    SessionStore.set("isLoading",true);
      Meteor.call('generatePaymentAdviceForEnergy',spdId,json, function(error, result){
        if (error) {
            SessionStore.set("isLoading",false);
            swal('Please try again!');
        }else {
          if(result.status){
            setTimeout(
              function () {
                SessionStore.set("isLoading",false);
                instance.getLogBookSPDData.set();
                window.open('/upload/'+result.data+'.pdf');
              }, 10000);
          }
        }
      });
  },
  'change #ddlSPDListView': function(e, instance) {
    var spdId = $(e.currentTarget).find(':selected').attr('attrId');
    var json = '{';
    $("input.clsPaymentAdvice,select.clsPaymentAdvice").each(function(value, element) {
        json += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
    });
    json = $.parseJSON(json.replace(/,\s*$/, '') + '}');
    if (json.month !='' && json.financial_year !='' && json.state !='' && json.spdName !='') {
      SessionStore.set("isLoading",true);
        Meteor.call('fetchingPaymentAdviceForEnergy',spdId,json, function(error, result){
          if (error) {
              SessionStore.set("isLoading",false);
              swal('Please try again!');
          }else {
            if(result.status){
              // console.log(result.data);
              instance.getGeneatedPaymentAdviceData.set(result.data);
              SessionStore.set("isLoading",false);
              // window.open('upload/'+result.data);
              // console.log(result.data);
            }
          }
        });
    }
  },
  'click #viewPaymentAdvicePdf': function(e, instance){
    var filePath = $(e.currentTarget).attr("filePath");
    window.open('/upload/'+filePath);
  },
  'click #viewPaymentAdviceDocx': function(e, instance){
    var filePath = $(e.currentTarget).attr("filePath");
    window.open('/upload/'+filePath);
  },
  'click #deletePaymentAdvice': function(e, instance){
    var docId = $(e.currentTarget).attr("attrId");
    var json = '{';
    $("input.clsPaymentAdvice,select.clsPaymentAdvice").each(function(value,element) {
        json += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
    });
    json = $.parseJSON(json.replace(/,\s*$/, '') + '}');
      swal({
          title: "Are you sure?",
          text: "You want to delete it!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
      function(){
          Meteor.call("deleteGeneratedPaymentAdvice",docId,json, function(error, result) {
              if (error) {
                  swal("Please try again !");
              } else {
                  if (result.status) {
                      swal("Deleted!", "Payment Advice Successfully Deleted.", "success");
                      instance.getGeneatedPaymentAdviceData.set(result.data);
                  }
              }
          });
      });
  },
});
Template.paymentAdviceBySECI.helpers({
  monthShow() {
      return monthReturn();
  },
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  serial(index){
    return index+1;
  },
  isUserComercial(){
    if (Meteor.user().profile.user_type ==  'commercial' || Meteor.user().profile.user_type ==  'master') {
      return true;
    }else {
      return false;
    }
  },
  isRadioBtnSelectedGenerate(){
    if (Template.instance().radioBtnType.get() == 'GeneratePaymentAdvice') {
      return true;
    }else {
      return false;
    }
  },
  isRadioBtnSelectedView(){
    if (Template.instance().radioBtnType.get() == 'ViewPaymentAdvice') {
      return true;
    }else {
      return false;
    }
  },
  spdStateList() {
      if (Template.instance().uniqSPDStateListArr.get()) {
          return Template.instance().uniqSPDStateListArr.get();
      } else {
          return false;
      }
  },
  allSPDListArr() {
      if (Template.instance().spdListArr.get()) {
          return Template.instance().spdListArr.get();
      } else {
          return false;
      }
  },
  isEnergyDataAvailableLogBook(){
    if (Template.instance().getLogBookSPDData.get()) {
        return true;
    } else {
        return false;
    }
  },
  getDataToHelper(){
    if (Template.instance().getLogBookSPDData.get()) {
        return Template.instance().getLogBookSPDData.get();
    } else {
        return false;
    }
  },
  isDeductionAvailable(deduction){
    if (deduction != '') {
      return deduction;
    }else {
      return 'Nil';
    }
  },
  isGeneratedPAFetched(){
    if (Template.instance().getGeneatedPaymentAdviceData.get()) {
        return true;
    } else {
        return false;
    }
  },
  returnGeneratedPA(){
    if (Template.instance().getGeneatedPaymentAdviceData.get()) {
        return Template.instance().getGeneatedPaymentAdviceData.get();
    } else {
        return false;
    }
  }
});

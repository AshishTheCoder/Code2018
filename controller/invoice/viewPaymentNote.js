import {ReactiveVar} from 'meteor/reactive-var';

Template.paymentNoteReport.onCreated(function ss() {
    this.paymentNoteTypeSelected = new ReactiveVar('');
    this.monthReactiveVar = new ReactiveVar('');
    this.yearReactiveVar = new ReactiveVar('');
    this.energyPaymentNoteData = new ReactiveVar('');
    this.transmissionPaymentNoteData = new ReactiveVar('');
    this.RLDCPaymentNoteData = new ReactiveVar('');
    this.SLDCPaymentNoteData = new ReactiveVar('');
    this.IncentivePaymentNoteData = new ReactiveVar('');
});
Template.paymentNoteReport.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.paymentNoteReport.events({
    "change #ddlTypeOfPaymentNote": function(e, instance) {
      var typeVar = $(e.currentTarget).val();
      instance.paymentNoteTypeSelected.set(typeVar);
      instance.monthReactiveVar.set('');
      instance.yearReactiveVar.set('');
      instance.energyPaymentNoteData.set('');
      instance.transmissionPaymentNoteData.set('');
      instance.RLDCPaymentNoteData.set('');
      instance.SLDCPaymentNoteData.set('');
      instance.IncentivePaymentNoteData.set('');
      $('#ddlMonth').val('');
      $('#ddlYear').val('');
    },
    "change #ddlMonth": function(e, instance) {
      var month = $(e.currentTarget).val();
      instance.monthReactiveVar.set(month);
      instance.yearReactiveVar.set('');
      instance.energyPaymentNoteData.set('');
      instance.transmissionPaymentNoteData.set('');
      instance.RLDCPaymentNoteData.set('');
      instance.SLDCPaymentNoteData.set('');
      instance.IncentivePaymentNoteData.set('');
      $('#ddlYear').val('');
    },
    "change #ddlYear": function(e, instance) {
      var year = $(e.currentTarget).val();
      instance.yearReactiveVar.set(year);
      instance.energyPaymentNoteData.set('');
      instance.transmissionPaymentNoteData.set('');
      instance.RLDCPaymentNoteData.set('');
      instance.SLDCPaymentNoteData.set('');
      instance.IncentivePaymentNoteData.set('');
    },
    "click #viewBtn": function(e, instance) {
        instance.transmissionPaymentNoteData.set('');
        instance.RLDCPaymentNoteData.set('');
        instance.SLDCPaymentNoteData.set('');
        instance.IncentivePaymentNoteData.set('');
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("viewGeneratedPaymentNote", monthVar, yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.energyPaymentNoteData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.energyPaymentNoteData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    "click #viewBtnTransmission": function(e, instance) {
        instance.energyPaymentNoteData.set('');
        instance.transmissionPaymentNoteData.set('');
        instance.RLDCPaymentNoteData.set('');
        instance.SLDCPaymentNoteData.set('');
        instance.IncentivePaymentNoteData.set('');
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("viewGeneratedTransmissionPaymentNote", monthVar, yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.transmissionPaymentNoteData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.transmissionPaymentNoteData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    "click #viewBtnRLDC": function(e, instance) {
        instance.energyPaymentNoteData.set('');
        instance.transmissionPaymentNoteData.set('');
        instance.RLDCPaymentNoteData.set('');
        instance.SLDCPaymentNoteData.set('');
        instance.IncentivePaymentNoteData.set('');
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("viewGeneratedRLDCPaymentNote", monthVar, yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.RLDCPaymentNoteData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.RLDCPaymentNoteData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    "click #viewBtnSLDC": function(e, instance) {
        instance.energyPaymentNoteData.set('');
        instance.transmissionPaymentNoteData.set('');
        instance.RLDCPaymentNoteData.set('');
        instance.SLDCPaymentNoteData.set('');
        instance.IncentivePaymentNoteData.set('');
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("viewGeneratedSLDCPaymentNote", monthVar, yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.SLDCPaymentNoteData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.SLDCPaymentNoteData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    "click #viewBtnIncentive": function(e, instance) {
        instance.energyPaymentNoteData.set('');
        instance.transmissionPaymentNoteData.set('');
        instance.RLDCPaymentNoteData.set('');
        instance.SLDCPaymentNoteData.set('');
        instance.IncentivePaymentNoteData.set('');
        var yearVar = $('#ddlYear').val();
        if (yearVar != '') {
            Meteor.call("viewGeneratedIncentivePaymentNote", yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.IncentivePaymentNoteData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.IncentivePaymentNoteData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    'click #viewInvoicePdf': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      window.open('/upload/'+filePath);
    },
    'click #viewInvoiceDocx': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      window.open('/upload/'+filePath);
    },
    'click #paymentNoteInitializedForApproval': function(e, instance){
      var typeOfPaymentNote = $('#ddlTypeOfPaymentNote').val();
      var filePath = $(e.currentTarget).attr("filePath");
      var idVar = $(e.currentTarget).attr("attrId");
      var monthVar = $('#ddlMonth').val();
      var yearVar = $('#ddlYear').val();
        swal({
            title: "Are you sure?",
            text: "You want to initialize payment note!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, initialize it!",
            closeOnConfirm: false
          },
        function(){
            SessionStore.set("isLoading",true);
            instance.energyPaymentNoteData.set('');
            Meteor.call("paymentNoteInitializedForSixLevel",idVar,monthVar,yearVar,filePath,typeOfPaymentNote, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading", false);
                    swal("Please try again !");
                } else {
                    if (result.status) {
                      SessionStore.set("isLoading", false);
                      if(typeOfPaymentNote == 'Energy'){
                        instance.energyPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'Transmission') {
                        instance.transmissionPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'SLDC') {
                        instance.SLDCPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'RLDC') {
                        instance.RLDCPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'Incentive') {
                        instance.IncentivePaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'UI') {
                        // instance.IncentivePaymentNoteData.set(result.data);
                      }
                      swal("Success!", "Payment Note Successfully initialised", "success");
                    }
                }
            });
        });
    },
    'click #deletePaymentNote': function(e, instance){
      var typeOfPaymentNote = $('#ddlTypeOfPaymentNote').val();
      var filePath = $(e.currentTarget).attr("filePath");
      var idVar = $(e.currentTarget).attr("attrId");
      var monthVar = $('#ddlMonth').val();
      var yearVar = $('#ddlYear').val();
        swal({
            title: "Are you sure?",
            text: "You want to delete payment note!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
          },
        function(){
            SessionStore.set("isLoading",true);
            instance.energyPaymentNoteData.set('');
            Meteor.call("deletePaymentNoteAndPdfFile",idVar,filePath,monthVar,yearVar,typeOfPaymentNote, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading", false);
                    swal("Please try again !");
                } else {
                    if (result.status) {
                      SessionStore.set("isLoading", false);
                      if(typeOfPaymentNote == 'Energy'){
                        instance.energyPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'Transmission') {
                        instance.transmissionPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'SLDC') {
                        instance.SLDCPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'RLDC') {
                        instance.RLDCPaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'Incentive') {
                        instance.IncentivePaymentNoteData.set(result.data);
                      }else if (typeOfPaymentNote == 'UI') {
                        // instance.IncentivePaymentNoteData.set(result.data);
                      }
                      swal("Deleted!", "Payment Note Successfully Deleted.", "success");
                    }
                }
            });
        });
    },
});

Template.paymentNoteReport.helpers({
    monthShow() {
        return monthReturn();
    },
    yearHelper() {
        return dynamicYear();
    },
    serial(index){
      return index+1;
    },
    isDocxAvailable(docxFile){
      if (docxFile) {
        return true;
      }else {
        return false;
      }
    },
    isMonthAndYearSelected(){
      if(Template.instance().monthReactiveVar.get() != '' && Template.instance().yearReactiveVar.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    isMonthSelectedForIncentive(){
      if(Template.instance().yearReactiveVar.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    isEnergyPaymentNoteSelectedToView(){
      if(Template.instance().paymentNoteTypeSelected.get() == 'Energy'){
        return true;
      }else{
        return false;
      }
    },
    isTransmissionPaymentNoteSelectedToView(){
      if(Template.instance().paymentNoteTypeSelected.get() == 'Transmission'){
        return true;
      }else{
        return false;
      }
    },
    isRLDCPaymentNoteSelectedToView(){
      if(Template.instance().paymentNoteTypeSelected.get() == 'RLDC'){
        return true;
      }else{
        return false;
      }
    },
    isSLDCPaymentNoteSelectedToView(){
      if(Template.instance().paymentNoteTypeSelected.get() == 'SLDC'){
        return true;
      }else{
        return false;
      }
    },
    isIncentivePaymentNoteSelectedToView(){
      if(Template.instance().paymentNoteTypeSelected.get() == 'Incentive'){
        return true;
      }else{
        return false;
      }
    },
    fileStatus(sixLevelStatus){
      if(sixLevelStatus == 'Rejected'){
        return 'warning';
      }else{
        return 'success';
      }
    },
    btnText(sixLevelStatus){
      if(sixLevelStatus == 'Pending'){
        return 'Pending';
      }else if(sixLevelStatus == 'Rejected'){
        return 'Rejected';
      }else if(sixLevelStatus == 'Approved'){
        return 'Approved';
      }else if(sixLevelStatus == 'Closed'){
        return 'Closed';
      }else {
        return 'Initialize';
      }
    },
    isInitialisedEPN(condition){
      if(condition){
          return 'disabled';
      }else{
        return false;
      }
    },
    isInitialisedDeleteBtn(condition, sixLevelStatus){
      if(condition){
        if (sixLevelStatus == 'Rejected') {
          return false;
        }else {
          return 'disabled';
        }
      }else{
        return false;
      }
    },
    isEnergyPaymwntNoteAvailable(){
      if(Template.instance().energyPaymentNoteData.get() != ''){
        return Template.instance().energyPaymentNoteData.get();
      }else{
        return false;
      }
    },
    istransmissionAvailable(){
      if(Template.instance().transmissionPaymentNoteData.get() != ''){
        return Template.instance().transmissionPaymentNoteData.get();
      }else{
        return false;
      }
    },
    isRLDCAvailable(){
      if(Template.instance().RLDCPaymentNoteData.get() != ''){
        return Template.instance().RLDCPaymentNoteData.get();
      }else{
        return false;
      }
    },
    ifSLDCAvailable(){
      if(Template.instance().SLDCPaymentNoteData.get() != ''){
        return Template.instance().SLDCPaymentNoteData.get();
      }else{
        return false;
      }
    },
    isIncentiveAvailable(){
      if(Template.instance().IncentivePaymentNoteData.get() != ''){
        return Template.instance().IncentivePaymentNoteData.get();
      }else{
        return false;
      }
    },
    isUserComercial(){
      if (Meteor.user().profile.user_type ==  'commercial' || Meteor.user().profile.user_type ==  'master') {
        return true;
      }else {
        return false;
      }
    },
    breakData(invoiceNum) {
      return invoiceNum.substring(0,12);
    },
    breakData1(invoiceNum) {
      return invoiceNum.substring(12,20);
    },
});

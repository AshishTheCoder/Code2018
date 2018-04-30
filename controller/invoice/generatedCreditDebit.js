import {ReactiveVar} from 'meteor/reactive-var';

Template.generateCreditDebit.onCreated(function ss() {
    this.monthAndYearSelected = new ReactiveVar(false);
    this.energyData = new ReactiveVar('');
    this.creditDebitTypeSelected = new ReactiveVar('');
    // reactive-var used for transmission invoice
    this.transmissionData = new ReactiveVar('');
    // reactive-var used for SLDC invoice
    this.sldcData = new ReactiveVar(false);
    // reactive-var used for incentive invoice
});
Template.generateCreditDebit.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.generateCreditDebit.events({
    "change #ddlTypeOfCreditDebitSelected": function(e, instance) {
      var creditDebitTypeVar = $(e.currentTarget).val();
      instance.energyData.set('');
      instance.transmissionData.set('');
      instance.sldcData.set('');
      instance.monthAndYearSelected.set('');
      $('#ddlMonth').val('');
      $('#ddlYear').val('');
      instance.creditDebitTypeSelected.set(creditDebitTypeVar);
    },
    "change #ddlMonth": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        instance.energyData.set('');
        if (monthVar != '' && yearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
        }
    },
    "change #ddlYear": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        instance.energyData.set('');
        if (monthVar != '' && yearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
        }
    },
    "click #viewBtn": function(e, instance) {
        var monthVar = $('#ddlMonth').val().trim();
        var yearVar = $('#ddlYear').val().trim();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("getEnergyCreditDebitData", monthVar, yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.energyData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.energyData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    'click #viewCreditDebitPdf': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      window.open(filePath);
    },
    'click #viewCreditDebitDocx': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      window.open(filePath);
    },
    'click #deleteGeneratedCreditDebit': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      var invoiceId = $(e.currentTarget).attr("attrId");
      var typeVar = $(e.currentTarget).attr("type");
      var monthVar = $('#ddlMonth').val();
      var yearVar = $('#ddlYear').val();
      var financialYear = $('#ddlFinancialYearIC').val();
        swal({
            title: "Are you sure?",
            text: "You want to delete invoice!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
          },
        function(){
            Meteor.call("deleteCreditDebitAndPdfFile",invoiceId,filePath,typeVar,monthVar,yearVar,financialYear, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                      swal("Deleted!", "Credit/Debit Successfully Deleted.", "success");
                      if (typeVar == 'Energy') {
                        instance.energyData.set(result.data);
                      }else if (typeVar == 'Transmission') {
                        instance.transmissionData.set(result.data);
                      }else if (typeVar == 'SLDC') {
                        instance.sldcData.set(result.data);
                      }
                    }
                }
            });
        });
    },
    "click #viewBtnTransmission": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("getTransmissionCreditDebitData", monthVar, yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.transmissionData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.transmissionData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    "change #selectFinancialyearSLDC": function(e, instance) {
        var financialYear = $(e.currentTarget).val();
        if (financialYear != '') {
            Meteor.call("getSldcCreditDebitData", financialYear, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        instance.sldcData.set(result.data);
                    }else{
                      swal(result.message);
                      instance.sldcData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    }
});

Template.generateCreditDebit.helpers({
    monthShow() {
        return monthReturn();
    },
    yearHelper() {
        return dynamicYear();
    },
    financialYearHelper(){
      return dynamicFinancialYear();
    },
    isMonthAndYearSelected() {
        if (Template.instance().monthAndYearSelected.get()) {
            return true;
        } else {
            return false;
        }
    },
    serial(index){
      return index+1;
    },
    isEnergyDataAvailable(){
      if(Template.instance().energyData.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    EnergyDataHelper(){
      if(Template.instance().energyData.get() != ''){
        return Template.instance().energyData.get();
      }else{
        return false;
      }
    },
    isEnergyCreditDebitSelectedToView(){
      if(Template.instance().creditDebitTypeSelected.get() == 'Energy'){
        return true;
      }else{
        return false;
      }
    },
    isTransmissionCreditDebitSelectedToView(){
      if(Template.instance().creditDebitTypeSelected.get() == 'Transmission'){
        return true;
      }else{
        return false;
      }
    },
    isSLDCCreditDebitSelectedToView(){
      if(Template.instance().creditDebitTypeSelected.get() == 'SLDC'){
        return true;
      }else{
        return false;
      }
    },
    iftransmissionAvailable(){
      if(Template.instance().transmissionData.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    transmissionDataHelper(){
      if(Template.instance().transmissionData.get() != ''){
        return Template.instance().transmissionData.get();
      }else{
        return false;
      }
    },
    ifSLDCAvailable(){
      if(Template.instance().sldcData.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    SLDCDataHelper(){
      if(Template.instance().sldcData.get() != ''){
        return Template.instance().sldcData.get();
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
    }
});

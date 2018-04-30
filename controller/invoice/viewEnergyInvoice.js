import {ReactiveVar} from 'meteor/reactive-var';

Template.energyInvoiceReport.onCreated(function ss() {
    this.monthAndYearSelected = new ReactiveVar(false);
    this.energyData = new ReactiveVar('');
    this.invoiceTypeSelected = new ReactiveVar('');
    // reactive-var used for transmission invoice
    this.transmissionData = new ReactiveVar('');
    // reactive-var used for SLDC invoice
    this.sldcData = new ReactiveVar(false);
    // reactive-var used for incentive invoice
    this.incentiveData = new ReactiveVar(false);
});
Template.energyInvoiceReport.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.energyInvoiceReport.events({
    "change #ddlTypeOfInvoiceSelected": function(e, instance) {
      var invoiceTypeVar = $(e.currentTarget).val();
      instance.energyData.set('');
      instance.transmissionData.set('');
      instance.sldcData.set('');
      instance.monthAndYearSelected.set('');
      instance.incentiveData.set('');
      $('#ddlMonth').val('');
      $('#ddlYear').val('');
      instance.invoiceTypeSelected.set(invoiceTypeVar);
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
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("getEnergyInvoiceData", monthVar, yearVar, function(error, result) {
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
    'change #ddlFinancialYearIC': function (e, instance) {
      var financialYear = $(e.currentTarget).val();
      if (financialYear != '') {
        Meteor.call("getIncentiveInvoiceReport",financialYear, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                    instance.incentiveData.set(result.data);
                }else{
                  swal(result.message);
                  instance.incentiveData.set('');
                }
            }
        });
      }
    },
    'click #viewInvoicePdf': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      window.open(filePath);
    },
    'click #viewInvoiceDocx': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      window.open(filePath);
    },
    'click #deleteGeneratedInvoice': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      var invoiceId = $(e.currentTarget).attr("attrId");
      var typeVar = $(e.currentTarget).attr("type");
      var monthVar = $('#ddlMonth').val();
      var yearVar = $('#ddlYear').val();
      var financialYear = $('#ddlFinancialYearIC').val();
      if (typeVar == 'SLDC') {
        var financialYear = $('#selectFinancialyearSLDC').val();
      }
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
            Meteor.call("deleteInvocieAndPdfFile",invoiceId,filePath,typeVar,monthVar,yearVar,financialYear, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                      swal("Deleted!", "Invoice Successfully Deleted.", "success");
                      if (typeVar == 'Energy') {
                        instance.energyData.set(result.data);
                      }else if (typeVar == 'Transmission') {
                        instance.transmissionData.set(result.data);
                      }else if (typeVar == 'SLDC') {
                        instance.sldcData.set(result.data);
                      }else if (typeVar == 'Incentive') {
                        instance.incentiveData.set(result.data);
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
            Meteor.call("getTransmissionInvoiceData", monthVar, yearVar, function(error, result) {
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
            Meteor.call("getSldcInvoiceData", financialYear, function(error, result) {
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

Template.energyInvoiceReport.helpers({
    monthShow() {
        return monthReturn();
    },
    yearHelper() {
        return dynamicYear();
    },
    financialYearHelper(){
      return dynamicFinancialYear();
    },
    isDocxAvailable(docxFile){
      if (docxFile) {
        return true;
      }else {
        return false;
      }
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
    isEnergyInvoiceSelectedToView(){
      if(Template.instance().invoiceTypeSelected.get() == 'Energy_Invoice'){
        return true;
      }else{
        return false;
      }
    },
    isTransmissionInvoiceSelectedToView(){
      if(Template.instance().invoiceTypeSelected.get() == 'Transmission_Charges'){
        return true;
      }else{
        return false;
      }
    },
    isSLDCInvoiceSelectedToView(){
      if(Template.instance().invoiceTypeSelected.get() == 'SLDC_Charges'){
        return true;
      }else{
        return false;
      }
    },
    isIncentiveInvoiceSelectedToView(){
      if(Template.instance().invoiceTypeSelected.get() == 'Incentive_Charges'){
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
    incentiveDataHelper(){
      if(Template.instance().incentiveData.get() != ''){
        return Template.instance().incentiveData.get();
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

import {ReactiveVar} from 'meteor/reactive-var';

Template.viewEnergySurcharge.onCreated(function ss() {
    this.monthAndYearSelected = new ReactiveVar(false);
    this.surchargeTypeSelected = new ReactiveVar('');
    // reactive-var used for energy surcharge
    this.energyData = new ReactiveVar('');
    // reactive-var used for transmission surcharge
    this.transmissionData = new ReactiveVar('');
    // reactive-var used for SLDC surcharge
    this.sldcData = new ReactiveVar(false);
    // reactive-var used for incentive surcharge
    this.incentiveData = new ReactiveVar(false);
    this.returnedpath = new ReactiveVar;
});
Template.viewEnergySurcharge.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.viewEnergySurcharge.events({
    "change #ddlTypeOfSurchargeSelected": function(e, instance) {
      var surchargeTypeVar = $(e.currentTarget).val();
      instance.monthAndYearSelected.set('');
      instance.energyData.set('');
      instance.transmissionData.set('');
      instance.sldcData.set('');
      instance.incentiveData.set('');
      $('#ddlMonth').val('');
      $('#ddlYear').val('');
      instance.surchargeTypeSelected.set(surchargeTypeVar);
    },
    "change #ddlMonth": function(e, instance) {
       $('#ddlYear').val('');
        var monthVar = $('#ddlMonth').val();
        var financYearVar = $('#ddlYear').val();
        instance.energyData.set('');
        if (monthVar != '' && financYearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
        }
    },
    "change #ddlYear": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var financYearVar = $('#ddlYear').val();
        instance.energyData.set('');
        if (monthVar != '' && financYearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
        }
    },
    "click #viewBtn": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var financYearVar = $('#ddlYear').val();
        if (monthVar != '' && financYearVar != '') {
            Meteor.call("getEnergySurchargeData", monthVar, financYearVar, function(error, result) {
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
        Meteor.call("getIncentiveSurchargeData",financialYear, function(error, result) {
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
    'click #viewSurchargePdf': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      var filePath1 = '/upload'+filePath+".pdf";
      window.open(filePath1);
   },
    'click #viewSurchargeDocx': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      var filePath1 = '/upload'+filePath+".docx";
      window.open(filePath1);
   },
    'click #deleteGeneratedSurcharge': function(e, instance){
      var filePath = $(e.currentTarget).attr("filePath");
      var id = $(e.currentTarget).attr("attrId");
      var typeVar = $(e.currentTarget).attr("type");
      var monthVar = $('#ddlMonth').val();
      console.log(filePath,id);
      if($('#financialyearSLDC').val()){
        var year = $('#financialyearSLDC').val();
        console.log(year);
      }else if($('#ddlFinancialYearIC').val()){
        var year = $('#ddlFinancialYearIC').val();
          console.log(year);
      }else if($('#ddlYear').val()){
        var year = $('#ddlYear').val();
          console.log(year);
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
            Meteor.call("deleteSurchargeAndPdfFile",id,filePath,typeVar,monthVar,year, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                      swal("Deleted!", "Surcharge Successfully Deleted.", "success");
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
        var finanYearVar = $('#ddlYear').val();
        if (monthVar != '' && finanYearVar != '') {
          console.log(monthVar);
          console.log(finanYearVar);
            Meteor.call("getTransmissionSurchargeData", monthVar, finanYearVar, function(error, result) {
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
    "change #financialyearSLDC": function(e, instance) {
        var financialYear = $(e.currentTarget).val();
        if (financialYear != '') {
            Meteor.call("getSldcSurchargeData", financialYear, function(error, result) {
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

Template.viewEnergySurcharge.helpers({
    monthShow() {
        return monthReturn();
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
    isEnergySurchargeSelectedToView(){
      if(Template.instance().surchargeTypeSelected.get() == 'Energy_Surcharge'){
        return true;
      }else{
        return false;
      }
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
  isTransmissionSurchargeSelectedToView(){
      if(Template.instance().surchargeTypeSelected.get() == 'Transmission_Surcharge'){
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
    isSLDCSurchargeSelectedToView(){
      if(Template.instance().surchargeTypeSelected.get() == 'SLDC_Surcharge'){
        return true;
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
    isIncentiveSurchargeSelectedToView(){
      if(Template.instance().surchargeTypeSelected.get() == 'Incentive_Surcharge'){
        return true;
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
    // filepath(){
    //     if(Template.instance().returnedpath.get()!= undefined){
    //         console.log(Template.instance().returnedpath.get());
    //         return Template.instance().returnedpath.get();
    //     }
    //   }
});

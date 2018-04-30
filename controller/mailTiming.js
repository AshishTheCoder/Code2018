import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.mailTiming.onCreated(function xyz() {
    this.radioSelectedVar = new ReactiveVar('');
    this.ddlTypeSelectedVar = new ReactiveVar('');
    this.ddlStateSelectedVar = new ReactiveVar('');
    this.ddlTimeSelectedVar = new ReactiveVar('');
    this.gettingPreviousDataVar = new ReactiveVar('');
    this.viewTimingDetailVar = new ReactiveVar('');
    this.isAllFieldsAreFilled = new ReactiveVar('');
});

Template.mailTiming.rendered = function(){};

Template.mailTiming.events({
  "change #SetMailTimngRadioId": function(e, instance) {
    var selectedRadioVar = $(e.currentTarget).val();
    instance.ddlTypeSelectedVar.set('');
    instance.ddlStateSelectedVar.set('');
    instance.ddlTimeSelectedVar.set('');
    instance.gettingPreviousDataVar.set('');
    instance.viewTimingDetailVar.set('');
    instance.isAllFieldsAreFilled.set('');
    if(selectedRadioVar == 'SetMailTimng'){
      instance.radioSelectedVar.set(selectedRadioVar);
    }else if(selectedRadioVar == 'ViewMailTimng'){
      instance.radioSelectedVar.set(selectedRadioVar);
    }
  },
  "focus .txtDateClass": function() {
      $('.txtDateClass').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
  },
  "change #txtDate": function(e, instance){
    var selectedDate = $(e.currentTarget).val();
    $('#ddlType').val('');
    $('#ddlState').val('');
    $('#ddlTime').val('');
    instance.ddlStateSelectedVar.set('');
    instance.ddlTimeSelectedVar.set('');
    instance.gettingPreviousDataVar.set('');
    instance.ddlTypeSelectedVar.set('');
  },
  "change #ddlType": function(e, instance){
    $('#ddlState').val('');
    $('#ddlTime').val('');
    instance.ddlStateSelectedVar.set('');
    instance.ddlTimeSelectedVar.set('');
    instance.gettingPreviousDataVar.set('');
    var ddlTypeVar = $(e.currentTarget).val();
    var selectedDate = $('#txtDate').val();
    if(selectedDate != '' && ddlTypeVar != ''){
      instance.ddlTypeSelectedVar.set(ddlTypeVar);
      if(ddlTypeVar == 'DISCOM'){
        Meteor.call("getPriviousInsetrdTime",selectedDate,ddlTypeVar,'ddlStateVar', function(error, result){
          if(error){
            swal("Oops...", "Please try again!", "error");
          }else{
            if (result.status) {
              instance.gettingPreviousDataVar.set(result.data);
            }
          }
        });
      }
    }else{
      swal("All fields are required!");
    }
  },
  "change #ddlState": function(e, instance){
    $('#ddlTime').val('');
    instance.ddlTimeSelectedVar.set('');
    instance.gettingPreviousDataVar.set('');
    var ddlStateVar = $(e.currentTarget).val();
    var selectedDate = $('#txtDate').val();
    var ddlTypeVar = $('#ddlType').val();
    if(selectedDate != '' && ddlTypeVar != '' && ddlStateVar != ''){
      instance.ddlStateSelectedVar.set(ddlStateVar);
      if(ddlTypeVar == 'SLDC'){
        Meteor.call("getPriviousInsetrdTime",selectedDate,ddlTypeVar,ddlStateVar, function(error, result){
          if(error){
            swal("Oops...", "Please try again!", "error");
          }else{
            if (result.status) {
              instance.gettingPreviousDataVar.set(result.data);
            }
          }
        });
      }
    }else{
      swal("All fields are required!");
    }
  },
  "change #ddlTime": function(e, instance){
    var ddlTimeVar = $(e.currentTarget).val();
    var selectedDate = $('#txtDate').val();
    var ddlTypeVar = $('#ddlType').val();
    if(ddlTypeVar == 'DISCOM'){
      if(selectedDate != '' && ddlTypeVar != ''  && ddlTimeVar != ''){
        instance.ddlTimeSelectedVar.set(ddlTimeVar);
      }else{
        swal("All fields are required!");
      }
    }else if(ddlTypeVar == 'SLDC'){
      var ddlStateVar = $('#ddlState').val();
      if(selectedDate != '' && ddlTypeVar != '' && ddlStateVar != '' && ddlTimeVar != ''){
        instance.ddlTimeSelectedVar.set(ddlTimeVar);
      }else{
        swal("All fields are required!");
      }
    }
  },
  "click #btnSubmitTime": function(e, instance){
    $('#btnSubmitTime').hide();
    var selectedDate = $('#txtDate').val();
    var ddlTypeVar = $('#ddlType').val();
    var ddlTimeVar = $('#ddlTime').val();
    if(ddlTypeVar == 'DISCOM'){
      if(selectedDate != '' && ddlTypeVar != ''  && ddlTimeVar != ''){
        swal({
            title: "Are you sure?",
            text: "You want to submit timing!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
              Meteor.call("reportTimingData",selectedDate,ddlTypeVar,ddlTimeVar,'ddlStateVar', function(error, result){
                if(error){
                  $('#btnSubmitTime').show();
                  swal("Oops...", "Please try again!", "error");
                }else{
                  if (result.status) {
                    $('#btnSubmitTime').show();
                    swal("Submitted!", "Timing successfully submitted.", "success");
                  }
                }
              });
            } else {
              $('#btnSubmitTime').show();
            }
        });
      }else{
        swal("All fields are required!");
      }
    }else if(ddlTypeVar == 'SLDC'){
      var ddlStateVar = $('#ddlState').val();
      if(selectedDate != '' && ddlTypeVar != '' && ddlStateVar != '' && ddlTimeVar != ''){
        swal({
            title: "Are you sure?",
            text: "You want to submit timing!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
              Meteor.call("reportTimingData",selectedDate, ddlTypeVar,ddlTimeVar,ddlStateVar, function(error, result){
                if(error){
                  $('#btnSubmitTime').show();
                  swal("Oops...", "Please try again!", "error");
                }else{
                  if (result.status) {
                    $('#btnSubmitTime').show();
                    swal("Submitted!", "Timing successfully submitted.", "success");
                  }
                }
              });
            } else {
              $('#btnSubmitTime').show();
            }
        });
      }else{
        swal("All fields are required!");
      }
    }else{
      swal("All fields are required!");
    }
  },
  'change #txtDateFrom'(e, instance){
    $('#txtDateTo').val('');
    $('#ddlTypeView').val('');
    instance.ddlTypeSelectedVar.set('');
    instance.viewTimingDetailVar.set('');
    instance.isAllFieldsAreFilled.set('');
  },
  'change #txtDateTo'(e, instance){
    $('#ddlTypeView').val('');
    instance.ddlTypeSelectedVar.set('');
    instance.viewTimingDetailVar.set('');
    instance.isAllFieldsAreFilled.set('');
  },
  'change #ddlTypeView'(e, instance){
    instance.viewTimingDetailVar.set('');
    var fromDateVar = $('#txtDateFrom').val();
    var toDateVar = $('#txtDateTo').val();
    var ddlTypeVar = $('#ddlTypeView').val();
    if(fromDateVar != '' && toDateVar != '' && ddlTypeVar != ''){
      instance.ddlTypeSelectedVar.set(ddlTypeVar);
    }else{
      instance.ddlTypeSelectedVar.set('');
      swal("All fields are required!");
    }
  },
  'change #ddlStateToView'(e, instance){
    instance.viewTimingDetailVar.set('');
    var fromDateVar = $('#txtDateFrom').val();
    var toDateVar = $('#txtDateTo').val();
    var ddlTypeVar = $('#ddlTypeView').val();
    var ddlStateVar = $('#ddlStateToView').val();
    if(fromDateVar != '' && toDateVar != '' && ddlTypeVar != '' && ddlStateVar != ''){
      instance.isAllFieldsAreFilled.set(ddlStateVar);
    }else{
      instance.isAllFieldsAreFilled.set('');
      swal("All fields are required!");
    }
  },
  "click #btnViewMAilTiming": function(e, instance){
    var fromDateVar = $('#txtDateFrom').val();
    var toDateVar = $('#txtDateTo').val();
    var reportType = $('#ddlTypeView').val();
    if(reportType == 'DISCOM'){
      if(fromDateVar != '' && toDateVar != '' && reportType != ''){
        Meteor.call("viewReportTimingData",fromDateVar,toDateVar,reportType,'ddlStateVar', function(error, result){
          if(error){
            swal("Oops...", "Please try again!", "error");
          }else{
            if (result.status) {
              var data = result.data;
              if(data.length > 0){
                instance.viewTimingDetailVar.set(result.data);
              }else{
                instance.viewTimingDetailVar.set('');
                swal("Timing not submitted!");
              }
            }
          }
        });
      }else{
        swal("All fields are required!");
      }
    }else if(reportType == 'SLDC'){
      var ddlStateVar = $('#ddlStateToView').val();
      if(fromDateVar != '' && toDateVar != '' && reportType != '' && ddlStateVar != ''){
        Meteor.call("viewReportTimingData",fromDateVar,toDateVar,reportType,ddlStateVar, function(error, result){
          if(error){
            swal("Oops...", "Please try again!", "error");
          }else{
            if (result.status) {
              var data = result.data;
              if(data.length > 0){
                instance.viewTimingDetailVar.set(result.data);
              }else{
                instance.viewTimingDetailVar.set('');
                swal("Timing not submitted!");
              }

            }
          }
        });
      }else{
        swal("All fields are required!");
      }
    }else{
      swal("All fields are required!");
    }

  }
});

Template.mailTiming.helpers({
  idRadioButtonSelectedSetTiming(){
    if(Template.instance().radioSelectedVar.get() == 'SetMailTimng'){
      return true;
    }else{
      return false;
    }
  },
  idRadioButtonSelectedViewMailTimng(){
    if(Template.instance().radioSelectedVar.get() == 'ViewMailTimng'){
      return true;
    }else{
      return false;
    }
  },
  isDISCOMSeclected(){
    if(Template.instance().ddlTypeSelectedVar.get() == 'DISCOM'){
      return true;
    }else{
      return false;
    }
  },
  isSLDCSeclected(){
    if(Template.instance().ddlTypeSelectedVar.get() == 'SLDC'){
      return true;
    }else{
      return false;
    }
  },
  isSLDCAndStateSelected(){
    if(Template.instance().ddlTypeSelectedVar.get() == 'SLDC' &&  Template.instance().isAllFieldsAreFilled.get() != ''){
      return true;
    }else{
      return false;
    }
  },
  isTimeSelected(){
    if(Template.instance().ddlTimeSelectedVar.get() != ''){
      return true;
    }else{
      return false;
    }
  },
  isPreviousTimeAvailable(){
    if(Template.instance().gettingPreviousDataVar.get() != ''){
      return Template.instance().gettingPreviousDataVar.get();
    }else{
      return false;
    }
  },
  isddlStateSelected(){
    if(Template.instance().ddlStateSelectedVar.get() != ''){
      return true;
    }else{
      return false;
    }
  },
  isViewTimingDetailAvailable(){
    if(Template.instance().viewTimingDetailVar.get() != ''){
      return true;
    }else{
      return false;
    }
  },
  ViewTimingDetailData(){
    if(Template.instance().viewTimingDetailVar.get() != ''){
      return Template.instance().viewTimingDetailVar.get();
    }else{
      return false;
    }
  },
  timeArr(){
    if(Template.instance().ddlTypeSelectedVar.get() != ''){
      var timrArrVar = ['10:30 AM','10:45 AM','11:00 AM','11:15 AM','11:30 AM','11:45 AM','12:00 PM','12:15 PM','12:30 PM','12:45 PM','01:00 PM','01:15 PM','01:30 PM','01:45 PM','02:00 PM','02:15 PM','02:30 PM','02:45 PM','03:00 PM','03:15 PM','03:30 PM','03:45 PM','04:00 PM','04:15 PM','04:30 PM','04:45 PM','05:00 PM','05:15 PM','05:30 PM','05:45 PM','06:00 PM','06:15 PM','06:30 PM','06:45 PM','07:00 PM','07:15 PM','07:30 PM','07:45 PM','08:00 PM','08:15 PM','08:30 PM','08:45 PM','09:00 PM','09:15 PM','09:30 PM','09:45 PM','10:00 PM'];
      return timrArrVar;
    }else{
      return false;
    }
  },
  serial(index) {
      return index + 1;
  },
});

import {ReactiveVar} from 'meteor/reactive-var';

Template.exportExcelSLDCANDDiscom.onCreated(function exportExcel() {
    this.stateList = new ReactiveVar();
    this.revisionNumber = new ReactiveVar();
    this.generatedExcel = new ReactiveVar();

});
Template.exportExcelSLDCANDDiscom.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.exportExcelSLDCANDDiscom.events({
    "focus #txtDate": function() {
        $('#txtDate').datepicker({format: 'dd-mm-yyyy', startDate: '11-03-2017', endDate: '+1d', autoclose: true});
    },
    "change #txtDate": function(e, instance) {
      $('#ddlReportType').val('');
      $('#ddlStateList').val('');
      $('#ddlRevisionNo').val('');
      instance.stateList.set();
      instance.revisionNumber.set();
      instance.generatedExcel.set();
    },
    "change #ddlReportType": function(e, instance) {
      $('#ddlRevisionNo').val('');
      $('#ddlStateList').val('');
      instance.revisionNumber.set();
      instance.generatedExcel.set();
      var reportType = $(e.currentTarget).val();
      var selctedDate = $('#txtDate').val();
      if (selctedDate != '' && reportType != '') {
        Meteor.call("getStateList", reportType, selctedDate, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                  console.log(result.data);
                    instance.stateList.set(result.data);
                }else {
                  swal(result.message);
                }
            }
        });
      }
    },
    "change #ddlStateList": function(e, instance) {
      $('#ddlRevisionNo').val('');
      instance.generatedExcel.set();
      var state = $(e.currentTarget).val();
      var reportType = $('#ddlReportType').val();
      var selctedDate = $('#txtDate').val();
      Meteor.call("getExcelRevisionNumber",reportType,selctedDate,state, function(error, result) {
          if (error) {
              swal("Please try again !");
          } else {
              if (result.status) {
                  console.log(result.data);
                  instance.revisionNumber.set(result.data);
              }
          }
      });
    },
    "change #ddlRevisionNo": function(e, instance) {
      var revisionNo = $(e.currentTarget).val();
      var state = $('#ddlStateList').val();
      var reportType = $('#ddlReportType').val();
      var selctedDate = $('#txtDate').val();
      Meteor.call("getGeneratedExcel",selctedDate,reportType,state,revisionNo, function(error, result) {
          if (error) {
              swal("Please try again !");
          } else {
              if (result.status) {
                  console.log(result.data);
                  instance.generatedExcel.set(result.data);
              }
          }
      });
    },
});

Template.exportExcelSLDCANDDiscom.helpers({
    stateList() {
      if (Template.instance().stateList.get()) {
        return Template.instance().stateList.get();
      }else {
        return false;
      }
    },
    revisionNumberList() {
      if (Template.instance().revisionNumber.get()) {
        return Template.instance().revisionNumber.get();
      }else {
        return false;
      }
    },
    generatedExcelData() {
      if (Template.instance().generatedExcel.get()) {
        return Template.instance().generatedExcel.get();
      }else {
        return false;
      }
    },
    serial(index) {
      return index + 1;
    }
});

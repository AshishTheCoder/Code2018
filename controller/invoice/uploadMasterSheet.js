import {ReactiveVar} from 'meteor/reactive-var';

Template.uploadMasterSheet.onCreated(function abcd() {
  this.monthSelected = new ReactiveVar;
});

Template.uploadMasterSheet.rendered = function() {
    SessionStore.set("isLoading", false);
};
Template.uploadMasterSheet.events({
  "click .jqUploadclass": function(e, t) {
      $(e.currentTarget).attr('url', "");
      $(e.currentTarget).attr('isUploaded', "NO");
  },
  "click .done": function(e, t) {
      $('.jqUploadclass').attr('url', "");
      $('.jqUploadclass').attr('isUploaded', "NO");
  },
  "click #btnUploadMasterSheet": function(e, instance) {
    var url = $('.jqUploadclass').attr('url');
    var check = $('.jqUploadclass').attr('isUploaded');
    var filePath = $('.jqUploadclass').attr('fileUploadedPath');
    var href = $('.jqUploadclass').attr('hrefValue');
    if ($('#ddlMonth').val() != '') {
      if ($('.jqUploadclass').attr('isUploaded') == "YES") {
        Meteor.call('uploadMasterSheetExcel', filePath, href, $('#ddlMonth').val(), function(error, result) {
          if (error) {
            swal("Oops...", "Please try again!", "error");
            Meteor.call('deleteUploadedFile', filePath);
          }else {
            if (result.status) {
              swal("Uploaded", "Excel uploaded successfull!", "success");
            }
          }
        });
      }else {
        swal("Please upload file!");
      }
    }else {
      swal("Please select month!")
    }
  }

});
Template.uploadMasterSheet.helpers({
  monthReturn() {
      return monthReturn()
  },
  specificFormData: function() {
      return {uploadedFrom: 'uploadMasterSheet'};
  },
  myCallbacks: function() {
      return {
          finished: function(index, fileInfo, context) {
              var setName = fileInfo.baseUrl + fileInfo.name;
              $(".jqUploadclass").eq(index).attr('url', setName);
              $(".jqUploadclass").eq(index).attr('hrefValue', fileInfo.hrefValue);
              $(".jqUploadclass").eq(index).attr('fileUploadedPath', fileInfo.actualPath);
              $(".jqUploadclass").eq(index).attr('isUploaded', "YES");
              // console.log(fileInfo);
          }
      }
  },
});

import {ReactiveVar} from 'meteor/reactive-var';

Template.uploadRRF.onCreated(function ss() {
  this.fileHref = new ReactiveVar;
    this.state = new ReactiveVar;
});
Template.uploadRRF.rendered = function() {
    SessionStore.set("isLoading", false);
    $('.selectDate').datepicker({format: 'dd-mm-yyyy',endDate: '+1d', autoclose: true})
};

Template.uploadRRF.events({
    "click .jqUploadclass": function(e, t) {
        $(e.currentTarget).attr('url', "");
        $(e.currentTarget).attr('isUploaded', "NO");
    },
    "click .done": function(e, t) {
        $('.jqUploadclass').attr('url', "");
        $('.jqUploadclass').attr('isUploaded', "NO");
    },
    'click #uploadRRFfile' (e, instance) {
        $('#uploadRRFfile').hide();
        if ($('.jqUploadclass').attr('url')) {
            console.log($('.jqUploadclass').attr('url'));
            if ($('.jqUploadclass').attr('isUploaded') == "YES" && $('.selectDate').val() != '') {
                if ($('#revisedState').val()) {
                    var filePath = $('.jqUploadclass').attr('fileUploadedPath');
                    var href = $('.jqUploadclass').attr('hrefValue');
                    instance.fileHref.set(href);
                    Meteor.call('readRRFfile', $('#revisedState').val(), filePath, href, $('.selectDate').val(), function(error, result) {
                        if (error) {
                            $('.done').click();
                            Meteor.call('deleteUploadedFile', filePath);
                            swal("Oops...", "Excel file is not in RRF format!", "error");
                            $('#uploadRRFfile').show();
                        } else {
                            if (result.status) {
                                swal("Uploaded", "Excel uploaded successfull!", "success");
                                $('.done').click();
                                $('#uploadRRFfile').show();
                            } else {
                                if (result.message == 'Selected and excel date Mismatch') {
                                    swal({
                                        title: "Are you sure?",
                                        text: "Selected date does not match to RRF date",
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#55dd6b",
                                        confirmButtonText: "Yes, upload it!",
                                        closeOnConfirm: false
                                    }, function(isConfirm) {
                                        if (isConfirm) {
                                            Meteor.call('readRRFfile', $('#revisedState').val(), filePath, href, $('.selectDate').val(), "exceptCase", function(error, result) {
                                                if (error) {
                                                    swal("Oops...", "Excel file is not in RRF format!", "error");
                                                    Meteor.call('deleteUploadedFile', filePath);
                                                    $('.done').click();
                                                    $('#uploadRRFfile').show();
                                                } else {
                                                    if (result.status) {
                                                        swal("Uploaded!", "Uploaded successfully", "success");
                                                        $('.done').click();
                                                        console.log(result.message);
                                                        $('#uploadRRFfile').show();
                                                    } else {
                                                        Meteor.call('deleteUploadedFile', filePath);
                                                        $('.done').click();
                                                        swal("Oops...", result.message, "error");
                                                        $('#uploadRRFfile').show();
                                                    }
                                                }
                                            })
                                        } else {
                                            Meteor.call('deleteUploadedFile', filePath);
                                            $('.done').click();
                                            $('#uploadRRFfile').show();
                                        }
                                    });
                                } else {
                                    $('#uploadRRFfile').show();
                                    $('.done').click();
                                    if (result.message == 'Some mid revision missing') {
                                        Meteor.call('deleteUploadedFile', filePath);
                                    }
                                    swal("Oops...", result.message, "error");
                                }
                            }
                        }
                    })
                }

                 else {
                    $('#uploadRRFfile').show();
                    swal("Please Select Revised State");
                    return 0;
                }
            } else {
                $('#uploadRRFfile').show();
                swal("Please Upload File To Submit here");
                return 0;
            }
        } else {
            $('#uploadRRFfile').show();
            swal("Please Upload File To Submit");
            return 0;
        }
    }
})
Template.uploadRRF.helpers({
    specificFormData: function() {
        return {uploadedFrom: 'uploadRRF'};
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
    generateHref() {
        return Template.instance().fileHref.get();
    }
})

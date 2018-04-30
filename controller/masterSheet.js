import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.masterSheet.onCreated(function abc() {
    this.discomScheme = new ReactiveVar;
    this.discomName = new ReactiveVar;
    this.monthAndYearSelected = new ReactiveVar(false);
    this.masterData = new ReactiveVar('');
});
Template.masterSheet.onRendered(function abc() {
  $("#mastersheet").validate({
      rules: {
          scheme: {
              required: true
          },
          discom_name: {
              required: true
          },
          financial_year: {
              required: true
          },
          month: {
              required: true
          },
          energy: {
              required: true,
              number: true
          },
          rate: {
              required: true,
              number: true
          },
          due_date: {
              required: true
          },
          due_amount: {
              required: true,
              number: true
          },
          recev_amount: {
              required: true,
              number: true
          }
      },
      messages: {
          scheme: {
              required: "Scheme is required"
          },
          discom_name: {
              required: "Party name is required"
          },
          financial_year: {
              required: "Financial year is required"
          },
          month: {
              required: "Month is required"
          },
          energy: {
              required: "Energy is required",
              number: "Energy must be a number"
          },
          rate: {
              required: "Rate is required",
              number: "Rate must be a number"
          },
          due_date: {
              required: "Due date is required",
          },
          due_amount: {
              required: "Due amount is required",
              number: "Due amount must be a number"
          },
          recev_amount: {
              required: "Received amount is required",
              number: "Received amount must be a number"
          }
      }
  });
    var instance = Template.instance();
    SessionStore.set("isLoading", true);
    Meteor.call("getScheme", function(error, result) {
        if (error) {
            SessionStore.set("isLoading", false);
            swal("Please try again!");
        } else {
            if (result.status) {
                SessionStore.set("isLoading", false);
                instance.discomScheme.set(result.data);
            }
        }
    })
});


Template.masterSheet.events({
  "focus .clsDueDate": function() {
      $('.clsDueDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
  },
    'change #scheme' (e, instance) {
        instance.discomName.set();
        var discomScheme = $(e.currentTarget).val();
        if (discomScheme != '') {
          SessionStore.set("isLoading", true);
            Meteor.call('getDiscomName', discomScheme, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                      SessionStore.set("isLoading", false);
                      instance.discomName.set(result.data);
                    }
                }
            });
        } else {
            instance.discomName.set();
        }
    },
    'change #discom_name' (e, instance) {
        var discom_name = $(e.currentTarget).val();
        $('#financial_year').val('');
        $('#month').val('');
    },
    "submit form#mastersheet": function(e, instance) {
      e.preventDefault();
        var json = '{';
        $("#mastersheet input.form-control, #mastersheet select.form-control, #mastersheet textarea.form-control").each(function(value, element) {
            json += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        json = $.parseJSON(json.replace(/,\s*$/, '') + '}');
        json.discomId = $("#discom_name option:selected").attr("attr");
        json.schemeId = $("#scheme option:selected").attr("attr");
        json.timestamp = new Date();
        json.delete_status = false;
        // if (json.due_amount != '' && json.due_date != '' && json.rate != '' && json.scheme != '' && json.discom_name != '' && json.financial_year != '' && json.month != '' && json.energy != '' && json.recev_amount != '') {
            SessionStore.set("isLoading", true);
            Meteor.call('SaveMasterSheetForFirstTimeEntry', json, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading", false);
                  swal("Oops...", "Please try again!", "error");
                } else {
                  SessionStore.set("isLoading", false);
                    if (result.status) {
                        if (result.data == 1) {
                            swal({
                                title: "Are you sure?",
                                text: "Data is already submitted for this month, Do you want to submit it again!",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#55dd6b",
                                confirmButtonText: "Yes, submit it!",
                                closeOnConfirm: false
                            }, function(isConfirm) {
                                if (isConfirm) {
                                  SessionStore.set("isLoading", true);
                                    Meteor.call('SaveMasterSheet', json, function(error, result) {
                                        if (error) {
                                          SessionStore.set("isLoading", false);
                                          swal("Oops...", "Please try again!", "error");
                                        } else {
                                          SessionStore.set("isLoading", false);
                                          swal("Submitted!", "Data Successfully Submitted.", "success");
                                          $('.clsMasterSheet').each(function() {
                                              $(this).val('');
                                          });
                                        }
                                    });
                                } else {}
                            });
                        } else {
                            swal("Submitted!", "Data Successfully Submitted.", "success");
                            $('.clsMasterSheet').each(function() {
                                $(this).val('');
                            });
                        }
                    } else {
                        swal(result.message);
                    }
                }
            });
        // } else {
        //     swal("All fields are required!")
        // }

    },
    "change #ddlYear": function(e, instance) {
      $('#ddlMonth').val('');
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        instance.masterData.set('');
        if (monthVar != '' && yearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
        }
    },
    "change #ddlMonth": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        instance.masterData.set('');
        if (monthVar != '' && yearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
        }
    },
    "click #viewBtn": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val
        if (monthVar != '' && yearVar != '') {
            SessionStore.set("isLoading", true);
            Meteor.call("getMasterData", monthVar, yearVar, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again !");
                } else {
                    SessionStore.set("isLoading", false);
                    if (result.status) {
                        instance.masterData.set(result.data);
                    } else {
                        swal(result.message);
                        instance.masterData.set('');
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    'click #deleteMasterSheetData': function(e, instance) {

        var id = $(e.currentTarget).attr("attrId");
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        swal({
                title: "Are you sure?",
                text: "You want to delete it!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            },
            function() {
              SessionStore.set("isLoading", true);
                Meteor.call("deleteMasterSheetData", id, monthVar, yearVar, function(error, result) {
                    if (error) {
                      SessionStore.set("isLoading", false);
                        swal("Please try again !");
                    } else {
                        if (result.status) {
                          SessionStore.set("isLoading", false);
                            swal("Deleted!", "Master Sheet Data Successfully Deleted!", "success");
                            instance.masterData.set(result.data);
                        }
                    }
                });
            });
    }
});

Template.masterSheet.helpers({
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
    isDiscomSchemeSelected() {
        if (Template.instance().discomScheme.get()) {
            return true;
        } else {
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
    serial(index) {
        return index + 1;
    },
    isMasterSheetDataAvailable() {
        if (Template.instance().masterData.get() != '') {
            return true;
        } else {
            return false;
        }
    },
    MasterDataHelper() {
        if (Template.instance().masterData.get() != '') {
            return Template.instance().masterData.get();
        } else {
            return false;
        }
    }
});

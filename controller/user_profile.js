import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.users_profile.onCreated(function abcd() {
    // this.getJson = new ReactiveVar;
    this.radioValue = new ReactiveVar;
    this.formValueSpd = new ReactiveVar('');
    this.formValueDiscom = new ReactiveVar;
    this.readonly = new ReactiveVar;
    this.getEditSpdId = new ReactiveVar;
    this.userDataReactiveVar = new ReactiveVar;
});

Template.users_profile.rendered = function() {
  SessionStore.set("isLoading",false);
    $('.fromdateDiscom').datepicker().on('changeDate', function(ev) {
        $(this).datepicker('hide');
    });
    $('.todateDiscom').datepicker().on('changeDate', function(ev) {
        $(this).datepicker('hide');
    });
    $('.validityDiscom').datepicker().on('changeDate', function(ev) {
        $(this).datepicker('hide');
    });
    $('.sldcValidityDiscom').datepicker().on('changeDate', function(ev) {
        $(this).datepicker('hide');
    });
};

Template.users_profile.events({
    "change #inlineRadio": function(e, instance) {
      var selectedRadioData = $(e.currentTarget).val();
      instance.radioValue.set(selectedRadioData);
      instance.formValueSpd.set('');
      SessionStore.set("isLoading",true);
      Meteor.call("gettingSPDandDiscomData",selectedRadioData, function(error, result) {
          if (error) {
              SessionStore.set("isLoading",false);
              swal("Please try again!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading",false);
                  instance.userDataReactiveVar.set(result.data);
              }
          }
      });
    },
    "click .clsBtnViewSpd": function(e, instance) {
      instance.readonly.set(true);
      instance.formValueSpd.set('');
        SessionStore.set("isLoading",true);
        Meteor.call("callValueSpd", "showForm", $(e.currentTarget).attr("data-title"), function(error, result) {
            if (error) {
                SessionStore.set("isLoading",false);
                swal("Please try again!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading",false);
                    var json = result.data;
                    instance.formValueSpd.set(json);
                }
            }
        });
    },
    "click .clsBtnEditSpd": function(e, instance) {
        instance.readonly.set(false);
        SessionStore.set("isLoading",true);
        instance.formValueSpd.set('');
        instance.getEditSpdId.set($(e.currentTarget).attr("data-title"));
        Meteor.call("callValueSpd", "showForm", $(e.currentTarget).attr("data-title"), function(error, result) {
            if (error) {
                SessionStore.set("isLoading",false);
                swal("Please try again!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading",false);
                    instance.formValueSpd.set(result.data);
                }
            }
        })
    },
    // "click #removeSpd": function(e, t) {
    //     if (confirm("Are you sure! you want to delete user.")) {
    //         Meteor.call("callValueSpd", "delete", $(e.currentTarget).attr("data-title"), function(error, result) {
    //             if (error) {
    //                 swal("Please try again !");
    //             } else {
    //                 if (result.status) {
    //                     swal(result.status);
    //                 }
    //             }
    //         });
    //     }
    // },
    "click #updateSpd": function(e, instance) {
        e.preventDefault();
        var updateSpd = '{';
        $("input.updateSpd,select.updateSpd").each(function(value, element) {
            updateSpd += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        updateSpd = $.parseJSON(updateSpd.replace(/,\s*$/, '') + '}');
        swal({
        title: "Are you sure?",
        text: "You want to update SPD profile!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#55dd6b",
        confirmButtonText: "Yes, update it!",
        closeOnConfirm: false
    },
    function() {
      Meteor.call("updateSpd", instance.getEditSpdId.get(), updateSpd, function(error, result) {
          if (error) {
              swal("Please try again!");
          } else {
              if (result.status) {
                  $(".closeSpd").click();
                  // swal(result.message);
                  swal("Nice!", "SPD profile successfully updated! ", "success");
              }
          }
      });
    });
    },
    "click .clsBtnViewDiscom": function(e, instance) {
        instance.readonly.set(true);
        instance.formValueDiscom.set();
        Meteor.call("callValueDiscom", 'showForm',$(e.currentTarget).attr("data-title"), function(error, result) {
            if (error) {
                swal("Please try again!");
            } else {
                if (result.status) {
                    instance.formValueDiscom.set(result.data);
                }
            }
        });
    },
    "click .clsBtnEditDiscom": function(e, instance) {
        instance.readonly.set(false);
        instance.formValueDiscom.set();
        Meteor.call("callValueDiscom",'showForm',$(e.currentTarget).attr("data-title"), function(error, result) {
            if (error) {
                swal("Please try again!");
            } else {
                if (result.status) {
                    instance.formValueDiscom.set(result.data);
                }
            }
        });
    },
    "click #updateDiscom": function(e, instance) {
        e.preventDefault();
        var getId = $('#updateDiscom').attr("attr");
        var updateDiscom = '{';
        $("input.updateDiscom").each(function(value, element) {
            updateDiscom += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        updateDiscom = $.parseJSON(updateDiscom.replace(/,\s*$/, '') + '}');
        var scheme = $('.updateDiscomSceheme').val();
        updateDiscom.scheme = scheme;
        // var data = instance.formValueDiscom.get();
        // updateDiscom.spdIds = data.spdIds;
        swal({
        title: "Are you sure?",
        text: "You want to update discom profile!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#55dd6b",
        confirmButtonText: "Yes, update it!",
        closeOnConfirm: false
    },
    function() {
      Meteor.call("updateDiscom", getId, updateDiscom, function(error, result) {
          if (error) {
              swal("Please try again !");
          } else {
              if (result.status) {
                  $(".closeDiscom").click();
                  $(".updateDiscomSceheme").val('');
                  // swal(result.message);
                  instance.formValueDiscom.set();
                  swal("Nice!", "Discom profile successfully updated! ", "success");

              }
          }
      });
    });

    },
// use only for remove discom
    "click #removeDiscom": function(e, t) {
        if (confirm("Are you sure! you want to delete user.")) {
            Meteor.call("callValueDiscom","delete", $(e.currentTarget).attr("data-title"), function (error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        swal(result.message);
                    }
                  }
            });
        }
    }
});

Template.users_profile.helpers({
    "returnJson": function() {
        if (Template.instance().userDataReactiveVar.get() != '') {
            return Template.instance().userDataReactiveVar.get();
        } else {
            return false;
        }
    },
    serialNO(index){
      return index+1;
    },
    "showDiscom": function() {
        if (Template.instance().radioValue.get() == "discom") {
            return true;
        } else {
            return false;
        }
    },
    "showSpd": function() {
        if (Template.instance().radioValue.get() == "spd") {
            return true;
        } else {
            return false;
        }
    },
    "viewFormSpd": function() {
        return Template.instance().formValueSpd.get();
    },
    "viewFormDiscom": function() {
        if (Template.instance().formValueDiscom.get()) {
            return Template.instance().formValueDiscom.get();
        }
    },
    "readonlyReturn": function() {
        if (Template.instance().readonly.get() == true) {
            return "readonly";
        } else {
            return "na";
        }
    },

    "disabledReturn": function() {
        if (Template.instance().readonly.get() == true) {
            return "disabled";
        } else {
            return "na";
        }
    },
    "updateButton": function() {
        if (Template.instance().readonly.get() == false) {
            return true;
        } else {
            return false;
        }
    },
    isSelected(dbValue, match) {
        if (dbValue == match) {
            return "Selected";
        }
    },
    "updateButtonHideCloseBtn": function() {
        if (Template.instance().readonly.get() == false) {
            return false;
        } else {
            return true;
        }
    },
    "returnSchemes": function() {
      var data = Schemes.find().fetch();
      return data;
    },
});

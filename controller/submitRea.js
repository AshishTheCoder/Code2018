import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.submitRea.onCreated(function abcd() {
  this.oldReaValue = new ReactiveVar;
    this.getSelectAttr = new ReactiveVar;
});

Template.submitRea.rendered = function() {
  SessionStore.set("isLoading",false);
  $("#saveReaMonthly").validate({
      rules: {
          month: {
              required: true
          },
          year: {
              required: true
          },
          discom_state: {
              required: true
          },
          spd_state: {
              required: true
          },
          rea: {
              required: true,
              number:true
          }
      },
      messages: {
          month: {
              required: 'Please select month'
          },
          year: {
              required: 'Please select year'
          },
          discom_state: {
              required: 'Please select Discom State'
          },
          spd_state: {
              required: 'Please select Spd State'
          },
          rea: {
              required: 'Please enter rea',
              number:'Please enter valid Rea'
          }
      }
  });
};
Template.submitRea.events({
  "change #getStateAttr":function (e) {
    if ($(e.currentTarget).val()) {
      Template.instance().getSelectAttr.set($("#getStateAttr").find(':selected').attr("shortForm"));
    }
  },
  "submit form#saveReaMonthly": function(e,instance) {
    instance.oldReaValue.set(false);
    e.preventDefault();
    var saveRea = '{';
    $("input.saveRea,select.saveRea").each(function(value, element) {
        saveRea += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
    });
    saveRea = $.parseJSON(saveRea.replace(/,\s*$/, '') + '}');
    saveRea.shortForm=Template.instance().getSelectAttr.get();
    Meteor.call("saveReaValues",saveRea, function(error, result) {
        if (error) {
          swal("Server error");
        } else {
            if (result.status) {
              swal(result.message);
            }
        }
    })
  },
  "click #previousData":function (e,instance) {
    e.preventDefault();
    var saveRea = '{';
    $("input.saveRea,select.saveRea").each(function(value, element) {
        saveRea += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
    });
    saveRea = $.parseJSON(saveRea.replace(/,\s*$/, '') + '}');
    Meteor.call("checkReaValue",saveRea, function(error, result) {
        if (error) {
          swal("Server error");
        } else {
            if (result.status) {
              instance.oldReaValue.set(result.data);
              swal(result.message);
            }else {
              swal(result.message);
            }
        }
    })
  }
});

Template.submitRea.helpers({
  yearHelper(){
    return dynamicYear();
  },
  oldValue(){
    if (Template.instance().oldReaValue.get()) {
      return Template.instance().oldReaValue.get();
    }
  }
})

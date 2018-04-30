import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.change_credential.onCreated(function abcd() {
    this.formOldValue = new ReactiveVar;
    this.change_credential_jsondata = new ReactiveVar([]);
});


Template.change_credential.rendered = function() {
  SessionStore.set("isLoading",false);
    $("#changeCredential").validate({
        rules: {
            field_to_change: {
                required: true
            },
            old_data: {
                required: false
            },
            new_data: {
                required: true
            }
        },
        messages: {
            field_to_change: 'Please select field',
            new_data: 'Please enter new data'
        }
    });
};

Template.change_credential.events({
    "change #selectOption": function(e) {
        var value = $(e.currentTarget).val();
        var instance = Template.instance();
        Meteor.call("callOptionValues", value, function(error, result) {
            if (error) {} else {
                // swal(result.message);
                if (result.status) {
                    var json = result.data;
                    instance.formOldValue.set(json);
                    $('#inputNewData').val('');
                } else {}
            }
        })
    },
    "submit form#changeCredential": function(e) {
        e.preventDefault();
        var instance = Template.instance();
        var changeCedentialDetails = '{';
        $("input.changeCedentialDetails,select.changeCedentialDetails").each(function(value, element) {
            changeCedentialDetails += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        changeCedentialDetails = $.parseJSON(changeCedentialDetails.replace(/,\s*$/, '') + '}');

        var hel = $("#selectOption").find(':selected').attr("data");
        changeCedentialDetails.data = hel;

        var mainArray = instance.change_credential_jsondata.get();
        mainArray.push(changeCedentialDetails);
        instance.change_credential_jsondata.set(mainArray);
        // console.log(instance.change_credential_jsondata.get());
    },
    "click #submit_request": function(e) {
      $('#submitDayForm').hide();
      var instance = Template.instance();
      if(instance.change_credential_jsondata.get().length>0){
        swal({
                title: "Are you sure?",
                text: "You want to submit change request!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, i want!",
                closeOnConfirm: false
            },
            function(isConfirm) {
              if (isConfirm) {
                swal("Submitted!", "Your change request has been submitted.", "success");
                Meteor.call("submitRequest", instance.change_credential_jsondata.get(), function(error, result) {
                    if (error) {
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                          $('#submit_request').show();
                          instance.change_credential_jsondata.set('')
                        } else {
                          swal("Oops...",result.message, "error");
                        }
                    }
                })
              }else {
                $('#submit_request').show();
              }
            });
      }else {
        swal("Cannot submit empty request");
      }
    }
});

Template.change_credential.helpers({
    "oldValue": function() {
        return Template.instance().formOldValue.get();
    },
    AllDetails: function() {
        return Template.instance().change_credential_jsondata.get()
    },
    "returnHelper": function() {
      var userData=ChangeCredential.find({clientId:Meteor.userId()}).fetch();
      if(userData.length>0){
        return true;
      }else {
        return false;
      }
    },
    "buttonDisabled":function () {
      var userData=ChangeCredential.find({clientId:Meteor.userId(),status:'Pending'}).fetch();
      if(userData.length>0){
        return "disabled";
      }else {
        return "hello";
      }
    },
    "fieldName": function() {
        var fields = [{
            key: "Name of SPD ",
            value: "name_of_spd"
        }, {
            key: "Project ID",
            value: "project_id"
        }, {
            key: "Project Capicity",
            value: "project_capicity"
        }, {
            key: "Project location",
            value: "project_location"
        }, {
            key: "Connected Substation Details",
            value: "connected_substation_details"
        }, {
            key: "Injection Voltage",
            value: "injection_voltage"
        }, {
            key: "Point of Supply",
            value: "point_of_supply"
        }, {
            key: "Name of Coordinator for Energy Schedules",
            value: "name_of_coordinator_for_energy_schedules"
        }, {
            key: "Contact Details(Mobile No. & Email ID)",
            value: "contact_details"
        }, {
            key: "PAN Number",
            value: "pan_number"
        }, {
            key: "TAN Number",
            value: "tan_number"
        }, {
            key: "Bank Details",
            value: "bank_details"
        }, {
            key: "Main Meter Number",
            value: "main_meter_number"
        }, {
            key: "Check Meter Number",
            value: "check_meter_number"
        }, {
            key: "Max CUF as per PPA(Capacity Utilization Factor)",
            value: "max_cuf_as_per_ppa"
        }, {
            key: "SPD's Min Energy as per PPA(kWh)",
            value: "spd_min_energy_as_per_ppa"
        }, {
            key: "SPD's Max Energy as per PPA(kWh)",
            value: "spd_max_energy_as_per_ppa"
        },{
          key: "Rate per Unit",
          value: "rate_per_unit"
        }];
        return fields;
    }
});

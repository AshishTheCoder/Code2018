Template.secilRegistrationForm.rendered = function() {
    SessionStore.set("flagCheck", false);
    $("#secilRegForm").validate({
        rules: {
            name_of_spd: {
                required: true,
                accept: "[a-zA-Z]+"
            },
            project_id: {
                required: true
            },
            project_capicity: {
                required: true,
                number: true
            },
            project_location: {
                required: true
            },
            connected_substation_details: {
                required: true
            },
            injection_voltage: {
                required: true
            },
            point_of_supply: {
                required: true
            },
            name_of_coordinator_for_energy_schedules: {
                required: true
            },
            contact_details: {
                required: true
            },
            pan_number: {
                required: true
            },
            tan_number: {
                required: true
            },
            bank_details: {
                required: true
            },
            main_meter_number: {
                required: true
            },
            check_meter_number: {
                required: true
            },
            max_cuf_as_per_ppa: {
                required: true,
                number: true
            },
            spd_min_energy_as_per_ppa: {
                required: true,
                number: true
            },
            spd_max_energy_as_per_ppa: {
                required: true,
                number: true
            },
            transaction_type: {
                required: true
            },
            spd_state: {
                required: true
            },
            rate_per_unit: {
                required: true,
                number: true
            },
            dcr_nonDcr: {
                required: true
            }
        },
        messages: {
            name_of_spd: {
                required: 'Please enter name of spd',
                accept: 'Please enter valid name'
            },
            project_id: {
                required: 'Please enter project id'
            },
            project_capicity: {
                required: 'Please enter project capacity',
                number: 'Please enter valid project capacity'
            },
            project_location: {
                required: 'Please enter project location'
            },
            connected_substation_details: {
                required: 'Please enter substation details'
            },
            injection_voltage: {
                required: 'Please enter injection voltage'
            },
            point_of_supply: {
                required: 'Please enter point of supply'
            },
            name_of_coordinator_for_energy_schedules: {
                required: 'Please enter coordinator name'
            },
            contact_details: {
                required: 'Please enter contact details'
            },
            pan_number: {
                required: 'Please enter pan number'
            },
            tan_number: {
                required: 'Please enter tan number'
            },
            bank_details: {
                required: 'Please enter bank details'
            },
            main_meter_number: {
                required: 'Please enter main meter number'
            },
            check_meter_number: {
                required: 'Please enter check meter number'
            },
            max_cuf_as_per_ppa: {
                required: 'Please enter Max CUF',
                number: 'Please enter valid Max CUF'
            },
            spd_min_energy_as_per_ppa: {
                required: 'Please enter SPD min energy per ppa',
                number: 'Please enter valid SPD min energy per ppa'
            },
            spd_max_energy_as_per_ppa: {
                required: 'Please enter SPD max energy per ppa',
                number: 'Please enter valid SPD max energy per ppa'
            },
            transaction_type: {
                required: 'Please select transaction type'
            },
            spd_state: {
                required: 'Please select state'
            },
            rate_per_unit: {
                required: 'Please enter rate per unit',
                number: 'Please enter valid rate per unit'
            },
            dcr_nonDcr: {
                required: 'Please select DCR or NON-DCR'
            }
        }

    });
};
jQuery.validator.addMethod("accept", function(value, element, param) {
    return value.match(new RegExp("." + param + "$"));
});

Template.secilRegistrationForm.events({
    "submit form#secilRegForm": function(e) {
        e.preventDefault();
        $('#secilRegForm').hide();
        var secilRegistrationDetails = '{';
        $("input.secilRegistrationDetails,select.secilRegistrationDetails").each(function(value, element) {
            secilRegistrationDetails += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        secilRegistrationDetails = $.parseJSON(secilRegistrationDetails.replace(/,\s*$/, '') + '}');
        swal({
                title: "Are you sure?",
                text: "You want to submit form!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, submit it!",
                closeOnConfirm: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    Meteor.call("secilRegistrationFormDetails", secilRegistrationDetails, function(error, result) {
                        if (error) {
                            swal("Oops...", "Please try again", "error");
                            $('#secilRegForm').show();
                        } else {
                            if (result.status) {
                              swal("Nice!",'Form successfully submitted!', "success");
                              $('#secilRegForm').show();
                            }else {
                              swal("Oops..", result.message, "error");
                              $('#secilRegForm').show();
                            }
                        }
                    });
                } else {
                    $('#secilRegForm').show();
                }
            });
    }
});

Template.secilRegistrationForm.helpers({
    "alreadyRegistered": function() {
        if (Meteor.userId() != null) {
            var flag = Meteor.user().profile.registration_form;
            if (flag) {
                SessionStore.set("flagCheck", false);
            } else {
                SessionStore.set("flagCheck", true);
            }
            return SessionStore.get("flagCheck");
        } else {}
    }
});

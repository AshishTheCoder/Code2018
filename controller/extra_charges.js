import {
    ReactiveVar
} from 'meteor/reactive-var';
Template.extra_charges.onCreated(function staticdata() {
    this.staticmodal = new ReactiveVar('');

    this.radiobtnvalue = new ReactiveVar('');
});
Template.extra_charges.rendered = function() {
  SessionStore.set("isLoading",false);
    $("#extrachargesform").validate({
        rules: {
            fromdate: {
                required: true
            },
            todate: {
                required: true
            },
            inlineRadioOptions: {
                required: true
            },
            select_spd: {
                required: true
            },
            select_discom: {
                required: true
            },

            credit_debit: {
                required: true,
                number: true
            },
            sldc_opeartion_charges: {
                required: true,
                number: true
            },
            transmission_charges: {
                required: true,
                number: true
            },
            ui_charges: {
                required: true,
                number: true
            },
            rldc_charges: {
                required: true,
                number: true
            }
        },
        messages: {
            fromdate: {
                required: 'Please enter from date'
            },
            todate: {
                required: 'Please enter to date'
            },
            inlineRadioOptions: {
                required: 'Please select spd/discom'
            },
            select_spd: {
                required: 'Please choose spd'
            },
            select_discom: {
                required: 'Please choose discom'
            },

            credit_debit: {
                required: 'Please enter credit/debit',
                number: 'Please enter valid credit/debit'
            },
            sldc_opeartion_charges: {
                required: 'Please enter sldc operation charges',
                number: 'Please enter valid operation charges'
            },
            transmission_charges: {
                required: 'Please enter transmission charges',
                number: 'Please enter valid transmission charges'
            },
            ui_charges: {
                required: 'Please enter ui charges',
                number: 'Please enter valid ui charges'
            },
            rldc_charges: {
                required: 'Please enter rldc operation charges',
                number: 'Please enter valid operation charges'
            }
        }
    });
};
Template.extra_charges.events({
    "submit form#extrachargesform": function(e) {
        e.preventDefault();

        var extraChargesSubmitDetails = '{';
        $("input.extraCharges, select.extraCharges").each(function(value, element) {
            if ($(this).attr("type") == 'radio') {
                var value = $('input[name=' + $(this).attr("name") + ']:checked').val();
                extraChargesSubmitDetails += '"' + $(this).attr("name") + '":"' + value + '",';
            } else {
                extraChargesSubmitDetails += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
            }
        });
        extraChargesSubmitDetails = $.parseJSON(extraChargesSubmitDetails.replace(/,\s*$/, '') + '}');
        Meteor.call("extraChargesSubmitDetails", extraChargesSubmitDetails, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                swal(result.message);
            }
        });
    },
    "focus .defaultdate": function() {
       $('.defaultdate').datepicker({
           format: 'dd/mm/yyyy',
           endDate: '0d',
           autoclose: true
       });
   },
    "change #inlineRadio": function(e, t) {
        var discombutton = $(e.currentTarget).val();
        Template.instance().radiobtnvalue.set(discombutton);
    },
    "click #priviewbtn": function(e) {
        e.preventDefault();
        var extraChargesSubmitDetails = '{';
        $("input.extraCharges,select.extraCharges").each(function(value, element) {
            if ($(this).attr("type") == 'radio') {
                var value = $('input[name=' + $(this).attr("name") + ']:checked').val();
                extraChargesSubmitDetails += '"' + $(this).attr("name") + '":"' + value + '",';
            } else {
                extraChargesSubmitDetails += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
            }
        });
        extraChargesSubmitDetails = $.parseJSON(extraChargesSubmitDetails.replace(/,\s*$/, '') + '}');
          var prvwdata = Template.instance();
          prvwdata.staticmodal.set(extraChargesSubmitDetails);
    }
});

Template.extra_charges.helpers({
    'spdrediobuttonischecked': function() {
        if (Template.instance().radiobtnvalue.get() === "SPD") {
            return true;
        } else {
            return false;
        }
    },

    'discomrediobuttonischecked': function() {
        if (Template.instance().radiobtnvalue.get() === "DISCOM") {
            return true;
        } else {
            return false;
        }
    },
    'staticdatainmodal': function() {
        if (Template.instance().staticmodal.get() != '') {
            return true;
        } else {
            return false;
        }
    },
    "returnModalData": function() {
        if (Template.instance().staticmodal.get()) {
            return Template.instance().staticmodal.get();
        } else {
            return false;
        }
    }
});

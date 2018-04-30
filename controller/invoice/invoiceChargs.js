import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.invoiceChargesDetails.onCreated(function abcd() {
    this.SelectedInvoice = new ReactiveVar;
    this.discomStates = new ReactiveVar;
    this.invoiceData = new ReactiveVar;
});
Template.invoiceChargesDetails.rendered = function() {
    $("#RateChargesForm").validate({
        rules: {
            discom_state: {
                required: true
            },
            new_Rate_Charges: {
                required: true,
                number: true
            },
            select_invoice: {
                required: true
            }
        },
        messages: {
            spd_state: 'Please select state',
            select_invoice: 'Please select invoice type',
            new_Rate_Charges: {
                required: 'Please enter charges',
                number: 'Please enter valid number'
            }
        }
    });
    var instance = Template.instance();
    Meteor.call("callDiscomStates", function(error, result) {
        if (error) {
            swal("Please try again!");
        } else {
            if (result.status) {
                instance.discomStates.set(result.data);
            }
        }
    });
};

Template.invoiceChargesDetails.events({
    "change #selectInvoice": function(e, instance) {
      $('#ddlFinancialYearInvoice').val('');
      $('#selectState').val('');
        instance.SelectedInvoice.set($(e.currentTarget).val());
        instance.invoiceData.set('');
    },
    "change #ddlFinancialYearInvoice" (e, instance){
      $('#selectState').val('');
      instance.invoiceData.set('');
    },
    "change #selectState": function(e,instance) {
      var invoiceTypeVar = $('#selectInvoice').val();
      var financialYearVar = $('#ddlFinancialYearInvoice').val();
      var selectedStateVar = $(e.currentTarget).val();
        if (invoiceTypeVar != '' && financialYearVar != '' && selectedStateVar != '') {
            Meteor.call("callRateValues", selectedStateVar, invoiceTypeVar,financialYearVar, function(error, result) {
                if (error) {
                    swal("Please try again!");
                } else {
                    if (result.status) {
                        instance.invoiceData.set(result.data);
                    }
                }
            })
        }else {
          swal('All fields are required!');
        }
    },
    "submit form#RateChargesForm": function(e, instance) {
        e.preventDefault();
        var state = $('#selectState').val();
        var financialYearVar = $('#ddlFinancialYearInvoice').val();
        var newValue = $('.newCharges').val();
        var oldValue = $('.oldCharges').val();
        var invoiceType = $('#selectInvoice').val();
        swal({
            title: "Are you sure?",
            text: "You want to update!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, update it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            Meteor.call("saveRateValues", state, invoiceType, oldValue, newValue,financialYearVar, function(error, result) {
                if (error) {
                    swal("Please try again!");
                } else {
                    if (result.status) {
                        $('.newCharges').val('');
                        $('#selectState').val('');
                        swal(result.message);
                    }
                }
            })
        });
    },

});

Template.invoiceChargesDetails.helpers({
    financialYearHelper(){
      return dynamicFinancialYear();
    },
    "showOldValue": function() {
        return Template.instance().invoiceData.get();
    },
    "showDiscomStates": function() {
        return Template.instance().discomStates.get();
    },
    transmissionHelper: function() {
        var instance = Template.instance();
        if (instance.SelectedInvoice.get() == 'Transmission_Charges' || instance.SelectedInvoice.get() == 'SLDC_Charges') {
            return true;
        } else {
            return false;
        }
    },
    helperUsedForShowTransmissionDDL: function() {
        var instance = Template.instance();
        if (instance.SelectedInvoice.get() == 'Transmission_Charges') {
            return true;
        } else {
            return false;
        }
    }
});

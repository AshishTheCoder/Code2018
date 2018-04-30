import {
    ReactiveVar
} from 'meteor/reactive-var';
Template.actual_Generation.onCreated(function ss() {
    this.checkActualGenData = new ReactiveVar();
});
Template.actual_Generation.rendered = function() {
    SessionStore.set("isLoading", false);
    $('#dateToday').datepicker({
        format: 'dd-mm-yyyy',
        endDate: '0d',
        autoclose: true
    })
};
Template.actual_Generation.events({
    "click #submitJmr": function(e) {
      var actualGenerationVar = $('#generatedSchedule').val();
      var capacity = Meteor.user().profile.registration_form.project_capicity;
      var hours = 16;
      var checkInLUs = Number(Number(capacity) * hours)/100;
      if (Number(actualGenerationVar) > Number(checkInLUs)) {
        swal("Oops..","Please enter actual generated schedule in LUs!", "error");
        throw new Error("Please enter actual generation in LUs!");
      }
        $('#submitJmr').hide();
        var instance = Template.instance();
        e.preventDefault();
        if ($('#dateToday').val()) {
            $('.validate').each(function() {
                var validate = $(this).val();
                if ($(this).val() == '') {
                    swal("All fields are required");
                    $('#submitJmr').show();
                    throw new Error("All fields are required!");
                } else {}
            })
            $('.number').each(function() {
                var checkNumber = $(this).val();
                if (checkNumber.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                    swal("Enter only digits");
                    $('#submitJmr').show();
                    throw new Error("Enter only digits!");
                }
            })
            var json = {
                date: $('#dateToday').val(),
                generatedSchedule: $('#generatedSchedule').val(),
                clientId: Meteor.userId(),
                timestamp: new Date()
            };
            var selectedDate = $('#dateToday').val();
            swal({
                    title: "Are you sure?",
                    text: "You want to submit Actual Generation!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#55dd6b",
                    confirmButtonText: "Yes, submit it!",
                    closeOnConfirm: false
                },
                function(isConfirm) {
                    if (isConfirm) {
                        Meteor.call("saveActualGeneration", json, selectedDate, function(error, result) {
                            if (error) {
                                swal("Oops...", "Please try again", "error");
                                $('#submitJmr').show();
                            } else {
                                if (result.status) {
                                    swal("Nice!", "Actual Generation successfully submitted for " + selectedDate, "success");
                                    $('.empty').each(function() {
                                        $(this).val('');
                                    })
                                    $('#submitJmr').show();
                                }else {
                                  swal("Oops..",result.message, "error");
                                  $('#submitJmr').show();
                                }
                            }
                        })
                    } else {
                        $('#submitJmr').show();
                    }
                });
        } else {
            swal("Oops...", "Please select date", "error");
            $('#submitJmr').show();
        }
    },
})
Template.actual_Generation.helpers({

})

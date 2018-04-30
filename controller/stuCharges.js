import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.stuChargesDetails.onCreated(function abcd() {
    this.oldValue = new ReactiveVar;
});
Template.stuChargesDetails.rendered = function() {
    SessionStore.set("isLoading", false);
    $("#STUChargesForm").validate({
        rules: {
            from_date: {
                required: true
            },
            to_date: {
                required: true
            },
            spd_state: {
                required: true
            },
            new_STU_Charges: {
                required: true,
                number: true
            },
            selectMonth: {
                required: true
            },
            selectYear: {
                required: true
            },
        },
        messages: {
            from_date: {
              required: 'From date is required',
            },
            to_date: {
              required: 'To date is required',
            },
            spd_state: 'Please select state',
            new_STU_Charges: {
                required: 'Please enter charges',
                number: 'Please enter valid number'
            },
            selectMonth: 'Please select monthReturn',
            selectYear: 'Please select year',
        }
    });
};

Template.stuChargesDetails.events({
    "focus .txtDate": function() {
        $('.txtDate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', autoclose: true});
    },
    "change #selectMonth": function(e, instance) {
        $('#selectYear').val('');
        $('#selectState').val('');
        instance.oldValue.set();
    },
    "change #selectYear": function(e, instance) {
        $('#selectState').val('');
        instance.oldValue.set();
    },
    "change #selectState": function(e, instance) {
      var month = $('#selectMonth').val();
      var year = $('#selectYear').val();
      var state = $(e.currentTarget).val()
        if (state != '' && year != '' && month != '') {
          SessionStore.set("isLoading", true);
            Meteor.call("callStuValues", month, year, state, function(error, result) {
                if (error) {
                  SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                  SessionStore.set("isLoading", false);
                    if (result.status) {
                        if (result.data) {
                            var dataValue = result.data;
                            instance.oldValue.set(dataValue);
                        } else {
                            instance.oldValue.set("No STU Losses");
                        }
                    }
                }
            });
        }else {
          instance.oldValue.set();
        }
    },
    "submit form#STUChargesForm": function(e, instance) {
        e.preventDefault();
        var stateValue = $('#selectState').val();
        var newValue = $('.newCharges').val();
        var oldValue = $('.oldCharges').val();
        var month = $('#selectMonth').val();
        var year = $('#selectYear').val();

        var fromDate = $('#txtDateFrom').val();
        var toDate = $('#txtDateTo').val();

        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var currentMonthVar = moment(currentDate).format('MM');
        var currentYear = moment(currentDate).format('YYYY');
        if(Number(currentMonthVar) < 12){
          var nextMonthVar = Number(currentMonthVar) + 1;
          var nextYearVar = Number(currentYear);
        }else if(Number(currentMonthVar) == 12){
          var nextMonthVar = 1;
          var nextYearVar = Number(currentYear) + 1;
        }

        if(Number(month) == Number(nextMonthVar) && Number(year) == Number(nextYearVar)){
          swal({
                  title: "Are you sure?",
                  text: "You want to submit STU loss!",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#55dd6b",
                  confirmButtonText: "Yes, i want!",
                  closeOnConfirm: true
              },
              function(isConfirm) {
                  if (isConfirm) {
                      SessionStore.set("isLoading", true);
                      Meteor.call("saveStuValues", stateValue, oldValue, newValue, month, year,fromDate,toDate, function(error, result) {
                          if (error) {
                              SessionStore.set("isLoading", false);
                              swal("Oops...", "Please try again!", "error");
                          } else {
                              if (result.status) {
                                  swal("Submitted!", "STU loss is successfully submitted!", "success");
                                  SessionStore.set("isLoading", false);
                                  $('.newCharges').val('');
                                  $('#selectState').val('');
                                  instance.oldValue.set();
                              } else {
                                  swal("Oops...", "You can submit STU loss for next month only!", "error");
                                  $('.newCharges').val('');
                                  $('#selectState').val('');
                                  SessionStore.set("isLoading", false);
                              }
                          }
                      });
                  } else {
                      SessionStore.set("isLoading", false);
                  }
              });
         }
         else{
           swal("Oops...", "You can submit STU loss for next month only!", "error");
        }
    }
});

Template.stuChargesDetails.helpers({
    monthShow() {
        return monthReturn();
    },
    "showOldValue": function() {
        if (Template.instance().oldValue.get()) {
            return Template.instance().oldValue.get();
        } else {
            return "Select SPD State";
        }
    }
});

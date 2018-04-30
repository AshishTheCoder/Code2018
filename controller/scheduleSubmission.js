import {ReactiveVar} from 'meteor/reactive-var';

Template.scheduleSubmission.onCreated(function abcd() {
    this.sameasDateVar = new ReactiveVar();
    this.sameasDataTransferVar = new ReactiveVar();
    this.userProfileVar = new ReactiveVar('');
    this.lossAppliedOnSPD = new ReactiveVar('');
});

Template.scheduleSubmission.rendered = function() {
    SessionStore.set("isLoading", false);
    SessionStore.set("scheduleSubmission_requiredDates", false);
    SessionStore.set("scheduleSubmission_showDates", false);
    SessionStore.set("scheduleSubmission_madeSlot", false);
    SessionStore.set("scheduleSubmission_AvailabilityForMP");
    SessionStore.set("scheduleSubmission_ForecastForMP");
    SessionStore.set("scheduleSubmission_schedule", false);
    SessionStore.set('scheduleSubmission_add', false);
    SessionStore.set("scheduleSubmission_bidWithLoss", false);
};
Template.scheduleSubmission.events({
    "focus #fromDate": function() {
        $('#fromDate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
    },
    "focus #toDate": function() {
        $('#toDate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
    },
    "focus #txtDate": function() {
        $('#txtDate').datepicker({
            format: 'dd-mm-yyyy',
            // startDate: '0d',
            autoclose: true
        });
    },
    "input .availability": function() {
        var dataArr = $('.availability').val();
        var availabilityArr = dataArr.split(' ');
        var newArr = [];
        if (SessionStore.get("scheduleSubmission_ForecastForMP")) {
          let forcastArr = SessionStore.get("scheduleSubmission_ForecastForMP");
          if (availabilityArr.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var s = 0;
              for (var i = 0; i <= timeSlot.length - 2; i++) {
                  var no = 1;
                  var slot = timeSlot[i + no].time_slot;
                  if (timeSlot.length - 1 == i) {
                      slot = "00:00";
                  }
                  newArr.push({
                      daySchedule: SessionStore.get("scheduleSubmission_dateSelected"),
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      availability : availabilityArr[s],
                      bidMwh : forcastArr[s].bidMwh
                  });
                  s++;
              };
              SessionStore.set("scheduleSubmission_madeSlot", newArr);
          }
        }else {
          if (availabilityArr.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var s = 0;
              for (var i = 0; i <= timeSlot.length - 2; i++) {
                  var no = 1;
                  var slot = timeSlot[i + no].time_slot;
                  if (timeSlot.length - 1 == i) {
                      slot = "00:00";
                  }
                  newArr.push({
                      daySchedule: SessionStore.get("scheduleSubmission_dateSelected"),
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      availability : availabilityArr[s],
                  });
                  s++;
              };
              SessionStore.set("scheduleSubmission_AvailabilityForMP", newArr);
              SessionStore.set("scheduleSubmission_madeSlot", newArr);
          }
        }
    },
    "input .slots": function() {
        var dataArr = $('.slots').val();
        var ddd = dataArr.split(' ');
        var newArr = [];
        if (SessionStore.get("scheduleSubmission_AvailabilityForMP")) {
          let availabilityArr = SessionStore.get("scheduleSubmission_AvailabilityForMP");
          if (ddd.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var s = 0;
              for (var i = 0; i <= timeSlot.length - 2; i++) {
                  var no = 1;
                  var slot = timeSlot[i + no].time_slot;
                  if (timeSlot.length - 1 == i) {
                      slot = "00:00";
                  }
                  newArr.push({
                      daySchedule: SessionStore.get("scheduleSubmission_dateSelected"),
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      availability: availabilityArr[s].availability,
                      bidMwh: ddd[s]
                  });
                  s++;
              };
              SessionStore.set("scheduleSubmission_madeSlot", newArr);
              SessionStore.set("scheduleSubmission_ForecastForMP", newArr);
          }
        }else {
          if (ddd.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var s = 0;
              for (var i = 0; i <= timeSlot.length - 2; i++) {
                  var no = 1;
                  var slot = timeSlot[i + no].time_slot;
                  if (timeSlot.length - 1 == i) {
                      slot = "00:00";
                  }
                  newArr.push({
                      daySchedule: SessionStore.get("scheduleSubmission_dateSelected"),
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      bidMwh: ddd[s]
                  });
                  s++;
              };
              SessionStore.set("scheduleSubmission_madeSlot", newArr);
              SessionStore.set("scheduleSubmission_ForecastForMP", newArr);

          }
        }
    },
    "change #txtDate": function() {
        var date = $('#txtDate').val();
        if ($('#txtDate').val()) {
            Meteor.call("sameAsSubmitSchedule", date, function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        var newArr = [];
                        var s = 0;
                        result.data.forEach(function(item) {
                            s++;
                            newArr.push({sno:s, daySchedule: SessionStore.get("scheduleSubmission_dateSelected"), mySlot: item.time_slot, bidMwh: item.bidMwh});
                        });
                        SessionStore.set("scheduleSubmission_madeSlot", newArr);
                        SessionStore.set("scheduleSubmission_ForecastForMP", newArr);
                    } else {
                        swal(result.message);
                    }
                }
            });
        }
    },
    'click #idSameAs': function(e, instance) {
        var sameasVar = $('#idSameAs:checked').val();
        instance.sameasDateVar.set(sameasVar);
    },
    "click #sub": function() {
        SessionStore.set("scheduleSubmission_AvailabilityForMP");
        SessionStore.set("scheduleSubmission_ForecastForMP");
        var toDateGet = $('#toDate').val();
        var fromDateGet = $('#fromDate').val();
        if (toDateGet != '' && fromDateGet != '') {
            fromDate = fromDateGet.split('-');
            toDate = toDateGet.split('-');
            fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
            toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
            date1_unixtime = parseInt(fromDate.getTime() / 1000);
            date2_unixtime = parseInt(toDate.getTime() / 1000);
            var timeDifference = date2_unixtime - date1_unixtime;
            var timeDifferenceInHours = timeDifference / 60 / 60;
            var timeDifferenceInDays = timeDifferenceInHours / 24;
            var q = 1;
            var returnArray = [];
            //get current time for Schedule Submission
            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            currentDate.setTime(currentDate.getTime());
            var hrs = currentDate.getHours();
            var min = currentDate.getMinutes();
            var time = (hrs + ":" + min);
            var n = time;
            var n1 = n.split('_');
            var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
            // if (time > '12:00') {
            //     if (fromDateGet > todayDate) {
            //         fromDate.setDate(fromDate.getDate());
            //     } else {
            //         fromDate.setDate(fromDate.getDate() + 1);
            //     }
            //     for (var i = 0; i <= timeDifferenceInDays - 1; i++) {
            //         fromDate.setDate(fromDate.getDate() + 1);
            //         returnArray.push({
            //             sl: q,
            //             return: moment(fromDate).format('DD-MM-YYYY')
            //         });
            //         q++;
            //     }
            // } else {
            //     for (var i = 0; i <= timeDifferenceInDays; i++) {
            //         fromDate.setDate(fromDate.getDate() + 1);
            //         returnArray.push({
            //             sl: q,
            //             return: moment(fromDate).format('DD-MM-YYYY')
            //         });
            //         q++;
            //     }
            // }

            // remove this loop after uncomment above line
            for (var i = 0; i <= timeDifferenceInDays; i++) {
                fromDate.setDate(fromDate.getDate() + 1);
                returnArray.push({sl: q, return: moment(fromDate).format('DD-MM-YYYY')});
                q++;
            }

            SessionStore.set("scheduleSubmission_requiredDates", returnArray);
            SessionStore.set("scheduleSubmission_schedule", false);
            SessionStore.set("scheduleSubmission_showDates", true);
            SessionStore.set("scheduleSubmission_dateSelected", false);
        } else {
            swal('All fields are required!');
            SessionStore.set("scheduleSubmission_showDates", false);
            SessionStore.set("scheduleSubmission_schedule", false);
        }
    },
    "click #submitSchedule": function(e, instance) {
        SessionStore.set("scheduleSubmission_AvailabilityForMP");
        SessionStore.set("scheduleSubmission_ForecastForMP");
        var selectedDateForScheduleSubmission = $(e.currentTarget).attr("thisDate");
        SessionStore.set("scheduleSubmission_dateSelected", selectedDateForScheduleSubmission);
        var slotArray = mySlotFunction();
        var newArr = [];
        var s = 1;
        for (var i = 0; i <= slotArray.length - 2; i++) {
            var no = 1;
            var slot = slotArray[i + no];
            if (slotArray.length - 1 == i) {
                slot = "00:00";
            }
            newArr.push({
                sno: s,
                daySchedule: SessionStore.get("scheduleSubmission_dateSelected"),
                mySlot: slotArray[i] + '-' + slot
            });
            s++;
        }
        SessionStore.set("scheduleSubmission_schedule", false);
        SessionStore.set("scheduleSubmission_madeSlot", newArr);
        //getting STU Lossess for SPD
        SessionStore.set("isLoading", true);
        Meteor.call("gettingLossForSPD", selectedDateForScheduleSubmission, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try again !");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.lossAppliedOnSPD.set(result.data);
                }
            }
        });
    },
    "click #viewSchedule": function(e, instance) {
      SessionStore.set("scheduleSubmission_AvailabilityForMP");
      SessionStore.set("scheduleSubmission_ForecastForMP");
        if ($(e.currentTarget).attr("thisDate")) {
            SessionStore.set("isLoading", true);
            Meteor.call('callViewSchedule', $(e.currentTarget).attr("thisDate"), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        console.log(result.data);
                        SessionStore.set("scheduleSubmission_schedule", result.data.jsonData);
                        SessionStore.set("scheduleSubmission_madeSlot", false);
                        SessionStore.set("scheduleSubmission_dateSelected", false);
                        instance.userProfileVar.set(result.data.userData);
                    } else {
                        SessionStore.set("isLoading", false);
                        swal(result.message);
                    }
                }
            })
        }
        // var view = ScheduleSubmission.find({
        //     clientId: Meteor.userId(),
        //     date: $(e.currentTarget).attr("thisDate")
        // }).fetch();
        // if (view.length > 0) {
        //     view[0].json[0].data[0].date = $(e.currentTarget).attr("thisDate");
        //     var jsonData = view[0].json[0].data;
        //     view[0].json[0].data[0].totalMwh = view[0].json[0].totalMwh;
        //     SessionStore.set("scheduleSubmission_schedule", jsonData);
        //     SessionStore.set("scheduleSubmission_madeSlot", false);
        //     SessionStore.set("scheduleSubmission_dateSelected", false);
        //     var userData = Meteor.user().profile.registration_form;
        //     instance.userProfileVar.set(userData);
        // } else {}
    },
    "click #submitDayForm": function(e, t) {
        $('#submitDayForm').hide();
        var instance = Template.instance();
        var mainArray = [];
        var totalMwh = 0;
        var mainArrayWithLoss = [];
        var totalMwhWithLoss = 0;
        var stuLossVar = instance.lossAppliedOnSPD.get();
        var lossPercentVar = Number(stuLossVar) / 100;
        if (Meteor.user().profile.registration_form.spd_state == 'MP') {
          let availabilityArr = [];
          $('.availability').each(function() {
            var availability = $(this).val();
            if (availability.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Oops...", "Availability must be a number!", "error");
                $('#submitDayForm').show();
                throw new Error("Use only digits!");
            }
            if (availability != '' || availability != undefined) {
                let availability = availability;
            } else {
                let availability = '0.00';
            }
            availabilityArr.push(availability);
          });

          var i = 0;
          var totalAvaibility = 0;
          $('.slots').each(function() {
              var checkSlots = $(this).val();
              var availability = availabilityArr[i];
              if (checkSlots.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                  swal("Oops...", "Schedule must be a number!", "error");
                  $('#submitDayForm').show();
                  throw new Error("Use only digits!");
              }
              var bid = $(this).val();
              var bidWithLoss = 0;
              if (bid != '') {
                  var bid = $(this).val();
                  var calculation = Number(bid) * Number(lossPercentVar)
                  bidWithLoss = Number(bid) - Number(calculation);
              } else {
                  var bid = '0.00';
                  bidWithLoss = '0.00';
              }
              var spdCapacity = Meteor.user().profile.registration_form.project_capicity;
              if (Number(bid) > Number(spdCapacity)) {
                  swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                  $('#submitDayForm').show();
                  throw new Error("Schedule can't be greater than project capacity!");
              }

              SessionStore.set("scheduleSubmission_add", Number(bid).toFixed(2));
              totalMwh = (Number(totalMwh) + Number(SessionStore.get('scheduleSubmission_add')));
              SessionStore.set('scheduleSubmission_add', totalMwh);
              mainArray.push({time_slot: $(this).attr("attr"),availability:Number(availability).toFixed(2), bidMwh: Number(bid).toFixed(2)});

              SessionStore.set("scheduleSubmission_bidWithLoss", bidWithLoss.toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(SessionStore.get('scheduleSubmission_bidWithLoss')));
              SessionStore.set('scheduleSubmission_bidWithLoss', totalMwhWithLoss);
              mainArrayWithLoss.push({time_slot: $(this).attr("attr"),availability:Number(availability).toFixed(2), bidMwh: bidWithLoss.toFixed(2)});
              totalAvaibility += Number(availability);
              i++;
          });
        }else {
          $('.slots').each(function() {
              var checkSlots = $(this).val();
              if (checkSlots.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                  swal("Oops...", "Enter only digits!", "error");
                  $('#submitDayForm').show();
                  throw new Error("Use only digits!");
              }
              var bid = $(this).val();
              var bidWithLoss = 0;
              if (bid != '') {
                  var bid = $(this).val();
                  var calculation = Number(bid) * Number(lossPercentVar)
                  bidWithLoss = Number(bid) - Number(calculation);
              } else {
                  var bid = '0.00';
                  bidWithLoss = '0.00';
              }
              var spdCapacity = Meteor.user().profile.registration_form.project_capicity;
              if (Number(bid) > Number(spdCapacity)) {
                  swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                  $('#submitDayForm').show();
                  throw new Error("Schedule can't be greater than project capacity!");
              }
              SessionStore.set("scheduleSubmission_add", Number(bid).toFixed(2));
              totalMwh = (Number(totalMwh) + Number(SessionStore.get('scheduleSubmission_add')));
              SessionStore.set('scheduleSubmission_add', totalMwh);
              mainArray.push({time_slot: $(this).attr("attr"), bidMwh: Number(bid).toFixed(2)});

              SessionStore.set("scheduleSubmission_bidWithLoss", bidWithLoss.toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(SessionStore.get('scheduleSubmission_bidWithLoss')));
              SessionStore.set('scheduleSubmission_bidWithLoss', totalMwhWithLoss);
              mainArrayWithLoss.push({time_slot: $(this).attr("attr"), bidMwh: bidWithLoss.toFixed(2)});
          });
        }



        var revision = [];
        var revisionWithLoss = [];
        var totalMWhVar = Number(SessionStore.get('scheduleSubmission_add'));
        var totalMwhDevision = Number(totalMWhVar / 4000).toFixed(7);
        // getting totalMWh with lossess
        var totalMWhVarWithLoss = Number(SessionStore.get('scheduleSubmission_bidWithLoss'));
        var totalMwhDevisionWithLoss = Number(totalMWhVarWithLoss / 4000).toFixed(7);
        //time added in json
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        currentDate.setTime(currentDate.getTime());
        var hrs = currentDate.getHours();
        var min = currentDate.getMinutes();
        var time = (hrs + ":" + min);
        var n = time;
        var n1 = n.split('_');
        var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
        if (Meteor.user().profile.registration_form.spd_state == 'MP') {
          var totalAvaibilityDevision = Number(totalAvaibility / 4000).toFixed(7);
          revision.push({data: mainArray, totalAvaibility:totalAvaibilityDevision, totalMwh: totalMwhDevision, revision_time: time});
          revisionWithLoss.push({data: mainArrayWithLoss, totalAvaibility:totalAvaibilityDevision, totalMwh: totalMwhDevisionWithLoss, revision_time: time});
        }else {
          revision.push({data: mainArray, totalMwh: totalMwhDevision, revision_time: time});
          revisionWithLoss.push({data: mainArrayWithLoss, totalMwh: totalMwhDevisionWithLoss, revision_time: time});
        }
        if (revision[0].data.length < 96) {
            swal("Oops...", "Data not Valid!", "error");
            $('#submitDayForm').show();
        } else {
            swal({
                title: "Are you sure?",
                text: "You want to submit schedule!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, submit it!",
                closeOnConfirm: false
            }, function(isConfirm) {
                if (isConfirm) {
                    Meteor.call("saveScheduleSubmission", SessionStore.get("scheduleSubmission_dateSelected"), revision, revisionWithLoss, stuLossVar, function(error, result) {
                        if (error) {
                            swal("Oops...", "Please try again!", "error");
                            $('#submitDayForm').show();
                        } else {
                            if (result.status) {
                                swal("Submitted!", "Your schedule has been submitted.", "success");
                                $('#submitDayForm').show();
                                SessionStore.set("scheduleSubmission_dateSelected", false);
                            } else {
                                swal("Oops...", result.message, "error");
                                $('#submitDayForm').show();
                            }
                        }
                    });
                } else {
                    $('#submitDayForm').show();
                }
            });
        }
    }
});
Template.scheduleSubmission.helpers({
    "viewDates": function() {
        return SessionStore.get("scheduleSubmission_showDates");
    },
    "dates": function() {
        return SessionStore.get("scheduleSubmission_requiredDates");
    },
    "returnSlot": function() {
        if (SessionStore.get("scheduleSubmission_showDates") != false) {
            return SessionStore.get("scheduleSubmission_madeSlot");
        } else {
            return false;
        }
    },
    "viewSlots": function() {
        if (SessionStore.get("scheduleSubmission_showDates") != false && SessionStore.get("scheduleSubmission_dateSelected") != false) {
            return true;
        } else {
            return false;
        }
    },
    "isSelected": function(match, type) {
        Meteor.subscribe('ScheduleSubmitDetails', match, Meteor.userId());
        var details = ScheduleSubmission.find({'clientId': Meteor.userId(), 'date': match}).fetch();
        if (details.length > 0) {
            if (type == "sub") {
                return 'hidden';
            } else {
                return "no";
            }
        } else {
            if (type == "view") {
                return 'hidden';
            } else {
                return "no";
            }
        }
    },
    "submittedScheduling": function() {
        if (SessionStore.get("scheduleSubmission_showDates") != '' && SessionStore.get("scheduleSubmission_schedule") != false) {
            return true;
        } else {
            return false;
        }
    },
    "viewdata": function() {
        return SessionStore.get("scheduleSubmission_schedule");
    },
    "userProfileData": function() {
        var instance = Template.instance();
        var userData = instance.userProfileVar.get();
        if (userData != '') {
            return userData;
        } else {
            return false;
        }
    },
    serial(index) {
        return index + 1;
    },
    "isSameAsChecked": function() {
        if (Template.instance().sameasDateVar.get() == "sameas") {
            return Template.instance().sameasDateVar.get();
        } else {
            return "disabled";
        }
    },
    isMPStateSPSSelectedForScheduleSubmission(){
      if (loggedInUserState('SPD')) {
        return true;
      }else {
        return false;
      }
    },
});




































// import {ReactiveVar} from 'meteor/reactive-var';
//
// Template.scheduleSubmission.onCreated(function abcd() {
//     this.sameasDateVar = new ReactiveVar();
//     this.sameasDataTransferVar = new ReactiveVar();
//     this.userProfileVar = new ReactiveVar('');
//     this.lossAppliedOnSPD = new ReactiveVar('');
// });
//
// Template.scheduleSubmission.rendered = function() {
//     SessionStore.set("isLoading", false);
//     SessionStore.set("scheduleSubmission_requiredDates", false);
//     SessionStore.set("scheduleSubmission_showDates", false);
//     SessionStore.set("scheduleSubmission_madeSlot", false);
//     SessionStore.set("scheduleSubmission_schedule", false);
//     SessionStore.set('scheduleSubmission_add', false);
//     SessionStore.set("scheduleSubmission_bidWithLoss", false);
// };
// Template.scheduleSubmission.events({
//     "focus #fromDate": function() {
//         $('#fromDate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
//     },
//     "focus #toDate": function() {
//         $('#toDate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
//     },
//     "focus #txtDate": function() {
//         $('#txtDate').datepicker({
//             format: 'dd-mm-yyyy',
//             // startDate: '0d',
//             autoclose: true
//         });
//     },
//     "input .slots": function() {
//         var dataArr = $('.slots').val();
//         var ddd = dataArr.split(' ');
//         var newArr = [];
//         if (ddd.length > 0) {
//             var timeSlot = TimeBlock.find().fetch();
//             var newArr = [];
//             var s = 0;
//             for (var i = 0; i <= timeSlot.length - 2; i++) {
//                 var no = 1;
//                 var slot = timeSlot[i + no].time_slot;
//                 if (timeSlot.length - 1 == i) {
//                     slot = "00:00";
//                 }
//                 newArr.push({
//                     daySchedule: SessionStore.get("scheduleSubmission_dateSelected"),
//                     mySlot: timeSlot[i].time_slot + '-' + slot,
//                     bidMwh: ddd[s]
//                 });
//                 s++;
//             };
//             SessionStore.set("scheduleSubmission_madeSlot", newArr);
//         }
//     },
//     "change #txtDate": function() {
//         var date = $('#txtDate').val();
//         if ($('#txtDate').val()) {
//             Meteor.call("sameAsSubmitSchedule", date, function(error, result) {
//                 if (error) {
//                     swal("Oops...", "Please try again!", "error");
//                 } else {
//                     if (result.status) {
//                         var newArr = [];
//                         var s = 0;
//                         result.data.forEach(function(item) {
//                             s++;
//                             newArr.push({sno: s, daySchedule: SessionStore.get("scheduleSubmission_dateSelected"), mySlot: item.time_slot, bidMwh: item.bidMwh});
//                         });
//                         SessionStore.set("scheduleSubmission_madeSlot", newArr);
//                     } else {
//                         swal(result.message);
//                     }
//                 }
//             });
//         }
//     },
//     'click #idSameAs': function(e, instance) {
//         var sameasVar = $('#idSameAs:checked').val();
//         instance.sameasDateVar.set(sameasVar);
//     },
//     "click #sub": function() {
//         var toDateGet = $('#toDate').val();
//         var fromDateGet = $('#fromDate').val();
//         if (toDateGet != '' && fromDateGet != '') {
//             fromDate = fromDateGet.split('-');
//             toDate = toDateGet.split('-');
//             fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
//             toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
//             date1_unixtime = parseInt(fromDate.getTime() / 1000);
//             date2_unixtime = parseInt(toDate.getTime() / 1000);
//             var timeDifference = date2_unixtime - date1_unixtime;
//             var timeDifferenceInHours = timeDifference / 60 / 60;
//             var timeDifferenceInDays = timeDifferenceInHours / 24;
//             var q = 1;
//             var returnArray = [];
//             //get current time for Schedule Submission
//             var currentDate = new Date();
//             var todayDate = moment(currentDate).format('DD-MM-YYYY');
//             currentDate.setTime(currentDate.getTime());
//             var hrs = currentDate.getHours();
//             var min = currentDate.getMinutes();
//             var time = (hrs + ":" + min);
//             var n = time;
//             var n1 = n.split('_');
//             var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
//             // if (time > '12:00') {
//             //     if (fromDateGet > todayDate) {
//             //         fromDate.setDate(fromDate.getDate());
//             //     } else {
//             //         fromDate.setDate(fromDate.getDate() + 1);
//             //     }
//             //     for (var i = 0; i <= timeDifferenceInDays - 1; i++) {
//             //         fromDate.setDate(fromDate.getDate() + 1);
//             //         returnArray.push({
//             //             sl: q,
//             //             return: moment(fromDate).format('DD-MM-YYYY')
//             //         });
//             //         q++;
//             //     }
//             // } else {
//             //     for (var i = 0; i <= timeDifferenceInDays; i++) {
//             //         fromDate.setDate(fromDate.getDate() + 1);
//             //         returnArray.push({
//             //             sl: q,
//             //             return: moment(fromDate).format('DD-MM-YYYY')
//             //         });
//             //         q++;
//             //     }
//             // }
//
//             // remove this loop after uncomment above line
//             for (var i = 0; i <= timeDifferenceInDays; i++) {
//                 fromDate.setDate(fromDate.getDate() + 1);
//                 returnArray.push({sl: q, return: moment(fromDate).format('DD-MM-YYYY')});
//                 q++;
//             }
//
//             SessionStore.set("scheduleSubmission_requiredDates", returnArray);
//             SessionStore.set("scheduleSubmission_schedule", false);
//             SessionStore.set("scheduleSubmission_showDates", true);
//             SessionStore.set("scheduleSubmission_dateSelected", false);
//         } else {
//             swal('All fields are required!');
//             SessionStore.set("scheduleSubmission_showDates", false);
//             SessionStore.set("scheduleSubmission_schedule", false);
//         }
//     },
//     "click #submitSchedule": function(e, instance) {
//         var selectedDateForScheduleSubmission = $(e.currentTarget).attr("thisDate");
//         SessionStore.set("scheduleSubmission_dateSelected", selectedDateForScheduleSubmission);
//         // console.log(mySlotFunction());
//         // console.log('.............');
//         // console.log(timeSlot);
//         // var timeSlot = TimeBlock.find().fetch();
//         // var slotArray = [];
//         // timeSlot.forEach(function(item) {
//         //     slotArray.push(item.time_slot);
//         // });
//         var slotArray = mySlotFunction();
//         var newArr = [];
//         var s = 1;
//         for (var i = 0; i <= slotArray.length - 2; i++) {
//             var no = 1;
//             var slot = slotArray[i + no];
//             if (slotArray.length - 1 == i) {
//                 slot = "00:00";
//             }
//             newArr.push({
//                 sno: s,
//                 daySchedule: SessionStore.get("scheduleSubmission_dateSelected"),
//                 mySlot: slotArray[i] + '-' + slot
//             });
//             s++;
//         }
//         SessionStore.set("scheduleSubmission_schedule", false);
//         SessionStore.set("scheduleSubmission_madeSlot", newArr);
//         //getting STU Lossess for SPD
//         SessionStore.set("isLoading", true);
//         Meteor.call("gettingLossForSPD", selectedDateForScheduleSubmission, function(error, result) {
//             if (error) {
//                 SessionStore.set("isLoading", false);
//                 swal("Please try again !");
//             } else {
//                 if (result.status) {
//                     SessionStore.set("isLoading", false);
//                     instance.lossAppliedOnSPD.set(result.data);
//                 }
//             }
//         });
//     },
//     "click #viewSchedule": function(e, instance) {
//         if ($(e.currentTarget).attr("thisDate")) {
//             SessionStore.set("isLoading", true);
//             Meteor.call('callViewSchedule', $(e.currentTarget).attr("thisDate"), function(error, result) {
//                 if (error) {
//                     SessionStore.set("isLoading", false);
//                     swal("Oops...", "Please try again!", "error");
//                 } else {
//                     if (result.status) {
//                         SessionStore.set("isLoading", false);
//                         console.log(result.data);
//                         SessionStore.set("scheduleSubmission_schedule", result.data.jsonData);
//                         SessionStore.set("scheduleSubmission_madeSlot", false);
//                         SessionStore.set("scheduleSubmission_dateSelected", false);
//                         instance.userProfileVar.set(result.data.userData);
//                     } else {
//                         SessionStore.set("isLoading", false);
//                         swal(result.message);
//                     }
//                 }
//             })
//         }
//         // var view = ScheduleSubmission.find({
//         //     clientId: Meteor.userId(),
//         //     date: $(e.currentTarget).attr("thisDate")
//         // }).fetch();
//         // if (view.length > 0) {
//         //     view[0].json[0].data[0].date = $(e.currentTarget).attr("thisDate");
//         //     var jsonData = view[0].json[0].data;
//         //     view[0].json[0].data[0].totalMwh = view[0].json[0].totalMwh;
//         //     SessionStore.set("scheduleSubmission_schedule", jsonData);
//         //     SessionStore.set("scheduleSubmission_madeSlot", false);
//         //     SessionStore.set("scheduleSubmission_dateSelected", false);
//         //     var userData = Meteor.user().profile.registration_form;
//         //     instance.userProfileVar.set(userData);
//         // } else {}
//     },
//     "click #submitDayForm": function(e, t) {
//         $('#submitDayForm').hide();
//         var instance = Template.instance();
//         var mainArray = [];
//         var totalMwh = 0;
//         var mainArrayWithLoss = [];
//         var totalMwhWithLoss = 0;
//         var stuLossVar = instance.lossAppliedOnSPD.get();
//         var lossPercentVar = Number(stuLossVar) / 100;
//         $('.slots').each(function() {
//             var checkSlots = $(this).val();
//             if (checkSlots.match(/^[0-9]*\.?[0-9]*$/)) {} else {
//                 swal("Oops...", "Enter only digits!", "error");
//                 $('#submitDayForm').show();
//                 throw new Error("Use only digits!");
//             }
//             var bid = $(this).val();
//             var bidWithLoss = 0;
//             if (bid != '') {
//                 var bid = $(this).val();
//                 var calculation = Number(bid) * Number(lossPercentVar)
//                 bidWithLoss = Number(bid) - Number(calculation);
//             } else {
//                 var bid = '0.00';
//                 bidWithLoss = '0.00';
//             }
//             var spdCapacity = Meteor.user().profile.registration_form.project_capicity;
//             if (Number(bid) > Number(spdCapacity)) {
//                 swal("Oops...", "Schedule can't be greater than project capacity!", "error");
//                 $('#submitDayForm').show();
//                 throw new Error("Schedule can't be greater than project capacity!");
//             }
//             SessionStore.set("scheduleSubmission_add", Number(bid).toFixed(2));
//             totalMwh = (Number(totalMwh) + Number(SessionStore.get('scheduleSubmission_add')));
//             SessionStore.set('scheduleSubmission_add', totalMwh);
//             mainArray.push({time_slot: $(this).attr("attr"), bidMwh: Number(bid).toFixed(2)});
//
//             SessionStore.set("scheduleSubmission_bidWithLoss", Number(bidWithLoss).toFixed(2));
//             totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(SessionStore.get('scheduleSubmission_bidWithLoss')));
//             SessionStore.set('scheduleSubmission_bidWithLoss', totalMwhWithLoss);
//             mainArrayWithLoss.push({time_slot: $(this).attr("attr"), bidMwh: Number(bidWithLoss).toFixed(2)});
//         });
//
//         var revision = [];
//         var revisionWithLoss = [];
//         var totalMWhVar = Number(SessionStore.get('scheduleSubmission_add'));
//         var totalMwhDevision = Number(totalMWhVar / 4000).toFixed(7);
//         // getting totalMWh with lossess
//         var totalMWhVarWithLoss = Number(SessionStore.get('scheduleSubmission_bidWithLoss'));
//         var totalMwhDevisionWithLoss = Number(totalMWhVarWithLoss / 4000).toFixed(7);
//         //time added in json
//         var currentDate = new Date();
//         var todayDate = moment(currentDate).format('DD-MM-YYYY');
//         currentDate.setTime(currentDate.getTime());
//         var hrs = currentDate.getHours();
//         var min = currentDate.getMinutes();
//         var time = (hrs + ":" + min);
//         var n = time;
//         var n1 = n.split('_');
//         var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
//         revision.push({data: mainArray, totalMwh: totalMwhDevision, revision_time: time});
//         revisionWithLoss.push({data: mainArrayWithLoss, totalMwh: totalMwhDevisionWithLoss, revision_time: time});
//         if (revision[0].data.length < 96) {
//             swal("Oops...", "Data not Valid!", "error");
//             $('#submitDayForm').show();
//         } else {
//             swal({
//                 title: "Are you sure?",
//                 text: "You want to submit schedule!",
//                 type: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#55dd6b",
//                 confirmButtonText: "Yes, submit it!",
//                 closeOnConfirm: false
//             }, function(isConfirm) {
//                 if (isConfirm) {
//                     Meteor.call("saveScheduleSubmission", SessionStore.get("scheduleSubmission_dateSelected"), revision, revisionWithLoss, stuLossVar, function(error, result) {
//                         if (error) {
//                             swal("Oops...", "Please try again!", "error");
//                             $('#submitDayForm').show();
//                         } else {
//                             if (result.status) {
//                                 swal("Submitted!", "Your schedule has been submitted.", "success");
//                                 $('#submitDayForm').show();
//                                 SessionStore.set("scheduleSubmission_dateSelected", false);
//                             } else {
//                                 swal("Oops...", result.message, "error");
//                                 $('#submitDayForm').show();
//                             }
//                         }
//                     });
//                 } else {
//                     $('#submitDayForm').show();
//                 }
//             });
//         }
//     }
// });
// Template.scheduleSubmission.helpers({
//     "viewDates": function() {
//         return SessionStore.get("scheduleSubmission_showDates");
//     },
//     "dates": function() {
//         return SessionStore.get("scheduleSubmission_requiredDates");
//     },
//     "returnSlot": function() {
//         if (SessionStore.get("scheduleSubmission_showDates") != false) {
//             return SessionStore.get("scheduleSubmission_madeSlot");
//         } else {
//             return false;
//         }
//     },
//     "viewSlots": function() {
//         if (SessionStore.get("scheduleSubmission_showDates") != false && SessionStore.get("scheduleSubmission_dateSelected") != false) {
//             return true;
//         } else {
//             return false;
//         }
//     },
//     "isSelected": function(match, type) {
//         Meteor.subscribe('ScheduleSubmitDetails', match, Meteor.userId());
//         var details = ScheduleSubmission.find({'clientId': Meteor.userId(), 'date': match}).fetch();
//         if (details.length > 0) {
//             if (type == "sub") {
//                 return 'hidden';
//             } else {
//                 return "no";
//             }
//         } else {
//             if (type == "view") {
//                 return 'hidden';
//             } else {
//                 return "no";
//             }
//         }
//     },
//     "submittedScheduling": function() {
//         if (SessionStore.get("scheduleSubmission_showDates") != '' && SessionStore.get("scheduleSubmission_schedule") != false) {
//             return true;
//         } else {
//             return false;
//         }
//     },
//     "viewdata": function() {
//         return SessionStore.get("scheduleSubmission_schedule");
//     },
//     "userProfileData": function() {
//         var instance = Template.instance();
//         var userData = instance.userProfileVar.get();
//         if (userData != '') {
//             return userData;
//         } else {
//             return false;
//         }
//     },
//     serial(index) {
//         return index + 1;
//     },
//     "isSameAsChecked": function() {
//         if (Template.instance().sameasDateVar.get() == "sameas") {
//             return Template.instance().sameasDateVar.get();
//         } else {
//             return "disabled";
//         }
//     }
// });

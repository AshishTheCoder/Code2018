import {ReactiveVar} from 'meteor/reactive-var';

Template.adminScheduleStatus.onCreated(function ss() {
    SessionStore.set("scheduleSubmission_requiredDates", false);
    SessionStore.set("scheduleSubmission_showDates", false);
    SessionStore.set("scheduleSubmission_madeSlot", false);
    SessionStore.set("scheduleSubmission_AvailabilityForMP");
    SessionStore.set("scheduleSubmission_ForecastForMP");
    SessionStore.set("scheduleSubmission_schedule", false);
    SessionStore.set('adminScheduleStatus_add', false);
    SessionStore.set("adminScheduleStatus_bidWithLoss", false);
    this.fromDate = new ReactiveVar;
    this.toDate = new ReactiveVar;
    this.radio = new ReactiveVar;
    this.userList = new ReactiveVar;
    this.scheduleDates = new ReactiveVar;
    this.realTimeData = new ReactiveVar;
    this.viewrealTimeData = new ReactiveVar;
    this.spdSelectedVar = new ReactiveVar;
    this.RealTimeBidViewClickedVar = new ReactiveVar(false);
    this.sameasDateVar = new ReactiveVar();
    this.userProfileVar = new ReactiveVar('');
    this.radioBtnSelectionDayAhead = new ReactiveVar('');
    this.viewData = new ReactiveVar(false);
    this.viewDataRevision = new ReactiveVar('');
    this.selectedStateOfSPDForRev = new ReactiveVar();
    this.btnBidSubmitClick = new ReactiveVar(false);
    this.selectedDate = new ReactiveVar('');
    this.bidSubmitVar = new ReactiveVar('');
    this.AvailabilityForMP = new ReactiveVar;
    this.ForecastForMP = new ReactiveVar;
    this.viewDataDayAhead = new ReactiveVar('');
    this.addScheduleVar = new ReactiveVar(0);
    this.radioBtnSelectionRealTime = new ReactiveVar('');
    this.startTimeVar = new ReactiveVar('');
    this.endTimeVar = new ReactiveVar('');
    this.RealTimeBidSubmitClickVar = new ReactiveVar(false);
    this.realTimeUsedForExcel = new ReactiveVar('');
    this.bidSubmitRealTime = new ReactiveVar('');
    this.viewDataRealTime = new ReactiveVar('');
    this.selectedDateForExcelNameDyanmic = new ReactiveVar('');
    this.lossAppliedOnSPDByAdmin = new ReactiveVar('');
    this.lossAppliedOnSPDForDayAheadByAdmin = new ReactiveVar('');
    this.lossAppliedOnSPDForRealTimeByAdmin = new ReactiveVar('');
    this.addScheduleAfterLossDayAheadByAdmin = new ReactiveVar(0);
    this.addScheduleAfterLossRealTimeByAdmin = new ReactiveVar(0);
});

Template.adminScheduleStatus.rendered = function() {
    SessionStore.set("isLoading", false);
};
Template.adminScheduleStatus.events({
    "focus #fromDate": function() {
        $('#fromDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
    },
    "focus #toDate": function() {
        $("#toDate").datepicker({autoclose: true, format: 'dd-mm-yyyy'});
    },
    "focus #ScheduleSubmissionfromDate": function() {
        $('#ScheduleSubmissionfromDate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
    },
    "focus #ScheduleSubmissiontoDate": function() {
        $('#ScheduleSubmissiontoDate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
    },
    "focus #txtDate": function() {
        $('#txtDate').datepicker({
            format: 'dd-mm-yyyy',
            // startDate: '0d',
            autoclose: true
        });
    },
    "change #inlineRadio": function(e) {
        var instance = Template.instance();
        $('#selectUserSpd').val('');
        instance.realTimeData.set('');
        instance.selectedDateForExcelNameDyanmic.set('');
        instance.spdSelectedVar.set(false);
        instance.RealTimeBidViewClickedVar.set(false);
        SessionStore.set("scheduleSubmission_showDates", false);
        SessionStore.set("scheduleSubmission_dateSelected", false);
        SessionStore.set("scheduleSubmission_requiredDates", false);
        instance.scheduleDates.set();
        instance.radio.set($(e.currentTarget).val());
        SessionStore.set("isLoading", true);
        Meteor.call("callByRadioValue", function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Oops...", "Please try again!", "error");
            } else {
                // swal(result.message);
                if (result.status) {
                    var jsonGot = result.data;
                    // sorting SPD Name, Alphabetically in array
                    var ar = jsonGot.sort(function(a, b) {
                        var nA = a.profile.registration_form.name_of_spd.toLowerCase();
                        var nB = b.profile.registration_form.name_of_spd.toLowerCase();
                        if (nA < nB)
                            return -1;
                        else if (nA > nB)
                            return 1;
                        return 0;
                    });
                    instance.userList.set(ar);
                    SessionStore.set("isLoading", false);
                }
            }
        })
    },
    "change #selectUserSpd": function() {
        var instance = Template.instance();
        instance.realTimeData.set('');
        instance.selectedDateForExcelNameDyanmic.set('');
        instance.radioBtnSelectionDayAhead.set('');
        instance.radioBtnSelectionRealTime.set('');
        var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
        instance.selectedStateOfSPDForRev.set(spdState);
        SessionStore.set("scheduleSubmission_showDates", false);
        SessionStore.set("scheduleSubmission_dateSelected", false);
        SessionStore.set("scheduleSubmission_requiredDates", false);
        SessionStore.set("scheduleSubmission_requiredDates", '');
        instance.RealTimeBidViewClickedVar.set(false);
        instance.spdSelectedVar.set(true);
    },
        "click #spdDataAdminSide": function(instance) {
            var instance = Template.instance();
            var fromDate = $('#fromDate').val();
            var toDate = $('#toDate').val();
            var spdid = $('#selectUserSpd').val();
            var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
            var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
            var spdCapacity = $("#selectUserSpd").find(':selected').attr("attrCapacity");
            var requestType = $('#inlineRadio:checked').val();
            // getting spd shchedules for view admin side
            if (requestType == 'viewSchedule') {
                if (fromDate != '' && toDate != '') {
                    Meteor.call("callScheduleSubmission", spdName, spdid, fromDate, toDate, function(error, result) {
                        if (error) {
                            swal("Oops...", "Please try again!", "error");
                        } else {
                            if (result.status) {
                                var jsonGot = result.data;
                                if (jsonGot.length > 0) {
                                    instance.scheduleDates.set(jsonGot);
                                    instance.realTimeData.set('');
                                    instance.RealTimeBidViewClickedVar.set(true);
                                    instance.selectedDateForExcelNameDyanmic.set('');
                                } else {
                                    instance.scheduleDates.set(jsonGot);
                                    instance.realTimeData.set('');
                                    instance.selectedDateForExcelNameDyanmic.set('');
                                    swal('Schedule not submitted!');
                                }
                            } else {
                                swal(result.message);
                            }
                        }
                    });
                } else {
                    swal('All fields are required!') // spd schedule submission by Admin;
                }
            } else if (requestType == 'scheduleSubmission') {
                var instance = Template.instance();
                var fromDateGet = $('#ScheduleSubmissionfromDate').val();
                var toDateGet = $('#ScheduleSubmissiontoDate').val();
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
            }
        },
    "input .availabilitySchedule": function() {
        var dataArr = $('.availabilitySchedule').val();
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
        var spdid = $('#selectUserSpd').val();
        if ($('#txtDate').val()) {
            Meteor.call("sameAsSubmitScheduleAdminSide", date, spdid, function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        var newArr = [];
                        var s = 0;
                        result.data.forEach(function(item) {
                            s++;
                            newArr.push({sno: s, daySchedule: SessionStore.get("scheduleSubmission_dateSelected"), mySlot: item.time_slot, bidMwh: item.bidMwh});
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
    'click #idSameAs': function() {
        var sameasVar = $('#idSameAs:checked').val();
        var instance = Template.instance();
        instance.sameasDateVar.set(sameasVar);
    },
    "click #submitSchedule": function(e, instance) {
        instance.ForecastForMP.set();
        instance.AvailabilityForMP.set();
        SessionStore.set("scheduleSubmission_AvailabilityForMP");
        SessionStore.set("scheduleSubmission_ForecastForMP");
        var selectedDateForScheduleSubmission = $(e.currentTarget).attr("thisDate");
        SessionStore.set("scheduleSubmission_dateSelected", $(e.currentTarget).attr("thisDate"));
        var timeSlot = TimeBlock.find().fetch();
        var slotArray = [];
        timeSlot.forEach(function(item) {
            slotArray.push(item.time_slot);
        });
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
                // bidMwh:'0.00'
            });
            s++;
        }
        SessionStore.set("scheduleSubmission_schedule", false);
        SessionStore.set("scheduleSubmission_madeSlot", newArr);
        //getting STU Lossess for SPD
        var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
        var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
        Meteor.call("gettingLossForSPDByAdmin", selectedDateForScheduleSubmission, spdState, spdName, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                    instance.lossAppliedOnSPDByAdmin.set(result.data);
                }
            }
        });
    },
    "click #viewSchedule": function(e, instance) {
        var spdid = $('#selectUserSpd').val();
        if ($(e.currentTarget).attr("thisDate")) {
            SessionStore.set("isLoading", true);
            Meteor.call('callViewScheduleByAdmin', spdid, $(e.currentTarget).attr("thisDate"), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        SessionStore.set("scheduleSubmission_schedule", result.data.jsonData);
                        SessionStore.set("scheduleSubmission_madeSlot", false);
                        SessionStore.set("scheduleSubmission_dateSelected", false);
                    } else {
                        SessionStore.set("isLoading", false);
                        swal(result.message);
                    }
                }
            })
        }
    },
    "click #submitDayForm": function(e, instance) {
        $('#submitDayForm').hide();
        var spdid = $('#selectUserSpd').val();
        var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
        var spdCapacity = $("#selectUserSpd").find(':selected').attr("attrCapacity");
        var spdState = instance.selectedStateOfSPDForRev.get();
        var mainArray = [];
        var totalMwh = 0;
        var mainArrayWithLoss = [];
        var totalMwhWithLoss = 0;
        var stuLossVar = instance.lossAppliedOnSPDByAdmin.get();
        var lossPercentVar = Number(stuLossVar) / 100;
        if (spdState == 'MP') {//--------------------------MP State
          let availabilityArr = [];
          $('.availabilitySchedule').each(function() {
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
              if (Number(bid) > Number(spdCapacity)) {
                  swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                  $('#submitDayForm').show();
                  throw new Error("Schedule can't be greater than project capacity!");
              }

              SessionStore.set("adminScheduleStatus_add", Number(bid).toFixed(2));
              totalMwh = (Number(totalMwh) + Number(SessionStore.get('adminScheduleStatus_add')));
              SessionStore.set('adminScheduleStatus_add', totalMwh);
              mainArray.push({time_slot: $(this).attr("attr"),availability:Number(availability).toFixed(2), bidMwh: Number(bid).toFixed(2)});

              SessionStore.set("adminScheduleStatus_bidWithLoss", Number(bidWithLoss).toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(SessionStore.get('adminScheduleStatus_bidWithLoss')));
              SessionStore.set('adminScheduleStatus_bidWithLoss', totalMwhWithLoss);
              mainArrayWithLoss.push({time_slot: $(this).attr("attr"),availability:Number(availability).toFixed(2), bidMwh: Number(bidWithLoss).toFixed(2)});
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
              if (Number(bid) > Number(spdCapacity)) {
                  swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                  $('#submitDayForm').show();
                  throw new Error("Schedule can't be greater than project capacity!");
              }
              SessionStore.set("adminScheduleStatus_add", Number(bid).toFixed(2));
              totalMwh = (Number(totalMwh) + Number(SessionStore.get('adminScheduleStatus_add')));
              SessionStore.set('adminScheduleStatus_add', totalMwh);
              mainArray.push({time_slot: $(this).attr("attr"), bidMwh: Number(bid).toFixed(2)});

              SessionStore.set("adminScheduleStatus_bidWithLoss", Number(bidWithLoss).toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(SessionStore.get('adminScheduleStatus_bidWithLoss')));
              SessionStore.set('adminScheduleStatus_bidWithLoss', totalMwhWithLoss);
              mainArrayWithLoss.push({time_slot: $(this).attr("attr"), bidMwh: Number(bidWithLoss).toFixed(2)});
          });
        }

        var revision = [];
        var revisionWithLoss = [];
        var totalMWhVar = Number(SessionStore.get('adminScheduleStatus_add'));
        var totalMwhDevision = Number(totalMWhVar / 4000).toFixed(7);
        // getting totalMWh with lossess
        var totalMWhVarWithLoss = Number(SessionStore.get('adminScheduleStatus_bidWithLoss'));
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
        if (spdState == 'MP') {
          var totalAvaibilityDevision = Number(totalAvaibility / 4000).toFixed(7);
          revision.push({data: mainArray, totalAvaibility:Number(totalAvaibilityDevision).toFixed(2), totalMwh: totalMwhDevision, revision_time: time});
          revisionWithLoss.push({data: mainArrayWithLoss, totalAvaibility:Number(totalAvaibilityDevision).toFixed(2), totalMwh: totalMwhDevisionWithLoss, revision_time: time});
        }else {
          revision.push({data: mainArray, totalMwh: totalMwhDevision, revision_time: time});
          revisionWithLoss.push({data: mainArrayWithLoss, totalMwh: totalMwhDevisionWithLoss, revision_time: time});
        }
        swal({
            title: "Are you sure?",
            text: "You want to submit schedule for " + spdName,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                swal("Submitted!", "Schedule for " + spdName + " has been successfully submitted.", "success");
                Meteor.call("saveScheduleSubmissionAdminSide", SessionStore.get("scheduleSubmission_dateSelected"), revision, spdid, revisionWithLoss,stuLossVar, function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again!", "error");
                        $('#submitDayForm').show();
                    } else {
                        // swal("Submitted!", "Your schedule has been submitted.", "success");
                        if (result.status) {
                            // get ticket ID and go to the ticket page.
                            $('#submitDayForm').show();
                            SessionStore.set("scheduleSubmission_dateSelected", false);
                        }
                    }
                });
            } else {
                $('#submitDayForm').show();
            }
        });
    },
    "click #viewSpdSchedule": function(e, instance) {
        var spdId = $(e.currentTarget).attr('data-title');
        var dateVar = $(e.currentTarget).attr('selectedDate');
        var spdState = Template.instance().selectedStateOfSPDForRev.get();
        instance.selectedDateForExcelNameDyanmic.set(dateVar);
        SessionStore.set("isLoading", true);
        Meteor.call("getRealTimeDataFromAdmin",dateVar, spdId, spdState, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Oops...", "Please try again!", "error");
            } else {
                SessionStore.set("isLoading", false);
                instance.realTimeData.set(result.data[0]);
                instance.viewrealTimeData.set(result.data[1]);
                instance.RealTimeBidViewClickedVar.set(true);
            }
        });
    },
    "click #exportRevisonsAdminSide": function(e, instance) {
        var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
        var selectedDateVar = instance.selectedDateForExcelNameDyanmic.get();
        tableToExcel('revisionTableAdminSide', 'SHEET1', spdName, selectedDateVar);
    },
    "click #radioDayAhead": function(e, instance) {
        var dayAheadVar = $('#radioDayAhead').val();
        instance.viewData.set('');
        instance.btnBidSubmitClick.set('');
        instance.viewDataDayAhead.set('');
        instance.radioBtnSelectionRealTime.set('');
        instance.selectedDateForExcelNameDyanmic.set('');
        instance.bidSubmitRealTime.set('');
        instance.endTimeVar.set('');
        instance.RealTimeBidSubmitClickVar.set(false);
        instance.radioBtnSelectionDayAhead.set(dayAheadVar);
    },
    "focus #fromdateDayAhead": function() {
        $('#fromdateDayAhead').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', numberOfMonths: 1, autoclose: true});
    },
    "focus #txtToDateDayAhead": function() {
        $('#txtToDateDayAhead').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', numberOfMonths: 1, autoclose: true});
    },
    ////////////////////////////////Day Ahead Submit Button///////////////////////////////
    'click #btnSubmitDayAheadDetail': function(e, instance) {
        var fromdate = $('#fromdateDayAhead').val();
        var todate = $('#txtToDateDayAhead').val();
        var spdid = $('#selectUserSpd').val();
        var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
        if (fromdate != '' && todate != '') {
            fromDate = fromdate.split('-');
            toDate = todate.split('-');
            fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
            toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
            date1_unixtime = parseInt(fromDate.getTime() / 1000);
            date2_unixtime = parseInt(toDate.getTime() / 1000);
            var timeDifference = date2_unixtime - date1_unixtime;
            var timeDifferenceInHours = timeDifference / 60 / 60;
            var timeDifferenceInDays = timeDifferenceInHours / 24;
            // var q = 1;
            //get current time for day  ahead validation
            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            currentDate.setTime(currentDate.getTime());
            var hrs = currentDate.getHours();
            var min = currentDate.getMinutes();
            var time = (hrs + ":" + min);
            var n = time;
            var n1 = n.split('_');
            var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
            var spdid = $('#selectUserSpd').val();
            var userIds = spdid;
            // when Rajasthan Day Ahead Revision starts from 10:30 , comment this for loop and uncoment below if else condition

            // var returnData = [];
            // for (var i = 0; i <= timeDifferenceInDays; i++) {
            //     fromDate.setDate(fromDate.getDate() + 1);
            //     var date = moment(fromDate).format('DD-MM-YYYY');
            //     var json = ScheduleSubmission.find({clientId: userIds, date: date}).fetch();
            //     if (json.length > 0) {
            //         returnData.push({sn: q, date: moment(fromDate).format('DD-MM-YYYY')});
            //         q++;
            //     }
            // }
            SessionStore.set("isLoading", true);
            Meteor.call('dayAheadDateList', userIds, timeDifferenceInDays, fromDate, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.viewData.set(true);
                        instance.viewDataRevision.set(result.data);
                    } else {
                        SessionStore.set("isLoading", false);
                        instance.viewData.set(false);
                        swal(result.message);
                    }
                }
            })
        } else {
            swal('All fields are required');
        }
    },
    ////////////////////////////////Day Ahead Edit Button//////////////////////////////
    'click .btnEditBidDayAhead': function(e, instance) {
        $('#BtnFinalSubmitDayAhead').hide();
        var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
        var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
        var bidSelectedDateVar = $(e.currentTarget).attr('getDate');
        // if (Template.instance().selectedStateOfSPDForRev.get() == 'Gujarat' || Template.instance().selectedStateOfSPDForRev.get() == 'MP') {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var tomorrowDate = moment(tomorrow).format('DD-MM-YYYY');

            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            currentDate.setTime(currentDate.getTime());
            var hrs = currentDate.getHours();
            var min = currentDate.getMinutes();
            var time = (hrs + ":" + min);
            var n = time;
            var n1 = n.split('_');
            var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
            if (bidSelectedDateVar == tomorrowDate) {
                if (time < '15:00') {
                    swal('For day ahead revision you can not revised before 03:00 PM');
                    throw new Error("For day ahead revision you can not revised before 03:00 PM!");
                }
                if (time >= '22:00') {
                    swal('For day ahead revision you can not revised after 10:00 PM');
                    throw new Error("For day ahead revision you can not revised after 10:00 PM!");
                }
            }
        // }
        instance.selectedDate.set(bidSelectedDateVar);
        var spdid = $('#selectUserSpd').val();

        const handle = Meteor.subscribe('ScheduleSubmitDetails', bidSelectedDateVar, spdid);

        Tracker.autorun(() => {
            const isReady = handle.ready();
            if (isReady) {
                var view = ScheduleSubmission.find({clientId: spdid, date: bidSelectedDateVar}).fetch();
                //Real Time Edit Code
                var newArr = [];
                if (view.length > 0) {
                    var jsonLength = view[0].json.length;
                    view[0].json[jsonLength - 1].data.forEach(function(item) {
                      if (loggedInUserState('Other', spdState)) {
                        newArr.push({date: bidSelectedDateVar, mySlot: item.time_slot, availability: item.availability, bidMwh: item.bidMwh});
                      }else {
                        newArr.push({date: bidSelectedDateVar, mySlot: item.time_slot, bidMwh: item.bidMwh});
                      }
                    });
                }
                instance.bidSubmitVar.set(newArr);
                instance.btnBidSubmitClick.set(true);
                instance.viewDataDayAhead.set('');
                // getting stu loss by Admin
                Meteor.call("gettingLossForSPDByAdmin", bidSelectedDateVar, spdState, spdName, function(error, result) {
                    if (error) {
                        swal("Please try again !");
                    } else {
                        if (result.status) {
                            instance.lossAppliedOnSPDForDayAheadByAdmin.set(result.data);
                        }
                    }
                });
            }
        })
    },
    "input .availabilityForDayAhead": function(e, instance) {
        var selectedDate = instance.selectedDate.get();
        var dataArr = $('.availabilityForDayAhead').val();
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
                      date: selectedDate,
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      availability : availabilityArr[s],
                      bidMwh : forcastArr[s].bidMwh
                  });
                  s++;
              };
              instance.bidSubmitVar.set(newArr);
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
                      date: selectedDate,
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      availability : availabilityArr[s],
                  });
                  s++;
              };
              SessionStore.set("scheduleSubmission_AvailabilityForMP", newArr);
              instance.bidSubmitVar.set(newArr);
          }
        }
    },
    // for excel sheets copy and paste
    "input .numberOfBidForDayAhead": function(e,instance) {
        var selectedDate = instance.selectedDate.get();
        var dataArr = $('.numberOfBidForDayAhead').val();
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
                      date: selectedDate,
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      availability: availabilityArr[s].availability,
                      bidMwh: ddd[s]
                  });
                  s++;
              };
              instance.bidSubmitVar.set(newArr);
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
                      date: selectedDate,
                      mySlot: timeSlot[i].time_slot + '-' + slot,
                      bidMwh: ddd[s]
                  });
                  s++;
              };
              instance.bidSubmitVar.set(newArr);
              SessionStore.set("scheduleSubmission_ForecastForMP", newArr);
          }
        }
    },

    ////////////////////////////////Day Ahead Final Submit Button////////////////////////////
    'click #BtnFinalSubmitDayAhead': function(e, instance) {
        $('#BtnFinalSubmitDayAhead').hide();
        var spdid = $('#selectUserSpd').val();
        var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
        var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
        var spdTotalCapacity = $("#selectUserSpd").find(':selected').attr("attrCapacity");
        var arr = [];
        var jsonArr = [];
        var totalMwh = 0;
        var mainArrayWithLoss = [];
        var totalMwhWithLoss = 0;
        var stuLossVar = instance.lossAppliedOnSPDForDayAheadByAdmin.get();
        var lossPercentVar = Number(stuLossVar) / 100;
        if (loggedInUserState('Other', spdState)) {
          let availabilityArr = [];
          $('.availabilityForDayAhead').each(function() {
            var availability = $(this).val();
            if (availability.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                swal("Oops...", "Availability must be a number!", "error");
                $('#BtnFinalSubmitDayAhead').show();
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
          $('.numberOfBidForDayAhead').each(function() {
              var bidTimeSlot = $(this).attr('slot');
              var availability = availabilityArr[i];
              var checkSlots = $(this).val();
              if (checkSlots.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                  swal("Oops...", "Enter only digits!", "error");
                  $('#BtnFinalSubmitDayAhead').show();
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
              var spdCapacity = spdTotalCapacity;
              if (Number(bid) > Number(spdCapacity)) {
                  swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                  $('#BtnFinalSubmitDayAhead').show();
                  throw new Error("Schedule can't be greater than project capacity!");
              }
              Template.instance().addScheduleVar.set(Number(bid).toFixed(2));
              totalMwh = (Number(totalMwh) + Number(Template.instance().addScheduleVar.get()));
              Template.instance().addScheduleVar.set(totalMwh);
              var json = {
                  'time_slot': bidTimeSlot,
                  'availability':Number(availability).toFixed(2),
                  'bidMwh': Number(bid).toFixed(2)
              };
              arr.push(json);

              Template.instance().addScheduleAfterLossDayAheadByAdmin.set(Number(bidWithLoss).toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(Template.instance().addScheduleAfterLossDayAheadByAdmin.get()));
              Template.instance().addScheduleAfterLossDayAheadByAdmin.set(totalMwhWithLoss);
              var jsonWithLoss = {
                  'time_slot': bidTimeSlot,
                  'availability':Number(availability).toFixed(2),
                  'bidMwh': Number(bidWithLoss).toFixed(2)
              };
              mainArrayWithLoss.push(jsonWithLoss);
              totalAvaibility += Number(availability);
              i++;
          });
        }else {
          $('.numberOfBidForDayAhead').each(function() {
              var bidTimeSlot = $(this).attr('slot');
              // var bid = $(this).val();

              var checkSlots = $(this).val();
              if (checkSlots.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                  swal("Oops...", "Enter only digits!", "error");
                  $('#BtnFinalSubmitDayAhead').show();
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
              var spdCapacity = spdTotalCapacity;
              if (Number(bid) > Number(spdCapacity)) {
                  swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                  $('#BtnFinalSubmitDayAhead').show();
                  throw new Error("Schedule can't be greater than project capacity!");
              }
              Template.instance().addScheduleVar.set(Number(bid).toFixed(2));
              totalMwh = (Number(totalMwh) + Number(Template.instance().addScheduleVar.get()));
              Template.instance().addScheduleVar.set(totalMwh);
              var json = {
                  'time_slot': bidTimeSlot,
                  'bidMwh': Number(bid).toFixed(2)
              };
              arr.push(json);

              Template.instance().addScheduleAfterLossDayAheadByAdmin.set(Number(bidWithLoss).toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(Template.instance().addScheduleAfterLossDayAheadByAdmin.get()));
              Template.instance().addScheduleAfterLossDayAheadByAdmin.set(totalMwhWithLoss);
              var jsonWithLoss = {
                  'time_slot': bidTimeSlot,
                  'bidMwh': Number(bidWithLoss).toFixed(2)
              };
              mainArrayWithLoss.push(jsonWithLoss);
          });
        }

        var totalMWhVar = Number(Template.instance().addScheduleVar.get());
        var totalMwhDevision = Number(totalMWhVar / 4000).toFixed(7);

        var totalMWhVarWithLoss = Number(Template.instance().addScheduleAfterLossDayAheadByAdmin.get());
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
        var jsonData = {
            data: arr,
            totalMwh: totalMwhDevision,
            revision_time: time
        };

        var jsonDataWithLoss = {
            data: mainArrayWithLoss,
            totalMwh: totalMwhDevisionWithLoss,
            revision_time: time
        };
        if (loggedInUserState('Other', spdState)) {
          var totalAvaibilityDevision = Number(totalAvaibility / 4000).toFixed(7);
          jsonData.totalAvaibility = Number(totalAvaibilityDevision).toFixed(7);
          jsonDataWithLoss.totalAvaibility = Number(totalAvaibilityDevision).toFixed(7);
        }

        swal({
            title: "Are you sure?",
            text: "You want to do day ahead reavision for " + spdName,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, do it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                swal("Updated!", "Day ahead revision for " + spdName + " successfully submitted", "success");
                instance.btnBidSubmitClick.set(false);
                Meteor.call("updateDayAheadRevisionAdminSide", instance.selectedDate.get(), jsonData, spdid, jsonDataWithLoss, function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again!", "error");
                        $('#BtnFinalSubmitDayAhead').show();
                    } else {
                        // swal("Updated!", "Your schedule has been updated.", "success");
                        if (result.status) {
                            $('#BtnFinalSubmitDayAhead').show();
                            instance.btnBidSubmitClick.set(false);
                        }
                    }
                });
            } else {
                $('#BtnFinalSubmitDayAhead').show();
            }
        });
    },
    ////////////////////////Day Ahead View Button///////////////////////
    "click .btnViewScheduleDayAhead": function(e, instance) {
        var spdid = $('#selectUserSpd').val();
        var dateVar = $(e.currentTarget).attr('getDate');

        const handle = Meteor.subscribe('ScheduleSubmitDetails', dateVar, spdid);

        Tracker.autorun(() => {
            const isReady = handle.ready();
            if (isReady) {
                var view = ScheduleSubmission.find({clientId: spdid, date: dateVar}).fetch();
                if (view.length > 0) {
                    var JsonLength = view[0].json.length;
                    var jsonData = view[0].json[JsonLength - 1].data;
                    var totalMwh = view[0].json[JsonLength - 1].totalMwh;
                    var jsonVar = {
                        date: dateVar,
                        jsonData: jsonData,
                        totalMwh: totalMwh
                    };
                    instance.viewDataDayAhead.set(jsonVar);
                    instance.btnBidSubmitClick.set(false);
                }
            }
        });
    },
    //**********************************************Real Time Events****************//
    "click #radioRealTime": function(e, instance) {
        instance.startTimeVar.set('');
        instance.radioBtnSelectionDayAhead.set('');
        instance.bidSubmitRealTime.set('');
        instance.endTimeVar.set('');
        instance.RealTimeBidSubmitClickVar.set(false);
        var spdid = $('#selectUserSpd').val();
        var realTimeVar = $('#radioRealTime').val();
        var todayDate = new Date();
        var toDate = moment(todayDate).format('DD-MM-YYYY');

        const handle = Meteor.subscribe('ScheduleSubmitDetails', toDate, spdid);
        Tracker.autorun(() => {
            const isReady = handle.ready();
            if (isReady) {
                var view = ScheduleSubmission.find({clientId: spdid, date: toDate}).fetch();
                // condition using for validate revision one after 6 time block revised
                var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
                if (spdState == 'MP' || spdState == 'Rajasthan') {
                    if (view.length > 0) {
                        if (view[0].json.length > 1) {
                            var currentDateForMP = new Date();
                            currentDateForMP.setTime(currentDateForMP.getTime() + 1000);
                            var hrsForMP = currentDateForMP.getHours();
                            var minForMP = currentDateForMP.getMinutes();
                            var timeForMP = (hrsForMP + ":" + minForMP);
                            var nForMP = timeForMP;
                            var ForMPn1 = nForMP.split('_');
                            var timeForMP = am_pm_to_hours(ForMPn1[0] + ':' + ForMPn1[1] + ' ' + ForMPn1[2]);
                            var validationTime = view[0].blocked_time_slot;
                            if (validationTime >= timeForMP) {
                              if (spdState == 'MP') {
                                swal('You are restricted as per MP SLDC regulations and SECI processing time, till ' + validationTime);
                                throw new Error("You are restricted!");
                              }else if (spdState == 'Rajasthan') {
                                swal('You are restricted as per RAJASTHAN SLDC regulations and SECI processing time, till ' + validationTime);
                                throw new Error("You are restricted!");
                              }
                            }
                        }
                    }
                }
                if (view.length > 0 && spdState == 'MP') {
                    instance.radioBtnSelectionDayAhead.set('');
                    instance.radioBtnSelectionRealTime.set(realTimeVar);
                } else if (view.length > 0 && spdState != 'MP') {
                    instance.radioBtnSelectionDayAhead.set('');
                    instance.radioBtnSelectionRealTime.set(realTimeVar);
                } else {
                    instance.radioBtnSelectionDayAhead.set('');
                    swal('Schedule not available!');
                }
            }
        });
    },
    "change #ddlStartTime": function(e, instance) {
        $('#ddlEndTime').val('');
        instance.endTimeVar.set('');
        instance.bidSubmitRealTime.set('');
        var startTimeVar = $(e.currentTarget).val();
        instance.startTimeVar.set(startTimeVar);
        instance.RealTimeBidSubmitClickVar.set(false);
        instance.RealTimeBidViewClickedVar.set(false);
    },
    "change #ddlEndTime": function(e, instance) {
        var endTimeVar = $(e.currentTarget).val();
        instance.endTimeVar.set(endTimeVar);
        instance.bidSubmitRealTime.set('');
        instance.RealTimeBidSubmitClickVar.set(false);
        instance.RealTimeBidViewClickedVar.set(false);
    },
    'click .btnRealTimeSubmitBid': function(e, instance) {
        $('#RealTimeBtnSubmit').hide();
        instance.realTimeUsedForExcel.set('');
        instance.bidSubmitRealTime.set('');
        var bidSelectedDateVar = $(e.currentTarget).attr('getDate');
        instance.viewDataDayAhead.set(bidSelectedDateVar);
        var startTime = Template.instance().startTimeVar.get();
        var endTime = Template.instance().endTimeVar.get();
        var returnData = [];

        var spdid = $('#selectUserSpd').val();
        var view = ScheduleSubmission.find({clientId: spdid, date: bidSelectedDateVar}).fetch();
        var timeDiffVar = TimeBlock.find({
            time_slot: {
                $gte: startTime,
                $lte: endTime
            }
        }).fetch();
        var diff = (timeDiffVar.length - 1);
        for (var i = 0; i < diff; i++) {
            var timeSlotVar = TimeBlock.find({
                time_slot: {
                    $gte: startTime,
                    $lte: endTime
                }
            }).fetch();
            var timeSlot1 = '';
            var timeSlot2 = '';
            if (i < diff) {
                timeSlot1 = timeSlotVar[i].time_slot;
                timeSlot2 = timeSlotVar[i + 1].time_slot;
            } else if (i == diff) {
                timeSlot1 = timeSlotVar[95].time_slot;
                timeSlot2 = timeSlotVar[0].time_slot;
            }
            var timeSlotVar = timeSlot1 + '-' + timeSlot2;
            // var spdid = $('#selectUserSpd').val();
            // var view = ScheduleSubmission.find({clientId: spdid, date: bidSelectedDateVar}).fetch();
            var arrIdex = (Number(view[0].json.length) - 1);
            var timeData = '';
            var bidData = '';
            var availability = '';
            var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
            if (loggedInUserState('Other', spdState)) {
              view[0].json[arrIdex].data.forEach(function(timeSlot) {
                  if (timeSlot.time_slot == timeSlotVar) {
                      timeData = timeSlot.time_slot;
                      availability = timeSlot.availability;
                      bidData = timeSlot.bidMwh;
                      status = timeSlot.status;
                  }
              });
              var json = {
                  date: bidSelectedDateVar,
                  time_slot: timeData,
                  availability:availability,
                  bidMwh: bidData,
                  status: status
              };
            }else {
              view[0].json[arrIdex].data.forEach(function(timeSlot) {
                  if (timeSlot.time_slot == timeSlotVar) {
                      timeData = timeSlot.time_slot;
                      bidData = timeSlot.bidMwh;
                      status = timeSlot.status;
                  }
              });
              var json = {
                  date: bidSelectedDateVar,
                  time_slot: timeData,
                  bidMwh: bidData,
                  status: status
              };
            }
            returnData.push(json);
        }
        instance.bidSubmitRealTime.set(returnData);
        instance.RealTimeBidSubmitClickVar.set(true);
        instance.RealTimeBidViewClickedVar.set(false);
        instance.viewDataRealTime.set('');
        // getting stu loss by Admin
        var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
        var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
        Meteor.call("gettingLossForSPDByAdmin", bidSelectedDateVar, spdState, spdName, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                    instance.lossAppliedOnSPDForRealTimeByAdmin.set(result.data);
                }
            }
        });
    },



    "input .availabilityRealTime": function(evt, instance) {
        var spdid = $('#selectUserSpd').val();
        var selectedDate = instance.selectedDate.get();
        var dataArr = $('.availabilityRealTime').val();
        var availabilityArr = dataArr.split(' ');
        var newArr = [];
        if (instance.ForecastForMP.get()) {
          var forcastArr = instance.ForecastForMP.get();
          if (availabilityArr.length > 0) {
              var bidSelectedDateVar = instance.viewDataDayAhead.get();
              var startTime = instance.startTimeVar.get();
              var endTime = instance.endTimeVar.get();
              var returnData = [];
              var timeDiffVar = TimeBlock.find({
                  time_slot: {
                      $gte: startTime,
                      $lte: endTime
                  }
              }).fetch();
              var s = 0;
              var diff = (timeDiffVar.length - 1);
              for (var i = 0; i < diff; i++) {
                  var timeSlotVar = TimeBlock.find({
                      time_slot: {
                          $gte: startTime,
                          $lte: endTime
                      }
                  }).fetch();
                  var timeSlot1 = '';
                  var timeSlot2 = '';
                  if (i < diff) {
                      timeSlot1 = timeSlotVar[i].time_slot;
                      timeSlot2 = timeSlotVar[i + 1].time_slot;
                  } else if (i == diff) {
                      timeSlot1 = timeSlotVar[95].time_slot;
                      timeSlot2 = timeSlotVar[0].time_slot;
                  }
                  var timeSlotVar = timeSlot1 + '-' + timeSlot2;

                  var view = ScheduleSubmission.find({clientId: spdid, date: bidSelectedDateVar}).fetch();

                  var arrIdex = (Number(view[0].json.length) - 1);
                  var timeData = '';
                  var bidData = '';
                  view[0].json[arrIdex].data.forEach(function(timeSlot) {
                      if (timeSlot.time_slot == timeSlotVar) {
                          timeData = timeSlot.time_slot;
                          bidData = timeSlot.bidMwh;
                          status = timeSlot.status;
                      }
                  });
                  var json = {
                      date: bidSelectedDateVar,
                      time_slot: timeData,
                      availability:availabilityArr[s],
                      bidMwh: forcastArr[s].bidMwh,
                      status: status
                  };
                  returnData.push(json);
                  s++;
              }
              instance.realTimeUsedForExcel.set(returnData);
          }
        }else {
          if (availabilityArr.length > 0) {
              var bidSelectedDateVar = instance.viewDataDayAhead.get();
              var startTime = instance.startTimeVar.get();
              var endTime = instance.endTimeVar.get();
              var returnData = [];
              var timeDiffVar = TimeBlock.find({
                  time_slot: {
                      $gte: startTime,
                      $lte: endTime
                  }
              }).fetch();
              var s = 0;
              var diff = (timeDiffVar.length - 1);
              for (var i = 0; i < diff; i++) {
                  var timeSlotVar = TimeBlock.find({
                      time_slot: {
                          $gte: startTime,
                          $lte: endTime
                      }
                  }).fetch();
                  var timeSlot1 = '';
                  var timeSlot2 = '';
                  if (i < diff) {
                      timeSlot1 = timeSlotVar[i].time_slot;
                      timeSlot2 = timeSlotVar[i + 1].time_slot;
                  } else if (i == diff) {
                      timeSlot1 = timeSlotVar[95].time_slot;
                      timeSlot2 = timeSlotVar[0].time_slot;
                  }
                  var timeSlotVar = timeSlot1 + '-' + timeSlot2;

                  var view = ScheduleSubmission.find({clientId: spdid, date: bidSelectedDateVar}).fetch();

                  var arrIdex = (Number(view[0].json.length) - 1);
                  var timeData = '';
                  var bidData = '';
                  view[0].json[arrIdex].data.forEach(function(timeSlot) {
                      if (timeSlot.time_slot == timeSlotVar) {
                          timeData = timeSlot.time_slot;
                          availability = timeSlot.availability;
                          status = timeSlot.status;
                      }
                  });
                  var json = {
                      date: bidSelectedDateVar,
                      time_slot: timeData,
                      availability:availabilityArr[s],
                      status: status
                  };
                  returnData.push(json);
                  s++;
              }
              instance.realTimeUsedForExcel.set(returnData);
              instance.AvailabilityForMP.set(returnData);
          }
        }
    },

    "input .numberOfBidRealTime": function(evt, instance) {
        var spdid = $('#selectUserSpd').val();
        var selectedDate = instance.selectedDate.get();
        var dataArr = $('.numberOfBidRealTime').val();
        var ddd = dataArr.split(' ');
        var newArr = [];
        if (instance.AvailabilityForMP.get()) {
          var availabilityArr = instance.AvailabilityForMP.get();
          if (ddd.length > 0) {
              var bidSelectedDateVar = instance.viewDataDayAhead.get();
              var startTime = instance.startTimeVar.get();
              var endTime = instance.endTimeVar.get();
              var returnData = [];
              var timeDiffVar = TimeBlock.find({
                  time_slot: {
                      $gte: startTime,
                      $lte: endTime
                  }
              }).fetch();
              var s = 0;
              var diff = (timeDiffVar.length - 1);
              for (var i = 0; i < diff; i++) {
                  var timeSlotVar = TimeBlock.find({
                      time_slot: {
                          $gte: startTime,
                          $lte: endTime
                      }
                  }).fetch();
                  var timeSlot1 = '';
                  var timeSlot2 = '';
                  if (i < diff) {
                      timeSlot1 = timeSlotVar[i].time_slot;
                      timeSlot2 = timeSlotVar[i + 1].time_slot;
                  } else if (i == diff) {
                      timeSlot1 = timeSlotVar[95].time_slot;
                      timeSlot2 = timeSlotVar[0].time_slot;
                  }
                  var timeSlotVar = timeSlot1 + '-' + timeSlot2;

                  var view = ScheduleSubmission.find({clientId: spdid, date: bidSelectedDateVar}).fetch();

                  var arrIdex = (Number(view[0].json.length) - 1);
                  var timeData = '';
                  var bidData = '';
                  view[0].json[arrIdex].data.forEach(function(timeSlot) {
                      if (timeSlot.time_slot == timeSlotVar) {
                          timeData = timeSlot.time_slot;
                          bidData = timeSlot.bidMwh;
                          status = timeSlot.status;
                      }
                  });
                  var json = {
                      date: bidSelectedDateVar,
                      time_slot: timeData,
                      availability: availabilityArr[s].availability,
                      bidMwh: ddd[s],
                      status: status
                  };
                  returnData.push(json);
                  s++;
              }
              instance.realTimeUsedForExcel.set(returnData);
              instance.ForecastForMP.set(returnData);
          }
        }else {
          if (ddd.length > 0) {
              var bidSelectedDateVar = instance.viewDataDayAhead.get();
              var startTime = instance.startTimeVar.get();
              var endTime = instance.endTimeVar.get();
              var returnData = [];
              var timeDiffVar = TimeBlock.find({
                  time_slot: {
                      $gte: startTime,
                      $lte: endTime
                  }
              }).fetch();
              var s = 0;
              var diff = (timeDiffVar.length - 1);
              for (var i = 0; i < diff; i++) {
                  var timeSlotVar = TimeBlock.find({
                      time_slot: {
                          $gte: startTime,
                          $lte: endTime
                      }
                  }).fetch();
                  var timeSlot1 = '';
                  var timeSlot2 = '';
                  if (i < diff) {
                      timeSlot1 = timeSlotVar[i].time_slot;
                      timeSlot2 = timeSlotVar[i + 1].time_slot;
                  } else if (i == diff) {
                      timeSlot1 = timeSlotVar[95].time_slot;
                      timeSlot2 = timeSlotVar[0].time_slot;
                  }
                  var timeSlotVar = timeSlot1 + '-' + timeSlot2;

                  var view = ScheduleSubmission.find({clientId: spdid, date: bidSelectedDateVar}).fetch();

                  var arrIdex = (Number(view[0].json.length) - 1);
                  var timeData = '';
                  var bidData = '';
                  view[0].json[arrIdex].data.forEach(function(timeSlot) {
                      if (timeSlot.time_slot == timeSlotVar) {
                          timeData = timeSlot.time_slot;
                          bidData = timeSlot.bidMwh;
                          status = timeSlot.status;
                      }
                  });
                  var json = {
                      date: bidSelectedDateVar,
                      time_slot: timeData,
                      bidMwh: ddd[s],
                      status: status
                  };
                  returnData.push(json);
                  s++;
              }
              instance.realTimeUsedForExcel.set(returnData);
              instance.ForecastForMP.set(returnData);
          }
        }
    },
    'click #RealTimeBtnSubmit': function(e, instance) {
        $('#RealTimeBtnSubmit').hide();
        var todayDate = $('#txtTodayDate').val();
        var spdid = $('#selectUserSpd').val();
        var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
        var spdState = $("#selectUserSpd").find(':selected').attr("attrState");
        var spdTotalCapacity = $("#selectUserSpd").find(':selected').attr("attrCapacity");
        //condition is basically used for MP only but it will insert in all data
        var currentDateForMP = new Date();
        currentDateForMP.setTime(currentDateForMP.getTime() + 90 * 60 * 1000);
        var hrsForMP = currentDateForMP.getHours();
        var minForMP = currentDateForMP.getMinutes();
        var timeForMP = (hrsForMP + ":" + minForMP);
        var nForMP = timeForMP;
        var ForMPn1 = nForMP.split('_');
        var timeForMP = am_pm_to_hours(ForMPn1[0] + ':' + ForMPn1[1] + ' ' + ForMPn1[2]);
        var blockedTimeSlotForMP = timeForMP;

        var currentDate = new Date();
        if (Template.instance().selectedStateOfSPDForRev.get() == 'Rajasthan') {
          currentDate.setTime(currentDate.getTime() + 60 * 60 * 1000);
        }else {
          currentDate.setTime(currentDate.getTime() + 120 * 60 * 1000);

        }
        var hrs = currentDate.getHours();
        var min = currentDate.getMinutes();
        var time = (hrs + ":" + min);
        var n = time;
        var n1 = n.split('_');
        var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
        var timeSlotVar = TimeBlock.find({
            time_slot: {
                $gte: time
            }
        }).fetch();
        var availableTimeSlot = timeSlotVar[0].time_slot;
        if (Template.instance().startTimeVar.get() < availableTimeSlot) {
            swal('Your time exceeded, Please try again !');
            document.location.reload(true);
        } else {
            var arr = [];
            var jsonArr = [];
            var totalMwh = 0;
            var mainArrayWithLoss = [];
            var totalMwhWithLoss = 0;
            var stuLossVar = instance.lossAppliedOnSPDForRealTimeByAdmin.get();
            var lossPercentVar = Number(stuLossVar) / 100;

            var compareData = Template.instance().bidSubmitRealTime.get();

            if (loggedInUserState('Other', spdState)) {
                var i = 0;
                var availabilityArr = [];
                $('.availabilityRealTime').each(function() {
                  var availability = $(this).val();
                  if (availability.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                      swal("Oops...", "Availability must be a number!", "error");
                      $('#RealTimeBtnSubmit').show();
                      throw new Error("Use only digits!");
                  }
                  if (availability != '' || availability != undefined) {
                      let availability = availability;
                  } else {
                      let availability = '0.00';
                  }
                  availabilityArr.push(availability);
                });
                $('.numberOfBidRealTime').each(function() {
                    var compareVar = (Number(compareData[i].bidMwh));
                    var percentageVar = (Number((compareVar * 2) / 100));
                    var compareIncreasedVar = compareVar + percentageVar;
                    var compareDecreasedVar = compareVar - percentageVar;
                    var bidTimeSlot = $(this).attr('slot');
                    var availability = Number(availabilityArr[i]).toFixed(2);
                    var bid = Number($(this).val());

                    var checkSlots = $(this).val();
                    if (checkSlots.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                        swal("Oops...", "Enter only digits!", "error");
                        $('#RealTimeBtnSubmit').show();
                        throw new Error("Use only digits!");
                    }
                    var bid = $(this).val();
                    var bidWithLoss = 0;
                    if (bid != '') {
                        var bid = $(this).val();
                        var calculation = Number(bid) * Number(lossPercentVar);
                        bidWithLoss = Number(bid) - Number(calculation);
                    } else {
                        var bid = '0.00';
                        bidWithLoss = '0.00';
                    }
                    var spdCapacity = spdTotalCapacity;
                    if (Number(bid) > Number(spdCapacity)) {
                        swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                        $('#RealTimeBtnSubmit').show();
                        throw new Error("Schedule can't be greater than project capacity!");
                    }
                    if (bid >= compareIncreasedVar.toFixed(2) || bid <= compareDecreasedVar.toFixed(2)) {
                        var jsonUpdate = {
                            'time_slot': bidTimeSlot,
                            'availability': availability,
                            'bidMwh': Number(bid).toFixed(2)
                        };
                        arr.push(jsonUpdate);

                        var jsonUpdateWithLoss = {
                            'time_slot': bidTimeSlot,
                            'availability': availability,
                            'bidMwh': Number(bidWithLoss).toFixed(2)
                        };
                        mainArrayWithLoss.push(jsonUpdateWithLoss);

                    } else {
                        swal("Oops...", "Revision must be minimum 2%, grater/less than of current schedule!", "error");
                        $('#RealTimeBtnSubmit').show();
                        throw new Error("Minimum difference 2%!");
                    }
                    i++;
                });
            } else {
              var i = 0;
                $('.numberOfBidRealTime').each(function() {
                  var compareVar = (Number(compareData[i].bidMwh));
                  var percentageVar = (Number((compareVar * 2) / 100));
                  var compareIncreasedVar = compareVar + percentageVar;
                  var compareDecreasedVar = compareVar - percentageVar;

                    var bidTimeSlot = $(this).attr('slot');
                    var bid = Number($(this).val());

                    var checkSlots = $(this).val();
                    if (checkSlots.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                        swal("Oops...", "Enter only digits!", "error");
                        $('#RealTimeBtnSubmit').show();
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
                    var spdCapacity = spdTotalCapacity;
                    if (Number(bid) > Number(spdCapacity)) {
                        swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                        $('#RealTimeBtnSubmit').show();
                        throw new Error("Schedule can't be greater than project capacity!");
                    }
                    if (spdState == 'Rajasthan') {
                      if (bid >= compareIncreasedVar.toFixed(2) || bid <= compareDecreasedVar.toFixed(2)) {
                          var jsonUpdate = {
                              'time_slot': bidTimeSlot,
                              'bidMwh': Number(bid).toFixed(2)
                          };
                          arr.push(jsonUpdate);

                          var jsonUpdateWithLoss = {
                              'time_slot': bidTimeSlot,
                              'bidMwh': Number(bidWithLoss).toFixed(2)
                          };
                          mainArrayWithLoss.push(jsonUpdateWithLoss);

                      } else {
                          swal("Oops...", "Revision must be minimum 2%, grater/less than of current schedule!", "error");
                          $('#RealTimeBtnSubmit').show();
                          throw new Error("Minimum difference 2%!");
                      }
                    }else {
                      var jsonUpdate = {
                          'time_slot': bidTimeSlot,
                          'bidMwh': Number(bid).toFixed(2)
                      };
                      arr.push(jsonUpdate);

                      var jsonUpdateWithLoss = {
                          'time_slot': bidTimeSlot,
                          'bidMwh': Number(bidWithLoss).toFixed(2)
                      };
                      mainArrayWithLoss.push(jsonUpdateWithLoss);
                    }
                    i++;
                });
            }
            var startTimeSlot = $('#ddlStartTime').val();
            var endTimeSlot = $('#ddlEndTime').val();
            swal({
                title: "Are you sure?",
                text: "You want to submit revisions for " + spdName,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, submit it!",
                closeOnConfirm: false
            }, function(isConfirm) {
                if (isConfirm) {
                    swal("Submitted!", "Revision for " + spdName + " has been submitted.", "success");
                    Meteor.call("updateRealTimeRevisionByAdmin", todayDate, arr, blockedTimeSlotForMP, startTimeSlot, endTimeSlot, spdid, mainArrayWithLoss, function(error, result) {
                        if (error) {
                            swal("Oops...", "Please try again!", "error");
                            $('#RealTimeBtnSubmit').show();
                        } else {
                            // swal("Submitted!", "Your revision has been submitted.", "success");
                            if (result.status) {
                                $('#RealTimeBtnSubmit').show();
                                instance.endTimeVar.set('');
                                instance.radioBtnSelectionRealTime.set('');
                                instance.RealTimeBidSubmitClickVar.set(false);
                                instance.RealTimeBidViewClickedVar.set(false);
                            }
                        }
                    });
                } else {
                    $('#RealTimeBtnSubmit').show();
                }
            });
        }
    }
})

Template.adminScheduleStatus.helpers({
    isMPStateSPSSelectedForScheduleSubmission(){
      var spdState = Template.instance().selectedStateOfSPDForRev.get();
      if (loggedInUserState('Other', spdState)) {
        return true;
      }else {
        return false;
      }
    },
    "getValues": function(value) {
        keys = Object.keys(value);
        var values = [];
        keys.forEach(function(v) {
            values.push(value[v]);
        });
        return values;
    },
    "getTableHeadings": function(value) {
      var spdState = Template.instance().selectedStateOfSPDForRev.get();
      if (loggedInUserState('Other',spdState)) {
        keys = Object.keys(value[0]);
        var values = [];
        var len = keys.length;
        values.push("Sr. No.");
        values.push("Date");
        values.push("Time Slot");
        for (i = 0; i < Number(len - 3)/2; i++) {
            values.push("Availability");
            values.push("R" + i);
        }
        return values;
      }else {
        keys = Object.keys(value[0]);
        var values = [];
        var len = keys.length;
        values.push("Sr. No.");
        values.push("Date");
        values.push("Time Slot");
        for (i = 0; i < len - 3; i++) {
            values.push("R" + i);
        }
        return values;
      }
    },
    "isRealTimeViewBtnClicked": function() {
        if (Template.instance().realTimeData.get()) {
            return Template.instance().realTimeData.get();
        } else {
            return false;
        }
    },
    "isRealTimeViewBtnClickedToViewRev": function() {
        if (Template.instance().realTimeData.get()) {
            return true;
        } else {
            return false;
        }
    },
    "isRealTimeTotalMwhView": function() {
        if (Template.instance().viewrealTimeData.get()) {
            return Template.instance().viewrealTimeData.get();
        } else {
            return false;
        }
    },
    "isRealTimeTotalMwhViewLengthForColspan": function() {
        if (Template.instance().viewrealTimeData.get()) {
          var colspan = Template.instance().viewrealTimeData.get().length;
            var lengthVar = (Number(colspan)*2)+3;
            return lengthVar;
        } else {
            return false;
        }
    },
    "isRealTimeTotalSPDName": function() {
        if (Template.instance().viewrealTimeData.get()) {
            var spdName = $("#selectUserSpd").find(':selected').attr("attrName");
            return spdName;
        } else {
            return false;
        }
    },
    'isRealTimeViewScheduleClicked': function() {
        if (Template.instance().RealTimeBidViewClickedVar.get()) {
            return true;
        } else {
            return false;
        }
    },
    "radioSpd": function() {
        if (Template.instance().radio.get()) {
            return true;
        } else {
            return false;
        }
    },
    "radioSpdForViewAndSchedule": function() {
        if (Template.instance().radio.get() == 'viewSchedule') {
            return true;
        } else {
            return false;
        }
    },
    "radioSpdForScheduleSubmission": function() {
        if (Template.instance().radio.get() == 'scheduleSubmission') {
            return true;
        } else {
            return false;
        }
    },
    "radioSpdForRealTimeRevisions": function() {
        if (Template.instance().radio.get() == 'realTimeRevision' && Template.instance().spdSelectedVar.get() == true) {
            return true;
        } else {
            return false;
        }
    },
    "data": function() {
        if (Template.instance().spdSelectedVar.get()) {
            return true;
        } else {
            return false;
        }
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
    "viewdata": function() {
        return SessionStore.get("scheduleSubmission_schedule");
    },
    "submittedScheduling": function() {
        if (SessionStore.get("scheduleSubmission_showDates") != '' && SessionStore.get("scheduleSubmission_schedule") != false) {
            return true;
        } else {
            return false;
        }
    },
    "dataShow": function() {
        return Template.instance().scheduleDates.get();
    },
    "returnJson": function() {
        return Template.instance().userList.get();
    },
    serial(index) {
        return index + 1;
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
    "dates": function() {
        if (SessionStore.get("scheduleSubmission_requiredDates")) {
            return SessionStore.get("scheduleSubmission_requiredDates");
        } else {
            return false;
        }
    },
    "viewDates": function() {
        if (SessionStore.get("scheduleSubmission_requiredDates")) {
            return true;
        } else {
            return false;
        }
    },
    "isSelected": function(match, type) {
        var spdid = $('#selectUserSpd').val();
        Meteor.subscribe('ScheduleSubmitDetails', match, spdid);
        var details = ScheduleSubmission.find({'clientId': spdid, 'date': match}).fetch();
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
    "isSameAsChecked": function() {
        if (Template.instance().sameasDateVar.get() == "sameas") {
            return Template.instance().sameasDateVar.get();
        } else {
            return "disabled";
        }
    },
    "isRadioBtnDayAheadSlected": function() {
        var checkdata = Template.instance().radioBtnSelectionDayAhead.get();
        if (checkdata == 'day_ahead_revision') {
            return true;
        } else {
            return false;
        }
    },
    "viewDataOnlyForTableShow": function() {
        if (Template.instance().viewData.get()) {
            return true;
        } else {
            return false;
        }
    },
    "viewDataRevision": function() {
        if (Template.instance().viewDataRevision.get() !== '') {
            return Template.instance().viewDataRevision.get();
        } else {
            return false;
        }
    },
    "showForRajasthanOnly": function() {
        var instance = Template.instance();
        if (instance.selectedStateOfSPDForRev.get() == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    "btnBidSubmitClicked": function() {
        if (Template.instance().btnBidSubmitClick.get()) {
            return true;
        } else {
            return false;
        }
    },
    "isRevisionBidSubmited": function() {
        if (Template.instance().bidSubmitVar.get()) {
            return Template.instance().bidSubmitVar.get();
        } else {
            return false;
        }
    },
    "DayAheadViewData": function() {
        var data = Template.instance().viewDataDayAhead.get();
        if (data != '') {
            return data.jsonData;
        } else {
            return false;
        }
    },
    "DayAheadDateHelper": function() {
        var data = Template.instance().viewDataDayAhead.get();
        if (data != '') {
            return data;
        } else {
            return false;
        }
    },
    "isViewBtnClicked": function() {
        if (Template.instance().viewDataDayAhead.get()) {
            return true;
        } else {
            return false;
        }
    },
    "isStartTimeSelected": function() {
        var currentDate = new Date();
        if (Template.instance().selectedStateOfSPDForRev.get() == 'Rajasthan') {
          currentDate.setTime(currentDate.getTime() + 60 * 60 * 1000);
        }else {
          currentDate.setTime(currentDate.getTime() + 120 * 60 * 1000);
        }
        var hrs = currentDate.getHours();
        var min = currentDate.getMinutes();
        var time = (hrs + ":" + min);
        var n = time;
        var n1 = n.split('_');
        var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
        if (time > '23:45' || time < '02:15') {
            return false;
        } else {
            var timeSlotVar = TimeBlock.find({
                time_slot: {
                    $gte: time,
                    $lt: '24:00'
                }
            }).fetch();
            return timeSlotVar;
        }
    },
    "isEndTimeSelected": function() {
        var startTimeVar = Template.instance().startTimeVar.get();
        if (startTimeVar != '') {
            var timeSlotVar = TimeBlock.find({
                time_slot: {
                    $gt: startTimeVar
                }
            }).fetch();
            return timeSlotVar;
        } else {
            return false;
        }

    },
    "isEndTimeSelectedRealTime": function() {
        if (Template.instance().endTimeVar.get()) {
            return true;
        } else {
            return false;
        }
    },
    "RealTimeSlectedPassCurentDate": function() {
        if (Template.instance().radioBtnSelectionRealTime.get() == 'real_time_devision') {
            var todayDate = new Date();
            var toDate = moment(todayDate).format('DD-MM-YYYY');
            return toDate;
        } else {
            return false;
        }
    },
    "btnBidSubmitClickedRealTime": function() {
        if (Template.instance().RealTimeBidSubmitClickVar.get()) {
            return true;
        } else {
            return false;
        }
    },
    "forExcelUsesRealTimeDataData": function() {
        if (Template.instance().realTimeUsedForExcel.get() !== '') {
            return true;
        } else {
            return false;
        }
    },
    "isRealTimeBidSubmitedForExcel": function() {
        if (Template.instance().realTimeUsedForExcel.get() !== '') {
            return Template.instance().realTimeUsedForExcel.get();
        } else {
            return false;
        }
    },
    "isRealTimeBidSubmited": function() {
        if (Template.instance().bidSubmitRealTime.get() !== '') {
            return Template.instance().bidSubmitRealTime.get();
        } else {
            return false;
        }
    },
    "isRadioBtnRealTimeSlected": function() {
        if (Template.instance().radioBtnSelectionRealTime.get() == 'real_time_devision') {
            return true;
        } else {
            return false;
        }
    }
})

var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        }
    return function(table, name, data, selectedDateVar) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = data + '_' + selectedDateVar + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

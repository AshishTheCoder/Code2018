import {ReactiveVar} from 'meteor/reactive-var';

Template.revisions.onCreated(function abcd() {
    this.radioBtnSelectionDayAhead = new ReactiveVar('');
    this.radioBtnSelectionRealTime = new ReactiveVar('');
    this.startTimeVar = new ReactiveVar('');
    this.endTimeVar = new ReactiveVar('');
    this.viewDataRevision = new ReactiveVar('');
    this.bidSubmitVar = new ReactiveVar('');
    this.AvailabilityForMP = new ReactiveVar;
    this.ForecastForMP = new ReactiveVar;
    this.bidSubmitRealTime = new ReactiveVar('');
    this.realTimeUsedForExcel = new ReactiveVar('');
    this.selectedDate = new ReactiveVar('');
    this.viewDataDayAhead = new ReactiveVar('');
    this.lossAppliedOnSPDForDayAhead = new ReactiveVar('');
    this.lossAppliedOnSPDForRealTime = new ReactiveVar('');
    this.viewDataRealTime = new ReactiveVar('');
    this.addScheduleVar = new ReactiveVar(0);
    this.addScheduleAfterLossDayAhead = new ReactiveVar(0);
    this.addScheduleAfterLossRealTime = new ReactiveVar(0);
    this.viewData = new ReactiveVar(false);
    this.btnBidSubmitClick = new ReactiveVar(false);
    this.RealTimeBidViewClickedVar = new ReactiveVar(false);
    this.RealTimeBidSubmitClickVar = new ReactiveVar(false);
    this.realTimeData = new ReactiveVar([]);
    this.viewrealTimeData = new ReactiveVar();
});

/////******* REMANING DATE VALIDATION IN DAY AHEAD REVISION *******/////
Template.revisions.rendered = function() {};

Template.revisions.events({
    //****************Day Ahead Events****************//
    "click #radioDayAhead": function(e, instance) {
        var dayAheadVar = $('#radioDayAhead').val();
        instance.viewData.set('');
        instance.btnBidSubmitClick.set(false);
        instance.viewDataDayAhead.set('');
        instance.radioBtnSelectionRealTime.set('');
        instance.endTimeVar.set('');
        instance.realTimeData.set('');
        instance.RealTimeBidViewClickedVar.set(false);
        instance.bidSubmitRealTime.set('');
        instance.RealTimeBidSubmitClickVar.set(false);
        instance.radioBtnSelectionDayAhead.set(dayAheadVar);
    },
    "focus #fromdate": function() {
        $('#fromdate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', numberOfMonths: 1, autoclose: true});
    },
    "focus #todate": function() {
        $('#todate').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', numberOfMonths: 1, autoclose: true});
    },
    ////////////////////////////////Day Ahead Submit Button//////////////////////////////
    'click #btnSubmitDayAheadDetail': function(e, instance) {
        var fromdate = $('#fromdate').val();
        var todate = $('#todate').val();
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
            var q = 1;
            var returnData = [];
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
            // when Rajasthan Day Ahead Revision starts from 10:30 , comment this for loop and uncoment below if else condition

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
            Meteor.call('dayAheadDateListRevision', timeDifferenceInDays, fromDate, function(error, result) {
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
            });

            // if (time > '10:30' && Meteor.user().profile.registration_form.spd_state == 'Rajasthan') {
            //     if (fromdate > todayDate) {
            //         fromDate.setDate(fromDate.getDate());
            //     } else {
            //         fromDate.setDate(fromDate.getDate() + 1);
            //     }
            //     var looptime = timeDifferenceInDays - 1;
            //     var userIds = Meteor.userId();
            //     for (var i = 0; i <= looptime; i++) {
            //         fromDate.setDate(fromDate.getDate() + 1);
            //         var date = moment(fromDate).format('DD-MM-YYYY');
            //         var json = ScheduleSubmission.find({
            //             clientId: userIds,
            //             date: date
            //         }).fetch();
            //         if (json.length > 0) {
            //             returnData.push({
            //                 sn: q,
            //                 date: moment(fromDate).format('DD-MM-YYYY')
            //             });
            //             q++;
            //         }
            //     }
            // } else {
            //     var userIds = Meteor.userId();
            //     for (var i = 0; i <= timeDifferenceInDays; i++) {
            //         fromDate.setDate(fromDate.getDate() + 1);
            //         var date = moment(fromDate).format('DD-MM-YYYY');
            //         var json = ScheduleSubmission.find({
            //             clientId: userIds,
            //             date: date
            //         }).fetch();
            //         if (json.length > 0) {
            //             returnData.push({
            //                 sn: q,
            //                 date: moment(fromDate).format('DD-MM-YYYY')
            //             });
            //             q++;
            //         }
            //     }
            // }
            // Template.instance().viewData.set(true);
            // instance.viewDataRevision.set(returnData);
        } else {
            swal('All fields are required');
        }
    },
    ////////////////////////////////Day Ahead Edit Button//////////////////////////////
    'click .btnEditBidDayAhead': function(e, instance) {
        $('#BtnFinalSubmitDayAhead').show();
        var bidSelectedDateVar = $(e.currentTarget).attr('getDate');
        // if (Meteor.user().profile.registration_form.spd_state == 'Gujarat' || Meteor.user().profile.registration_form.spd_state == 'MP') {
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
        const handle = Meteor.subscribe('ScheduleSubmitDetails', bidSelectedDateVar, Meteor.userId());
        Tracker.autorun(() => {
          const isReady = handle.ready();
          if (isReady) {
            var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: bidSelectedDateVar}).fetch();
            //Real Time Edit Code
            var newArr = [];
            if (view.length > 0) {
                var jsonLength = view[0].json.length;
                view[0].json[jsonLength - 1].data.forEach(function(item) {
                  if (Meteor.user().profile.registration_form.spd_state == 'MP') {
                    newArr.push({date: bidSelectedDateVar, mySlot: item.time_slot,availability:item.availability, bidMwh: item.bidMwh});
                  }else {
                    newArr.push({date: bidSelectedDateVar, mySlot: item.time_slot, bidMwh: item.bidMwh});
                  }
                });
            }
            instance.bidSubmitVar.set(newArr);
            instance.btnBidSubmitClick.set(true);
            instance.viewDataDayAhead.set('');
            //getting STU Lossess for SPD
            SessionStore.set("isLoading", true);
            Meteor.call("gettingLossForSPD", bidSelectedDateVar, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.lossAppliedOnSPDForDayAhead.set(result.data);
                    }
                }
            });
          }
        });
    },
    // for excel sheets copy and paste
    "input .availability": function(evt, instance) {
        var selectedDate = instance.selectedDate.get();
        var dataArr = $('.availability').val();
        var availabilityArr = dataArr.split(' ');
        var newArr = [];
        if (instance.ForecastForMP.get()) {
          let forcastArr = instance.ForecastForMP.get();
          if (availabilityArr.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var n = 0;
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
                      bidMwh: forcastArr[s].bidMwh,
                  });
                  s++;
              };
              instance.bidSubmitVar.set(newArr);
          }
        }else {
          if (availabilityArr.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var n = 0;
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
                      availability: availabilityArr[s]
                  });
                  s++;
              };
              instance.bidSubmitVar.set(newArr);
              instance.AvailabilityForMP.set(newArr);
          }
        }
    },
    // for excel sheets copy and paste
    "input .numberOfBid": function(evt, instance) {
        var selectedDate = instance.selectedDate.get();
        var dataArr = $('.numberOfBid').val();
        var ddd = dataArr.split(' ');
        var newArr = [];
        if (instance.AvailabilityForMP.get()) {
          let availabilityArr = instance.AvailabilityForMP.get();
          if (ddd.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var n = 0;
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
              instance.ForecastForMP.set(newArr);
          }
        }else {
          if (ddd.length > 0) {
              var timeSlot = TimeBlock.find().fetch();
              var newArr = [];
              var n = 0;
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
          }
        }
    },
    ////////////////////////////////Day Ahead Final Submit Button//////////////////////////
    'click #BtnFinalSubmitDayAhead': function(e, instance) {
        $('#BtnFinalSubmitDayAhead').hide();
        var arr = [];
        var totalMwh = 0;
        var mainArrayWithLoss = [];
        var totalMwhWithLoss = 0;
        var stuLossVar = instance.lossAppliedOnSPDForDayAhead.get();
        var lossPercentVar = Number(stuLossVar) / 100;


        if (Meteor.user().profile.registration_form.spd_state == 'MP') {
          let availabilityArr = [];
          $('.availability').each(function() {
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
          $('.numberOfBid').each(function() {
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
              var spdCapacity = Meteor.user().profile.registration_form.project_capicity;
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

              Template.instance().addScheduleAfterLossDayAhead.set(Number(bidWithLoss).toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(Template.instance().addScheduleAfterLossDayAhead.get()));
              Template.instance().addScheduleAfterLossDayAhead.set(totalMwhWithLoss);
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
          $('.numberOfBid').each(function() {
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
              var spdCapacity = Meteor.user().profile.registration_form.project_capicity;
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

              Template.instance().addScheduleAfterLossDayAhead.set(Number(bidWithLoss).toFixed(2));
              totalMwhWithLoss = (Number(totalMwhWithLoss) + Number(Template.instance().addScheduleAfterLossDayAhead.get()));
              Template.instance().addScheduleAfterLossDayAhead.set(totalMwhWithLoss);
              var jsonWithLoss = {
                  'time_slot': bidTimeSlot,
                  'bidMwh': Number(bidWithLoss).toFixed(2)
              };
              mainArrayWithLoss.push(jsonWithLoss);
          });
        }

        var totalMWhVar = Number(Template.instance().addScheduleVar.get());
        var totalMwhDevision = Number(totalMWhVar / 4000).toFixed(7);

        var totalMWhVarWithLoss = Number(Template.instance().addScheduleAfterLossDayAhead.get());
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
        if (Meteor.user().profile.registration_form.spd_state == 'MP') {
          var totalAvaibilityDevision = Number(totalAvaibility / 4000).toFixed(7);
          jsonData.totalAvaibility = Number(totalAvaibilityDevision).toFixed(2);
          jsonDataWithLoss.totalAvaibility = Number(totalAvaibilityDevision).toFixed(2);
        }

        swal({
            title: "Are you sure?",
            text: "You want to update schedule!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, update it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                swal("Updated!", "Your schedule has been updated.", "success");
                instance.btnBidSubmitClick.set(false);
                Meteor.call("updateDayAheadRevision", instance.selectedDate.get(), jsonData, jsonDataWithLoss, function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again!", "error");
                        $('#BtnFinalSubmitDayAhead').show();
                    } else {
                        // swal("Updated!", "Your schedule has been updated.", "success");
                        if (result.status) {
                            $('#BtnFinalSubmitDayAhead').show();
                        }
                    }
                });
            } else {
                $('#BtnFinalSubmitDayAhead').show();
            }
        });
    },
    ////////////////////////////////Day Ahead View Button//////////////////////////////
    "click .btnViewScheduleDayAhead": function(e, instance) {
        var dateVar = $(e.currentTarget).attr('getDate');
        const handle = Meteor.subscribe('ScheduleSubmitDetails', dateVar, Meteor.userId());
        Tracker.autorun(() => {
          const isReady = handle.ready();
          if (isReady) {
            var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: dateVar}).fetch();
            if (view.length > 0) {
                var JsonLength = view[0].json.length;
                var jsonData = view[0].json[JsonLength - 1].data;
                var totalAvaibility = view[0].json[JsonLength - 1].totalAvaibility;
                var totalMwh = view[0].json[JsonLength - 1].totalMwh;
                var jsonVar = {
                    date: dateVar,
                    jsonData: jsonData,
                    totalAvaibility:totalAvaibility,
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
        instance.AvailabilityForMP.set();
        instance.ForecastForMP.set();
        instance.startTimeVar.set('');
        instance.radioBtnSelectionDayAhead.set('');
        instance.realTimeData.set('');
        instance.RealTimeBidViewClickedVar.set(false);
        instance.bidSubmitRealTime.set('');
        instance.RealTimeBidSubmitClickVar.set(false);
        var realTimeVar = $('#radioRealTime').val();
        var todayDate = new Date();
        var toDate = moment(todayDate).format('DD-MM-YYYY');
        const handle = Meteor.subscribe('ScheduleSubmitDetails', toDate, Meteor.userId());

        Tracker.autorun(() => {
          const isReady = handle.ready();
          if (isReady) {
            var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: toDate}).fetch();
            // condition using for validate revision one after 6 time block revised
            var userStateVAr = Meteor.user().profile.registration_form.spd_state;
            if (userStateVAr == 'MP' || userStateVAr == 'Rajasthan') {
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
                          if (userStateVAr == 'MP') {
                            swal('You are restricted as per MP SLDC regulations and SECI processing time, till ' + validationTime);
                            throw new Error("You are restricted!");
                          }else if (userStateVAr == 'Rajasthan') {
                            swal('You are restricted as per RAJASTHAN SLDC regulations and SECI processing time, till ' + validationTime);
                            throw new Error("You are restricted!");
                          }
                        }
                    }
                }
            }
            if (view.length > 0 && userStateVAr == 'MP') {
                instance.radioBtnSelectionDayAhead.set('');
                instance.radioBtnSelectionRealTime.set(realTimeVar);
            } else if (view.length > 0 && userStateVAr != 'MP') {
                instance.radioBtnSelectionDayAhead.set('');
                instance.radioBtnSelectionRealTime.set(realTimeVar);
            } else {
                instance.radioBtnSelectionDayAhead.set('');
                swal('Schedule not submitted!');
            }
          }
        });
    },
    "change #ddlStartTime": function(e, instance) {
        $('#ddlEndTime').val('');
        instance.endTimeVar.set('');
        instance.realTimeData.set('');
        instance.RealTimeBidViewClickedVar.set(false);
        var startTimeVar = $(e.currentTarget).val();
        instance.startTimeVar.set(startTimeVar);
        instance.RealTimeBidSubmitClickVar.set(false);
        instance.RealTimeBidViewClickedVar.set(false);
    },
    "change #ddlEndTime": function(e, instance) {
        var endTimeVar = $(e.currentTarget).val();
        instance.endTimeVar.set(endTimeVar);
        instance.realTimeData.set('');
        instance.RealTimeBidViewClickedVar.set(false);
        instance.RealTimeBidSubmitClickVar.set(false);
        instance.RealTimeBidViewClickedVar.set(false);
    },
    'click .btnRealTimeSubmitBid': function(e, instance) {
        $('#RealTimeBtnSubmit').show();
        instance.realTimeUsedForExcel.set('');
        instance.AvailabilityForMP.set();
        instance.ForecastForMP.set();
        var bidSelectedDateVar = $(e.currentTarget).attr('getDate');
        instance.viewDataDayAhead.set(bidSelectedDateVar);
        var startTime = instance.startTimeVar.get();
        var endTime = instance.endTimeVar.get();
        var returnData = [];
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

            var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: bidSelectedDateVar}).fetch();

            var arrIdex = (Number(view[0].json.length) - 1);
            var timeData = '';
            var bidData = '';
            var availability = '';
            if (Meteor.user().profile.registration_form.spd_state == 'MP') {
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
        //getting STU Lossess for SPD
        SessionStore.set("isLoading", true);
        Meteor.call("gettingLossForSPD", bidSelectedDateVar, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try again !");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.lossAppliedOnSPDForRealTime.set(result.data);
                }
            }
        });
    },
    "input .availability": function(evt, instance) {
        var selectedDate = instance.selectedDate.get();
        var dataArr = $('.availability').val();
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

                  var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: bidSelectedDateVar}).fetch();

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

                  var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: bidSelectedDateVar}).fetch();

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

                  var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: bidSelectedDateVar}).fetch();

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

                  var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: bidSelectedDateVar}).fetch();

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
        if (Meteor.user().profile.registration_form.spd_state == 'Rajasthan') {
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
            swal('Your time exceeded, Please try again!');
            document.location.reload(true);
        } else {
            var arr = [];
            var totalMwh = 0;
            var mainArrayWithLoss = [];
            var totalMwhWithLoss = 0;
            var stuLossVar = instance.lossAppliedOnSPDForRealTime.get();
            var lossPercentVar = Number(stuLossVar) / 100;
            var compareData = Template.instance().bidSubmitRealTime.get();


            if (loggedInUserState('SPD')) {
                var i = 0;
                var availabilityArr = [];
                $('.availability').each(function() {
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
                        var calculation = Number(bid) * Number(lossPercentVar)
                        bidWithLoss = Number(bid) - Number(calculation);
                    } else {
                        var bid = '0.00';
                        bidWithLoss = '0.00';
                    }
                    var spdCapacity = Meteor.user().profile.registration_form.project_capicity;
                    if (Number(bid) > Number(spdCapacity)) {
                        swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                        $('#RealTimeBtnSubmit').show();
                        throw new Error("Schedule can't be greater than project capacity!");
                    }
                    // console.log(compareDecreasedVar.toFixed(2)+'--///--'+bid +'--///--'+ compareVar+'--///--'+compareIncreasedVar.toFixed(2));
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
                var spdCapacity = Meteor.user().profile.registration_form.project_capicity;
                if (Number(bid) > Number(spdCapacity)) {
                    swal("Oops...", "Schedule can't be greater than project capacity!", "error");
                    $('#RealTimeBtnSubmit').show();
                    throw new Error("Schedule can't be greater than project capacity!");
                }

                // 2% difference is currently using for Rajasthan and MP and below case is used for Rajasthan only
                var spdStateVar = Meteor.user().profile.registration_form.spd_state;
                if (spdStateVar == 'Rajasthan') {
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
                text: "You want to submit revisions!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, submit it!",
                closeOnConfirm: false
            }, function(isConfirm) {
                if (isConfirm) {
                    swal("Submitted!", "Your revision has been submitted.", "success");
                    Meteor.call("updateRealTimeRevision", todayDate, arr, blockedTimeSlotForMP, startTimeSlot, endTimeSlot, mainArrayWithLoss, function(error, result) {
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
                            }else {
                              swal("Oops...",result.message, "error");
                            }
                        }
                    });
                } else {
                    $('#RealTimeBtnSubmit').show();
                }
            });
        }
    },
    "click .btnViewScheduleRealTime": function(e, instance) {
        var dateVar = $(e.currentTarget).attr('getDate');
        Meteor.call("getRealTimeData", dateVar, function(error, result) {
            if (error) {
                swal("Error : " + error);
            } else {
                instance.realTimeData.set(result.data);
                instance.RealTimeBidSubmitClickVar.set(false);
                instance.RealTimeBidViewClickedVar.set(true);
            }
        });
        Meteor.call("getRealTimeTotalMWHData", dateVar, function(error, result) {
            if (error) {
                // swal("Error : " + error);
            } else {
                instance.viewrealTimeData.set(result.data);
            }
        });
    }
});
Template.revisions.helpers({
    //*********************************************Day Ahead Helper*******************//
    isMPStateSPSSelectedForScheduleSubmission(){
      if (loggedInUserState('SPD')) {
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
        keys = Object.keys(value[0]);
        var values = [];
        var len = keys.length;
        values.push("Date");
        values.push("Time Slot");
        for (i = 0; i < len - 2; i++) {
            values.push("R" + i);
        }
        return values;
    },
    "getTableHeadingsForMP": function(value) {
        keys = Object.keys(value[0]);
        var values = [];
        var len = keys.length;
        values.push("Date");
        values.push("Time Slot");
        for (i = 0; i < Number(len - 2)/2; i++) {
            values.push("Availability");
            values.push("R" + i);
        }
        return values;
    },
    "isRadioBtnDayAheadSlected": function() {
        if (Template.instance().radioBtnSelectionDayAhead.get() == 'day_ahead_revision') {
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
        if (Template.instance().viewDataRevision.get()) {
            return Template.instance().viewDataRevision.get();
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
        if (Template.instance().viewDataDayAhead.get()) {
            return Template.instance().viewDataDayAhead.get();
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
    //**********************************************Real Time Revision****************//
    "isRadioBtnRealTimeSlected": function() {
        var checkdata = Template.instance().radioBtnSelectionRealTime.get();
        if (checkdata == 'real_time_devision') {
            return true;
        } else {
            return false;
        }
    },
    "isStartTimeSelected": function() {
        var currentDate = new Date();
        if (Meteor.user().profile.registration_form.spd_state == 'Rajasthan') {
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
    "RealTimeSlectedPassCurentDate": function() {
        var checkdata = Template.instance().radioBtnSelectionRealTime.get();
        if (checkdata == 'real_time_devision') {
            var todayDate = new Date();
            var toDate = moment(todayDate).format('DD-MM-YYYY');
            return toDate;
        } else {
            return false;
        }
    },
    "isStartTimeSelectedRealTime": function() {
        if (Template.instance().startTimeVar.get()) {
            return true;
        } else {
            return false;
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
    "btnBidSubmitClickedRealTime": function() {
        if (Template.instance().RealTimeBidSubmitClickVar.get()) {
            return true;
        } else {
            return false;
        }
    },
    "isRealTimeBidSubmited": function() {
        if (Template.instance().bidSubmitRealTime.get()) {
            return Template.instance().bidSubmitRealTime.get();
        } else {
            return false;
        }
    },
    "forExcelUsesRealTimeDataData": function() {
        if (Template.instance().realTimeUsedForExcel.get()) {
            return true;
        } else {
            return false;
        }
    },
    "isRealTimeBidSubmitedForExcel": function() {
        if (Template.instance().realTimeUsedForExcel.get()) {
            return Template.instance().realTimeUsedForExcel.get();
        } else {
            return false;
        }
    },
    "isRealTimeViewBtnClicked": function() {
        if (Template.instance().realTimeData.get()) {
            return Template.instance().realTimeData.get();
        }
    },
    "isRealTimeTotalMwhView": function() {
        if (Template.instance().viewrealTimeData.get()) {
            return Template.instance().viewrealTimeData.get();
        }
    },
    "bidMwhTotalAdditionRealTime": function() {
        if (Template.instance().viewDataRealTime.get()) {
            var viewDate = Template.instance().viewDataRealTime.get();
            var data = ScheduleSubmission.find({client_id: Meteor.userId(), date: viewDate}).fetch();
            return data[0].totalMwh;
        } else {
            return '0.00';
        }
    },
    "isViewBtnClickedRealTime": function() {
        if (Template.instance().viewDataRealTime.get()) {
            return true;
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
    "showForRajasthanOnly": function() {
        if (Meteor.user().profile.registration_form.spd_state == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    serial(index) {
        return index + 1;
    }
});

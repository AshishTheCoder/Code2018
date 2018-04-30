Meteor.methods({
  // sdfawsefesdfSDF(){
  //   var subject="[CORRECTION] Link Down of SECI POWER TRADING";
  //   var message="Dear Sir/Ma'am,<br><br>We regret to inform you that due to technical issue the existing URL: http://secipowertrading.com is down, you can access the website from new URL: http://seci.cybuzz.sc <br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
  //
  //   var array = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved'}).fetch();
  //   console.log('Length = '+array.length);
  //   Meteor.setTimeout(function() {
  //     for (var i = 0; i < array.length; i++) {
  //
  //         var daaa = array[i].username;
  //         console.log("Count = "+i+" /"+array[i].username);
  //         Meteor.call("sendMandrillEmail", array[i].username, subject, message);
  //     }
  //   }, 10000);
  // },

    "callByRadioValue": function() {
        var json = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved', 'profile.registration_form.transaction_type': 'Inter'}).fetch();
        var count = 1;
        json.forEach(function(er) {
            er.serialNO = count;
            count++;
        });
        return returnSuccess('Getting SPD list by Admin Schedule Status ', json);
    },
    gettingLossForSPDByAdmin(selectedDateForScheduleSubmission, spdState, spdName) {
        var splitDate = selectedDateForScheduleSubmission.split('-');
        // console.log('selectedDateForScheduleSubmission ='+selectedDateForScheduleSubmission);
        // gettingSTULossDateWiseForAll(selectedDateForScheduleSubmission, spdState);
        var stateSTUvar = StuCharges.find({
            month: splitDate[1],
            year: splitDate[2],
            state: spdState
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        if (stateSTUvar.length > 0) {
            var stuLoss = stateSTUvar[0].stuRate;
        }else{
          var stuLoss = 0;
        }
        console.log('STU loss : ' + stuLoss);
        return returnSuccess('Getting Loss by Admin, for SPD : ' + spdName, stuLoss);
    },
    "callScheduleSubmission": function(spdName, userId, fromDate, toDate) {
        var array = [];
        fromDate = fromDate.split('-');
        toDate = toDate.split('-');
        fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
        toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        date1_unixtime = parseInt(fromDate.getTime() / 1000);
        date2_unixtime = parseInt(toDate.getTime() / 1000);
        var timeDifference = date2_unixtime - date1_unixtime;
        var timeDifferenceInHours = timeDifference / 60 / 60;
        var timeDifferenceInDays = timeDifferenceInHours / 24;
        if (timeDifferenceInDays >= 0) {
            fromDate.setDate(fromDate.getDate());
            for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
                var details = ScheduleSubmission.find({'clientId': userId, 'date': moment(fromDate).format('DD-MM-YYYY')}).fetch();
                fromDate.setDate(fromDate.getDate() + 1);
                if (details.length > 0) {
                    var check = {};
                    var myJson = details[0];
                    check.date = details[0].date;
                    check.id = details[0].clientId;
                    check.spdName = spdName;
                    array.push(check);
                }
                var count = 1;
                array.forEach(function(item) {
                    item.serialNO = count;
                    count++;
                });
            }
            return returnSuccess('Value checked for: ' + spdName, array);
        } else {
            return returnFaliure('Days are in negative');
        }
    },
    'getRealTimeDataFromAdmin': function(dateVar, spd_id, spdState) {
        var mainArr = [];
        //fetching data from ScheduleSubmission
        var ddclass = 'bg-warning';
        var viewData = ScheduleSubmission.find({clientId: spd_id, date: dateVar}).fetch();
        var arr = [];
        var n = 1;
        // finding length of json array
        var loopLength = viewData[0].json.length;
        for (k = 0; k < 96; k++) {
            var json = {};
            //creating json of, date and time_slot
            json['serialNumber'] = {
                "data": n,
                "color": ""
            };
            json['date'] = {
                "data": dateVar,
                "color": ""
            };
            json['time_slot'] = {
                "data": viewData[0].json[0].data[k].time_slot,
                "color": ""
            };
            if (loggedInUserState('Other',spdState)) {
              for (var i = 0; i < loopLength; i++) {
                  if (i > 0) {
                      if (viewData[0].json[i - 1].data[k].bidMwh != viewData[0].json[i].data[k].bidMwh) {
                          json['Availability' + i] = {
                              "data": viewData[0].json[i].data[k].availability,
                              "color": "bg-success",
                              "actuallyColor": ""
                          };
                          json['R' + i] = {
                              "data": viewData[0].json[i].data[k].bidMwh,
                              "color": "bg-success",
                              "actuallyColor": "yellow"
                          };
                      } else {
                          json['Availability' + i] = {
                              "data": viewData[0].json[i].data[k].availability,
                              "color": ""
                          };
                          json['R' + i] = {
                              "data": viewData[0].json[i].data[k].bidMwh,
                              "color": ""
                          };
                      }
                  } else {
                      json['Availability' + i] = {
                        "data": viewData[0].json[i].data[k].availability,
                        "color": ""
                      };
                      json['R' + i] = {
                          "data": viewData[0].json[i].data[k].bidMwh,
                          "color": ""
                      };
                  }
              }
            }else {
              for (var i = 0; i < loopLength; i++) {
                  if (i > 0) {
                      if (viewData[0].json[i - 1].data[k].bidMwh != viewData[0].json[i].data[k].bidMwh) {
                          json['R' + i] = {
                              "data": viewData[0].json[i].data[k].bidMwh,
                              "color": "bg-success",
                              "actuallyColor": "yellow"
                          };
                      } else {
                          json['R' + i] = {
                              "data": viewData[0].json[i].data[k].bidMwh,
                              "color": ""
                          };
                      }
                  } else {
                      json['R' + i] = {
                          "data": viewData[0].json[i].data[k].bidMwh,
                          "color": ""
                      };
                  }
              }
            }
            arr.push(json);
            n++;
        };
        mainArr.push(arr);
        var totalArr = [];
        var loopLength = viewData[0].json.length;
        for (var i = 0; i < loopLength; i++) {
          if (loggedInUserState('Other',spdState)) {
            var jsonData = {
                totalAvaibility: viewData[0].json[i].totalAvaibility,
                totalMwh: viewData[0].json[i].totalMwh
            };
          }else {
            var jsonData = {
                totalMwh: viewData[0].json[i].totalMwh
            };
          }
            totalArr.push(jsonData);
        }
        mainArr.push(totalArr);
        return returnSuccess('View Schedule for: ' + spd_id, mainArr);
    },
    "saveScheduleSubmissionAdminSide": function(date, revision, spdid, revisionWithLoss, stuLossVar) {
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        currentDate.setTime(currentDate.getTime());
        var hrs = currentDate.getHours();
        var min = currentDate.getMinutes();
        var time = (hrs + ":" + min);
        var n = time;
        var n1 = n.split('_');
        var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
        var json = {
            date: date,
            clientId: spdid,
            applied_loss : stuLossVar,
            json: revision,
            jsonWithLoss: revisionWithLoss,
            actual_revision_time: time,
            current_date_timestamp: new Date(),
            schedule_submited_by: Meteor.user().profile.user_type,
            schedule_submited_by_id: Meteor.userId(),
            timestamp: new Date()
        };
        ScheduleSubmission.insert(json);
        // for defaulters list update
        var defaulterData = DefaultersList.find({date: date}).fetch();
        if (defaulterData.length > 0) {
            var defaultersArr = [];
            defaulterData[0].users.forEach(function(item) {
                if (item.id == spdid) {} else {
                    defaultersArr.push({id: item.id, name: item.name, email: item.email});
                }
            });
            // updating defaulters collection to remove from defulters list after submition of schedule
            DefaultersList.update({
                _id: defaulterData[0]._id
            }, {
                $set: {
                    users: defaultersArr
                }
            });
        }
        // sending email to spd and seci for the conformation mail of schedule submission
        var spdNameData = Meteor.users.find({_id: spdid}).fetch();
        var mailStatus = '';
        if (spdNameData[0].username) {
            var spdName = spdNameData[0].profile.registration_form.name_of_spd;
            var email = spdNameData[0].username;
            var subject = 'Schedule Submitted by SECI on behalf of ' + spdName + ' for ' + date;
            var message = "Dear Sir/Ma'am,<br><br>Your <b>REV-0</b> schedule has been submitted for the date of " + date + "" +
                    "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            Meteor.call("sendMandrillEmail", email, subject, message);
            mailStatus = 'Sent';
            console.log('Schedule submitted by Admin on behalf of ' + spdName + ' for ' + date + ', email sent to spd');
        } else {
            mailStatus = 'Error, email not sent';
        }
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        // data insert in log Details collection
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: spdid,
            user_name: spdNameData[0].username,
            entered_by_id: Meteor.userId(),
            entered_by_email: Meteor.user().username,
            schedule_submited_by: Meteor.user().profile.user_type,
            schedule_submited_by_id: Meteor.userId(),
            log_type: 'Schedule Submitted by Admin',
            template_name: 'adminScheduleStatus',
            event_name: 'submitDayForm',
            schedule_date: date,
            email_status: mailStatus,
            action_date: todayDate,
            timestamp: new Date(),
            json: json
        });
        return returnSuccess('Schedule Submitted by Admin');
    },
    "sameAsSubmitScheduleAdminSide": function(date, spdid) {
        var data = ScheduleSubmission.find({clientId: spdid, date: date}).fetch();
        if (data.length > 0) {
            return returnSuccess('Successs', data[0].json[0].data);
        } else {
            return returnFaliure('Schedule not submitted for the date of '+date);
        }
    },
    "updateDayAheadRevisionAdminSide": function(date, json, spdid, jsonDataWithLoss) {
        var spdNameData = Meteor.users.find({_id: spdid}).fetch();
        var data = ScheduleSubmission.find({clientId: spdid, date: date}).fetch();

        data[0].json.push(json);
        data[0].jsonWithLoss.push(jsonDataWithLoss);

        var jsonArr = [];
        var getValue = data[0].json[0];
        jsonArr.push(getValue, json);

        var jsonArrWithLossArr = [];
        var getValue = data[0].jsonWithLoss[0];
        jsonArrWithLossArr.push(getValue, jsonDataWithLoss);

        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: spdid,
            user_name: spdNameData[0].username,
            name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
            day_ahead_revised_by_id: Meteor.userId(),
            day_ahead_revised_by_user_type: Meteor.user().profile.user_type,
            log_type: 'Day Ahead Revision by Admin',
            template_name: 'adminScheduleStatus',
            event_name: 'BtnFinalSubmitDayAhead',
            schedule_date: date,
            timestamp: new Date(),
            action_date: todayDate,
            before_dayAhead_revision: data[0].json,
            before_dayAhead_revision_withLoss: data[0].jsonWithLoss,
            after_dayAhead_revision: json,
            after_dayAhead_revision_withLoass: jsonDataWithLoss
        });
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
        if (spdNameData[0].profile.registration_form.spd_state == 'Gujarat' && date == tomorrowDate) {
            if (time >= '15:00' && time <= '17:49') {
                ScheduleSubmission.update({
                    _id: data[0]._id
                }, {
                    $set: {
                        name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
                        actual_revision_time: time,
                        user_email: Meteor.user().username,
                        day_ahead_revised_by: Meteor.user().profile.user_type,
                        json: jsonArr,
                        jsonWithLoss: jsonArrWithLossArr,
                        current_date_revision: todayDate,
                        current_date_timestamp: new Date(),
                        revision_status: 'revised',
                        revision_type: 'Day Ahead',
                        gujarat_day_ahead_rev: 1,
                        day_ahead_rev: 1,
                        status: 'unchecked'
                    }
                });
            } else if (time >= '17:50' && time <= '22:00' && date == tomorrowDate) {
              var jsonArrReal = [];
              jsonArrReal = data[0].json;
              jsonArrReal.push(json);

              var jsonArrWithLossArrReal = [];
              jsonArrWithLossArrReal = data[0].jsonWithLoss;
              jsonArrWithLossArrReal.push(jsonDataWithLoss);
                ScheduleSubmission.update({
                    _id: data[0]._id
                }, {
                    $set: {
                        name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
                        actual_revision_time: time,
                        user_email: Meteor.user().username,
                        day_ahead_revised_by: Meteor.user().profile.user_type,
                        json: jsonArrReal,
                        jsonWithLoss: jsonArrWithLossArrReal,
                        current_date_revision: todayDate,
                        current_date_timestamp: new Date(),
                        revision_status: 'revised',
                        revision_type: 'Day Ahead',
                        status: 'unchecked'
                    }
                });
            }

        } else if (spdNameData[0].profile.registration_form.spd_state == 'MP' && date == tomorrowDate) {
            if (time >= '15:00' && time <= '22:00') {
                ScheduleSubmission.update({
                    _id: data[0]._id
                }, {
                    $set: {
                        name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
                        actual_revision_time: time,
                        user_email: Meteor.user().username,
                        day_ahead_revised_by: Meteor.user().profile.user_type,
                        json: jsonArr,
                        jsonWithLoss: jsonArrWithLossArr,
                        current_date_revision: todayDate,
                        current_date_timestamp: new Date(),
                        revision_status: 'revised',
                        revision_type: 'Day Ahead',
                        day_ahead_rev: 1,
                        status: 'unchecked'
                    }
                });
            }
        }else if (spdNameData[0].profile.registration_form.spd_state == 'Rajasthan' && date == tomorrowDate) {
            if (time >= '15:00' && time <= '22:00') {
                ScheduleSubmission.update({
                    _id: data[0]._id
                }, {
                    $set: {
                        name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
                        actual_revision_time: time,
                        user_email: Meteor.user().username,
                        day_ahead_revised_by: Meteor.user().profile.user_type,
                        json: jsonArr,
                        jsonWithLoss: jsonArrWithLossArr,
                        current_date_revision: todayDate,
                        current_date_timestamp: new Date(),
                        revision_status: 'revised',
                        revision_type: 'Day Ahead',
                        day_ahead_rev: 1,
                        status: 'unchecked'
                    }
                });
            }
        } else {
          // Day ahead Schedule Update
            var jsonArr = [];
            jsonArr.push(json);

            var jsonArrWithLossArr = [];
            jsonArrWithLossArr.push(jsonDataWithLoss);
            ScheduleSubmission.update({
                clientId: spdid,
                date: date
            }, {
                $set: {
                    name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
                    actual_revision_time: time,
                    user_email: Meteor.user().username,
                    day_ahead_revised_by: Meteor.user().profile.user_type,
                    json: jsonArr,
                    jsonWithLoss: jsonArrWithLossArr,
                    current_date_revision: todayDate,
                    current_date_timestamp: new Date(),
                    revision_status: 'revised',
                    revision_type: 'Day Ahead',
                    day_ahead_rev: 1,
                    status: 'unchecked'
                }
            });
        }
        var stateArray = [];
        var json = Discom.find().fetch();
        json.forEach(function(item) {
            item.spdIds.forEach(function(discomItem) {
                if (discomItem.spdId == spdid) {
                    stateArray.push(item.discom_state);
                }
            })
        })

        console.log('discom state: ' + stateArray[0]);
        console.log('spd state: ' + spdNameData[0].profile.registration_form.spd_state);

        if (time > '17:49') {
            if (stateArray[0] == 'Odisha' && spdNameData[0].profile.registration_form.spd_state == 'Gujarat') {
                console.log('Redirect to gujarat sldc 111111 from dayahead');
                 Meteor.call('sldcReportShootGujarat', date, 'DayAhead', spdNameData[0].profile.registration_form.name_of_spd);

                var uniqSpdStateList = [];
                uniqSpdStateList.push(spdNameData[0].profile.registration_form.spd_state);
                 Meteor.call('respectiveDiscomMail', date, stateArray, uniqSpdStateList);
            }
        }

        if (time > '22:01') {
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + " RealTime Revision by " + spdNameData[0].profile.registration_form.name_of_spd + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            if (stateArray[0] == 'Maharashtra' && spdNameData[0].profile.registration_form.spd_state == 'MP') {
                console.log('redirect to mp sldc 33333333 from dayahead');
                if (loggedInUserState('Other', 'MP')) {
                  Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0]);
                }else {
                  Meteor.call('sldcReportShootMP', date, message, stateArray[0]);
                }
            }
            var mpSldc = ['Goa', 'Chhattisgarh', 'Bihar'];
            for (var i = 0; i < mpSldc.length; i++) {
                if (mpSldc[i] == stateArray[0]) {
                    console.log('redirect to mp sldc 666666666 from dayahead');
                    if (loggedInUserState('Other', 'MP')) {
                      Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0], spdid);
                    }else {
                      Meteor.call('sldcReportShootMP', date, message, stateArray[0], spdid);
                    }
                }
            }
            var uniqSpdStateList = [];
            uniqSpdStateList.push(spdNameData[0].profile.registration_form.spd_state);
             Meteor.call('respectiveDiscomMail', date, stateArray, uniqSpdStateList);
        }
        return returnSuccess('Schedule Updated Successfully From DayAhead Revusion by ADMIN');
    },
    "updateRealTimeRevisionByAdmin": function(date, arr, blockTimeForMP, startTimeSlot, endTimeSlot, spdid, mainArrayWithLoss) {
        var spdNameData = Meteor.users.find({_id: spdid}).fetch();
        var timeSlotVar = ScheduleSubmission.find({clientId: spdid, date: date}).fetch();

        var startTimeSlotChangedIndex = timeSlotToIndex(startTimeSlot) + 1;
        var endTimeSlotChangedIndex = timeSlotToIndex(endTimeSlot);

        var lastRevisionIndex = Number(startTimeSlotChangedIndex) - 6;
        var blockedRevisionIndex = Number(startTimeSlotChangedIndex) - 1;

        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        currentDate.setTime(currentDate.getTime());
        var hrs = currentDate.getHours();
        var min = currentDate.getMinutes();
        var time = (hrs + ":" + min);
        var n = time;
        var n1 = n.split('_');
        var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);

        var slectedSPDState = spdNameData[0].profile.registration_form.spd_state;
        if (loggedInUserState('Other',slectedSPDState)) {
          arrLastRevision = timeSlotVar[0].json[timeSlotVar[0].json.length - 1];
          // replacing values at respective indexes realtime curt.
          arrCurrentRevision = {
              data: []
          };
          arrLastRevision.data.forEach(function(value) {
              arrCurrentRevision.data.push(value);
          });
          arr.forEach(function(value) {
              var index = timeSlotToIndex(value.time_slot) - 1;
              arrCurrentRevision.data[index] = {
                  time_slot: value.time_slot,
                  availability: value.availability,
                  bidMwh: value.bidMwh
              };
          });
          var data = 0;
          var availabilityTotal = 0;
          arrCurrentRevision.data.forEach(function(item) {
              data = (Number(data) + Number(item.bidMwh));
              availabilityTotal = (Number(availabilityTotal) + Number(item.availability));
          });
          //adding a new revision.
          var totalMWhVar = Number(data);
          var totalMwhDevision = Number(totalMWhVar / 4000).toFixed(7);
          var totalAvaibilityDevision = Number(availabilityTotal / 4000).toFixed(7);
          arrCurrentRevision.totalAvaibility = totalAvaibilityDevision;
          arrCurrentRevision.totalMwh = totalMwhDevision;
          arrCurrentRevision.revision_time = time;
          timeSlotVar[0].json.push(arrCurrentRevision);

          // after revision,calculating lossess data--------------------------------------------------------------//
          arrLastRevisionWithLoss = timeSlotVar[0].jsonWithLoss[timeSlotVar[0].jsonWithLoss.length - 1];
          // replacing values at respective indexes realtime curt.
          arrCurrentRevisionWithLoss = {
              data: []
          };
          arrLastRevisionWithLoss.data.forEach(function(value) {
              arrCurrentRevisionWithLoss.data.push(value);
          });
          mainArrayWithLoss.forEach(function(value) {
              var index = timeSlotToIndex(value.time_slot) - 1;
              arrCurrentRevisionWithLoss.data[index] = {
                  time_slot: value.time_slot,
                  availability: value.availability,
                  bidMwh: value.bidMwh
              };
          });
          var data = 0;
          var tatalAvaiblity = 0;
          arrCurrentRevisionWithLoss.data.forEach(function(item) {
              data = (Number(data) + Number(item.bidMwh));
              tatalAvaiblity = (Number(tatalAvaiblity) + Number(item.availability));
          });
          //adding a new revision.
          var totalMWhVarWithLoss = Number(data);
          var totalMwhDevisionWithLoss = Number(totalMWhVarWithLoss / 4000).toFixed(7);
          var totalAvaibilityDevisionWithLoss = Number(tatalAvaiblity / 4000).toFixed(7);
          arrCurrentRevisionWithLoss.totalAvaibility = totalAvaibilityDevisionWithLoss;
          arrCurrentRevisionWithLoss.totalMwh = totalMwhDevisionWithLoss;
          arrCurrentRevisionWithLoss.revision_time = time;
          timeSlotVar[0].jsonWithLoss.push(arrCurrentRevisionWithLoss);

        }else {
          arrLastRevision = timeSlotVar[0].json[timeSlotVar[0].json.length - 1];
          // replacing values at respective indexes realtime curt.
          arrCurrentRevision = {
              data: []
          };
          arrLastRevision.data.forEach(function(value) {
              arrCurrentRevision.data.push(value);
          });
          arr.forEach(function(value) {
              var index = timeSlotToIndex(value.time_slot) - 1;
              arrCurrentRevision.data[index] = {
                  time_slot: value.time_slot,
                  bidMwh: value.bidMwh
              };
          });
          var data = 0;
          arrCurrentRevision.data.forEach(function(item) {
              data = (Number(data) + Number(item.bidMwh));
          });
          //adding a new revision.
          var totalMWhVar = Number(data);
          var totalMwhDevision = Number(totalMWhVar / 4000).toFixed(7);
          arrCurrentRevision.totalMwh = totalMwhDevision;
          arrCurrentRevision.revision_time = time;
          timeSlotVar[0].json.push(arrCurrentRevision);

          // after revision,calculating lossess data
          arrLastRevisionWithLoss = timeSlotVar[0].jsonWithLoss[timeSlotVar[0].jsonWithLoss.length - 1];
          // replacing values at respective indexes realtime curt.
          arrCurrentRevisionWithLoss = {
              data: []
          };
          arrLastRevisionWithLoss.data.forEach(function(value) {
              arrCurrentRevisionWithLoss.data.push(value);
          });
          mainArrayWithLoss.forEach(function(value) {
              var index = timeSlotToIndex(value.time_slot) - 1;
              arrCurrentRevisionWithLoss.data[index] = {
                  time_slot: value.time_slot,
                  bidMwh: value.bidMwh
              };
          });
          var data = 0;
          arrCurrentRevisionWithLoss.data.forEach(function(item) {
              data = (Number(data) + Number(item.bidMwh));
          });
          //adding a new revision.
          var totalMWhVarWithLoss = Number(data);
          var totalMwhDevisionWithLoss = Number(totalMWhVarWithLoss / 4000).toFixed(7);
          arrCurrentRevisionWithLoss.totalMwh = totalMwhDevisionWithLoss;
          arrCurrentRevisionWithLoss.revision_time = time;
          timeSlotVar[0].jsonWithLoss.push(arrCurrentRevisionWithLoss);
        }
        // updating the database
        ScheduleSubmission.update({
            _id: timeSlotVar[0]._id
        }, {
            $set: {
                name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
                actual_revision_time: time,
                blocked_time_slot: blockTimeForMP,
                real_time_revised_by: Meteor.user().profile.user_type,
                json: timeSlotVar[0].json,
                jsonWithLoss: timeSlotVar[0].jsonWithLoss,
                current_date_revision: todayDate,
                current_date_timestamp: new Date(),
                revision_status: 'revised',
                revision_type: 'Real Time',
                status: 'unchecked'
            }
        });
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        // data insert in log Details collection
        LogDetails.insert({
            ip_address:ipArr,
            user_id: spdid,
            user_name: spdNameData[0].username,
            name_of_spd : spdNameData[0].profile.registration_form.name_of_spd,
            blocked_time_slot: blockTimeForMP,
            real_time_revised_by_id: Meteor.userId(),
            real_time_revised_by_user_type: Meteor.user().profile.user_type,
            log_type: 'Real Time Revision by Admin',
            template_name: 'adminScheduleStatus',
            event_name: 'RealTimeBtnSubmit',
            timestamp: new Date(),
            action_date: todayDate,
            json: timeSlotVar[0].json,
            jsonWithLoss: timeSlotVar[0].jsonWithLoss
        });
        var selectedSPDNameVar = spdNameData[0].profile.registration_form.name_of_spd;
        var stateArray = [];
        var json = Discom.find().fetch();
        json.forEach(function(item) {
            item.spdIds.forEach(function(discomItem) {
                if (discomItem.spdId == spdid) {
                    stateArray.push(item.discom_state);
                }
            })
        })

        console.log('discom state: ' + stateArray[0]);
        console.log('spd state: ' + spdNameData[0].profile.registration_form.spd_state);

        if (stateArray[0] == 'Odisha' && spdNameData[0].profile.registration_form.spd_state == 'Gujarat') {
            console.log('Redirect to gujarat sldc 111111 from realtime');
             Meteor.call('sldcReportShootGujarat', date, 'revision', spdNameData[0].profile.registration_form.name_of_spd);
        }

        if (stateArray[0] == 'Maharashtra' || stateArray[0] == 'Goa') {
            var message = "Dear Sir/Ma'am,<br><br>" +
            "1. The change in revision is more than +/-2% with the last one. <br><br>2. Revision is from " + startTimeSlotChangedIndex + '-' + endTimeSlotChangedIndex + " BLOCKS IN (GEN: IL&FS) to MAHARASHTRA & GOA.<br><br>3. THERE WILL BE NO REVISION IN TIME BLOCK " + lastRevisionIndex + '-' + blockedRevisionIndex + " FOR GENERATOR IL&FS.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        }

        if (stateArray[0] == 'Chhattisgarh') {
          var mpSPDNameVar = '';
          // below if condition used for Focal Energy Solar One India Pvt Ltd to get the name of SPD to Sub & Body
          if (spdid == 'iu96Skq5kcbbMBioy') {
            mpSPDNameVar = 'FOCAL ONE';
          }else if (spdid == 'Wai2eEX7j6oALzKFg') {
            mpSPDNameVar = 'WAANEEP';
          }
            var message = "Dear Sir/Ma'am,<br><br>" +
            "1. The change in revision is more than +/-2% with the last one. <br><br>2. Revision is from " + startTimeSlotChangedIndex + '-' + endTimeSlotChangedIndex + " BLOCKS IN (GEN: "+mpSPDNameVar+") to CHATTISGARH.<br><br>3. THERE WILL BE NO REVISION IN TIME BLOCK " + lastRevisionIndex + '-' + blockedRevisionIndex + " FOR GENERATOR WAANEEP.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        }

        if (stateArray[0] == 'Bihar') {
            var message = "Dear Sir/Ma'am,<br><br>" +
            "1. The change in revision is more than +/-2% with the last one. <br><br>2. Revision is from " + startTimeSlotChangedIndex + '-' + endTimeSlotChangedIndex + " BLOCKS IN (GEN: FOCAL TWO) to BIHAR.<br><br>3. THERE WILL BE NO REVISION IN TIME BLOCK " + lastRevisionIndex + '-' + blockedRevisionIndex + " FOR GENERATOR FOCAL TWO.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        }

        var colourCells = {
            spdIdRevision: spdid,
            startCell: startTimeSlotChangedIndex,
            endCell: endTimeSlotChangedIndex
        };

        if (spdNameData[0].profile.registration_form.spd_state == 'Rajasthan') {
            console.log('Redirect to Rajasthan sldc 000000 from realtime');
             Meteor.call('sldcReportShootRajasthan', date, 'revision', stateArray[0], colourCells, selectedSPDNameVar);
        }

        if (stateArray[0] == 'Maharashtra' && spdNameData[0].profile.registration_form.spd_state == 'MP') {
            console.log('redirect to mp sldc 33333333 from realtime');
            if (loggedInUserState('Other',slectedSPDState)) {
              Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0], colourCells);
            }else {
              Meteor.call('sldcReportShootMP', date, message, stateArray[0], colourCells);
            }
        }

        var mpSldc = ['Goa', 'Chhattisgarh', 'Bihar'];
        for (var i = 0; i < mpSldc.length; i++) {
            if (mpSldc[i] == stateArray[0]) {
                console.log('redirect to mp sldc 666666666 from realtime');
                if (loggedInUserState('Other',slectedSPDState)) {
                  Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0], colourCells, spdid);
                }else {
                  Meteor.call('sldcReportShootMP', date, message, stateArray[0], colourCells, spdid);
                }
            }
        }
        var uniqSpdStateList = [];
        uniqSpdStateList.push(spdNameData[0].profile.registration_form.spd_state);
        if (spdNameData[0].profile.registration_form.spd_state != 'MP') {
          Meteor.call('respectiveDiscomMail', date, stateArray, uniqSpdStateList, 'revision');
        }
        return returnSuccess('Schedule Updated from RealTime');
    },
    callViewScheduleByAdmin(spdId, date) {
        var view = ScheduleSubmission.find({clientId: spdId, date: date}).fetch();
        if (view.length > 0) {
            view[0].json[0].data[0].date = date;
            var jsonData = view[0].json[0].data;
            view[0].json[0].data[0].totalMwh = view[0].json[0].totalMwh;

            var toReturn = {
                jsonData: jsonData,
                userData: Meteor.user().profile.registration_form
            }
            return returnSuccess('Schedule view for SPD: ' + Meteor.userId(), toReturn);
        } else {
            return returnFaliure('Schedule not submitted for '+date);
        }
    },
    dayAheadDateList(userIds, timeDifferenceInDays, fromDate) {
        var returnData = [];
        var q = 1;
        for (var i = 0; i <= timeDifferenceInDays; i++) {
            fromDate.setDate(fromDate.getDate() + 1);
            var date = moment(fromDate).format('DD-MM-YYYY');
            var json = ScheduleSubmission.find({clientId: userIds, date: date}).fetch();
            if (json.length > 0) {
                returnData.push({sn: q, date: moment(fromDate).format('DD-MM-YYYY')});
                q++;
            }
        }
        if (returnData.length>0) {
          return returnSuccess('Date List Created', returnData);
        }else {
          return returnFaliure('No schedule Available');
        }
    }
});

Meteor.methods({
    "updateDayAheadRevision": function(date, json, jsonDataWithLoss) {
        var data = ScheduleSubmission.find({clientId: Meteor.userId(), date: date}).fetch();
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
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            day_ahead_revised_by: Meteor.user().profile.user_type,
            name_of_spd: Meteor.user().profile.registration_form.name_of_spd,
            log_type: 'Day Ahead Revision Submitted',
            template_name: 'revisions',
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

        if (Meteor.user().profile.registration_form.spd_state == 'Gujarat' && date == tomorrowDate) {
            if (time >= '15:00' && time <= '17:49') {
                ScheduleSubmission.update({
                    _id: data[0]._id
                }, {
                    $set: {
                        name_of_spd: Meteor.user().profile.registration_form.name_of_spd,
                        actual_revision_time: time,
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
                        name_of_spd: Meteor.user().profile.registration_form.name_of_spd,
                        actual_revision_time: time,
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

        } else if (Meteor.user().profile.registration_form.spd_state == 'MP' && date == tomorrowDate) {
            if (time >= '15:00' && time <= '22:00') {
                ScheduleSubmission.update({
                    _id: data[0]._id
                }, {
                    $set: {
                        name_of_spd: Meteor.user().profile.registration_form.name_of_spd,
                        actual_revision_time: time,
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
        } else if (Meteor.user().profile.registration_form.spd_state == 'Rajasthan' && date == tomorrowDate) {
            if (time >= '15:00' && time <= '22:00') {
              ScheduleSubmission.update({
                  _id: data[0]._id
              }, {
                  $set: {
                      name_of_spd: Meteor.user().profile.registration_form.name_of_spd,
                      actual_revision_time: time,
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
            }else {

            }
        }else {
            var jsonArr = [];
            jsonArr.push(json);

            var jsonArrWithLossArr = [];
            jsonArrWithLossArr.push(jsonDataWithLoss);
            // Day ahead Schedule Update
            ScheduleSubmission.update({
                clientId: Meteor.userId(),
                date: date
            }, {
                $set: {
                    name_of_spd: Meteor.user().profile.registration_form.name_of_spd,
                    actual_revision_time: time,
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
                if (discomItem.spdId == Meteor.userId()) {
                    stateArray.push(item.discom_state);
                }
            })
        })

        console.log('discom state: ' + stateArray[0]);
        console.log('spd state: ' + Meteor.user().profile.registration_form.spd_state);

        if (time > '17:49') {
            if (stateArray[0] == 'Odisha' && Meteor.user().profile.registration_form.spd_state == 'Gujarat') {
                console.log('Redirect to gujarat sldc 111111 from dayahead');
                Meteor.call('sldcReportShootGujarat', date, 'DayAhead', Meteor.user().profile.registration_form.name_of_spd);

                var uniqSpdStateList = [];
                uniqSpdStateList.push(Meteor.user().profile.registration_form.spd_state);
                Meteor.call('respectiveDiscomMail', date, stateArray, uniqSpdStateList, 'DayAhead');
            }
        }

        if (time > '22:01') {
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + " RealTime Revision by " + Meteor.user().profile.registration_form.name_of_spd + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            if (stateArray[0] == 'Maharashtra' && Meteor.user().profile.registration_form.spd_state == 'MP') {
                console.log('redirect to mp sldc 33333333 from dayahead');
                if (loggedInUserState('SPD')) {
                  Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0]);
                }else {
                  Meteor.call('sldcReportShootMP', date, message, stateArray[0]);
                }
            }
            var mpSPDUniqId = Meteor.userId();
            var mpSldc = ['Goa', 'Chhattisgarh', 'Bihar'];
            for (var i = 0; i < mpSldc.length; i++) {
                if (mpSldc[i] == stateArray[0]) {
                    console.log('redirect to mp sldc 666666666 from dayahead');
                    if (loggedInUserState('SPD')) {
                      Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0], mpSPDUniqId);
                    }else {
                      Meteor.call('sldcReportShootMP', date, message, stateArray[0], mpSPDUniqId);
                    }

                }
            }
        }
        return returnSuccess('Schedule Updated Successfully From DayAhead Revision by SPD');
    },

    "updateRealTimeRevision": function(date, arr, blockTimeForMP, startTimeSlot, endTimeSlot, mainArrayWithLoss) {
      var currentDate = moment().format("DD-MM-YYYY");
      //date must be equal to current date for real time revision
      if (currentDate == date) {
        var timeSlotVar = ScheduleSubmission.find({clientId: Meteor.userId(), date: date}).fetch();
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

        if (loggedInUserState('SPD')) {
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
                name_of_spd: Meteor.user().profile.registration_form.name_of_spd,
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
        // data insert in log Details collection
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            blocked_time_slot: blockTimeForMP,
            real_time_revised_by: Meteor.user().profile.user_type,
            log_type: 'Real Time Revision Submitted',
            template_name: 'revisions',
            event_name: 'RealTimeBtnSubmit',
            timestamp: new Date(),
            action_date: todayDate,
            json: timeSlotVar[0].json,
            jsonWithLoss: timeSlotVar[0].jsonWithLoss
        });

        var stateArray = [];
        var json = Discom.find().fetch();
        json.forEach(function(item) {
            item.spdIds.forEach(function(discomItem) {
                if (discomItem.spdId == Meteor.userId()) {
                    stateArray.push(item.discom_state);
                }
            })
        })

        var uniqSpdStateList = [];
        uniqSpdStateList.push(Meteor.user().profile.registration_form.spd_state);

        var colourCells = {
            spdIdRevision: Meteor.userId(),
            startCell: startTimeSlotChangedIndex,
            endCell: endTimeSlotChangedIndex
        };

        if (Meteor.user().profile.registration_form.spd_state == 'Rajasthan') {
            console.log('Redirect to Rajasthan sldc 0000000000000 from realtime');
            var spdName = Meteor.user().profile.registration_form.name_of_spd;
            Meteor.call('sldcReportShootRajasthan', date, 'revision', stateArray, colourCells, spdName);
            Meteor.call('respectiveDiscomMail', date, stateArray, uniqSpdStateList, 'revision');
        }

        if (stateArray[0] == 'Odisha' && Meteor.user().profile.registration_form.spd_state == 'Gujarat') {
            console.log('Redirect to gujarat sldc 111111 from realtime');
            Meteor.call('sldcReportShootGujarat', date, 'revision', Meteor.user().profile.registration_form.name_of_spd, colourCells);
            Meteor.call('respectiveDiscomMail', date, stateArray, uniqSpdStateList, 'revision');
        }
        if (stateArray[0] == 'Maharashtra' || stateArray[0] == 'Goa') {
            var message = "Dear Sir/Ma'am,<br><br>" +
            "1. The change in revision is more than +/-2% with the last one. <br><br>2. Revision is from " + startTimeSlotChangedIndex + '-' + endTimeSlotChangedIndex + " BLOCKS IN (GEN: IL&FS) to MAHARASHTRA & GOA.<br><br>3. THERE WILL BE NO REVISION IN TIME BLOCK " + lastRevisionIndex + '-' + blockedRevisionIndex + " FOR GENERATOR IL&FS.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        }

        var mpSPDUniqId = '';
        if (stateArray[0] == 'Chhattisgarh') {
          var mpSPDNameVar = '';
          // below if condition used for Focal Energy Solar One India Pvt Ltd to get the name of SPD to Sub & Body
          if (Meteor.userId() == 'iu96Skq5kcbbMBioy') {
            mpSPDNameVar = 'FOCAL ONE';
            mpSPDUniqId = 'iu96Skq5kcbbMBioy';
          }else if (Meteor.userId() == 'Wai2eEX7j6oALzKFg') {
            mpSPDNameVar = 'WAANEEP';
            mpSPDUniqId = 'Wai2eEX7j6oALzKFg';
          }
            var message = "Dear Sir/Ma'am,<br><br>" +
            "1. The change in revision is more than +/-2% with the last one. <br><br>2. Revision is from " + startTimeSlotChangedIndex + '-' + endTimeSlotChangedIndex + " BLOCKS IN (GEN: "+mpSPDNameVar+") to CHHATTISGARH.<br><br>3. THERE WILL BE NO REVISION IN TIME BLOCK " + lastRevisionIndex + '-' + blockedRevisionIndex + " FOR GENERATOR "+mpSPDNameVar+".<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        }

        if (stateArray[0] == 'Bihar') {
            var message = "Dear Sir/Ma'am,<br><br>" +
            "1. The change in revision is more than +/-2% with the last one. <br><br>2. Revision is from " + startTimeSlotChangedIndex + '-' + endTimeSlotChangedIndex + " BLOCKS IN (GEN: FOCAL TWO) to BIHAR.<br><br>3. THERE WILL BE NO REVISION IN TIME BLOCK " + lastRevisionIndex + '-' + blockedRevisionIndex + " FOR GENERATOR FOCAL TWO.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        }

        if (stateArray[0] == 'Maharashtra' && Meteor.user().profile.registration_form.spd_state == 'MP') {
            console.log('redirect to mp sldc 33333333 from realtime');
            if (loggedInUserState('SPD')) {
              Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0], colourCells);
            }else {
              Meteor.call('sldcReportShootMP', date, message, stateArray[0], colourCells);
            }
        }

        var mpSldc = ['Goa', 'Chhattisgarh', 'Bihar'];
        for (var i = 0; i < mpSldc.length; i++) {
            if (mpSldc[i] == stateArray[0]) {
                console.log('redirect to mp sldc 666666666 from realtime');
                if (loggedInUserState('SPD')) {
                  Meteor.call('sldcReportShootMPWithAvaibility', date, message, stateArray[0], colourCells,mpSPDUniqId);
                }else {
                  Meteor.call('sldcReportShootMP', date, message, stateArray[0], colourCells,mpSPDUniqId);
                }
            }
        }
        return returnSuccess('Schedule Updated from RealTime');
      }else {
        return returnFaliure('Something went wrong, Please contact to admin!');
      }
    },

    'getRealTimeData': function(dateVar) {
        var ddclass = 'bg-warning';
        var viewData = ScheduleSubmission.find({clientId: Meteor.userId(), date: dateVar}).fetch();
        var arr = [];
        var loopLength = viewData[0].json.length;
        for (k = 0; k < 96; k++) {
            var json = {};
            //creating json of, date and time_slot
            json['date'] = {
                "data": dateVar,
                "color": ""
            };
            json['time_slot'] = {
                "data": viewData[0].json[0].data[k].time_slot,
                "color": ""
            };
            if (loggedInUserState('SPD')) {
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
            }else{
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
        };
        return returnSuccess('View Schedule from revision.js, by SPD for the date of ' + dateVar + ' SPD Id- ' + Meteor.userId(), arr);
    },
    dayAheadDateListRevision(timeDifferenceInDays, fromDate) {
        var returnData = [];
        var q = 1;
        for (var i = 0; i <= timeDifferenceInDays; i++) {
            fromDate.setDate(fromDate.getDate() + 1);
            var date = moment(fromDate).format('DD-MM-YYYY');
            var json = ScheduleSubmission.find({clientId: Meteor.userId(), date: date}).fetch();
            if (json.length > 0) {
                returnData.push({sn: q, date: moment(fromDate).format('DD-MM-YYYY')});
                q++;
            }
        }
        if (returnData.length > 0) {
            return returnSuccess('Date List Created for Revision: ', returnData);
        } else {
            return returnFaliure('No schedule Available');
        }
    },
    'getRealTimeTotalMWHData': function(dateVar) {
        var arr = [];
        var viewData = ScheduleSubmission.find({clientId: Meteor.userId(), date: dateVar}).fetch();
        var loopLength = viewData[0].json.length;
        for (var i = 0; i < loopLength; i++) {
            var jsonData = {
                totalAvaibility: viewData[0].json[i].totalAvaibility,
                totalMwh: viewData[0].json[i].totalMwh
            };
            arr.push(jsonData);
        }
        return returnSuccess('Getting Total MWh by SPD', arr);
    },

    respectiveDiscomMail(date, stateArray, uniqSpdStateList, receivedFrom) {
        var dateThis = date.split('-');
        dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
        dateThis.setDate(dateThis.getDate() - 1);
        moment(dateThis).format('DD-MM-YYYY');
        var minusOneDay = moment().format('DD-MM-YYYY');
        var discomSpds = Discom.find({"discom_state": stateArray[0]}).fetch();
        var spdStateList = [];
        var idsList = [];
        var spds = discomSpds[0].spdIds;
        spds.forEach(function(item) {
            if (item.transaction_type == "Inter") {
                spdStateList.push(item.spdState);
                idsList.push(item.spdId);
            }
        });

        for (var y = 0; y < uniqSpdStateList.length; y++) {
            var list = [];
            for (var t = 0; t < idsList.length; t++) {
                var json = Meteor.users.find({_id: idsList[t]}).fetch();
                if (json[0].profile.registration_form) {
                    if (json[0].profile.registration_form.spd_state == uniqSpdStateList[y]) {
                        list.push({id: idsList[t], names: json[0].profile.registration_form.name_of_spd, state: json[0].profile.registration_form.spd_state});
                    }
                }
            }

            var idArray = [];
            var spdNamesListTotal = [];
            var spdNamesListLossTotal = [];
            list.forEach(function(item) {
                idArray.push(item.id);
                spdNamesListTotal.push(item.names);
                spdNamesListLossTotal.push(item.names);
            });
            spdNamesListTotal.push("TOTAL MW");
            spdNamesListLossTotal.push("MW AFTER LOSSES");

            var rate = [];
            var splitDate = date.split('-');
            var stateSTUvar = StuCharges.find({month: splitDate[1], year: splitDate[2], state: uniqSpdStateList[y]}).fetch();
            if (stateSTUvar.length > 0) {
                rate.push(stateSTUvar[0].stuRate);
            }

            var result = [];
            var lossResult = [];
            for (var j = 0; j < 96; j++) {
                var show = [];
                var showLoss = [];
                var bid = 0;
                var revisionsValue = [];
                for (var i = 0; i < idArray.length; i++) {
                    var schedule = ScheduleSubmission.find({clientId: idArray[i], date: date}).fetch();
                    if (schedule != '') {
                        schedule.forEach(function(item) {
                            var jsonData = item.json;
                            var length = jsonData.length;
                            revisionsValue.push(Number(length) - 1);
                            var getSchedule = jsonData[length - 1];
                            bid = getSchedule.data[j].bidMwh;
                        });
                    } else {
                        bid = "0.00";
                    }
                    show.push(bid);
                    var Stu = stateSTUvar[0].stuRate;
                    var percentage = Number(Stu) / 100;
                    var calculate = Number(bid) * Number(percentage);
                    var error = Number(bid) - Number(calculate);
                    showLoss.push(error.toFixed(2));
                }
                var count = 0;
                var lossCount = 0;
                for (var i = show.length; i--;) {
                    count += Number(show[i]);
                    lossCount += Number(showLoss[i]);
                }
                show.push(count.toFixed(2));
                showLoss.push(lossCount.toFixed(2));
                result.push(show);
                lossResult.push(showLoss);
            }

            /////calculating total for the last////////////
            var tempArrayTotal = [];
            var tempArrayTotalError = [];
            for (var z = 0; z < result[0].length; z++) {
                var sum = 0;
                var sumLoss = 0;
                for (var k = 0; k < result.length; k++) {
                    sum += Number(result[k][z]);
                    sumLoss += Number(lossResult[k][z]);
                }
                tempArrayTotal.push((Number(sum) / 4000).toFixed(7));
                tempArrayTotalError.push((Number(sumLoss) / 4000).toFixed(7));
            }
            result.push(tempArrayTotal);
            lossResult.push(tempArrayTotalError);

            var nameOfSpdState = uniqSpdStateList[y].toUpperCase();
            var nameofDiscomState = stateArray[0].toUpperCase();

            // var sumAll = 0;
            // for (var i = revisionsValue.length; i--;) {
            //     sumAll += Number(revisionsValue[i]);
            // }
            // console.log(revisionsValue);
            // var sumOfRevision = sumOfArray(revisionsValue);
            // var sumOfRevision = sumAll;

            /////special case for gujarat///////
            var sumAll = 0;
            var actualRevNo = 0;
            var checkDayAheadRevArr = 0;
            if (receivedFrom == 'revision') {
                for (var i = 0; i < idArray.length; i++) {
                    var schedule = ScheduleSubmission.find({clientId: idArray[i], date: date, gujarat_day_ahead_rev: 1}).fetch();
                    checkDayAheadRevArr += Number(schedule.length);
                }
                if (checkDayAheadRevArr > 0) {
                    for (var i = revisionsValue.length; i--;) {
                        sumAll += Number(revisionsValue[i]);
                    }
                    actualRevNo = Number(sumAll) - 1;
                } else {
                    actualRevNo = sumOfArray(revisionsValue);
                }
                var sumOfRevision = actualRevNo;
            } else if (receivedFrom == 'DayAhead') {
                actualRevNo = sumOfArray(revisionsValue);
                var sumOfRevision = actualRevNo;
            } else {
                var sumOfRevision = sumOfArray(revisionsValue);
            }
            console.log('sum is ' + sumOfRevision);

            /////special case gujarat end here/////

            if (stateArray[0] == "Odisha" || stateArray[0] == "Maharashtra") {
                var LTOAnumber = Discom.find({discom_state: stateArray[0]}).fetch();
                var getLTOA = LTOAnumber[0].LTOA_number;
                var splitLtoa = getLTOA.split(',');
                if (uniqSpdStateList[y] == 'Rajasthan') {
                    var showLTOA = splitLtoa[1];
                } else {
                    var showLTOA = splitLtoa[0];
                }
            } else {
                var LTOAnumber = Discom.find({discom_state: stateArray[0]}).fetch();
                var showLTOA = LTOAnumber[0].LTOA_number;
            }

            var toReturn = {
                result: result,
                lossResult: lossResult,
                rate: rate + '%',
                spdNamesListTotal: spdNamesListTotal,
                spdNamesListLossTotal: spdNamesListLossTotal,
                scheduleDate: date,
                LTOA_number: showLTOA,
                valueHighestRevision: sumOfRevision,
                spdState: nameOfSpdState,
                discomSate: nameofDiscomState,
                minusOneDay: minusOneDay
            };

            ////////making of excel/////////////
            var excelName = date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + ' REV- ' + toReturn.valueHighestRevision;
            var excelbuilder = require('msexcel-builder');
            var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/discomReports/',excelName+ '.xlsx');
            var sheet1 = workbook.createSheet('sheet1', 100, 126);
            sheet1.set(7, 2, 'Solar Energy Corporation of India Ltd.');
            sheet1.set(7, 3, '(A Government of India Enterprise)');
            sheet1.font(7, 3, {
                name: '黑体',
                sz: '07',
                family: '3',
                scheme: '-',
                bold: 'false',
                iter: 'true'
            });
            sheet1.set(1, 6, 'Regd. Office:');
            sheet1.set(3, 6, 'SOLAR ENERGY CORPORATION OF INDIA,1st Floor, A Wing, D-3,District Centre, Saket, New Delhi - 110017');
            sheet1.set(3, 7, 'Phones: 011-71989285/86');
            sheet1.set(3, 8, 'Fax: 011-71989287, Website: www.seci.co.in ');
            sheet1.set(3, 9, 'CIN: U40106DL2011NPL225263');
            sheet1.set(1, 11, 'TRANSACTION');
            sheet1.set(3, 11, toReturn.spdState + '-' + toReturn.discomSate);
            sheet1.set(7, 11, 'ISSUE-DATE:');
            sheet1.set(9, 11, toReturn.minusOneDay);
            sheet1.set(1, 13, 'STU LOSS');
            sheet1.set(3, 13, toReturn.rate);
            sheet1.set(7, 13, 'SCHEDULE FOR :');
            sheet1.set(9, 13, toReturn.scheduleDate);
            sheet1.set(7, 14, 'REV');
            sheet1.set(9, 14, toReturn.valueHighestRevision);
            sheet1.set(1, 16, 'LTOA Intimation No.');
            sheet1.set(3, 16, toReturn.LTOA_number);
            sheet1.set(1, 19, 'TIME BLOCK');
            sheet1.align(1, 19, 'center');
            sheet1.height(19, 60);
            sheet1.width(1, 13);
            sheet1.valign(3, 18, 'center');
            sheet1.set(3, 18, 'GENERATION SCHEDULE');
            sheet1.align(3, 18, 'center');
            sheet1.set(toReturn.spdNamesListTotal.length + 3, 18, 'AT ' + toReturn.spdState + ' PERIPHERY AFTER STU LOSSES');
            sheet1.valign(toReturn.spdNamesListTotal.length + 3, 18, 'center');
            sheet1.wrap(toReturn.spdNamesListTotal.length + 3, 18, 'true');
            sheet1.height(18, 30);
            sheet1.align(toReturn.spdNamesListTotal.length + 3, 18, 'center');
            sheet1.width(2, 5);
            for (var q = 0; q < toReturn.spdNamesListTotal.length; q++) {
                sheet1.align(q + 3, 19, 'center');
                sheet1.wrap(q + 3, 19, 'true');
                sheet1.width(q + 3, 12);
                sheet1.border(q + 3, 19, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.set(q + 3, 19, toReturn.spdNamesListTotal[q]);
            }
            for (var w = 0; w < toReturn.spdNamesListLossTotal.length; w++) {
                sheet1.align(w + toReturn.spdNamesListTotal.length + 3, 19, 'center');
                sheet1.wrap(w + toReturn.spdNamesListTotal.length + 3, 19, 'true');
                sheet1.width(w + toReturn.spdNamesListTotal.length + 3, 12);
                sheet1.border(w + toReturn.spdNamesListTotal.length + 3, 19, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.set(w + toReturn.spdNamesListTotal.length + 3, 19, toReturn.spdNamesListLossTotal[w]);
            }
            sheet1.border(1, 18, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(3, 18, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(toReturn.spdNamesListTotal.length + 3, 18, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(2 * toReturn.spdNamesListTotal.length + 2, 18, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(2 * toReturn.spdNamesListTotal.length + 3, 18, {left: 'medium'});
            sheet1.border(1, 19, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });

            sheet1.merge({
                col: 1,
                row: 18
            }, {
                col: 2,
                row: 18
            });
            sheet1.merge({
                col: 1,
                row: 19
            }, {
                col: 2,
                row: 19
            });
            sheet1.merge({
                col: 3,
                row: 18
            }, {
                col: toReturn.spdNamesListTotal.length + 2,
                row: 18
            });
            sheet1.merge({
                col: toReturn.spdNamesListTotal.length + 3,
                row: 18
            }, {
                col: toReturn.spdNamesListTotal.length + 2 + toReturn.spdNamesListTotal.length,
                row: 18
            });

            for (var s = 20; s < 116; s++) {
                var from = returnSlots("from", s - 20);
                var to = returnSlots("to", s - 20);
                sheet1.set(1, s, from + '-' + to);
                sheet1.set(2, s, s - 19);
                sheet1.border(1, s, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.border(2, s, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                for (var q = 0; q < toReturn.spdNamesListTotal.length; q++) {
                    var toValue = returnHelper(toReturn.result, q, s - 20);
                    sheet1.set(q + 3, s, toValue);
                    sheet1.border(q + 3, s, {
                        left: 'medium',
                        top: 'medium',
                        right: 'medium',
                        bottom: 'medium'
                    });
                    sheet1.align(q + 3, s, 'center');
                    var toValueLoss = returnHelper(toReturn.lossResult, q, s - 20);
                    sheet1.set(toReturn.spdNamesListTotal.length + q + 3, s, toValueLoss);
                    sheet1.border(toReturn.spdNamesListTotal.length + q + 3, s, {
                        left: 'medium',
                        top: 'medium',
                        right: 'medium',
                        bottom: 'medium'
                    });
                    sheet1.align(toReturn.spdNamesListTotal.length + q + 3, s, 'center');
                }
            }
            sheet1.set(1, 116, 'Total(MUs)');
            sheet1.merge({
                col: 1,
                row: 116
            }, {
                col: 2,
                row: 116
            });
            sheet1.border(1, 116, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            for (var q = 0; q < toReturn.spdNamesListTotal.length; q++) {
                sheet1.border(q + 3, 116, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.set(q + 3, 116, returnHelper(toReturn.result, q, 96));
            }
            for (var q = 0; q < toReturn.spdNamesListTotal.length; q++) {
                sheet1.border(toReturn.spdNamesListTotal.length + q + 3, 116, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.set(toReturn.spdNamesListTotal.length + q + 3, 116, returnHelper(toReturn.lossResult, q, 96));
            }
            sheet1.set(toReturn.spdNamesListTotal.length + 3, 120, 'Authorised Signatory');
            sheet1.set(toReturn.spdNamesListTotal.length + 3, 122, 'Solar Energy Corporation of India');

            workbook.save(function(ok) {
                console.log('workbook saved ' + (ok
                    ? 'ok'
                    : stateArray[0]));
            });

            spawn = Npm.require('child_process').spawn;
            console.log("Executing post");
            command = spawn('putimage', [
                process.env.PWD + '/.uploads/discomReports/' +excelName+ '.xlsx',
                process.env.PWD + '/public/img/secillogo.jpg',
                'A1',
                '0'
            ]);

            command.stdout.on('data', function(data) {
                console.log('stdout: ' + data);
            });
            command.stderr.on('data', function(data) {
                console.log('stderr: ' + data);
            });
            command.on('exit', function(code) {
                //  console.log('child process exited with code ' + code);
            });

            var toInsert = {
                date: date,
                filePath: process.env.PWD + '/.uploads/discomReports/' +excelName+ '.xlsx',
                fileName: date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + ' REV- ' + toReturn.valueHighestRevision + '.xlsx',
                stateName: stateArray[0],
                createdAt: new Date(),
                reportType: "discom_report"
            }
            ReportUrls.insert(toInsert);

            // json insert to keep excel file details
            var jsonDetals = {
              date: date,
              revision_number:toReturn.valueHighestRevision,
              filePath: 'discomReports/' +excelName+ '.xlsx',
              fileName: date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + ' REV- ' + toReturn.valueHighestRevision + '.xlsx',
              state: stateArray[0],
              reportType: "Discom",
              timestamp: new Date(),
            };
            ExcelDetails.insert(jsonDetals);
        }

        var data = ReportUrls.find({
            date: date,
            reportType: "discom_report",
            stateName: stateArray[0]
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        var attachmentUrl = data[0].filePath;
        var fileName = data[0].fileName;
        if (Meteor.user().profile.user_type == 'admin' || Meteor.user().profile.user_type == 'master') {
          var subject = "Schedule for " + date + ' ' + uniqSpdStateList[0] + '-' + stateArray[0] + ' REV- ' + toReturn.valueHighestRevision;
        }else {
          var subject = "Schedule for " + date + ' ' + Meteor.user().profile.registration_form.spd_state + '-' + stateArray[0] + ' REV- ' + toReturn.valueHighestRevision;
        }
        var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + ' REV- ' + toReturn.valueHighestRevision + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        var email = ["seci.scheduling@gmail.com"];
        Meteor.setTimeout(function() {
            for (var i = 0; i < email.length; i++) {
                console.log("sending mail Inserted");
                Meteor.call("sendMandrillEmailAttachment", email[i], subject, message, attachmentUrl, fileName, function(error, result) {
                    if (error) {
                        var ErrorJson = {
                            email: email[i],
                            message: message,
                            status: "false",
                            log: error,
                            date: date,
                            timeStamp: new Date()
                        };
                        EmailLogs.insert(ErrorJson);
                    } else {
                        if (result.message == "sent") {
                            var SentJson = {
                                email: email[i],
                                message: message,
                                status: "true",
                                date: date,
                                log: result,
                                timeStamp: new Date()
                            }
                            EmailLogs.insert(SentJson);
                        } else {
                            var ErrorJson = {
                                email: email[i],
                                message: message,
                                status: "false",
                                date: date,
                                log: result,
                                timeStamp: new Date()
                            };
                            EmailLogs.insert(ErrorJson);
                        }
                    }
                })
            }
        }, 10000);
        console.log("Discom Report send");
    }
});

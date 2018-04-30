Meteor.methods({
  SyncronCalledForRajasthanDayAheadRevisionDISCOMReport() {
    var RajasthanStateArray = ['Delhi(TPDDL)', 'Assam', 'Haryana', 'Odisha', 'Himachal Pradesh', 'Delhi(BRPL)', 'Delhi(BYPL)', 'Maharashtra', 'Jharkhand', 'Punjab'];
    var jsonArray = [];
    for (var i = 0; i < RajasthanStateArray.length; i++) {
      var discomValues = Discom.find({
        'discom_state': RajasthanStateArray[i]
      }).fetch();
      discomValues[0].spdIds.forEach(function(item) {
        if (item.spdState == 'Rajasthan') {
          var spdDataVar = Meteor.users.find({
            _id: item.spdId
          }).fetch();
          jsonArray.push({
            discomId: discomValues[0]._id,
            discomState: discomValues[0].discom_state,
            spdId: item.spdId,
            spdName: spdDataVar[0].profile.registration_form.name_of_spd,
            spdCapacity: spdDataVar[0].profile.registration_form.project_capicity + ' MW'
          })
        }
      })
    }
    // getting day ahead revision number for discom report
    var discomStateArr = [];
    var totalDayAheadRevision = 0;
    var nextDate = moment().add(1, 'days');
    var dateNextDay = moment(nextDate).format('DD-MM-YYYY');
    jsonArray.forEach(function(item) {
      var schedule = ScheduleSubmission.find({
        clientId: item.spdId,
        date: dateNextDay,
        day_ahead_rev: 1
      }).fetch();
      if (schedule.length > 0) {
        totalDayAheadRevision += Number(schedule.length);
        discomStateArr.push(item.discomState);
      }
    });
    if (totalDayAheadRevision > 0) {
      discomStateArr.forEach(function(discomState) {
        var disStateArr = [];
        var spdStateArr = [];
        disStateArr.push(discomState);
        spdStateArr.push('Rajasthan');
        Meteor.call('respectiveDiscomMail', dateNextDay, disStateArr, spdStateArr, 'DayAhead');
      });
      console.log('DISCOM Report !!, Day Ahead Revision, Rajasthan DISCOM Report Generating!');
    } else {
      console.log('DISCOM Report !!, Day Ahead Revision Not Done By Rajasthan SPDs!');
    }
  },

  dayAheadGujaratAtSix() { //////////////crone at 18:00
    var nextDay = moment().add(1, 'days');
    var date = moment(nextDay).format('DD-MM-YYYY'); //////nextday
    console.log('for date: ' + date);
    var discom = Discom.find({
      "discom_state": "Odisha"
    }).fetch();
    var idsArray = [];
    var data = Meteor.users.find({
      "profile.user_type": 'spd'
    }).fetch();
    discom[0].spdIds.forEach(function(item) {
      data.forEach(function(userItem) {
        if (userItem.profile.registration_form) {
          if (userItem.profile.registration_form.spd_state == "Gujarat") {
            if (item.spdId == userItem._id) {
              var spdDataVar = Meteor.users.find({
                _id: item.spdId
              }).fetch();
              item.spdName = spdDataVar[0].profile.registration_form.name_of_spd;
              idsArray.push(item);
            }
          }
        }
      });
    })

    var dateThis = date.split('-');
    dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
    dateThis.setDate(dateThis.getDate() - 1);
    moment(dateThis).format('DD-MM-YYYY');
    var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
    ///////////////LTOA number////////////////////
    var LTOAnumber = Discom.find({
      discom_state: "Odisha"
    }).fetch();
    var getLTOA = LTOAnumber[0].LTOA_number;
    var splitLtoa = getLTOA.split(',');
    var showLTOA = splitLtoa[0];
    /////////stu Rate of selected date///////////
    var splitDate = date.split('-');

    var stuData = StuCharges.find({
      month: splitDate[1],
      year: splitDate[2],
      state: "Gujarat"
    }, {
      sort: {
        $natural: -1
      },
      limit: 1
    }).fetch();

    var result = [];
    var lossResult = [];
    for (var j = 0; j < 96; j++) {
      var show = [];
      var showLoss = [];
      var bid = 0;
      var revTest = [];
      var revisedNames = [];
      var revisedIds = [];
      for (var i = 0; i < idsArray.length; i++) {
        var schedule = ScheduleSubmission.find({
          clientId: idsArray[i].spdId,
          date: date
        }).fetch();
        if (schedule != '') {
          schedule.forEach(function(item) {
            var jsonData = item.json;
            var length = jsonData.length;
            revTest.push(Number(length) - 1);
            var getSchedule = jsonData[length - 1];
            bid = getSchedule.data[j].bidMwh;
            if (Number(length) - 1 >= 1) {
              revisedNames.push(idsArray[i].spdName);
              revisedIds.push(idsArray[i].spdId);
            }
          })
        } else {
          bid = "0.00";
        }
        show.push(bid);
        var gujStu = stuData[0].stuRate;
        var percentage = Number(gujStu) / 100;
        var calculate = Number(bid) * Number(percentage);
        var errorGuj = Number(bid) - Number(calculate);
        showLoss.push(errorGuj.toFixed(2));
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

    var valueHighestRevision = _.uniq(revTest);
    var max_of_array = Math.max.apply(Math, valueHighestRevision);

    console.log('crone if day ahead: ' + max_of_array);
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

    var spdNamesHeadResult = [];
    var spdNamesHeadLoss = [];
    idsArray.forEach(function(item) {
      spdNamesHeadResult.push(item.spdName);
      spdNamesHeadLoss.push(item.spdName);
    })
    spdNamesHeadResult.push("TOTAL MW");
    spdNamesHeadLoss.push("MW AFTER LOSSES");

    var toReturn = {
      result: result,
      lossResult: lossResult,
      rate: stuData[0].stuRate + "%",
      scheduleDate: date,
      LTOA_number: showLTOA,
      spdNamesListTotal: spdNamesHeadResult,
      spdNamesListLossTotal: spdNamesHeadLoss,
      valueHighestRevision: max_of_array,
      spdState: "GUJARAT",
      discomSate: "ODISHA",
      minusOneDay: minusOneDay
    }

    if (toReturn.valueHighestRevision >= 1) {
      // updating SLDC Report in collection as per revision
      var dataVar = SLDCReports.find({
        schedule_date: date,
        sldc_state: 'Gujarat'
      }).fetch();
      if (dataVar.length > 0) {
        dataVar[0].data.push(toReturn);
        SLDCReports.update({
          _id: dataVar[0]._id
        }, {
          $set: {
            revision_no: max_of_array,
            data: dataVar[0].data
          }
        });
      }
      console.log('start crone');
      var excelName = date + '_' + "GUJ-ODISHA REV--" + toReturn.valueHighestRevision;
      var excelbuilder = require('msexcel-builder');
      var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/sldcReports/', excelName + '.xlsx');
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
      sheet1.border(2 * toReturn.spdNamesListTotal.length + 3, 18, {
        left: 'medium'
      });
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

      if (revisedIds.length > 0) {
        for (var t = 0; t < idsArray.length; t++) {
          for (var k = 0; k < revisedIds.length; k++) {
            if (idsArray[t].spdId == revisedIds[k]) {
              for (var j = 20; j < 116; j++) {
                sheet1.fill(t + 3, j, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
                });
                sheet1.fill(idsArray.length + 3, j, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
                });
                sheet1.fill(t + 3 + idsArray.length + 1, j, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
                });
                sheet1.fill(2 * idsArray.length + 4, j, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
                });
              }
            }
          }
        }
      }

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
        console.log('workbook saved ' + (ok ?
          'ok' :
          "sldc_Gujarat"));
      });

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('putimage', [
        process.env.PWD + '/.uploads/sldcReports/' + excelName + '.xlsx',
        process.env.PWD + '/public/img/secillogo.jpg',
        'A1',
        '0'
      ]);

      command.stdout.on('data', function(data) {
        //  console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
        //  console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
        //  console.log('child process exited with code ' + code);
      });

      var discomReports = {
        date: date,
        filePath: process.env.PWD + '/.uploads/sldcReports/' + excelName + '.xlsx',
        stateName: "Gujarat",
        fileName: date + '_' + "GUJ-ODISHA REV--" + toReturn.valueHighestRevision + '.xlsx',
        createdAt: new Date(),
        reportType: "sldc_report"
      }
      ReportUrls.insert(discomReports);

      // json insert to keep excel file details
      var jsonDetals = {
        date: date,
        revision_number: toReturn.valueHighestRevision,
        filePath: 'sldcReports/' + excelName + '.xlsx',
        fileName: date + '_' + "GUJ-ODISHA REV--" + toReturn.valueHighestRevision + '.xlsx',
        state: "Gujarat",
        reportType: "SLDC",
        timestamp: new Date(),
      };
      ExcelDetails.insert(jsonDetals);

      var data = ReportUrls.find({
        date: date,
        reportType: "sldc_report",
        stateName: "Gujarat"
      }, {
        sort: {
          $natural: -1
        },
        limit: 1
      }).fetch();
      var attachmentUrl = data[0].filePath;
      var fileName = data[0].fileName;
      var spdNames = revisedNames.join(',');
      var subject = "Schedule for " + date + " Rev " + toReturn.valueHighestRevision + " GUJ - ODISHA (Gen: " + spdNames + ")";
      var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + " Rev--" + toReturn.valueHighestRevision + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
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
              if (result.message == "queued") {
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
      console.log('SLDC data for Gujarat at six');
    } else {
      console.log('revision value is still zero for gujarat state');
    }
  },
  dayAheadMpAtTenWithAvaiblityAndForcasting() {
    var nextDay = moment().add(1, 'days');
    var date = moment(nextDay).format('DD-MM-YYYY'); // nextday
    var dateThis = date.split('-');
    dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
    dateThis.setDate(dateThis.getDate() - 1);
    moment(dateThis).format('DD-MM-YYYY');
    var minusOneDay = moment(dateThis).format('DD-MM-YYYY');

    var spdArray = [];
    var list = Meteor.users.find({
      "profile.user_type": 'spd',
      'profile.status': 'approved'
    }).fetch();
    var jsonArray = [];
    var discom = Discom.find().fetch();
    list.forEach(function(item) {
      if (item.profile.registration_form) {
        if (item.profile.registration_form.spd_state == 'MP' && item.profile.registration_form.transaction_type == "Inter") {
          spdArray.push(item._id);
          discom.forEach(function(DiscomItem) {
            DiscomItem.spdIds.forEach(function(testSpds) {
              if (testSpds.spdId == item._id) {
                jsonArray.push({
                  discomId: DiscomItem._id,
                  discomState: DiscomItem.discom_state,
                  spdId: item._id
                })
              }
            })
          })
        }
      }
    })
    var ChhattisgarhArray = [];
    var GoaArray = [];
    var BiharArray = [];
    jsonArray.forEach(function(item) {
      if (item.discomState == "Chhattisgarh") {
        ChhattisgarhArray.push(item.spdId);
      } else if (item.discomState == "Goa" || item.discomState == "Maharashtra") {
        GoaArray.push(item.spdId);
      } else if (item.discomState == "Bihar") {
        BiharArray.push(item.spdId);
      }
    });
    ///////////chattigarh data here///////////////////
    var ChhattisgarhAvaibilityArray = [];
    var ChhattisgarhArrayResult = [];
    for (var j = 0; j < 96; j++) {
      var show = [];
      var bid = 0;
      var showAavailability = [];
      var availability = 0;
      var revTimeCha = [];
      var revTestCha = [];
      var revisedIdsChha = [];

      for (var i = 0; i < ChhattisgarhArray.length; i++) {
        var schedule = ScheduleSubmission.find({
          clientId: ChhattisgarhArray[i],
          date: date
        }).fetch();
        if (schedule != '') {
          schedule.forEach(function(item) {
            var jsonData = item.json;
            var length = jsonData.length;
            revTestCha.push(Number(length) - 1);
            var getSchedule = jsonData[length - 1];
            availability = getSchedule.data[j].availability;
            bid = getSchedule.data[j].bidMwh;
            if (Number(length) - 1 >= 1) {
              revisedIdsChha.push(ChhattisgarhArray[i]);
            }
          })
          revTimeCha.push(schedule[0].actual_revision_time);
        } else {
          availability = "0.00";
          bid = "0.00";
          revTestCha.push('0');
        }
        showAavailability.push(availability);
        show.push(bid);
      }
      var countAavailability = 0;
      var count = 0;
      for (var i = show.length; i--;) {
        countAavailability += Number(showAavailability[i]);
        count += Number(show[i]);
      }
      showAavailability.push(countAavailability.toFixed(2));
      show.push(count.toFixed(2));
      ChhattisgarhAvaibilityArray.push(showAavailability);
      ChhattisgarhArrayResult.push(show);
    }

    ////////////goa data here////////////////
    var GoaAvaibilityArray = [];
    var GoaArrayResult = [];
    for (var j = 0; j < 96; j++) {
      var showAavailability = [];
      var show = [];
      var availability = 0;
      var bid = 0;
      var revTestGoa = [];
      var revTimeGoa = [];
      var revisedIdsGoa = [];
      for (var i = 0; i < GoaArray.length; i++) {
        var schedule = ScheduleSubmission.find({
          clientId: GoaArray[i],
          date: date
        }).fetch();
        if (schedule != '') {
          schedule.forEach(function(item) {
            var jsonData = item.json;
            var length = jsonData.length;
            revTestGoa.push(Number(length) - 1);
            var getSchedule = jsonData[length - 1];
            availability = getSchedule.data[j].availability;
            bid = getSchedule.data[j].bidMwh;
            if (Number(length) - 1 >= 1) {
              revisedIdsGoa.push(GoaArray[i]);
            }
          })
          revTimeGoa.push(schedule[0].actual_revision_time);
        } else {
          availability = "0.00";
          bid = "0.00";
          revTestGoa.push('0');
        }
        showAavailability.push(availability);
        show.push(bid);
      }
      var countAavailability = 0;
      var count = 0;
      for (var i = show.length; i--;) {
        countAavailability += Number(showAavailability[i]);
        count += Number(show[i]);
      }
      showAavailability.push(countAavailability.toFixed(2));
      show.push(count.toFixed(2));
      GoaAvaibilityArray.push(showAavailability);
      GoaArrayResult.push(show);
    }

    ///bihar data here/////////////////
    var BiharAvaibilityArray = [];
    var BiharArrayResult = [];
    for (var j = 0; j < 96; j++) {
      var showAvaibility = [];
      var show = [];
      var availability = 0;
      var bid = 0;
      var revTestBihar = [];
      var revTimeBihar = [];
      var revisedIdsBihar = [];
      for (var i = 0; i < BiharArray.length; i++) {
        var schedule = ScheduleSubmission.find({
          clientId: BiharArray[i],
          date: date
        }).fetch();
        if (schedule != '') {
          schedule.forEach(function(item) {
            var jsonData = item.json;
            var length = jsonData.length;
            revTestBihar.push(Number(length) - 1);
            var getSchedule = jsonData[length - 1];
            availability = getSchedule.data[j].availability;
            bid = getSchedule.data[j].bidMwh;
            if (Number(length) - 1 >= 1) {
              revisedIdsBihar.push(BiharArray[i]);
            }
          })
          revTimeBihar.push(schedule[0].actual_revision_time);
        } else {
          availability = "0.00";
          bid = "0.00";
          revTestBihar.push('0');
        }
        showAvaibility.push(availability);
        show.push(bid);
      }
      BiharAvaibilityArray.push(showAvaibility);
      BiharArrayResult.push(show);
    }

    var AvaibilityArraySumChattisgarh = [];
    var AvaibilityArraySumGoa = [];
    var ArraySumChattisgarh = [];
    var ArraySumGoa = [];
    for (var z = 0; z < ChhattisgarhArrayResult[0].length; z++) {
      var AvaibilitysumChattisgarh = 0;
      var AvaibilitysumGoa = 0;
      var sumChattisgarh = 0;
      var sumGoa = 0;
      for (var k = 0; k < ChhattisgarhArrayResult.length; k++) {
        AvaibilitysumChattisgarh += Number(ChhattisgarhAvaibilityArray[k][z]);
        AvaibilitysumGoa += Number(GoaAvaibilityArray[k][z]);
        sumChattisgarh += Number(ChhattisgarhArrayResult[k][z]);
        sumGoa += Number(GoaArrayResult[k][z]);
      }
      AvaibilityArraySumChattisgarh.push((Number(AvaibilitysumChattisgarh) / 4000).toFixed(7));
      AvaibilityArraySumGoa.push((Number(AvaibilitysumGoa) / 4000).toFixed(7));
      ArraySumChattisgarh.push((Number(sumChattisgarh) / 4000).toFixed(7));
      ArraySumGoa.push((Number(sumGoa) / 4000).toFixed(7));
    }
    ChhattisgarhAvaibilityArray.push(AvaibilityArraySumChattisgarh);
    GoaAvaibilityArray.push(AvaibilityArraySumGoa);
    ChhattisgarhArrayResult.push(ArraySumChattisgarh);
    GoaArrayResult.push(ArraySumGoa);

    var AvaibilityArraySumBihar = [];
    var ArraySumBihar = [];
    for (var z = 0; z < BiharArrayResult[0].length; z++) {
      var AvaibilitysumBihar = 0;
      var sumBihar = 0;
      for (var k = 0; k < BiharArrayResult.length; k++) {
        AvaibilitysumBihar += Number(BiharAvaibilityArray[k][z]);
        sumBihar += Number(BiharArrayResult[k][z]);
      }
      AvaibilityArraySumBihar.push((Number(AvaibilitysumBihar) / 4000).toFixed(7));
      ArraySumBihar.push((Number(sumBihar) / 4000).toFixed(7));
    }
    BiharAvaibilityArray.push(AvaibilityArraySumBihar);
    BiharArrayResult.push(ArraySumBihar);

    var mergeTimeArray = revTimeCha.concat(revTimeGoa, revTimeBihar);
    maximumTime = mergeTimeArray[0];

    for (c = 1; c < mergeTimeArray.length; c++) {
      if (mergeTimeArray[c] > maximumTime) {
        maximumTime = mergeTimeArray[c];
        location = c + 1;
      }
    }
    var mergeRevArray = revTestCha.concat(revTestGoa, revTestBihar);
    var valueHighestRevision = _.uniq(mergeRevArray);
    var max_of_array = Math.max.apply(Math, valueHighestRevision);
    var allRevisedIds = revisedIdsChha.concat(revisedIdsGoa, revisedIdsBihar);

    var toReturn = {
      ChhattisgarhArrayResult: ChhattisgarhArrayResult,
      GoaArrayResult: GoaArrayResult,
      BiharArrayResult: BiharArrayResult,
      ChhattisgarhAvaibilityArray: ChhattisgarhAvaibilityArray,
      GoaAvaibilityArray: GoaAvaibilityArray,
      BiharAvaibilityArray: BiharAvaibilityArray,
      scheduleDate: date,
      minusOneDay: minusOneDay,
      valueHighestRevision: max_of_array,
      lastRevison: maximumTime,
      allRevisedIds: allRevisedIds
    }

    if (toReturn.valueHighestRevision >= 1) {
      var dataVar = SLDCReports.find({
        schedule_date: date,
        sldc_state: 'MP'
      }).fetch();
      if (dataVar.length > 0) {
        var currentRevNo = Number(max_of_array);
        var previousRevNo = Number(dataVar[0].revision_no);
        if (currentRevNo != previousRevNo) {
          dataVar[0].data.push(toReturn);
          SLDCReports.update({
            _id: dataVar[0]._id
          }, {
            $set: {
              revision_no: max_of_array,
              data: dataVar[0].data
            }
          });
        } else {
          console.log('MP, Revision no. is same for the date of ' + date);
        }
      } else {
        var dataArr = [];
        dataArr.push(toReturn);
        var json = {
          schedule_date: date,
          revision_no: max_of_array,
          sldc_state: 'MP',
          data: dataArr,
          timestamp: new Date()
        };
        SLDCReports.insert(json);
      }
      var excelName = 'SOLAR SCHEDULE TO MOSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx';
      var excelbuilder = require('msexcel-builder');
      var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/sldcReports/', excelName + '.xlsx');
      var sheet1 = workbook.createSheet('sheet1', 100, 126);

      sheet1.set(1, 2, 'Availability & Forecast of SECI Solar Power plants, In MW(Ex-bus At Pooling S/S) To Other States.');
      sheet1.align(1, 2, 'center');
      sheet1.valign(1, 2, 'center');
      sheet1.font(1, 2, {
        bold: 'true'
      });
      sheet1.merge({
        col: 1,
        row: 2
      }, {
        col: 15,
        row: 2
      });
      sheet1.set(1, 3, 'Date:');
      sheet1.set(1, 4, 'Schedule for date:');
      sheet1.set(1, 5, 'REV. No.:');
      sheet1.set(1, 6, 'TIME');
      sheet1.set(1, 7, 'Remarks:');
      sheet1.merge({
        col: 1,
        row: 7
      }, {
        col: 2,
        row: 7
      });
      sheet1.set(1, 8, 'BLK No.');
      sheet1.set(2, 8, 'FROM TIME');
      sheet1.set(3, 8, 'TO TIME');
      sheet1.set(3, 3, toReturn.minusOneDay);
      sheet1.set(3, 4, toReturn.scheduleDate);
      sheet1.set(3, 5, toReturn.valueHighestRevision);
      sheet1.set(3, 6, toReturn.lastRevison);
      sheet1.set(3, 7, '');




      for (var i = 3; i <= 7; i++) {
        sheet1.align(3, i, 'center');
        sheet1.valign(3, i, 'center');
        sheet1.align(3, 8, 'center');
        sheet1.valign(3, 8, 'center');
        sheet1.border(1, i, {
          left: 'thin',
          top: 'thin',
          bottom: 'thin'
        });
        sheet1.border(2, i, {
          top: 'thin',
          right: 'thin',
          bottom: 'thin'
        });
        sheet1.border(3, i, {
          left: 'thin',
          top: 'thin',
          right: 'thin',
          bottom: 'thin'
        });
      }
      sheet1.width(1, 7);
      sheet1.width(3, 14);
      sheet1.width(2, 10);

      sheet1.set(4, 7, '50 MW_Waneep_Solar');
      sheet1.merge({
        col: 4,
        row: 7
      }, {
        col: 5,
        row: 7
      });
      sheet1.set(4, 8, 'Availability in MW');
      sheet1.set(5, 8, 'Forecast in MW');
      sheet1.set(6, 7, '20 MW_Focal_Energy_Solar');
      sheet1.merge({
        col: 6,
        row: 7
      }, {
        col: 7,
        row: 7
      });
      sheet1.set(6, 8, 'Availability in MW');
      sheet1.set(7, 8, 'Forecast in MW');
      sheet1.set(8, 7, '70 MW_SECI_Solar_Chattisgarh');
      sheet1.merge({
        col: 8,
        row: 7
      }, {
        col: 8,
        row: 8
      });
      sheet1.set(9, 7, '40 MW_IL&FS_Solar');
      sheet1.merge({
        col: 9,
        row: 7
      }, {
        col: 10,
        row: 7
      });
      sheet1.set(9, 8, 'Availability in MW');
      sheet1.set(10, 8, 'Forecast in MW');
      sheet1.set(11, 7, '25 MW_SECI_Solar_GOA');
      sheet1.merge({
        col: 11,
        row: 7
      }, {
        col: 11,
        row: 8
      });
      sheet1.set(12, 7, '15 MW_SECI_Solar_Maharashtra');
      sheet1.merge({
        col: 12,
        row: 7
      }, {
        col: 12,
        row: 8
      });
      sheet1.set(13, 7, '10 MW_Focal_Renewable_Solar');
      sheet1.merge({
        col: 13,
        row: 7
      }, {
        col: 14,
        row: 7
      });
      sheet1.set(13, 8, 'Availability in MW');
      sheet1.set(14, 8, 'Forecast in MW');
      sheet1.set(15, 7, '10 MW_SECI_Solar_Bihar');
      sheet1.merge({
        col: 15,
        row: 7
      }, {
        col: 15,
        row: 8
      });
      sheet1.height(8, 40);
      sheet1.height(8, 40);
      sheet1.width(4, 12);
      sheet1.width(5, 12);
      sheet1.width(6, 12);
      sheet1.width(7, 12);
      sheet1.width(8, 14);
      sheet1.width(9, 12);
      sheet1.width(10, 12);
      sheet1.width(11, 14);
      sheet1.width(12, 14);
      sheet1.width(13, 13);
      sheet1.width(14, 13);
      sheet1.width(15, 14);
      for (var i = 1; i < 20; i++) {
        sheet1.wrap(i, 7, 'true');
        sheet1.font(i, 7, {
          sz: '11',
          bold: 'true'
        });
        sheet1.valign(i, 7, 'center');
        sheet1.align(i + 1, 7, 'center');
        sheet1.wrap(i, 8, 'true');
        sheet1.font(i, 8, {
          sz: '11',
          bold: 'true'
        });
        sheet1.valign(i, 8, 'center');
        sheet1.align(i, 8, 'center');
      }


      for (var s = 9; s < 105; s++) {
        for (var i = 1; i < 16; i++) {
          sheet1.border(i, 7, {
            left: 'thin',
            top: 'thin',
            right: 'thin',
            bottom: 'thin'
          });
          sheet1.border(i, 8, {
            left: 'thin',
            top: 'thin',
            right: 'thin',
            bottom: 'thin'
          });
          sheet1.border(i, s, {
            left: 'thin',
            top: 'thin',
            right: 'thin',
            bottom: 'thin'
          });
          sheet1.border(i, 105, {
            left: 'thin',
            top: 'thin',
            right: 'thin',
            bottom: 'thin'
          });
          sheet1.border(2, 106, {
            top: 'thin'
          });
          sheet1.border(3, 106, {
            top: 'thin'
          });
          sheet1.align(i, s, 'center');
          sheet1.valign(i - 9, s, 'center');
          sheet1.align(i, 105, 'center');
        }

        sheet1.set(1, s, s - 8);
        sheet1.set(2, s, returnSlots("from", s - 9));
        sheet1.set(3, s, returnSlots("to", s - 9));
        // Chhattisgarh Availability
        sheet1.set(4, s, returnHelper(toReturn.ChhattisgarhAvaibilityArray, 1, s - 9));
        // Chhattisgarh Forcast Schedule
        sheet1.set(5, s, returnHelper(toReturn.ChhattisgarhArrayResult, 1, s - 9));
        // Chhattisgarh Availability
        sheet1.set(6, s, returnHelper(toReturn.ChhattisgarhAvaibilityArray, 0, s - 9));
        // Chhattisgarh Forcast Schedule
        sheet1.set(7, s, returnHelper(toReturn.ChhattisgarhArrayResult, 0, s - 9));
        // Chhattisgarh Forcast Schedule Total
        sheet1.set(8, s, returnHelper(toReturn.ChhattisgarhArrayResult, 2, s - 9));
        // Goa & Maharashtra Availability
        sheet1.set(9, s, returnHelper(toReturn.GoaAvaibilityArray, 2, s - 9));
        // Goa & Maharashtra Forcast Schedule Total
        sheet1.set(10, s, returnHelper(toReturn.GoaArrayResult, 2, s - 9));
        // Goa Forcast Schedule
        sheet1.set(11, s, returnHelper(toReturn.GoaArrayResult, 0, s - 9));
        // Maharashtra Forcast Schedule
        sheet1.set(12, s, returnHelper(toReturn.GoaArrayResult, 1, s - 9));
        // Bihar Availability
        sheet1.set(13, s, returnHelper(toReturn.BiharAvaibilityArray, 0, s - 9));
        // Bihar Forcast Schedule
        sheet1.set(14, s, returnHelper(toReturn.BiharArrayResult, 0, s - 9));
        // Bihar Forcast Schedule Total
        sheet1.set(15, s, returnHelper(toReturn.BiharArrayResult, 0, s - 9));
      }

      sheet1.set(1, 105, 'TOTAL(MUs)');
      sheet1.set(3, 7, '-');
      sheet1.merge({
        col: 1,
        row: 105
      }, {
        col: 3,
        row: 105
      });
      // Chhattisgarh Availability Total
      sheet1.set(4, 105, returnHelper(toReturn.ChhattisgarhAvaibilityArray, 1, 96));
      // Chhattisgarh Forcast Schedule Total
      sheet1.set(5, 105, returnHelper(toReturn.ChhattisgarhArrayResult, 1, 96));
      // Chhattisgarh Availability Total
      sheet1.set(6, 105, returnHelper(toReturn.ChhattisgarhAvaibilityArray, 0, 96));
      // Chhattisgarh Forcast Schedule Total
      sheet1.set(7, 105, returnHelper(toReturn.ChhattisgarhArrayResult, 0, 96));
      // Chhattisgarh All Forcast Schedule Total
      sheet1.set(8, 105, returnHelper(toReturn.ChhattisgarhArrayResult, 2, 96));
      // Goa & Maharashtra Availability Total
      sheet1.set(9, 105, returnHelper(toReturn.GoaAvaibilityArray, 2, 96));
      // Goa & Maharashtra All Forcast Schedule Total
      sheet1.set(10, 105, returnHelper(toReturn.GoaArrayResult, 2, 96));
      // Goa Forcast Schedule Total
      sheet1.set(11, 105, returnHelper(toReturn.GoaArrayResult, 0, 96));
      // Maharashtra Forcast Schedule Total
      sheet1.set(12, 105, returnHelper(toReturn.GoaArrayResult, 1, 96));
      // Bihar Availability Total
      sheet1.set(13, 105, returnHelper(toReturn.BiharAvaibilityArray, 0, 96));
      // Bihar Forcast Schedule Total
      sheet1.set(14, 105, returnHelper(toReturn.BiharArrayResult, 0, 96));
      // Bihar Forcast All Schedule Total
      sheet1.set(15, 105, returnHelper(toReturn.BiharArrayResult, 0, 96));

      var colourArray = toReturn.allRevisedIds;
      if (colourArray.length > 0) {
        var revisedStateArr = [];
        for (var c = 0; c < colourArray.length; c++) {
          var colNum = 0;
          if (colourArray[c] == 'Wai2eEX7j6oALzKFg') { //Chhattisgarh
            revisedStateArr.push('Chhattisgarh');
            colNum = 5;
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(colNum, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
              sheet1.fill(8, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
            }
          } else if (colourArray[c] == 'iu96Skq5kcbbMBioy') { //Chhattisgarh
            revisedStateArr.push('Chhattisgarh');
            colNum = 7;
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(colNum, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
              sheet1.fill(8, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
            }
          } else if (colourArray[c] == 'hpRpJo3ZHCpSsKPdg') { //GOA
            revisedStateArr.push('Goa');
            colNum = 11;
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(colNum, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
              sheet1.fill(10, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
            }
          } else if (colourArray[c] == 'JjFmew8JtQyF3BAip') { //MAHARASTRA
            revisedStateArr.push('Maharashtra');
            colNum = 12;
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(colNum, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
              sheet1.fill(10, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
            }
          } else if (colourArray[c] == 'D2u7cF4P7wtZkN2Cq') { //Bihar
            revisedStateArr.push('Bihar');
            colNum = 14;
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(colNum, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
              sheet1.fill(15, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
            }
          }
        }
      }
      var uniqRevisedState = _.uniq(revisedStateArr);
      var transactionFromTo = '';
      for (var i = 0; i < uniqRevisedState.length; i++) {
        if (i == Number(uniqRevisedState.length) - 1) {
          var newTransaction = 'MP-' + uniqRevisedState[i];
        } else {
          var newTransaction = 'MP-' + uniqRevisedState[i] + ", ";
        }
        transactionFromTo += newTransaction;
      }

      workbook.save(function(ok) {
        console.log('workbook saved ' + (ok ?
          'ok' :
          "MP"));
      });

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('putimage', [
        process.env.PWD + '/.uploads/sldcReports/' + excelName + '.xlsx',
        process.env.PWD + '/public/img/secillogo.jpg',
        '',
        '1'
      ]);

      command.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
        console.log('child process exited with code ' + code);
      });

      var toInsert = {
        date: date,
        filePath: process.env.PWD + '/.uploads/sldcReports/' + excelName + '.xlsx',
        stateName: "MP",
        fileName: 'SOLAR SCHEDULE TO MOSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
        createdAt: new Date(),
        reportType: "sldc_report"
      }
      ReportUrls.insert(toInsert);

      // json insert to keep excel file details
      var jsonDetals = {
        date: date,
        revision_number: toReturn.valueHighestRevision,
        filePath: 'sldcReports/' + excelName + '.xlsx',
        fileName: 'SOLAR SCHEDULE TO MOSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
        state: "MP",
        reportType: "SLDC",
        timestamp: new Date(),
      };
      ExcelDetails.insert(jsonDetals);

      var data = ReportUrls.find({
        date: date,
        reportType: "sldc_report",
        stateName: "MP"
      }, {
        sort: {
          $natural: -1
        },
        limit: 1
      }).fetch();
      var attachmentUrl = data[0].filePath;
      var fileName = data[0].fileName;

      var email = ["seci.scheduling@gmail.com"];
      var subject = "SOLAR SCHEDULE TO MPSLDC FOR " + date + " Rev- " + toReturn.valueHighestRevision + " (" + transactionFromTo + ")";
      // var subject = "SOLAR SCHEDULE TO MPSLDC FOR " + date + " Rev- " + toReturn.valueHighestRevision + " (MP-Goa, MP- Maharashtra, MP- Chattisgarh and MP-Bihar)";
      var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + " DayAhead Revision-" + toReturn.valueHighestRevision + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

      Meteor.setTimeout(function() {
        for (var i = 0; i < email.length; i++) {
          console.log("sending mail Inserted");
          console.log('fileName: ' + fileName);
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
              if (result.message == "queued") {
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
      console.log("Report MP Successfully created");
    } else {
      console.log('Day Ahead revision value is still zero for MP state');
    }
  },
  dayAheadMpAtTen() {
    var nextDay = moment().add(1, 'days');
    var date = moment(nextDay).format('DD-MM-YYYY'); //////nextday
    console.log(date);
    var dateThis = date.split('-');
    dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
    dateThis.setDate(dateThis.getDate() - 1);
    moment(dateThis).format('DD-MM-YYYY');
    var minusOneDay = moment(dateThis).format('DD-MM-YYYY');

    var spdArray = [];
    var list = Meteor.users.find({
      "profile.user_type": 'spd',
      'profile.status': 'approved'
    }).fetch();
    var jsonArray = [];
    var discom = Discom.find().fetch();
    list.forEach(function(item) {
      if (item.profile.registration_form) {
        if (item.profile.registration_form.spd_state == 'MP' && item.profile.registration_form.transaction_type == "Inter") {
          spdArray.push(item._id);
          discom.forEach(function(DiscomItem) {
            DiscomItem.spdIds.forEach(function(testSpds) {
              if (testSpds.spdId == item._id) {
                jsonArray.push({
                  discomId: DiscomItem._id,
                  discomState: DiscomItem.discom_state,
                  spdId: item._id
                })
              }
            })
          })
        }
      }
    })

    console.log(jsonArray);
    var ChhattisgarhArray = [];
    var GoaArray = [];
    var BiharArray = [];
    jsonArray.forEach(function(item) {
      if (item.discomState == "Chhattisgarh") {
        ChhattisgarhArray.push(item.spdId);
      } else if (item.discomState == "Goa" || item.discomState == "Maharashtra") {
        GoaArray.push(item.spdId);
      } else if (item.discomState == "Bihar") {
        BiharArray.push(item.spdId);
      }
    });

    ///////////chattigarh data here///////////////////
    var ChhattisgarhArrayResult = [];
    for (var j = 0; j < 96; j++) {
      var show = [];
      var bid = 0;
      var revTimeCha = [];
      var revTestCha = [];
      var revisedIdsChha = [];
      for (var i = 0; i < ChhattisgarhArray.length; i++) {
        var schedule = ScheduleSubmission.find({
          clientId: ChhattisgarhArray[i],
          date: date
        }).fetch();
        if (schedule != '') {
          schedule.forEach(function(item) {
            var jsonData = item.json;
            var length = jsonData.length;
            revTestCha.push(Number(length) - 1);
            var getSchedule = jsonData[length - 1];
            bid = getSchedule.data[j].bidMwh;
            if (Number(length) - 1 >= 1) {
              revisedIdsChha.push(ChhattisgarhArray[i]);
            }
          })
          revTimeCha.push(schedule[0].actual_revision_time);
        } else {
          bid = "0.00";
          revTestCha.push('0');
        }
        show.push(bid);
      }
      var count = 0;
      for (var i = show.length; i--;) {
        count += Number(show[i]);
      }
      show.push(count.toFixed(2));
      ChhattisgarhArrayResult.push(show);
    }

    ////////////goa data here////////////////
    var GoaArrayResult = [];
    for (var j = 0; j < 96; j++) {
      var show = [];
      var bid = 0;
      var revTestGoa = [];
      var revTimeGoa = [];
      var revisedIdsGoa = [];
      for (var i = 0; i < GoaArray.length; i++) {
        var schedule = ScheduleSubmission.find({
          clientId: GoaArray[i],
          date: date
        }).fetch();
        if (schedule != '') {
          schedule.forEach(function(item) {
            var jsonData = item.json;
            var length = jsonData.length;
            revTestGoa.push(Number(length) - 1);
            var getSchedule = jsonData[length - 1];
            bid = getSchedule.data[j].bidMwh;
            if (Number(length) - 1 >= 1) {
              revisedIdsGoa.push(GoaArray[i]);
            }
          })
          revTimeGoa.push(schedule[0].actual_revision_time);
        } else {
          bid = "0.00";
          revTestGoa.push('0');
        }
        show.push(bid);
      }
      var count = 0;
      for (var i = show.length; i--;) {
        count += Number(show[i]);
      }
      show.push(count.toFixed(2));
      GoaArrayResult.push(show);
    }

    ///bihar data here/////////////////
    var BiharArrayResult = [];
    for (var j = 0; j < 96; j++) {
      var show = [];
      var bid = 0;
      var revTestBihar = [];
      var revTimeBihar = [];
      var revisedIdsBihar = [];
      for (var i = 0; i < BiharArray.length; i++) {
        var schedule = ScheduleSubmission.find({
          clientId: BiharArray[i],
          date: date
        }).fetch();
        if (schedule != '') {
          schedule.forEach(function(item) {
            var jsonData = item.json;
            var length = jsonData.length;
            revTestBihar.push(Number(length) - 1);
            var getSchedule = jsonData[length - 1];
            bid = getSchedule.data[j].bidMwh;
            if (Number(length) - 1 >= 1) {
              revisedIdsBihar.push(BiharArray[i]);
            }
          })
          revTimeBihar.push(schedule[0].actual_revision_time);
        } else {
          bid = "0.00";
          revTestBihar.push('0');
        }
        show.push(bid);
      }
      BiharArrayResult.push(show);
    }

    var ArraySumChattisgarh = [];
    var ArraySumGoa = [];
    for (var z = 0; z < ChhattisgarhArrayResult[0].length; z++) {
      var sumChattisgarh = 0;
      var sumGoa = 0;
      for (var k = 0; k < ChhattisgarhArrayResult.length; k++) {
        sumChattisgarh += Number(ChhattisgarhArrayResult[k][z]);
        sumGoa += Number(GoaArrayResult[k][z]);
      }
      ArraySumChattisgarh.push((Number(sumChattisgarh) / 4000).toFixed(7));
      ArraySumGoa.push((Number(sumGoa) / 4000).toFixed(7));
    }
    ChhattisgarhArrayResult.push(ArraySumChattisgarh);
    GoaArrayResult.push(ArraySumGoa);

    var ArraySumBihar = [];
    for (var z = 0; z < BiharArrayResult[0].length; z++) {
      var sumBihar = 0;
      for (var k = 0; k < BiharArrayResult.length; k++) {
        sumBihar += Number(BiharArrayResult[k][z]);
      }
      ArraySumBihar.push((Number(sumBihar) / 4000).toFixed(7));
    }
    BiharArrayResult.push(ArraySumBihar);

    var mergeTimeArray = revTimeCha.concat(revTimeGoa, revTimeBihar);
    maximumTime = mergeTimeArray[0];

    for (c = 1; c < mergeTimeArray.length; c++) {
      if (mergeTimeArray[c] > maximumTime) {
        maximumTime = mergeTimeArray[c];
        location = c + 1;
      }
    }
    var mergeRevArray = revTestCha.concat(revTestGoa, revTestBihar);
    console.log('merge rev ary ' + mergeRevArray);

    var valueHighestRevision = _.uniq(mergeRevArray);
    var max_of_array = Math.max.apply(Math, valueHighestRevision);

    console.log('rev number ' + max_of_array);

    var allRevisedIds = revisedIdsChha.concat(revisedIdsGoa, revisedIdsBihar);

    var toReturn = {
      ChhattisgarhArrayResult: ChhattisgarhArrayResult,
      GoaArrayResult: GoaArrayResult,
      BiharArrayResult: BiharArrayResult,
      scheduleDate: date,
      minusOneDay: minusOneDay,
      valueHighestRevision: max_of_array,
      lastRevison: maximumTime,
      allRevisedIds: allRevisedIds
    }

    if (toReturn.valueHighestRevision >= 1) {
      var dataVar = SLDCReports.find({
        schedule_date: date,
        sldc_state: 'MP'
      }).fetch();
      if (dataVar.length > 0) {
        var currentRevNo = Number(max_of_array);
        var previousRevNo = Number(dataVar[0].revision_no);
        if (currentRevNo != previousRevNo) {
          dataVar[0].data.push(toReturn);
          SLDCReports.update({
            _id: dataVar[0]._id
          }, {
            $set: {
              revision_no: max_of_array,
              data: dataVar[0].data
            }
          });
        } else {
          console.log('MP, Revision no. is same for the date of ' + date);
        }
      } else {
        var dataArr = [];
        dataArr.push(toReturn);
        var json = {
          schedule_date: date,
          revision_no: max_of_array,
          sldc_state: 'MP',
          data: dataArr,
          timestamp: new Date()
        };
        SLDCReports.insert(json);
      }
      var excelName = 'SOLAR SCHEDULE TO MOSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx';
      var excelbuilder = require('msexcel-builder');
      var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/sldcReports/', excelName + '.xlsx');
      var sheet1 = workbook.createSheet('sheet1', 100, 126);
      sheet1.set(3, 2, 'Requisition For Injection Schedule Of Power In MW(Ex-bus At Pooling S/S) To Other States.');
      sheet1.set(1, 3, 'Date:');
      sheet1.set(1, 4, 'Schedule for date:');
      sheet1.set(1, 5, 'REV. No.:');
      sheet1.set(1, 6, 'TIME');
      sheet1.set(1, 7, 'Remarks:');
      sheet1.set(1, 8, 'BLK No.');
      sheet1.set(2, 8, 'FROM TIME');
      sheet1.set(3, 8, 'TO TIME');
      sheet1.set(3, 3, toReturn.minusOneDay);
      sheet1.set(3, 4, toReturn.scheduleDate);
      sheet1.set(3, 5, toReturn.valueHighestRevision);
      sheet1.set(3, 6, toReturn.lastRevison);
      sheet1.set(3, 7, '-');
      for (var i = 3; i <= 7; i++) {
        sheet1.merge({
          col: 1,
          row: i
        }, {
          col: 2,
          row: i
        });
        sheet1.align(3, i, 'center');
        sheet1.align(3, 8, 'center');
        sheet1.border(1, i, {
          left: 'medium',
          top: 'medium',
          right: 'medium',
          bottom: 'medium'
        });
        sheet1.border(3, i, {
          left: 'medium',
          top: 'medium',
          right: 'medium',
          bottom: 'medium'
        });
      }
      sheet1.width(1, 7);
      sheet1.width(3, 14);
      sheet1.width(2, 10);

      sheet1.set(4, 8, '50 MW_Waneep_Solar');
      sheet1.set(5, 8, '20 MW_Focal_Energy_Solar');
      sheet1.set(6, 8, '70 MW_SECI_Solar_Chattisgarh');
      sheet1.set(7, 8, '40 MW_IL&FS_Solar');
      sheet1.set(8, 8, '25 MW_SECI_Solar_GOA');
      sheet1.set(9, 8, '15 MW_SECI_Solar_Maharashtra');
      sheet1.set(10, 8, '10 MW_Focal_Renewable_Solar');
      sheet1.set(11, 8, '10 MW_SECI_Solar_Bihar');
      sheet1.width(4, 20);
      sheet1.width(5, 25);
      sheet1.width(6, 27);
      sheet1.width(7, 19);
      sheet1.width(8, 22);
      sheet1.width(9, 29);
      sheet1.width(10, 28);
      sheet1.width(11, 22);

      for (var s = 9; s < 105; s++) {
        for (var i = 1; i < 12; i++) {
          sheet1.border(i, 8, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
          });
          sheet1.border(i, s, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
          });
          sheet1.border(i, 105, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
          });
          sheet1.align(i, s, 'center');
          sheet1.align(i, 105, 'center');
        }

        sheet1.set(1, s, s - 8);
        sheet1.set(2, s, returnSlots("from", s - 9));
        sheet1.set(3, s, returnSlots("to", s - 9));

        sheet1.set(4, s, returnHelper(toReturn.ChhattisgarhArrayResult, 1, s - 9));
        sheet1.set(5, s, returnHelper(toReturn.ChhattisgarhArrayResult, 0, s - 9));
        sheet1.set(6, s, returnHelper(toReturn.ChhattisgarhArrayResult, 2, s - 9));

        sheet1.set(7, s, returnHelper(toReturn.GoaArrayResult, 2, s - 9));
        sheet1.set(8, s, returnHelper(toReturn.GoaArrayResult, 0, s - 9));
        sheet1.set(9, s, returnHelper(toReturn.GoaArrayResult, 1, s - 9));

        sheet1.set(10, s, returnHelper(toReturn.BiharArrayResult, 0, s - 9));
        sheet1.set(11, s, returnHelper(toReturn.BiharArrayResult, 0, s - 9));
      }

      sheet1.set(1, 105, 'TOTAL(MUs)');
      sheet1.merge({
        col: 1,
        row: 105
      }, {
        col: 3,
        row: 105
      });

      sheet1.set(4, 105, returnHelper(toReturn.ChhattisgarhArrayResult, 1, 96));
      sheet1.set(5, 105, returnHelper(toReturn.ChhattisgarhArrayResult, 0, 96));
      sheet1.set(6, 105, returnHelper(toReturn.ChhattisgarhArrayResult, 2, 96));

      sheet1.set(7, 105, returnHelper(toReturn.GoaArrayResult, 2, 96));
      sheet1.set(8, 105, returnHelper(toReturn.GoaArrayResult, 0, 96));
      sheet1.set(9, 105, returnHelper(toReturn.GoaArrayResult, 1, 96));

      sheet1.set(10, 105, returnHelper(toReturn.BiharArrayResult, 0, 96));
      sheet1.set(11, 105, returnHelper(toReturn.BiharArrayResult, 0, 96));

      if (toReturn.allRevisedIds.length > 0) {
        var colourArray = [
          ChhattisgarhArray[1],
          ChhattisgarhArray[0],
          'totalCha',
          'totalGoa',
          GoaArray[0],
          GoaArray[1],
          BiharArray[0],
          'totalbihar'
        ];

        for (var i = 0; i < colourArray.length; i++) {
          for (var j = 0; j < toReturn.allRevisedIds.length; j++) {
            if (toReturn.allRevisedIds[j] == colourArray[i]) {
              for (var t = 9; t <= 104; t++) {
                sheet1.fill(i + 4, t, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
                });
              }
              sheet1.set(4 + i, 107, 'colour');
            }
          }
        }
        for (var j = 0; j < toReturn.allRevisedIds.length; j++) {
          if (toReturn.allRevisedIds[j] == GoaArray[0] || toReturn.allRevisedIds[j] == GoaArray[1]) {
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(7, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
              sheet1.set(7, 107, 'colour');
            }
          }
        }

        for (var j = 0; j < toReturn.allRevisedIds.length; j++) {
          if (toReturn.allRevisedIds[j] == ChhattisgarhArray[0] || toReturn.allRevisedIds[j] == ChhattisgarhArray[1]) {
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(6, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
            }
            sheet1.set(6, 107, 'colour');
          }
        }

        for (var j = 0; j < toReturn.allRevisedIds.length; j++) {
          if (toReturn.allRevisedIds[j] == BiharArray[0]) {
            for (var t = 9; t <= 104; t++) {
              sheet1.fill(11, t, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
              });
            }
            sheet1.set(11, 107, 'colour');
          }
        }
      }

      workbook.save(function(ok) {
        console.log('workbook saved ' + (ok ?
          'ok' :
          "MP"));
      });

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('putimage', [
        process.env.PWD + '/.uploads/sldcReports/' + excelName + '.xlsx',
        process.env.PWD + '/public/img/secillogo.jpg',
        '',
        '1'
      ]);

      command.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
        console.log('child process exited with code ' + code);
      });

      var toInsert = {
        date: date,
        filePath: process.env.PWD + '/.uploads/sldcReports/' + excelName + '.xlsx',
        stateName: "MP",
        fileName: 'SOLAR SCHEDULE TO MOSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
        createdAt: new Date(),
        reportType: "sldc_report"
      }
      ReportUrls.insert(toInsert);

      // json insert to keep excel file details
      var jsonDetals = {
        date: date,
        revision_number: toReturn.valueHighestRevision,
        filePath: 'sldcReports/' + excelName + '.xlsx',
        fileName: 'SOLAR SCHEDULE TO MOSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
        state: "MP",
        reportType: "SLDC",
        timestamp: new Date(),
      };
      ExcelDetails.insert(jsonDetals);

      var data = ReportUrls.find({
        date: date,
        reportType: "sldc_report",
        stateName: "MP"
      }, {
        sort: {
          $natural: -1
        },
        limit: 1
      }).fetch();
      var attachmentUrl = data[0].filePath;
      var fileName = data[0].fileName;

      var email = ["seci.scheduling@gmail.com"];

      var subject = "SOLAR SCHEDULE TO MPSLDC FOR " + date + " Rev- " + toReturn.valueHighestRevision + " (MP-Goa, MP- Maharashtra, MP- Chattisgarh and MP-Bihar)";
      var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + " DayAhead Revision-" + toReturn.valueHighestRevision + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

      Meteor.setTimeout(function() {
        for (var i = 0; i < email.length; i++) {
          console.log("sending mail Inserted");
          console.log('fileName: ' + fileName);
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
              if (result.message == "queued") {
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
      console.log("Report MP Successfully created");
    } else {
      console.log('Day Ahead revision value is still zero for MP state');
    }
  },
  // DiscomMailForGujaratAtSixOne(date, stateArray, uniqSpdStateList) {
  dayAheadGujaratAtSixDiscom() {
    var nextDay = moment().add(1, 'days');
    var date = moment(nextDay).format('DD-MM-YYYY'); //////nextday/////////////

    var uniqSpdStateList = [];
    uniqSpdStateList.push('Gujarat');

    var stateArray = []
    stateArray.push('Odisha');
    ///////1 disocom 1 spd//////////
    var dateThis = date.split('-');
    dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
    dateThis.setDate(dateThis.getDate() - 1);
    moment(dateThis).format('DD-MM-YYYY');

    var minusOneDay = moment().format('DD-MM-YYYY');

    var discomSpds = Discom.find({
      "discom_state": stateArray[0]
    }).fetch();

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
        var json = Meteor.users.find({
          _id: idsList[t]
        }).fetch();
        if (json[0].profile.registration_form) {
          if (json[0].profile.registration_form.spd_state == uniqSpdStateList[y]) {
            list.push({
              id: idsList[t],
              names: json[0].profile.registration_form.name_of_spd,
              state: json[0].profile.registration_form.spd_state
            });
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
      var stateSTUvar = StuCharges.find({
        month: splitDate[1],
        year: splitDate[2],
        state: uniqSpdStateList[y]
      }).fetch();
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
          var schedule = ScheduleSubmission.find({
            clientId: idArray[i],
            date: date
          }).fetch();
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

      var valueHighestRevision = _.uniq(revisionsValue);
      var max_of_array = Math.max.apply(Math, valueHighestRevision);

      if (stateArray[0] == "Odisha" || stateArray[0] == "Maharashtra") {
        var LTOAnumber = Discom.find({
          discom_state: stateArray[0]
        }).fetch();
        var getLTOA = LTOAnumber[0].LTOA_number;
        var splitLtoa = getLTOA.split(',');
        if (uniqSpdStateList[y] == 'Rajasthan') {
          var showLTOA = splitLtoa[1];
        } else {
          var showLTOA = splitLtoa[0];
        }
      } else {
        var LTOAnumber = Discom.find({
          discom_state: stateArray[0]
        }).fetch();
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
        valueHighestRevision: max_of_array,
        spdState: nameOfSpdState,
        discomSate: nameofDiscomState,
        minusOneDay: minusOneDay
      };
      // }
      if (toReturn.valueHighestRevision >= 1) {
        ////////making of excel/////////////
        var excelName = date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + '_Rev-' + toReturn.valueHighestRevision;
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/discomReports/', excelName + '.xlsx');
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
        sheet1.border(2 * toReturn.spdNamesListTotal.length + 3, 18, {
          left: 'medium'
        });
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
          console.log('workbook saved ' + (ok ?
            'ok' :
            stateArray[0]));
        });

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('putimage', [
          process.env.PWD + '/.uploads/discomReports/' + excelName + '.xlsx',
          process.env.PWD + '/public/img/secillogo.jpg',
          'A1',
          '0'
        ]);

        command.stdout.on('data', function(data) {
          //  console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
          //  console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
          //  console.log('child process exited with code ' + code);
        });

        var toInsert = {
          date: date,
          filePath: process.env.PWD + '/.uploads/discomReports/' + excelName + '.xlsx',
          fileName: date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + '.xlsx',
          stateName: stateArray[0],
          createdAt: new Date(),
          reportType: "discom_report"
        }
        ReportUrls.insert(toInsert);

        // json insert to keep excel file details
        var jsonDetals = {
          date: date,
          revision_number: toReturn.valueHighestRevision,
          filePath: 'discomReports/' + excelName + '.xlsx',
          fileName: date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + '.xlsx',
          state: stateArray[0],
          reportType: "Discom",
          timestamp: new Date(),
        };
        ExcelDetails.insert(jsonDetals);

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
        var subject = "Schedule for " + date + ' REV-- ' + toReturn.valueHighestRevision + ' Gujarat' + '-' + stateArray[0];
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
                if (result.message == "queued") {
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
      } else {
        console.log("Upto one revision value not available to send mail");
      }
    }
  }
});

Meteor.methods({
    SyncronCalledDISCOMReportForAll(){
      var timeVarDiscom = MailTiming.find({date: moment().format('DD-MM-YYYY'), report_type: 'DISCOM'}).fetch();
      if (timeVarDiscom.length > 0) {
          var mailTime = timeVarDiscom[0].time;
          var serverActualTime = getClockTime();
          console.log('Actual Server Time : '+serverActualTime);
          console.log('Discom Mail Time : '+mailTime);
          if (serverActualTime == mailTime) {
          Meteor.call('mailShootForMultipleSpd');
          }else {
            console.log('Mail Timing not Matched for DISCOM Report');
          }
      }else {
        console.log('Mail Timing not submitted for DISCOM Report');
      }
    },

    gujaratSLDCReportMethodCalledBySyncron(){
      var timeVarSLDCGujarat = MailTiming.find({date: moment().format('DD-MM-YYYY'),state: 'Gujarat',report_type: 'SLDC'}).fetch();
      if (timeVarSLDCGujarat.length > 0) {
        var mailTime = timeVarSLDCGujarat[0].time;
        var serverActualTime = getClockTime();
        console.log('Gujarat SLDC Report Mail Time : ' + mailTime);
        if (serverActualTime == mailTime) {
          Meteor.call('sldcReportShootGujarat');
        }else {
          console.log('Mail Timing not Matched for Gujarat SLDC Report');
        }
      }else {
        console.log('Mail Timing not submitted for Gujarat SLDC Report');
      }
    },

    SyncronCalledMPSLDCReportMethod(){
      var timeVarSLDCMP = MailTiming.find({date: moment().format('DD-MM-YYYY'),state: 'MP',report_type: 'SLDC'}).fetch();
      if (timeVarSLDCMP.length > 0) {
        var mailTime = timeVarSLDCMP[0].time;
        var serverActualTime = getClockTime();
        console.log('MP SLDC Report Mail Time : ' + mailTime);
        if (serverActualTime == mailTime) {
            Meteor.call('sldcReportShootMPWithAvaibility');
            // Meteor.call('sldcReportShootMP');
        }else {
          console.log('Mail Timing not Matched for MP SLDC Report');
        }
      }else {
        console.log('Mail Timing not submitted for MP SLDC Report');
      }
    },

    SyncronCalledRajasthanSLDCReportMethod(){
      var timeVarSLDCRajasthan = MailTiming.find({date: moment().format('DD-MM-YYYY'),state: 'Rajasthan',report_type: 'SLDC'}).fetch();
      if (timeVarSLDCRajasthan.length > 0) {
        var mailTime = timeVarSLDCRajasthan[0].time;
        var serverActualTime = getClockTime();
        console.log('Rajasthan SLDC Report Mail Time : ' + mailTime);
        if (serverActualTime == mailTime) {
          Meteor.call('sldcReportShootRajasthan');
        }else {
          console.log('Mail Timing not Matched for Rajasthan SLDC Report');
        }
      }else {
        console.log('Mail Timing not submitted for Rajasthan SLDC Report');
      }
    },

    SyncronCalledForRajasthanDayAheadSLDCeport(){
      var RajasthanStateArray = ['Delhi(TPDDL)','Assam','Haryana','Odisha','Himachal Pradesh','Delhi(BRPL)','Delhi(BYPL)','Maharashtra','Jharkhand','Punjab'];
      var jsonArray = [];
      for (var i = 0; i < RajasthanStateArray.length; i++) {
          var discomValues = Discom.find({'discom_state': RajasthanStateArray[i]}).fetch();
          discomValues[0].spdIds.forEach(function(item) {
              if (item.spdState == 'Rajasthan') {
                  var spdDataVar = Meteor.users.find({_id: item.spdId}).fetch();
                  jsonArray.push({
                      spdId: item.spdId,
                  })
              }
          })
      }
      // getting day ahead revision number for sldc report
      var discomStateArr = [];
      var totalDayAheadRevision = 0;
      var nextDate = moment().add(1, 'days');
      var dateNextDay = moment(nextDate).format('DD-MM-YYYY');
      jsonArray.forEach(function (item) {
        var schedule = ScheduleSubmission.find({clientId: item.spdId, date: dateNextDay, day_ahead_rev: 1}).fetch();
        if (schedule.length > 0) {
          totalDayAheadRevision += Number(schedule.length);
        }
      });
      if (totalDayAheadRevision > 0) {
        Meteor.call('sldcReportShootRajasthan',false, 'DayAhead');
        console.log('SLDC Report !!, Day Ahead Revision, Rajasthan SLDC Report Generating!');
      }else {
        console.log('SLDC Report !!, Day Ahead Revision Not Done By Rajasthan SPDs!');
      }
    },

    mailShootForMultipleSpd(stateArray) {
      var nextDay = moment().add(1, 'days');
      var date = moment(nextDay).format('DD-MM-YYYY');
      var dataDelete = ReportUrls.find({date: date, reportType: "discom_report"}).fetch();
      if (dataDelete.length > 0) {
          dataDelete.forEach(function(item) {
              ReportUrls.remove(item._id);
          });
      }
      var dateThis = date.split('-');
      dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
      dateThis.setDate(dateThis.getDate() - 1);
      moment(dateThis).format('DD-MM-YYYY');
      var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
      var stateArray = [{
            state: 'Maharashtra',
            value: 'Today Green Energy Pvt. Ltd(5RJ)'
        }, {
            state: 'Odisha',
            value: 'Suryauday Solaire Prakash Private Limited'
        }, {
            state: 'Haryana',
            value: 'Northern, Azure Green, Azure Sunshine'
        }, {
            state: 'Himachal Pradesh',
            value: 'Acme Rajdhani Power Pvt. Ltd.'
        }, {
            state: 'Delhi(BRPL)',
            value: 'Acme Gurgaon Power Pvt. Ltd'
        }, {
            state: 'Delhi(BYPL)',
            value: 'Acme Mumbai Power Pvt. Ltd.'
        }, {
            state: 'Delhi(TPDDL)',
            value: 'Medha Energy Pvt. Ltd.'
        }, {
            state: 'Assam',
            value: 'Ranji Solar Energy Pvt. Ltd.'
        }, {
            state: 'Punjab',
            value: 'TODAY GREEN ENERGY'
        }, {
            state: 'Jharkhand',
            value: 'Laxmi Diamond Pvt. Ltd.'
        }
        // , {
        //     state: 'Chhattisgarh',
        //     value: 'Waaneep and Focal Energy Solar One'
        // }, {
        //     state: 'Bihar',
        //     value: 'Focal Renewable Energy Two'
        // }, {
        //     state: 'Goa',
        //     value: 'IL&FS'
        // }
      ];
      for (var a = 0; a < stateArray.length; a++) {
          var discomSpds = Discom.find({"discom_state": stateArray[a].state}).fetch();

          if (discomSpds.length > 0) {
              var spdStateList = [];
              var idsList = [];
              var spds = discomSpds[0].spdIds;
              spds.forEach(function(item) {
                  if (item.transaction_type == "Inter") {
                      if(item.spdState != 'MP'){
                        spdStateList.push(item.spdState);
                        idsList.push(item.spdId);
                      }
                  }
              });
              var uniqSpdStateList = _.uniq(spdStateList);
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
                  var stateSTUvar = StuCharges.find({
                      month: splitDate[1],
                      year: splitDate[2],
                      state: uniqSpdStateList[y]
                  }, {
                      sort: {
                          $natural: -1
                      },
                      limit: 1
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
                          var schedule = ScheduleSubmission.find({clientId: idArray[i], date: date}).fetch();
                          if (schedule != '') {
                              schedule.forEach(function(item) {
                                  var jsonData = item.json;
                                  var length = jsonData.length;
                                  revisionsValue.push(Number(length) - 1);
                                  var getSchedule = jsonData[length - 1];
                                  bid = getSchedule.data[j].bidMwh;
                              })
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
                  var nameofDiscomState = stateArray[a].state.toUpperCase();

                  if (stateArray[a].state == "Odisha" || stateArray[a].state == "Maharashtra") {
                      var LTOAnumber = Discom.find({discom_state: stateArray[a].state}).fetch();
                      var getLTOA = LTOAnumber[0].LTOA_number;
                      var splitLtoa = getLTOA.split(',');
                      if (uniqSpdStateList[y] == 'Rajasthan') {
                          var showLTOA = splitLtoa[1];
                      } else {
                          var showLTOA = splitLtoa[0];
                      }
                  } else {
                      var LTOAnumber = Discom.find({discom_state: stateArray[a].state}).fetch();
                      var showLTOA = LTOAnumber[0].LTOA_number;
                  }

                  var sumAll = 0;
                  for (var i = revisionsValue.length; i--;) {
                      sumAll += Number(revisionsValue[i]);
                  }
                  var sumOfRevision = sumAll;
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
                  var excelName = date + '' + uniqSpdStateList[y] + '_' + stateArray[a].state + ' Rev-' + toReturn.valueHighestRevision;
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
                      // console.log('workbook saved ' + (ok ? 'ok' : stateArray[a].state));
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
                      // console.log('stdout: ' + data);
                  });
                  command.stderr.on('data', function(data) {
                      // console.log('stderr: ' + data);
                  });
                  command.on('exit', function(code) {
                      // console.log('child process exited with code ' + code);
                  });

                  if (uniqSpdStateList[y] == 'Gujarat') {
                      stateArray[a].value = 'GPCL, GSECL, BACKBONE ENTERPRISE, ENERSAN POWER LTD'
                  }

                  if (stateArray[a].state == 'Maharashtra') {
                      if (uniqSpdStateList[y] == 'MP') {
                          stateArray[a].value = 'IL&FS'
                      }
                  }

                  var toInsert = {
                      date: date,
                      filePath: process.env.PWD + '/.uploads/discomReports/' +excelName+ '.xlsx',
                      stateName: stateArray[a].state,
                      fileName: date + '' + uniqSpdStateList[y] + '_' + stateArray[a].state + ' Rev-' + toReturn.valueHighestRevision + '.xlsx',
                      createdAt: new Date(),
                      subject: 'Schedule for ' + date + ' ' + uniqSpdStateList[y] + '-' + stateArray[a].state + ' (Gen: ' + stateArray[a].value + ' )',
                      reportType: "discom_report"
                  }
                  ReportUrls.insert(toInsert);

                  // json insert to keep excel file details
                  var jsonDetals = {
                    date: date,
                    revision_number:toReturn.valueHighestRevision,
                    filePath: 'discomReports/' +excelName+ '.xlsx',
                    fileName: date + '' + uniqSpdStateList[y] + '_' + stateArray[a].state + ' Rev-' + toReturn.valueHighestRevision + '.xlsx',
                    state: stateArray[a].state,
                    reportType: "Discom",
                    timestamp: new Date(),
                  };
                  ExcelDetails.insert(jsonDetals);
              }
          }
      }

      var data = ReportUrls.find({date: date, reportType: "discom_report"}).fetch();

      var attachmentUrlAndSubject = [];
      data.forEach(function(item) {
          attachmentUrlAndSubject.push({url: item.filePath, subject: item.subject, fileName: item.fileName});
      })

      var message = "Dear Sir/Ma'am,<br><br>Please find attached the schedule for " + date + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
      var email = ["seci.scheduling@gmail.com"];
      Meteor.setTimeout(function() {
          for (var j = 0; j < attachmentUrlAndSubject.length; j++) {
              for (var i = 0; i < email.length; i++) {
                  console.log("sending mail Inserted...");
                  console.log('fileName: ' + attachmentUrlAndSubject[j].fileName);
                  Meteor.call("sendMandrillEmailAttachment", email[i], attachmentUrlAndSubject[j].subject, message, attachmentUrlAndSubject[j].url, attachmentUrlAndSubject[j].fileName, function(error, result) {
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
                  });
              }
          }
      }, 10000);
      return returnSuccess('Discom Report Send for All');
    },

    sldcReportShootGujarat(date, receivedFrom, currentSpdName, colourCells) {
        if (date) {
            /////////////message is attatched with the revision number//////////////
            var minusOneDay = moment().format('DD-MM-YYYY');
        } else {
            var nextDay = moment().add(1, 'days');
            var date = moment(nextDay).format('DD-MM-YYYY');
            var subject = "Schedule for " + date + " GUJ - ODISHA (Gen: GPCL, GSECL, BACKBONE ENTERPRISE, ENERSAN POWER LTD)";
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            var dateThis = date.split('-');
            dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
            dateThis.setDate(dateThis.getDate() - 1);
            moment(dateThis).format('DD-MM-YYYY');
            var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
        }
        var discom = Discom.find({"discom_state": "Odisha"}).fetch();
        var idsArray = [];
        var data = Meteor.users.find({"profile.user_type": 'spd', 'profile.status': 'approved'}).fetch();
        discom[0].spdIds.forEach(function(item) {
            data.forEach(function(userItem) {
                if (userItem.profile.registration_form) {
                    if (userItem.profile.registration_form.spd_state == "Gujarat") {
                        if (item.spdId == userItem._id) {
                          var spdDataVar = Meteor.users.find({_id: item.spdId}).fetch();
                          item.spdName = spdDataVar[0].profile.registration_form.name_of_spd;
                          idsArray.push(item);
                        }
                    }
                }
            })
        })

        ///////////////LTOA number////////////////////
        var LTOAnumber = Discom.find({discom_state: "Odisha"}).fetch();
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
            for (var i = 0; i < idsArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: idsArray[i].spdId, date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        revTest.push(Number(length) - 1);
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
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

        var sumAll = 0;
        var actualRevNo = 0;
        var checkDayAheadRevArr = 0;
        if (receivedFrom == 'revision') {
            idsArray.forEach(function(item) {
                var schedule = ScheduleSubmission.find({clientId: item.spdId, date: date, gujarat_day_ahead_rev: 1}).fetch();
                checkDayAheadRevArr += Number(schedule.length);
            });
            if (checkDayAheadRevArr > 0) {
                for (var i = revTest.length; i--;) {
                    sumAll += Number(revTest[i]);
                }
                actualRevNo = Number(sumAll) - 1;
            } else {
                for (var i = revTest.length; i--;) {
                    sumAll += Number(revTest[i]);
                }
                actualRevNo = sumAll;
            }
            var sumOfRevision = actualRevNo;
        } else if (receivedFrom == 'DayAhead') {
            for (var i = revTest.length; i--;) {
                sumAll += Number(revTest[i]);
            }
            actualRevNo = sumAll;
            var sumOfRevision = actualRevNo;
        } else {
            var sumOfRevision = sumOfArray(revTest);
        }

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
        var idsOnly = [];
        idsArray.forEach(function(item) {
            idsOnly.push(item.spdId);
            spdNamesHeadResult.push(item.spdName);
            spdNamesHeadLoss.push(item.spdName);
        })
        idsOnly.push("TotalMw");
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
            valueHighestRevision: sumOfRevision,
            spdState: "GUJARAT",
            discomSate: "ODISHA",
            idsOnly: idsOnly,
            minusOneDay: minusOneDay
        };
        var dataVar = SLDCReports.find({schedule_date: date, sldc_state: 'Gujarat'}).fetch();
        if (dataVar.length > 0) {
            var currentRevNo = Number(sumOfRevision);
            var previousRevNo = Number(dataVar[0].revision_no);
            if (currentRevNo != previousRevNo) {
                dataVar[0].data.push(toReturn);
                SLDCReports.update({
                    _id: dataVar[0]._id
                }, {
                    $set: {
                        revision_no: sumOfRevision,
                        data: dataVar[0].data
                    }
                });
            } else {
                console.log('Gujarat, Revision no. is same for the date of ' + date);
            }
        } else {
            var dataArr = [];
            dataArr.push(toReturn);
            var json = {
                schedule_date: date,
                revision_no: sumOfRevision,
                sldc_state: 'Gujarat',
                data: dataArr,
                timestamp: new Date()
            };
            SLDCReports.insert(json);
        }
        /////making of gujarat excel//////////
        var excelName = date + '_' + "GUJ-ODISHA Rev.-" + toReturn.valueHighestRevision;
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/sldcReports/',excelName+'.xlsx');
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

        if (colourCells) {
            for (var i = 0; i < toReturn.idsOnly.length; i++) {
                if (colourCells.spdIdRevision == toReturn.idsOnly[i]) {
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                        sheet1.fill(i + 3, t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                        sheet1.fill(7, t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                        sheet1.fill(i + 3 + toReturn.idsOnly.length, t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                        sheet1.fill(12, t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                }
            }
        }

        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok
                ? 'ok'
                : "sldc_Gujarat"));
        });

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        console.log('filepath: ' + process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx');
        command = spawn('putimage', [
            process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
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
            console.log('child process exited with code ' + code);
        });

        var discomReports = {
            date: date,
            filePath: process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
            fileName: date + '_' + "GUJ-ODISHA Rev.-" + toReturn.valueHighestRevision + '.xlsx',
            stateName: "Gujarat",
            createdAt: new Date(),
            reportType: "sldc_report"
        }
        ReportUrls.insert(discomReports);
        // json insert to keep excel file details
        var jsonDetals = {
          date: date,
          revision_number:toReturn.valueHighestRevision,
          filePath: 'sldcReports/' +excelName+ '.xlsx',
          fileName: date + '_' + "GUJ-ODISHA Rev.-" + toReturn.valueHighestRevision + '.xlsx',
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

        ////////////message for gujarat/////////////
        if (receivedFrom == 'revision') {
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + " RealTime Revision " + toReturn.valueHighestRevision + " by " + currentSpdName + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            var subject = "Schedule for " + date + ' Rev.-' + toReturn.valueHighestRevision + " GUJ - ODISHA (Gen: " + currentSpdName + ")";
        } else if (receivedFrom == 'DayAhead') {
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + " DayAhead Revision " + toReturn.valueHighestRevision + " by " + currentSpdName + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            var subject = "Schedule for " + date + ' Rev.-' + toReturn.valueHighestRevision + " GUJ - ODISHA (Gen: " + currentSpdName + ")";
        }
        var email = ["seci.scheduling@gmail.com"];
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
                });
            }
        }, 10000);
        return returnSuccess("Gujarat SLDC Report Sent.");
    },

    sldcReportShootMPWithAvaibility(date, message, checkingDiscomState, colourCells, mpSPDUniqId) {
        if (date) {
            var minusOneDay = moment().format('DD-MM-YYYY');
        } else {
            var nextDay = moment().add(1, 'days');
            var date = moment(nextDay).format('DD-MM-YYYY');

            var subject = "SOLAR SCHEDULE TO MPSLDC FOR " + date + " (MP-Goa, MP- Maharashtra, MP- Chhattisgarh and MP-Bihar)";
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

            var dateThis = date.split('-');
            dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
            dateThis.setDate(dateThis.getDate() - 1);
            moment(dateThis).format('DD-MM-YYYY');
            var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
        }

        var list = Meteor.users.find({"profile.user_type": 'spd'}).fetch();
        var jsonArray = [];
        var discom = Discom.find().fetch();
        list.forEach(function(item) {
            if (item.profile.registration_form) {
                if (item.profile.registration_form.spd_state == 'MP' && item.profile.registration_form.transaction_type == "Inter") {
                    discom.forEach(function(DiscomItem) {
                        DiscomItem.spdIds.forEach(function(testSpds) {
                            if (testSpds.spdId == item._id) {
                                jsonArray.push({discomId: DiscomItem._id, discomState: DiscomItem.discom_state, spdId: item._id})
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

        ///////////chattigarh data here//////////////////
        var ChhattisgarhAvaibilityArray = [];
        var ChhattisgarhArrayResult = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showAavailability = [];
            var availability = 0;
            var bid = 0;
            var revTimeCha = [];
            var revTestCha = [];
            for (var i = 0; i < ChhattisgarhArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: ChhattisgarhArray[i], date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        revTestCha.push(Number(length) - 1);
                        var getSchedule = jsonData[length - 1];
                        availability = getSchedule.data[j].availability;
                        bid = getSchedule.data[j].bidMwh;
                    });
                    // revTimeCha.push(schedule[0].actual_revision_time);
                    revTimeCha.push({time: schedule[0].actual_revision_time, timestamp: schedule[0].current_date_timestamp});
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
            for (var i = 0; i < GoaArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: GoaArray[i], date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        revTestGoa.push(Number(length) - 1);
                        var getSchedule = jsonData[length - 1];
                        availability = getSchedule.data[j].availability;
                        bid = getSchedule.data[j].bidMwh;
                    })
                    // revTimeGoa.push(schedule[0].actual_revision_time);
                    revTimeGoa.push({time: schedule[0].actual_revision_time, timestamp: schedule[0].current_date_timestamp});
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
            for (var i = 0; i < BiharArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: BiharArray[i], date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        revTestBihar.push(Number(length) - 1);
                        var getSchedule = jsonData[length - 1];
                        availability = getSchedule.data[j].availability;
                        bid = getSchedule.data[j].bidMwh;
                    });
                    // revTimeBihar.push(schedule[0].actual_revision_time);
                    revTimeBihar.push({time: schedule[0].actual_revision_time, timestamp: schedule[0].current_date_timestamp});
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

        mergeTimeArray.sort(function(a, b) {
            return (b.timestamp - a.timestamp);
        }).sort(function(a, b) {
            return (a.time - b.time);
        });
        if (mergeTimeArray.length > 0) {
            if (mergeTimeArray[0].time) {
                var maximumTime = mergeTimeArray[0].time;
            } else {
                var maximumTime = '00:01';
            }
        } else {
            var maximumTime = '00:00';
        }

        var max_of_array = Math.max.apply(Math, revTestGoa);
        var mergeRevArray = revTestCha.concat(max_of_array, revTestBihar);
        var sumAll = 0;
        for (var i = mergeRevArray.length; i--;) {
            sumAll += Number(mergeRevArray[i]);
        }
        var sumOfRevision = sumAll;

        var toReturn = {
            ChhattisgarhArrayResult: ChhattisgarhArrayResult,
            GoaArrayResult: GoaArrayResult,
            BiharArrayResult: BiharArrayResult,
            ChhattisgarhAvaibilityArray: ChhattisgarhAvaibilityArray,
            GoaAvaibilityArray: GoaAvaibilityArray,
            BiharAvaibilityArray: BiharAvaibilityArray,
            scheduleDate: date,
            minusOneDay: minusOneDay,
            valueHighestRevision: sumOfRevision,
            lastRevison: maximumTime
        }
        var dataVar = SLDCReports.find({schedule_date: date, sldc_state: 'MP'}).fetch();
        if (dataVar.length > 0) {
            var currentRevNo = Number(sumOfRevision);
            var previousRevNo = Number(dataVar[0].revision_no);
            if (currentRevNo != previousRevNo) {
                dataVar[0].data.push(toReturn);
                SLDCReports.update({
                    _id: dataVar[0]._id
                }, {
                    $set: {
                        revision_no: sumOfRevision,
                        data: dataVar[0].data
                    }
                });
            } else {
                console.log('MP, Revision no is same for the date of ' + date);
            }
        } else {
            var dataArr = [];
            dataArr.push(toReturn);
            var json = {
                schedule_date: date,
                revision_no: sumOfRevision,
                sldc_state: 'MP',
                data: dataArr,
                timestamp: new Date()
            };
            SLDCReports.insert(json);
        }

        if (checkingDiscomState == 'Maharashtra' || checkingDiscomState == 'Goa') {
            var subject = "REVISION No.-" + toReturn.valueHighestRevision + " SOLAR SCHEDULE from IL&FS to MAHARASTRA & GOA DT:- " + date;
        }

        if (checkingDiscomState == 'Chhattisgarh') {
          var mpSPDNameVar = '';
          // below if condition used for Focal Energy Solar One India Pvt Ltd to get the name of SPD to Sub & Body
          if (mpSPDUniqId == 'iu96Skq5kcbbMBioy') {
            mpSPDNameVar = 'FOCAL ONE';
          }else if (mpSPDUniqId == 'Wai2eEX7j6oALzKFg') {
            mpSPDNameVar = 'WAANEEP';
          }
            var subject = "REVISION No.-" + toReturn.valueHighestRevision + " SOLAR SCHEDULE from "+mpSPDNameVar+" TO CHHATTISGARH DT:- " + date;
        }

        if (checkingDiscomState == 'Bihar') {
            var subject = "REVISION No.-" + toReturn.valueHighestRevision + " SOLAR SCHEDULE from FOCAL TWO TO BIHAR DT:- " + date;
        }
        var currentTime = timeInHMS();


        var excelName = 'SOLAR SCHEDULE TO MPSLDC FOR ' + date +"_"+currentTime+'_REV--' + toReturn.valueHighestRevision;
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/sldcReports/',excelName+ '.xlsx');
        var sheet1 = workbook.createSheet('sheet1', 100, 126);



        sheet1.set(1, 2, 'Availability & Forecast of SECI Solar Power plants, In MW(Ex-bus At Pooling S/S) To Other States.');
        sheet1.align(1, 2, 'center');
        sheet1.valign(1, 2, 'center');
        sheet1.font(1, 2, {bold:'true'});
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
          sheet1.font(i, 7, {sz:'11',bold:'true'});
          sheet1.valign(i, 7, 'center');
          sheet1.align(i+1, 7, 'center');
          sheet1.wrap(i, 8, 'true');
          sheet1.font(i, 8, {sz:'11',bold:'true'});
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
                sheet1.border(2, 106, {top: 'thin'});
                sheet1.border(3, 106, {top: 'thin'});
                sheet1.align(i, s, 'center');
                sheet1.valign(i-9, s, 'center');
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

        if (colourCells) {
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

            for (var c = 0; c < colourArray.length; c++) {
                if (colourArray[c] == colourCells.spdIdRevision) {
                  var colNum = 0;
                  if (colourArray[c] == 'Wai2eEX7j6oALzKFg') {
                    colNum = 5;
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                        sheet1.fill(colNum, t + 8, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                  }else if (colourArray[c] == 'iu96Skq5kcbbMBioy') {
                    colNum = 7;
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                        sheet1.fill(colNum, t + 8, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                  }else if (colourArray[c] == 'hpRpJo3ZHCpSsKPdg') {
                    colNum = 11;
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                        sheet1.fill(colNum, t + 8, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                  }else if (colourArray[c] == 'JjFmew8JtQyF3BAip') {
                    colNum = 12;
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                        sheet1.fill(colNum, t + 8, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                  }else if (colourArray[c] == 'D2u7cF4P7wtZkN2Cq') {
                    colNum = 14;
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                        sheet1.fill(colNum, t + 8, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                  }
                }
            }
            if (colourCells.spdIdRevision == GoaArray[0] || colourCells.spdIdRevision == GoaArray[1]) {
                for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                    sheet1.fill(10, t + 8, {
                        type: 'solid',
                        fgColor: 'fdff00',
                        bgColor: '64'
                    });
                }
            }
            if (colourCells.spdIdRevision == ChhattisgarhArray[0] || colourCells.spdIdRevision == ChhattisgarhArray[1]) {
                for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                    sheet1.fill(8, t + 8, {
                        type: 'solid',
                        fgColor: 'fdff00',
                        bgColor: '64'
                    });
                }
            }
            if (colourCells.spdIdRevision == BiharArray[0]) {
                for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                    sheet1.fill(15, t + 8, {
                        type: 'solid',
                        fgColor: 'fdff00',
                        bgColor: '64'
                    });
                }
            }
        }

        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok
                ? 'ok'
                : "MP"));
        });

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('putimage', [
            process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
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
            filePath: process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
            fileName: 'SOLAR SCHEDULE TO MPSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
            stateName: "MP",
            createdAt: new Date(),
            reportType: "sldc_report"
        }
        ReportUrls.insert(toInsert);

        // json insert to keep excel file details
        var jsonDetals = {
          date: date,
          revision_number:toReturn.valueHighestRevision,
          filePath: 'sldcReports/' +excelName+ '.xlsx',
          fileName: 'SOLAR SCHEDULE TO MPSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
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
        Meteor.setTimeout(function() {
            for (var i = 0; i < email.length; i++) {
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
                });
            }
        }, 10000);
        return returnSuccess('MP SLDC Report Sent.');
    },










    sldcReportShootMP(date, message, checkingDiscomState, colourCells, mpSPDUniqId) {
        if (date) {
            var minusOneDay = moment().format('DD-MM-YYYY');
        } else {
            var nextDay = moment().add(1, 'days');
            var date = moment(nextDay).format('DD-MM-YYYY');

            var subject = "SOLAR SCHEDULE TO MPSLDC FOR " + date + " (MP-Goa, MP- Maharashtra, MP- Chhattisgarh and MP-Bihar)";
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

            var dateThis = date.split('-');
            dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
            dateThis.setDate(dateThis.getDate() - 1);
            moment(dateThis).format('DD-MM-YYYY');
            var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
        }

        var list = Meteor.users.find({"profile.user_type": 'spd'}).fetch();
        var jsonArray = [];
        var discom = Discom.find().fetch();
        list.forEach(function(item) {
            if (item.profile.registration_form) {
                if (item.profile.registration_form.spd_state == 'MP' && item.profile.registration_form.transaction_type == "Inter") {
                    discom.forEach(function(DiscomItem) {
                        DiscomItem.spdIds.forEach(function(testSpds) {
                            if (testSpds.spdId == item._id) {
                                jsonArray.push({discomId: DiscomItem._id, discomState: DiscomItem.discom_state, spdId: item._id})
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

        ///////////chattigarh data here//////////////////
        var ChhattisgarhArrayResult = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;
            var revTimeCha = [];
            var revTestCha = [];
            for (var i = 0; i < ChhattisgarhArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: ChhattisgarhArray[i], date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        revTestCha.push(Number(length) - 1);
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                    })
                    // revTimeCha.push(schedule[0].actual_revision_time);
                    revTimeCha.push({time: schedule[0].actual_revision_time, timestamp: schedule[0].current_date_timestamp});
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
            for (var i = 0; i < GoaArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: GoaArray[i], date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        revTestGoa.push(Number(length) - 1);
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                    })
                    // revTimeGoa.push(schedule[0].actual_revision_time);
                    revTimeGoa.push({time: schedule[0].actual_revision_time, timestamp: schedule[0].current_date_timestamp});
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
            for (var i = 0; i < BiharArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: BiharArray[i], date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        revTestBihar.push(Number(length) - 1);
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                    })
                    // revTimeBihar.push(schedule[0].actual_revision_time);
                    revTimeBihar.push({time: schedule[0].actual_revision_time, timestamp: schedule[0].current_date_timestamp});
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

        mergeTimeArray.sort(function(a, b) {
            return (b.timestamp - a.timestamp);
        }).sort(function(a, b) {
            return (a.time - b.time);
        });
        if (mergeTimeArray.length > 0) {
            if (mergeTimeArray[0].time) {
                var maximumTime = mergeTimeArray[0].time;
            } else {
                var maximumTime = '00:01';
            }
        } else {
            var maximumTime = '00:00';
        }

        var max_of_array = Math.max.apply(Math, revTestGoa);
        var mergeRevArray = revTestCha.concat(max_of_array, revTestBihar);

        var sumAll = 0;
        for (var i = mergeRevArray.length; i--;) {
            sumAll += Number(mergeRevArray[i]);
        }
        var sumOfRevision = sumAll;
        console.log('revison sum:' + sumOfRevision);

        var toReturn = {
            ChhattisgarhArrayResult: ChhattisgarhArrayResult,
            GoaArrayResult: GoaArrayResult,
            BiharArrayResult: BiharArrayResult,
            scheduleDate: date,
            minusOneDay: minusOneDay,
            valueHighestRevision: sumOfRevision,
            lastRevison: maximumTime
        }
        var dataVar = SLDCReports.find({schedule_date: date, sldc_state: 'MP'}).fetch();
        if (dataVar.length > 0) {
            var currentRevNo = Number(sumOfRevision);
            var previousRevNo = Number(dataVar[0].revision_no);
            if (currentRevNo != previousRevNo) {
                dataVar[0].data.push(toReturn);
                SLDCReports.update({
                    _id: dataVar[0]._id
                }, {
                    $set: {
                        revision_no: sumOfRevision,
                        data: dataVar[0].data
                    }
                });
            } else {
                console.log('MP, Revision no is same for the date of ' + date);
            }
        } else {
            var dataArr = [];
            dataArr.push(toReturn);
            var json = {
                schedule_date: date,
                revision_no: sumOfRevision,
                sldc_state: 'MP',
                data: dataArr,
                timestamp: new Date()
            };
            SLDCReports.insert(json);
        }

        if (checkingDiscomState == 'Maharashtra' || checkingDiscomState == 'Goa') {
            var subject = "REVISION No.-" + toReturn.valueHighestRevision + " SOLAR SCHEDULE from IL&FS to MAHARASTRA & GOA DT:- " + date;
        }

        if (checkingDiscomState == 'Chhattisgarh') {
          var mpSPDNameVar = '';
          // below if condition used for Focal Energy Solar One India Pvt Ltd to get the name of SPD to Sub & Body
          if (mpSPDUniqId == 'iu96Skq5kcbbMBioy') {
            mpSPDNameVar = 'FOCAL ONE';
          }else if (mpSPDUniqId == 'Wai2eEX7j6oALzKFg') {
            mpSPDNameVar = 'WAANEEP';
          }
            var subject = "REVISION No.-" + toReturn.valueHighestRevision + " SOLAR SCHEDULE from "+mpSPDNameVar+" TO CHHATTISGARH DT:- " + date;
        }

        if (checkingDiscomState == 'Bihar') {
            var subject = "REVISION No.-" + toReturn.valueHighestRevision + " SOLAR SCHEDULE from FOCAL TWO TO BIHAR DT:- " + date;
        }
        var currentTime = timeInHMS();
        var excelName = 'SOLAR SCHEDULE TO MPSLDC FOR ' + date +"_"+currentTime+'_REV--' + toReturn.valueHighestRevision;
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/sldcReports/',excelName+ '.xlsx');
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
        sheet1.set(3, 7, '');
        for (var i = 3; i <= 7; i++) {
            sheet1.align(3, i, 'center');
            sheet1.align(3, 8, 'center');
            sheet1.border(1, i, {
                left: 'medium',
                top: 'medium',
                bottom: 'medium'
            });
            sheet1.border(2, i, {
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
                sheet1.border(2, 106, {top: 'medium'});
                sheet1.border(3, 106, {top: 'medium'});
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
        sheet1.set(7, 3, '-');
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

        if (colourCells) {
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
            for (var c = 0; c < colourArray.length; c++) {
                if (colourArray[c] == colourCells.spdIdRevision) {
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                        sheet1.fill(c + 4, t + 8, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                }
            }
            if (colourCells.spdIdRevision == GoaArray[0] || colourCells.spdIdRevision == GoaArray[1]) {
                for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                    sheet1.fill(7, t + 8, {
                        type: 'solid',
                        fgColor: 'fdff00',
                        bgColor: '64'
                    });
                }
            }
            if (colourCells.spdIdRevision == ChhattisgarhArray[0] || colourCells.spdIdRevision == ChhattisgarhArray[1]) {
                for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                    sheet1.fill(6, t + 8, {
                        type: 'solid',
                        fgColor: 'fdff00',
                        bgColor: '64'
                    });
                }
            }
            if (colourCells.spdIdRevision == BiharArray[0]) {
                for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                    sheet1.fill(11, t + 8, {
                        type: 'solid',
                        fgColor: 'fdff00',
                        bgColor: '64'
                    });
                }
            }
        }

        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok
                ? 'ok'
                : "MP"));
        });

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('putimage', [
            process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
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
            filePath: process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
            fileName: 'SOLAR SCHEDULE TO MPSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
            stateName: "MP",
            createdAt: new Date(),
            reportType: "sldc_report"
        }
        ReportUrls.insert(toInsert);

        // json insert to keep excel file details
        var jsonDetals = {
          date: date,
          revision_number:toReturn.valueHighestRevision,
          filePath: 'sldcReports/' +excelName+ '.xlsx',
          fileName: 'SOLAR SCHEDULE TO MPSLDC FOR ' + date + ' REV--' + toReturn.valueHighestRevision + '.xlsx',
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
        Meteor.setTimeout(function() {
            for (var i = 0; i < email.length; i++) {
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
                });
            }
        }, 10000);
        return returnSuccess('MP SLDC Report Sent.');
    },

    sldcReportShootRajasthan(date, receivedFrom ,checkingDiscomState ,colourCells, selectedSPDNameVar) {
        if (date) {} else {
            var nextDay = moment().add(1, 'days');
            var date = moment(nextDay).format('DD-MM-YYYY');
        }
        var splitDate = date.split('-');
        var stuData = StuCharges.find({month: splitDate[1], year: splitDate[2], state: "Rajasthan"}).fetch();
        var rajStateArray = ['Delhi(TPDDL)','Assam','Haryana','Odisha','Himachal Pradesh','Delhi(BRPL)','Delhi(BYPL)','Maharashtra','Jharkhand','Punjab'];
        var jsonArray = [];
        for (var i = 0; i < rajStateArray.length; i++) {
            var discomValues = Discom.find({'discom_state': rajStateArray[i]}).fetch();
            discomValues[0].spdIds.forEach(function(item) {
                if (item.spdState == 'Rajasthan') {
                    var spdDataVar = Meteor.users.find({_id: item.spdId}).fetch();
                    jsonArray.push({
                        discomId: discomValues[0]._id,
                        discomState: discomValues[0].discom_state,
                        spdId: item.spdId,
                        // spdName: item.spdName,
                        spdName: spdDataVar[0].profile.registration_form.name_of_spd,
                        spdCapacity: spdDataVar[0].profile.registration_form.project_capicity + ' MW'
                    })
                }
            })
        }

        var result = [];
        var lossResult = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showLoss = [];
            var bid = 0;
            var countPun = 0;
            var revisedNames = [];
            var revisedStateDataArr = [];
            var revisedTxnArr = [];
            var revisedIds = [];
            for (var i = 0; i < jsonArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: jsonArray[i].spdId, date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                        if (Number(length) - 1 >= 1) {
                            revisedNames.push(jsonArray[i].spdName+' - '+jsonArray[i].discomState);
                            revisedIds.push(jsonArray[i].spdId);
                            revisedTxnArr.push('Raj-'+jsonArray[i].discomState);
                            revisedStateDataArr.push(jsonArray[i].discomState);
                        }
                    })
                } else {
                    bid = "0.00";
                }
                show.push(bid);
                var RajStu = stuData[0].stuRate;
                var percentage = Number(RajStu) / 100;
                var calculate = Number(bid) * Number(percentage);
                var errorRaj = Number(bid) - Number(calculate);
                showLoss.push(errorRaj.toFixed(2))
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

        /////calculate total///////
        var onlyTotal = [];
        var onlyTotalLoss = [];
        var length = Number(result[0].length) - 1;
        for (var i = 0; i < result.length; i++) {
            onlyTotal.push(result[i][length]);
            onlyTotalLoss.push(lossResult[i][length]);
        }
        //getting revision Number
        var revisionNumber = '';
        if (receivedFrom == 'revision') {
          var revisionNum = 0;
          var actualRevNo = 0;
          jsonArray.forEach(function (item) {
            var schedule = ScheduleSubmission.find({clientId: item.spdId, date: date}).fetch();
            if (schedule.length > 0) {
              var jsonData = schedule[0].json.length;
              if (jsonData > 1) {
                revisionNum += (Number(jsonData) - 1);
              }
            }
          });
          // getting day ahead revision number to get actual revision number
          var totalDayAheadRevision = 0;
          jsonArray.forEach(function (item) {
            var schedule = ScheduleSubmission.find({clientId: item.spdId, date: date, day_ahead_rev: 1}).fetch();
            totalDayAheadRevision += Number(schedule.length);
          });
          if (totalDayAheadRevision > 0) {
            actualRevNo = (Number(revisionNum) - Number(Number(totalDayAheadRevision) - 1));
          } else {
            actualRevNo = Number(revisionNum);
          }
          revisionNumber = actualRevNo;

        }else if (receivedFrom == 'DayAhead') {
          var nextDay = moment().add(1, 'days');
          var dateNextDay = moment(nextDay).format('DD-MM-YYYY');
          var revisionNum = 0;
          jsonArray.forEach(function (item) {
            var schedule = ScheduleSubmission.find({clientId: item.spdId, date: dateNextDay}).fetch();
            if (schedule.length > 0) {
              var jsonData = schedule[0].json.length;
              if (jsonData > 1) {
                revisionNum += (Number(jsonData) - 1);
              }
            }
          });
          // getting day ahead revision number to get actual revision number
          var totalDayAheadRevision = 0;
          jsonArray.forEach(function (item) {
            var schedule = ScheduleSubmission.find({clientId: item.spdId, date: dateNextDay, day_ahead_rev: 1}).fetch();
            totalDayAheadRevision += Number(schedule.length);
          });
          if (totalDayAheadRevision > 0) {
            actualRevNo = (Number(revisionNum) - Number(Number(totalDayAheadRevision) - 1));
          } else {
            actualRevNo = Number(revisionNum);
          }
          revisionNumber = actualRevNo;

        }else {
          revisionNumber = '0';
        }

        var statePunjabIds = [];
        var stateHaryanaIds = [];
        var stateNormalIds = [];
        var AllNormalIds = [];
        jsonArray.forEach(function(item) {
            if (item.discomState == "Punjab") {
                statePunjabIds.push(item);
                AllNormalIds.push(item);
            } else if (item.discomState == "Haryana") {
                stateHaryanaIds.push(item);
                AllNormalIds.push(item);
            } else {
                stateNormalIds.push(item);
                AllNormalIds.push(item);
            }
        })

        ////state punjab array///////
        var resultPunjab = [];
        var resultPunjabLoss = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showPunjab = [];
            var bid = 0;
            for (var i = 0; i < statePunjabIds.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: statePunjabIds[i].spdId, date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                    })
                } else {
                    bid = "0.00";
                }
                show.push(bid);
                var RajStu = stuData[0].stuRate;
                var percentage = Number(RajStu) / 100;
                var calculate = Number(bid) * Number(percentage);
                var errorRaj = Number(bid) - Number(calculate);
                showPunjab.push(errorRaj.toFixed(2));
            }
            var count = 0;
            var lossCount = 0;
            for (var i = show.length; i--;) {
                count += Number(show[i]);
                lossCount += Number(showPunjab[i]);
            }
            show.push(count.toFixed(2));
            showPunjab.push(lossCount.toFixed(2));
            resultPunjab.push(show);
            resultPunjabLoss.push(showPunjab);
        }

        ///punjab only total//////
        var punjabTotalSet = [];
        var punjabTotalSetLoss = [];
        var length = Number(resultPunjab[0].length) - 1;
        for (var i = 0; i < resultPunjab.length; i++) {
            punjabTotalSet.push(resultPunjab[i][length]);
            punjabTotalSetLoss.push(resultPunjabLoss[i][length]);
        }

        ///////punjab addition//////
        var count = 0;
        var lossCount = 0;
        for (var i = punjabTotalSet.length; i--;) {
            count += Number(punjabTotalSet[i]);
            lossCount += Number(punjabTotalSetLoss[i]);
        }
        punjabTotalSet.push(((Number(count)) / 4000).toFixed(7));
        punjabTotalSetLoss.push(((Number(lossCount)) / 4000).toFixed(7));

        ////////haryana only calculation////
        var resultHaryana = [];
        var resultHaryanaLoss = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showHaryana = [];
            var bid = 0;
            for (var i = 0; i < stateHaryanaIds.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: stateHaryanaIds[i].spdId, date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                    })
                } else {
                    bid = "0.00";
                }
                show.push(bid);
                var RajStu = stuData[0].stuRate;
                var percentage = Number(RajStu) / 100;
                var calculate = Number(bid) * Number(percentage);
                var errorRaj = Number(bid) - Number(calculate);
                showHaryana.push(errorRaj.toFixed(2));
            }
            var count = 0;
            var lossCount = 0;
            for (var i = show.length; i--;) {
                count += Number(show[i]);
                lossCount += Number(showHaryana[i]);
            }
            show.push(count.toFixed(2));
            showHaryana.push(lossCount.toFixed(2));
            resultHaryana.push(show);
            resultHaryanaLoss.push(showHaryana);
        }

        ///haryana only total//////
        var haryanaTotalSet = [];
        var haryanaTotalSetLoss = [];
        var length = Number(resultHaryana[0].length) - 1;
        for (var i = 0; i < resultHaryana.length; i++) {
            haryanaTotalSet.push(resultHaryana[i][length]);
            haryanaTotalSetLoss.push(resultHaryanaLoss[i][length]);
        }

        //////haryana addition//////////
        var count = 0;
        var lossCount = 0;
        for (var i = haryanaTotalSet.length; i--;) {
            count += Number(haryanaTotalSet[i]);
            lossCount += Number(haryanaTotalSetLoss[i]);
        }
        haryanaTotalSet.push(((Number(count)) / 4000).toFixed(7));
        haryanaTotalSetLoss.push(((Number(lossCount)) / 4000).toFixed(7));

        /////calculation of normal spds////////
        var resultNormal = [];
        var resultNormalLoss = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showNormal = [];
            var bid = 0;
            var countPun = 0;
            for (var i = 0; i < stateNormalIds.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: stateNormalIds[i].spdId, date: date}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                    })
                } else {
                    bid = "0.00";
                }
                show.push(bid);
                var RajStu = stuData[0].stuRate;
                var percentage = Number(RajStu) / 100;
                var calculate = Number(bid) * Number(percentage);
                var errorRaj = Number(bid) - Number(calculate);
                showNormal.push(errorRaj.toFixed(2));
            }
            resultNormal.push(show);
            resultNormalLoss.push(showNormal);
        }

        ///////losss total addition/////////
        var count = 0;
        var lossCount = 0;
        for (var i = onlyTotal.length; i--;) {
            count += Number(onlyTotal[i]);
            lossCount += Number(onlyTotalLoss[i]);
        }
        onlyTotal.push(((Number(count)) / 4000).toFixed(7));
        onlyTotalLoss.push(((Number(lossCount)) / 4000).toFixed(7));

        //////////normal addition/////////
        var tempOnlyTotalNormal = [];
        var tempOnlyTotalLossNormal = [];
        for (var z = 0; z < resultNormal[0].length; z++) {
            var sum = 0;
            var sumLoss = 0;
            for (var k = 0; k < resultNormal.length; k++) {
                sum += Number(resultNormal[k][z]);
                sumLoss += Number(resultNormalLoss[k][z]);
            }
            tempOnlyTotalNormal.push((Number(sum) / 4000).toFixed(7));
            tempOnlyTotalLossNormal.push((Number(sumLoss) / 4000).toFixed(7));
        }
        resultNormal.push(tempOnlyTotalNormal);
        resultNormalLoss.push(tempOnlyTotalLossNormal);
        var currentDateForRealTimeRev = moment().format('DD-MM-YYYY');
        var dateThis = date.split('-');
        dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
        dateThis.setDate(dateThis.getDate() - 1);
        moment(dateThis).format('DD-MM-YYYY');
        var minusOneDay = moment(dateThis).format('DD-MM-YYYY');

        ////all return data/////////
        var toReturn = {
            onlyTotal: onlyTotal,
            onlyTotalLoss: onlyTotalLoss,
            punjabTotalSet: punjabTotalSet,
            punjabTotalSetLoss: punjabTotalSetLoss,
            haryanaTotalSet: haryanaTotalSet,
            haryanaTotalSetLoss: haryanaTotalSetLoss,
            resultNormal: resultNormal,
            resultNormalLoss: resultNormalLoss,
            normalSpds: stateNormalIds,
            stuLossValue: stuData[0].stuRate + "%",
            scheduleDate: date,
            minusOneDay: minusOneDay
        };

        var dataVar = SLDCReports.find({schedule_date: date, sldc_state: 'Rajasthan'}).fetch();
        if (dataVar.length > 0) {
            console.log('Rajasthan SLDC report all ready inserted!');
        } else {
            var dataArr = [];
            dataArr.push(toReturn);
            var json = {
                schedule_date: toReturn.scheduleDate,
                revision_no: '0',
                sldc_state: 'Rajasthan',
                data: dataArr,
                timestamp: new Date()
            };
            SLDCReports.insert(json);
        }
        if (receivedFrom == 'revision') {
          var excelName = date + '_' + "ALL SCHEDULE FOR RAJASTHAN Rev--"+revisionNumber;
        }else {
          var excelName = date + '_' + "ALL SCHEDULE FOR RAJASTHAN";
        }
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/sldcReports/',excelName+ '.xlsx');
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
        sheet1.set(3, 8, 'Fax: 011-71989287, Website: www.seci.co.in');
        sheet1.set(3, 9, 'CIN: U40106DL2011NPL225263');
        sheet1.set(7, 11, 'ISSUE-DATE:');
        if (receivedFrom == 'revision') {
          sheet1.set(9, 11, currentDateForRealTimeRev);
        }else {
          sheet1.set(9, 11, toReturn.minusOneDay);
        }
        sheet1.set(1, 13, 'STU LOSS');
        sheet1.set(3, 13, toReturn.stuLossValue);
        sheet1.set(7, 13, 'SCHEDULE FOR :');
        sheet1.set(9, 13, toReturn.scheduleDate);
        sheet1.set(7, 14, 'REV');
        sheet1.set(9, 14, revisionNumber);

        sheet1.height(16, 66);
        sheet1.height(17, 54);

        for (var i = 0; i < 2; i++) {
            sheet1.set(i + 3, 16, toReturn.normalSpds[i].spdName + ' - ' + toReturn.normalSpds[i].discomState);
            sheet1.set(i + 3, 18, toReturn.normalSpds[i].spdCapacity);
        }

        sheet1.set(5, 16, 'NORTHERN, AZURE GREEN TECH, AZURE SUNSHINE-HPPC');
        sheet1.width(5, 14);
        sheet1.set(5, 17, 'GENERATION SCHEDULE');
        sheet1.set(5, 18, '80 MW');

        for (var i = 2; i < 8; i++) {
            sheet1.set(i + 4, 16, toReturn.normalSpds[i].spdName + ' - ' + toReturn.normalSpds[i].discomState);
            sheet1.set(i + 4, 18, toReturn.normalSpds[i].spdCapacity);
        }
        sheet1.set(toReturn.normalSpds.length + 4, 16, 'TODAY GREEN 1 RJ, 2 RJ AND 3RJ-PUNJAB');
        sheet1.width(toReturn.normalSpds.length + 4, 14);
        sheet1.set(toReturn.normalSpds.length + 4, 17, 'GENERATION SCHEDULE');
        sheet1.set(toReturn.normalSpds.length + 4, 18, '30 MW');

        for (var i = 0; i < 10; i++) {
            sheet1.width(i + 3, 14);
            sheet1.wrap(i + 3, 16, 'true');
            sheet1.align(i + 3, 16, 'center');
            sheet1.set(i + 3, 17, 'GENERATION SCHEDULE');
            sheet1.wrap(i + 3, 17, 'true');
            sheet1.align(i + 3, 17, 'center');
            sheet1.align(i + 3, 18, 'center');
        }

        sheet1.set(13, 16, 'TOTAL (240 MW)');
        sheet1.align(13, 16, 'center');
        sheet1.width(toReturn.normalSpds.length + 5, 14);
        sheet1.wrap(toReturn.normalSpds.length + 5, 16, 'true');
        sheet1.border(13, 16, {top: 'medium'});

        sheet1.fill(5, 16, {
            type: 'solid',
            fgColor: 'fd000d',
            bgColor: '64'
        });
        sheet1.fill(toReturn.normalSpds.length + 4, 16, {
            type: 'solid',
            fgColor: 'fd000d',
            bgColor: '64'
        });

        /////////after losses valuessssssss///////////
        for (var i = 0; i < 2; i++) {
            sheet1.set(i + 6 + toReturn.normalSpds.length, 16, toReturn.normalSpds[i].spdName + ' - ' + toReturn.normalSpds[i].discomState);
            sheet1.set(i + 6 + toReturn.normalSpds.length, 18, toReturn.normalSpds[i].spdCapacity);
        }
        sheet1.set(16, 16, 'NORTHERN, AZURE GREEN TECH, AZURE SUNSHINE-HPPC');
        sheet1.set(16, 18, '80 MW');

        for (var i = 2; i < 8; i++) {
            sheet1.set(i + 7 + toReturn.normalSpds.length, 16, toReturn.normalSpds[i].spdName + ' - ' + toReturn.normalSpds[i].discomState);
            sheet1.set(i + 7 + toReturn.normalSpds.length, 18, toReturn.normalSpds[i].spdCapacity);
        }
        sheet1.set(2 * toReturn.normalSpds.length + 7, 16, 'TODAY GREEN 1 RJ, 2 RJ AND 3RJ-PUNJAB');
        sheet1.set(2 * toReturn.normalSpds.length + 7, 18, '30 MW');

        for (var i = 0; i < 10; i++) {
            sheet1.width(i + 6 + toReturn.normalSpds.length, 14);
            sheet1.wrap(i + 6 + toReturn.normalSpds.length, 16, 'true');
            sheet1.align(i + 6 + toReturn.normalSpds.length, 16, 'center');
            sheet1.set(i + 6 + toReturn.normalSpds.length, 17, 'AT RAJASTHAN PERIPHERY AFTER STU LOSSES');
            sheet1.wrap(i + 6 + toReturn.normalSpds.length, 17, 'true');
            sheet1.align(i + 6 + toReturn.normalSpds.length, 17, 'center');
            sheet1.align(i + 6 + toReturn.normalSpds.length, 18, 'center');
        }
        sheet1.set(24, 16, 'TOTAL (240 MW)');
        sheet1.align(24, 16, 'center');
        sheet1.width(2 * toReturn.normalSpds.length + 8, 14);
        sheet1.align(2 * toReturn.normalSpds.length + 7, 18, 'center');
        sheet1.wrap(24, 16, 'true');
        sheet1.border(24, 16, {
            left: 'medium',
            top: 'medium',
            right: 'medium'
        });

        sheet1.merge({
            col: 1,
            row: 16
        }, {
            col: 2,
            row: 16
        });
        sheet1.merge({
            col: 1,
            row: 19
        }, {
            col: 2,
            row: 19
        });
        sheet1.merge({
            col: 13,
            row: 16
        }, {
            col: 13,
            row: 19
        });
        sheet1.merge({
            col: 24,
            row: 16
        }, {
            col: 24,
            row: 19
        });
        sheet1.border(1, 16, {
            left: 'medium',
            top: 'medium',
            right: 'medium'
        });
        sheet1.border(1, 17, {left: 'medium'});
        sheet1.border(1, 18, {left: 'medium'});
        sheet1.set(1, 16, 'ALLOCATED CAPACITY');
        sheet1.set(1, 19, 'TIME BLOCK');
        sheet1.width(1, 14);
        sheet1.align(1, 18, 'center');
        sheet1.align(1, 19, 'center');

        sheet1.border(1, 19, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        for (var i = 17; i < 20; i++) {
            for (var j = 0; j < toReturn.normalSpds.length; j++) {
                sheet1.border(j + 3, 116, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });

                sheet1.border(j + 6 + toReturn.normalSpds.length, 116, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.border(j + 3, 16, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.border(j + 3, i, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.border(j + 6 + toReturn.normalSpds.length, i, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.border(j + 6 + toReturn.normalSpds.length, 16, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
            }
            sheet1.border(toReturn.normalSpds.length + 3, i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(toReturn.normalSpds.length + 4, i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(toReturn.normalSpds.length + 5, i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });

            sheet1.border(2 * toReturn.normalSpds.length + 6, i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(2 * toReturn.normalSpds.length + 7, i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(2 * toReturn.normalSpds.length + 8, i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
        }

        sheet1.border(toReturn.normalSpds.length + 3, 16, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(2 * toReturn.normalSpds.length + 6, 16, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(toReturn.normalSpds.length + 4, 16, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(2 * toReturn.normalSpds.length + 7, 16, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });

        sheet1.border(1, 116, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(toReturn.normalSpds.length + 3, 116, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(2 * toReturn.normalSpds.length + 6, 116, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(toReturn.normalSpds.length + 4, 116, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(toReturn.normalSpds.length + 5, 116, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(2 * toReturn.normalSpds.length + 7, 116, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });
        sheet1.border(2 * toReturn.normalSpds.length + 8, 116, {
            left: 'medium',
            top: 'medium',
            right: 'medium',
            bottom: 'medium'
        });

        for (var s = 20; s < 116; s++) {
            sheet1.set(1, s, returnSlots("from", s - 20) + '-' + returnSlots("to", s - 20));
            sheet1.align(1, s, 'center');
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
            sheet1.set(2, s, s - 19);
            for (var j = 3; j < 6; j++) {
                sheet1.border(toReturn.normalSpds.length + j, s, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
            }
            sheet1.align(toReturn.normalSpds.length + 3, s, 'center');
            sheet1.align(toReturn.normalSpds.length + 4, s, 'center');
            sheet1.align(toReturn.normalSpds.length + 5, s, 'center');

            for (var q = 0; q < 2; q++) {
                sheet1.set(q + 3, s, returnHelper(toReturn.resultNormal, q, s - 20));
                sheet1.set(q + 3, 116, returnHelper(toReturn.resultNormal, q, 96));

                sheet1.set(q + 6 + toReturn.normalSpds.length, s, returnHelper(toReturn.resultNormalLoss, q, s - 20));
                sheet1.set(q + 6 + toReturn.normalSpds.length, 116, returnHelper(toReturn.resultNormalLoss, q, 96));
            }
            sheet1.set(5, s, returningColoum(toReturn.haryanaTotalSet, s - 20));
            sheet1.set(5, 116, returningColoum(toReturn.haryanaTotalSet, 96));

            sheet1.set(16, s, returningColoum(toReturn.haryanaTotalSetLoss, s - 20));
            sheet1.set(16, 116, returningColoum(toReturn.haryanaTotalSetLoss, 96));

            for (var i = 2; i < 8; i++) {
                sheet1.set(i + 4, s, returnHelper(toReturn.resultNormal, i, s - 20));
                sheet1.set(i + 4, 116, returnHelper(toReturn.resultNormal, i, 96));

                sheet1.set(i + 7 + toReturn.normalSpds.length, s, returnHelper(toReturn.resultNormalLoss, i, s - 20));
                sheet1.set(i + 7 + toReturn.normalSpds.length, 116, returnHelper(toReturn.resultNormalLoss, i, 96));
            }
            sheet1.set(toReturn.normalSpds.length + 4, s, returningColoum(toReturn.punjabTotalSet, s - 20));
            sheet1.set(toReturn.normalSpds.length + 4, 116, returningColoum(toReturn.punjabTotalSet, 96));

            sheet1.set(2 * toReturn.normalSpds.length + 7, s, returningColoum(toReturn.punjabTotalSetLoss, s - 20));
            sheet1.set(2 * toReturn.normalSpds.length + 7, 116, returningColoum(toReturn.punjabTotalSetLoss, 96));

            sheet1.set(toReturn.normalSpds.length + 5, s, returningColoum(toReturn.onlyTotal, s - 20));
            sheet1.set(toReturn.normalSpds.length + 5, 116, returningColoum(toReturn.onlyTotal, 96));

            sheet1.set(2 * toReturn.normalSpds.length + 8, s, returningColoum(toReturn.onlyTotalLoss, s - 20));
            sheet1.set(2 * toReturn.normalSpds.length + 8, 116, returningColoum(toReturn.onlyTotalLoss, 96));

            for (var q = 0; q < toReturn.normalSpds.length; q++) {
                sheet1.border(q + 3, s, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.align(q + 3, s, 'center');
                sheet1.border(q + 6 + toReturn.normalSpds.length, s, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.align(q + 6 + toReturn.normalSpds.length, s, 'center');
            }

            for (var j = 6; j < 9; j++) {
                sheet1.border(2 * toReturn.normalSpds.length + j, s, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
            }
            sheet1.align(2 * toReturn.normalSpds.length + 6, s, 'center');
            sheet1.align(2 * toReturn.normalSpds.length + 7, s, 'center');
            sheet1.align(2 * toReturn.normalSpds.length + 8, s, 'center');
        }

        sheet1.set(1, 116, 'TOTAL(MUs)');
        sheet1.align(toReturn.normalSpds.length + 3, 116, 'center');
        sheet1.align(toReturn.normalSpds.length + 4, 116, 'center');
        sheet1.align(toReturn.normalSpds.length + 5, 116, 'center');

        sheet1.align(2 * toReturn.normalSpds.length + 6, 116, 'center');
        sheet1.align(2 * toReturn.normalSpds.length + 7, 116, 'center');
        sheet1.align(2 * toReturn.normalSpds.length + 8, 116, 'center');
        if (colourCells) {
            for (var i = 0; i < AllNormalIds.length; i++) {
                if (colourCells.spdIdRevision == AllNormalIds[i].spdId) {
                    for (var t = colourCells.startCell; t <= colourCells.endCell; t++) {
                      if (AllNormalIds[i].discomState == 'Delhi(TPDDL)') {
                        var a = 3;
                        var b = 14;
                      }else if (AllNormalIds[i].discomState == 'Assam') {
                        var a = 4;
                        var b = 15;
                      }else if (AllNormalIds[i].discomState == 'Haryana' ) {
                        var a = 5;
                        var b = 16;
                      }else if (AllNormalIds[i].discomState == 'ODISHA') {
                        var a = 6;
                        var b = 17;
                      }else if (AllNormalIds[i].discomState == 'Himachal Pradesh') {
                        var a = 7;
                        var b = 18;
                      }else if (AllNormalIds[i].discomState == 'Delhi(BRPL)') {
                        var a = 8;
                        var b = 19;
                      }else if (AllNormalIds[i].discomState == 'Delhi(BYPL)') {
                        var a = 9;
                        var b = 20;
                      }else if (AllNormalIds[i].discomState == 'Maharashtra') {
                        var a = 10;
                        var b = 21;
                      }else if (AllNormalIds[i].discomState == 'Jharkhand') {
                        var a = 11;
                        var b = 22;
                      }else if (AllNormalIds[i].discomState == 'Punjab') {
                        var a = 12;
                        var b = 23;
                      }
                        sheet1.fill(a , t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                        sheet1.fill(13, t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                        sheet1.fill(b, t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                        sheet1.fill(24, t + 19, {
                            type: 'solid',
                            fgColor: 'fdff00',
                            bgColor: '64'
                        });
                    }
                }
            }
        }

        if (receivedFrom == 'DayAhead') {
          revisedStateDataArr.forEach( function(discomState) {
            if (discomState == 'Delhi(TPDDL)') {
              var a = 3;
              var b = 14;
            }else if (discomState == 'Assam') {
              var a = 4;
              var b = 15;
            }else if (discomState == 'Haryana' ) {
              var a = 5;
              var b = 16;
            }else if (discomState == 'ODISHA') {
              var a = 6;
              var b = 17;
            }else if (discomState == 'Himachal Pradesh') {
              var a = 7;
              var b = 18;
            }else if (discomState == 'Delhi(BRPL)') {
              var a = 8;
              var b = 19;
            }else if (discomState == 'Delhi(BYPL)') {
              var a = 9;
              var b = 20;
            }else if (discomState == 'Maharashtra') {
              var a = 10;
              var b = 21;
            }else if (discomState == 'Jharkhand') {
              var a = 11;
              var b = 22;
            }else if (discomState == 'Punjab') {
              var a = 12;
              var b = 23;
            }
            for (var t = 1; t <= 96; t++) {
              sheet1.fill(a , t + 19, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
              });
              sheet1.fill(13, t + 19, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
              });
              sheet1.fill(b, t + 19, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
              });
              sheet1.fill(24, t + 19, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
              });
            }
          });
        }

        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok
                ? 'ok'
                : "Rajasthan"));
        });

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('putimage', [
            process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
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
            console.log('child process exited with code ' + code);
        });

        if (receivedFrom == 'revision') {
          var fileNameVar = date +"_ALL SCHEDULE FOR RAJASTHAN Rev--"+revisionNumber+ '.xlsx';
        }else {
          var fileNameVar = date+"_ALL SCHEDULE FOR RAJASTHAN.xlsx";
        }
        var discomReports = {
            date: date,
            filePath: process.env.PWD + '/.uploads/sldcReports/' +excelName+ '.xlsx',
            fileName: fileNameVar,
            stateName: "Rajasthan",
            createdAt: new Date(),
            reportType: "sldc_report"
        }
        ReportUrls.insert(discomReports);

        // json insert to keep excel file details
        var jsonDetals = {
          date: date,
          revision_number:revisionNumber,
          filePath: 'sldcReports/' +excelName+ '.xlsx',
          fileName: fileNameVar,
          state: "Rajasthan",
          reportType: "SLDC",
          timestamp: new Date(),
        };
        ExcelDetails.insert(jsonDetals);

        var data = ReportUrls.find({
            date: date,
            reportType: "sldc_report",
            stateName: "Rajasthan"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        var attachmentUrl = data[0].filePath;
        var fileName = data[0].fileName;

        var email = ["seci.scheduling@gmail.com"];
        var spdNamesList = revisedNames.join(',');
        var revisedTxnArr = revisedTxnArr.join(',');
        Meteor.setTimeout(function() {
            if (receivedFrom == 'revision') {
              var subject = " REV-"+revisionNumber +" SOLAR Schedule for " + date +" Raj-"+checkingDiscomState;
              var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date +" REV-"+revisionNumber +" by "+selectedSPDNameVar+' - '+checkingDiscomState+"<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            }else if (receivedFrom == 'DayAhead') {
              var subject = " REV-"+revisionNumber +" SOLAR Schedule for " + date +" "+revisedTxnArr;
              var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date +" REV-"+revisionNumber +" by "+spdNamesList+"<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            }else {
              var subject = "SOLAR Schedule for " + date + " Raj-HPPC , Raj-Assam , Raj-Odisha , Raj-TPDDL , Raj-BYPL , Raj-BRPL, Raj-Himachal, Raj-Maharashtra, Raj-Jharkhand & Raj-Punjab";
              var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + date + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            }
            for (var i = 0; i < email.length; i++) {
                console.log("sending mail Inserted");
                console.log('file name: ' + fileName);
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
                });
            }
        }, 10000);
        return returnSuccess('Rajasthan SLDC Report Sent.');
    }
});

returnSlots = function(type, index) {
    var slots = mySlotFunction();
    if (type == "from") {
        return slots[index];
    } else if (type == "to") {
        var ret = Number(index) + 1;
        return slots[ret];
    }
}
var fs = require('fs');
base64_encode = function(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

getClockTime = function(){
   var now    = new Date();
   var hour   = now.getHours();
   var minute = now.getMinutes();
   var second = now.getSeconds();
   var ap = "AM";
   if (hour   > 11) { ap = "PM";             }
   if (hour   > 12) { hour = hour - 12;      }
   if (hour   == 0) { hour = 12;             }
   if (hour   < 10) { hour   = "0" + hour;   }
   if (minute < 10) { minute = "0" + minute; }
   if (second < 10) { second = "0" + second; }
   var timeString = hour + ':' + minute + " " + ap;
   return timeString;
}

timeInHMS = function() {
  var now    = new Date();
  var hour   = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var ap = "AM";
  if (hour   > 11) { ap = "PM";             }
  if (hour   > 12) { hour = hour - 12;      }
  if (hour   == 0) { hour = 12;             }
  if (hour   < 10) { hour   = "0" + hour;   }
  if (minute < 10) { minute = "0" + minute; }
  if (second < 10) { second = "0" + second; }
  var timeString = hour + ':' + minute + ":" + second;
  return timeString;
}

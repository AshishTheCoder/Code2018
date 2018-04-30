Meteor.methods({
    "callDailyActual": function(date) {
        var json = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved'}).fetch();
        var spdData = [];
        json.forEach(function(item) {
            if (item.profile.registration_form) {
                if (item.profile.registration_form.transaction_type == "Inter") {
                    var data = JmrDaily.find({
                        clientId: item._id,
                        date: date
                    }).fetch();
                    if (data.length > 0) {
                        data[0].spdName = item.profile.registration_form.name_of_spd;
                        data[0].spdStateName = item.profile.registration_form.spd_state;
                        spdData.push(data[0]);
                    }
                }
            }
        });
        if (spdData.length > 0) {
            return returnSuccess("Actual Generation Data Found for "+ date, spdData);
        } else {
            return returnFaliure("Actual generation not submitted for " + date);
        }
    },
    dailyScheduleReportForRajasthan(date) {
        var rajStateArray = ['Delhi(TPDDL)', 'Assam', 'Haryana', 'Odisha', 'Maharashtra', 'Jharkhand', 'Delhi(BRPL)', 'Delhi(BYPL)', 'Himachal Pradesh', 'Punjab'];
        var jsonArray = [];
        for (var i = 0; i < rajStateArray.length; i++) {
            var discomValues = Discom.find({
                'discom_state': rajStateArray[i]
            }).fetch();
            discomValues[0].spdIds.forEach(function(item) {
                if (item.spdState == 'Rajasthan') {
                    var capacity = Meteor.users.find({
                        _id: item.spdId
                    }).fetch();
                    jsonArray.push({
                        discomId: discomValues[0]._id,
                        discomState: discomValues[0].discom_state,
                        spdId: item.spdId,
                        spdName: item.spdName
                    })
                }
            })
        }

        var statePunjabIds = [];
        var stateHaryanaIds = [];
        var stateNormalIds = [];
        jsonArray.forEach(function(item) {
            if (item.discomState == "Punjab") {
                statePunjabIds.push(item);
            } else if (item.discomState == "Haryana") {
                stateHaryanaIds.push(item);
            } else {
                stateNormalIds.push(item);
            }
        })

        var defaultSpds = [];
        ////////////total of punjab//////////
        var resultPunjab = [];
        var punjabNotify = '';
        for (var i = 0; i < statePunjabIds.length; i++) {
            var schedule = JmrDaily.find({
                clientId: statePunjabIds[i].spdId,
                date: date
            }).fetch();
            if (schedule.length > 0) {
                resultPunjab.push(schedule[0].generatedSchedule);
            } else {
                punjabNotify = '*';
                defaultSpds.push(statePunjabIds[i].spdName);
            }
        }

        var count = 0;
        for (var i = resultPunjab.length; i--;) {
            count += Number(resultPunjab[i]);
        }
        var punjabTotal = count;

        ////////haryana only calculation////
        var resultHaryana = [];
        var haryanaNotify = '';
        for (var i = 0; i < stateHaryanaIds.length; i++) {
            var schedule = JmrDaily.find({
                clientId: stateHaryanaIds[i].spdId,
                date: date
            }).fetch();
            if (schedule.length > 0) {
                resultHaryana.push(schedule[0].generatedSchedule);
            } else {
                haryanaNotify = '*';
                defaultSpds.push(stateHaryanaIds[i].spdName);
            }
        }

        var countHaryana = 0;
        for (var i = resultHaryana.length; i--;) {
            countHaryana += Number(resultHaryana[i]);
        }
        var HaryanaTotal = countHaryana;

        // /////calculation of normal spds////////
        var resultNormal = [];
        var mergeResult = [];
        var valueCheck = 0;
        var errorNotify = '';
        for (var i = 0; i < stateNormalIds.length; i++) {
            var schedule = JmrDaily.find({
                clientId: stateNormalIds[i].spdId,
                date: date
            }).fetch();
            if (schedule.length > 0) {
                valueCheck = schedule[0].generatedSchedule;
                errorNotify = '';
            } else {
                valueCheck = 0;
                defaultSpds.push(stateNormalIds[i].spdName);
                errorNotify = '*';
            }
            mergeResult.push({
                state: stateNormalIds[i].discomState,
                value: valueCheck,
                sign: errorNotify
            });
        }

        mergeResult.push({
            state: "Haryana",
            value: HaryanaTotal,
            sign: haryanaNotify
        }, {
            state: "Punjab",
            value: punjabTotal,
            sign: punjabNotify
        })
        var countAll = 0;
        for (var i = mergeResult.length; i--;) {
            countAll += Number(mergeResult[i].value);
        }
        var totalOfAll = Number(countAll).toFixed(7);

        var finalArray = [];
        for (var i = 0; i < rajStateArray.length; i++) {
            for (var j = 0; j < mergeResult.length; j++) {
                if (rajStateArray[i] == mergeResult[j].state) {
                    finalArray.push(mergeResult[j]);
                }
            }
        }

        // ////all return data/////////
        var toReturn = {
            mergeResult: finalArray,
            scheduleDate: date,
            defaultSpds: defaultSpds,
            totalOfAll: totalOfAll
        };

        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/actualGeneration', date + '_' + 'Rajasthan' + '.xlsx');
        var sheet1 = workbook.createSheet('sheet1', 100, 126);

        for (var i = 0; i < 14; i++) {
            for (var j = 3; j < 6; j++) {
                sheet1.border(i, j, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
            }
        }

        sheet1.set(1, 3, 'FOR DATE');
        sheet1.set(2, 3, toReturn.scheduleDate);
        sheet1.set(3, 3, 'ACTUAL GENERATION/CONSUMPTION DATA FOR TRANSACTIONS OF SOLAR ENERGY CORPORATION OF INDIA');
        sheet1.merge({
            col: 3,
            row: 3
        }, {
            col: 13,
            row: 3
        });
        sheet1.merge({
            col: 3,
            row: 2
        }, {
            col: 13,
            row: 2
        });
        sheet1.width(2, 13);

        for (var i = 1; i < 3; i++) {
          for (var j = 3; j < 6; j++) {
            sheet1.fill(i, j, {
                type: 'solid',
                fgColor: 'bcfd69',
                bgColor: '64'
            });
          }
        }
        sheet1.fill(3, 3, {
            type: 'solid',
            fgColor: 'bcfd69',
            bgColor: '64'
        });
        for (var i = 0; i < toReturn.mergeResult.length; i++) {
            sheet1.width(3 + i, 18);
            sheet1.align(3 + i, 4, 'center');
            sheet1.align(3 + i, 5, 'center');
            sheet1.set(3 + i, 4, toReturn.mergeResult[i].state + toReturn.mergeResult[i].sign);
            sheet1.set(3 + i, 5, toReturn.mergeResult[i].value);
            sheet1.fill(3 + i, 4, {
                type: 'solid',
                fgColor: 'fcec04',
                bgColor: '64'
            });
        }
        sheet1.set(2, 5, 'TOTAL IN L.U.');

        sheet1.set(3 + toReturn.mergeResult.length, 4, 'TOTAL');
        sheet1.width(3 + toReturn.mergeResult.length, 13);

        sheet1.set(3 + toReturn.mergeResult.length, 5, toReturn.totalOfAll);

        if (toReturn.defaultSpds.length>0) {
          sheet1.set(1, 7, '*List of SPD who have not provided the generation data');
          for (var i = 0; i < toReturn.defaultSpds.length; i++) {
            sheet1.set(1, 8+i, [i+1]+')'+toReturn.defaultSpds[i]);
          }
        }

        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok ? 'error' : 'Rajasthan'));
        });

        var toInsert = {
            date: date,
            filePath: process.env.PWD + '/.uploads/actualGeneration/' + date + '_' + 'Rajasthan' + '.xlsx',
            stateName: 'Rajasthan',
            createdAt: new Date(),
            reportType: "dailySchedule_report",
            defaultNames: toReturn.defaultSpds
        }
        ReportUrls.insert(toInsert);

        Meteor.call('sendMandrillDailyReport', date);
        return returnSuccess('Check inbox mail send');
    },
    sendMandrillDailyReport: function(date) {
        var data = ReportUrls.find({
            date: date,
            reportType: "dailySchedule_report"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        var attachmentUrl = data[0].filePath;
        var sendNamesArray = data[0].defaultNames;
        var spdDefaultNames = sendNamesArray.join('<br>');

        var subject = "GENERATION SCHEDULE FOR " + date;
        var message = "Dear Sir/Ma'am,<br><br>Please verify the Daily Actual Generation of following SPDs for the date of " + date + '<br><br><br> List of Default SPDs <br><br>' + spdDefaultNames + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

        var email = ["seci.scheduling@gmail.com"];

        Meteor.setTimeout(function() {
            for (var i = 0; i < email.length; i++) {
                console.log("sending mail Inserted");
                var fileName = 'DailyActualGeneration.xlsx';
                Meteor.call("sendMandrillEmailAttachment", email[i], subject, message, attachmentUrl,fileName,function(error, result) {
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
        console.log("Mail Send for actualGeneration");
    }
});

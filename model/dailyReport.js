Meteor.methods({
    "callDiscomSpdIdsDaily": function(discomName) {
        var discomSpds = Discom.find({"discom_state": discomName}).fetch();
        var spds = discomSpds[0].spdIds;
        var json = Meteor.users.find().fetch();
        var spdNames = [];
        spds.forEach(function(item) {
            var json = Meteor.users.find({_id: item.spdId}).fetch();
            if (json[0].profile.registration_form) {
                if (json[0].profile.registration_form.transaction_type == "Inter") {
                    spdNames.push({id: item.spdId, names: json[0].profile.registration_form.name_of_spd, state: json[0].profile.registration_form.spd_state});
                }
            }
        });
        return returnSuccess('Retrived all discom spd names daily report', spdNames);
    },

    "callDailyDiscom": function(list, date, selectedDiscomState, comparisionArray) {
        var dateThis = date.split('-');
        dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
        dateThis.setDate(dateThis.getDate() - 1);
        moment(dateThis).format('DD-MM-YYYY');
        var minusOneDay = moment(dateThis).format('DD-MM-YYYY');

        var state = list[0].state;
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

        /////////stu Rate if applicable///////////
        var rate = [];
        var splitDate = date.split('-');
        var stateSTUvar = StuCharges.find({
            month: splitDate[1],
            year: splitDate[2],
            state: state
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        if (stateSTUvar.length > 0) {
            rate.push(stateSTUvar[0].stuRate);
        }

        if (rate.length > 0) {
            var revisionsValue = [];
            var result = [];
            var lossResult = [];
            for (var j = 0; j < 96; j++) {
                var show = [];
                var showLoss = [];
                var bid = 0;
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

            //////////fetching realtime data from server/////////
            var nameOfSpdState = state.toUpperCase();
            var nameofDiscomState = selectedDiscomState.toUpperCase();

            var NERServerArray = [];
            var ERServerArray = [];
            var NRServerArray = [];
            var WRServerArray = [];
            for (var i = 0; i <= comparisionArray.length; i++) {
                var curData = ERData.find({
                    date: date,
                    dataType: comparisionArray[i]
                }, {
                    sort: {
                        $natural: -1
                    },
                    limit: 1
                }).fetch();
                if (curData.length > 0) {
                    curData[0].secidata.forEach(function(item) {
                        if (item[0] == nameofDiscomState && item[1] == "NERLDC" && item[2] == nameOfSpdState) {
                            for (var j = 3; j <= 98; j++) {
                                NERServerArray.push(item[j]);
                            }
                        } else if (item[0] == nameofDiscomState && item[1] == "ERLDC" && item[2] == nameOfSpdState) {
                            for (var j = 3; j <= 98; j++) {
                                ERServerArray.push(item[j].toFixed(2));
                            }
                        }
                    })
                }
                if (comparisionArray[i] == "NRLDC") {
                    var serverData = NRWRData.find({
                        date: date, dataType: 'NRLDC',
                        // state: nameOfSpdState
                        state: state
                    }, {
                        sort: {
                            $natural: -1
                        },
                        limit: 1
                    }).fetch();

                    if (serverData.length > 0) {
                        var seciValues = serverData[0].secidata;
                        seciValues.forEach(function(item) {
                            if (nameofDiscomState == "DELHI(BRPL)" || nameofDiscomState == "DELHI(BYPL)" || nameofDiscomState == "DELHI(TPDDL)") {
                                var match = item[3] + item[4];
                                if (match == nameofDiscomState) {
                                    for (var i = 7; i < 103; i++) {
                                        NRServerArray.push(item[i]);
                                    }
                                }
                            } else if (item[3] == nameofDiscomState) {
                                for (var i = 7; i < 103; i++) {
                                    NRServerArray.push(item[i]);
                                }
                            } else if (nameofDiscomState == "HIMACHAL PRADESH") {
                                if (item[3] == "HP") {
                                    for (var i = 7; i < 103; i++) {
                                        NRServerArray.push(item[i]);
                                    }
                                }
                            }
                        })
                    }
                }
                if (comparisionArray[i] == "WRLDC") {
                    var serverDataWRLDC = NRWRData.find({
                        date: date,
                        dataType: 'WRLDC',
                        state: state
                    }, {
                        sort: {
                            $natural: -1
                        },
                        limit: 1
                    }).fetch();
                    if (serverDataWRLDC.length > 0) {
                        serverDataWRLDC[0].secidata.forEach(function(item) {
                            if (item[0] == selectedDiscomState) {
                                for (var j = 9; j <= 104; j++) {
                                    WRServerArray.push(item[j]);
                                }
                            }
                        })

                    }
                }
            }

            var valueHighestRevision = _.uniq(revisionsValue);
            var max_of_array = Math.max.apply(Math, valueHighestRevision);

            if (selectedDiscomState == "ORISSA") {
                var LTOAnumber = Discom.find({discom_state: "Odisha"}).fetch();
                var getLTOA = LTOAnumber[0].LTOA_number;
                var splitLtoa = getLTOA.split(',');
                if (state == 'Gujarat') {
                    var showLTOA = splitLtoa[0];
                } else {
                    var showLTOA = splitLtoa[1];
                }
            } else if (selectedDiscomState == "Maharashtra") {
                var LTOAnumber = Discom.find({discom_state: "Maharashtra"}).fetch();
                var getLTOA = LTOAnumber[0].LTOA_number;
                var splitLtoa = getLTOA.split(',');
                if (state == 'MP') {
                    var showLTOA = splitLtoa[0];
                } else {
                    var showLTOA = splitLtoa[1];
                }
            } else {
                var LTOAnumber = Discom.find({discom_state: selectedDiscomState}).fetch();
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
                spdState: nameOfSpdState.toUpperCase(),
                discomSate: nameofDiscomState.toUpperCase(),
                minusOneDay: minusOneDay,
                NRData: NRServerArray,
                NERData: NERServerArray,
                ERData: ERServerArray,
                WRData: WRServerArray
            };
            return returnSuccess('Daily Discom data for ' + selectedDiscomState, toReturn);
        } else {
            return returnFaliure("Please Insert StuLosses for selected month");
        }
    },
    "callDailyDiscomIndividual": function(id, state, date, discomState, nameOfSpd) {
        var dateThis = date.split('-');
        dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
        dateThis.setDate(dateThis.getDate() - 1);
        moment(dateThis).format('DD-MM-YYYY');
        var minusOneDay = moment(dateThis).format('DD-MM-YYYY');

        var LTOAnumber = Discom.find({discom_state: discomState}).fetch();
        var rate = [];
        var splitDate = date.split('-');

        var stateSTUvar = StuCharges.find({
            month: splitDate[1],
            year: splitDate[2],
            state: state
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        if (stateSTUvar.length > 0) {
            rate.push(stateSTUvar[0].stuRate);
        };

        var result = [];
        var lossResult = [];
        var revisionsValue = 0;
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showLoss = [];
            var bid = 0;
            var schedule = ScheduleSubmission.find({clientId: id, date: date}).fetch();
            if (schedule != '') {
                schedule.forEach(function(item) {
                    var jsonData = item.json;
                    var length = jsonData.length;
                    revisionsValue = Number(length) - 1;
                    var getSchedule = jsonData[length - 1];
                    bid = getSchedule.data[j].bidMwh;
                })
            } else {
                bid = "0.00";
            }

            show.push(bid);
            var Stu = rate[0];
            var percentage = Number(Stu) / 100;
            var calculate = Number(bid) * Number(percentage);
            var error = Number(bid) - Number(calculate);
            showLoss.push(error.toFixed(2));

            result.push(show);
            lossResult.push(showLoss);
        }

        var totalArray = [];
        for (var z = 0; z < result[0].length; z++) {
            var sum = 0;
            var sumLoss = 0;
            for (var k = 0; k < result.length; k++) {
                sum += Number(result[k][z]);
                sumLoss += Number(lossResult[k][z]);
            }
            totalArray.push((Number(sum) / 4000).toFixed(7));
            var errorTotalValue = (Number(sumLoss) / 4000).toFixed(7);
        }

        if (rate.length > 0) {
            var toReturn = {
                result: result,
                lossResult: lossResult,
                LTOA_number: LTOAnumber[0].LTOA_number,
                totalArray: totalArray[0],
                errorTotalValue: errorTotalValue,
                spdState: state.toUpperCase(),
                discomSate: discomState.toUpperCase(),
                valueHighestRevision: revisionsValue,
                scheduleDate: date,
                nameOfSpd: nameOfSpd,
                minusOneDay: minusOneDay,
                rate: rate + '%'
            };
            return returnSuccess('daily individual', toReturn);
        } else {
            return returnFaliure("Please Insert StuLosses for selected month");
        }
    },

    callDiscomForMp(selectedState, date) {
        var data = RrfData.find({
            rrfDate: date
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        console.log('Data Length = '+data.length);
        if (data.length > 0) {
            if (data[0].verified == true) {
                ///special for minus date/////////
                var forIdsOnly = Discom.find({discom_state: selectedState}).fetch();
                var spdArray = [];
                _.each(forIdsOnly[0].spdIds, function(item, key) {
                    if (item.spdState == 'MP') {
                        spdArray.push(item.spdId)
                    }
                })

                var dateThis = date.split('-');
                dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
                dateThis.setDate(dateThis.getDate() - 1);
                moment(dateThis).format('DD-MM-YYYY');
                var minusOneDay = moment(dateThis).format('DD-MM-YYYY');

                for (var i = 0; i < spdArray.length; i++) {
                    var schedule = ScheduleSubmission.find({clientId: spdArray[i], date: date}).fetch();
                    if (schedule.length > 0) {
                        if (schedule[0].revision_status == 'revised') {
                            minusOneDay = schedule[0].current_date_revision
                        }
                    }
                }

                var hrefData = RrfData.find({rrfDate: date}).fetch();
                var hrefArray = [];
                hrefData.forEach(function(item) {
                    hrefArray.push({revisionNumber: item.revisionNumber, hrefValue: item.hrefValue})
                })

                var value = data[0].mergeArray;
                var createArray = [];
                var detailsArray = []
                value.forEach(function(item) {
                    if (item[0] == selectedState) {
                        for (var i = 2; i <= 97; i++) {
                            createArray.push(item[i]);
                        }
                        for (var i = 0; i < 2; i++) {
                            detailsArray.push(item[i]);
                        }
                    }
                })
                createArray.push((Number(sumOfArray(createArray)) / 4000).toFixed(7));
                if (date > moment().format('DD-MM-YYYY')) {
                  revision = 0;
                }else {
                  if (selectedState=='Maharashtra') {
                    var revision = RrfData.find({rrfDate: date, verified: true, revisedState: 'Goa'}).count();
                  }else {
                    var revision = RrfData.find({rrfDate: date, verified: true, revisedState: selectedState}).count();
                  }
                }

                var spdState = 'MP';
                if (selectedState == "Maharashtra") {
                    var LTOAnumber = Discom.find({discom_state: "Maharashtra"}).fetch();
                    var getLTOA = LTOAnumber[0].LTOA_number;
                    var splitLtoa = getLTOA.split(',');
                    if (spdState == 'MP') {
                        var showLTOA = splitLtoa[0];
                    }
                } else {
                    var LTOAnumber = Discom.find({discom_state: selectedState}).fetch();
                    var showLTOA = LTOAnumber[0].LTOA_number;
                }

                var toReturn = {
                    minusOneDay: minusOneDay,
                    scheduleDate: date,
                    detailsArray: detailsArray,
                    spdState: 'MP',
                    LTOA_number: showLTOA,
                    discomState: selectedState.toUpperCase(),
                    result: createArray,
                    valueHighestRevision: revision,
                    hrefArray: hrefArray
                }
                return returnSuccess('MP Data for: ' + selectedState + ' ' + date, toReturn);
            } else {
                return returnFaliure('Last MP RRF Data is not Verfied for: ' + date);
            }
        } else {
            return returnFaliure('RRF not found for: ' + date);
        }
    },
    sendDiscomForMP(toReturn) {
         var excelName = toReturn.scheduleDate + '_' + toReturn.spdState + '_' + toReturn.detailsArray[0] + '_R' + toReturn.valueHighestRevision;
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/MP_discom_reports/',excelName+ '.xlsx');
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
        sheet1.set(3, 11, toReturn.spdState + '-' + toReturn.discomState);
        sheet1.set(7, 11, 'ISSUE-DATE:');
        sheet1.set(9, 11, toReturn.minusOneDay);
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
        sheet1.width(2, 5);
        sheet1.width(3, 16);
        sheet1.valign(3, 18, 'center');
        sheet1.set(3, 18, 'AT ' + toReturn.spdState + ' PERIPHERY');
        sheet1.set(3, 19, returningName(toReturn.detailsArray, 1));
        sheet1.wrap(3, 19, 'true');
        sheet1.align(3, 19, 'center');
        sheet1.valign(3, 18, 'center');
        sheet1.wrap(3, 18, 'true');
        sheet1.height(18, 30);
        sheet1.align(3, 18, 'center');

        for (var s = 20; s < 116; s++) {
            sheet1.set(1, s, returnSlots("from", s - 20) + '-' + returnSlots("to", s - 20));
            sheet1.set(2, s, s - 19);
            sheet1.set(3, s, returningColoum(toReturn.result, s - 20));
            sheet1.align(3, s, 'center');
            for (var i = 1; i < 4; i++) {
                sheet1.border(i, s, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
                sheet1.border(i, 116, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
            }
        }

        sheet1.set(1, 116, 'TOTAL(MUs)');
        sheet1.align(3, 116, 'center');
        sheet1.set(3, 116, returningColoum(toReturn.result, 96));

        for (var i = 0; i < 2; i++) {
            sheet1.border(1, 18 + i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.border(3, 18 + i, {
                left: 'medium',
                top: 'medium',
                right: 'medium',
                bottom: 'medium'
            });
            sheet1.merge({
                col: 1,
                row: 18 + i
            }, {
                col: 2,
                row: 18 + i
            });
        }

        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok
                ? 'ok'
                : toReturn.spdState + '_' + toReturn.detailsArray[0]));
        });

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('putimage', [
            process.env.PWD + '/.uploads/MP_discom_reports/' +excelName+ '.xlsx',
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

        var rrfReports = {
            date: toReturn.scheduleDate,
            filePath: process.env.PWD + '/.uploads/MP_discom_reports/' +excelName+ '.xlsx',
            fileName: toReturn.scheduleDate + '_' + toReturn.spdState + '_' + toReturn.detailsArray[0] + '_R' + toReturn.valueHighestRevision + '.xlsx',
            stateName: toReturn.detailsArray[0],
            createdAt: new Date(),
            reportType: "rrf_report"
        }
        ReportUrls.insert(rrfReports);

        // json insert to keep excel file details
        var jsonDetals = {
          date: toReturn.scheduleDate,
          revision_number:toReturn.valueHighestRevision,
          filePath: 'MP_discom_reports/' +excelName+ '.xlsx',
          fileName: toReturn.scheduleDate + '_' + toReturn.spdState + '_' + toReturn.detailsArray[0] + '_R' + toReturn.valueHighestRevision + '.xlsx',
          state: toReturn.detailsArray[0],
          reportType: "Discom",
          timestamp: new Date(),
        };
        ExcelDetails.insert(jsonDetals);


        var data = ReportUrls.find({
            date: toReturn.scheduleDate,
            reportType: "rrf_report",
            stateName: toReturn.detailsArray[0]
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
            var subject = "Schedule for " + toReturn.scheduleDate + " MP-" + toReturn.discomState + " REV-" + toReturn.valueHighestRevision;
            var message = "Dear Sir/Ma'am,<br><br>Please find attached here with the schedule for " + toReturn.scheduleDate + " REV-" + toReturn.valueHighestRevision + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

            for (var i = 0; i < email.length; i++) {
                console.log('file name: ' + fileName);
                var date = toReturn.scheduleDate;
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

        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
          // data insert in log Details collection
          LogDetails.insert({
              ip_address:ipArr,
              user_id: Meteor.userId(),
              user_name: Meteor.user().username,
              log_type: "MP-" + toReturn.discomState + " Discom Report REV-" + toReturn.valueHighestRevision+" sent",
              template_name: 'dailyReportSECIL',
              event_name: 'shootMPReport',
              action_date: moment().format('DD-MM-YYYY'),
              timestamp: new Date()
          });

        return returnSuccess('MP Discom Report Sent');
    }
});

returningName = function(array, index) {
    if (array) {
        return array[index];
    }
}

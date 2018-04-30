Meteor.methods({
    "gettingSPDListForMonthlyYearlyReport": function() {
        var json = Meteor.users.find({
            'profile.user_type': 'spd',
            'profile.status': 'approved',
            'profile.registration_form.transaction_type': 'Inter'
        }).fetch();
        var count = 1;
        json.forEach(function(er) {
            er.serialNO = count;
            count++;
        });
        return returnSuccess('Getting SPD list by Admin to view Monthly and Yearly Report', json);
    },
    gettingDISCOMListForMonthlyYearlyReport() {
        var jsonData = Discom.find({
            transaction_type: 'Inter'
        }).fetch();
        var dataArr = [];
        jsonData.forEach(function(item) {
            var json = {
                id: item._id,
                discom_name: item.nameof_buyingutility,
                discom_state: item.discom_state
            };
            dataArr.push(json);
        });
        return returnSuccess('Getting DISCOM list by Admin to view Monthly and Yearly Report', dataArr);
    },
    getSPDNamesOntheBasisOfDiscom(discomId) {
        var discomData = Discom.find({
            _id: discomId
        }).fetch();
        var returnData = [];
        discomData[0].spdIds.forEach(function(item) {
            if (item.transaction_type == 'Inter') {
                var json = {
                    spdId: item.spdId,
                    spdName: item.spdName,
                    spdState: item.spdState
                };
                returnData.push(json);
            }
        });
        return returnSuccess('Finding SPD on the basis os Discom for Monthly/Yearly Report', returnData);
    },
    "getMonthlyReportForInvidualSPD": function(spdid, month, year) {
        var finalArr = [];
        var result = [];
        var i = 1;
        var date = new Date(year, Number(month) - 1, 1);
        var total = 0;
        var totalWithLoss = 0;
        while (date.getMonth() == Number(month) - 1) {
            var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
            var newDate = update.split("-");
            var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            var dateVar = moment(myObject).format('DD-MM-YYYY');
            var scheduleJson = {};
            var scheduleData = ScheduleSubmission.find({
                clientId: spdid,
                date: dateVar
            }).fetch();
            var mwhData = 0;
            var mwhWithLoss = 0;
            if (scheduleData.length > 0) {
                scheduleData.forEach(function(item) {
                    var jsonData = item.json;
                    var length = jsonData.length;
                    var getSchedule = jsonData[length - 1];
                    mwhData = getSchedule.totalMwh;
                    var data = Number(mwhData);
                    total += data;
                    //loss data
                    if (Number(year) == 2016 && Number(month) < 12) {
                      totalWithLoss = '0.00';
                    }else {
                      var jsonLossData = item.jsonWithLoss;
                      var lengthLoss = jsonLossData.length;
                      var getLossSchedule = jsonLossData[lengthLoss - 1];
                      mwhWithLoss = getLossSchedule.totalMwh;
                      var lossData = Number(mwhWithLoss);
                      totalWithLoss += lossData;
                    }
                });
            } else {
                mwhData = '0.00';
                mwhWithLoss = '0.00';
            }
            scheduleJson = {
                sn: i,
                date: dateVar,
                mwhData: mwhData,
                mwhWithLoss: mwhWithLoss
            };
            result.push(scheduleJson);
            i++;
            date.setDate(date.getDate() + 1);
        }
        var totalJson = {
            total: Number(total).toFixed(7),
            totalWithLoss: Number(totalWithLoss).toFixed(7)
        };
        finalArr.push({
            result: result
        });
        finalArr.push({
            totalJson: totalJson
        });
        return returnSuccess('Getting Individual Monthly SPD Report by Admin', finalArr);
    },
    getYearlyReportForInvidualSPD(spdid, year) {
        var FinalYearlyRepArr = [];
        var monthlyReportArr = [];
        var monthlyTotalMwh = 0;
        var monthlyTotalMwhWithLoss = 0;
        for (var i = 1; i <= 12; i++) {
            var date = new Date(year, Number(i) - 1, 1);
            var total = 0;
            var totalWithLoss = 0;
            while (date.getMonth() == Number(i) - 1) {
                var update = date.getDate() + "-" + Number(i) + "-" + Number(year);
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                var dateVar = moment(myObject).format('DD-MM-YYYY');
                var scheduleData = ScheduleSubmission.find({
                    clientId: spdid,
                    date: dateVar
                }).fetch();
                var mwhData = 0;
                var mwhWithLoss = 0;
                if (scheduleData.length > 0) {
                    scheduleData.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        var getSchedule = jsonData[length - 1];
                        mwhData = getSchedule.totalMwh;
                        var data = Number(mwhData);
                        total += data;
                        //loss data
                        var jsonLossData = item.jsonWithLoss;
                        var lengthLoss = jsonLossData.length;
                        var getLossSchedule = jsonLossData[lengthLoss - 1];
                        mwhWithLoss = getLossSchedule.totalMwh;
                        var lossData = Number(mwhWithLoss);
                        totalWithLoss += lossData;
                    });
                } else {
                    mwhData = '0.00';
                    mwhWithLoss = '0.00';
                }
                date.setDate(date.getDate() + 1);
            }
            var totalMwhVar = Number(total);
            monthlyTotalMwh += totalMwhVar;
            //loss monthly total
            var totalLossMwhVar = Number(totalWithLoss);
            monthlyTotalMwhWithLoss += totalLossMwhVar;

            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var fromDateMonth = getArray(dateArr, Number(i));
            var period = fromDateMonth + "' " + year;
            var totalJson = {
                sr: i,
                month: period,
                total: total.toFixed(7),
                totalWithLoss: totalWithLoss.toFixed(7)
            };
            monthlyReportArr.push(totalJson);
        }
        var monthlyTotalJsonVar = {
            monthlyTotalMwh: monthlyTotalMwh.toFixed(7),
            monthlyTotalMwhWithLoss: monthlyTotalMwhWithLoss.toFixed(7)
        };
        FinalYearlyRepArr.push({
            monthlyReportArr: monthlyReportArr
        });
        FinalYearlyRepArr.push({
            monthlyTotalJsonVar: monthlyTotalJsonVar
        });
        return returnSuccess('Getting Individual Yearly SPD Report by Admin', FinalYearlyRepArr);
    },
    "getMonthlyReportForInvidualSPDByDiscom": function(spdid, month, year, discomId, discomState, selectedState) {
        if (spdid != 'All') {
            var finalArr = [];
            var result = [];
            var i = 1;
            var date = new Date(year, Number(month) - 1, 1);
            var total = 0;
            var totalWithLoss = 0;
            while (date.getMonth() == Number(month) - 1) {
                var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                var dateVar = moment(myObject).format('DD-MM-YYYY');
                var scheduleJson = {};
                var scheduleData = ScheduleSubmission.find({
                    clientId: spdid,
                    date: dateVar
                }).fetch();
                var mwhData = 0;
                var mwhWithLoss = 0;
                if (scheduleData.length > 0) {
                    scheduleData.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        var getSchedule = jsonData[length - 1];
                        mwhData = getSchedule.totalMwh;
                        var data = Number(mwhData);
                        total += data;
                        //loss data
                        var jsonLossData = item.jsonWithLoss;
                        var lengthLoss = jsonLossData.length;
                        var getLossSchedule = jsonLossData[lengthLoss - 1];
                        mwhWithLoss = getLossSchedule.totalMwh;
                        var lossData = Number(mwhWithLoss);
                        totalWithLoss += lossData;
                    });
                } else {
                    mwhData = '0.00';
                    mwhWithLoss = '0.00';
                }
                scheduleJson = {
                    sn: i,
                    date: dateVar,
                    mwhData: mwhData,
                    mwhWithLoss: mwhWithLoss
                };
                result.push(scheduleJson);
                i++;
                date.setDate(date.getDate() + 1);
            }
            var totalJson = {
                total: total.toFixed(7),
                totalWithLoss: totalWithLoss.toFixed(7)
            };
            finalArr.push({
                result: result
            });
            finalArr.push({
                totalJson: totalJson
            });
            return returnSuccess('Getting Individual Monthly Discom Report by Admin', finalArr);
        } else if (spdid == 'All') {

            var spdList = Discom.find({
                _id: discomId
            }).fetch();
            var idArray = [];
            var arrName = [];
            var stateArr = [];
            if (discomState == 'Odisha' && selectedState == 'Rajasthan') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'Rajasthan' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else if (discomState == 'Odisha' && selectedState == 'Gujarat') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'Gujarat' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else if (discomState == 'Maharashtra' && selectedState == 'MP') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'MP' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else if (discomState == 'Maharashtra' && selectedState == 'Rajasthan') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'Rajasthan' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            }
            var colSpanVar = idArray.length + 1;
            ////////////////////////////////////////////////////////////////////////////
            var date = new Date(year, month - 1, 1);
            var result = [];
            var lossResult = [];
            var dateArr = [];
            while (date.getMonth() == month - 1) {
                var update = date.getDate() + "-" + month + "-" + year;
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                var dateVar = moment(myObject).format('DD-MM-YYYY');
                var show = [];
                var showLossData = [];

                ////id a loop//////////////
                for (var i = 0; i < idArray.length; i++) {
                    var schedule = ScheduleSubmission.find({
                        clientId: idArray[i],
                        date: moment(myObject).format('DD-MM-YYYY')
                    }).fetch();

                    if (schedule != '') {
                        schedule.forEach(function(item) {
                            var jsonData = item.json;
                            var length = jsonData.length;
                            var getSchedule = jsonData[length - 1];
                            var mwhData = getSchedule.totalMwh;
                            show.push(mwhData);

                            var jsonLossData = item.jsonWithLoss;
                            var lossDataLength = jsonLossData.length;
                            var getScheduleLoss = jsonLossData[lossDataLength - 1];
                            var mwhLossData = getScheduleLoss.totalMwh;
                            showLossData.push(mwhLossData);
                        });
                    } else {
                        show.push("0.0000000");
                        showLossData.push("0.0000000");
                    }
                }
                //////id loop over///////////////
                var count = 0;
                for (var i = show.length; i--;) {
                    count += Number(show[i]);
                }
                var lossCount = 0;
                for (var i = showLossData.length; i--;) {
                    lossCount += Number(showLossData[i]);
                }
                show.push(count.toFixed(7));
                showLossData.push(lossCount.toFixed(7))
                result.push(show);
                lossResult.push(showLossData);
                dateArr.push(dateVar);

                date.setDate(date.getDate() + 1);
            }
            ////////////////////////////////////////////////////////////////////////
            var tempArray = [];
            for (var z = 0; z < result[0].length; z++) {
                var sum = 0;
                for (var k = 0; k < result.length; k++) {
                    sum += Number(result[k][z]);
                }
                tempArray.push(sum.toFixed(7));
            }
            var tempArrayLoss = [];
            for (var z = 0; z < lossResult[0].length; z++) {
                var lossSum = 0;
                for (var k = 0; k < lossResult.length; k++) {
                    lossSum += Number(lossResult[k][z]);
                }
                tempArrayLoss.push(lossSum.toFixed(7));
            }
            var json = {
                colSpanVar: colSpanVar,
                arrName: arrName,
                stateArr: stateArr,
                dateArr: dateArr,
                result: result,
                tempArray: tempArray,
                lossResult: lossResult,
                tempArrayLoss: tempArrayLoss
            };
            return returnSuccess('Getting All Monthly Discom Report by Admin', json);
        }
    },
    "getYearlyReportForInvidualSPDByDiscom": function(spdid, year, discomId, discomState, selectedState) {
        if (spdid != 'All') {
            var FinalYearlyRepArr = [];
            var yearlyReportArr = [];
            var yearlyTotalMwh = 0;
            var yearlyTotalMwhWithLoss = 0;
            for (var i = 1; i <= 12; i++) {
                var finalArr = [];
                var date = new Date(year, Number(i) - 1, 1);
                var total = 0;
                var totalWithLoss = 0;
                while (date.getMonth() == Number(i) - 1) {
                    var update = date.getDate() + "-" + Number(i) + "-" + Number(year);
                    var newDate = update.split("-");
                    var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                    var dateVar = moment(myObject).format('DD-MM-YYYY');
                    var scheduleData = ScheduleSubmission.find({
                        clientId: spdid,
                        date: dateVar
                    }).fetch();
                    var mwhData = 0;
                    var mwhWithLoss = 0;
                    if (scheduleData.length > 0) {
                        scheduleData.forEach(function(item) {
                            var jsonData = item.json;
                            var length = jsonData.length;
                            var getSchedule = jsonData[length - 1];
                            mwhData = getSchedule.totalMwh;
                            var data = Number(mwhData);
                            total += data;
                            //loss data
                            var jsonLossData = item.jsonWithLoss;
                            var lengthLoss = jsonLossData.length;
                            var getLossSchedule = jsonLossData[lengthLoss - 1];
                            mwhWithLoss = getLossSchedule.totalMwh;
                            var lossData = Number(mwhWithLoss);
                            totalWithLoss += lossData;
                        });
                    } else {
                        mwhData = '0.00';
                        mwhWithLoss = '0.00';
                    }
                    date.setDate(date.getDate() + 1);
                }
                var totalMwhVar = Number(total);
                yearlyTotalMwh += totalMwhVar;
                //loss monthly total
                var totalLossMwhVar = Number(totalWithLoss);
                yearlyTotalMwhWithLoss += totalLossMwhVar;

                var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var fromDateMonth = getArray(dateArr, Number(i));
                var period = fromDateMonth + "' " + year;

                var totalJson = {
                    sr: i,
                    month: period,
                    total: total.toFixed(7),
                    totalWithLoss: totalWithLoss.toFixed(7)
                };
                yearlyReportArr.push(totalJson);
            }
            var yearlyTotalJsonVar = {
                yearlyTotalMwh: yearlyTotalMwh.toFixed(7),
                yearlyTotalMwhWithLoss: yearlyTotalMwhWithLoss.toFixed(7)
            };
            FinalYearlyRepArr.push({
                yearlyReportArr: yearlyReportArr
            });
            FinalYearlyRepArr.push({
                yearlyTotalJsonVar: yearlyTotalJsonVar
            });
            return returnSuccess('Getting Individual Yearly Discom Report by Admin', FinalYearlyRepArr);
        } else if (spdid == 'All') {

            var spdList = Discom.find({
                _id: discomId
            }).fetch();
            var idArray = [];
            var arrName = [];
            var stateArr = [];
            if (discomState == 'Odisha' && selectedState == 'Rajasthan') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'Rajasthan' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else if (discomState == 'Odisha' && selectedState == 'Gujarat') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'Gujarat' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else if (discomState == 'Maharashtra' && selectedState == 'MP') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'MP' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else if (discomState == 'Maharashtra' && selectedState == 'Rajasthan') {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.spdState == 'Rajasthan' && item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            } else {
                spdList[0].spdIds.forEach(function(item) {
                    if (item.transaction_type == 'Inter') {
                        idArray.push(item.spdId);
                        arrName.push(item.spdName);
                        stateArr.push({
                            state: item.spdState.toUpperCase()
                        });
                    }
                });
            }
            var colSpanVar = idArray.length + 1;
            ////////////////////////////////////////////////////////////////////////////


            var yearlyReportArr = [];
            var yearlyReportArrWithLoss = [];
            var dateArr = [];
            var dateArrAll = [];
            for (var m = 1; m <= 12; m++) {

                var date = new Date(year, Number(m) - 1, 1);
                var result = [];
                var lossResult = [];
                var dateArr = [];

                var showMonthlyData = [];
                var showLossMonthlyDataData = [];
                while (date.getMonth() == Number(m) - 1) {
                    var update = date.getDate() + "-" + Number(m) + "-" + year;
                    var newDate = update.split("-");
                    var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                    var dateVar = moment(myObject).format('DD-MM-YYYY');
                    var show = [];
                    var showLossData = [];

                    ////id a loop//////////////
                    for (var i = 0; i < idArray.length; i++) {
                        var schedule = ScheduleSubmission.find({
                            clientId: idArray[i],
                            date: moment(myObject).format('DD-MM-YYYY')
                        }).fetch();

                        if (schedule != '') {
                            schedule.forEach(function(item) {
                                var jsonData = item.json;
                                var length = jsonData.length;
                                var getSchedule = jsonData[length - 1];
                                var mwhData = getSchedule.totalMwh;
                                show.push(mwhData);

                                var jsonLossData = item.jsonWithLoss;
                                var lossDataLength = jsonLossData.length;
                                var getScheduleLoss = jsonLossData[lossDataLength - 1];
                                var mwhLossData = getScheduleLoss.totalMwh;
                                showLossData.push(mwhLossData);
                            });
                        } else {
                            show.push("0.0000000");
                            showLossData.push("0.0000000");
                        }
                    }
                    //////id loop over///////////////
                    var count = 0;
                    for (var i = show.length; i--;) {
                        count += Number(show[i]);
                    }
                    var lossCount = 0;
                    for (var i = showLossData.length; i--;) {
                        lossCount += Number(showLossData[i]);
                    }
                    show.push(count.toFixed(7));
                    showLossData.push(lossCount.toFixed(7))

                    result.push(show);
                    lossResult.push(showLossData);
                    dateArr.push(dateVar);

                    date.setDate(date.getDate() + 1);
                }
                ////////////////////////////////////////////////////////////////////////

                var tempArray = [];
                for (var z = 0; z < result[0].length; z++) {
                    var sum = 0;
                    for (var k = 0; k < result.length; k++) {
                        sum += Number(result[k][z]);
                    }
                    tempArray.push(sum.toFixed(7));
                }
                yearlyReportArr.push(tempArray);

                var tempArrayLoss = [];
                for (var z = 0; z < lossResult[0].length; z++) {
                    var lossSum = 0;
                    for (var k = 0; k < lossResult.length; k++) {
                        lossSum += Number(lossResult[k][z]);
                    }
                    tempArrayLoss.push(lossSum.toFixed(7));
                }
                yearlyReportArrWithLoss.push(tempArrayLoss);

                var period = monthInWords(m) + "' " + year;
                dateArrAll.push({
                    sr: m,
                    month: period
                });
            }

            var totalYearlyReportArr = [];
            var totalWithLossYearlyReportArrWithLoss = [];
            for (var z = 0; z < yearlyReportArr[0].length; z++) {
                var sum = 0;
                for (var k = 0; k < yearlyReportArr.length; k++) {
                    sum += Number(yearlyReportArr[k][z]);
                }
                totalYearlyReportArr.push(sum.toFixed(7));
            }

            for (var z = 0; z < yearlyReportArrWithLoss[0].length; z++) {
                var lossSum = 0;
                for (var k = 0; k < yearlyReportArrWithLoss.length; k++) {
                    lossSum += Number(yearlyReportArrWithLoss[k][z]);
                }
                totalWithLossYearlyReportArrWithLoss.push(lossSum.toFixed(7));
            }

            var json = {
                colSpanVar: colSpanVar,
                arrName: arrName,
                stateArr: stateArr,
                dateArr: dateArrAll,
                result: yearlyReportArr,
                tempArray: totalYearlyReportArr,
                lossResult: yearlyReportArrWithLoss,
                tempArrayLoss: totalWithLossYearlyReportArrWithLoss
            };
            return returnSuccess('Getting Yearly Discom Report by Admin', json);
        }
    },
    "getMonthlySLDCReport": function(reportType, monthlyORyearlyVar, ddlSLDCState, month, year) {
        if (ddlSLDCState == 'Gujarat') {
            var date = new Date(year, Number(month) - 1, 1);
            var total = 0;
            var totalWithLoss = 0;
            var monthlyArr = [];
            var monthlyArrWithLoss = [];
            var dateArr = [];
            while (date.getMonth() == Number(month) - 1) {
                var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                var dateVar = moment(myObject).format('DD-MM-YYYY');
                var sldcdataVar = SLDCReports.find({
                    schedule_date: dateVar,
                    sldc_state: ddlSLDCState
                }).fetch();
                var latestRevisedDailyTotal = [];
                var latestRevisedDailyTotalWithLoss = [];
                if (sldcdataVar.length > 0) {
                    var dataArrLength = Number(sldcdataVar[0].data.length) - 1;
                    latestRevisedDailyTotal = sldcdataVar[0].data[dataArrLength].result[96];
                    latestRevisedDailyTotalWithLoss = sldcdataVar[0].data[dataArrLength].lossResult[96];
                } else {
                    latestRevisedDailyTotal = ['0.0000000', '0.0000000', '0.0000000', '0.0000000', '0.0000000'];
                    latestRevisedDailyTotalWithLoss = ['0.0000000', '0.0000000', '0.0000000', '0.0000000', '0.0000000'];
                }
                dateArr.push(dateVar);
                monthlyArr.push(latestRevisedDailyTotal);
                monthlyArrWithLoss.push(latestRevisedDailyTotalWithLoss);
                date.setDate(date.getDate() + 1);
            }
            var tempArray = [];
            for (var z = 0; z < monthlyArr[0].length; z++) {
                var sum = 0;
                for (var k = 0; k < monthlyArr.length; k++) {
                    sum += Number(monthlyArr[k][z]);
                }
                tempArray.push(sum.toFixed(7));
            }
            var tempArrayLoss = [];
            for (var z = 0; z < monthlyArrWithLoss[0].length; z++) {
                var lossSum = 0;
                for (var k = 0; k < monthlyArrWithLoss.length; k++) {
                    lossSum += Number(monthlyArrWithLoss[k][z]);
                }
                tempArrayLoss.push(lossSum.toFixed(7));
            }
            // useing hard code date for getting header name of gujarat yearly report
            var sldcdataVar = SLDCReports.find({schedule_date:'01-01-2017',sldc_state: ddlSLDCState}).fetch();
            var nameArr = sldcdataVar[0].data[0].spdNamesListTotal;
            var nameArrWithLoss = sldcdataVar[0].data[0].spdNamesListLossTotal;
            var json = {
                dateVar: dateArr,
                headBefore: nameArr,
                headAfter: nameArrWithLoss,
                trueResult: monthlyArr,
                errorResult: monthlyArrWithLoss,
                tempArray: tempArray,
                tempArrayLoss: tempArrayLoss
            };
            return returnSuccess('Getting Monthly Gujarat SLDC Report by Admin', json);
        }
        else if (ddlSLDCState == 'MP') {
          var date = new Date(year, Number(month) - 1, 1);
          var dateArr = [];
          var chhattisgarhOneTotal = 0;
          var chhattisgarhTwoTotal = 0;
          var chhattisgarhThreeTotal = 0;
          var goaOneTotal = 0;
          var goaTwoTotal = 0;
          var goaThreeTotal = 0;
          var biharOneTotal = 0;
          var biharTwoTotal = 0;
          while (date.getMonth() == Number(month) - 1) {
              var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
              var newDate = update.split("-");
              var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
              var dateVar = moment(myObject).format('DD-MM-YYYY');
              var sldcdataVar = SLDCReports.find({
                  schedule_date: dateVar,
                  sldc_state: ddlSLDCState
              },{sort:{$natural:-1}, limit:1}).fetch();
              var chhattisgarhArrayData = [];
              var goaArrayData = [];
              var biharArrayData = [];
              if (sldcdataVar.length > 0) {
                  var dataArrLength = Number(sldcdataVar[0].revision_no);
                  chhattisgarhArrayData = sldcdataVar[0].data[dataArrLength].ChhattisgarhArrayResult[96];
                  goaArrayData = sldcdataVar[0].data[dataArrLength].GoaArrayResult[96];
                  biharArrayData = sldcdataVar[0].data[dataArrLength].BiharArrayResult[96];
              } else {
                  chhattisgarhArrayData = ['0.0000000', '0.0000000', '0.0000000'];
                  goaArrayData = ['0.0000000', '0.0000000', '0.0000000'];
                  biharArrayData = ['0.0000000'];
              }
              var chhattisgarhVar1 = Number(chhattisgarhArrayData[0]).toFixed(7);
              var chhattisgarhVar2 = Number(chhattisgarhArrayData[1]).toFixed(7);
              var chhattisgarhVar3 = Number(chhattisgarhArrayData[2]).toFixed(7);
              var goaVar1 = Number(goaArrayData[2]).toFixed(7);
              var goaVar2 = Number(goaArrayData[0]).toFixed(7);
              var goaVar3 = Number(goaArrayData[1]).toFixed(7);
              var biharVar1 = Number(biharArrayData[0]).toFixed(7);
              var biharVar2 = Number(biharArrayData[0]).toFixed(7);

              var dataJson = {
                date:dateVar,
                chhattisgarh_one:chhattisgarhVar1,
                chhattisgarh_two:chhattisgarhVar2,
                chhattisgarh_three:chhattisgarhVar3,
                goa_one:goaVar1,
                goa_two:goaVar2,
                goa_three:goaVar3,
                bihar_one:biharVar1,
                bihar_two:biharVar2
              };
              chhattisgarhOneTotal += Number(chhattisgarhVar1);
              chhattisgarhTwoTotal += Number(chhattisgarhVar2);
              chhattisgarhThreeTotal += Number(chhattisgarhVar3);
              goaOneTotal += Number(goaVar1);
              goaTwoTotal += Number(goaVar2);
              goaThreeTotal += Number(goaVar3);
              biharOneTotal += Number(biharVar1);
              biharTwoTotal += Number(biharVar2);
              dateArr.push(dataJson);

              date.setDate(date.getDate() + 1);
          }
          var jsonTotal = {
              chhattisgarh_one_total:Number(chhattisgarhOneTotal).toFixed(7),
              chhattisgarh_two_total:Number(chhattisgarhTwoTotal).toFixed(7),
              chhattisgarh_three_total:Number(chhattisgarhThreeTotal).toFixed(7),
              goa_one_total:Number(goaOneTotal).toFixed(7),
              goa_two_total:Number(goaTwoTotal).toFixed(7),
              goa_three_total:Number(goaThreeTotal).toFixed(7),
              bihar_one_total:Number(biharOneTotal).toFixed(7),
              bihar_two_total:Number(biharTwoTotal).toFixed(7)
          };
          var finalJson = {dateArr:dateArr,jsonTotal:jsonTotal};
          return returnSuccess('Getting Monthly Report of MP SLDC by Admin',finalJson);
        }
        else if (ddlSLDCState == 'Rajasthan') {
          var monthlyArr = [];
          var TotalDataTPDDL = 0;
          var TotalDataASSAM = 0;
          var TotalDataHARYANA = 0;
          var TotalDataODISH = 0;
          var TotalDataHIMACHAL = 0;
          var TotalDataBRPL = 0;
          var TotalDataBYPL = 0;
          var TotalDataMAHARASHTRA = 0;
          var TotalDataJHARKHAND = 0;
          var TotalDataPANJAB = 0;
          var TotalDailyTotal = 0;
          // variable use to store lossess data
          var TotalLossDataTPDDL = 0;
          var TotalLossDataASSAM = 0;
          var TotalLossDataHARYANA = 0;
          var TotalLossDataODISH = 0;
          var TotalLossDataHIMACHAL = 0;
          var TotalLossDataBRPL = 0;
          var TotalLossDataBYPL = 0;
          var TotalLossDataMAHARASHTRA = 0;
          var TotalLossDataJHARKHAND = 0;
          var TotalLossDataPANJAB = 0;
          var TotalLossDailyTotal = 0;

          var date = new Date(year, Number(month) - 1, 1);
          while (date.getMonth() == Number(month) - 1) {
              var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
              var newDate = update.split("-");
              var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
              var dateVar = moment(myObject).format('DD-MM-YYYY');
              var sldcdataVar = SLDCReports.find({
                  schedule_date: dateVar,
                  sldc_state: ddlSLDCState
              },{sort:{$natural:-1}, limit:1}).fetch();
              // variable use to store data
              var dataTPDDL = 0;
              var dataASSAM = 0;
              var dataHARYANA = 0;
              var dataODISH = 0;
              var dataHIMACHAL = 0;
              var dataBRPL = 0;
              var dataBYPL = 0;
              var dataMAHARASHTRA = 0;
              var dataJHARKHAND = 0;
              var dataPANJAB = 0;
              var dailyTotal = 0;
              // variable use to store lossess data
              var lossDataTPDDL = 0;
              var lossDataASSAM = 0;
              var lossDataHARYANA = 0;
              var lossDataODISH = 0;
              var lossDataHIMACHAL = 0;
              var lossDataBRPL = 0;
              var lossDataBYPL = 0;
              var lossDataMAHARASHTRA = 0;
              var lossDataJHARKHAND = 0;
              var lossDataPANJAB = 0;
              var lossDailyTotal = 0;

              if(sldcdataVar.length > 0){
                var panjabVar = sldcdataVar[0].data[0].punjabTotalSet[96];
                var panjabWithLossVar = sldcdataVar[0].data[0].punjabTotalSetLoss[96];
                var haryanaVar = sldcdataVar[0].data[0].haryanaTotalSet[96];
                var haryanaWithLossVar = sldcdataVar[0].data[0].haryanaTotalSetLoss[96];
                var restAllDataVar = sldcdataVar[0].data[0].resultNormal[96];
                var restAllDataWithLossVar = sldcdataVar[0].data[0].resultNormalLoss[96];
                var totalVar = sldcdataVar[0].data[0].onlyTotal[96];
                var totalWithLossVar = sldcdataVar[0].data[0].onlyTotalLoss[96];
                // without loss data
                dataTPDDL = restAllDataVar[0];
                dataASSAM = restAllDataVar[1];
                dataHARYANA = haryanaVar;
                dataODISH = restAllDataVar[2];
                dataHIMACHAL = restAllDataVar[3];
                dataBRPL = restAllDataVar[4];
                dataBYPL = restAllDataVar[5];
                dataMAHARASHTRA = restAllDataVar[6];
                dataJHARKHAND = restAllDataVar[7];
                dataPANJAB = panjabVar;
                dailyTotal = totalVar;
                // with loss data
                lossDataTPDDL = restAllDataWithLossVar[0];
                lossDataASSAM = restAllDataWithLossVar[1];
                lossDataHARYANA = haryanaVar;
                lossDataODISH = restAllDataWithLossVar[2];
                lossDataHIMACHAL = restAllDataWithLossVar[3];
                lossDataBRPL = restAllDataWithLossVar[4];
                lossDataBYPL = restAllDataWithLossVar[5];
                lossDataMAHARASHTRA = restAllDataWithLossVar[6];
                lossDataJHARKHAND = restAllDataWithLossVar[7];
                lossDataPANJAB = panjabWithLossVar;
                lossDailyTotal = totalWithLossVar;
              }else{
                // without loss data
                dataTPDDL = '0.0000000';
                dataASSAM = '0.0000000';
                dataHARYANA = '0.0000000';
                dataODISH = '0.0000000';
                dataHIMACHAL = '0.0000000';
                dataBRPL = '0.0000000';
                dataBYPL = '0.0000000';
                dataMAHARASHTRA = '0.0000000';
                dataJHARKHAND = '0.0000000';
                dataPANJAB = '0.0000000';
                dailyTotal = '0.0000000';
                // with loss data
                lossDataTPDDL = '0.0000000';
                lossDataASSAM = '0.0000000';
                lossDataHARYANA = '0.0000000';
                lossDataODISH = '0.0000000';
                lossDataHIMACHAL = '0.0000000';
                lossDataBRPL = '0.0000000';
                lossDataBYPL = '0.0000000';
                lossDataMAHARASHTRA = '0.0000000';
                lossDataJHARKHAND = '0.0000000';
                lossDataPANJAB = '0.0000000';
                lossDailyTotal = '0.0000000';
              };
              // without loss json
              var sldcJson = {
                tpddl:dataTPDDL,
                assam:dataASSAM,
                haryana:dataHARYANA,
                odisha:dataODISH,
                himachal:dataHIMACHAL,
                brpl:dataBRPL,
                bypl:dataBYPL,
                maharashtra:dataMAHARASHTRA,
                jharjhand:dataJHARKHAND,
                panjab:dataPANJAB,
                daily_total:dailyTotal,
              };
              // lossess data json
              var sldcJsonWithLoss = {
                tpddl_loss:lossDataTPDDL,
                assam_loss:lossDataASSAM,
                haryana_loss:lossDataHARYANA,
                odisha_loss:lossDataODISH,
                himachal_loss:lossDataHIMACHAL,
                brpl_loss:lossDataBRPL,
                bypl_loss:lossDataBYPL,
                maharashtra_loss:lossDataMAHARASHTRA,
                jharjhand_loss:lossDataJHARKHAND,
                panjab_loss:lossDataPANJAB,
                dailyLoss_total:lossDailyTotal,
              };
              var returnJson = {date:dateVar,withoutLoss:sldcJson, withLoss:sldcJsonWithLoss};
              monthlyArr.push(returnJson);
              // caclculating monthly total without loss
              TotalDataTPDDL += Number(dataTPDDL);
              TotalDataASSAM += Number(dataASSAM);
              TotalDataHARYANA += Number(dataHARYANA);
              TotalDataODISH += Number(dataODISH);
              TotalDataHIMACHAL += Number(dataHIMACHAL);
              TotalDataBRPL += Number(dataBRPL);
              TotalDataBYPL += Number(dataBYPL);
              TotalDataMAHARASHTRA += Number(dataMAHARASHTRA);
              TotalDataJHARKHAND += Number(dataJHARKHAND);
              TotalDataPANJAB += Number(dataPANJAB);
              TotalDailyTotal += Number(dailyTotal);
              // caclculating monthly total with loss
              TotalLossDataTPDDL += Number(lossDataTPDDL);
              TotalLossDataASSAM += Number(lossDataASSAM);
              TotalLossDataHARYANA += Number(lossDataHARYANA);
              TotalLossDataODISH += Number(lossDataODISH);
              TotalLossDataHIMACHAL += Number(lossDataHIMACHAL);
              TotalLossDataBRPL += Number(lossDataBRPL);
              TotalLossDataBYPL += Number(lossDataBYPL);
              TotalLossDataMAHARASHTRA += Number(lossDataMAHARASHTRA);
              TotalLossDataJHARKHAND += Number(lossDataJHARKHAND);
              TotalLossDataPANJAB += Number(lossDataPANJAB);
              TotalLossDailyTotal += Number(lossDailyTotal);
              date.setDate(date.getDate() + 1);
          }

          var sldcTotalJson = {
            tpddlFinalTotal:Number(TotalDataTPDDL).toFixed(7),
            assamFinalTotal:Number(TotalDataASSAM).toFixed(7),
            haryanaFinalTotal:Number(TotalDataHARYANA).toFixed(7),
            odishaFinalTotal:Number(TotalDataODISH).toFixed(7),
            himachalFinalTotal:Number(TotalDataHIMACHAL).toFixed(7),
            brplFinalTotal:Number(TotalDataBRPL).toFixed(7),
            byplFinalTotal:Number(TotalDataBYPL).toFixed(7),
            maharashtraFinalTotal:Number(TotalDataMAHARASHTRA).toFixed(7),
            jharkhandFinalTotal:Number(TotalDataJHARKHAND).toFixed(7),
            panjabFinalTotal:Number(TotalDataPANJAB).toFixed(7),
            fianlTotal:Number(TotalDailyTotal).toFixed(7),
          };
          // lossess data json
          var sldcTotalJsonWithLoss = {
            tpddlFinalLossTotal:Number(TotalLossDataTPDDL).toFixed(7),
            assamFinalLossTotal:Number(TotalLossDataASSAM).toFixed(7),
            haryanaFinalLossTotal:Number(TotalLossDataHARYANA).toFixed(7),
            odishaFinalLossTotal:Number(TotalLossDataODISH).toFixed(7),
            himachalFinalLossTotal:Number(TotalLossDataHIMACHAL).toFixed(7),
            brplFinalLossTotal:Number(TotalLossDataBRPL).toFixed(7),
            byplFinalLossTotal:Number(TotalLossDataBYPL).toFixed(7),
            maharashtraFinalLossTotal:Number(TotalLossDataMAHARASHTRA).toFixed(7),
            jharkhandFinalLossTotal:Number(TotalLossDataJHARKHAND).toFixed(7),
            panjabFinalLossTotal:Number(TotalLossDataPANJAB).toFixed(7),
            lossFianlTotal:Number(TotalLossDailyTotal).toFixed(7),
          };
          var finalTotalJson = {sldcTotalJson:sldcTotalJson,sldcTotalJsonWithLoss:sldcTotalJsonWithLoss};
          var sldcdataVarForNameOnly = SLDCReports.find({schedule_date:'24-01-2017',sldc_state:'Rajasthan'}).fetch();
          var finalJson = {monthlyArr:monthlyArr,finalTotalJson:finalTotalJson,nameJson:sldcdataVarForNameOnly[0].data[0]};
          return returnSuccess('Getting Monthly Report of Rajasthan SLDC by Admin',finalJson);
        }
    },
    'getYearlySLDCReport': function(reportType,monthlyORyearlyVar,year,sldcStateVar) {
      if(sldcStateVar == 'Rajasthan'){
        var monthlyArr = [];
        var MT_tpddl = 0;
        var MT_assam = 0;
        var MT_haryana = 0;
        var MT_odisha = 0;
        var MT_himachal = 0;
        var MT_brpl = 0;
        var MT_bypl = 0;
        var MT_maharashtra = 0;
        var MT_jharjhand = 0;
        var MT_panjab = 0;
        var MT_dailyLoss = 0;

        var MTL_tpddl = 0;
        var MTL_assam = 0;
        var MTL_haryana = 0;
        var MTL_odisha = 0;
        var MTL_himachal = 0;
        var MTL_brpl = 0;
        var MTL_bypl = 0;
        var MTL_maharashtra = 0;
        var MTL_jharjhand = 0;
        var MTL_panjab = 0;
        var MTL_dailyLoss = 0;
        for (var i = 1; i <= 12; i++) {
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var fromDateMonth = getArray(dateArr, Number(i));
            var period = fromDateMonth + "' " + year;
            var TotalDataTPDDL = 0;
            var TotalDataASSAM = 0;
            var TotalDataHARYANA = 0;
            var TotalDataODISH = 0;
            var TotalDataHIMACHAL = 0;
            var TotalDataBRPL = 0;
            var TotalDataBYPL = 0;
            var TotalDataMAHARASHTRA = 0;
            var TotalDataJHARKHAND = 0;
            var TotalDataPANJAB = 0;
            var TotalDailyTotal = 0;
            // variable use to store lossess data
            var TotalLossDataTPDDL = 0;
            var TotalLossDataASSAM = 0;
            var TotalLossDataHARYANA = 0;
            var TotalLossDataODISH = 0;
            var TotalLossDataHIMACHAL = 0;
            var TotalLossDataBRPL = 0;
            var TotalLossDataBYPL = 0;
            var TotalLossDataMAHARASHTRA = 0;
            var TotalLossDataJHARKHAND = 0;
            var TotalLossDataPANJAB = 0;
            var TotalLossDailyTotal = 0;

            var date = new Date(year, Number(i) - 1, 1);
            while (date.getMonth() == Number(i) - 1) {
                var update = date.getDate() + "-" + Number(i) + "-" + Number(year);
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                var dateVar = moment(myObject).format('DD-MM-YYYY');
                var sldcdataVar = SLDCReports.find({
                    schedule_date: dateVar,
                    sldc_state: sldcStateVar
                },{sort:{$natural:-1}, limit:1}).fetch();

                // variable use to store data
                var dataTPDDL = 0;
                var dataASSAM = 0;
                var dataHARYANA = 0;
                var dataODISH = 0;
                var dataHIMACHAL = 0;
                var dataBRPL = 0;
                var dataBYPL = 0;
                var dataMAHARASHTRA = 0;
                var dataJHARKHAND = 0;
                var dataPANJAB = 0;
                var dailyTotal = 0;
                // variable use to store lossess data
                var lossDataTPDDL = 0;
                var lossDataASSAM = 0;
                var lossDataHARYANA = 0;
                var lossDataODISH = 0;
                var lossDataHIMACHAL = 0;
                var lossDataBRPL = 0;
                var lossDataBYPL = 0;
                var lossDataMAHARASHTRA = 0;
                var lossDataJHARKHAND = 0;
                var lossDataPANJAB = 0;
                var lossDailyTotal = 0;

                if(sldcdataVar.length > 0){
                  var panjabVar = sldcdataVar[0].data[0].punjabTotalSet[96];
                  var panjabWithLossVar = sldcdataVar[0].data[0].punjabTotalSetLoss[96];
                  var haryanaVar = sldcdataVar[0].data[0].haryanaTotalSet[96];
                  var haryanaWithLossVar = sldcdataVar[0].data[0].haryanaTotalSetLoss[96];
                  var restAllDataVar = sldcdataVar[0].data[0].resultNormal[96];
                  var restAllDataWithLossVar = sldcdataVar[0].data[0].resultNormalLoss[96];
                  var totalVar = sldcdataVar[0].data[0].onlyTotal[96];
                  var totalWithLossVar = sldcdataVar[0].data[0].onlyTotalLoss[96];
                  // without loss data
                  dataTPDDL = restAllDataVar[0];
                  dataASSAM = restAllDataVar[1];
                  dataHARYANA = haryanaVar;
                  dataODISH = restAllDataVar[2];
                  dataHIMACHAL = restAllDataVar[3];
                  dataBRPL = restAllDataVar[4];
                  dataBYPL = restAllDataVar[5];
                  dataMAHARASHTRA = restAllDataVar[6];
                  dataJHARKHAND = restAllDataVar[7];
                  dataPANJAB = panjabVar;
                  dailyTotal = totalVar;
                  // with loss data
                  lossDataTPDDL = restAllDataWithLossVar[0];
                  lossDataASSAM = restAllDataWithLossVar[1];
                  lossDataHARYANA = haryanaVar;
                  lossDataODISH = restAllDataWithLossVar[2];
                  lossDataHIMACHAL = restAllDataWithLossVar[3];
                  lossDataBRPL = restAllDataWithLossVar[4];
                  lossDataBYPL = restAllDataWithLossVar[5];
                  lossDataMAHARASHTRA = restAllDataWithLossVar[6];
                  lossDataJHARKHAND = restAllDataWithLossVar[7];
                  lossDataPANJAB = panjabWithLossVar;
                  lossDailyTotal = totalWithLossVar;
                }else{
                  // without loss data
                  dataTPDDL = '0.0000000';
                  dataASSAM = '0.0000000';
                  dataHARYANA = '0.0000000';
                  dataODISH = '0.0000000';
                  dataHIMACHAL = '0.0000000';
                  dataBRPL = '0.0000000';
                  dataBYPL = '0.0000000';
                  dataMAHARASHTRA = '0.0000000';
                  dataJHARKHAND = '0.0000000';
                  dataPANJAB = '0.0000000';
                  dailyTotal = '0.0000000';
                  // with loss data
                  lossDataTPDDL = '0.0000000';
                  lossDataASSAM = '0.0000000';
                  lossDataHARYANA = '0.0000000';
                  lossDataODISH = '0.0000000';
                  lossDataHIMACHAL = '0.0000000';
                  lossDataBRPL = '0.0000000';
                  lossDataBYPL = '0.0000000';
                  lossDataMAHARASHTRA = '0.0000000';
                  lossDataJHARKHAND = '0.0000000';
                  lossDataPANJAB = '0.0000000';
                  lossDailyTotal = '0.0000000';
                };

                // caclculating monthly total without loss
                TotalDataTPDDL += Number(dataTPDDL);
                TotalDataASSAM += Number(dataASSAM);
                TotalDataHARYANA += Number(dataHARYANA);
                TotalDataODISH += Number(dataODISH);
                TotalDataHIMACHAL += Number(dataHIMACHAL);
                TotalDataBRPL += Number(dataBRPL);
                TotalDataBYPL += Number(dataBYPL);
                TotalDataMAHARASHTRA += Number(dataMAHARASHTRA);
                TotalDataJHARKHAND += Number(dataJHARKHAND);
                TotalDataPANJAB += Number(dataPANJAB);
                TotalDailyTotal += Number(dailyTotal);
                // caclculating monthly total with loss
                TotalLossDataTPDDL += Number(lossDataTPDDL);
                TotalLossDataASSAM += Number(lossDataASSAM);
                TotalLossDataHARYANA += Number(lossDataHARYANA);
                TotalLossDataODISH += Number(lossDataODISH);
                TotalLossDataHIMACHAL += Number(lossDataHIMACHAL);
                TotalLossDataBRPL += Number(lossDataBRPL);
                TotalLossDataBYPL += Number(lossDataBYPL);
                TotalLossDataMAHARASHTRA += Number(lossDataMAHARASHTRA);
                TotalLossDataJHARKHAND += Number(lossDataJHARKHAND);
                TotalLossDataPANJAB += Number(lossDataPANJAB);
                TotalLossDailyTotal += Number(lossDailyTotal);
                date.setDate(date.getDate() + 1);
            }
            // without loss json
            var sldcJson = {
              tpddl:Number(TotalDataTPDDL).toFixed(7),
              assam:Number(TotalDataASSAM).toFixed(7),
              haryana:Number(TotalDataHARYANA).toFixed(7),
              odisha:Number(TotalDataODISH).toFixed(7),
              himachal:Number(TotalDataHIMACHAL).toFixed(7),
              brpl:Number(TotalDataBRPL).toFixed(7),
              bypl:Number(TotalDataBYPL).toFixed(7),
              maharashtra:Number(TotalDataMAHARASHTRA).toFixed(7),
              jharjhand:Number(TotalDataJHARKHAND).toFixed(7),
              panjab:Number(TotalDataPANJAB).toFixed(7),
              daily_total:Number(TotalDailyTotal).toFixed(7),
            };
            // lossess data json
            var sldcWithLoss = {
              tpddl_loss:Number(TotalLossDataTPDDL).toFixed(7),
              assam_loss:Number(TotalLossDataASSAM).toFixed(7),
              haryana_loss:Number(TotalLossDataHARYANA).toFixed(7),
              odisha_loss:Number(TotalLossDataODISH).toFixed(7),
              himachal_loss:Number(TotalLossDataHIMACHAL).toFixed(7),
              brpl_loss:Number(TotalLossDataBRPL).toFixed(7),
              bypl_loss:Number(TotalLossDataBYPL).toFixed(7),
              maharashtra_loss:Number(TotalLossDataMAHARASHTRA).toFixed(7),
              jharjhand_loss:Number(TotalLossDataJHARKHAND).toFixed(7),
              panjab_loss:Number(TotalLossDataPANJAB).toFixed(7),
              dailyLoss_total:Number(TotalLossDailyTotal).toFixed(7),
            };
            var returnJson = {period:period,withoutLoss:sldcJson, withLoss:sldcWithLoss};
            monthlyArr.push(returnJson);

            MT_tpddl += Number(sldcJson.tpddl);
            MT_assam += Number(sldcJson.assam);
            MT_haryana += Number(sldcJson.haryana);
            MT_odisha += Number(sldcJson.odisha);
            MT_himachal += Number(sldcJson.himachal);
            MT_brpl += Number(sldcJson.brpl);
            MT_bypl += Number(sldcJson.bypl);
            MT_maharashtra += Number(sldcJson.maharashtra);
            MT_jharjhand += Number(sldcJson.jharjhand);
            MT_panjab += Number(sldcJson.panjab);
            MT_dailyLoss += Number(sldcJson.daily_total);

            MTL_tpddl += Number(sldcWithLoss.tpddl_loss);
            MTL_assam += Number(sldcWithLoss.assam_loss);
            MTL_haryana += Number(sldcWithLoss.haryana_loss);
            MTL_odisha += Number(sldcWithLoss.odisha_loss);
            MTL_himachal += Number(sldcWithLoss.himachal_loss);
            MTL_brpl += Number(sldcWithLoss.brpl_loss);
            MTL_bypl += Number(sldcWithLoss.bypl_loss);
            MTL_maharashtra += Number(sldcWithLoss.maharashtra_loss);
            MTL_jharjhand += Number(sldcWithLoss.jharjhand_loss);
            MTL_panjab += Number(sldcWithLoss.panjab_loss);
            MTL_dailyLoss += Number(sldcWithLoss.dailyLoss_total);

        }
        var sldcTotalJson = {
          tpddlFinalTotal:Number(MT_tpddl).toFixed(7),
          assamFinalTotal:Number(MT_assam).toFixed(7),
          haryanaFinalTotal:Number(MT_haryana).toFixed(7),
          odishaFinalTotal:Number(MT_odisha).toFixed(7),
          himachalFinalTotal:Number(MT_himachal).toFixed(7),
          brplFinalTotal:Number(MT_brpl).toFixed(7),
          byplFinalTotal:Number(MT_bypl).toFixed(7),
          maharashtraFinalTotal:Number(MT_maharashtra).toFixed(7),
          jharkhandFinalTotal:Number(MT_jharjhand).toFixed(7),
          panjabFinalTotal:Number(MT_panjab).toFixed(7),
          fianlTotal:Number(MT_dailyLoss).toFixed(7),
        };
        // lossess data json
        var sldcTotalJsonWithLoss = {
          tpddlFinalLossTotal:Number(MTL_tpddl).toFixed(7),
          assamFinalLossTotal:Number(MTL_assam).toFixed(7),
          haryanaFinalLossTotal:Number(MTL_haryana).toFixed(7),
          odishaFinalLossTotal:Number(MTL_odisha).toFixed(7),
          himachalFinalLossTotal:Number(MTL_himachal).toFixed(7),
          brplFinalLossTotal:Number(MTL_brpl).toFixed(7),
          byplFinalLossTotal:Number(MTL_bypl).toFixed(7),
          maharashtraFinalLossTotal:Number(MTL_maharashtra).toFixed(7),
          jharkhandFinalLossTotal:Number(MTL_jharjhand).toFixed(7),
          panjabFinalLossTotal:Number(MTL_panjab).toFixed(7),
          lossFianlTotal:Number(MTL_dailyLoss).toFixed(7),
        };
        var finalTotalJson = {sldcTotalJson:sldcTotalJson,sldcTotalJsonWithLoss:sldcTotalJsonWithLoss};
        var sldcdataVarForNameOnly = SLDCReports.find({schedule_date:'24-01-2017',sldc_state:'Rajasthan'}).fetch();
        var finalJson = {monthlyArr:monthlyArr,finalTotalJson:finalTotalJson,nameJson:sldcdataVarForNameOnly[0].data[0]};
        return returnSuccess('Getting Yearly Report of Rajasthan SLDC by Admin',finalJson);
      }
      else if(sldcStateVar == 'MP'){
        var monthlyArr = [];
        var chhattisgarhOneMonthlyTotal = 0;
        var chhattisgarhTwoMonthlyTotal = 0;
        var chhattisgarhThreeMonthlyTotal = 0;
        var goaOneMonthlyTotal = 0;
        var goaTwoMonthlyTotal = 0;
        var goaThreeMonthlyTotal = 0;
        var biharOneMonthlyTotal = 0;
        var biharTwoMonthlyTotal = 0;
        for (var i = 1; i <= 12; i++) {
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var fromDateMonth = getArray(dateArr, Number(i));
            var period = fromDateMonth + "' " + year;
            var chhattisgarhOneTotal = 0;
            var chhattisgarhTwoTotal = 0;
            var chhattisgarhThreeTotal = 0;
            var goaOneTotal = 0;
            var goaTwoTotal = 0;
            var goaThreeTotal = 0;
            var biharOneTotal = 0;
            var biharTwoTotal = 0;
            var date = new Date(year, Number(i) - 1, 1);
            while (date.getMonth() == Number(i) - 1) {
                var update = date.getDate() + "-" + Number(i) + "-" + Number(year);
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                var dateVar = moment(myObject).format('DD-MM-YYYY');
                var sldcdataVar = SLDCReports.find({
                    schedule_date: dateVar,
                    sldc_state: sldcStateVar
                },{sort:{$natural:-1}, limit:1}).fetch();
                var chhattisgarhArrayData = [];
                var goaArrayData = [];
                var biharArrayData = [];
                if (sldcdataVar.length > 0) {
                    var dataArrLength = Number(sldcdataVar[0].revision_no);
                    chhattisgarhArrayData = sldcdataVar[0].data[dataArrLength].ChhattisgarhArrayResult[96];
                    goaArrayData = sldcdataVar[0].data[dataArrLength].GoaArrayResult[96];
                    biharArrayData = sldcdataVar[0].data[dataArrLength].BiharArrayResult[96];
                } else {
                    chhattisgarhArrayData = ['0.0000000', '0.0000000', '0.0000000'];
                    goaArrayData = ['0.0000000', '0.0000000', '0.0000000'];
                    biharArrayData = ['0.0000000'];
                }

                var chhattisgarhVar1 = Number(chhattisgarhArrayData[0]).toFixed(7);
                var chhattisgarhVar2 = Number(chhattisgarhArrayData[1]).toFixed(7);
                var chhattisgarhVar3 = Number(chhattisgarhArrayData[2]).toFixed(7);
                var goaVar1 = Number(goaArrayData[2]).toFixed(7);
                var goaVar2 = Number(goaArrayData[0]).toFixed(7);
                var goaVar3 = Number(goaArrayData[1]).toFixed(7);
                var biharVar1 = Number(biharArrayData[0]).toFixed(7);
                var biharVar2 = Number(biharArrayData[0]).toFixed(7);

                chhattisgarhOneTotal += Number(chhattisgarhVar1);
                chhattisgarhTwoTotal += Number(chhattisgarhVar2);
                chhattisgarhThreeTotal += Number(chhattisgarhVar3);
                goaOneTotal += Number(goaVar1);
                goaTwoTotal += Number(goaVar2);
                goaThreeTotal += Number(goaVar3);
                biharOneTotal += Number(biharVar1);
                biharTwoTotal += Number(biharVar2);
                date.setDate(date.getDate() + 1);
            }

            var dataJson = {
              period:period,
              chhattisgarh_one:Number(chhattisgarhOneTotal).toFixed(7),
              chhattisgarh_two:Number(chhattisgarhTwoTotal).toFixed(7),
              chhattisgarh_three:Number(chhattisgarhThreeTotal).toFixed(7),
              goa_one:Number(goaOneTotal).toFixed(7),
              goa_two:Number(goaTwoTotal).toFixed(7),
              goa_three:Number(goaVar3).toFixed(7),
              bihar_one:Number(biharOneTotal).toFixed(7),
              bihar_two:Number(biharTwoTotal).toFixed(7)
            };
            monthlyArr.push(dataJson);

            chhattisgarhOneMonthlyTotal += Number(Number(chhattisgarhOneTotal).toFixed(7));
            chhattisgarhTwoMonthlyTotal += Number(Number(chhattisgarhTwoTotal).toFixed(7));
            chhattisgarhThreeMonthlyTotal += Number(Number(chhattisgarhThreeTotal).toFixed(7));
            goaOneMonthlyTotal += Number(Number(goaOneTotal).toFixed(7));
            goaTwoMonthlyTotal += Number(Number(goaTwoTotal).toFixed(7));
            goaThreeMonthlyTotal += Number(Number(goaVar3).toFixed(7));
            biharOneMonthlyTotal += Number(Number(biharOneTotal).toFixed(7));
            biharTwoMonthlyTotal += Number(Number(biharTwoTotal).toFixed(7));
        }
        var jsonTotal = {
            chhattisgarhOneYearlyTotal:Number(chhattisgarhOneMonthlyTotal).toFixed(7),
            chhattisgarhTwoYearlyTotal:Number(chhattisgarhTwoMonthlyTotal).toFixed(7),
            chhattisgarhThreeYearlyTotal:Number(chhattisgarhThreeMonthlyTotal).toFixed(7),
            goaOneYearlyTotal:Number(goaOneMonthlyTotal).toFixed(7),
            goaTwoYearlyTotal:Number(goaTwoMonthlyTotal).toFixed(7),
            goaThreeYearlyTotal:Number(goaThreeMonthlyTotal).toFixed(7),
            biharOneYearlyTotal:Number(biharOneMonthlyTotal).toFixed(7),
            biharTwoYearlyTotal:Number(biharTwoMonthlyTotal).toFixed(7)
        };
        var finalJson = {monthlyArr:monthlyArr,jsonTotal:jsonTotal};
        return returnSuccess('Getting Yearly Report of MP SLDC by Admin',finalJson);
      }
      else if(sldcStateVar == 'Gujarat'){
        var monthlyTotalArr = [];
        var monthlyTotalArrWithLoss = [];
        var periodArr = [];
        for (var i = 1; i <= 12; i++) {
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var fromDateMonth = getArray(dateArr, Number(i));
            var period = fromDateMonth + "' " + year;
            periodArr.push(period);
            var date = new Date(year, Number(i) - 1, 1);
            var total = 0;
            var totalWithLoss = 0;
            var monthlyArr = [];
            var monthlyArrWithLoss = [];
            while (date.getMonth() == Number(i) - 1) {
                var update = date.getDate() + "-" + Number(i) + "-" + Number(year);
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                var dateVar = moment(myObject).format('DD-MM-YYYY');
                var sldcdataVar = SLDCReports.find({
                    schedule_date: dateVar,
                    sldc_state: sldcStateVar
                }).fetch();
                var latestRevisedDailyTotal = [];
                var latestRevisedDailyTotalWithLoss = [];
                if (sldcdataVar.length > 0) {
                    var dataArrLength = Number(sldcdataVar[0].data.length) - 1;
                    latestRevisedDailyTotal = sldcdataVar[0].data[dataArrLength].result[96];
                    latestRevisedDailyTotalWithLoss = sldcdataVar[0].data[dataArrLength].lossResult[96];
                } else {
                    latestRevisedDailyTotal = ['0.0000000', '0.0000000', '0.0000000', '0.0000000', '0.0000000'];
                    latestRevisedDailyTotalWithLoss = ['0.0000000', '0.0000000', '0.0000000', '0.0000000', '0.0000000'];
                }
                monthlyArr.push(latestRevisedDailyTotal);
                monthlyArrWithLoss.push(latestRevisedDailyTotalWithLoss);
                date.setDate(date.getDate() + 1);
            }
            var tempArray = [];
            for (var z = 0; z < monthlyArr[0].length; z++) {
                var sum = 0;
                for (var k = 0; k < monthlyArr.length; k++) {
                    sum += Number(monthlyArr[k][z]);
                }
                tempArray.push(sum.toFixed(7));
            }
            monthlyTotalArr.push(tempArray);
            var tempArrayLoss = [];
            for (var z = 0; z < monthlyArrWithLoss[0].length; z++) {
                var lossSum = 0;
                for (var k = 0; k < monthlyArrWithLoss.length; k++) {
                    lossSum += Number(monthlyArrWithLoss[k][z]);
                }
                tempArrayLoss.push(lossSum.toFixed(7));
            }
            monthlyTotalArrWithLoss.push(tempArrayLoss);
        }
        //monthly Total array
        var totalArr = [];
        for (var z = 0; z < monthlyTotalArr[0].length; z++) {
            var sum = 0;
            for (var k = 0; k < monthlyTotalArr.length; k++) {
                sum += Number(monthlyTotalArr[k][z]);
            }
            totalArr.push(Number(sum).toFixed(7));
        }
        var totalArrWithLoss = [];
        for (var z = 0; z < monthlyTotalArrWithLoss[0].length; z++) {
            var lossSum = 0;
            for (var k = 0; k < monthlyTotalArrWithLoss.length; k++) {
                lossSum += Number(monthlyTotalArrWithLoss[k][z]);
            }
            totalArrWithLoss.push(Number(lossSum).toFixed(7));
        }
        // useing hard code date for getting header name of gujarat yearly report
        var sldcdataVar = SLDCReports.find({schedule_date:'01-01-2017',sldc_state: sldcStateVar}).fetch();
        var nameArr = sldcdataVar[0].data[0].spdNamesListTotal;
        var nameArrWithLoss = sldcdataVar[0].data[0].spdNamesListLossTotal;
        var json = {
            dateVar: periodArr,
            headBefore: nameArr,
            headAfter: nameArrWithLoss,
            trueResult: monthlyTotalArr,
            errorResult: monthlyTotalArrWithLoss,
            tempArray: totalArr,
            tempArrayLoss: totalArrWithLoss
        };
        return returnSuccess('Getting Yearly Report of Gujarat SLDC by Admin',json);
      }
    }
});

function getArray(ary, month) {
    return ary[month - 1];
};

Meteor.methods({
    getSldcDataMP(date) {
        var spdArray = [];
        var list = Meteor.users.find({
            "profile.user_type": 'spd'
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

        // console.log(ChhattisgarhArray);
        // console.log(BiharArray);
        ///////////chattigarh data here///////////////////
        var ChhattisgarhAvaibilityArray = [];
        var ChhattisgarhArrayResult = [];
        for (var j = 0; j < 96; j++) {
            var showAavailability = [];
            var show = [];
            var availability = 0;
            var bid = 0;
            var revTimeCha = [];
            var revTestCha = [];
            var revisionTypeCha = [];
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
                    })
                    revTimeCha.push({
                        time: schedule[0].actual_revision_time,
                        timestamp: schedule[0].current_date_timestamp
                    });
                    revisionTypeCha.push(schedule[0].revision_type);
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
            var revisionTypeGoa = [];
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
                    })
                    revTimeGoa.push({
                        time: schedule[0].actual_revision_time,
                        timestamp: schedule[0].current_date_timestamp
                    });
                    revisionTypeGoa.push(schedule[0].revision_type);
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
            var revisionTypeBihar = [];
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
                    })
                    revTimeBihar.push({
                        time: schedule[0].actual_revision_time,
                        timestamp: schedule[0].current_date_timestamp
                    });
                    revisionTypeBihar.push(schedule[0].revision_type);
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

        if (mergeTimeArray.length>0) {
          if (mergeTimeArray[0].time) {
            var maximumTime = mergeTimeArray[0].time;
          }else {
            var maximumTime = '00:01';
          }
        }else {
          var maximumTime = '00:00';
        }

        var mergeRevArray = revTestCha.concat(revTestGoa[0], revTestBihar);
        var sumAll = 0;
        for (var i = mergeRevArray.length; i--;) {
            sumAll += Number(mergeRevArray[i]);
        }
        var sumOfRevision = sumAll;

        var mergeRevisionType = revisionTypeCha.concat(revisionTypeGoa, revisionTypeBihar);
        var count = 0;
        for (var i = 0; i < mergeRevisionType.length; i++) {
            if (mergeRevisionType[i] == 'Real Time') {
                count = 1;
            }
        }
        if (count == 1) {
            console.log('date today');
            var minusOneDay = date;
        } else {
            console.log('no change date');
            if (sumOfRevision >= 1) {
                sumOfRevision = 1;
            } else {
                sumOfRevision = 0;
            }
            var dateThis = date.split('-');
            dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
            dateThis.setDate(dateThis.getDate() - 1);
            moment(dateThis).format('DD-MM-YYYY');
            var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
        }
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
        return returnSuccess('SLDC data for MP :'+date, toReturn);
    },
    getSldcDataGujarat(date) {
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
                          var spdDataVar = Meteor.users.find({_id: item.spdId}).fetch();
                          item.spdName = spdDataVar[0].profile.registration_form.name_of_spd;
                          idsArray.push(item);
                        }
                    }
                }
            })
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

        if (stuData.length > 0) {
            var result = [];
            var lossResult = [];
            for (var j = 0; j < 96; j++) {
                var show = [];
                var showLoss = [];
                var bid = 0;
                var revTest = [];
                var RevisionType = []
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
                        })
                        RevisionType.push(schedule[0].revision_type);
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

            var sumAll = 0;
            for (var i = revTest.length; i--;) {
                sumAll += Number(revTest[i]);
            }
            var sumOfRevision = sumAll;

            var count = 0;
            for (var i = 0; i < RevisionType.length; i++) {
                if (RevisionType[i] == 'Real Time') {
                    count = 1;
                }
            }
            if (count == 1) {
                console.log('date today');
                var minusOneDay = date;
            } else {
                console.log('no change date');
                if (sumOfRevision >= 1) {
                    sumOfRevision = 1;
                } else {
                    sumOfRevision = 0;
                }
                var dateThis = date.split('-');
                dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
                dateThis.setDate(dateThis.getDate() - 1);
                moment(dateThis).format('DD-MM-YYYY');
                var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
            }


            var toReturn = {
                trueResult: result,
                errorResult: lossResult,
                stuLossValue: stuData[0].stuRate + "%",
                scheduleDate: date,
                LTOA_number: showLTOA,
                // LTOA_number:LTOAnumber[0].LTOA_number,
                headBefore: spdNamesHeadResult,
                valueHighestRevision: sumOfRevision,
                spdState: "GUJARAT",
                discomSate: "ODISHA",
                headAfter: spdNamesHeadLoss,
                minusOneDay: minusOneDay
            }
            return returnSuccess("SLDC data for Gujarat: "+date, toReturn);
        } else {
            return returnFaliure("STU Charges not found");
        }
    },

    getSldcDataRajasthan(date) {
        /////////stu Rate of selected date///////////
        var splitDate = date.split('-');
        var stuData = StuCharges.find({
            month: splitDate[1],
            year: splitDate[2],
            state: "Rajasthan"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        if (stuData.length > 0) {
            var rajStateArray = ['Delhi(TPDDL)', 'Assam', 'Haryana', 'Odisha', 'Himachal Pradesh', 'Delhi(BRPL)', 'Delhi(BYPL)', 'Maharashtra', 'Jharkhand', 'Punjab']
            var jsonArray = [];
            for (var i = 0; i < rajStateArray.length; i++) {
                var discomValues = Discom.find({
                    'discom_state': rajStateArray[i]
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
                            // spdName: item.spdName,
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
                for (var i = 0; i < jsonArray.length; i++) {
                    var schedule = ScheduleSubmission.find({
                        clientId: jsonArray[i].spdId,
                        date: date
                    }).fetch();
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

            ////state punjab array///////
            var resultPunjab = [];
            var resultPunjabLoss = [];
            for (var j = 0; j < 96; j++) {
                var show = [];
                var showPunjab = [];
                var bid = 0;
                for (var i = 0; i < statePunjabIds.length; i++) {
                    var schedule = ScheduleSubmission.find({
                        clientId: statePunjabIds[i].spdId,
                        date: date
                    }).fetch();
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
                    var schedule = ScheduleSubmission.find({
                        clientId: stateHaryanaIds[i].spdId,
                        date: date
                    }).fetch();
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
                    var schedule = ScheduleSubmission.find({
                        clientId: stateNormalIds[i].spdId,
                        date: date
                    }).fetch();
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
            return returnSuccess("SLDC data for Rajasthan: "+date, toReturn);
        } else {
            return returnFaliure("STU Charges not found");
        }
    }
});

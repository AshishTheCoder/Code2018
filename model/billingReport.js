Meteor.methods({
    "callDiscomSpdIdsBilling": function(discomName) {
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
        return returnSuccess('retrived all discom states', spdNames);
    },
    "callBillingDiscom": function(list, month, year, discomState, headValue) {
        var myData = monthInWordsShort(month);
        var dynamicTopValue = headValue;
        var returnHeadValue = headValue + ' ' + myData + "'" + year;
        var state = list[0].state;
        var idArray = [];
        list.forEach(function(item) {
            idArray.push(item.id);
        });

        ////////////////////////////////////////////////////////////////////////////
        var date = new Date(year, month - 1, 1);
        var result = [];
        var resultLoss = [];
        while (date.getMonth() == month - 1) {
            var update = date.getDate() + "-" + month + "-" + year;
            var newDate = update.split("-");
            var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            var showLoss = [];
            ////id a loop//////////////
            for (var i = 0; i < idArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: idArray[i], date: moment(myObject).format('DD-MM-YYYY')}).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonDataLoss = item.jsonWithLoss;
                        var lengthLoss = jsonDataLoss.length;
                        var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                        var mwhDataLoss = getScheduleLoss.totalMwh;
                        showLoss.push(mwhDataLoss);
                    });
                } else {
                    showLoss.push("0.00");
                }
            }
            //////id loop over///////////////
            var countLoss = 0;
            for (var i = showLoss.length; i--;) {
                countLoss += Number(showLoss[i]);
            }
            showLoss.push(countLoss.toFixed(7));
            resultLoss.push(showLoss);
            date.setDate(date.getDate() + 1);
        }

        /////////stu Rate if applicable///////////
        var stateSTUvar = StuCharges.find({
            month: month,
            year: year,
            state: state
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        var rate = [];
        if (stateSTUvar.length > 0) {
            rate.push(stateSTUvar[0].stuRate);
        }

        var resultLossLength = resultLoss[0].length;
        var result = []
        for (var i = 0; i < resultLoss.length; i++) {
            var org = (Number(resultLoss[i][resultLossLength - 1]) / (100 - Number(rate))) * 100;
            result.push(org.toFixed(7));
        }

        var mycount = 0;
        for (var i = 0; i < result.length; i++) {
            mycount += Number(result[i]);
        }

        var aryTotal = [];
        aryTotal.push(mycount.toFixed(7));

        var finalMonthLength = resultLoss.length;

        var data1 = result.slice(0, 8);
        var count1 = 0;
        for (var i = data1.length; i--;) {
            count1 += Number(data1[i]);
        }
        data1.push(count1.toFixed(7));

        var data2 = result.slice(8, 15);
        var count2 = 0;
        for (var i = data2.length; i--;) {
            count2 += Number(data2[i]);
        }
        data2.push(count2.toFixed(7));

        var data3 = result.slice(15, 23);
        var count3 = 0;
        for (var i = data3.length; i--;) {
            count3 += Number(data3[i]);
        }
        data3.push(count3.toFixed(7));

        var data4 = result.slice(23, finalMonthLength);
        var count4 = 0;
        for (var i = data4.length; i--;) {
            count4 += Number(data4[i]);
        }
        data4.push(count4.toFixed(7));

        var ary = data1.concat(data2, data3, data4);

        //////manual splice code  1/////
        var tempArrayLoss1 = [];
        var dataLoss1 = resultLoss.slice(0, 8);
        for (var z = 0; z < dataLoss1[0].length; z++) {
            var sumLoss = 0;
            for (var k = 0; k < dataLoss1.length; k++) {
                sumLoss += Number(dataLoss1[k][z]);
            }
            tempArrayLoss1.push(sumLoss.toFixed(7));
        }
        dataLoss1.push(tempArrayLoss1);

        //////manual splice code  2/////
        var tempArrayLoss2 = [];
        var dataLoss2 = resultLoss.slice(8, 15);
        for (var z = 0; z < dataLoss2[0].length; z++) {
            var sumLoss = 0;
            for (var k = 0; k < dataLoss2.length; k++) {
                sumLoss += Number(dataLoss2[k][z]);
            }
            tempArrayLoss2.push(sumLoss.toFixed(7));
        }
        dataLoss2.push(tempArrayLoss2);

        //////manual splice code 3/////
        var tempArrayLoss3 = [];
        var dataLoss3 = resultLoss.slice(15, 23);
        for (var z = 0; z < dataLoss3[0].length; z++) {
            var sumLoss = 0;
            for (var k = 0; k < dataLoss3.length; k++) {
                sumLoss += Number(dataLoss3[k][z]);
            }
            tempArrayLoss3.push(sumLoss.toFixed(7));
        }
        dataLoss3.push(tempArrayLoss3);

        //////manual splice code 4/////
        var tempArrayLoss4 = [];
        var dataLoss4 = resultLoss.slice(23, finalMonthLength);
        for (var z = 0; z < dataLoss4[0].length; z++) {
            var sum = 0;
            var sumLoss = 0;
            for (var k = 0; k < dataLoss4.length; k++) {
                sumLoss += Number(dataLoss4[k][z]);
            }
            tempArrayLoss4.push(sumLoss.toFixed(7));
        }
        dataLoss4.push(tempArrayLoss4);

        var finalArrayLoss = [dataLoss1, dataLoss2, dataLoss3, dataLoss4];

        var mergeArrayLoss = [];
        for (var a = 0; a < finalArrayLoss.length; a++) {
            for (var w = 0; w < finalArrayLoss[a].length; w++) {
                mergeArrayLoss.push(finalArrayLoss[a][w]);
            }
        }

        var tempArrayTotalLoss = [];
        for (var z = 0; z < resultLoss[0].length; z++) {
            var sumLoss = 0;
            for (var k = 0; k < resultLoss.length; k++) {
                sumLoss += Number(resultLoss[k][z]);
            }
            tempArrayTotalLoss.push((Number(sumLoss)).toFixed(7));
        }

        var aryTotalLoss = [];
        var lastTotalLoss = Number(tempArrayTotalLoss.length) - 1;
        aryTotalLoss.push(tempArrayTotalLoss[lastTotalLoss]);

        var last = 0;
        var aryLoss = [];
        if (rate.length > 0) {
            for (var i = 0; i < mergeArrayLoss.length; i++) {
                var getLength = mergeArrayLoss[0].length;
                last = Number(getLength) - 1;
                aryLoss.push(mergeArrayLoss[i][last]);
            }
            ///////for week loop/////
            var datesShow = [];
            var dates = getDaysArray(year, month);
            var dates1 = dates.slice(0, 8);
            dates1.push("WEEKLY");
            var dates2 = dates.slice(8, 15);
            dates2.push("WEEKLY");
            var dates3 = dates.slice(15, 23);
            dates3.push("WEEKLY");
            var dates4 = dates.slice(23, finalMonthLength);
            dates4.push("WEEKLY");
            for (var i = 0; i < dates1.length; i++) {
                datesShow.push(dates1[i]);
            }
            for (var i = 0; i < dates2.length; i++) {
                datesShow.push(dates2[i]);
            }
            for (var i = 0; i < dates3.length; i++) {
                datesShow.push(dates3[i]);
            }
            for (var i = 0; i < dates4.length; i++) {
                datesShow.push(dates4[i]);
            }

            /////attaching rea data///////////
            var ReaData = ReaMonthly.find({'spd_state': state, 'discom_state': discomState, 'month': month, 'year': year}).fetch();

            var reaValue = 'Rea not Available';
            var checkRea = false;
            if (ReaData.length > 0) {
                reaValue = ReaData[0].rea;
                var aryThisLoss = aryTotalLoss[0];
                var manualCheck = (Number(aryThisLoss) - Number(reaValue)).toFixed(7);
                if (manualCheck != '0.0000000') {
                    var checkRea = true;
                }
            }

            var lastDate = numberOfdaysInMonth(month, year);
            var myLastDate = lastDate + '-' + month + '-' + year;

            for (var i = 0; i < idArray.length; i++) {
                var scheduleLast = ScheduleSubmission.find({clientId: idArray[i], date: myLastDate}).fetch();
            }
            var lastLengthCal = Number(aryLoss.length);
            if (scheduleLast.length > 0) {
                if (scheduleLast[0].adjustedREA) {
                    if (scheduleLast[0].adjustedREA.sign == 'subtract') {
                        aryLoss[lastLengthCal - 1] = Number(Number(aryLoss[lastLengthCal - 1]) - Number(scheduleLast[0].adjustedREA.change)).toFixed(7);
                        aryLoss[lastLengthCal - 2] = Number(Number(aryLoss[lastLengthCal - 2]) - Number(scheduleLast[0].adjustedREA.change)).toFixed(7);
                        ary[lastLengthCal - 1] = Number((Number(aryLoss[lastLengthCal - 1]) / (100 - Number(rate))) * 100).toFixed(7);
                        ary[lastLengthCal - 2] = Number((Number(aryLoss[lastLengthCal - 2]) / (100 - Number(rate))) * 100).toFixed(7);

                        var aryThisLoss = aryTotalLoss[0];
                        aryThisLoss = Number(Number(aryThisLoss) - Number(scheduleLast[0].adjustedREA.change)).toFixed(7);

                        var totThis = aryTotal[0];
                        // aryTotal = Number(Number(totThis) - Number(scheduleLast[0].adjustedREA.change)).toFixed(7);
                        aryTotal = Number((Number(aryThisLoss) / (100 - Number(rate))) * 100).toFixed(7);
                    } else {
                        aryLoss[lastLengthCal - 1] = Number(Number(aryLoss[lastLengthCal - 1]) + Number(scheduleLast[0].adjustedREA.change)).toFixed(7);
                        aryLoss[lastLengthCal - 2] = Number(Number(aryLoss[lastLengthCal - 2]) + Number(scheduleLast[0].adjustedREA.change)).toFixed(7);
                        ary[lastLengthCal - 1] = Number((Number(aryLoss[lastLengthCal - 1]) / (100 - Number(rate))) * 100).toFixed(7);
                        ary[lastLengthCal - 2] = Number((Number(aryLoss[lastLengthCal - 2]) / (100 - Number(rate))) * 100).toFixed(7);

                        var aryThisLoss = aryTotalLoss[0];
                        aryThisLoss = Number(Number(aryThisLoss) + Number(scheduleLast[0].adjustedREA.change)).toFixed(7);

                        var totThis = aryTotal[0];
                        aryTotal = Number((Number(aryThisLoss) / (100 - Number(rate))) * 100).toFixed(7);
                        // aryTotal = Number(Number(totThis) + Number(scheduleLast[0].adjustedREA.change)).toFixed(7);
                    }
                    checkRea = false;
                    var dateOfAdjust = moment(scheduleLast[0].adjustedREA.saveDate).format('DD-MM-YYYY');
                    console.log('REA already adjusted');
                }
            } else {
                console.log('REA is not adjusted');
            }

            if (dynamicTopValue == 'NRPC') {
                var dataAt = 'RAJ./REG PER.';
            } else if (dynamicTopValue == 'WRPC') {
                var dataAt = 'REG PER.';
            }

            /////finalizing json at the end////////////
            var toReturn = {
                ary: ary,
                rate: rate + '%',
                aryTotal: aryTotal,
                lossAry: aryLoss,
                // lossTotal: aryTotalLoss,
                lossTotal: aryThisLoss,
                datesCount: datesShow,
                discomState: discomState,
                spdState: state,
                reaValue: reaValue,
                spdList: list,
                isDifference: checkRea,
                dateOfAdjust: dateOfAdjust,
                monthLength: finalMonthLength + 3,
                returnHeadValue: returnHeadValue,
                dynamicTopValue: dynamicTopValue,
                dataAt: dataAt,
                month: month,
                year: year
            };
            var discomData = Discom.find({discom_state:discomState}).fetch();

            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: discomState+' Billing Report Saved',
                template_name: 'billingReportSECIL',
                event_name: 'selectDiscomData',
                timestamp: new Date(),
                action_date:moment().format('DD-MM-YYYY'),
                state:state,
                json: {
                  month: month,
                  year: year,
                  discomState: discomState,
                  discomShortName:discomData[0].discom_short_name,
                  datesCount: datesShow,
                  rate: rate,
                  ary: ary,
                  aryTotal: aryTotal,
                  lossAry: aryLoss,
                  lossTotal: aryThisLoss,
                  spdState: state,
                  spdList: list,
                  reaValue: reaValue,
                  timestamp: new Date()
              }
            });
            BillingrReports.update(
               { month:month,year:year,discomState:discomState,spdState: state},
               {
                 month: month,
                 year: year,
                 discomState: discomState,
                 discomShortName:discomData[0].discom_short_name,
                 datesCount: datesShow,
                 rate: rate,
                 ary: ary,
                 aryTotal: aryTotal,
                 lossAry: aryLoss,
                 lossTotal: aryThisLoss,
                 spdState: state,
                 spdList: list,
                 reaValue: reaValue,
                 timestamp: new Date(),
               },
               { upsert: true }
            );
            return returnSuccess('Billing report generated for ' + discomState, toReturn);
        } else {
            return returnFaliure("Please insert STU losses for selected month");
        }
    },
    callBillingDiscomMP(list, month, year, discomState, headValue) {
        var myData = monthInWordsShort(month);
        var dynamicTopValue = headValue;
        var returnHeadValue = headValue + ' ' + myData + "'" + year;
        var state = list[0].state;

        var date = new Date(year, month - 1, 1);
        var result = [];
        var resultLoss = [];
        while (date.getMonth() == month - 1) {
            var update = date.getDate() + "-" + month + "-" + year;
            var newDate = update.split("-");
            var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            var showLoss = [];
            var schedule = RrfData.find({
                rrfDate: moment(myObject).format('DD-MM-YYYY')
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            if (schedule.length > 0) {
                var createArray = [];
                _.each(schedule[0].mergeArray, function(item, key) {
                    if (item[0] == discomState) {
                        for (var i = 2; i < 98; i++) {
                            createArray.push(item[i])
                        }
                    }
                })
                resultLoss.push((Number(sumOfArray(createArray)) / 4000).toFixed(7));
            } else {
                resultLoss.push('0.0000000')
            }
            date.setDate(date.getDate() + 1);
        }

        /////////stu Rate if applicable///////////
        var stateSTUvar = StuCharges.find({
            month: month,
            year: year,
            state: state
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        var rate = [];
        if (stateSTUvar.length > 0) {
            rate.push(stateSTUvar[0].stuRate);
        }
        var result = []
        for (var i = 0; i < resultLoss.length; i++) {
            var org = (Number(resultLoss[i]) / (100 - Number(rate))) * 100;
            result.push(org.toFixed(7));
        }

        var aryTotal = [];
        aryTotal.push(Number(sumOfArray(result)).toFixed(7));

        var finalMonthLength = resultLoss.length;

        var data1 = result.slice(0, 8);
        var count1 = 0;
        for (var i = data1.length; i--;) {
            count1 += Number(data1[i]);
        }
        data1.push(count1.toFixed(7));

        var data2 = result.slice(8, 15);
        var count2 = 0;
        for (var i = data2.length; i--;) {
            count2 += Number(data2[i]);
        }
        data2.push(count2.toFixed(7));

        var data3 = result.slice(15, 23);
        var count3 = 0;
        for (var i = data3.length; i--;) {
            count3 += Number(data3[i]);
        }
        data3.push(count3.toFixed(7));

        var data4 = result.slice(23, finalMonthLength);
        var count4 = 0;
        for (var i = data4.length; i--;) {
            count4 += Number(data4[i]);
        }
        data4.push(count4.toFixed(7));

        var ary = data1.concat(data2, data3, data4);

        //////manual splice code  1/////
        var dataLoss1 = resultLoss.slice(0, 8);
        dataLoss1.push(Number(sumOfArray(dataLoss1)).toFixed(7));

        //////manual splice code  2/////
        var dataLoss2 = resultLoss.slice(8, 15);
        dataLoss2.push(Number(sumOfArray(dataLoss2)).toFixed(7));

        //////manual splice code 3/////
        var dataLoss3 = resultLoss.slice(15, 23);
        dataLoss3.push(Number(sumOfArray(dataLoss3)).toFixed(7));

        //////manual splice code 4/////
        var dataLoss4 = resultLoss.slice(23, finalMonthLength);
        dataLoss4.push(Number(sumOfArray(dataLoss4)).toFixed(7));

        var finalArrayLoss = [dataLoss1, dataLoss2, dataLoss3, dataLoss4];

        var mergeArrayLoss = [];
        for (var a = 0; a < finalArrayLoss.length; a++) {
            for (var w = 0; w < finalArrayLoss[a].length; w++) {
                mergeArrayLoss.push(finalArrayLoss[a][w]);
            }
        }

        var aryLoss = mergeArrayLoss;

        var aryTotalLoss = [];
        aryTotalLoss.push(Number(sumOfArray(resultLoss)).toFixed(7));

        ///////for week loop/////
        var datesShow = [];
        var dates = getDaysArray(year, month);
        var dates1 = dates.slice(0, 8);
        dates1.push("WEEKLY");
        var dates2 = dates.slice(8, 15);
        dates2.push("WEEKLY");
        var dates3 = dates.slice(15, 23);
        dates3.push("WEEKLY");
        var dates4 = dates.slice(23, finalMonthLength);
        dates4.push("WEEKLY");
        for (var i = 0; i < dates1.length; i++) {
            datesShow.push(dates1[i]);
        }
        for (var i = 0; i < dates2.length; i++) {
            datesShow.push(dates2[i]);
        }
        for (var i = 0; i < dates3.length; i++) {
            datesShow.push(dates3[i]);
        }
        for (var i = 0; i < dates4.length; i++) {
            datesShow.push(dates4[i]);
        }

        /////attaching rea data///////////
        var ReaData = ReaMonthly.find({'spd_state': state, 'discom_state': discomState, 'month': month, 'year': year}).fetch();
        var reaValue = 'Rea not Available';
        var checkRea = false;
        if (ReaData.length > 0) {
            reaValue = ReaData[0].rea;
            var aryThisLoss = aryTotalLoss[0];
            var manualCheck = (Number(aryThisLoss) - Number(reaValue)).toFixed(7);
            if (manualCheck != '0.0000000') {
                var checkRea = true;
            }
        }
        var lastDate = numberOfdaysInMonth(month, year);
        var myLastDate = lastDate + '-' + month + '-' + year;

        var scheduleLast = RrfData.find({
            rrfDate: myLastDate
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        var lastLengthCal = Number(aryLoss.length);
        if (scheduleLast.length > 0) {
          var adjustedREA = 'adjusted' + discomState;
            if (scheduleLast[0][adjustedREA]) {
                if (scheduleLast[0][adjustedREA].sign == 'subtract') {
                    console.log('subtract');
                    aryLoss[lastLengthCal - 1] = Number(Number(aryLoss[lastLengthCal - 1]) - Number(scheduleLast[0][adjustedREA].change)).toFixed(7);
                    aryLoss[lastLengthCal - 2] = Number(Number(aryLoss[lastLengthCal - 2]) - Number(scheduleLast[0][adjustedREA].change)).toFixed(7);
                    ary[lastLengthCal - 1] = Number((Number(aryLoss[lastLengthCal - 1]) / (100 - Number(rate))) * 100).toFixed(7);
                    ary[lastLengthCal - 2] = Number((Number(aryLoss[lastLengthCal - 2]) / (100 - Number(rate))) * 100).toFixed(7);
                    var aryThisLoss = aryTotalLoss[0];
                    aryThisLoss = Number(Number(aryThisLoss) - Number(scheduleLast[0][adjustedREA].change)).toFixed(7);
                    // var totThis = aryTotal[0];
                    // aryTotal = Number((Number(aryThisLoss) / (100 - Number(rate))) * 100).toFixed(7);
                    result[finalMonthLength - 1] = Number(ary[lastLengthCal - 2]).toFixed(7);
                    aryTotal = Number(sumOfArray(result)).toFixed(7);

                    ////newwwwwwwwwwwwwwwwww
                    data4[data4.length - 1] = Number(ary[lastLengthCal - 1]).toFixed(7);
                    data4[data4.length - 2] = Number(ary[lastLengthCal - 2]).toFixed(7);
                    var get=data4.pop();
                    ary[lastLengthCal - 1] = Number(sumOfArray(data4)).toFixed(7);

                } else {
                    console.log('add');
                    aryLoss[lastLengthCal - 1] = Number(Number(aryLoss[lastLengthCal - 1]) + Number(scheduleLast[0][adjustedREA].change)).toFixed(7);
                    aryLoss[lastLengthCal - 2] = Number(Number(aryLoss[lastLengthCal - 2]) + Number(scheduleLast[0][adjustedREA].change)).toFixed(7);
                    ary[lastLengthCal - 1] = Number((Number(aryLoss[lastLengthCal - 1]) / (100 - Number(rate))) * 100).toFixed(7);
                    ary[lastLengthCal - 2] = Number((Number(aryLoss[lastLengthCal - 2]) / (100 - Number(rate))) * 100).toFixed(7);
                    var aryThisLoss = aryTotalLoss[0];
                    aryThisLoss = Number(Number(aryThisLoss) + Number(scheduleLast[0][adjustedREA].change)).toFixed(7);
                    // var totThis = aryTotal[0];
                    // aryTotal = Number((Number(aryThisLoss) / (100 - Number(rate))) * 100).toFixed(7);

                    result[finalMonthLength - 1] = Number(ary[lastLengthCal - 2]).toFixed(7);
                    aryTotal = Number(sumOfArray(result)).toFixed(7);

                    ////////////newwwwwwwwwwwwwwwwww
                    data4[data4.length - 1] = Number(ary[lastLengthCal - 1]).toFixed(7);
                    data4[data4.length - 2] = Number(ary[lastLengthCal - 2]).toFixed(7);
                    var get=data4.pop();
                    ary[lastLengthCal - 1] = Number(sumOfArray(data4)).toFixed(7);
                }
                checkRea = false;
                var dateOfAdjust = moment(scheduleLast[0][adjustedREA].saveDate).format('DD-MM-YYYY');
                console.log('REA already adjusted');
            }else {
              console.log('REA not adjusted');
            }
        } else {
            console.log('last day rrf not available');
        }


        /////finalizing json at the end////////////
        var toReturn = {
            ary: ary,
            rate: rate + '%',
            aryTotal: aryTotal,
            lossAry: aryLoss,
            lossTotal: aryThisLoss,
            datesCount: datesShow,
            discomState: discomState,
            spdState: state,
            reaValue: reaValue,
            spdList: list,
            isDifference: checkRea,
            dateOfAdjust: dateOfAdjust,
            monthLength: finalMonthLength + 3,
            returnHeadValue: returnHeadValue,
            dynamicTopValue: dynamicTopValue,
            // dataAt: dataAt,
            month: month,
            year: year
        };

        var discomData = Discom.find({discom_state:discomState}).fetch();

        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            log_type: discomState+' Billing Report Saved',
            template_name: 'billingReportSECIL',
            event_name: 'selectDiscomData',
            timestamp: new Date(),
            action_date:moment().format('DD-MM-YYYY'),
            state:state,
            json: {
            month: month,
            year: year,
            discomState: discomState,
            discomShortName:discomData[0].discom_short_name,
            datesCount: datesShow,
            rate: rate,
            ary: ary,
            aryTotal: aryTotal,
            lossAry: aryLoss,
            lossTotal: aryThisLoss,
            spdState: state,
            spdList: list,
            reaValue: reaValue,
            timestamp: new Date()
          }
        });
        BillingrReports.update(
           { month:month,year:year,discomState:discomState,spdState: state},
           {
             month: month,
             year: year,
             discomState: discomState,
             discomShortName:discomData[0].discom_short_name,
             datesCount: datesShow,
             rate: rate,
             ary: ary,
             aryTotal: aryTotal,
             lossAry: aryLoss,
             lossTotal: aryThisLoss,
             spdState: state,
             spdList: list,
             reaValue: reaValue,
             timestamp: new Date(),
           },
           { upsert: true }
        );
        return returnSuccess('Billing report generated for ' + discomState, toReturn);

    },
    saveAdjustedREA(toInsert, list, month, year, discomStateVar) {
        toInsert.saveDate = new Date();
        var idArray = [];
        list.forEach(function(item) {
            idArray.push(item.id);
        });
        var lastDate = numberOfdaysInMonth(month, year);
        var myLastDate = lastDate + '-' + month + '-' + year;

        for (var i = 0; i < idArray.length; i++) {
            var schedule = ScheduleSubmission.find({clientId: idArray[i], date: myLastDate}).fetch();
            ScheduleSubmission.update({
                _id: schedule[0]._id
            }, {
                $set: {
                    adjustedREA: toInsert
                }
            });
        }
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            log_type: discomStateVar+' REA Adjusted',
            template_name: 'billingReportSECIL',
            event_name: 'submitChange',
            timestamp: new Date(),
            action_date:moment().format('DD-MM-YYYY'),
            discom_state:discomStateVar,
            date: myLastDate,
            json:toInsert
        });
        return returnSuccess('REA Adjusted for: ' + myLastDate);
    },
    saveAdjustedREA_MP(toInsert, list, month, year, discomState) {
        toInsert.saveDate = new Date();
        var lastDate = numberOfdaysInMonth(month, year);
        var myLastDate = lastDate + '-' + month + '-' + year;
        console.log('adjustedREA:  ' + discomState);
        var key = 'adjustedREA' + discomState;
        var json = {};
        json['adjusted' + discomState] = toInsert

        RrfData.update({
            rrfDate: myLastDate
        }, {
            $set: json
        }, {multi: true});
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            log_type: 'MP REA Adjusted',
            template_name: 'billingReportSECIL',
            event_name: 'submitChange',
            timestamp: new Date(),
            action_date:moment().format('DD-MM-YYYY'),
            discom_state:discomState,
            rrfDate:myLastDate,
            json:json
        });
        return returnSuccess('REA Adjusted for: ' + myLastDate);
    },
    billingExcel(json) {
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/billing_reports/', json.month + '_' + json.year + '_' + json.spdState + '_' + json.discomState + '.xlsx');
        var sheet1 = workbook.createSheet('sheet1', 100, 126);
        sheet1.merge({
            col: 1,
            row: 1
        }, {
            col: 4,
            row: 1
        });
        sheet1.set(1, 1, json.returnHeadValue);
        sheet1.width(1, 18);
        sheet1.height(2, 55);
        sheet1.set(1, 2, 'DATE');
        sheet1.set(1, 3, 'DATA AT');
        sheet1.set(1, 4, 'DELIVERY POINT');
        sheet1.set(1, 5, 'RATE');
        if (json.spdState == 'MP') {
            sheet1.set(2, 2, 'MADHYA PRADESH' + ' STU LOSSES');
        } else {
            sheet1.set(2, 2, json.spdState.toUpperCase() + ' STU LOSSES');
        }
        sheet1.width(2, 18);
        sheet1.wrap(2, 2, 'true');
        sheet1.valign(2, 2, 'center');
        sheet1.merge({
            col: 2,
            row: 2
        }, {
            col: 2,
            row: 3
        });

        sheet1.merge({
            col: 3,
            row: 2
        }, {
            col: 3,
            row: 5
        });
        sheet1.merge({
            col: 4,
            row: 2
        }, {
            col: 4,
            row: 5
        });
        sheet1.set(3, 2, 'TOTAL (GENERATOR PER.)');
        sheet1.set(4, 2, billingExcelHead(json.discomState, json.spdState));

        sheet1.wrap(3, 2, 'true');
        sheet1.wrap(4, 2, 'true');
        sheet1.width(3, 15);
        sheet1.width(4, 15);
        sheet1.valign(3, 2, 'center');
        sheet1.valign(4, 2, 'center');

        for (var i = 0; i < json.datesCount.length; i++) {
            sheet1.set(1, 6 + i, json.datesCount[i]);
            sheet1.set(2, 6 + i, showStuOnly(json.rate, i, json.monthLength));
            sheet1.set(3, 6 + i, returningColoum(json.ary, i));
            sheet1.set(4, 6 + i, returningColoum(json.lossAry, i));
        }

        sheet1.set(1, 6 + json.monthLength + 1, 'MONTHLY');
        if (_.isArray(json.aryTotal)) {
            sheet1.set(3, 6 + json.monthLength + 1, returningColoum(json.aryTotal, 0));
        } else {
            sheet1.set(3, 6 + json.monthLength + 1, json.aryTotal);
        }

        if (json.lossTotal) {
            if (_.isArray(json.lossTotal)) {
                sheet1.set(4, 6 + json.monthLength + 1, returningColoum(json.lossTotal, 0));
            } else {
                sheet1.set(4, 6 + json.monthLength + 1, json.lossTotal);
            }
        }

        sheet1.set(1, 6 + json.monthLength + 2, 'REA/SEA');
        sheet1.set(4, 6 + json.monthLength + 2, json.reaValue);

        for (var i = 1; i < 5; i++) {
            for (var k = 0; k < json.monthLength + 9; k++) {
                sheet1.align(i, k, 'center');
                sheet1.border(i, k, {
                    left: 'medium',
                    top: 'medium',
                    right: 'medium',
                    bottom: 'medium'
                });
            }
        }
        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok
                ? 'ok'
                : json.month + '_' + json.year));
        });
        var path = '/upload/billing_reports/' + json.month + '_' + json.year + '_' + json.spdState + '_' + json.discomState + '.xlsx'
        return returnSuccess('Report Send', path);
    }
});

showStuOnly = function(stu, index, monthLength) {
    if (index == 8 || index == 16 || index == 25 || index == monthLength) {
        return ' ';
    } else {
        return stu;
    }
}
getDaysArray = function(year, month) {
    var date = new Date(year, month - 1, 1);
    var result = [];
    while (date.getMonth() == month - 1) {
        var update = date.getDate() + "-" + month + "-" + year;
        var newDate = update.split("-");
        var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
        result.push(moment(myObject).format('DD-MMM-YYYY'));
        date.setDate(date.getDate() + 1);
    }
    return result;
}

getArray = function(ary, month) {
    return ary[month - 1];
};

function billingExcelHead(discomState, spdState) {
    var excelData = [
        {
            discomState: "Assam",
            spdState: 'Rajasthan',
            value: "RANJI TOTAL (RUVNL PER.)"
        }, {
            discomState: "Delhi(BRPL)",
            spdState: 'Rajasthan',
            value: "ACME GURGAON TOTAL (RUVNL PER.)"
        }, {
            discomState: "Delhi(BYPL)",
            spdState: 'Rajasthan',
            value: "ACME MUMBAI TOTAL (RUVNL PER.)"
        }, {
            discomState: "Haryana",
            spdState: 'Rajasthan',
            value: "AZURE SUNSHINE, AZURE GREEN & NSPPL TOTAL (RUVNL PER.)"
        }, {
            discomState: "Himachal Pradesh",
            spdState: 'Rajasthan',
            value: "ACME RAJDHANI TOTAL (RUVNL PER.)"
        }, {
            discomState: "Jharkhand",
            spdState: 'Rajasthan',
            value: "LAXMI DIAMOND TOTAL (RUVNL PER.)"
        }, {
            discomState: "Punjab",
            spdState: 'Rajasthan',
            value: "Today Green 1 RJ, Today Green 2 RJ & Today Green 3 RJ TOTAL (RUVNL PER.)"
        }, {
            discomState: "Delhi(TPDDL)",
            spdState: 'Rajasthan',
            value: "MEDHA TOTAL (RUVNL PER.)"
        }, {
            discomState: "Odisha",
            spdState: 'Rajasthan',
            value: "SSPL TOTAL (RUVNL PER.)"
        }, {
            discomState: "Odisha",
            spdState: 'Gujarat',
            value: "GPCL, GSECL, BACKBONE & ENERSAN TOTAL (GUJARAT PER.)"
        }, {
            discomState: "Maharashtra",
            spdState: 'MP',
            value: "ILFS UNIT II TOTAL (MPPMCL PER.)"
        }, {
            discomState: "Maharashtra",
            spdState: 'Rajasthan',
            value: "Today Green 5 RJ TOTAL (RUVNL PER.)"
        }, {
            discomState: "Bihar",
            spdState: 'MP',
            value: "FOCAL RENEWABLE TOTAL (MPPMCL PER.)"
        }, {
            discomState: "Chhattisgarh",
            spdState: 'MP',
            value: "WANEEP & FOCAL ENERGY TOTAL (MPPMCL PER.)"
        }, {
            discomState: "Goa",
            spdState: 'MP',
            value: "ILFS UNIT I TOTAL (MPPMCL PER.)"
        }
    ];
    var returnMatch = '';
    excelData.forEach(function(item, key) {
        if (item.discomState == discomState && item.spdState == spdState) {
            returnMatch = item.value;
        }
    })
    return returnMatch;
}

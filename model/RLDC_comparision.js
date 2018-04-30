Meteor.methods({
    callStates(selectedRldc) {
        var gotState = [];
        var data = Discom.find().fetch();
        _.each(data, function(item, key) {
            if (item.regional_area) {
                _.find(item.regional_area, function(area, val) {
                    if (area == selectedRldc) {
                        gotState.push(item.discom_state);
                    }
                })
            }
        })
        if (selectedRldc == 'NRLDC') {
            var extraJoin = ['Odisha', 'Maharashtra'];
            for (var i = 0; i < extraJoin.length; i++) {
                gotState.push(extraJoin[i]);
            }
        } else if (selectedRldc == 'WRLDC') {
            gotState.push('Odisha');
        }
        var json = {
            selectedRldc: selectedRldc,
            statesArray: gotState
        }
        return returnSuccess('data State', json);
    },

    callAllStates() {
        var data = Discom.find({transaction_type: 'Inter'}).fetch();
        var myArray = [];
        _.each(data, function(item, key) {
            var spdIds = [];
            var spdState = [];
            _.each(item.spdIds, function(ids, num) {
                if (ids.transaction_type == 'Inter') {
                    spdIds.push(ids.spdId);
                    spdState.push(ids.spdState);
                }
            })
            var stateofSpd = _.uniq(spdState);
            myArray.push({state: item.discom_state, regional_area: item.regional_area, spdIds: spdIds, stateofSpd: stateofSpd});
        })
        return returnSuccess('Condition All States', myArray);
    },

    callReportInAllCase(json) {
        if (json.discomState == 'Odisha') {
            if (json.spdState == 'Rajasthan') {
                json.comparisionArray.push('NRLDC')
            } else {
                json.comparisionArray.push('WRLDC')
            }
            var spds = Discom.find({discom_state: json.discomState}).fetch();

            var orNewAry = [];
            _.each(spds[0].spdIds, function(item, key) {
                if (item.spdState == json.spdState && item.transaction_type == 'Inter') {
                    orNewAry.push(item.spdId);
                }
            })
            json.valueSpdsArray = orNewAry;
        } else if (json.discomState == 'Maharashtra') {
            if (json.spdState == 'Rajasthan') {
                json.comparisionArray.push('NRLDC')
            }
            var spds = Discom.find({discom_state: json.discomState}).fetch();

            var orNewAry = [];
            _.each(spds[0].spdIds, function(item, key) {
                if (item.spdState == json.spdState && item.transaction_type == 'Inter') {
                    orNewAry.push(item.spdId);
                }
            })
            json.valueSpdsArray = orNewAry;
        }

        var result = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;
            for (var i = 0; i < json.valueSpdsArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: json.valueSpdsArray[i], date: json.date}).fetch();
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                show.push(bid);
            }
            var count = sumOfArray(show);
            show.push(count.toFixed(2));
            result.push(show);
        }
        var onlyTotal = []
        for (var i = 0; i < result.length; i++) {
            last = Number(result[0].length) - 1;
            onlyTotal.push(result[i][last]);
        }
        onlyTotal.push((Number(sumOfArray(onlyTotal)) / 4000).toFixed(7));

        var nameOfSpdState = json.spdState.toUpperCase();
        if (json.discomState == 'Odisha') {
            var nameofDiscomState = 'ORISSA';
        } else {
            var nameofDiscomState = json.discomState.toUpperCase();
        }

        var NERServerArray = [];
        var ERServerArray = [];
        var NRServerArray = [];
        var WRServerArray = [];
        var differenceER = [];
        var differenceNER = [];
        for (var k = 0; k < json.comparisionArray.length; k++) {
            var curData = ERData.find({
                date: json.date,
                dataType: json.comparisionArray[k]
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
                        NERServerArray.push((Number(sumOfArray(NERServerArray)) / 4000).toFixed(7));
                        for (var i = 0; i < onlyTotal.length; i++) {
                            differenceNER.push(Number(onlyTotal[i]) + Number(NERServerArray[i]));
                        }
                    } else if (item[0] == nameofDiscomState && item[1] == "ERLDC" && item[2] == nameOfSpdState) {
                        for (var j = 3; j <= 98; j++) {
                            ERServerArray.push(item[j].toFixed(2));
                        }
                        ERServerArray.push((Number(sumOfArray(ERServerArray)) / 4000).toFixed(7));
                        for (var i = 0; i < onlyTotal.length; i++) {
                            differenceER.push(Number(onlyTotal[i]) - Number(ERServerArray[i]));
                        }
                    }
                })
            }
            if (json.comparisionArray[k] == "NRLDC") {
                var serverData = NRWRData.find({
                    date: json.date,
                    dataType: 'NRLDC',
                    state: json.spdState
                }, {
                    sort: {
                        $natural: -1
                    },
                    limit: 1
                }).fetch();
                var differenceNR = [];
                if (serverData.length > 0) {
                    serverData[0].secidata.forEach(function(item) {
                        if (nameofDiscomState == "DELHI(BRPL)" || nameofDiscomState == "DELHI(BYPL)" || nameofDiscomState == "DELHI(TPDDL)") {
                            var match = item[3] + item[4];
                            if (match == nameofDiscomState) {
                                for (var i = 7; i < 103; i++) {
                                    NRServerArray.push(item[i]);
                                }
                                NRServerArray.push((Number(sumOfArray(NRServerArray)) / 4000).toFixed(7));
                            }
                        } else if (item[3] == nameofDiscomState) {
                            for (var i = 7; i < 103; i++) {
                                NRServerArray.push(item[i]);
                            }
                            NRServerArray.push((Number(sumOfArray(NRServerArray)) / 4000).toFixed(7));
                        } else if (nameofDiscomState == "HIMACHAL PRADESH") {
                            if (item[3] == "HP") {
                                for (var i = 7; i < 103; i++) {
                                    NRServerArray.push(item[i]);
                                }
                                NRServerArray.push((Number(sumOfArray(NRServerArray)) / 4000).toFixed(7));
                            }
                        }
                    })
                    for (var i = 0; i < onlyTotal.length; i++) {
                        differenceNR.push(Number(onlyTotal[i]) + Number(NRServerArray[i]));
                    }
                }
            }

            if (json.comparisionArray[k] == "WRLDC") {
              if (json.discomState == 'Chhattisgarh') {
                var chhatishgarhDataArr = [];
                var scheduleRRF = RrfData.find({rrfDate:json.date,verified:true}).fetch();
                if (scheduleRRF.length > 0) {
                  var latestArr = scheduleRRF.length;
                  var data = scheduleRRF[latestArr - 1];
                  var rrfValue = data.mergeArray;
                  var finalData = rrfValue[0];
                  var finalDataLength = finalData.length;
                  for (var i = 2; i < finalDataLength; i++) {
                    chhatishgarhDataArr.push(finalData[i]);
                  }
                  chhatishgarhDataArr.push((Number(sumOfArray(chhatishgarhDataArr)) / 4000).toFixed(7));
                }
              }
                var serverDataWRLDC = NRWRData.find({
                    date: json.date,
                    dataType: 'WRLDC',
                    state: json.spdState
                }, {
                    sort: {
                        $natural: -1
                    },
                    limit: 1
                }).fetch();
                var differenceWR = [];
                if (serverDataWRLDC.length > 0) {
                    serverDataWRLDC[0].secidata.forEach(function(item) {
                        if (item[0] == json.discomState) {
                            for (var j = 9; j <= 104; j++) {
                                WRServerArray.push(item[j]);
                            }
                            WRServerArray.push((Number(sumOfArray(WRServerArray)) / 4000).toFixed(7));
                        } else if (json.discomState == 'Odisha') {
                            if (item[0] == 'ORISSA') {
                                for (var j = 9; j <= 104; j++) {
                                    WRServerArray.push(item[j]);
                                }
                                WRServerArray.push((Number(sumOfArray(WRServerArray)) / 4000).toFixed(7));
                            }
                        }
                    })
                    if (json.discomState == 'Chhattisgarh') {
                      for (var i = 0; i < chhatishgarhDataArr.length; i++) {
                          differenceWR.push(Number(chhatishgarhDataArr[i]) - Number(WRServerArray[i]));
                      }
                    }else {
                      for (var i = 0; i < onlyTotal.length; i++) {
                          differenceWR.push(Number(onlyTotal[i]) - Number(WRServerArray[i]));
                      }
                    }
                }
            }

        }

        var toReturn = {
            json: json,
            result: onlyTotal,
            NRData: NRServerArray,
            NERData: NERServerArray,
            ERData: ERServerArray,
            WRData: WRServerArray,
            differenceWR: differenceWR,
            differenceNR: differenceNR,
            differenceER: differenceER,
            differenceNER: differenceNER
        };
        return returnSuccess('RLDC Comparision Report Generated For All RLDC, Discom is '+json.discomState, toReturn);
    },
    //WRLDC Individual data fetching method
    callReport(date, discomState, rldc) {
        var odi = Discom.find({discom_state: discomState}).fetch();
        var orArray = [];
        _.each(odi[0].spdIds, function(item, key) {
            if (item.transaction_type == 'Inter') {
                orArray.push(item);
            }
        })

        if (discomState == 'Odisha' && rldc == 'WRLDC') {
            var orNewAry = [];
            _.each(orArray, function(item, key) {
                if (item.spdState == 'Gujarat' && item.transaction_type == 'Inter') {
                    orNewAry.push(item);
                }
            })
            orArray = orNewAry;
        } else if (discomState == 'Odisha' && rldc == 'NRLDC') {
            var orNewAry = [];
            _.each(orArray, function(item, key) {
                if (item.spdState == 'Rajasthan' && item.transaction_type == 'Inter') {
                    orNewAry.push(item);
                }
            })
            orArray = orNewAry;
        } else if (discomState == 'Maharashtra' && rldc == 'NRLDC') {
            var orNewAry = [];
            _.each(orArray, function(item, key) {
                if (item.spdState == 'Rajasthan' && item.transaction_type == 'Inter') {
                    orNewAry.push(item);
                }
            })
            orArray = orNewAry;
        }

        var result = [];
        for (var j = 0; j < 96; j++) {
          var dataArrLen = '';
          if (discomState == 'Chhattisgarh') {
            dataArrLen = 0;
          }else if (discomState == 'Goa') {
            dataArrLen = 1;
          }else if (discomState == 'Maharashtra') {
            dataArrLen = 2;
          }else if (discomState == 'Bihar') {
            dataArrLen = 3;
          }
          var show = [];
          var bid = 0;
          // if (discomState == 'Chhattisgarh' || discomState == 'Goa' || discomState == 'Maharashtra' || discomState == 'Bihar') {
          if (discomState == 'Chhattisgarh' || discomState == 'Goa' || discomState == 'Bihar') {
            var scheduleRRF = RrfData.find({rrfDate: date,verified:true}).fetch();
            if (scheduleRRF.length > 0) {
              var latestArr = scheduleRRF.length;
              var data = scheduleRRF[latestArr - 1];
              var rrfValue = data.mergeArray;
              var finalData = rrfValue[dataArrLen]
              show.push(finalData[j+2]);
            }else {
              show.push(bid);
            }
          }else {
            for (var i = 0; i < orArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: orArray[i].spdId, date: date}).fetch();
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                show.push(bid);
            }
          }
            var count = 0;
            for (var i = show.length; i--;) {
                count += Number(show[i]);
            }
            show.push(count.toFixed(2));
            result.push(show);
        }

        /////calculating total of 96////////////
        var tempArrayTotal = [];
        for (var z = 0; z < result[0].length; z++) {
            var sum = 0;
            for (var k = 0; k < result.length; k++) {
                sum += Number(result[k][z]);
            }
            tempArrayTotal.push((Number(sum) / 4000).toFixed(7));
        }
        result.push(tempArrayTotal);

        /////////for only total///////
        var onlyTotal = []
        for (var i = 0; i < result.length; i++) {
            last = Number(result[0].length) - 1;
            onlyTotal.push(result[i][last]);
        }

        var state = orArray[0].spdState;
        var discomStateFind = discomState;
        if (discomStateFind == 'Odisha') {
            discomStateFind = 'ORISSA'
        }
        var nameOfSpdState = state.toUpperCase();
        var nameofDiscomState = discomStateFind.toUpperCase();

        //server fetch query//////////
        if (rldc == 'NRLDC' || rldc == 'WRLDC') {
            var serverArray = [];
            var serverData = NRWRData.find({
                date: date,
                dataType: rldc,
                state: state
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            if (serverData.length > 0) {
                if (rldc == 'NRLDC') {
                    _.each(serverData[0].secidata, function(item, key) {
                        if (nameofDiscomState == "DELHI(BRPL)" || nameofDiscomState == "DELHI(BYPL)" || nameofDiscomState == "DELHI(TPDDL)") {
                            var match = item[3] + item[4];
                            if (match == nameofDiscomState) {
                                for (var i = 7; i < 103; i++) {
                                    serverArray.push(item[i]);
                                }
                            }
                        } else if (item[3] == nameofDiscomState) {
                            for (var i = 7; i < 103; i++) {
                                serverArray.push(item[i]);
                            }
                        } else if (nameofDiscomState == "HIMACHAL PRADESH") {
                            if (item[3] == "HP") {
                                for (var i = 7; i < 103; i++) {
                                    serverArray.push(item[i]);
                                }
                            }
                        }
                    })
                    var serverSumThis = sumOfArray(serverArray);
                    serverArray.push((Number(serverSumThis) / 4000).toFixed(7));
                    var difference = [];
                    var diffSLots = [];
                    for (var i = 0; i < onlyTotal.length; i++) {
                        var num = Number(onlyTotal[i]) + Number(serverArray[i]);
                        if (Number(num) != 0) {
                            diffSLots.push(i);
                        }
                        difference.push(Number(onlyTotal[i]) + Number(serverArray[i]));
                    }
                } else if (rldc == 'WRLDC') {
                    _.each(serverData[0].secidata, function(item, key) {
                        if (item[0] == discomStateFind) {
                            for (var j = 9; j <= 104; j++) {
                                serverArray.push(item[j]);
                            }
                        }
                    })
                    var serverSumThis = sumOfArray(serverArray);
                    serverArray.push((Number(serverSumThis) / 4000).toFixed(7));
                    var difference = [];
                    var diffSLots = [];
                    for (var i = 0; i < onlyTotal.length; i++) {
                        var num = Number(onlyTotal[i]) - Number(serverArray[i]);
                        if (Number(num) != 0) {
                            diffSLots.push(i);
                        }
                        var diffTotal = Number(Number(onlyTotal[i]) - Number(serverArray[i])).toFixed(7);
                        difference.push(diffTotal);
                    }
                }
            }
        } else if (rldc == 'ERLDC' || rldc == 'NERLDC') {
            var serverArray = [];
            var curData = ERData.find({
                date: date,
                dataType: rldc
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();

            if (curData.length > 0) {
                curData[0].secidata.forEach(function(item) {
                    if (item[0] == nameofDiscomState && item[1] == rldc && item[2] == nameOfSpdState) {
                        for (var j = 3; j <= 98; j++) {
                            serverArray.push(item[j]);
                        }
                    }
                })
                var serverSumThis = sumOfArray(serverArray);
                serverArray.push((Number(serverSumThis) / 4000).toFixed(7));
                var difference = [];
                var diffSLots = [];
                if (rldc == 'NERLDC' && discomState == 'Assam') {
                  for (var i = 0; i < onlyTotal.length; i++) {
                      var num = Number(onlyTotal[i]) + Number(serverArray[i]);
                      if (Number(num) != 0) {
                          diffSLots.push(i);
                      }
                      difference.push(Number(onlyTotal[i]) + Number(serverArray[i]));
                  }
                }else {
                  for (var i = 0; i < onlyTotal.length; i++) {
                      var num = Number(onlyTotal[i]) - Number(serverArray[i]);
                      if (Number(num) != 0) {
                          diffSLots.push(i);
                      }
                      difference.push(Number(onlyTotal[i]) - Number(serverArray[i]));
                  }
                }

            }
        }
        var toReturn = {
            selectedRldc: rldc,
            selectedDate: date,
            diffSLots: diffSLots,
            spdState: state,
            discomState: discomState,
            onlyTotal: onlyTotal,
            serverArray: serverArray,
            difference: difference
        }
        return returnSuccess('Report Created for: ' + rldc + ' dated ' + date, toReturn);
    },

    callReportForBifer(json) {
        var nameOfSpdState = json.spdState.toUpperCase();
        var odi = Discom.find({discom_state: json.discomState}).fetch();
        var orArray = [];
        _.each(odi[0].spdIds, function(item, key) {
            if (item.spdState == json.spdState && item.transaction_type == 'Inter') {
                orArray.push(item);
            }
        })
        var result = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;
            for (var i = 0; i < orArray.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: orArray[i].spdId, date: json.date}).fetch();
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                show.push(bid);
            }
            var count = 0;
            for (var i = show.length; i--;) {
                count += Number(show[i]);
            }
            show.push(count.toFixed(2));
            result.push(show);
        }

        /////calculating total of 96////////////
        var tempArrayTotal = [];
        for (var z = 0; z < result[0].length; z++) {
            var sum = 0;
            for (var k = 0; k < result.length; k++) {
                sum += Number(result[k][z]);
            }
            tempArrayTotal.push((Number(sum) / 4000).toFixed(7));
        }
        result.push(tempArrayTotal);

        /////////for only total///////
        var onlyTotal = []
        for (var i = 0; i < result.length; i++) {
            last = Number(result[0].length) - 1;
            onlyTotal.push(result[i][last]);
        }

        var discomStateFind = json.discomState;
        if (discomStateFind == 'Odisha') {
            discomStateFind = 'ORISSA'
        }

        var nameOfSpdState = json.spdState.toUpperCase();
        var nameofDiscomState = discomStateFind.toUpperCase();

        if (json.rldc == 'ERLDC') {
            var serverArray = [];
            var curData = ERData.find({
                date: json.date,
                dataType: json.rldc
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();

            if (curData.length > 0) {
                curData[0].secidata.forEach(function(item) {
                    if (item[0] == nameofDiscomState && item[1] == json.rldc && item[2] == nameOfSpdState) {
                        for (var j = 3; j <= 98; j++) {
                            serverArray.push(item[j]);
                        }
                    }
                })
            }
            var serverSumThis = sumOfArray(serverArray);
            serverArray.push((Number(serverSumThis) / 4000).toFixed(7));
            var difference = [];
            var diffSLots = [];
            for (var i = 0; i < onlyTotal.length; i++) {
                var num = Number(onlyTotal[i]) - Number(serverArray[i]);
                if (Number(num) != 0) {
                    diffSLots.push(i);
                }
                difference.push(Number(onlyTotal[i]) - Number(serverArray[i]));
            }
        } else if (json.rldc == 'WRLDC') {
            var serverArray = [];
            var serverData = NRWRData.find({
                date: json.date,
                dataType: json.rldc,
                state: json.spdState
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            if (serverData.length > 0) {
                _.each(serverData[0].secidata, function(item, key) {
                    if (item[0] == discomStateFind) {
                        for (var j = 9; j <= 104; j++) {
                            serverArray.push(item[j]);
                        }
                    }
                })
                var serverSumThis = sumOfArray(serverArray);
                serverArray.push((Number(serverSumThis) / 4000).toFixed(7));
                var difference = [];
                var diffSLots = [];
                for (var i = 0; i < onlyTotal.length; i++) {
                    var num = Number(onlyTotal[i]) - Number(serverArray[i]);
                    if (Number(num) != 0) {
                        diffSLots.push(i);
                    }
                    difference.push(Number(onlyTotal[i]) - Number(serverArray[i]));
                }
            }
        }

        var toReturn = {
            selectedRldc: json.rldc,
            selectedDate: json.date,
            diffSLots: diffSLots,
            spdState: nameOfSpdState,
            discomState: json.discomState,
            onlyTotal: onlyTotal,
            serverArray: serverArray,
            difference: difference
        }
        return returnSuccess('Report Created for: ' + json.rldc + ' dated ' + json.date, toReturn);
    },

    callReportForAllState(allStates, date) {
        var returnJson = 'json';
        if (allStates.selectedRldc == 'WRLDC') {
            Meteor.call('allWRLDC', allStates, date, function(error, result) {
                returnJson = result;
            })
        } else if (allStates.selectedRldc == 'NRLDC') {
            Meteor.call('allNRLDC', allStates, date, function(error, result) {
                returnJson = result;
            })
        } else if (allStates.selectedRldc == 'ERLDC') {
            Meteor.call('allERLDC', allStates, date, function(error, result) {
                returnJson = result;
            })
        }
        //  else if (allStates.selectedRldc == 'NERLDC') {
        //     Meteor.call('allNERLDC', allStates, date, function(error, result) {
        //         returnJson = result;
        //     })
        // }
        return returnSuccess('Report for all States', returnJson);
    },

    allWRLDC(states, date) {
        var mainArray = [];
        for (var i = 0; i < states.statesArray.length; i++) {
            var data = Discom.find({discom_state: states.statesArray[i]}).fetch();
            _.each(data, function(item, key) {
                var idsArray = [];
                var spdState = {};
                _.each(item.spdIds, function(ids, key) {
                    if (states.statesArray[i] == 'Odisha') {
                        if (ids.spdState == 'Gujarat' && ids.transaction_type == 'Inter') {
                            idsArray.push(ids.spdId);
                            spdState = ids.spdState;
                        }
                    } else if (states.statesArray[i] == 'Maharashtra') {
                        if (ids.transaction_type == 'Inter') {
                            idsArray.push(ids);
                        }
                    } else {
                        if (ids.transaction_type == 'Inter') {
                            idsArray.push(ids.spdId);
                            spdState = ids.spdState;
                        }
                    }
                })
                mainArray.push({discomState: states.statesArray[i], spdState: spdState, linkedSPDs: idsArray})
            })
        }

        var maharastraAry = [];
        var odishaAry = [];
        var chhattisgarhAry = [];
        var biharAndGoa = [];
        _.each(mainArray, function(item, key) {
            if (item.discomState == 'Maharashtra') {
                maharastraAry.push(item)
            } else if (item.discomState == 'Odisha') {
                odishaAry.push(item);
            } else if (item.discomState == 'Chhattisgarh') {
                chhattisgarhAry.push(item);
            } else {
                biharAndGoa.push(item);
            }
        })

        var maharastraBifer = [];
        _.each(maharastraAry[0].linkedSPDs, function(item, key) {
            var ary = [];
            ary.push(item.spdId);
            maharastraBifer.push({discomState: 'Maharashtra', spdState: item.spdState, linkedSPDs: ary});
        })
        var mergingStates = biharAndGoa.concat(maharastraBifer);

        ////calculation for rest////////////
        for (var i = 0; i < mergingStates.length; i++) {
            var scheduleArray = [];
            for (var j = 0; j < 96; j++) {
              var schedule = ScheduleSubmission.find({clientId: mergingStates[i].linkedSPDs[0], date: date}).fetch();
              var bid = 0;
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                scheduleArray.push(bid);
            }
            scheduleArray.push((Number(sumOfArray(scheduleArray)) / 4000).toFixed(7));
            mergingStates[i].spdSchedule = scheduleArray;
        }

        ////orisha final array//////
        var resultOdisha = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;
            for (var i = 0; i < odishaAry[0].linkedSPDs.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: odishaAry[0].linkedSPDs[i], date: date}).fetch();
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                show.push(bid);
            }
            var count = sumOfArray(show);
            show.push(count.toFixed(2));
            resultOdisha.push(show);
        }

        var onlyTotalOdisha = []
        for (var i = 0; i < resultOdisha.length; i++) {
            last = Number(resultOdisha[0].length) - 1;
            onlyTotalOdisha.push(resultOdisha[i][last]);
        }
        onlyTotalOdisha.push((Number(sumOfArray(onlyTotalOdisha)) / 4000).toFixed(7));

        ////calculation for Chhattisgarh//////
        var resultChhattisgarh = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;

            var scheduleRRF = RrfData.find({rrfDate: date,verified:true}).fetch();
            var bidData = '';
            if (scheduleRRF.length > 0) {
              var latestArr = scheduleRRF.length;
              var data = scheduleRRF[latestArr - 1];
              var rrfValue = data.mergeArray;
              var finalData = rrfValue[0]
              bidData = finalData[j+2];
            }else {
              bidData = bid;
            }
            show.push(bidData);

            // for (var i = 0; i < chhattisgarhAry[0].linkedSPDs.length; i++) {
            //     var schedule = ScheduleSubmission.find({clientId: chhattisgarhAry[0].linkedSPDs[i], date: date}).fetch();
            //     if (schedule.length > 0) {
            //         var jsonDataLoss = schedule[0].jsonWithLoss;
            //         var lengthLoss = jsonDataLoss.length;
            //         var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
            //         bid = getScheduleLoss.data[j].bidMwh;
            //     } else {
            //         bid = "0.00";
            //     }
            //     show.push(bid);
            // }
            var count = sumOfArray(show);
            show.push(count.toFixed(2));
            resultChhattisgarh.push(show);
        }

        var onlyTotalChhattisgarh = []
        for (var i = 0; i < resultChhattisgarh.length; i++) {
            last = Number(resultChhattisgarh[0].length) - 1;
            onlyTotalChhattisgarh.push(resultChhattisgarh[i][last]);
        }
        onlyTotalChhattisgarh.push((Number(sumOfArray(onlyTotalChhattisgarh)) / 4000).toFixed(7));

        mergingStates.push({
            discomState: 'Odisha',
            spdSchedule: onlyTotalOdisha,
            spdState: 'Gujarat'
        }, {
            discomState: 'Chhattisgarh',
            spdSchedule: onlyTotalChhattisgarh,
            spdState: 'MP'
        })

        _.each(mergingStates, function(item, key) {
            var serverData = NRWRData.find({
                date: date,
                dataType: 'WRLDC',
                state: item.spdState
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            if (serverData.length > 0) {
                _.each(serverData[0].secidata, function(getValue, number) {
                    if (getValue[0] == item.discomState) {
                        var serverArray = [];
                        for (var j = 9; j <= 104; j++) {
                            serverArray.push(getValue[j]);
                        }
                        serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                        item.serverArray = serverArray;
                    } else if (item.discomState == 'Odisha') {
                        if (getValue[0] == 'ORISSA') {
                            var serverArray = [];
                            for (var j = 9; j <= 104; j++) {
                                serverArray.push(getValue[j]);
                            }
                            serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                            item.serverArray = serverArray;
                        }
                    }
                })
                var difference = [];
                for (var i = 0; i < item.spdSchedule.length; i++) {
                    difference.push(Number(item.spdSchedule[i]) - Number(item.serverArray[i]));
                }
                item.difference = difference
            }
        })

        var toReturn = {
            date: date,
            restArray: mergingStates
        }
        return toReturn;
    },

    allNRLDC(states, date) {
        var mainArray = [];
        for (var i = 0; i < states.statesArray.length; i++) {
            var data = Discom.find({discom_state: states.statesArray[i]}).fetch();
            _.each(data, function(item, key) {
                var idsArray = [];
                _.each(item.spdIds, function(ids, key) {
                    if (states.statesArray[i] == 'Odisha') {
                        if (ids.spdState == 'Rajasthan' && ids.transaction_type == 'Inter') {
                            idsArray.push(ids.spdId);
                        }
                    } else if (states.statesArray[i] == 'Maharashtra') {
                        if (ids.spdState == 'Rajasthan' && ids.transaction_type == 'Inter') {
                            idsArray.push(ids.spdId);
                        }
                    } else {
                        if (ids.transaction_type == 'Inter') {
                            idsArray.push(ids.spdId);
                        }
                    }
                })
                mainArray.push({discomState: states.statesArray[i], linkedSPDs: idsArray})
            })
        }
        var haryanaArray = [];
        var punjabArray = [];
        var restArray = [];
        _.each(mainArray, function(item, key) {
            if (item.discomState == 'Haryana') {
                haryanaArray.push(item);
            } else if (item.discomState == 'Punjab') {
                punjabArray.push(item)
            } else {
                restArray.push(item);
            }
        })

        var resultHaryana = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;
            for (var i = 0; i < haryanaArray[0].linkedSPDs.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: haryanaArray[0].linkedSPDs[i], date: date}).fetch();
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                show.push(bid);
            }
            var count = sumOfArray(show);
            show.push(count.toFixed(2));
            resultHaryana.push(show);
        }

        var onlyTotalHaryana = []
        for (var i = 0; i < resultHaryana.length; i++) {
            last = Number(resultHaryana[0].length) - 1;
            onlyTotalHaryana.push(resultHaryana[i][last]);
        }
        onlyTotalHaryana.push((Number(sumOfArray(onlyTotalHaryana)) / 4000).toFixed(7));

        var resultPunjab = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;
            for (var i = 0; i < punjabArray[0].linkedSPDs.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: punjabArray[0].linkedSPDs[i], date: date}).fetch();
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                show.push(bid);
            }
            var count = sumOfArray(show);
            show.push(count.toFixed(2));
            resultPunjab.push(show);
        }

        var onlyTotalPunjab = []
        for (var i = 0; i < resultPunjab.length; i++) {
            last = Number(resultPunjab[0].length) - 1;
            onlyTotalPunjab.push(resultPunjab[i][last]);
        }
        onlyTotalPunjab.push((Number(sumOfArray(onlyTotalPunjab)) / 4000).toFixed(7));

        for (var i = 0; i < restArray.length; i++) {
            var scheduleArray = [];
            var schedule = ScheduleSubmission.find({clientId: restArray[i].linkedSPDs[0], date: date}).fetch();
            var bid = 0;
            for (var j = 0; j < 96; j++) {
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                scheduleArray.push(bid);
            }
            scheduleArray.push((Number(sumOfArray(scheduleArray)) / 4000).toFixed(7));
            restArray[i].spdSchedule = scheduleArray;
        }

        restArray.push({
            discomState: 'Punjab',
            spdSchedule: onlyTotalPunjab
        }, {
            discomState: 'Haryana',
            spdSchedule: onlyTotalHaryana
        })

        var serverData = NRWRData.find({
            date: date,
            dataType: 'NRLDC',
            state: 'Rajasthan'
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        if (serverData.length > 0) {
            _.each(serverData[0].secidata, function(item, key) {
                for (var s = 0; s < restArray.length; s++) {
                    if (restArray[s].discomState.toUpperCase() == "DELHI(BRPL)" || restArray[s].discomState.toUpperCase() == "DELHI(BYPL)" || restArray[s].discomState.toUpperCase() == "DELHI(TPDDL)") {
                        var match = item[3] + item[4];
                        if (match == restArray[s].discomState.toUpperCase()) {
                            var serverArray = [];
                            for (var i = 7; i < 103; i++) {
                                serverArray.push(item[i]);
                            }
                            serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                            restArray[s].serverArray = serverArray;
                        }
                    } else if (restArray[s].discomState.toUpperCase() == "HIMACHAL PRADESH") {
                        if (item[3] == "HP") {
                            var serverArray = [];
                            for (var i = 7; i < 103; i++) {
                                serverArray.push(item[i]);
                            }
                            serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                            restArray[s].serverArray = serverArray;
                        }
                    } else if (restArray[s].discomState.toUpperCase() == "ODISHA") {
                        if (item[3] == "ORISSA") {
                            var serverArray = [];
                            for (var i = 7; i < 103; i++) {
                                serverArray.push(item[i]);
                            }
                            serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                            restArray[s].serverArray = serverArray;
                        }
                    } else if (item[3] == restArray[s].discomState.toUpperCase()) {
                        var serverArray = [];
                        for (var i = 7; i < 103; i++) {
                            serverArray.push(item[i]);
                        }
                        serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                        restArray[s].serverArray = serverArray;
                    }
                }
            })
            _.each(restArray, function(item, key) {
                var difference = [];
                for (var i = 0; i < item.spdSchedule.length; i++) {
                    difference.push(Number(item.spdSchedule[i]) + Number(item.serverArray[i]));
                }
                item.spdState = 'Rajasthan';
                item.difference = difference
            })
        }

        var toReturn = {
            discomStates: states,
            date: date,
            restArray: restArray
        }
        return toReturn;
    },

    allERLDC(states, date) {
        var mainArray = [];
        for (var i = 0; i < states.statesArray.length; i++) {
            var data = Discom.find({discom_state: states.statesArray[i]}).fetch();
            _.each(data, function(item, key) {
                var idsArray = [];
                var spdState = {};
                _.each(item.spdIds, function(ids, key) {
                    if (states.statesArray[i] == 'Odisha') {
                        if (ids.transaction_type == 'Inter') {
                            idsArray.push(ids);
                        }
                    } else {
                        if (ids.transaction_type == 'Inter') {
                            idsArray.push(ids.spdId);
                            spdState = ids.spdState;
                        }
                    }
                })
                mainArray.push({discomState: states.statesArray[i], spdState: spdState, linkedSPDs: idsArray})
            })
        }

        var odishaAry = [];
        var biharAndAll = [];
        _.each(mainArray, function(item, key) {
            if (item.discomState == 'Odisha') {
                odishaAry.push(item);
            } else {
                biharAndAll.push(item);
            }
        })
        var odishaRajasthan = [];
        var odishaGujarat = [];
        _.each(odishaAry[0].linkedSPDs, function(item, key) {
            if (item.spdState == 'Rajasthan') {
                var ids = [];
                ids.push(item.spdId);
                odishaRajasthan.push({discomState: 'Odisha', spdState: item.spdState, linkedSPDs: ids});
            } else if (item.spdState == 'Gujarat') {
                var ids = [];
                ids.push(item.spdId);
                odishaGujarat.push({discomState: 'Odisha', spdState: item.spdState, linkedSPDs: ids});
            }
        })

        var odishaGujaratAllIds = _.pluck(odishaGujarat, 'linkedSPDs');

        var mergingStates = biharAndAll.concat(odishaRajasthan);

        for (var i = 0; i < mergingStates.length; i++) {
            var scheduleArray = [];
            var schedule = ScheduleSubmission.find({clientId: mergingStates[i].linkedSPDs[0], date: date}).fetch();
            var bid = 0;
            for (var j = 0; j < 96; j++) {
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                scheduleArray.push(bid);
            }
            scheduleArray.push((Number(sumOfArray(scheduleArray)) / 4000).toFixed(7));
            mergingStates[i].spdSchedule = scheduleArray;
        }

        ////orisha final array//////
        var resultOdisha = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var bid = 0;
            for (var i = 0; i < odishaGujaratAllIds.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: odishaGujaratAllIds[i][0], date: date}).fetch();
                if (schedule.length > 0) {
                    var jsonDataLoss = schedule[0].jsonWithLoss;
                    var lengthLoss = jsonDataLoss.length;
                    var getScheduleLoss = jsonDataLoss[lengthLoss - 1];
                    bid = getScheduleLoss.data[j].bidMwh;
                } else {
                    bid = "0.00";
                }
                show.push(bid);
            }
            var count = sumOfArray(show);
            show.push(count.toFixed(2));
            resultOdisha.push(show);
        }

        var onlyTotalOdisha = []
        for (var i = 0; i < resultOdisha.length; i++) {
            last = Number(resultOdisha[0].length) - 1;
            onlyTotalOdisha.push(resultOdisha[i][last]);
        }
        onlyTotalOdisha.push((Number(sumOfArray(onlyTotalOdisha)) / 4000).toFixed(7));

        mergingStates.push({discomState: 'Odisha', spdSchedule: onlyTotalOdisha, spdState: 'Gujarat'})

        var serverData = ERData.find({
            date: date,
            dataType: states.selectedRldc
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        if (serverData.length > 0) {
            _.each(serverData[0].secidata, function(item, key) {
                for (var s = 0; s < mergingStates.length; s++) {
                    if (item[0] == mergingStates[s].discomState.toUpperCase() && item[2] == mergingStates[s].spdState.toUpperCase()) {
                        var serverArray = [];
                        for (var j = 3; j <= 98; j++) {
                            serverArray.push(item[j].toFixed(2));
                        }

                        console.log(mergingStates[s].discomState.toUpperCase());
                        console.log(mergingStates[s].spdState.toUpperCase());
                        console.log('.............................');
                        serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                        mergingStates[s].serverArray = serverArray;
                    } else if (mergingStates[s].discomState.toUpperCase() == 'ODISHA') {
                        if (item[0] == 'ORISSA' && item[2] == mergingStates[s].spdState.toUpperCase()) {
                            var serverArray = [];
                            for (var j = 3; j <= 98; j++) {
                                serverArray.push(item[j].toFixed(2));
                            }
                            serverArray.push((Number(sumOfArray(serverArray)) / 4000).toFixed(7));
                            mergingStates[s].serverArray = serverArray;

                            console.log(mergingStates[s].discomState.toUpperCase());
                            console.log(mergingStates[s].spdState.toUpperCase());
                            console.log('.............................');
                        }
                    }
                }
            })
            _.each(mergingStates, function(item, key) {
                var difference = [];
                for (var i = 0; i < item.spdSchedule.length; i++) {
                    difference.push(Number(item.spdSchedule[i]) - Number(item.serverArray[i]));
                }
                item.difference = difference
            })
        }

        var toReturn = {
            state: states,
            restArray: mergingStates
        }
        return toReturn;
    },

    allNERLDC(states) {
        console.log(states);
        return 'NERLDC here'
    },

    saveDiscrepancy(json) {
        json.date = new Date();
        DiscrepancyLog.insert(json);
        return returnSuccess('Log has been created');
    },

    callDiscrepancy(date) {
        var data = DiscrepancyLog.find({selectedDate: date}).fetch();
        if (data.length > 0) {
            return returnSuccess('Got DiscrepancyLogs for: ' + date, data);
        } else {
            return returnFaliure('No DiscrepancyLogs available for: ' + date);
        }
    },

    respectiveDiscomMailForRLDC(date, stateArray, uniqSpdStateList,regionRLDCVar) {
        var dateThis = date.split('-');
        dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
        dateThis.setDate(dateThis.getDate() - 1);
        moment(dateThis).format('DD-MM-YYYY');
        var minusOneDay = moment(dateThis).format('DD-MM-YYYY');
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

            var sumAll = 0;
            for (var i = revisionsValue.length; i--;) {
                sumAll += Number(revisionsValue[i]);
            }
            var sumOfRevision = sumAll;
            console.log('sum is ' + sumOfRevision);

            console.log('discomstate: ' + stateArray[0]);
            console.log('spdstate: ' + uniqSpdStateList[y]);

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
            var excelbuilder = require('msexcel-builder');
            var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/discrepancy_reports/', date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + '.xlsx');
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

                    sheet1.fill(2 * toReturn.spdNamesListTotal.length + 2, s, {
                        type: 'solid',
                        fgColor: 'fdff00',
                        bgColor: '64'
                    });

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
                process.env.PWD + '/.uploads/discrepancy_reports/' + date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + '.xlsx',
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
                filePath: process.env.PWD + '/.uploads/discrepancy_reports/' + date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + '.xlsx',
                fileName: date + '_' + uniqSpdStateList[y] + '_' + stateArray[0] + '.xlsx',
                stateName: stateArray[0],
                createdAt: new Date(),
                reportType: "discrepancy_reports"
            }
            ReportUrls.insert(toInsert);
        }

        var data = ReportUrls.find({
            date: date,
            reportType: "discrepancy_reports",
            stateName: stateArray[0]
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        var attachmentUrl = data[0].filePath;
        var fileName = data[0].fileName;
        var str = uniqSpdStateList[0] + '-' + stateArray[0];
        var transactionName = str.toUpperCase();
        var subject = 'DISCREPANCY IN SECI ' +transactionName+ ' SOLAR LTOA SCHEDULE FOR ' + date;

        var message = "Dear Sir/Ma'am,<br><br>This is to bring into your kind notice that Solar LTOA schedule OF "+transactionName+' are reflecting incorrectly in '+regionRLDCVar+' schedule for '+ date +'.'+' You are requested to correct the schedule at the earliest. The schedules are attached for your kind reference. Final schedules have been marked in Yellow color to avoid any confusion.'+ "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

        // using to show text background in color of mail body
        // var varColor = '<html><label style="background:rgb(255, 255, 0);">Yellow</label></html>';
        // var transactionInColorVar = '<html><label style="background:rgb(255, 255, 0);">'+transactionName+'</label></html>';
        // var scheduleDateInColor = '<html><label style="background:rgb(255, 255, 0);">'+date+'</label></html>';
        // if (regionRLDCVar == 'NRLDC') {
        //   var regionData = '<html><label style="background:rgb(255, 255, 0);">NRLDC</label></html>';
        //   var message = "Dear Sir/Ma'am,<br><br>This is to bring into your kind notice that Solar LTOA schedule OF "+transactionInColorVar+' are reflecting incorrectly in '+regionData+' schedule for '+ scheduleDateInColor +'.'+' You are requested to correct the schedule at the earliest. The schedules are attached for your kind reference. Final schedules have been marked in '+varColor+' color to avoid any confusion.'+ "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        // }else {
        //   var message = "Dear Sir/Ma'am,<br><br>This is to bring into your kind notice that Solar LTOA schedule OF "+transactionInColorVar+' are reflecting incorrectly in your schedule for '+ scheduleDateInColor +'.'+' You are requested to correct the schedule at the earliest. The schedules are attached for your kind reference. Final schedules have been marked in '+varColor+' color to avoid any confusion.'+ "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        // }
        console.log(subject);
        // console.log(message);
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
        return returnSuccess('File sucussally send');
    },

    respectiveMPDiscomMailForRLDC(date, selectedState, uniqSpdStateList) {
        var data = RrfData.find({
            rrfDate: date
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        if (data.length > 0) {
            if (data[0].verified == true) {
                ///special for revision/////////
                var forRevision = Discom.find({discom_state: selectedState}).fetch();

                var spdArray = [];
                _.each(forRevision[0].spdIds, function(item, key) {
                    if (item.spdState == 'MP') {
                        spdArray.push(item.spdId)
                    }
                })

                var revTest = [];
                for (var i = 0; i < spdArray.length; i++) {
                    var schedule = ScheduleSubmission.find({clientId: spdArray[i], date: date}).fetch();
                    if (schedule.length > 0) {
                        revTest.push(Number(schedule[0].json.length) - 1);
                    }
                }
                var revision = 0;
                for (var i = revTest.length; i--;) {
                    revision += Number(revTest[i]);
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

                var dateThis = date.split('-');
                dateThis = new Date(dateThis[2], dateThis[1] - 1, dateThis[0]);
                dateThis.setDate(dateThis.getDate() - 1);
                moment(dateThis).format('DD-MM-YYYY');
                var minusOneDay = moment(dateThis).format('DD-MM-YYYY');

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
                    hrefArray: hrefArray,
                    selectedRegion : uniqSpdStateList,
                }
                Meteor.call('MPdiscomSend', toReturn);
                return returnSuccess('MP Data for: ' + selectedState + ' ' + date, toReturn);
            } else {
                return returnFaliure('Last MP RRF Data is not Verfied for: ' + date);
            }
        } else {
            return returnFaliure('RRF not found for: ' + date);
        }
    },

    MPdiscomSend(toReturn) {
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/discrepancy_reports/', toReturn.scheduleDate + '_' + toReturn.spdState + '_' + toReturn.detailsArray[0] + '.xlsx');
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
            sheet1.fill(3, s, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
            });
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
            process.env.PWD + '/.uploads/discrepancy_reports/' + toReturn.scheduleDate + '_' + toReturn.spdState + '_' + toReturn.detailsArray[0] + '.xlsx',
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
            filePath: process.env.PWD + '/.uploads/discrepancy_reports/' + toReturn.scheduleDate + '_' + toReturn.spdState + '_' + toReturn.detailsArray[0] + '.xlsx',
            fileName: toReturn.scheduleDate + '_' + toReturn.spdState + '_' + toReturn.detailsArray[0] + '_R' + toReturn.valueHighestRevision + '.xlsx',
            stateName: toReturn.detailsArray[0],
            createdAt: new Date(),
            reportType: "rrf_report"
        }
        ReportUrls.insert(rrfReports);
        console.log('URL Inserted');

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
        var str = toReturn.spdState + '-' + toReturn.detailsArray[0];
        var transactionName = str.toUpperCase();
        var subject = 'DISCREPANCY IN SECI ' +transactionName+ ' SOLAR LTOA SCHEDULE FOR ' + toReturn.scheduleDate;
        var message = "Dear Sir/Ma'am,<br><br>This is to bring into your kind notice that Solar LTOA schedule OF "+transactionName+' are reflecting incorrectly in '+toReturn.selectedRegion+' schedule for '+ toReturn.scheduleDate +'.'+' You are requested to correct the schedule at the earliest. The schedules are attached for your kind reference. Final schedules have been marked in Yellow color to avoid any confusion.'+ "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";


        // using to show text background in color of mail body
        // var varColor = '<html><label style="background:rgb(255, 255, 0);">Yellow</label></html>';
        // var transactionInColorVar = '<html><label style="background:rgb(255, 255, 0);">'+transactionName+'</label></html>';
        // var scheduleDateInColor = '<html><label style="background:rgb(255, 255, 0);">'+toReturn.scheduleDate+'</label></html>';
        // var message = "Dear Sir/Ma'am,<br><br>This is to bring into your kind notice that Solar LTOA schedule OF "+transactionInColorVar+' are reflecting incorrectly in your schedule for '+scheduleDateInColor+'.'+' You are requested to correct the schedule at the earliest. The schedules are attached for your kind reference. Final schedules have been marked in '+varColor+' color to avoid any confusion.'+ "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";

        var email = ["seci.scheduling@gmail.com"];
        Meteor.setTimeout(function() {
            for (var i = 0; i < email.length; i++) {
                console.log("sending mail Inserted");
                console.log('file name: ' + fileName);
                var date = toReturn.scheduleDate;
                console.log(date);
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
        return returnSuccess('Discrepancy report send for MP');
    }
})

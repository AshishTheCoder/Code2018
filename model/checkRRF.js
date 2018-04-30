Meteor.methods({
    callCheckRRF(date) {
        var splitDate = date.split('-');
        var stuData = StuCharges.find({
            month: splitDate[1],
            year: splitDate[2],
            state: "MP"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        var checkState = ['Chhattisgarh', 'Goa', 'Maharashtra', 'Bihar'];
        var jsonArray = [];
        for (var i = 0; i < checkState.length; i++) {
            var discomValues = Discom.find({'discom_state': checkState[i]}).fetch();
            discomValues[0].spdIds.forEach(function(item) {
                if (item.spdState == 'MP') {
                    jsonArray.push({discomState: discomValues[0].discom_state, spdId: item.spdId, spdName: item.spdName})
                }
            })
        }

        var ChhattisgarhJson = [];
        var RestJson = [];
        jsonArray.forEach(function(item) {
            if (item.discomState == "Chhattisgarh") {
                ChhattisgarhJson.push(item);
            } else if (item.discomState == "Goa" || item.discomState == "Maharashtra" || item.discomState == "Bihar") {
                RestJson.push(item);
            }
        });

        var resultChhattisgarh = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showChhattisgarh = [];
            var bid = 0;
            for (var i = 0; i < ChhattisgarhJson.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: ChhattisgarhJson[i].spdId, date: date}).fetch();
                if (schedule) {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        var getSchedule = jsonData[length - 1];
                        bid = getSchedule.data[j].bidMwh;
                    })
                } else {
                    bid = "0.00";
                }
                show.push(bid);;
            }
            var count = 0;
            // var lossCount = 0;
            for (var i = show.length; i--;) {
                count += Number(show[i]);
            }
            show.push(count.toFixed(2));
            resultChhattisgarh.push(show);
        }

        var ChhattisgarhTotalSet = [];
        var ChhattisgarhTotalSetLoss = [];
        var length = Number(resultChhattisgarh[0].length) - 1;
        for (var i = 0; i < resultChhattisgarh.length; i++) {
            ChhattisgarhTotalSet.push(resultChhattisgarh[i][length]);
            ChhattisgarhTotalSetLoss.push(((Number(resultChhattisgarh[i][length]) * (100 - Number(stuData[0].stuRate))) / 100).toFixed(2));
        }

        var resultRest = [];
        var resultRestLoss = [];
        for (var j = 0; j < 96; j++) {
            var show = [];
            var showRest = [];
            var bid = 0;
            for (var i = 0; i < RestJson.length; i++) {
                var schedule = ScheduleSubmission.find({clientId: RestJson[i].spdId, date: date}).fetch();
                if (schedule) {
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
                var MPStu = stuData[0].stuRate;
                var percentage = Number(MPStu) / 100;
                var calculate = Number(bid) * Number(percentage);
                var errorMP = Number(bid) - Number(calculate);
                showRest.push(errorMP.toFixed(2));
            }
            resultRest.push(show);
            resultRestLoss.push(showRest);
        }

        var dataRRF = RrfData.find({
            rrfDate: date,
            verified: false
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        if (dataRRF.length > 0) {
            var ChhattisgarhRRF = [];
            dataRRF[0].mergeArray.forEach(function(item) {
                if (item[0] == 'Chhattisgarh') {
                    for (var i = 2; i <= 97; i++) {
                        ChhattisgarhRRF.push(item[i]);
                    }
                }
            })

            var RRFdataState = ['Goa', 'Maharashtra', 'Bihar'];
            var RestRRF = [];
            for (var j = 2; j <= 97; j++) {
                var nestAry = [];
                var a = 0;
                for (var i = 0; i < RRFdataState.length; i++) {
                    dataRRF[0].mergeArray.forEach(function(item) {
                        if (item[0] == RRFdataState[i]) {
                            a = item[j]
                        }
                    })
                    nestAry.push(a.toFixed(2));
                }
                RestRRF.push(nestAry);
            }

            var subChhattisgarh = [];
            for (var i = 0; i < ChhattisgarhTotalSetLoss.length; i++) {
                var value = Number(ChhattisgarhTotalSetLoss[i]) - Number(ChhattisgarhRRF[i]);
                subChhattisgarh.push(value.toFixed(2));
            }

            var subRest = [];
            for (var z = 0; z < resultRestLoss.length; z++) {
                var restAry = [];
                for (var k = 0; k < resultRestLoss[0].length; k++) {
                    var sub = Number(resultRestLoss[z][k]) - Number(RestRRF[z][k]);
                    restAry.push(sub.toFixed(2));
                }
                subRest.push(restAry);
            }

            var chhatishgarhTotalSch = 0;
            var chhatishgarhTotalRRF = 0;
            var chhatishgarhTotalCal = 0;
            for (var i = 0; i < ChhattisgarhTotalSetLoss.length; i++) {
              chhatishgarhTotalSch += Number(ChhattisgarhTotalSetLoss[i]);
              chhatishgarhTotalRRF += Number(ChhattisgarhRRF[i]);
              chhatishgarhTotalCal += Number(subChhattisgarh[i]);
            }

            var SchTotalArr = [];
            var RRFTotalArr = [];
            var CalTotalArr = [];
            for (var j = 0; j < 3; j++) {
              var totalCountSch = 0;
              var totalCountRRF = 0;
              var totalCountCal = 0;
              for (var i = 0; i < resultRestLoss.length; i++) {
                var dataSchTotal = resultRestLoss[i];
                var dataRRFTotal = RestRRF[i];
                var dataCalTotal = subRest[i];
                totalCountSch += Number(dataSchTotal[j]);
                totalCountRRF += Number(dataRRFTotal[j]);
                totalCountCal += Number(dataCalTotal[j]);
              }
              SchTotalArr.push(Number(totalCountSch / 4000).toFixed(7));
              RRFTotalArr.push(Number(totalCountRRF / 4000).toFixed(7));
              CalTotalArr.push(Number(totalCountCal / 4000).toFixed(7));
            }
            var chhatishgarhTotalSchDevision = Number(chhatishgarhTotalSch / 4000).toFixed(7);
            var totalJson = {
              chhatishgarhTotalSch:Number(chhatishgarhTotalSch / 4000).toFixed(7),
              SchTotalArr:SchTotalArr,
              chhatishgarhTotalRRF:Number(chhatishgarhTotalRRF / 4000).toFixed(7),
              RRFTotalArr:RRFTotalArr,
              chhatishgarhTotalCal:Number(chhatishgarhTotalCal / 4000).toFixed(7),
              CalTotalArr:CalTotalArr,
            };
            // var totalJson = {
            //   chhatishgarhTotalSch:chhatishgarhTotalSch.toFixed(2),
            //   SchTotalArr:SchTotalArr,
            //   chhatishgarhTotalRRF:chhatishgarhTotalRRF.toFixed(2),
            //   RRFTotalArr:RRFTotalArr,
            //   chhatishgarhTotalCal:chhatishgarhTotalCal.toFixed(2),
            //   CalTotalArr:CalTotalArr,
            // };

            var toReturn = {
                rrfId: dataRRF[0]._id,
                totalJson:totalJson,
                revisionNumber: dataRRF[0].revisionNumber,
                filePath: dataRRF[0].filePath,
                stateArray: RRFdataState,
                ChhattisgarhTotalSetLoss: ChhattisgarhTotalSetLoss,
                resultRestLoss: resultRestLoss,
                ChhattisgarhRRF: ChhattisgarhRRF,
                RestRRF: RestRRF,
                subChhattisgarh: subChhattisgarh,
                subRest: subRest
            }
            return returnSuccess('Checking RRF for ' + date, toReturn);
        } else {
            return returnFaliure('RRF not available or already verified for: ' + date);
        }
    },
    callVerifyRRF(rrfId) {
        RrfData.update({
            _id: rrfId
        }, {
            $set: {
                verified: true
            }
        });
        var rrfDataVar = RrfData.find({_id:rrfId}).fetch();
        // creating log
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            uploaded_by: Meteor.user().profile.user_type,
            log_type: "Uploaded RRF R"+rrfDataVar[0].revisionNumber+" Approved",
            template_name: 'checkRRFdata',
            event_name: 'verifyMPrrf',
            timestamp: new Date(),
            action_date: todayDate,
            json:rrfDataVar[0],
            verified: true
        });
        return returnSuccess('Verified RRF for: ' + rrfId);
    },
    callRejectRRF(id, filePath) {
      var rrfDataVar = RrfData.find({_id:id}).fetch();
      // creating log
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      LogDetails.insert({
          ip_address:ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          uploaded_by: Meteor.user().profile.user_type,
          log_type: "Uploaded RRF R"+rrfDataVar[0].revisionNumber+" Rejected",
          template_name: 'checkRRFdata',
          event_name: 'rejectMPrrf',
          timestamp: new Date(),
          action_date: todayDate,
          json:rrfDataVar[0],
          verified: false
      });

        RrfData.remove(id);
        console.log(id);
        console.log(filePath);
        var fs = Npm.require('fs');
        fs.unlink(filePath, (err) => {
            if (err)
                throw err;
            console.log('Successfully Deleted File');
        });
        return returnSuccess('Rejected RRF for: ' + id);
    }
});

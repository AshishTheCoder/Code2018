Meteor.methods({
  viewRRFDataToAdmin (selectedDate, selectedState,diffState){
    var arr = [];
    var totalArr = [];
    var revNoArr = [];
    var rrfDataZero = RrfData.find({rrfDate: selectedDate,revisedState:'all'}).fetch();
    var rrfDataZeroLength = rrfDataZero.length;
    revNoArr.push(0);

    var rrfData = RrfData.find({rrfDate: selectedDate,revisedState:selectedState}).fetch();
    var rrfDataVarLength = rrfData.length;
    _.forEach(rrfData, function(item){
      revNoArr.push(item.revisionNumber);
    });
    // console.log(revNoArr);

    var totalLengthVar = Number(rrfDataZeroLength) + Number(rrfDataVarLength);
    if(rrfDataZero.length > 0){
      var viewData = [];
      var json = [];
      for(var n = 0; n < totalLengthVar; n++){
        if(n == 0){
          var rrfDataVar = RrfData.find({rrfDate: selectedDate,revisedState:'all'}).fetch();
          var value = rrfDataVar[0].mergeArray;
        }else{
          var arrLength = Number(totalLengthVar) - Number(n + 1);
          var rrfDataVar = RrfData.find({rrfDate: selectedDate,revisedState:selectedState}, {sort: {$natural: -1}}).fetch();
          // var rrfDataVar = RrfData.find({rrfDate: selectedDate,revisedState:selectedState}).fetch();
          var value = rrfDataVar[arrLength].mergeArray;
        }
        var data = [];
        var detailsArray=[];
        var totalVar = 0;
        value.forEach(function(item) {
          if (diffState == 'Maharashtra') {
            if (item[0] == 'Maharashtra') {
                for (var i = 2; i <= 97; i++) {
                    data.push({bidMwh:item[i]});
                    totalVar += item[i];
                }
                var totalMwhDevision = Number(totalVar / 4000).toFixed(7);
                totalArr.push({totalMwh:totalMwhDevision});
                json.push({data:data});
                for (var i = 0; i < 2; i++) {
                  detailsArray.push(item[i]);
                }
            }
          }else {
            if (item[0] == selectedState) {
                for (var i = 2; i <= 97; i++) {
                    data.push({bidMwh:item[i]});
                    totalVar += item[i];
                }
                var totalMwhDevision = Number(totalVar / 4000).toFixed(7);
                totalArr.push({totalMwh:totalMwhDevision});
                json.push({data:data});
                for (var i = 0; i < 2; i++) {
                  detailsArray.push(item[i]);
                }
            }
          }
        })
      }
      viewData.push({json:json});
      var loopLength = viewData[0].json.length;
      var timeSlot = TimeBlock.find().fetch();
      var sr = 1 ;
      for (k = 0; k < 96; k++) {
        var slot = timeSlot[k + 1].time_slot;
        if (timeSlot.length - 1 == k) {
            slot = "00:00";
        }
          var json = {};
          //creating json of, date and time_slot
          json['serialNumber'] = {
              "data": sr,
              "color": ""
          };
          json['date'] = {
              "data": selectedDate,
              "color": ""
          };
          json['time_slot'] = {
              "data": timeSlot[k].time_slot + '-' + slot,
              "color": ""
          };
          for (var i = 0; i < loopLength; i++) {
              if (i > 0) {
                  if (viewData[0].json[i - 1].data[k].bidMwh != viewData[0].json[i].data[k].bidMwh) {
                      json['R' + i] = {
                          "data": viewData[0].json[i].data[k].bidMwh,
                          "color": "bg-success",
                          "actuallyColor":"yellow"
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
          arr.push(json);
          var returnJson = {arr:arr,totalArr:totalArr};
          sr++;;
      };
    }else{
      return returnFaliure('RRF not uploaded!');
    }
    return returnSuccess('return success',returnJson);
  }
});

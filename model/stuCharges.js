Meteor.methods({
  "callStuValues":function (month,year,state) {
    var data = StuCharges.find({month:month, year:year, state:state}).fetch();
    if(data.length > 0){
      var rate = data[0].stuRate;
      return returnSuccess("state value",rate);
    }else {
      return returnSuccess("state value");
    }
  },
  "saveStuValues":function (state,oldCharge,newCharge,month,year,fromDate,toDate) {
    // fromDate = fromDate.split('-');
    // toDate = toDate.split('-');
    // fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
    // toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
    // date1_unixtime = parseInt(fromDate.getTime() / 1000);
    // date2_unixtime = parseInt(toDate.getTime() / 1000);
    // var timeDifference = date2_unixtime - date1_unixtime;
    // var timeDifferenceInHours = timeDifference / 60 / 60;
    // var timeDifferenceInDays = timeDifferenceInHours / 24;
    // console.log('Line No -21 timeDifferenceInHours = '+timeDifferenceInHours);
    // console.log('Line No -22 timeDifferenceInDays = '+timeDifferenceInDays);
    //
    // for (var i = 0; i <= timeDifferenceInDays; i++) {
    //   console.log(moment(fromDate).format('DD-MM-YYYY'));
    //   //write from here,,,,,
    //     fromDate.setDate(fromDate.getDate() + 1);
    // }
    if(oldCharge == "No STU Losses"){
      var insert={
        month:month,
        year:year,
        state:state,
        stuRate:Number(newCharge).toFixed(2),
        createdAt:new Date()
      }
      StuCharges.insert(insert);
      // data insert in log Details collection
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      LogDetails.insert({
          ip_address:ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          log_type: state+' STU loss Submitted',
          template_name: 'stuChargesDetails',
          event_name: 'STUChargesForm',
          timestamp: new Date(),
          action_date:todayDate,
          json: insert,
      });

        var userInfoVar = Meteor.users.find({
            'profile.user_type': 'spd',
            'profile.status': 'approved',
            'profile.registration_form.transaction_type': 'Inter',
            'profile.registration_form.spd_state': state
        }).fetch();
        var userLengthVar = userInfoVar.length;

        var stuLossData = StuCharges.find({
            month: month,
            year: year,
            state: state
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        var stuLossVar = stuLossData[0].stuRate;
        var lossPercentVar = Number(stuLossVar) / 100;
        for(i = 0; i < userLengthVar; i++){
          var clientIdVar = userInfoVar[i]._id;
          var date = new Date(year, Number(month) - 1, 1);
          var dateArr = [];
          while (date.getMonth() == Number(month) - 1) {
              var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
              var newDate = update.split("-");
              var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
              var dateFormatVar = moment(myObject).format('DD-MM-YYYY');
              var scheduleData = ScheduleSubmission.find({clientId:clientIdVar,date:dateFormatVar}).fetch();
              if(scheduleData.length > 0){
                var mainArrayWithLoss = [];
                var totalMwhWithLoss = 0;
                var revisionWithLoss = [];
                var jsonData = scheduleData[0].json[0].data;
                jsonData.forEach(function(item){
                  var bidWithLoss = 0;
                  if(item.bidMwh != 0){
                    var calculation = Number(item.bidMwh) * Number(lossPercentVar)
                    bidWithLoss = Number(item.bidMwh) - Number(calculation);
                  }else{
                    var bidWithLoss = '0.00';
                  }
                  var add = Number(bidWithLoss).toFixed(2);
                  totalMwhWithLoss += Number(add);

                  mainArrayWithLoss.push({
                    time_slot: item.time_slot,
                    bidMwh: Number(bidWithLoss).toFixed(2)
                  });
                });
                var totalMWhVarWithLoss = Number(totalMwhWithLoss);
                var totalMwhDevisionWithLoss = Number(totalMWhVarWithLoss / 4000).toFixed(7);
                revisionWithLoss.push({
                    data: mainArrayWithLoss,
                    totalMwh: totalMwhDevisionWithLoss,
                });
                ScheduleSubmission.update({_id:scheduleData[0]._id,
                }, {
                    $set: {
                        applied_loss: stuLossVar,
                        jsonWithLoss:revisionWithLoss
                    }
                });
                console.log('Loss data updated after stu loss submission is for id: '+scheduleData[0]._id);
              }
              dateArr.push(myObject);
              date.setDate(date.getDate() + 1);
          }
        }
        return returnSuccess("STU loss submitted!");
    }
    else {
      // data insert in log Details collection
      var stuData = StuCharges.find({month:month,year:year,state:state}).fetch();
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      LogDetails.insert({
          ip_address:ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          log_type: state+' STU loss updated',
          template_name: 'stuChargesDetails',
          event_name: 'STUChargesForm',
          timestamp: new Date(),
          action_date:todayDate,
          before_update: stuData[0],
          after_update: {stuRate:newCharge}
      });
      StuCharges.update({month:month,year:year,state:state}, {$set:{'stuRate':newCharge}});
      return returnSuccess("STU loss updated");
    }
  }
});

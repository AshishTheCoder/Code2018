Meteor.methods({
    saveReaValues(reaJson) {
      console.log(reaJson);
        var dbJson = ReaMonthly.find({
            discom_state: reaJson.discom_state,
            spd_state: reaJson.spd_state,
            month: reaJson.month,
            year:reaJson.year
        }).fetch();
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        if (dbJson.length>0) {
          // data insert in log Details collection
          var dataRea = ReaMonthly.find({discom_state: reaJson.discom_state,spd_state: reaJson.spd_state,month: reaJson.month,year:reaJson.year}).fetch();
          LogDetails.insert({
              ip_address:ipArr,
              user_id: Meteor.userId(),
              user_name: Meteor.user().username,
              log_type: reaJson.discom_state+' REA value updated',
              template_name: 'submitRea',
              event_name: 'saveReaMonthly',
              timestamp: new Date(),
              action_date:todayDate,
              before_update: dataRea[0],
              after_update:reaJson.rea
          });
          ReaMonthly.update({
            discom_state: reaJson.discom_state,
            spd_state: reaJson.spd_state,
            month: reaJson.month,
            year:reaJson.year
          }, {
              $set: {
                  'rea': reaJson.rea
              }
          });
          return returnSuccess("REA Updated");
        }else {
          ReaMonthly.insert(reaJson);
          // data insert in log Details collection
          LogDetails.insert({
              ip_address:ipArr,
              user_id: Meteor.userId(),
              user_name: Meteor.user().username,
              log_type: reaJson.discom_state+' REA values submitted',
              template_name: 'submitRea',
              event_name: 'saveReaMonthly',
              timestamp: new Date(),
              action_date:todayDate,
              rea_json: reaJson,
          });
          return returnSuccess("Rea Submitted");
      }
    },
    checkReaValue(reaJson){
      var dbJson = ReaMonthly.find({
          discom_state: reaJson.discom_state,
          spd_state: reaJson.spd_state,
          month: reaJson.month,
          year:reaJson.year
      }).fetch();
      if (dbJson.length>0) {
        console.log(reaJson);
        console.log("...........................");
        console.log(dbJson[0].rea);
        return returnSuccess("REA Retrived",dbJson[0].rea);
      }else {
        return returnFaliure("No data Available");
      }
    }
})

Meteor.methods({
    "saveDiscumprofileform": function (json) {
      Discom.insert(json);
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      //insert data in log details
      LogDetails.insert({
          ip_address:ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          log_type: 'Discom Profile Added',
          template_name: 'discom',
          event_name: 'discumprofileform',
          timestamp: new Date(),
          action_date:todayDate,
          json:json
      });
      return returnSuccess('Data Inserted');
    },
    "spdListForSelection":function(){
      var spdVar = Meteor.users.find().fetch();
      var spdNames = [];
      spdVar.forEach(function(item) {
          if (item.profile.user_type == 'spd' && item.profile.status == 'approved') {
              spdNames.push({
                  id: item._id,
                  names: item.profile.registration_form.name_of_spd,
                  state: item.profile.registration_form.spd_state,
                  transaction_type:item.profile.registration_form.transaction_type
              });
          }
      });
      return returnSuccess('SPDs List',spdNames);
    }
});

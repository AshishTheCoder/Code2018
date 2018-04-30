Meteor.methods({
    gettingSPDandDiscomData(selectedRadioData){
      var json = '';
      var ar = '';
      if(selectedRadioData == 'discom'){
         var data = Discom.find().fetch();
        if(data.length > 0){
          json = data;
          // sorting SPD Name, Alphabetically in array
          var jsonGot = data;
          var ar = jsonGot.sort(function(a, b) {
              var nA = a.nameof_buyingutility.toLowerCase();
              var nB = b.nameof_buyingutility.toLowerCase();
              if (nA < nB)
                  return -1;
              else if (nA > nB)
                  return 1;
              return 0;
          });
        }
      }else if(selectedRadioData == 'spd'){
        var data = Meteor.users.find({
            'profile.user_type': 'spd',
            'profile.status': 'approved'
        }).fetch();
        if(data.length > 0){
          json = data;
          // sorting SPD Name, Alphabetically in array
          var jsonGot = data;
          var ar = jsonGot.sort(function(a, b) {
              var nA = a.profile.registration_form.name_of_spd.toLowerCase();
              var nB = b.profile.registration_form.name_of_spd.toLowerCase();
              if (nA < nB)
                  return -1;
              else if (nA > nB)
                  return 1;
              return 0;
          });
        }
      }
      return returnSuccess("Getting User Profile by Admin",ar);
    },
    "callValueSpd": function(type, id) {
        if (type == "showForm") {
            var data = Meteor.users.find({
                _id: id
            }).fetch();
            var toReturn = data[0].profile.registration_form;
            return returnSuccess('SPD profile seen by Admin', toReturn);
        } else {
            console.log('Admin want to remove this id from spd -', id);
            return returnSuccess("User deleted");
        }
    },
    // use only for remove discom
    "callValueDiscom": function(type, id) {
        if (type == "showForm") {
            var data = Discom.find({
                _id: id
            }).fetch();
            var returnData = data[0];
            return returnSuccess('Discom profile seen by Admin', returnData);
        } else {
            console.log('Admin want to remove this id from discom -', id);
            Discom.remove(id);
            return returnSuccess("User deleted");
        }
    },
    "updateDiscom": function(id, json) {
        // used for insert log data
        var DiscomData = Discom.find({
            _id: id
        }).fetch();
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            spd_id: id,
            log_type: 'Discom Profile Updated',
            template_name: 'users_profile',
            event_name: 'updateDiscom',
            timestamp: new Date(),
            action_date:todayDate,
            profile_before_update: DiscomData[0],
            profile_after_update: json
        });
        Discom.update({
            _id: id
        }, {
            $set: json
        });
        return returnSuccess("Updated Discom");
    },
    "updateSpd": function(id, json) {
        // used for insert log data
        var SPDdata = Meteor.users.find({
            _id: id
        }).fetch();
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            spd_id: id,
            log_type: 'SPD Profile Updated',
            template_name: 'users_profile',
            event_name: 'updateSpd',
            timestamp: new Date(),
            action_date:todayDate,
            profile_before_update: SPDdata[0].profile.registration_form,
            profile_after_update: json
        });
        Meteor.users.update({
            _id: id
        }, {
            $set: {
                'profile.registration_form': json
            }
        });
        return returnSuccess("User details Updated");
    }
});

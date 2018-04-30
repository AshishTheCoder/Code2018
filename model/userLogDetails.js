Meteor.methods({
    returnUsersName: function(json) {
      if (json == 'spd') {
        var checkArr = Meteor.users.find({
            'profile.status': 'approved',
            'profile.user_type': json
        }).fetch();

        var dataArr = checkArr.sort(function(a, b) {
            var nA = a.profile.registration_form.name_of_spd.toLowerCase();
            var nB = b.profile.registration_form.name_of_spd.toLowerCase();
            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });

      }else {
        var dataArr = Meteor.users.find({
            'profile.status': 'approved',
            'profile.user_type': json
        }).fetch();

      }
        // console.log(dataArr);
        return dataArr;
    },
    returnLogDetails: function(json) {
        var jsons = LogDetails.find({
            user_id: json.userId,
            action_date: json.date
        }).fetch();
        if (jsons.length > 0) {
            return returnSuccess("Getting log details of users", jsons);
        } else {
            return returnFaliure("Log Details Not Found !");
        }
    }
})

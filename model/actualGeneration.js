Meteor.methods({
    saveActualGeneration(json, date) {
        var data = JmrDaily.find({
            clientId: Meteor.userId(),
            date: date
        }).fetch();
        if (data.length > 0) {
          console.log("Actual Generation already submitted for " + date+' '+Meteor.user().profile.registration_form.name_of_spd);
          return returnFaliure("Actual Generation already submitted for " + date);
        } else {
          var ip= this.connection.httpHeaders['x-forwarded-for'];
          var ipArr = ip.split(',');
            JmrDaily.insert(json);
            LogDetails.insert({
                id_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: 'Daily Actual Generation Submitted',
                template_name: 'actual_Generation',
                event_name: 'submitJmr',
                action_date: moment().format('DD-MM-YYYY'),
                timestamp: new Date(),
                json: json
            });
            return returnSuccess("Actual Generation successfully submitted for " + date+' '+ Meteor.user().profile.registration_form.name_of_spd);
        }
    },
});

Meteor.methods({
    "secilRegistrationFormDetails": function(secilRegistrationDetails) {
        if (validateJson(secilRegistrationDetails) === true) {
            Meteor.users.update({
                _id: Meteor.userId()
            }, {
                $set: {
                    "profile.registration_form": secilRegistrationDetails
                }
            });
            // data insert in log Details collection
            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: 'SPD Registration Form',
                template_name: 'secilRegistrationForm',
                event_name: 'secilRegForm',
                timestamp: new Date(),
                action_date: todayDate,
                profile_registration_form: secilRegistrationDetails
            });
            Meteor.call("SeciRegistrationMailSent");
            return returnSuccess('Form successfully submitted! '+ Meteor.user().username);
        } else {
            return returnFaliure('All Fields Are Required ');
        }
    },
    "SeciRegistrationMailSent": function() {
        var email = ["seci.scheduling@gmail.com"];
        var message = "Dear Sir/Ma'am,<br><br>SPD "+Meteor.user().profile.registration_form.name_of_spd+" is registered, waiting for approval by Admin,<br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        for (var i = 0; i < email.length; i++) {
            Meteor.call("sendMandrillEmail", email[i], "New Registration of SPD", message);
        }
    }
});

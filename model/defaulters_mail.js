Meteor.methods({
    "makeDefaultersList": function() {
        var date = moment().add(1, 'days');
        var tommorow = moment(date).format('DD-MM-YYYY');
        var defaultArray = [];
        var submitArray = [];
        var allUsers = Meteor.users.find({
            'profile.user_type': "spd"
        }).fetch();

        allUsers.forEach(function(item) {
            var result = ScheduleSubmission.find({
                clientId: item._id,
                date: tommorow
            }).fetch();
            if (result.length > 0) {
                submitArray.push(item._id);
            } else {
                if (item.profile.registration_form) {
                    if (item.profile.registration_form.transaction_type == 'Inter' && item.profile.status == 'approved') {
                        defaultArray.push({
                            id: item._id,
                            name: item.profile.registration_form.name_of_spd,
                            email: item.username
                        });
                    }
                }
            }
        })

        if (defaultArray.length > 0) {
            var insertJson = {
                date: tommorow,
                users: defaultArray
            };
            var myTest = DefaultersList.find({
                date: tommorow
            }).fetch();
            if (myTest.length > 0) {
                console.log("Database already have defaulters of current date");
            } else {
                DefaultersList.insert(insertJson);
                var currentDate = new Date();
                var todayDate = moment(currentDate).format('DD-MM-YYYY');
                // used for insert log data
                LogDetails.insert({
                    log_type: 'Defaulters List',
                    template_name: 'defaultersMail',
                    event_name: 'called on render',
                    collection_name: 'DefaultersList',
                    timestamp: new Date(),
                    action_date:todayDate,
                    json: insertJson
                });
                console.log("Inserted list");
                ///// mailing 10:30 this module will run//////
                Meteor.call("callDefaultersArray");
            }
            return returnSuccess("defaulters array called");
        }else {
          console.log("Not found any defaulters to Insert");
        }

    },
    "callDefaultersArray": function() {
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');

        var data = moment().add(1, 'days');
        var tommorow = moment(data).format('DD-MM-YYYY');

        var list = DefaultersList.find({
            date: tommorow
        }).fetch();
        if (list.length > 0) {
            console.log("Entered in sending mail module");
            var myList = list[0].users;
            var email=[];
            list[0].users.forEach(function (item) {
              email.push({email:item.email,name:item.name});
            });
            var message = "Dear Sir/Ma'am,<br><br>Please submit your schedule for the date of " + tommorow + " <br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            // var email = ["neeraj@cybuzzsc.com"];
            for (var i = 0; i < email.length; i++) {
              var subject = "Schedule Submission Request by [SECI] to "+ email[i].name;
                var emailLog = EmailLogs.find({
                    date: tommorow,
                    email: email[i]
                }).fetch();
                if (emailLog.length == 0) {
                  console.log("sending mail Inserted");
                    Meteor.call("sendMandrillEmail", email[i].email, subject, message, function(error, result) {
                        if (error) {
                            var ErrorJson = {
                                email: email[i],
                                message: message,
                                status: "false",
                                log: error,
                                date: tommorow,
                                timeStamp: new Date()
                            };
                            EmailLogs.insert(ErrorJson);
                            // used for insert log data
                            LogDetails.insert({
                                log_type: 'Defaulters List',
                                template_name: 'defaultersMail',
                                event_name: 'called on render',
                                collection_name:'EmailLogs',
                                timestamp: new Date(),
                                action_date:todayDate,
                                json:ErrorJson,
                            });
                        } else {
                            if (result.message == "sent") {
                                var SentJson = {
                                    email: email[i],
                                    message: message,
                                    status: "true",
                                    date: tommorow,
                                    log: result,
                                    timeStamp: new Date()
                                }
                                EmailLogs.insert(SentJson);
                                // used for insert log data
                                LogDetails.insert({
                                    log_type: 'Defaulters List',
                                    template_name: 'defaultersMail',
                                    event_name: 'called on render',
                                    collection_name:'EmailLogs',
                                    status:'email sent',
                                    timestamp: new Date(),
                                    action_date:todayDate,
                                    json:SentJson
                                });
                            } else {
                                var ErrorJson = {
                                    email: email[i],
                                    message: message,
                                    status: "false",
                                    date: tommorow,
                                    log: result,
                                    timeStamp: new Date()
                                };
                                EmailLogs.insert(ErrorJson);
                                // used for insert log data
                                LogDetails.insert({
                                    log_type: 'Defaulters List',
                                    template_name: 'defaultersMail',
                                    event_name: 'called on render',
                                    collection_name:'EmailLogs',
                                    timestamp: new Date(),
                                    action_date:todayDate,
                                    json:ErrorJson
                                });
                            }
                        }
                    })
                }else {
                  console.log("All mails already send");
                }
            }
            return returnSuccess("List of defaulters");
        } else {
            console.log("no data available to send mail");
        }
    }
});

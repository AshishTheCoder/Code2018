Meteor.methods({
    gettingLossForSPD(selectedDateForScheduleSubmission) {
      // var userId = Meteor.userId();
      // var userData = Meteor.users.find({_id:userId}).fetch();
      // var spdStateVar = userData[0].profile.registration_form.spd_state;
        var spdStateVar = Meteor.user().profile.registration_form.spd_state;
        var splitDate = selectedDateForScheduleSubmission.split('-');
        var stateSTUvar = StuCharges.find({
            month: splitDate[1],
            year: splitDate[2],
            state: spdStateVar
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        if (stateSTUvar.length > 0) {
            var stuLoss = stateSTUvar[0].stuRate;
        }else{
            var stuLoss = 0;
        }
        console.log('Getting loss for the date of ' + selectedDateForScheduleSubmission + ' Schedule Submission, loss is ' + stuLoss);
        return returnSuccess('Getting Loss for SPD ID: ' + Meteor.userId(), stuLoss);
    },
    "saveScheduleSubmission": function(date, revision, revisionWithLoss, stuLossVar) {
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        currentDate.setTime(currentDate.getTime());
        var hrs = currentDate.getHours();
        var min = currentDate.getMinutes();
        var time = (hrs + ":" + min);
        var n = time;
        var n1 = n.split('_');
        var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
        var json = {
            date: date,
            clientId: Meteor.userId(),
            schedule_submited_by: Meteor.user().profile.user_type,
            json: revision,
            jsonWithLoss: revisionWithLoss,
            applied_loss: stuLossVar,
            actual_revision_time: time,
            current_date_timestamp: new Date(),
            timestamp: new Date()
        };
        var checkSchedule = ScheduleSubmission.find({date: date, clientId: Meteor.userId()}).fetch();
        if (checkSchedule.length > 0) {
            return returnFaliure('Schedule already submitted!');
        } else {
            ScheduleSubmission.insert(json);
            // for defaulters list update
            var defaulterData = DefaultersList.find({date: date}).fetch();
            if (defaulterData.length > 0) {
                var defaultersArr = [];
                defaulterData[0].users.forEach(function(item) {
                    if (item.id == Meteor.userId()) {} else {
                        defaultersArr.push({id: item.id, name: item.name, email: item.email});
                    }
                });
                // updating defaulters collection to remove from defulters list after submition of schedule
                DefaultersList.update({
                    _id: defaulterData[0]._id
                }, {
                    $set: {
                        users: defaultersArr
                    }
                });
            }
            // sending email to spd and seci for the conformation mail of schedule submission
            var mailStatus = '';
            if (Meteor.user().username) {
                var spdName = Meteor.user().profile.registration_form.name_of_spd;
                var email = Meteor.user().username;
                var subject = 'Schedule Submitted by ' + spdName + ' for ' + date;
                var message = "Dear Sir/Ma'am,<br><br>Your <b>REV-0</b> schedule has been submitted for the date of " + date + "" +"<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
                Meteor.call("sendMandrillEmail", email, subject, message);
                mailStatus = 'Sent';
                console.log('Schedule submitted, email sent to spd');
            } else {
                mailStatus = 'Error, email not sent';
            }
            // data insert in log Details collection
            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                schedule_submited_by: Meteor.user().profile.user_type,
                log_type: 'Schedule Submitted',
                template_name: 'scheduleSubmission',
                event_name: 'submitDayForm',
                schedule_date: date,
                email_status: mailStatus,
                timestamp: new Date(),
                action_date: todayDate,
                json: json,
                applied_loss: stuLossVar,
                jsonWithLoss: revisionWithLoss
            });
            return returnSuccess('Schedule Submitted');
        }
    },
    "sameAsSubmitSchedule": function(date) {
        var data = ScheduleSubmission.find({clientId: Meteor.userId(), date: date}).fetch();
        if (data.length > 0) {
            return returnSuccess('Successs same as Available', data[0].json[0].data);
        } else {
            return returnFaliure('Schedule not submitted for '+date);
        }
    },
    callViewSchedule(date) {
        var view = ScheduleSubmission.find({clientId: Meteor.userId(), date: date}).fetch();
        if (view.length > 0) {
            view[0].json[0].data[0].date = date;
            var jsonData = view[0].json[0].data;
            view[0].json[0].data[0].totalMwh = view[0].json[0].totalMwh;
            view[0].json[0].data[0].totalAvaibility = view[0].json[0].totalAvaibility;
            var toReturn = {
                jsonData: jsonData,
                userData: Meteor.user().profile.registration_form
            }
            return returnSuccess('Schedule view By SPD: ' + Meteor.userId(), toReturn);
        } else {
            return returnFaliure('Schedule not subitted for '+date);
        }
    }
});

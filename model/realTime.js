import {
    HTTP
} from 'meteor/http';
Meteor.methods({
      gettingPaymentNoteStatus(ids){
        if (ids) {
          EprocessingFileStatus.update({_id:ids}, {$set: {hidden: true}});
        }
        var userName = Meteor.user().username;
        var levelNumber = Meteor.user().profile.registration_form.levelNumber
        // let data = EprocessingFileStatus.find({username: userName, forward_to_level: levelNumber, status:'Rejected', hidden: false}).fetch();
        let data = EprocessingFileStatus.find({username: userName, forward_to_level: levelNumber, status:'Rejected', deleted_status: false, hidden: false}, {sort: {$natural: -1}, limit:10}).fetch();
        return returnSuccess('Getting Payment Note Status', data);
      },
      updateAlert(toInsert){
        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: {
                'profile.alert': toInsert
            }
        });
        return returnSuccess('Success');
      },
      updateExceedJmrData(toInsert){
        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: {
                'profile.exceedJmrData': toInsert
            }
        });
        return returnSuccess('Extra energy request accepted');
      },
    "SendIndividualMailToDefaulters": function(txtEmailToVar, txtCurrentDateVar, txtEmailSubjectVar, txtEmailMessageVar) {
        var subject = txtEmailSubjectVar;
        var email = txtEmailToVar;
        // var email = "neeraj@cybuzzsc.com";
        var message = "Dear Sir/Ma'am,<br><br>" + txtEmailMessageVar + "<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        Meteor.call("sendMandrillEmail", email, subject, message);
        return returnSuccess('Email Sent');
    },
    "callViewUser": function(id) {
        var data = Meteor.users.find({
            _id: id
        }).fetch();
        var toReturn = data[0].profile.registration_form;
        return returnSuccess('Unapproved user profile seen by Admin', toReturn);
    },
    "callApproveUser": function(id) {
        Meteor.users.update({
            _id: id
        }, {
            $set: {
                'profile.status': "approved"
            }
        });
        // used for insert log data
        var approvedSPDdata = Meteor.users.find({
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
            log_type: 'SPD Registration Request Approved',
            template_name: 'realtime',
            event_name: 'approveUser',
            timestamp: new Date(),
            action_date:todayDate,
            status: "approved",
            spd_data: approvedSPDdata[0]
        });
        var userData = Meteor.users.find({
            _id: id
        }).fetch();
        if (userData.length > 0) {
            var subject = 'Registration request';
            var message = "Dear Sir/Ma'am,<br><br>Your request for SPD registration has been accepted by Admin(SECI).<br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            var email = userData[0].username;
            Meteor.call("sendMandrillEmail", email, subject, message);
        }
        return returnSuccess("User successfully approved!");
    },
    "callRejectUser": function(id) {
        // used for insert log data
        var rejectedSPDdata = Meteor.users.find({
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
            log_type: 'SPD Registration Request Rejected',
            template_name: 'realtime',
            event_name: 'rejectUser',
            timestamp: new Date(),
            action_date:todayDate,
            status: "rejected",
            spd_data: rejectedSPDdata[0]
        });
        var userData = Meteor.users.find({
            _id: id
        }).fetch();
        if (userData.length > 0) {
            var subject = 'Registration request';
            var message = "Dear Sir/Ma'am,<br><br>Your request for SPD registration has been rejected by Admin(SECI)<br><b>Note: Once you are rejected by admin, you need to signup again for SPD registration.</b><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            var email = userData[0].username;
            Meteor.call("sendMandrillEmail", email, subject, message);
        }
        Meteor.users.remove(id);
        return returnSuccess("User successfully rejected!");
    },
    "callViewChangeCredentials": function(id) {
        var data = ChangeCredential.find({
            _id: id
        }).fetch();
        var toReturn = data[0].values;
        var count = 1;
        toReturn.forEach(function(item) {
            item.count = count;
            count++;
        });
        return returnSuccess('Unapproved change request seen by Admin', toReturn);
    },
    "callApproveChange": function(clientId, id) {
        var changeData = ChangeCredential.find({
            _id: id
        }).fetch();
        var changeDataList = changeData[0].values;
        changeDataList.forEach(function(item) {
            var json = {};
            var change = item.field_to_change;
            json["profile.registration_form." + change] = item.new_data;
            Meteor.users.update({
                _id: clientId
            }, {
                $set: json
            });
        });
        // used for insert log data
        var approveChangeRequest = ChangeCredential.find({
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
            spd_id: clientId,
            log_type: 'SPD Change Request Approved',
            template_name: 'realtime',
            event_name: 'approveChange',
            timestamp: new Date(),
            action_date:todayDate,
            change_request_status: "approved",
            change_request: approveChangeRequest[0].values,
        });
        ChangeCredential.update({
            _id: id
        }, {
            $set: {
              status:'Approved',
              approval_date:moment().format('DD-MM-YYYY'),
              approval_by_id:Meteor.userId(),
              approval_by:Meteor.user().username,
              approval_timestamp:new Date()
            }
        });
        return returnSuccess("Change request approved!");
    },
    "callRejectChange": function(clientId, id) {
        // used for insert log data
        var rejectedChangeRequest = ChangeCredential.find({
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
            spd_id: clientId,
            log_type: 'SPD Change Request Rejected',
            template_name: 'realtime',
            event_name: 'rejectChange',
            timestamp: new Date(),
            action_date:todayDate,
            change_request_status: "rejected",
            change_request: rejectedChangeRequest[0].values,
        });
        ChangeCredential.update({
            _id: id
        }, {
            $set: {
              status:'Rejected',
              approval_date:moment().format('DD-MM-YYYY'),
              approval_by_id:Meteor.userId(),
              approval_by:Meteor.user().username,
              approval_timestamp:new Date()
            }
        });
        return returnSuccess("Change request rejected!");
    },

    "callDefaulterList": function() {
        var dateToday = moment();
        var tomorrow = dateToday.add(1, 'days');
        var tomorrowDate = moment(tomorrow).format("DD-MM-YYYY");

        var today = new Date();
        var todayMoment = moment(today).format('DD-MM-YYYY');

        today.setTime(today.getTime());
        var hrs = today.getHours();
        var min = today.getMinutes();
        var timeGet = (hrs + ":" + min);
        var nTime = timeGet;
        var timeSet = nTime.split('_');
        var time = am_pm_to_hours(timeSet[0] + ':' + timeSet[1] + ' ' + timeSet[2]);
        // var submitArray = [];
        if (time > '10:30') {
            /////////////checking defaulters list after sync crone//////
            var defaultArray = [];
            var defaultList = DefaultersList.find({
                date: tomorrowDate
            }).fetch();
            if (defaultList.length > 0) {
                  defaultList[0].users.forEach(function(item) {
                    defaultArray.push(item);
                })
            }
            return returnSuccess("defaulters called", defaultArray);
        }else{
          return returnFaliure('Defaulters not called');
        }
    },

    rejectExtraEnergyRequest(userId, month, year, toInsert) {
        Jmr.update({
            userId: userId,
            month: month,
            year: year
        }, {
            $set: {
                'exceedEnergy': "0",
                'exceedAmount': '0'
            }
        });
        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: {
                'profile.exceedJmrData': toInsert
            }
        });
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        // used for insert log data
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            spd_id: userId,
            log_type: 'Exceed extra energy request',
            template_name: 'realtime',
            event_name: 'removeExtraJmr',
            timestamp: new Date(),
            action_date:todayDate,
            in_jmr_exceedEnergy: "0",
            in_jmr_exceedAmount: '0',
            in_user_profile: toInsert
        });
        return returnSuccess("Jmr on admin request updated!");
    }
});

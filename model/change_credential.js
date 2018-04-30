Meteor.methods({
    "callOptionValues":function(mydata){
      var data=Meteor.users.find({_id:Meteor.userId()}).fetch();
      var getData=data[0].profile.registration_form[mydata];
      return returnSuccess('data got',getData);
    },
    "submitRequest":function (sendData) {
      var checkSECIHoliday = checkSECIholidaysORWeakEnd();
      if (checkSECIHoliday != 'holiday' && checkSECIHoliday != 'weakend') {
        var insert={
          clientId:Meteor.userId(),
          values:sendData,
          request_date:moment().format('DD-MM-YYYY'),
          status:'Pending',
          approval_date:'',
          timestamp:new Date()
        };
        ChangeCredential.insert(insert);
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        // used for insert log data
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name:Meteor.user().username,
            log_type: 'SPD Change Request',
            template_name: 'change_credential',
            event_name: 'submit_request',
            timestamp: new Date(),
            action_date:todayDate,
            data:insert
        });
        return returnSuccess('Request send');
      }else {
        return returnFaliure("Today is "+checkSECIHoliday+", that's why request can not be submit today!");
      }
    },
    "callCheckPreValue":function () {
      var userData=ChangeCredential.find({clientId:Meteor.userId()}).fetch();
      if(userData.length>0){
        return returnSuccess('Data already available',true);
      }else {
        return returnSuccess('can send request',false);
      }
    }
});

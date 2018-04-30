Meteor.publish('UserList', function () {
    return Meteor.users.find({});
});
Meteor.publish('TimeBlockDetails', function () {
    return TimeBlock.find({});
});
Meteor.publish('SchemesDetails', function () {
    return Schemes.find({});
});
Meteor.publish('ShowRevisionsData',function(){
 return ScheduleSubmission.find({revision_status:'revised'}, {sort: {current_date_timestamp: -1},limit:100});
});
Meteor.publish('ChangeCredentialDetails', function () {
    return ChangeCredential.find();
});
Meteor.publish('SeciHolidaysPublish', function () {
    return SeciHolidaysDetails.find();
});
Meteor.publish('ModuleListsPublish', function () {
    return ModuleLists.find();
});
Meteor.publish('FetchStatusDetails', function (id) {
    return FetchStatus.find({_id:id});
});
Meteor.publish('ScheduleSubmitDetails', function(match, clientId) {
    return ScheduleSubmission.find({'date': match, clientId: clientId});
});
Meteor.publish('StuChargesDetails', function() {
    var myDate = moment().add(1, 'months');
    var duedate = myDate.format('DD-MM-YYYY');
    var newDate = duedate.split("-");
    var nextMonth = newDate[1];
    var yearVar = newDate[2];
    return StuCharges.find({month:nextMonth,year:yearVar});
});

Meteor.users.find({ "status.online": true }).observe({
  added: function(id) {
    // id just came online
    OnlineUsers.insert({userid:id._id,username:id.username,online:true,loginTime:new Date(),logoutTime:'Active',status:id.status,timestamp:new Date()});
  },
  removed: function(id) {
    // id just went offline
    var checkUser = OnlineUsers.find({userid:id._id},{sort: {$natural:-1}}).fetch();
    if (checkUser.length > 0) {
      OnlineUsers.update({_id:checkUser[0]._id},{$set:{online:false,logoutTime:new Date()}});
    }
  }
});

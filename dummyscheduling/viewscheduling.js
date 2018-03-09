Template.viewschedule.helpers({
  userschedules:function() {

    // var userid=Meteor.userId();
    var schedule=Schedule.find({});
    return schedule;
  },
  // username:function() {
  //   if(!Meteor.user())
  //   {console.log("u r not logged in");}
  //   else {
  //     var username=Meteor.user().username;
  // console.log(username);
  //   }
  // }
});

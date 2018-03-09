Template.dashboards.onCreated(function () {
  this.newdate = new ReactiveVar;
});

Template.dashboards.events({
  "submit .form-horizontal":function(event) {
    var s1=$('#s1').val();
    var s2=$('#s2').val();
    var s3=$('#s3').val();
    var date=$('#date').val();
  //  console.log(s1+""+s2+"s3:-"+s3);
  // var username=Meteor.user().name;
  // console.log(username);


    if(s1||s2||s3)
    {
 Meteor.call('addschedule',s1,s2,s3);
console.log(s1+""+s2+"s3"+s3);
   alert("schedule submitted");
 }
  else {
  alert("something went wrong!!!!!......")
}
 return false;

},
"click .logout":function(event){
  Meteor.logout(function(err){
    if(err){
    alert("something went wrong");
    }
    else {
      Router.go('/user1');
      alert("U r logged out");
    }
})
},
// $(function() {
//     $('input[name="#date1"]').daterangepicker();
// });
"input #date1":function(event,tmpl) {
  var date=$('#date1').val();
  //  = tmpl.newdate.get();
  var currentdate= tmpl.newdate.set(date);

      //console.log(currentdate);
}
});
Template.dashboards.helpers({
  username:function() {
//alert("success");// wait
console.log('--------------------------!!!!');
console.log(Meteor.user());
    if(!Meteor.user()){
    console.log("u r not logged in");
    return false;
  }else {
    var username= Meteor.user().username;
    console.log(username);
    console.log('Hello, Mr. '+username);
    return username;
    }
  },
  date: function() {
    console.log(Template.instance().newdate.get());
      return Template.instance().newdate.get();
    }
});

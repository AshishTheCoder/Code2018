// Template.uploadForm.onCreated(function () {
//   this.currentFile = new ReactiveVar(false);
// });
// 
// Template.uploadForm.helpers({
//
// });

Template.uploadForm.events({
  "submit .form-horizontal":function (event) {
    var stuclass=event.target.stuclass.value;
    var username=event.target.username.value;
    var father=event.target.father.value;
    var age=event.target.age.value;
    var gender=event.target.gender.value;
    var email=event.target.email.value;
   var mob=event.target.mob.value;

console.log(stuclass+""+username+""+father+""+age+""+gender+""+email+""+mob);
   Meteor.call('addstudents',stuclass,username,father,age,gender,email,mob);
   alert("Details are submitted");
}
});

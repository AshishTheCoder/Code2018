Template.discomentry.events({
"submit .form-horizontal":function() {
  var usersname=event.target.usersname.value;
  var shortname=event.target.shortname.value;
  var ltoa=event.target.ltoa.value;
  var psa=event.target.psa.value;
  var issuebank=event.target.issuebank.value;
  var minenergy=event.target.minenergy.value;
  var maxenergy=event.target.maxenergy.value;
  var discomstate=event.target.discomstate.value;
  var gst=event.target.gst.value;
  // if (isNotEmpty(usersname)&) {
  //
  // }
  Meteor.call('adddiscom',usersname,shortname,ltoa,psa,issuebank,minenergy,maxenergy,discomstate,gst);

console.log(usersname,shortname,ltoa,psa,issuebank,minenergy,maxenergy,discomstate,gst);
alert("DISCOM is added");
event.target.usersname.value="";
event.target.shortname.value="";
event.target.ltoa.value="";
event.target.psa.value="";
event.target.issuebank.value="";
event.target.minenergy.value="";
event.target.maxenergy.value="";
event.target.discomstate.value="Select type";
event.target.gst.value="";
event.preventDefault();

//Router.go("/entry")
}
});



//
// //
// var isNotEmpty=function(value){
//   if(value&&value!=='')
//   {
//   return true;
// }
// alert("Please fill in all fields");
// return false;
// };

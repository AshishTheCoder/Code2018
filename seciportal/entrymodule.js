
Template.entrymodule.onCreated(function () {
  this.user1 = new ReactiveVar;
});
Template.entrymodule.events({
  "change input":function(event, template) {
      // $("div .users").hide();
var getvalue = template.find('input:radio[name=user]:checked').value;
    //alert("You have selected"+getname);
var dd=template.user1.set(getvalue);
    console.log(getvalue);
  //  console.log(dd);
},});
Template.spdentry.events({
"submit .form-horizontal":function() {
  var usersname=event.target.usersname.value;
  var projectid=event.target.projectid.value;
  var projectcapacity=event.target.projectcapacity.value;
  var projectlocation=event.target.projectlocation.value;
  var contactdetails=event.target.contactdetails.value;
  var pannumber=event.target.pannumber.value;
  var bankdetails=event.target.bankdetails.value;
  var transactiontype=event.target.transactiontype.value;
  var spdstate=event.target.spdstate.value;
  var ndcr=event.target.ndcr.value;
  var address=event.target.address.value;

Meteor.call('addspd',usersname,projectid,projectcapacity,projectlocation,contactdetails,pannumber,bankdetails,transactiontype,spdstate,ndcr,address);
console.log(usersname,projectid,projectcapacity,projectlocation,contactdetails,pannumber,bankdetails,transactiontype,spdstate,ndcr,address);
alert("SPD is added");
event.target.usersname.value="";
event.target.projectid.value="";
event.target.projectcapacity.value="";
event.target.projectlocation.value="";
event.target.contactdetails.value="";
event.target.pannumber.value="";
event.target.bankdetails.value="";
event.target.transactiontype.value="Select type";
event.target.spdstate.value="Select State";
event.target.ndcr.value="Select type";
event.target.address.value="";
event.preventDefault();

//Router.go("/entry")
}
});
Template.entrymodule.helpers({
  "getname":function() {
  var username=Template.instance().user1.get();
console.log(username);
   return username;
 },
 "getspd":function() {
 var username=Template.instance().user1.get();
 console.log(username);

   return username === "SPD"

},
"getdiscom":function() {
var username1=Template.instance().user1.get();
  console.log(username1);
  return username1 === "DISCOM"
},

});

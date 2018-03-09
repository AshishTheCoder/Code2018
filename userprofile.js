Template.userprofile.onCreated(function () {
  this.user1 = new ReactiveVar;
});
Template.ViewSpd.onCreated(function () {

    this.userid = new ReactiveVar;
    this.userid1 = new ReactiveVar;
});
Template.ViewSpd.events({
  "click #view":function(event, template) {
  var id=this._id;
  var ddd=template.userid.set(id);
      //console.log(ddd+name);
  // Modal.show('ViewSpd')
  console.log(this._id);
    // console.log("hello");
  },
  "click #edit":function(event, instance) {
  var id=this._id;
  var dddd=instance.userid1.set(id);
  console.log('Hiiiiiiiiiiiiiiiiiiiiiiii');
  console.log(this._id);
},
"click #spdupdate":function (event, template) {
  var id= Template.instance().userid1.get();
  var usersname=$('#usersname').val();
  console.log('---------------------------------------');
  console.log(id);
  console.log(usersname);
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  var projectid=$('#projectid').val();
  var projectcapacity=$('#projectcapacity').val();
  var projectlocation=$('#projectlocation').val();
  var contactdetails=$('#contactdetails').val();
  var pannumber=$('#pannumber').val();
  var bankdetails=$('#bankdetails').val();
  var transactiontype=$('#transactiontype').val();
  var spdstate=$('#spdstate').val();
  var ndcr=$('#ndcr').val();
  var address=$('#address').val();
  console.log(id,usersname,projectid,projectcapacity,projectlocation,contactdetails,pannumber,bankdetails,transactiontype,spdstate,ndcr,address);

Meteor.call('updatespd',id,usersname,projectid,projectcapacity,projectlocation,contactdetails,pannumber,bankdetails,transactiontype,spdstate,ndcr,address);
console.log(id,usersname,projectid,projectcapacity,projectlocation,contactdetails,pannumber,bankdetails,transactiontype,spdstate,ndcr,address);
// alert("SPD profile is updated");
// event.preventDefault();

$('#editspd').modal('hide');

}
});
Template.userprofile.events({
  "change input":function(event, template) {
      // $("div .users").hide();
var getvalue = template.find('input:radio[name=user]:checked').value;
    //alert("You have selected"+getname);
var dd=template.user1.set(getvalue);
    //console.log(dd);
  //  console.log(dd);
},

});
Template.userprofile.helpers({
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







Template.ViewSpd.helpers({
  "getspddetails":function () {
    var userid1=Template.instance().userid.get();
    var getspddata=SPD.find({'_id':userid1}).fetch();
    console.log(getspddata);

    return getspddata;
  },
  "getdetails":function() {
    var getdata=SPD.find({}).fetch();
    return getdata;
  },

    "editspddetails":function () {
      var userid11=Template.instance().userid1.get();
      var editspddata=SPD.find({'_id':userid11}).fetch();
      console.log(editspddata);

      return editspddata;
    },

})

Template.ViewDiscom.onCreated(function () {

    this.userid = new ReactiveVar;
    this.userid1 = new ReactiveVar;
});
Template.ViewDiscom.events({
  "click #view":function(event, template) {
  var id=this._id;
  var ddd=template.userid.set(id);
      //console.log(ddd+name);
  // Modal.show('ViewSpd')
  console.log(this._id);
    // console.log("hello");
  },
  "click #edit":function(event, template) {
  var id=this._id;
    var dddd=template.userid1.set(id);
  console.log(this._id);
},
"click #discomupdate":function (event, template) {
  var id1= Template.instance().userid1.get();
  var usersname=$('#usersname').val();
  var shortname=$('#shortname').val();
  var ltoa=$('#ltoa').val();
  var psa=$('#psa').val();
  var issuebank=$('#issuebank').val();
  var minenergy=$('#minenergy').val();
  var maxenergy=$('#maxenergy').val();
  var discomstate=$('#discomstate').val();
  var gst=$('#gst').val();

console.log(id1,usersname,shortname,ltoa,psa,issuebank,minenergy,maxenergy,discomstate,gst);
Meteor.call('upadatediscom',id1,usersname,shortname,ltoa,psa,issuebank,minenergy,maxenergy,discomstate,gst);

alert("DISCOM profile is updated");
$('#editdiscom').modal('hide');

}
});
Template.ViewDiscom.helpers({
  "getdiscomdetails":function () {
    var userid1=Template.instance().userid.get();
    var getdiscomdata=DISCOM.find({'_id':userid1}).fetch();
    console.log(getdiscomdata);
    return getdiscomdata;
  },
  "getdetails":function() {
    var getdata=DISCOM.find({});
    return getdata;
  },

    "editdiscomdetails":function () {
      var userid11=Template.instance().userid1.get();
      var editdiscomdata=DISCOM.find({'_id':userid11}).fetch();
      console.log(editdiscomdata);

      return editdiscomdata;
    },

})

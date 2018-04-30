Meteor.methods({
  "gettigSPDListForAudit": function() {
      var json = Meteor.users.find({'profile.user_type':'spd','profile.status':'approved'}).fetch();
      return returnSuccess('Getting SPD list for audit ', json);
  },
  gettigSPDChangeRequestDetail(id){
    var json = ChangeCredential.find({clientId:id},{sort:{$natural: -1}}).fetch();
    if (json.length > 0) {
      return returnSuccess('Returning SPD Changes Details to Admin ', json);
    }else {
      return returnFaliure('Change Request Not Submitted!');
    }
  }
});

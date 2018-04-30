Meteor.methods({
  "hideHeaderAlertAndUpdateStatusChecked": function(scheduleId) {
    ScheduleSubmission.update({
        _id: scheduleId
    }, {
        $set: {
            status:'checked'
        }
    });
    return returnSuccess('Header alert hide and schedule status updated as checked!');
  }
});

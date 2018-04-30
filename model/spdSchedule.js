Meteor.methods({
    "radioScheduleStatusSPD": function(fromDate, toDate) {
        var array = [];
        fromDate = fromDate.split('-');
        toDate = toDate.split('-');
        fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
        toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        date1_unixtime = parseInt(fromDate.getTime() / 1000);
        date2_unixtime = parseInt(toDate.getTime() / 1000);
        var timeDifference = date2_unixtime - date1_unixtime;
        var timeDifferenceInHours = timeDifference / 60 / 60;
        var timeDifferenceInDays = timeDifferenceInHours / 24;

        if (timeDifferenceInDays > 0) {
            fromDate.setDate(fromDate.getDate());
            for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
                var details = ScheduleSubmission.find({
                    'clientId': Meteor.userId(),
                    'date': moment(fromDate).format('DD-MM-YYYY')
                }).fetch();
                fromDate.setDate(fromDate.getDate() + 1);
                if (details.length > 0) {
                    var check = {};
                    var myJson = details[0];
                    check.date = details[0].date;
                    check.id = details[0]._id;
                    array.push(check);
                }
                var count = 1;
                array.forEach(function(item) {
                    item.serialNO = count;
                    count++;
                });
            }
            return returnSuccess('Schedule view by: '+Meteor.userId(), array);
        }
    },
});

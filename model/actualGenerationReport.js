Meteor.methods({
  gettingDailyActualGenerationReport(timeDifferenceInDays,fromDate){
    fromDate.setDate(fromDate.getDate());
    var returnArr = [];
    for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
        var details = JmrDaily.find({clientId:Meteor.userId(), date: moment(fromDate).format('DD-MM-YYYY')}).fetch();
        fromDate.setDate(fromDate.getDate() + 1);
        if (details.length > 0) {
            returnArr.push(details[0]);
        }
    }
    return returnSuccess('SPD Checking Actual Generation Report',returnArr);
  }
});

Meteor.methods({
  getingspdLogFilterReportingData(json){
    var type = json.type;
    var returnAllDataArr = [];
    var spdList = json.spdListArr;
    if (type == 'Financial Year' || type == 'Month') {
      var financialYear = json.financialYear;
      var monthArr = json.monthArr;
      spdList.forEach( function(spdId){
        var spdData = Meteor.users.find({_id:spdId}).fetch();
        monthArr.forEach( function(month) {
        var checkData = LogBookSpd.find({clientId:spdId,month:month,financial_year:financialYear}).fetch();
          checkData.forEach( function(item) {
            returnAllDataArr.push(item);
          });
        });
      });
    }else if (type == 'Payment Date') {
      var financialYear = json.financialYear;
      var monthArr = json.monthArr;
      spdList.forEach( function(spdId){
        fromDate = json.fromDate.split('-');
        toDate = json.toDate.split('-');
        fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
        toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        date1_unixtime = parseInt(fromDate.getTime() / 1000);
        date2_unixtime = parseInt(toDate.getTime() / 1000);
        var timeDifference = date2_unixtime - date1_unixtime;
        var timeDifferenceInHours = timeDifference / 60 / 60;
        var timeDifferenceInDays = timeDifferenceInHours / 24;
        if (timeDifferenceInDays >= 0) {
            fromDate.setDate(fromDate.getDate());
            for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
                var loopDate = moment(fromDate).format('DD-MM-YYYY');
                var checkData = LogBookSpd.find({clientId:spdId, dateOfPayment:loopDate}).fetch();
                  checkData.forEach( function(item) {
                    returnAllDataArr.push(item);
                  });
                fromDate.setDate(fromDate.getDate() + 1);
            }
        }
      });
    }
    return returnSuccess('Getting SPD Log Book Data', returnAllDataArr);
  }
});

Meteor.methods({
    'getScheme': function() {
        var discomNameVar = [];
        var data = Schemes.find().fetch();
        data.forEach(function(item) {
            discomNameVar.push({
                discomSchemeId: item._id,
                discomScheme: item.scheme
            });
        });
        var ar = discomNameVar.sort(function(a, b) {
            var nA = a.discomScheme.toLowerCase();
            var nB = b.discomScheme.toLowerCase();
            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });
        return returnSuccess('Discom List Array', ar);
    },
    'getDiscomName': function(discomScheme) {
        var discomNameVar = [];
        var data = Discom.find({
            "scheme": discomScheme
        }).fetch();
        data.forEach(function(item) {
            discomNameVar.push({
                discomId: item._id,
                name: item.nameof_buyingutility
            });
        });
        var ar = discomNameVar.sort(function(a, b) {
            var nA = a.name.toLowerCase();
            var nB = b.name.toLowerCase();
            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });
        return returnSuccess('Discom List Array', ar);
    },
    'SaveMasterSheetForFirstTimeEntry': function(json) {
      var data =  MasterSheetEntry.find({month:json.month, financial_year: json.financial_year, discomId:json.discomId}).fetch();
      var result = 0;
      if (data.length > 0) {
        result = 1;
      }else {
        MasterSheetEntry.insert(json);
      }
      return returnSuccess('Checking data is all ready inserted or insert data', result);
    },
    'SaveMasterSheet': function(json) {
      MasterSheetEntry.insert(json);
      return returnSuccess('Data inserted again for the same month');
    },
    getMasterData(month, year){
      var masterSheetData = MasterSheetEntry.find({month:month,year:year,delete_status:false}).fetch();
      if(masterSheetData.length > 0){
        return returnSuccess('Data found',masterSheetData);
      }else{
        return returnFaliure('Data not found!');
      }
    },
    deleteMasterSheetData(id,month,year){
      var backupData = MasterSheetEntry.find({_id:id}).fetch();
      // creating log of deleted invoice
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      LogDetails.insert({
          ip_address: ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          user_type: Meteor.user().profile.user_type,
          log_type: 'MasterSheet Deleted',
          template_name: 'masterSheet',
          event_name: 'deleteMasterSheetData',
          timestamp: new Date(),
          action_date: todayDate,
          json: backupData[0],
      });
       MasterSheetEntry.update({
          _id:id
        },{
          $set : {
            delete_status:true,
            deleted_by_userid:Meteor.userId(),
            deleted_by_username:Meteor.user().username,
            deleted_timestamp:new Date()
          }
        });
        var returnData = MasterSheetEntry.find({month:month,financial_year:year,delete_status:false}).fetch();
      return returnSuccess('MasterSheet deleted!',returnData);
    }
});

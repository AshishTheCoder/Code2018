Meteor.methods({
  "gettingSPLDStateListUniq": function() {
      var stateArr = [];
      var jsonData = Meteor.users.find({'profile.user_type':'spd','profile.status':'approved'}).fetch();
      jsonData.forEach(function(item) {
          stateArr.push(item.profile.registration_form.spd_state);
      });

      var stateofSpd = _.uniq(stateArr);
      var returnStateArr = stateofSpd.sort(function(a, b) {
          var nA = a.toLowerCase();
          var nB = b.toLowerCase();
          if (nA < nB)
              return -1;
          else if (nA > nB)
              return 1;
          return 0;
      });
      return returnSuccess('Getting SPD list by Admin For JMR ', returnStateArr);
  },
  "gettingSPLDForJMRData": function(spdState) {
    var spdListArr = [];
    if (spdState == 'All') {
      var jsonData = Meteor.users.find({'profile.user_type':'spd','profile.status':'approved'}).fetch();
    }else {
      var jsonData = Meteor.users.find({'profile.user_type':'spd','profile.status':'approved','profile.registration_form.spd_state':spdState}).fetch();
    }
      jsonData.forEach(function(item) {
        var json = {spdId:item._id,spdName:item.profile.registration_form.name_of_spd,spdState:item.profile.registration_form.spd_state};
        spdListArr.push(json);
      });
      var returnSPDArr = spdListArr.sort(function(a, b) {
          var nA = a.spdName.toLowerCase();
          var nB = b.spdName.toLowerCase();
          if (nA < nB)
              return -1;
          else if (nA > nB)
              return 1;
          return 0;
      });
      return returnSuccess('Getting SPD list by Admin For JMR ',returnSPDArr);
  },
  getJMRDataMonthly(month,financialYear,type) {
    var data = Jmr.find({month:month,financial_year:financialYear,type:type,userId:Meteor.userId()}).fetch();
    if (data.length > 0) {
      return returnSuccess("Getting Data From JMR", data);
    }else {
      return returnFaliure(type+' Data Not Found!');
    }
  },
  getJMRDataMonthlyForAdmin(month,financialYear,spdState,spdName,type,spdId) {
    if (spdState == 'All') {
      if (spdName == 'All') {
        var data = Jmr.find({month:month,financial_year:financialYear,type:type}).fetch();
      }else {
        var data = Jmr.find({month:month,financial_year:financialYear,type:type,userId:spdId}).fetch();
      }
    }else {
      if (spdName == 'All') {
        var data = Jmr.find({month:month,financial_year:financialYear,type:type,userState:spdState}).fetch();
      }else {
        var data = Jmr.find({month:month,financial_year:financialYear,type:type,userState:spdState,userId:spdId}).fetch();
      }
    }
    if (data.length > 0) {
      var returnData = [];
      data.forEach(function(item) {
        var getSPDname = Meteor.users.find({_id:item.userId}).fetch();
        var jsonData = item;
        jsonData.spdName = getSPDname[0].profile.registration_form.name_of_spd;
        returnData.push(jsonData);
      });
      return returnSuccess("Getting Data From JMR", returnData);
    }else {
      return returnFaliure(type+' Not Submitted!');
    }
  }
});

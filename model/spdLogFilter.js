Meteor.methods({
  "gettingSPDStateListForLogFilter": function() {
      var dataArr = [];
      var data = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved', 'profile.registration_form.transaction_type': 'Inter'}).fetch();
      data.forEach(function(item) {
        dataArr.push(item.profile.registration_form.spd_state);
      });
      var arrList =  _.uniq(dataArr);
      var stateArr = arrList.sort(function(a, b) {
          var nA = a.toLowerCase();
          var nB = b.toLowerCase();
          if (nA < nB)
              return -1;
          else if (nA > nB)
              return 1;
          return 0;
      });
      return returnSuccess('Getting SPD Uniq State Arrar', stateArr);
  },
  "gettingFilteredSPDSList": function(stateArr, scheme) {
      var dataArr = [];
      var data = Meteor.users.find({'profile.registration_form.spd_state' : { $in: stateArr}, 'profile.registration_form.transaction_type': 'Inter', 'profile.user_type': 'spd', 'profile.status': 'approved', 'profile.registration_form.scheme':scheme}).fetch();
      data.forEach(function(item) {
        dataArr.push({spdId:item._id, spdState:item.profile.registration_form.spd_state, spdName:item.profile.registration_form.name_of_spd});
      });
      var spdArrList = dataArr.sort(function(a, b) {
          var nA = a.spdName.toLowerCase();
          var nB = b.spdName.toLowerCase();
          if (nA < nB)
              return -1;
          else if (nA > nB)
              return 1;
          return 0;
      });
      return returnSuccess('Getting SPD Uniq State Arrar', spdArrList);
  },
  getingSPDLogFilterData(json){
    var returnAllDataArr = [];
    var spdList = json.spdListArr;
    var financialYear = json.financialYear;
    var monthArr = json.monthArr;
    spdList.forEach( function(spdId){
      var spdData = Meteor.users.find({_id:spdId}).fetch();
      monthArr.forEach( function(month) {
        var checkData = LogBookSpd.find({clientId:spdId,month:month,financial_year:financialYear}, {sort: {$natural: -1 }, limit: 1 }).fetch();
        if (checkData.length > 0) {
          var toReturn = {
            month : month,
            year : checkData[0].year,
            financial_year : financialYear,
            clientId : checkData[0].clientId,
            clientState : checkData[0].clientState,
            nameOfEntity : checkData[0].nameOfEntity,
            billedUnits : checkData[0].billedUnits,
            invoiceNumber : checkData[0].invoiceNumber,
            invoiceType : checkData[0].invoice_type,
            dateOfReceipt : checkData[0].dateOfReceipt,
            dueDate : checkData[0].dueDate,
            invoiceAmount : Number(Number(checkData[0].invoiceAmount) - Number(checkData[0].paymentMode)).toFixed(2),
            exceedEnergy : checkData[0].exceedEnergy,
            exceedAmount : checkData[0].exceedAmount,
            rate : checkData[0].rate,
            filehref : checkData[0].filehref,
            rate : spdData[0].profile.registration_form.rate_per_unit,
            minkWh : spdData[0].profile.registration_form.spd_min_energy_as_per_ppa,
            maxkWh : spdData[0].profile.registration_form.spd_max_energy_as_per_ppa,
            dataFrom : 'LogBookSpd',
          };
          returnAllDataArr.push(toReturn);
        }
      });
    });
    return returnSuccess('Getting SPD Log Book Data', returnAllDataArr);
  },
  submitSPDInvoiceLogFilterDataToLogBook(jsonDataArr){
  var ip= this.connection.httpHeaders['x-forwarded-for'];
  var ipArr = ip.split(',');
  jsonDataArr.forEach( function(logbook) {
    var checkData = LogBookSpd.find({clientId:logbook.clientId,clientState:logbook.clientState, month:logbook.month, financial_year: logbook.financial_year}).fetch();
    if (checkData.length > 0) {
      if (Number(checkData[0].paymentMode) == 0) {
        var test = LogBookSpd.update({_id:checkData[0]._id}, {$set: {paymentMode:logbook.paymentMode, dateOfPayment:logbook.dateOfPayment, shortPaymentDone:logbook.shortPaymentDone, remark:logbook.remark}})
      }else {
        if (Number(logbook.paymentMode) > 0 && logbook.dateOfPayment != '') {
          LogBookSpd.insert(logbook);
        }
      }
      LogDetails.insert({
          ip_address: ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          log_type: 'Log Book',
          template_name: 'logBook_spd',
          event_name: 'logBook_spd_form',
          timestamp: new Date(),
          action_date: moment().format('DD-MM-YYYY'),
          json: logbook
      });
    }
  });
  return returnSuccess('Updating SPD Log Book Data');
  }
});

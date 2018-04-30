Meteor.methods({
  gettingDISCOMStateIC(){
    var json = Discom.find({transaction_type:'Inter'}).fetch();
    if (json.length > 0) {
        var namesArray = [];
        json.forEach(function(item) {
            namesArray.push({names: item.nameof_buyingutility, discomId: item._id, discomState: item.discom_state})
        })
        return returnSuccess("Got all discom", namesArray);
    }
  },
  gettingFinancialYearWiseReport(financialYear, discomState, type){
    var dataArray = LogbookIncentive.find({financial_year:{$in : financialYear},discom_state:{$in:discomState}}).fetch();
    var incentiveChargesTotal = 0;
    var paymentAmountTotal = 0;
    var shortPaymentTotal = 0;
    var surChargeAmountTotal = 0;
    dataArray.forEach(function(dItem) {
      incentiveChargesTotal += Number(dItem.incentive_charges)
      paymentAmountTotal += Number(dItem.payment_amount)
      if (dItem.short_payment_amount == '') {
        shortPaymentTotal += Number(0)
      }else {
        shortPaymentTotal += Number(dItem.short_payment_amount)
      }
      surChargeAmountTotal += Number(dItem.sur_charge_amount)
    });
    var json = {incentiveChargesTotal:Number(incentiveChargesTotal).toFixed(3), paymentAmountTotal:paymentAmountTotal, shortPaymentTotal:shortPaymentTotal, surChargeAmountTotal:surChargeAmountTotal};
    var jsonData = {total:json, dataArray:dataArray};
    if (dataArray.length > 0) {
      return returnSuccess("Got all data", jsonData);
    }else {
      return returnFaliure("Data not found!");
    }
  },
  gettingPaymentReceivedWiseReport(fromDate,toDate, discomState, type){
      var dataArray = [];
      var fromValue = fromDate.split('-');
      fromDate = fromValue[2] + '-' + fromValue[1] + '-' + fromValue[0];
      var toValue = toDate.split('-');
      toDate = toValue[2] + '-' + toValue[1] + '-' + toValue[0];
      var startDate = moment(fromDate);
      var endDate = moment(toDate);
      for(var date = moment(startDate); date.diff(endDate) <= 0; date.add('days', 1)){
        var loopDate = moment(date).format('DD-MM-YYYY');
        var jsonData = LogbookIncentive.find({discom_state:{$in:discomState},date_of_payment:loopDate}).fetch();
        if (jsonData.length == 1) {
            dataArray.push(jsonData[0]);
        }else if (jsonData.length > 1) {
          _.each(jsonData, function(item) {
            dataArray.push(item);
          })
        }
      }
      var incentiveChargesTotal = 0;
      var paymentAmountTotal = 0;
      var shortPaymentTotal = 0;
      var surChargeAmountTotal = 0;
      dataArray.forEach(function(dItem) {
        incentiveChargesTotal += Number(dItem.incentive_charges)
        paymentAmountTotal += Number(dItem.payment_amount)
        if (dItem.short_payment_amount == '') {
          shortPaymentTotal += Number(0)
        }else {
          shortPaymentTotal += Number(dItem.short_payment_amount)
        }
        surChargeAmountTotal += Number(dItem.sur_charge_amount)
      });
      var json = {incentiveChargesTotal:Number(incentiveChargesTotal).toFixed(3), paymentAmountTotal:paymentAmountTotal, shortPaymentTotal:shortPaymentTotal, surChargeAmountTotal:surChargeAmountTotal};
      var jsonData = {total:json, dataArray:dataArray};
      return returnSuccess("LogBook Incentive Data Fetched on the basis of Date Of Receipt",jsonData);
  },
  gettingDueDateWiseReport(fromDate,toDate, discomState, type){
    var dataArray = [];
    var fromValue = fromDate.split('-');
    fromDate = fromValue[2] + '-' + fromValue[1] + '-' + fromValue[0];
    var toValue = toDate.split('-');
    toDate = toValue[2] + '-' + toValue[1] + '-' + toValue[0];
    var startDate = moment(fromDate);
    var endDate = moment(toDate);
    for(var date = moment(startDate); date.diff(endDate) <= 0; date.add('days', 1)){
      var loopDate = moment(date).format('DD-MM-YYYY');
        var jsonData = LogbookIncentive.find({discom_state:{$in:discomState},due_date:loopDate}).fetch();
      if (jsonData.length == 1) {
          dataArray.push(jsonData[0]);
      }else if (jsonData.length > 1) {
        _.each(jsonData, function(item) {
          dataArray.push(item);
        })
      }
    }
    var incentiveChargesTotal = 0;
    var paymentAmountTotal = 0;
    var shortPaymentTotal = 0;
    var surChargeAmountTotal = 0;
    dataArray.forEach(function(dItem) {
      incentiveChargesTotal += Number(dItem.incentive_charges)
      paymentAmountTotal += Number(dItem.payment_amount)
      if (dItem.short_payment_amount == '') {
        shortPaymentTotal += Number(0)
      }else {
        shortPaymentTotal += Number(dItem.short_payment_amount)
      }
      surChargeAmountTotal += Number(dItem.sur_charge_amount)
    });
    var json = {incentiveChargesTotal:Number(incentiveChargesTotal).toFixed(3), paymentAmountTotal:paymentAmountTotal, shortPaymentTotal:shortPaymentTotal, surChargeAmountTotal:surChargeAmountTotal};
    var jsonData = {total:json, dataArray:dataArray};
    return returnSuccess("LogBook Incentive Data Fetched on the basis of Due Date",jsonData);
  }
});

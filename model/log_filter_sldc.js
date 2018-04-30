Meteor.methods({
  gettingDiscomStateSLDCLogFilter(state){
    var spdStateArr = [];
    var data = Meteor.users.find({'profile.registration_form.spd_state' : { $in: state}}).fetch();
    data.forEach(function(item) {
        var discomData = Discom.find().fetch();
        discomData.forEach(function(discomItem) {
            discomItem.spdIds.forEach(function(discomData) {
                if (discomData.spdId == item._id) {
                    spdStateArr.push(discomItem.discom_state);
                }
            });
        });
    });
    var discomStateVar = _.uniq(spdStateArr);
    return returnSuccess('Returning Discom State For SLDC Log Book',discomStateVar);
  },
  gettingFilteredDataSLDCInvoice(json){
    var returnData = '';
      if (json.filterType == "Year") {
        returnData = LogbookSLDC.find({spdState:{ $in : json.spdState},year: {$in :json.year},discom_state:{$in:json.discomState}}).fetch();
      }else if (json.filterType == "FinancialYear") {
          returnData = LogbookSLDC.find({spdState:{ $in : json.spdState},financial_year: {$in :json.financialYear},discom_state:{$in:json.discomState}}).fetch();
      }
    if(returnData.length > 0) {
      var dataArray = returnData;
      var totalInvoiceAmount = 0;
      var paymentAmountTotal = 0;
      var shortPaymentTotal = 0;
      var surChargeAmountTotal = 0;
      dataArray.forEach(function(dItem) {
        totalInvoiceAmount += Number(dItem.total_amount)
        paymentAmountTotal += Number(dItem.payment_amount)
        if (dItem.short_payment_amount == '') {
          shortPaymentTotal += Number(0)
        }else {
          shortPaymentTotal += Number(dItem.short_payment_amount)
        }
        surChargeAmountTotal += Number(dItem.sur_charge_amount)
      });
      var json = {totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:Number(paymentAmountTotal).toFixed(2), shortPaymentTotal:Number(shortPaymentTotal).toFixed(2), surChargeAmountTotal:Number(surChargeAmountTotal).toFixed(2)};
      var jsonData = {total:json, dataArray:returnData};
      return returnSuccess('Getting SLDC Invoice',jsonData);
    }else {
      return returnFaliure('SLDC Invoice Not Found!');
    }
  },
  callDiscomReportOfPaymentSLDC(json){
    var fromValue = json.fromDate.split('-');
    fromDate = fromValue[2] + '-' + fromValue[1] + '-' + fromValue[0];
    var toValue = json.toDate.split('-');
    toDate = toValue[2] + '-' + toValue[1] + '-' + toValue[0];
    var dataArray = [];
    var startDate = moment(fromDate);
    var endDate = moment(toDate);
    for(var date = moment(startDate); date.diff(endDate) <= 0; date.add('days', 1)){
      var loopDate = moment(date).format('DD-MM-YYYY');
          var jsonData = LogbookSLDC.find({date_of_payment:loopDate,spdState:{ $in : json.spdState},discom_state:{$in:json.discomState}}).fetch();
      if (jsonData.length == 1) {
          dataArray.push(jsonData[0]);
      }else if (jsonData.length > 1) {
        _.each(jsonData, function(item) {
          dataArray.push(item);
        })
      }
    }
    if (dataArray.length > 0) {
      var dataArray = returnData;
      var totalInvoiceAmount = 0;
      var paymentAmountTotal = 0;
      var shortPaymentTotal = 0;
      var surChargeAmountTotal = 0;
      dataArray.forEach(function(dItem) {
        totalInvoiceAmount += Number(dItem.total_amount)
        paymentAmountTotal += Number(dItem.payment_amount)
        if (dItem.short_payment_amount == '') {
          shortPaymentTotal += Number(0)
        }else {
          shortPaymentTotal += Number(dItem.short_payment_amount)
        }
        surChargeAmountTotal += Number(dItem.sur_charge_amount)
      });
      var json = {totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:paymentAmountTotal, shortPaymentTotal:shortPaymentTotal, surChargeAmountTotal:surChargeAmountTotal};
      var jsonData = {total:json, dataArray:returnData};
      return returnSuccess('Getting SLDC Invoice By Payment Date',jsonData);
    }else {
      return returnFaliure('SLDC Log Not Submitted!');
    }
  },
  DueDateWiseSLDCLog(json){
    var fromValue = json.fromDate.split('-');
    fromDate = fromValue[2] + '-' + fromValue[1] + '-' + fromValue[0];
    var toValue = json.toDate.split('-');
    toDate = toValue[2] + '-' + toValue[1] + '-' + toValue[0];
    var dataArray = [];
    var startDate = moment(fromDate);
    var endDate = moment(toDate);
    for(var date = moment(startDate); date.diff(endDate) <= 0; date.add('days', 1)){
      var loopDate = moment(date).format('DD-MM-YYYY');
      var jsonData = LogbookSLDC.find({due_date:loopDate,spdState:{ $in : json.spdState},discom_state:{$in:json.discomState}}).fetch();
      if (jsonData.length == 1) {
          dataArray.push(jsonData[0]);
      }else if (jsonData.length > 1) {
        _.each(jsonData, function(item) {
          dataArray.push(item);
        })
      }
    }
    if (dataArray.length > 0) {
      var dataArray = returnData;
      var totalInvoiceAmount = 0;
      var paymentAmountTotal = 0;
      var shortPaymentTotal = 0;
      var surChargeAmountTotal = 0;
      dataArray.forEach(function(dItem) {
        totalInvoiceAmount += Number(dItem.total_amount)
        paymentAmountTotal += Number(dItem.payment_amount)
        if (dItem.short_payment_amount == '') {
          shortPaymentTotal += Number(0)
        }else {
          shortPaymentTotal += Number(dItem.short_payment_amount)
        }
        surChargeAmountTotal += Number(dItem.sur_charge_amount)
      });
      var json = {totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:paymentAmountTotal, shortPaymentTotal:shortPaymentTotal, surChargeAmountTotal:surChargeAmountTotal};
      var jsonData = {total:json, dataArray:returnData};
      return returnSuccess('Getting SLDC Invoice By Due Date',jsonData);
    }else {
      return returnFaliure('SLDC Log Not Submitted!');
    }
  }
});

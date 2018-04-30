Meteor.methods({
  GettingDetailsForPaymentNote(month,financial_year,stateVar,paymentNoteType){
    if(paymentNoteType=='Transmission'){
    var stu_ctu = stateVar=='Gujarat' ? 'GETCO' : stateVar=='MP' ? 'MPPTCL': stateVar=='Rajasthan' ? 'RVPN':'Access granted';
    var data = TranscoSheetTransmission.find({month:month,financial_year:financial_year,stu_ctu:stu_ctu,stu_transaction_type:paymentNoteType}).fetch();
    if(data.length>0){
    return returnSuccess('Checking details for Payment Note',data[0]);
  }else{
    return returnFaliure('Data Not Found');
  }
    }else if(paymentNoteType=='Incentive'){
      var data = TranscoSheetIncentive.find({financial_year:financial_year,stu_ctu:'RVPN',stu_transaction_type:paymentNoteType}).fetch();
      if(data.length>0){
      return returnSuccess('Checking details for Payment Note',data[0]);
    }else{
      return returnFaliure('Data Not Found');
    }
    }else if(paymentNoteType=='SLDC'){
      var data = TranscoSheetSldc.find({month:month,financial_year:financial_year,stu_ctu:'RVPN',stu_transaction_type:paymentNoteType}).fetch();
      if(data.length>0){
      return returnSuccess('Checking details for Payment Note',data[0]);
    }else{
      return returnFaliure('Data Not Found!');
    }
  }
  },
  gettingSPDStateLogBookSPD(month,financialYear){
    var spdData = LogBookSpd.find({
        month: month,
        financial_year: financialYear,
    }).fetch();
    var spdStateArr = [];
    _.each(spdData, function(item, key){
      spdStateArr.push(item.clientState);
    });

    var stateofSpd = _.uniq(spdStateArr);
    if(stateofSpd.length > 0){
      return returnSuccess('Getting SPD State List from LogBookSpd module',stateofSpd);
    }else {
      return returnFaliure(' SPD State not found in logbook!');
    }
  },
  gettingSPDListFromLogBookSPD(json){
    var data = LogBookSpd.find({
        month: json.month,
        financial_year: json.financialYear,
        clientState: { "$in": json.state }
    }).fetch();
    // var data = LogBookSpd.find({
    //     month: json.month,
    //     financial_year: json.financialYear,
    //     clientState:json.state,
    // }).fetch();
    var spdListArr = [];
    _.each(data, function(item, key){
      spdListArr.push({_id:item._id,spdId:item.clientId,spdName:item.nameOfEntity});
    });
    if(spdListArr.length > 0){
      return returnSuccess('LogBookSpd data found for payment note',spdListArr);
    }else {
      return returnFaliure('Data not found in logbook!');
    }
  },
  getDataFromLogBookForPaymentNote(month, financialYear, state, spdIds){
    var returnAll = [];
    _.each(spdIds, function(item) {
      var data = LogBookSpd.find({_id:item}).fetch();
      var spdId = data[0].clientId;
      var spdData = Meteor.users.find({_id: spdId}).fetch();
      var returnJson = data[0];
      var capacityData = Meteor.users.find({_id:spdId}).fetch();
      returnJson.capacity = capacityData[0].profile.registration_form.project_capicity;
      let getData = EnergyPaymentNoteDetails.find({month:month,financialYear:financialYear,clientId:item,clientState:state,delete_status:false}).fetch();
      returnJson.invoiceAmount = Number(returnJson.invoiceAmount) - Number(returnJson.paymentMode);
      returnJson.minkWh = spdData[0].profile.registration_form.spd_min_energy_as_per_ppa;
      returnJson.maxkWh = spdData[0].profile.registration_form.spd_max_energy_as_per_ppa;
      var jsonData = {returnJson:returnJson,getData:getData.length};
      returnAll.push(jsonData);
    });
      return returnSuccess('Getting data from LogBookSpd by Id',returnAll);
  },
  checkGeneratedTCPaymentNote(month,year,state,financialYear){
    let getData = TransmissionPaymentNoteDetails.find({month:month,year:year,financialYear:financialYear,state:state,delete_status:false}).fetch();
    return returnSuccess('Checking Generated TC Payment Note',getData.length);
  },
  checkGeneratedSLDCPaymentNote(month,year,state,financialYear){
    let getData = SLDCPaymentNoteDetails.find({month:month,year:year,financialYear:financialYear,state:state,delete_status:false}).fetch();
    return returnSuccess('Checking Generated SLDC Payment Note',getData.length);
  },
  checkGeneratedIncentivePaymentNote(year,state,financialYear){
    let getData = IncentivePaymentNoteDetails.find({year:year,financialYear:financialYear,state:state,delete_status:false}).fetch();
    return returnSuccess('Checking Generated Incentive Payment Note',getData.length);
  },

  checkGeneratedRLDCPaymentNote(month,year,state,financialYear){
    let getData = RLDCPaymentNoteDetails.find({month:month,year:year,financial_year:financialYear,state:state,delete_status:false}).fetch();
    return returnSuccess('Checking Generated RLDC Payment Note',getData.length);
  },
  generatePaymentNoteOfEnergy(jsonArr){
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    var FinalJsonArr = [];
    var jsonDataArr = [];
    var filepathVar = '';
    var pathDocx = '';
    var totalReleasedPayment = 0;
    var totalInvoiceAmount = 0;
    var totalEnergyUnit = 0;
    var numberOfGeneration = 1;
    var checkData = EnergyPaymentNoteDetails.find({month:jsonArr[0].month,year:jsonArr[0].year,type:'Energy Payment Note',delete_status:false},{sort: {$natural: -1},limit: 1}).fetch();
    if(checkData.length > 0){
      if(checkData[0].month == jsonArr[0].month && checkData[0].year == jsonArr[0].year){
          numberOfGeneration = (Number(checkData[0].numberOfGeneration) + 1);
      }
    }else {
      numberOfGeneration = 1;
    }
    var monthInNumArr = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
    var monthInNumber = monthInNumArr[Number(jsonArr[0].month) -1];
    var currentYear = jsonArr[0].year;
    var referenceNumber = 'SECI/PT/SPD/'+currentYear+'/'+monthInNumber+'/'+numberOfGeneration;

    jsonArr.forEach(function(json) {
      totalReleasedPayment += Number(Number(json.releasedPayment).toFixed(2));
      totalInvoiceAmount += Number(Number(json.invoiceAmount).toFixed(2));
      totalEnergyUnit += Number(Number(json.billedUnits).toFixed(2));

      var spdId = json.spd_id;
      var maxiEnergyData = Meteor.users.find({_id:spdId}).fetch();
      var maxiEnergy = maxiEnergyData[0].profile.registration_form.spd_max_energy_as_per_ppa;
      var maxEnergyInkWH = maxiEnergy;
      json.maximumEnergy = maxEnergyInkWH;
      json.reference_number = referenceNumber;
      json.numberOfGeneration = numberOfGeneration;
      filepathVar = 'six_level/Energy_Payment_Note/' + 'energy_payment_note' + '_' + json.financialYear + '_' + json.month +'_'+json.random+ '.pdf';
      pathDocx = 'six_level/Energy_Payment_Note/' + 'energy_payment_note' + '_' + json.financialYear + '_' + json.month +'_'+json.random+ '.docx';
      json.file_path = filepathVar;
      json.file_path_docx = pathDocx;
      json.type = 'Energy Payment Note';
      EnergyPaymentNoteDetails.insert(json);
      var logbook = '';
      Meteor.call('callSpdJmrUnits',json.clientId,json.month,json.financialYear, function(error, result){
        if (error) {
        }else {
          if(result.status){
             logbook = result.data;
          }
        }
      });

      var checkData = LogBookSpd.find({clientId:json.clientId,month:json.month,year:json.year}).fetch();
      if (checkData.length > 0) {
        if (checkData[0].dateOfPayment == '') {
          var test = LogBookSpd.update({_id:checkData[0]._id}, {$set: {paymentMode:json.releasedPayment, dateOfPayment:json.generatedDate, shortPaymentDone:json.remaningAmount, remark:json.remark}})
        }else {
          var jsonData = checkData[0];
          // removing _id from json to insert new Document
          var keyToDelete = "_id";
          delete jsonData[keyToDelete];
          var keyToDelete = "timeStamp";
          delete jsonData[keyToDelete];
          jsonData.timeStamp = new Date();
          jsonData.invoiceAmount = json.invoiceAmount;
          jsonData.paymentMode = json.releasedPayment;
          jsonData.shortPaymentDone = json.remaningAmount;
          jsonData.remark = json.remark;
          LogBookSpd.insert(jsonData);
        }
      }else {
        LogBookSpd.insert(logbook);
      }

      LogDetails.insert({
          ip_address:ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          log_type: 'Energy Payment Note Generated',
          template_name: 'paymentNoteForSPDInvoice',
          event_name: 'btnEnergyPayment',
          action_date:moment().format('DD-MM-YYYY'),
          timestamp: new Date(),
          state:json.state,
          json:json
      });
      jsonDataArr.push(json);
    });
    var AllTotalEnergyUnit = amountInComman(Number(totalEnergyUnit).toFixed(2));
    var invoiceAmountInComman = amountInComman(Number(totalInvoiceAmount).toFixed(2));
    var paymentReleasedInComman = amountInComman(Number(totalReleasedPayment).toFixed(2));
    var paymentReleasedInWords = amountInWords(Number(totalReleasedPayment).toFixed(2));
    var totalJson = {
      referenceNumber : referenceNumber,
      tEnergy : AllTotalEnergyUnit,
      tInvAmt : invoiceAmountInComman,
      tPayRel : paymentReleasedInComman,
      tPayRelWord : paymentReleasedInWords
    };
    jsonDataArr.forEach(function (json) {
      var totalEnergy = 0;
      var monthArr = ['04','05','06','07','08','09','10','11','12','01','02','03'];
      _.each(monthArr, function(item){
        var enegyData = EnergyPaymentNoteDetails.find({clientId:json.clientId,month:item,financialYear:json.financialYear,delete_status:false}).fetch();
        var energyTotal = 0;
        if (enegyData.length > 0) {
          energyTotal = enegyData[0].energyPurchased;
        }else {
          energyTotal = 0;
        }
        totalEnergy += Number(energyTotal);
      });

      json.totalEnergy = Number(totalEnergy);
      if(Number(json.deducationIfAny) == 0){
        var deductionString = 'Nil';
      }else {
        var deductionString = json.deducationIfAny;
      }
      var monthArr = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
      var tillPreiod = monthArr[Number(json.month) - 1]+"'"+json.year;
      json.tillPreiod = tillPreiod;
      json.deductionString = deductionString;
      FinalJsonArr.push(json);
    });
    Meteor.call('pdfOfPaymentNoteEnergy',FinalJsonArr,totalJson);
    return returnSuccess('Energy Payment Note Generated',filepathVar);
  },
  paymentNoteOfRLDC(json){
    var currntDate = new Date();
    var date = moment(currntDate).format('DD-MM-YYYY');
    var dateArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var monthInWords = getArray(dateArr, json.month);
    var period = monthInWords+"'"+json.year;
    var grandTotal = Number(Number(json.socVar) + Number(json.mocVar)).toFixed(2);
    var totalInWords = amountInWords(grandTotal);
    var referenceNumber = 'SECI/Power Trading/WRLDC/' + json.state + '/' + monthInWords + '/' + json.year + '/' + 1;
    var returnJson = {random:json.random,referenceNumber:referenceNumber,month:json.month,year:json.year,financialYear:json.financialYear,appType:json.appType,generatedDate:date,period:period,SOC:json.socVar,MOC:json.mocVar,totalNumber:grandTotal,totalWord:totalInWords};
    Meteor.call('pdfOfPaymentNoteRDLC',returnJson);
    var filepath = 'six_level/RLDC_Payment_Note/' + json.appType + '_' + json.financialYear + '_' + json.month +'_'+json.random+ '.pdf';
    var pathDocx = 'six_level/RLDC_Payment_Note/' + json.appType + '_' + json.financialYear + '_' + json.month +'_'+json.random+ '.docx';
    var jsonToInsert = {
      reference_number: referenceNumber,
      state: json.state,
      type: 'RLDC Payment Note',
      generatedDate:moment().format('DD-MM-YYYY'),
      month: json.month,
      year: json.year,
      financial_year:json.financialYear,
      soc: json.socVar,
      moc: json.mocVar,
      total:grandTotal,
      file_path:filepath,
      file_path_docx:pathDocx,
      delete_status:false,
      timestamp: new Date()
    };
    RLDCPaymentNoteDetails.insert(jsonToInsert);
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address:ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        log_type: json.state+' RLDC Payment Note Generated',
        template_name: 'paymentNoteForSPDInvoice',
        event_name: 'btnRLDCPayment',
        action_date:moment().format('DD-MM-YYYY'),
        timestamp: new Date(),
        state:json.state,
        json:json
    });
    return returnSuccess('RLDC Payment Note Generated',filepath);
  },
  paymentNoteOfGujaratTransmission(json){
    var rateVar = InvoiceCharges.find({
        invoice_type: 'Transmission_Charges',
        state: json.state,
        financial_year: json.financialYear
    }).fetch();
    if(rateVar.length > 0){
      var rate = rateVar[0].rate;
    }else{
      var rate = 1;
    }
    var totalDaysInMonth = numberOfdaysInMonth(json.month, json.year);
    var paymentAmountArr = [];
    for (var i = 0; i < json.deduct.length; i++) {
        var payValue = Number(json.invoiceAmount[i]) - Number(json.deduct[i]);
        paymentAmountArr.push(payValue);
    }
    var totalPaymentAmount = 0;
    for (var i = 0; i < paymentAmountArr.length; i++) {
        totalPaymentAmount += Number(paymentAmountArr[i]);
    }

    var totalDeductionAmount = 0;
    for (var i = 0; i < json.deduct.length; i++) {
        totalDeductionAmount += Number(json.deduct[i]);
    }
    var totalInvoiceAmount = 0;
    for (var i = 0; i < json.invoiceAmount.length; i++) {
        totalInvoiceAmount += Number(json.invoiceAmount[i]);
    }
    var jsonData = {
      days: totalDaysInMonth,
      rate: rate
    };
    var jsonTotal = {
      'amountNumber': amountInComman(totalPaymentAmount.toFixed(2)),
      'amountWords': amountInWords(totalPaymentAmount.toFixed(2))
    };
    var monthInNumArr = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
    var monthInShort = monthInNumArr[Number(json.month) -1];
    var referenceNumber = "SECI/PS/PT 750MW/GETCO CHARGES/"+json.year+"/"+monthInShort+"/1"
    var random = Math.floor((Math.random() * 10000) + 1).toString();
    var filepathVar = 'six_level/Transmission_Payment_Note/trans_charge_GETCO' + '_' + json.financialYear + '_' + json.month +"_"+random + '.pdf';
    var pathDocx = 'six_level/Transmission_Payment_Note/trans_charge_GETCO' + '_' + json.financialYear + '_' + json.month +"_"+random + '.docx';
    var json = {
        year:json.year,
        month:json.month,
        state:json.state,
        financialYear:json.financialYear,
        invoiceNumber: json.invoiceNumber,
        referenceNumber:referenceNumber,
        invoiceDate: json.invoiceDate,
        dueDate: json.dueDate,
        raisedDate:json.raisedDate,
        recievedDate:json.receivedDate,
        invoiceAmount: json.invoiceAmount,
        totalInvoiceAmount: totalInvoiceAmount,
        deduct: json.deduct,
        totalDeductionAmount: totalDeductionAmount,
        paymentAmount: paymentAmountArr,
        totalPaybleAmount: totalPaymentAmount,
        rate: jsonData.rate,
        numberOfdays: jsonData.days,
        generatedDate:moment().format('DD-MM-YYYY'),
        type: 'Gujarat Transmission Payment Note',
        delete_status: false,
        file_path:filepathVar,
        file_path_docx:pathDocx,
        timestamp: new Date()
    };
      TransmissionPaymentNoteDetails.insert(json);
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      LogDetails.insert({
          ip_address:ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          log_type: 'Gujarat Transmission Payment Note Generated',
          template_name: 'paymentNoteForSPDInvoice',
          event_name: 'btnTransmissionPayment',
          action_date:moment().format('DD-MM-YYYY'),
          timestamp: new Date(),
          state:json.state,
          json:json
      });
      json.referenceNumber = referenceNumber;
      json.amount = jsonTotal;
      json.monthWords = monthInWords(json.month);
      Meteor.call('pdfOfPaymentNoteGujaratTransmission', json,random);
    return returnSuccess('Gujarat Transmission Payment Note Generated',filepathVar);
  },
  paymentNoteOfRajasthanTransmission(json){
    var rateVar = InvoiceCharges.find({
        invoice_type: 'Transmission_Charges',
        state: json.state,
        financial_year: json.financialYear
    }).fetch();
    if(rateVar.length > 0){
      var rate = rateVar[0].rate;
    }else{
      var rate = 1;
    }
    var paymentAmount = [];
    for (var i = 0; i < json.totalAmount.length; i++) {
        var payValue = Number(json.totalAmount[i]) - Number(json.excessPayment[i]);
        paymentAmount.push(payValue);
    }
    var count = 0;
    for (var i = 0; i < paymentAmount.length; i++) {
        count += Number(paymentAmount[i])
    }
    var totalExcessAmt = 0;
    for (var i = 0; i < json.excessPayment.length; i++) {
        totalExcessAmt += Number(json.excessPayment[i])
    }
    var totalInvoiceAmt = 0;
    for (var i = 0; i < json.totalAmount.length; i++) {
        totalInvoiceAmt += Number(json.totalAmount[i])
    }
    var amountJson = {
        'amountNumber': amountInComman(count.toFixed(2)),
        'amountWords': amountInWords(count.toFixed(2))
    };
    var random = Math.floor((Math.random() * 10000) + 1).toString();
    var filepathVar = 'six_level/Transmission_Payment_Note/trans_charge_Rajasthan'+ '_' + json.financialYear + '_' + json.month +"_"+random+ '.pdf';
    var pathDocx = 'six_level/Transmission_Payment_Note/trans_charge_Rajasthan'+ '_' + json.financialYear + '_' + json.month +"_"+random+ '.docx';
    json.totalInvoiceAmount = totalInvoiceAmt;
    json.totalExcessAmount = totalExcessAmt;
    json.totalPaybleAmount = count;
    json.paymentAmount = paymentAmount;
    json.rate = rate;
    json.file_path = filepathVar;
    json.file_path_docx = pathDocx;
    json.generatedDate = moment().format('DD-MM-YYYY');
    json.type = 'Rajasthan Transmission Payment Note';
    TransmissionPaymentNoteDetails.insert(json);
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address:ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        log_type: 'Rajasthan Transmission Payment Note Generated',
        template_name: 'paymentNoteForSPDInvoice',
        event_name: 'btnTransmissionPayment',
        action_date:moment().format('DD-MM-YYYY'),
        timestamp: new Date(),
        state:json.state,
        json:json
    });
    json.amount = amountJson;
    Meteor.call('pdfOfPaymentNoteRajasthanTransmission', json,random);
    return returnSuccess('Rajasthan Transmission Payment Note Generated',filepathVar);
  },
  paymentNoteOfMPTransmission(json){
    var random = Math.floor((Math.random() * 10000) + 1).toString();
    var filepathVar = 'six_level/Transmission_Payment_Note/trans_charge_MP' + '_' + json.financialYear + '_' + json.month+"_"+random + '.pdf';
    var pathDocx = 'six_level/Transmission_Payment_Note/trans_charge_MP' + '_' + json.financialYear + '_' + json.month+"_"+random + '.docx';
    var paymentAmount = Number(json.totalAmount) - Number(json.excessPayment);
    json.paymentAmount = paymentAmount;
    json.file_path = filepathVar;
    json.file_path_docx = pathDocx;
    json.type = 'MP Transmission Payment Note';
    json.totalInvoiceAmount = Number(json.totalAmount);
    json.totalExcessAmount = Number(json.excessPayment);
    json.totalPaybleAmount = paymentAmount;
    TransmissionPaymentNoteDetails.insert(json);
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address:ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        log_type: 'MP Transmission Payment Note Generated',
        template_name: 'paymentNoteForSPDInvoice',
        event_name: 'btnTransmissionPayment',
        action_date:moment().format('DD-MM-YYYY'),
        timestamp: new Date(),
        state:json.state,
        json:json
    });
    json.amountNumber = amountInComman(paymentAmount.toFixed(2));
    json.amountWords = amountInWords(paymentAmount.toFixed(2));
    Meteor.call('pdfOfPaymentNoteMPTransmission', json,random);
    return returnSuccess('MP TC payment note',filepathVar);
  },
  paymentNoteOfRajasthanSLDC(json){
    //change date format only for view
    var changrFormat = json.invoiceRaisedDate.split('-');
    json.invRaisedDateVar = changrFormat[0]+'.'+changrFormat[1]+'.'+changrFormat[2];
    var rateVar = InvoiceCharges.find({
        invoice_type: 'SLDC_Charges',
        state: json.state,
        financial_year: json.financialYear
    }).fetch();
    if(rateVar.length > 0){
      var rate = rateVar[0].rate;
    }else{
      var rate = 1;
    }
    var periodFrom = json.periodFromArr[0];
    var datePeriodFrom = periodFrom.split('-');
    var monthVarFrom = datePeriodFrom[1];
    var yearVarFrom = datePeriodFrom[2];
    var periodTo = json.periodToArr[0];
    var datePeriodTo = periodTo.split('-');
    var monthVarTo = datePeriodTo[1];
    var yearVarTo = datePeriodTo[2];
    if(Number(yearVarFrom) == Number(yearVarTo)){
      var periodFromTo = monthInWords(Number(monthVarFrom))+"-"+monthInWords(Number(monthVarTo))+"'"+yearVarFrom;
    }else{
      var periodFromTo = monthInWords(Number(monthVarFrom))+"'"+yearVarFrom+"-"+monthInWords(Number(monthVarTo))+"'"+yearVarTo;
    }
    json.periodFromTo = periodFromTo;
    json.rate = rate;
    var numberOfMonth = difference(Date.parse(datePeriodTo[2]+'/'+datePeriodTo[1]+'/'+datePeriodTo[0]), Date.parse(datePeriodFrom[2]+'/'+datePeriodFrom[1]+'/'+datePeriodFrom[0]));
    var amount = [];
    for (i = 0; i < json.capacity.length; i++) {
        var value = Number(json.capacity[i]) * Number(rate) * (Number(numberOfMonth));
        amount.push(value.toFixed(2));
    }
    json.amount = amount;
    var count = 0;
    for (var i = 0; i < amount.length; i++) {
        count += Number(amount[i])
    }
    var filepathVar = 'six_level/SLDC_Payment_Note/SLDC_charge'+'_'+json.financialYear+'_'+json.month+"_"+json.random +'.pdf';
    var pathDocx = 'six_level/SLDC_Payment_Note/SLDC_charge'+'_'+json.financialYear+'_'+json.month+"_"+json.random +'.docx';
    json.file_path = filepathVar;
    json.file_path_docx = pathDocx;
    json.totalAmount = Number(count).toFixed(2);
    json.type = 'SLDC Payment Note';
    SLDCPaymentNoteDetails.insert(json);
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address:ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        log_type: 'Rajasthan SLDC Payment Note Generated',
        template_name: 'paymentNoteForSPDInvoice',
        event_name: 'btnSLDCPayment',
        action_date:moment().format('DD-MM-YYYY'),
        timestamp: new Date(),
        state:json.state,
        json:json
    });
    json.amountNumber = amountInComman(count.toFixed(2));
    json.amountWords = amountInWords(count.toFixed(2));
    Meteor.call('pdfOfPaymentNoteRajasthanSLDC', json);
    return returnSuccess('Rajasthan SLDC Payment Note',filepathVar);
  },
  paymentNoteOfRajasthanIncentive(json){
    var referenceNumber = 'SECI/Power Trading/RVPN/Raj/Incentive/'+json.year;
    var filepathVar = 'six_level/Incentive_Payment_Note/incentive_charge'+'_'+json.financialYear+"_"+json.random+'.pdf';
    var pathDocx = 'six_level/Incentive_Payment_Note/incentive_charge'+'_'+json.financialYear+"_"+json.random+'.docx';
    json.referenceNumber = referenceNumber;
    json.file_path = filepathVar;
    json.file_path_docx = pathDocx;
    json.type = 'Incentive Payment Note';
    IncentivePaymentNoteDetails.insert(json);
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address:ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        log_type: 'Rajasthan Incentive Payment Note Generated',
        template_name: 'paymentNoteForSPDInvoice',
        event_name: 'btnIncentivePayment',
        action_date:moment().format('DD-MM-YYYY'),
        timestamp: new Date(),
        state:json.state,
        json:json
    });
    json.amountNumber = amountInComman(json.countbyRVPN.toFixed(2));
    json.amountWords = amountInWords(json.countbyRVPN.toFixed(2));

    Meteor.call('pdfOfPaymentNoteRajasthanIncentive', json);
    return returnSuccess('Rajasthan Incentive Payment Note',filepathVar);
  },


  pdfOfPaymentNoteEnergy(jsonArr, totalJson) {
      var fs = require('fs');
      var Docxtemplater = require('docxtemplater');
      var filepath = Assets.absoluteFilePath('energy_payment_note.docx');
      var content = fs.readFileSync(filepath, "binary");
      var doc = new Docxtemplater(content);
      var returnArr = [];
      jsonArr.forEach(function (json) {
        var jsonData = {
          'reference_number':'json.reference_number',
          'period':json.period,
          'tillPreiod':json.tillPreiod,
          'nameOfSPD': json.nameOfEntity,
          'capacity': json.capacity,
          'genDate': json.generatedDate,
          'state': json.clientState,
          'invoiceNumber': json.invoiceNumber,
          'invoiceAmount': Number(json.invoiceAmount).toFixed(2),
          'dateOfReceipt': json.dateOfReceipt,
          'dueDate': json.dueDate,
          'totalEnergy': Number(json.billedUnits).toFixed(2),
          'deducationIf': json.deductionString,
          'rate': json.rate,
          'releasedPayment': Number(json.releasedPayment).toFixed(2),
          // "finalTotalEnergy" this key will use in next financialYear for getting exact total energy in a financialYear
          'finalTotalEnergy':Number(json.totalEnergy).toFixed(2),
          'maxEnergy':Number(json.maximumEnergy).toFixed(2),
          'remarks':json.remark
        };
        returnArr.push(jsonData);
      });
      doc.setData({
          'state_Hin':'राज्‍य',
          'reference_number' : totalJson.referenceNumber,
          'tillPreiod' : jsonArr[0].tillPreiod,
          'genDate' :  returnArr[0].genDate,
          'period':returnArr[0].period,
          jsonData:returnArr,
          'tEnergy' : totalJson.tEnergy,
          'tInvAmt' : totalJson.tInvAmt,
          'tPayRel' : totalJson.tPayRel,
          'tPayRelWord' : totalJson.tPayRelWord
      });
      doc.render();
      var buffer = doc.getZip().generate({
          type: "nodebuffer"
      });
      fs.writeFileSync(process.env.PWD + '/.uploads/six_level/Energy_Payment_Note/' + 'energy_payment_note' + '_' + jsonArr[0].financialYear + '_' + jsonArr[0].month +'_'+jsonArr[0].random+ '.docx', buffer);

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/Energy_Payment_Note/' + 'energy_payment_note' + '_' + jsonArr[0].financialYear + '_' + jsonArr[0].month +'_'+jsonArr[0].random+ '.docx', '--outdir', process.env.PWD + '/.uploads/six_level/Energy_Payment_Note']);
      command.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
          console.log('child process exited with code ' + code);
      });
      // Meteor.setTimeout(function() {
      //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/Energy_Payment_Note/' + 'energy_payment_note' + '_' + jsonArr[0].financialYear + '_' + jsonArr[0].month +'_'+jsonArr[0].random+ '.docx');
      // }, 4000);
      console.log('Energy Invoice Payment Note PDF Generated');
  },
  pdfOfPaymentNoteRDLC(json) {
      var fs = require('fs');
      var Docxtemplater = require('docxtemplater');
      var filepath = Assets.absoluteFilePath(json.appType + '.docx');
      var content = fs.readFileSync(filepath, "binary");
      var doc = new Docxtemplater(content);
      doc.setData({
          'referenceNumber':json.referenceNumber,
          'SOC': json.SOC,
          'MOC': json.MOC,
          'genDate': json.generatedDate,
          'period': json.period,
          'totalNumber': json.totalNumber,
          'totalWord': json.totalWord
      });
      doc.render();
      var buffer = doc.getZip().generate({
          type: "nodebuffer"
      });
      fs.writeFileSync(process.env.PWD + '/.uploads/six_level/RLDC_Payment_Note/' + json.appType + '_' + json.financialYear + '_' + json.month +'_'+json.random+ '.docx', buffer);

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/RLDC_Payment_Note/' + json.appType + '_' + json.financialYear + '_' + json.month +'_'+json.random+ '.docx', '--outdir', process.env.PWD + '/.uploads/six_level/RLDC_Payment_Note']);
      command.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
          console.log('child process exited with code ' + code);
      });
      // Meteor.setTimeout(function() {
      //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/RLDC_Payment_Note/' + json.appType + '_' + json.financialYear + '_' + json.month +'_'+json.random+ '.docx');
      // }, 4000);
      console.log('MP Transmission Charges Payment Note PDF Generated');
  },
  pdfOfPaymentNoteRajasthanTransmission(json,random) {
      var fs = require('fs');
      var Docxtemplater = require('docxtemplater');
      var filepath = Assets.absoluteFilePath('trans_charge_Rajasthan.docx');
      var content = fs.readFileSync(filepath, "binary");
      var doc = new Docxtemplater(content);
      var mainArray = [];
      for (var i = 0; i < json.billNumber.length; i++) {
          var count = 1 + i;
          var jsonData = {
              'key0': count,
              'key1': json.billNumber[i],
              'key2': json.transPeriod[i],
              'key3': amountInComman(json.capacity[i]),
              'key4': json.dueDate[i],
              'key5': amountInComman(json.totalAmount[i]),
              'key6': amountInComman(json.excessPayment[i]),
              'key7': amountInComman(json.paymentAmount[i]),
              'key8': json.billDate[i]
          };
          mainArray.push(jsonData);
      }
      doc.setData({
          'tableData': mainArray,
          'genDate': moment().format('DD-MM-YYYY'),
          'invoiceRaisedDate': json.invoiceRaisedDateTC,
          'invoiceReceivedDate': json.invoiceReceivedDateTC,
          'rate': json.rate,
          'monthInWord': monthInWords(json.month),
          'year': json.year,
          'amountNumber': json.amount.amountNumber,
          'amountWords': json.amount.amountWords
      });
      doc.render();
      var buffer = doc.getZip().generate({
          type: "nodebuffer"
      });
      fs.writeFileSync(process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_Rajasthan'+ '_' + json.financialYear + '_' + json.month +"_"+random+ '.docx', buffer);

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_Rajasthan' + '_' + json.financialYear + '_' + json.month+"_"+random+'.docx', '--outdir', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note']);
      command.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
          console.log('child process exited with code ' + code);
      });
      // Meteor.setTimeout(function() {
      //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_Rajasthan' + '_' + json.financialYear + '_' + json.month +"_"+random+'.docx');
      // }, 4000);
      console.log('Rajasthan Transmission Charges Payment Note PDF Generated');
  },
  pdfOfPaymentNoteGujaratTransmission(json,random){
    var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
    var filepath = Assets.absoluteFilePath('trans_charge_GETCO.docx');
    var content = fs.readFileSync(filepath, "binary");
    var doc = new Docxtemplater(content);
    var mainArray = [];
    for (var i = 0; i < json.invoiceNumber.length; i++) {
        var array = [];
        array.push({
            'key1': json.invoiceNumber[i],
            'key2': amountInComman(json.invoiceAmount[i]),
            'key3': json.invoiceDate[i],
            'key4': json.dueDate[i],
            'key5': json.rate,
            'key6': json.numberOfdays,
            'key7': amountInComman(json.deduct[i]),
            'key8': amountInComman(json.paymentAmount[i]),
            'key10': json.raisedDate,
            'key11': json.recievedDate
        })
        mainArray.push(array);
    }
    doc.setData({
        'r1': mainArray[0],
        'r2': mainArray[1],
        'r3': mainArray[2],
        'r4': mainArray[3],
        'year': json.year,
        'referenceNumber': json.referenceNumber,
        'genDate': moment().format('DD-MM-YYYY'),
        'totInvoice': amountInComman(json.totalInvoiceAmount),
        'monthWord': json.monthWords,
        'totalNumber': json.amount.amountNumber,
        'totalWord': json.amount.amountWords
    });
    doc.render();
    var buffer = doc.getZip().generate({
        type: "nodebuffer"
    });
    fs.writeFileSync(process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_GETCO' + '_' + json.financialYear + '_' + json.month +"_"+random + '.docx', buffer);
    spawn = Npm.require('child_process').spawn;
    console.log("Executing post");
    command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_GETCO' + '_' + json.financialYear + '_' + json.month +"_"+random + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note']);
    command.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    command.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    command.on('exit', function(code) {
        console.log('child process exited with code ' + code);
    });
    // Meteor.setTimeout(function() {
    //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_GETCO' + '_' + json.financialYear + '_' + json.month +"_"+random + '.docx');
    // }, 4000);
    console.log('Gujarat Transmission Charges Payment Note PDF Generated');
  },
  pdfOfPaymentNoteMPTransmission(json,random){
    var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
    var filepath = Assets.absoluteFilePath('trans_charge_MP.docx');
    var content = fs.readFileSync(filepath, "binary");
    var doc = new Docxtemplater(content);
    var mainArray = [];
    for (var i = 0; i < 1; i++) {
        var count = 1 + i;
        var jsonData = {
            'key0': count,
            'key1': json.billNumber,
            'key2': json.transPeriod,
            'key3': amountInComman(json.capacity),
            'key4': json.dueDate,
            'key5': amountInComman(json.totalAmount),
            'key6': amountInComman(json.excessPayment),
            'key7': amountInComman(json.amountNumber),
            'key8': json.billDate
        };
        mainArray.push(jsonData);
    }
    doc.setData({
        'tableData': mainArray,
        'genDate': moment().format('DD-MM-YYYY'),
        'invoiceRaisedDateTC': json.invoiceRaisedDateTC,
        'monthWord': monthInWords(json.month),
        'year': json.year,
        'amountNumber': json.amountNumber,
        'amountWords': json.amountWords,
        'encloserDate': raisedDateFun(json.encloserDate)
    });
    doc.render();
    var buffer = doc.getZip().generate({
        type: "nodebuffer"
    });
    fs.writeFileSync(process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_MP' + '_' + json.financialYear + '_' + json.month +"_"+random + '.docx', buffer);
    spawn = Npm.require('child_process').spawn;
    console.log("Executing post");
    command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_MP' + '_' + json.financialYear + '_' + json.month +"_"+random + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note']);
    command.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    command.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    command.on('exit', function(code) {
        console.log('child process exited with code ' + code);
    });
    // Meteor.setTimeout(function() {
    //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/Transmission_Payment_Note/' + 'trans_charge_MP' + '_' + json.financialYear + '_' + json.month +"_"+random + '.docx');
    // }, 4000)
    console.log('MP Transmission Charges Payment Note PDF Generated');
  },
  pdfOfPaymentNoteRajasthanSLDC(json) {
      var invRecDate = raisedDateFunUsingDo(json.invoiceRecievedDate);
      var fs = require('fs');
      var Docxtemplater = require('docxtemplater');
      var filepath = Assets.absoluteFilePath('SLDC_charge.docx');
      var content = fs.readFileSync(filepath, "binary");
      var doc = new Docxtemplater(content);
      var mainArray = [];
      for (var i = 0; i < json.billNumber.length; i++) {
          var count = 1 + i;
          var jsonData = {
              'key0': count,
              'key1': json.billNumber[i],
              'key2': json.sldcPeriod[i],
              'key3': json.capacity[i],
              'key4': json.dueDate[i],
              'key5': json.amount[i],
              'key6': json.billDate[i],
          };
          mainArray.push(jsonData);
      }
      doc.setData({
          'tableData': mainArray,
          'invoiceRaisedDate':json.invRaisedDateVar,
          'invRecDate':invRecDate,
          'genDate': moment().format('DD.MM.YYYY'),
          'rate': json.rate,
          'period': json.periodFromTo,
          'amountNumber': json.amountNumber,
          'amountWords': json.amountWords
      });
      doc.render();
      var buffer = doc.getZip().generate({
          type: "nodebuffer"
      });
      fs.writeFileSync(process.env.PWD + '/.uploads/six_level/SLDC_Payment_Note/' + 'SLDC_charge' + '_' + json.financialYear + '_' + json.month +"_"+json.random + '.docx', buffer);

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/SLDC_Payment_Note/' + 'SLDC_charge' + '_' + json.financialYear + '_' + json.month+"_"+json.random + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level/SLDC_Payment_Note']);
      command.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
          console.log('child process exited with code ' + code);
      });
      // Meteor.setTimeout(function() {
      //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/SLDC_Payment_Note/' + 'SLDC_charge' + '_' + json.financialYear + '_' + json.month +"_"+json.random +'.docx');
      // }, 4000);
      console.log('Rajasthan SLDC Charges Payment Note PDF Generated');
  },
  pdfOfPaymentNoteRajasthanIncentive(json) {
      var fs = require('fs');
      var Docxtemplater = require('docxtemplater');
      var filepath = Assets.absoluteFilePath('incentive_charge.docx');
      var content = fs.readFileSync(filepath, "binary");
      var doc = new Docxtemplater(content);
      var mainArray = [];
      for (var i = 0; i < json.capacity.length; i++) {
          var jsonData = {
              'key0': json.serialNumber[i],
              'key1': json.capacity[i],
              'key2': json.byRVPN[i],
              'key3': json.bySECI[i],
              'key4': json.difference[i],
              'key5': json.remarks[i]
          };
          mainArray.push(jsonData)
      }

      var check = false;
      var createRemark = [];
      for (var i = 0; i < json.difference.length; i++) {
          if (Number(json.difference[i]) == 0) {} else {
              check = true;
              createRemark.push(i);
          }
      }
      var string = [];
      for (var i = 0; i < createRemark.length - 1; i++) {
          var set = createRemark[i];
          var val = Number([i]) + 1 + ') ' + json.remarks[set];
          string.push(val);
      }
      doc.setData({
          'tableData': mainArray,
          'genDate': moment().format('DD-MM-YYYY'),
          'year': json.year,
          'financialYear': json.financialYear,
          'totalNumber': json.amountNumber,
          'totalWord': json.amountWords,
          'referenceNumber': json.referenceNumber,
      });
      doc.render();
      var buffer = doc.getZip().generate({
          type: "nodebuffer"
      });
      fs.writeFileSync(process.env.PWD + '/.uploads/six_level/Incentive_Payment_Note/' + 'incentive_charge'+ '_' + json.financialYear+'_'+json.random+ '.docx', buffer);

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/Incentive_Payment_Note/' + 'incentive_charge' + '_' + json.financialYear +'_'+json.random+ '.docx', '--outdir', process.env.PWD + '/.uploads/six_level/Incentive_Payment_Note']);
      command.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
          console.log('child process exited with code ' + code);
      });
      // Meteor.setTimeout(function() {
      //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/Incentive_Payment_Note/' + 'incentive_charge' + '_' + json.financialYear +'_'+json.random+ '.docx');
      // }, 4000);
      console.log('Rajasthan Incentive Charges Payment Note PDF Generated');
  },
});

function difference(d1, d2) {
  var m = moment(d1);
  var years = m.diff(d2, 'years');
  m.add(-years, 'years');
  var months = m.diff(d2, 'months');
  m.add(-months, 'months');
  var days = m.diff(d2, 'days');
  return Number(months) + 1;
}

function amountInWords(amount){
      var changeWord = amount;
      if(changeWord < 0){
         changeWord = Number(-(amount)).toFixed(2);
      }
      var newChange = changeWord.split(".");
      var amountData = '';
      if (newChange[1] != "00") {
          var data1 = inWords(newChange[0]);
          var data2 = inWords(newChange[1]);
          amountData = data1 + ' ' + "and" + ' ' + data2 + ' ' + "Paisa only";
      } else {
          var data1 = inWords(newChange[0]);
          amountData = data1+ " only";
      }
      return amountData;
};

function inWords(num) {
    var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? '' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
};

function amountInComman(data) {
    var x = data;
    var returnData = x.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnData;
};

function amountInWords(amount) {
    var changeWord = amount;
    if (changeWord < 0) {
        changeWord = Number(-(amount)).toFixed(2);
    }
    var newChange = changeWord.split(".");
    var amountData = '';
    if (newChange[1] != "00") {
        var data1 = inWords(newChange[0]);
        var data2 = inWords(newChange[1]);
        amountData = data1 + ' ' + "and" + ' ' + data2 + ' ' + "Paisa only";
    } else {
        var data1 = inWords(newChange[0]);
        amountData = data1 + " only";
    }
    return amountData;
};

function inWords(num) {
    var a = [
        '',
        'One ',
        'Two ',
        'Three ',
        'Four ',
        'Five ',
        'Six ',
        'Seven ',
        'Eight ',
        'Nine ',
        'Ten ',
        'Eleven ',
        'Twelve ',
        'Thirteen ',
        'Fourteen ',
        'Fifteen ',
        'Sixteen ',
        'Seventeen ',
        'Eighteen ',
        'Nineteen '
    ];
    var b = [
        '',
        '',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety'
    ];
    if ((num = num.toString()).length > 9)
        return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n)
        return;
    var str = '';
    str += (n[1] != 0)
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore '
        : '';
    str += (n[2] != 0)
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh '
        : '';
    str += (n[3] != 0)
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand '
        : '';
    str += (n[4] != 0)
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred '
        : '';
    str += (n[5] != 0)
        ? ((str != '')
            ? ''
            : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
        : '';
    return str;
};

raisedDateFun = function(raisedDate) {
  var newDate = raisedDate.split("-");
  var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
  var result = moment(myObject).format('DD MMMM YYYY ');
  return result;
};
raisedDateFunUsingDo = function(raisedDate) {
  var newDate = raisedDate.split("-");
  var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
  var result = moment(myObject).format('Do MMMM YYYY ');
  return result;
};

Meteor.methods({
  "gettingSPLDStateListUniqForPaymentAdvice": function() {
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
      return returnSuccess('Getting SPD list For Payment Advice ', returnStateArr);
  },
  "gettingSPDListForPaymentAdvice": function(spdState) {
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
      return returnSuccess('Getting SPD list For Payment Advice',returnSPDArr);
  },
  gettingDataForPaymentAdvice: function(sdpId,spdName,spdState,financialYear,month){
    var getData = EnergyPaymentNoteDetails.find({delete_status:false,spd_id:sdpId,state:spdState,month:month,financialYear:financialYear}, {sort: {$natural: -1},limit: 1}).fetch();
    if (getData.length > 0) {
        return returnSuccess('Getting Data For Payment Advice',getData[0]);
    }else {
      return returnFaliure('Energy Payment Note Not Generated');
    }
  },
  generatePaymentAdviceForEnergy(spdId,json){
    var random = Math.floor((Math.random() * 10000) + 1).toString();
    var date = moment().format('DD.MM.YYYY');
    var year = moment().format('YYYY');
    var dateArr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var monthInWords = getArray(dateArr, json.month);
    var period = monthInWords+" "+year;
    var referenceNumber = 'SECI/Power Trading/'+ year + '/';
    var actualFileName = 'energyPaymentAdvice/Payment_Advice_of_'+json.spdName+'_'+monthInWords+'_'+random;
    var filepath = actualFileName+'.pdf';
    var pathDocx = actualFileName+'.docx';
    json.spdId = spdId,
    json.reference_number = referenceNumber,
    json.state = json.state,
    json.generatedDate = moment().format('DD-MM-YYYY'),
    json.file_path = filepath,
    json.file_path_docx = pathDocx,
    json.delete_status = false,
    json.type = 'Energy Payment Advice',
    json.timestamp = new Date()
    EnergyPaymentAdvice.insert(json);
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address:ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        log_type: 'Energy Payment Advice',
        template_name: 'paymentAdviceBySECI',
        event_name: 'generatePaymentAdviceForEnergy',
        action_date:moment().format('DD-MM-YYYY'),
        timestamp: new Date(),
        json:json
    });

    var dateArrInHindi = ['जनवरी','फ़रवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    var monthInHindi = getArray(dateArrInHindi, json.month);
    var periodInHindi = monthInHindi+" "+year;
    var referenceNumberInHindi = 'सेकी/पावर ट्रेडिंग/'+ year + '/';
    var getUserData = Meteor.users.find({_id:spdId}).fetch();
    json.send_to = getUserData[0].profile.registration_form.payment_advice_send_to;
    json.add_line1 = getUserData[0].profile.registration_form.address_line1;
    json.add_line2 = getUserData[0].profile.registration_form.address_line2;
    json.add_line3 = getUserData[0].profile.registration_form.address_line3;
    json.ppaDate = getUserData[0].profile.registration_form.ppa_date;
    json.referenceNumber = referenceNumber;
    json.generationDate = date;
    json.period = period;
    json.monthInWords = monthInWords;
    json.periodInHindi = periodInHindi;
    json.referenceNumberInHindi = referenceNumberInHindi;
    json.random = random;
    json.actualFileName = actualFileName;
    Meteor.call('generateEnergPaymentAdviceyPDF',json);
    return returnSuccess('Payment Advice PDF Generated',actualFileName);
  },
  generateEnergPaymentAdviceyPDF(json) {
      var fs = require('fs');
      var Docxtemplater = require('docxtemplater');
      var filepath = Assets.absoluteFilePath('Energy_Payment_Advice.docx');
      var content = fs.readFileSync(filepath, "binary");
      var doc = new Docxtemplater(content);
      doc.setData({
          'referenceNumber':json.referenceNumber,
          'geneDate':json.generationDate,
          'send_to':json.send_to,
          'spdName':json.spdName,
          'add_line1':json.add_line1,
          'add_line2':json.add_line2,
          'add_line3':json.add_line3,
          'state':json.state,
          'period':json.period,
          'ppaDate':json.ppaDate,
          'invoice_number':json.invoice_number,
          'dateOfReceipt':json.dateOfReceipt,
          'invoice_amount':Number(json.invoice_amount).toFixed(2),
          'paid_amount':Number(json.paid_amount).toFixed(2),
          'dateOfPayment':json.dateOfPayment,
          'ifdeduction':json.deducationIfAny,
          'reasonForDeduction':json.remarks,
          'referenceNumberInHindi':json.referenceNumberInHindi,
          'periodInHindi':json.periodInHindi,
      });
      doc.render();
      var buffer = doc.getZip().generate({
          type: "nodebuffer"
      });
      fs.writeFileSync(process.env.PWD + '/.uploads/'+json.actualFileName+'.docx', buffer);

      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/'+json.actualFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/energyPaymentAdvice']);
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
      //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/'+json.actualFileName+'.docx');
      // }, 4000);
      console.log('MP Transmission Charges Payment Note PDF Generated');
  },
  fetchingPaymentAdviceForEnergy(spdId,json){
    if (json.state == 'All') {
      if (json.spdName == 'All') {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year}).fetch();
      }else {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year,spdId:spdId}).fetch();
      }
    }else {
      if (json.spdName == 'All') {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year,state:json.state}).fetch();
      }else {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year,state:json.state,spdId:spdId}).fetch();
      }
    }
    return returnSuccess('Payment Advice PDF Generated',getData);
  },
  deleteGeneratedPaymentAdvice(docId,json){
    EnergyPaymentAdvice.update({_id:docId},{$set:{delete_status:true}});
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address:ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        log_type: 'Payment Advice Deleted',
        template_name: 'paymentAdviceBySECI',
        event_name: 'deletePaymentAdvice',
        action_date:moment().format('DD-MM-YYYY'),
        timestamp: new Date(),
        documentId:docId
    });
    if (json.state == 'All') {
      if (json.spdName == 'All') {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year}).fetch();
      }else {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year,spdId:json.spdId}).fetch();
      }
    }else {
      if (json.spdName == 'All') {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year,state:json.state}).fetch();
      }else {
        var getData = EnergyPaymentAdvice.find({delete_status:false,month:json.month,financial_year:json.financial_year,state:json.state,spdId:json.spdId}).fetch();
      }
    }
  return returnSuccess('Payment Advice Successfully Deleted!',getData);
  }
});

Meteor.methods({
  'getDiscomSchemeForSurcharge': function() {
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
    return returnSuccess('Discom List Arrar', ar);
  },
  gettingSurchargeFromEnergyInvoice(month,financialYear,discomId, discomState){
    var energyData = LogbookDiscom.find({'discomId': discomId,'financial_year': financialYear,'month': month}).fetch();
    var surChargeAmt = 0;
    if (energyData.length > 0) {
      energyData.forEach( function(invoiceItem) {
        surChargeAmt += Number(invoiceItem.sur_charge_amount);
      });
      var json = {
        invoiceNumber :  energyData[0].invoice_number,
        invoiceAmount :  energyData[0].amount_of_invoice,
        invoiceGenerationDate :  energyData[0].energy_invoice_generation_date,
        invoiceDueDate :  energyData[0].energy_invoice_due_date,
        dateOfPayment :  energyData[0].date_of_payment,
        surChargeAmt :  Number(surChargeAmt).toFixed(2),
      };
      return returnSuccess("Invoice Data Found!",json);
    }else {
      return returnFaliure("Invoice details not submitted to logbook!");
    }
  },
  'getDiscomForSurcharge': function(discomScheme) {
    var discomNameVar = [];
    var data = Discom.find({
      "scheme": discomScheme
    }).fetch();
    data.forEach(function(item) {
      discomNameVar.push({
        discomId: item._id,
        state: item.discom_state
      });
    });
    var ar = discomNameVar.sort(function(a, b) {
      var nA = a.state.toLowerCase();
      var nB = b.state.toLowerCase();
      if (nA < nB)
        return -1;
      else if (nA > nB)
        return 1;
      return 0;
    });
    return returnSuccess('Discom List Arrar', ar);
  },
  'gettingDiscomDataTableEnergy': function(month, financialYear, discomId, discomState,signatureJson) {
    var j = 0;
    var count = 0;
    var chooseDate = 0;
    var lastdays = 0;
    var totalSurchargeAmt = 0;
    var jsonFinal = {};
    var jsonFinal1 = {};
    var surchargeEng = [];
    var yearMade = 0;
    var dueDate = moment().format('DD-MM-YYYY');
    var data1 = Discom.find({'_id': discomId}).fetch();
    if (data1.length > 0) {
      jsonFinal1 = {
        'invoiceRaisedTo':data1[0].invoice_raised_to,
        'discomName':data1[0].nameof_buyingutility,
        'shortName': data1[0].discom_short_name,
        'address':data1[0].discom_address,
        'addressLineTwo':data1[0].discom_address_line_two,
        'city':data1[0].discom_city,
        'state':data1[0].discom_state,
        'pin':data1[0].discom_pin,
        'psaDate':data1[0].date_of_amendment_one,
        'psaDate2':data1[0].date_of_amendment_two,
        'gstNumber': data1[0].gst_number,
        'financialYear': financialYear,
      };
    }
    var data = LogbookDiscom.find({
      'discomId': discomId,
      'financial_year': financialYear,
      'month': month
    }).fetch();
    var monthSelected = monthInWords(month);
    jsonFinal1.monthMade = monthSelected;
    var resultFinal;
    if (data.length == 0) {
      resultFinal = false;
    } else {
      var dataForPdf = data.filter(function(item) {
        if (Number(item.sur_charge_amount) == 0) {
          return false;
        } else if (Number(item.sur_charge_amount) > 0) {
          return true;
        }
      })
      if (dataForPdf.length == 0) {
        resultFinal = false;
      } else {
        var json = {};
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = '/Invoices/Surcharge/EnergySurcharge/'+discomState+'_'+month+'_'+financialYear+'_'+random;
        dataForPdf.forEach(function(item) {
          var year = dataForPdf[0].year;
          jsonFinal1.yearMade = year;
          jsonFinal1.referenceNo = "SECI/PT/"+data1[0].discom_short_name+"/"+year+"/";
          yearMade = dataForPdf[0].year.substr(-2)
          // var pdfFileName = "file:///" +process.env.UPLOAD_DIR.replace(/\\/g, "/")+'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'_'+'.pdf';
          j++;
          json = {
            'InvoiceNo': item.invoice_number,
            'InvoiceValue': item.total_energy,
            'AmountReceived': item.payment_amount,
            'InvoiceDate': item.energy_invoice_generation_date,
            'DueDate': item.energy_invoice_due_date,
            'paymentReceDate': item.date_of_payment,
            'surchargeRate': '1.25%',
            'surchargeAmt': item.sur_charge_amount,
            'discomId': item.discomId,
            'file_path': pdfFileName,
            'delete_status': false,
            'timestamp': new Date()
          };
          json.month = month;
          json.financial_year = financialYear;
          json.discomState = discomState;
          lastdays = moment('"' + year + '-' + item.month + '"', "YYYY-MM").daysInMonth()
          json.serialNo = j;
          totalSurchargeAmt += Number(Number(item.sur_charge_amount).toFixed(2));
          surchargeEng.push(json)
          SurchargeEnergy.insert(json);
        })
        var startDate = new Date();
        var endDateMoment = moment(startDate);
        endDateMoment.add(1, 'months');
        var periodOpen = "01-" + monthSelected + "-" + yearMade
        var periodClos = lastdays + "-" + monthSelected + "-" + yearMade;
        var currentdate = moment().format('DD-MM-YYYY');
        var totalAmtInWords = amountInWords(Number(totalSurchargeAmt).toFixed(2));
        jsonFinal = {
          key1: surchargeEng,
          key2: totalSurchargeAmt,
          key3: json.InvoiceNo,
          'periodOpen': periodOpen,
          'periodClos': periodClos,
          'currentDate': moment().format('DD-MM-YYYY'),
          'dueDate': moment(endDateMoment).format('DD-MM-YYYY'),
          'discomState': discomState,
          'totalAmtInWords': totalAmtInWords
        };
        var pathis;
        Meteor.call('genetratePdfForEnergySurcharge', jsonFinal, jsonFinal1, pdfFileName,signatureJson, function(error, result) {
          if (error) {
            console.log("error is showing===> line 172");
          } else {
            console.log("line no.174" + result);
            pathis = result;
          }
        });
        resultFinal = pathis;
      }
    }
    return resultFinal;
  },
  genetratePdfForEnergySurcharge(jsonFinal, jsonFinal1,pdfFileName,signatureJson) {
    var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
    var filepath = Assets.absoluteFilePath('SurchargeInvoiceNew2.docx');
    var content = fs.readFileSync(filepath, "binary");
    var doc = new Docxtemplater(content);
    doc.setData({
      'name': signatureJson.name,
      'designation': signatureJson.designation,
      'fullForm': signatureJson.full_form,
      'phone': signatureJson.phone,
      'surchargeEng': jsonFinal.key1,
      'total': jsonFinal.key2,
      'InvoiceNo': jsonFinal.key3,
      'periodOpen': jsonFinal.periodOpen,
      'periodClos': jsonFinal.periodClos,
      'dueDate': jsonFinal.dueDate,
      'currentDate': jsonFinal.currentDate,
      'totalAmtInWords': jsonFinal.totalAmtInWords,
      'invoiceRaisedTo':jsonFinal1.invoiceRaisedTo,
      'discomName':jsonFinal1.discomName,
      'shortName': jsonFinal1.shortName,
      'address':jsonFinal1.address,
      'addressLineTwo':jsonFinal1.addressLineTwo,
      'city':jsonFinal1.city,
      'state':jsonFinal1.state,
      'pin':jsonFinal1.pin,
      'psaDate':jsonFinal1.psaDate,
      'psaDate2':jsonFinal1.psaDate2,
      'gstNumber': jsonFinal1.gstNumber,
      'financialYear': jsonFinal1.financialYear,
      'yearMade': jsonFinal1.yearMade,
      'monthMade': jsonFinal1.monthMade,
      'discomState': jsonFinal1.discomState,
      'financialYear': jsonFinal1.financialYear,
      'referenceNo': jsonFinal1.referenceNo,
      'invType1': 'ENERGY',
      'invType2': 'Energy',
      'invType3': 'energy',
    })
    doc.render();
    var buffer = doc.getZip().generate({
      type: "nodebuffer"
    });
    // fs.writeFileSync(process.env.UPLOAD_DIR + '/surcharge' + '_' + jsonFinal1.financialYear + '_' + jsonFinal1.monthMade + '_' + jsonFinal1.discomState + '.docx', buffer);
    fs.writeFileSync(process.env.PWD +'/.uploads/'+pdfFileName+'.docx', buffer);
    spawn = Npm.require('child_process').spawn;
    console.log("Executing post");
    if (/^win/.test(process.platform)) {
      command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', process.env.UPLOAD_DIR + '/surcharge' + '_' + jsonFinal1.financialYear + '_' + jsonFinal1.monthMade + '_' + jsonFinal1.discomState + '.docx', '--outdir', process.env.UPLOAD_DIR + "/surcharge" + '_' + jsonFinal1.financialYear + '_' + jsonFinal1.monthMade + '_' + jsonFinal1.discomState + ".pdf"]);
    } else {
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD +'/.uploads/'+pdfFileName+ '.docx', '--outdir', process.env.PWD+ '/.uploads/Invoices/Surcharge/EnergySurcharge']);
    }
    command.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    });
    command.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });
    command.on('exit', function(code) {
      console.log('child process exited with code ' + code);
    });
    console.log('line no. 148 == Energy Invoice Payment Note PDF Generated');
    // console.log("line no 111" + process.env.UPLOAD_DIR);
    // var filePath = process.env.UPLOAD_DIR
    // var file = "file:///" + filePath.replace(/\\/g, "/") + "/surcharge" + '_' + jsonFinal1.financialYear + '_' + jsonFinal1.monthMade + '_' + jsonFinal1.discomState + ".pdf";
    var file = '/upload/'+pdfFileName+ '.pdf'
    // Meteor.setTimeout(function() {
    //     Meteor.call('deleteUploadedFile', process.env.PWD+'/.uploads/'+pdfFileName+'.docx');
    // }, 12000);
    return file;
  },
  'getDiscomStateTrans': function(spdState) {
    var spdArr = [];
    var discomData = Discom.find({}).fetch();
    if (spdState == 'Gujarat') {
      discomData.forEach(function(itemData) {
        itemData.spdIds.forEach(function(item) {
          if (item.transaction_type == 'Inter' && item.spdState == 'Gujarat') {
            spdArr.push(itemData.discom_state);
            // spdArr.push(itemData._id);
          }
        });
      });
    } else if (spdState == 'Rajasthan') {
      discomData.forEach(function(itemData) {
        itemData.spdIds.forEach(function(item) {
          if (item.transaction_type == 'Inter' && item.spdState == 'Rajasthan') {
            spdArr.push(itemData.discom_state);
              // spdArr.push(itemData._id);
          }
        });
      });
    } else if (spdState == 'MP') {
      discomData.forEach(function(itemData) {
        itemData.spdIds.forEach(function(item) {
          if (item.transaction_type == 'Inter' && item.spdState == 'MP') {
            if (itemData.discom_state == 'Bihar') {
              spdArr.push("North " + itemData.discom_state);
              spdArr.push("South " + itemData.discom_state);
            } else {
              spdArr.push(itemData.discom_state);
            }
          }
        });
      });
    }
    return returnSuccess('Found discomTrans List', _.uniq(spdArr));
  },
  gettingSurchargeFromTransmInvoice(month,financialYear,discomState){
    var transData = LogbookTransmission.find({'discom_state': discomState,'financial_year': financialYear,'month': month}).fetch();
    var surChargeAmt = 0;
    if (transData.length > 0) {
      transData.forEach( function(invoiceItem) {
        surChargeAmt += Number(invoiceItem.sur_charge_amount);
      });
      var json = {
        invoiceNumber :  transData[0].invoice_number,
        invoiceAmount :  transData[0].total_transmission_invoice,
        invoiceGenerationDate :  transData[0].generation_date,
        invoiceDueDate :  transData[0].due_date,
        dateOfPayment :  transData[0].date_of_payment,
        surChargeAmt :  Number(surChargeAmt).toFixed(2),
      };
      return returnSuccess("Invoice Data Found!",json);
    }else {
      return returnFaliure("Invoice details not submitted to logbook!");
    }
  },
  'gettingDiscomDataTableTrans': function(month, discomState, financialYear,signatureJson) {
    var j = 0;
    var count = 0;
    var chooseDate = 0;
    var lastdays = 0;
    var totalSurchargeAmt = 0;
    var jsonFinal = {};
    var jsonFinal1 = {};
    var surchargeTrans = [];
    var yearMade = 0;
    var dueDate = moment().format('DD-MM-YYYY');
    var dataForDiscom;
    if (discomState == 'North Bihar' || discomState == 'South Bihar') {
      dataForDiscom = Discom.find({
        'discom_state': 'Bihar'
      }).fetch();
    } else {
      dataForDiscom = Discom.find({
        'discom_state': discomState
      }).fetch();
    }
    if (dataForDiscom.length > 0) {
      jsonFinal1 = {
        'invoiceRaisedTo':dataForDiscom[0].invoice_raised_to,
        'discomName':dataForDiscom[0].nameof_buyingutility,
        'shortName': dataForDiscom[0].discom_short_name,
        'address':dataForDiscom[0].discom_address,
        'addressLineTwo':dataForDiscom[0].discom_address_line_two,
        'city':dataForDiscom[0].discom_city,
        'state':dataForDiscom[0].discom_state,
        'pin':dataForDiscom[0].discom_pin,
        'psaDate':dataForDiscom[0].date_of_amendment_one,
        'psaDate2':dataForDiscom[0].date_of_amendment_two,
        'gstNumber': dataForDiscom[0].gst_number,
        'financialYear': financialYear,
      };
    }
    var dataForTransPdf = [];
    if (discomState == 'North Bihar' || discomState == 'South Bihar') {
       dataForTransPdf = LogbookTransmission.find({
        'discom_state': 'Bihar',
        'region': discomState,
        'financial_year': financialYear,
        'month': month
      }).fetch();
    } else {
      dataForTransPdf = LogbookTransmission.find({
        'discom_state': discomState,
        'financial_year': financialYear,
        'month': month
      }).fetch();
    }

    var resultFinal;
    var monthSelected = monthInWords(month);
    jsonFinal1.monthMade = monthSelected;
    if (dataForTransPdf.length == 0) {
      resultFinal = false;
    } else {
      var dataForPdf = dataForTransPdf.filter(function(item) {
        if (Number(item.sur_charge_amount) == 0) {
          return false;
        } else if (Number(item.sur_charge_amount) > 0) {
          return true;
        }
      })
      if (dataForPdf.length == 0) {
        resultFinal = false;
      } else {
        var json = {};
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = '/Invoices/Surcharge/TransmissionSurcharge/'+discomState+'_'+month+'_'+financialYear+'_'+random;
        var year = dataForPdf[0].year;
        jsonFinal1.referenceNo = "SECI/PT/"+dataForDiscom[0].discom_short_name+"/"+year+"/";
        jsonFinal1.yearMade = year;
        yearMade = dataForPdf[0].year.substr(-2)
        // var pdfFileName = "file:///" +process.env.UPLOAD_DIR.replace(/\\/g, "/")+'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'.pdf';
        dataForPdf.forEach(function(item) {
          j++;
          json = {
            'InvoiceNo': item.invoice_number,
            'InvoiceValue': item.total_energy_or_project_capicity,
            'AmountReceived': item.payment_amount,
            'InvoiceDate': item.generation_date,
            'DueDate': item.due_date,
            'paymentReceDate': item.date_of_payment,
            'surchargeRate': '1.25%',
            'surchargeAmt': item.sur_charge_amount,
            'discomId': item.discomId,
            'file_path': pdfFileName,
            'delete_status': false,
            'timestamp': new Date()
          };
          json.month = month;
          json.financial_year = financialYear;
          json.discomState = discomState;
          lastdays = moment('"' + year + '-' + item.month + '"', "YYYY-MM").daysInMonth()
          json.serialNo = j;
          totalSurchargeAmt += Number(Number(item.sur_charge_amount).toFixed(2));
          surchargeTrans.push(json)
          SurchargeTransmission.insert(json);
        })
        var startDate = new Date();
        var endDateMoment = moment(startDate);
        endDateMoment.add(1, 'months');
        var periodOpen = "01-" + monthSelected + "-" + yearMade
        var periodClos = lastdays + "-" + monthSelected + "-" + yearMade;
        var currentdate = moment().format('DD-MM-YYYY');
        var totalAmtInWords = amountInWords(Number(totalSurchargeAmt).toFixed(2));
        jsonFinal = {
          key1: surchargeTrans,
          key2: totalSurchargeAmt,
          key3: json.InvoiceNo,
          'periodOpen': periodOpen,
          'periodClos': periodClos,
          'currentDate': moment().format('DD-MM-YYYY'),
          'dueDate': moment(endDateMoment).format('DD-MM-YYYY'),
          'discomState': discomState,
          'totalAmtInWords': totalAmtInWords
        };
        var pathis;
        Meteor.call('genetratePdfForSurchargeTrans', jsonFinal, jsonFinal1, pdfFileName,signatureJson, function(error, result) {
          if (error) {
            console.log("error is showing===> line 126");
          } else {
            console.log("line no.128" + result);
            pathis = result;
          }
        });
        resultFinal = pathis;
      }
    }
    return resultFinal;
  },
  genetratePdfForSurchargeTrans(jsonFinal, jsonFinal1,pdfFileName,signatureJson) {
    var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
    var filepath = Assets.absoluteFilePath('SurchargeInvoiceNew2.docx');
    var content = fs.readFileSync(filepath, "binary");
    var doc = new Docxtemplater(content);
    doc.setData({
      'name': signatureJson.name,
      'designation': signatureJson.designation,
      'fullForm': signatureJson.full_form,
      'phone': signatureJson.phone,
      'surchargeEng': jsonFinal.key1,
      'total': jsonFinal.key2,
      'InvoiceNo': jsonFinal.key3,
      'periodOpen': jsonFinal.periodOpen,
      'periodClos': jsonFinal.periodClos,
      'dueDate': jsonFinal.dueDate,
      'currentDate': jsonFinal.currentDate,
      'totalAmtInWords': jsonFinal.totalAmtInWords,
      'invoiceRaisedTo':jsonFinal1.invoiceRaisedTo,
      'discomName':jsonFinal1.discomName,
      'shortName': jsonFinal1.shortName,
      'address':jsonFinal1.address,
      'addressLineTwo':jsonFinal1.addressLineTwo,
      'city':jsonFinal1.city,
      'state':jsonFinal1.state,
      'pin':jsonFinal1.pin,
      'psaDate':jsonFinal1.psaDate,
      'psaDate2':jsonFinal1.psaDate2,
      'gstNumber': jsonFinal1.gstNumber,
      'financialYear': jsonFinal1.financialYear,
      'yearMade': jsonFinal1.yearMade,
      'monthMade': jsonFinal1.monthMade,
      'discomState': jsonFinal1.discomState,
      'financialYear': jsonFinal1.financialYear,
      'referenceNo': jsonFinal1.referenceNo,
      'invType1': 'TRANSMISSION',
      'invType2': 'Transmission',
      'invType3': 'transmission',
    })
    doc.render();
    var buffer = doc.getZip().generate({
      type: "nodebuffer"
    });
    fs.writeFileSync(process.env.PWD +'/.uploads/'+pdfFileName+'.docx', buffer);
    // fs.writeFileSync(process.env.UPLOAD_DIR +'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'.docx', buffer);
    spawn = Npm.require('child_process').spawn;
    console.log("Executing post");
    if (/^win/.test(process.platform)) {
      command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', process.env.UPLOAD_DIR +'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'.docx', '--outdir', process.env.UPLOAD_DIR +"/surcharge"+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+".pdf"]);
    } else {
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD +'/.uploads/'+pdfFileName+ '.docx', '--outdir', process.env.PWD+ '/.uploads/Invoices/Surcharge/TransmissionSurcharge']);
    }
    command.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    });
    command.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });
    command.on('exit', function(code) {
      console.log('child process exited with code ' + code);
    });
    var file = '/upload/'+pdfFileName+'.pdf'
    // Meteor.setTimeout(function() {
    //     Meteor.call('deleteUploadedFile', process.env.PWD+'/.uploads/'+pdfFileName+'.docx');
    // }, 12000);
    return file;
  },
  //getting discom state for Incentive Surcharge
  "discomStateForIncen": function() {
    var returnArr = [];
    var data = Discom.find({
      transaction_type: 'Inter'
    }).fetch();
    data.forEach(function(item) {
      item.spdIds.forEach(function(spdDet) {
        if (spdDet.spdState == 'Rajasthan') {
          returnArr.push(item.discom_state);
        }
      });
    });
    var returnData = _.uniq(returnArr);
    return returnSuccess('Successfully sent discomSate for incentive', returnData);
  },
  gettingSurchargeFromIncentiveInvoice(month,financialYear,discomState){
    var incentiveData = LogbookIncentive.find({'discom_state': discomState,'financial_year': financialYear,'month': month}).fetch();
    var surChargeAmt = 0;
    if (incentiveData.length > 0) {
      incentiveData.forEach( function(invoiceItem) {
        surChargeAmt += Number(invoiceItem.sur_charge_amount);
      });
      var json = {
        invoiceNumber :  incentiveData[0].invoice_number,
        invoiceAmount :  incentiveData[0].incentive_charges,
        invoiceGenerationDate :  incentiveData[0].generation_date,
        invoiceDueDate :  incentiveData[0].due_date,
        dateOfPayment :  incentiveData[0].date_of_payment,
        surChargeAmt :  Number(surChargeAmt).toFixed(2),
      };
      return returnSuccess("Invoice Data Found!",json);
    }else {
      return returnFaliure("Invoice details not submitted to logbook!");
    }
  },
  //generate pdf for Incentive Surcharge
  'gettingDiscomDataTableIncentive': function(month, discomState, financialYear, signatureJson) {
    var j = 0;
    var count = 0;
    var chooseDate = 0;
    var lastdays = 0;
    var totalSurchargeAmt = 0;
    var jsonFinal = {};
    var jsonFinal1 = {};
    var surchargeIncen = [];
    var yearMadeAgain = 0;
    var dueDate = moment().format('DD-MM-YYYY');
    var data1 = Discom.find({
      'discom_state': discomState
    }).fetch();
    if (data1.length > 0) {
      jsonFinal1 = {
        'invoiceRaisedTo':data1[0].invoice_raised_to,
        'discomName':data1[0].nameof_buyingutility,
        'shortName': data1[0].discom_short_name,
        'address':data1[0].discom_address,
        'addressLineTwo':data1[0].discom_address_line_two,
        'city':data1[0].discom_city,
        'state':data1[0].discom_state,
        'pin':data1[0].discom_pin,
        'psaDate':data1[0].date_of_amendment_one,
        'psaDate2':data1[0].date_of_amendment_two,
        'gstNumber': data1[0].gst_number,
        'financialYear': financialYear,
      };
}
    var monthSelected = monthInWords(month);
    jsonFinal1.monthMade = monthSelected;
    var data = LogbookIncentive.find({
      'discom_state': discomState,
      'financial_year': financialYear,
      'month': month
    }).fetch();
    var resultFinal;
    if (data.length == 0) {
      resultFinal = false;
    } else {
      var dataForPdf = data.filter(function(item) {
        if (Number(item.sur_charge_amount) == 0) {
          return false;
        } else if (Number(item.sur_charge_amount) > 0) {
          return true;
        }
      })
      if (dataForPdf.length == 0) {
        resultFinal = false;
      } else {
        var json = {};
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = '/Invoices/Surcharge/IncentiveSurcharge/'+discomState+'_'+month+'_'+financialYear+'_'+random;
        dataForPdf.forEach(function(item) {
          var year = dataForPdf[0].financial_year;
          var yearMade = dataForPdf[0].financial_year.slice(0, 4);
          jsonFinal1.yearMade = yearMade;
          jsonFinal1.referenceNo = "SECI/PT/"+data1[0].discom_short_name+"/"+yearMade+"/";
          yearMadeAgain = yearMade.substr(-2);
          jsonFinal1.yearMadeAgain = yearMadeAgain;
          // var random = Math.floor((Math.random() * 10000) + 1).toString();
          // var pdfFileName = "file:///" +process.env.UPLOAD_DIR.replace(/\\/g, "/")+'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'_'+'.pdf';
          j++;
          json = {
            'InvoiceNo': item.invoice_number,
            'InvoiceValue': item.capacity,
            'AmountReceived': item.payment_amount,
            'InvoiceDate': item.generation_date,
            'DueDate': item.due_date,
            'paymentReceDate': item.date_of_payment,
            'surchargeRate': '1.25%',
            'surchargeAmt': item.sur_charge_amount,
            'discomId': item.discomId,
            'file_path': pdfFileName,
            'delete_status': false,
            'timestamp': new Date()
          };
          json.month = month;
          json.discomState = discomState;
          json.financial_year = financialYear;
          lastdays = moment('"' + yearMade + '-' + item.month + '"', "YYYY-MM").daysInMonth()
          json.serialNo = j;
          totalSurchargeAmt += Number(Number(item.sur_charge_amount).toFixed(2));
          surchargeIncen.push(json)
          SurchargeIncentive.insert(json);
        })
        var startDate = new Date();
        var endDateMoment = moment(startDate);
        endDateMoment.add(1, 'months');
        var periodOpen = "01-" + monthSelected + "-" + yearMadeAgain;
        var periodClos = lastdays + "-" + monthSelected + "-" + yearMadeAgain;
        var currentdate = moment().format('DD-MM-YYYY');
        var totalAmtInWords = amountInWords(Number(totalSurchargeAmt).toFixed(2));
        jsonFinal = {
          key1: surchargeIncen,
          key2: totalSurchargeAmt,
          key3: json.InvoiceNo,
          'periodOpen': periodOpen,
          'periodClos': periodClos,
          'currentDate': moment().format('DD-MM-YYYY'),
          'dueDate': moment(endDateMoment).format('DD-MM-YYYY'),
          'discomState': discomState,
          'totalAmtInWords': totalAmtInWords
        };
        var pathis;
        Meteor.call('genetratePdfForSurchargeIncen', jsonFinal, jsonFinal1, pdfFileName,signatureJson, function(error, result) {
          if (error) {
            console.log("Error is showing===> line 659");
          } else {
            console.log("line no.128" + result);
            pathis = result;
          }
        });
        resultFinal = pathis;
      }
    }
    return resultFinal;
  },
  genetratePdfForSurchargeIncen(jsonFinal, jsonFinal1, pdfFileName, signatureJson) {
    var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
    var filepath = Assets.absoluteFilePath('SurchargeInvoiceNew2.docx');
    var content = fs.readFileSync(filepath, "binary");
    var doc = new Docxtemplater(content);
    doc.setData({
      'name': signatureJson.name,
      'designation': signatureJson.designation,
      'fullForm': signatureJson.full_form,
      'phone': signatureJson.phone,
      'surchargeEng': jsonFinal.key1,
      'total': jsonFinal.key2,
      'InvoiceNo': jsonFinal.key3,
      'periodOpen': jsonFinal.periodOpen,
      'periodClos': jsonFinal.periodClos,
      'dueDate': jsonFinal.dueDate,
      'currentDate': jsonFinal.currentDate,
      'totalAmtInWords': jsonFinal.totalAmtInWords,
      'invoiceRaisedTo':jsonFinal1.invoiceRaisedTo,
      'discomName':jsonFinal1.discomName,
      'shortName': jsonFinal1.shortName,
      'address':jsonFinal1.address,
      'addressLineTwo':jsonFinal1.addressLineTwo,
      'city':jsonFinal1.city,
      'state':jsonFinal1.state,
      'pin':jsonFinal1.pin,
      'psaDate':jsonFinal1.psaDate,
      'psaDate2':jsonFinal1.psaDate2,
      'gstNumber': jsonFinal1.gstNumber,
      'financialYear': jsonFinal1.financialYear,
      'yearMade': jsonFinal1.yearMade,
      'monthMade': jsonFinal1.monthMade,
      'discomState': jsonFinal1.discomState,
      'financialYear': jsonFinal1.financialYear,
      'referenceNo': jsonFinal1.referenceNo,
      'invType1': 'INCENTIVE',
      'invType2': 'Incentive',
      'invType3': 'incentive',
    })
    doc.render();
    var buffer = doc.getZip().generate({
      type: "nodebuffer"
    });
    fs.writeFileSync(process.env.PWD +'/.uploads/'+pdfFileName+'.docx', buffer);
    // fs.writeFileSync(process.env.UPLOAD_DIR +'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'.docx', buffer);
    spawn = Npm.require('child_process').spawn;
    console.log("Executing post");
    if (/^win/.test(process.platform)) {
      command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', process.env.UPLOAD_DIR +'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'.docx', '--outdir', process.env.UPLOAD_DIR + "/surcharge"+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+".pdf"]);
    } else {
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD +'/.uploads/'+pdfFileName+ '.docx', '--outdir', process.env.PWD+ '/.uploads/Invoices/Surcharge/IncentiveSurcharge']);
     }
      command.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    });
    command.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });
    command.on('exit', function(code) {
      console.log('child process exited with code ' + code);
    });
    var file = '/upload/'+pdfFileName+'.pdf'
    // Meteor.setTimeout(function() {
    //     Meteor.call('deleteUploadedFile', process.env.PWD+'/.uploads/'+pdfFileName+'.docx');
    // }, 12000);
    return file;
  },
  //getting discom state for SLDC Surcharge
  "discomStateForSLDC": function() {
    var returnArr = [];
    var data = Discom.find({
      transaction_type: 'Inter'
    }).fetch();
    data.forEach(function(item) {
      item.spdIds.forEach(function(spdDet) {
        if (spdDet.spdState == 'Rajasthan') {
          returnArr.push(item.discom_state);
          // returnArr.push(item._id);
        }
      });
    });
    var returnData = _.uniq(returnArr);
    return returnSuccess('Successfully sent discomSate for SLDC', returnData);
  },
  gettingSurchargeFromSLDCInvoice(month,financialYear,discomState){
    var sldcData = LogbookSLDC.find({'discom_state': discomState,'financial_year': financialYear,'month': month}).fetch();
    var surChargeAmt = 0;
    if (sldcData.length > 0) {
      sldcData.forEach( function(invoiceItem) {
        surChargeAmt += Number(invoiceItem.sur_charge_amount);
      });
      var json = {
        invoiceNumber :  sldcData[0].invoice_number,
        invoiceAmount :  sldcData[0].total_amount,
        invoiceGenerationDate :  sldcData[0].generation_date,
        invoiceDueDate :  sldcData[0].due_date,
        dateOfPayment :  sldcData[0].date_of_payment,
        surChargeAmt :  Number(surChargeAmt).toFixed(2),
      };
      return returnSuccess("Invoice Data Found!",json);
    }else {
      return returnFaliure("Invoice details not submitted to logbook!");
    }
  },
  //generate pdf for SLDC Surcharge
  'gettingDiscomDataTableSLDC': function(month, discomState, financialYear,signatureJson) {
    var j = 0;
    var count = 0;
    var chooseDate = 0;
    var lastdays = 0;
    var totalSurchargeAmt = 0;
    var jsonFinal = {};
    var jsonFinal1 = {};
    var surchargeSLDC = [];
    var yearMadeAgain = 0;
    var dueDate = moment().format('DD-MM-YYYY');
    var data1 = Discom.find({
      'discom_state': discomState
    }).fetch();
    if (data1.length > 0) {
      jsonFinal1 = {
        'invoiceRaisedTo':data1[0].invoice_raised_to,
        'discomName':data1[0].nameof_buyingutility,
        'shortName': data1[0].discom_short_name,
        'address':data1[0].discom_address,
        'addressLineTwo':data1[0].discom_address_line_two,
        'city':data1[0].discom_city,
        'state':data1[0].discom_state,
        'pin':data1[0].discom_pin,
        'psaDate':data1[0].date_of_amendment_one,
        'psaDate2':data1[0].date_of_amendment_two,
        'gstNumber': data1[0].gst_number,
        'financialYear': financialYear,
      };
    }
    var data = LogbookSLDC.find({
      'discom_state': discomState,
      'financial_year': financialYear,
      'month': month
    }).fetch();
    var monthSelected = monthInWords(month);
    jsonFinal1.monthMade = monthSelected;
    var resultFinal;
    if (data.length == 0) {
      resultFinal = false;
    } else {
      var dataForPdf = data.filter(function(item) {
        if (Number(item.sur_charge_amount) == 0) {
          return false;
        } else if (Number(item.sur_charge_amount) > 0) {
          return true;
        }
      })
      if (dataForPdf.length == 0) {
        resultFinal = false;
      } else {

        var json = {};
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = '/Invoices/Surcharge/SLDCSurcharge/'+discomState+'_'+month+'_'+financialYear+'_'+random;
        var year1 = dataForPdf[0].year;
        jsonFinal1.year = year1;
        jsonFinal1.referenceNo = "SECI/PT/"+data1[0].discom_short_name+"/"+year1+"/";
        yearMade = dataForPdf[0].year.substr(-2)
        jsonFinal1.yearMade = yearMade;
        // var pdfFileName = "file:///" + filePath.replace(/\\/g, "/")+'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'_'+'.pdf';
        data.forEach(function(item) {
          j++;
          json = {
            'InvoiceNo': item.invoice_number,
            'InvoiceValue': item.project_capicity,
            'AmountReceived': item.payment_amount,
            'InvoiceDate': item.generation_date,
            'DueDate': item.due_date,
            'paymentReceDate': item.date_of_payment,
            'surchargeRate': '1.25%',
            'surchargeAmt': item.sur_charge_amount,
            'discomId': item.discomId,
            'file_path': pdfFileName,
            'delete_status': false,
            'timestamp': new Date()
          };
          json.month = month;
          json.financial_year = financialYear;
          json.discomState = discomState;
          lastdays = moment('"'+ yearMade+'-'+item.month+'"', "YYYY-MM").daysInMonth()
          json.serialNo = j;
          totalSurchargeAmt += Number(Number(item.sur_charge_amount).toFixed(2));
          surchargeSLDC.push(json)
          SurchargeSLDC.insert(json);
        })
        var startDate = new Date();
        var endDateMoment = moment(startDate);
        endDateMoment.add(1, 'months');
        var periodOpen = "01-" + monthSelected + "-" + yearMade;
        var periodClos = lastdays + "-" + monthSelected + "-" + yearMade;
        var currentdate = moment().format('DD-MM-YYYY');
        var totalAmtInWords = amountInWords(Number(totalSurchargeAmt).toFixed(2));
        jsonFinal = {
          key1: surchargeSLDC,
          key2: totalSurchargeAmt,
          key3: json.InvoiceNo,
          'periodOpen': periodOpen,
          'periodClos': periodClos,
          'currentDate': moment().format('DD-MM-YYYY'),
          'dueDate': moment(endDateMoment).format('DD-MM-YYYY'),
          'discomState': discomState,
          'totalAmtInWords': totalAmtInWords
        };
        var pathis;
        Meteor.call('genetratePdfForSurchargeSLDC', jsonFinal, jsonFinal1, pdfFileName,signatureJson, function(error, result) {
          if (error) {
            console.log("error is showing===> line 126");
          } else {
            console.log("line no.128" + result);
            pathis = result;
          }
        });
        resultFinal = pathis;
      }
    }
    return resultFinal;
  },
  genetratePdfForSurchargeSLDC(jsonFinal, jsonFinal1,pdfFileName, signatureJson) {
    var fs = require('fs');
    var Docxtemplater = require('docxtemplater');
    var filepath = Assets.absoluteFilePath('SurchargeInvoiceNew2.docx');
    var content = fs.readFileSync(filepath, "binary");
    var doc = new Docxtemplater(content);
    doc.setData({
      'name': signatureJson.name,
      'designation': signatureJson.designation,
      'fullForm': signatureJson.full_form,
      'phone': signatureJson.phone,
      'surchargeEng': jsonFinal.key1,
      'total': jsonFinal.key2,
      'InvoiceNo': jsonFinal.key3,
      'periodOpen': jsonFinal.periodOpen,
      'periodClos': jsonFinal.periodClos,
      'dueDate': jsonFinal.dueDate,
      'currentDate': jsonFinal.currentDate,
      'totalAmtInWords': jsonFinal.totalAmtInWords,
      'invoiceRaisedTo':jsonFinal1.invoiceRaisedTo,
      'discomName':jsonFinal1.discomName,
      'shortName': jsonFinal1.shortName,
      'address':jsonFinal1.address,
      'addressLineTwo':jsonFinal1.addressLineTwo,
      'city':jsonFinal1.city,
      'state':jsonFinal1.state,
      'pin':jsonFinal1.pin,
      'psaDate':jsonFinal1.psaDate,
      'psaDate2':jsonFinal1.psaDate2,
      'gstNumber': jsonFinal1.gstNumber,
      'financialYear': jsonFinal1.financialYear,
      'yearMade': jsonFinal1.yearMade,
      'monthMade': jsonFinal1.monthMade,
      'discomState': jsonFinal1.discomState,
      'financialYear': jsonFinal1.financialYear,
      'referenceNo': jsonFinal1.referenceNo,
      'invType1': 'SLDC',
      'invType2': 'SLDC',
      'invType3': 'sldc',
    })
    doc.render();
    var buffer = doc.getZip().generate({
      type: "nodebuffer"
    });
    fs.writeFileSync(process.env.PWD +'/.uploads/'+pdfFileName+'.docx', buffer);
    // fs.writeFileSync(process.env.UPLOAD_DIR +'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'.docx', buffer);
    spawn = Npm.require('child_process').spawn;
    console.log("Executing post");
    if (/^win/.test(process.platform)) {
      command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', process.env.UPLOAD_DIR +'/surcharge'+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+'.docx', '--outdir', process.env.UPLOAD_DIR + "/surcharge"+'_'+jsonFinal1.financialYear+'_'+jsonFinal1.monthMade+'_'+jsonFinal1.discomState+".pdf"]);
    } else {
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD +'/.uploads/'+pdfFileName+ '.docx', '--outdir', process.env.PWD+ '/.uploads/Invoices/Surcharge/SLDCSurcharge']);
    }
    command.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
    });
    command.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });
    command.on('exit', function(code) {
      console.log('child process exited with code ' + code);
    });
    var file = '/upload/'+pdfFileName+'.pdf'
    // Meteor.setTimeout(function() {
    //     Meteor.call('deleteUploadedFile', process.env.PWD+'/.uploads/'+pdfFileName+'.docx');
    // }, 12000);
    return file;
  }
});

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

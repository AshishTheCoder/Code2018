Meteor.methods({
    getFixData(state, financial_year, type) {
        if (type == 'trans_charge_Rajasthan' || type == 'trans_charge_GETCO' || type == 'trans_charge_MP') {
            var data = InvoiceCharges.find({
                invoice_type: 'Transmission_Charges',
                state: state,
                financial_year: financial_year
            }).fetch();
        } else if (type == 'SLDC_charge') {
            var data = InvoiceCharges.find({
                invoice_type: 'SLDC_Charges',
                state: state,
                financial_year: financial_year
            }).fetch();
        }
        return returnSuccess('Get Data for: ' + state, data[0].rate);
    },
    saveApplication(json) {
        if (json.appType == 'RLDC_gujarat' || json.appType == 'RLDC_MP') {
            var check = applicationCollection.find({
                'appType': json.appType,
                'financial_year': json.financial_year,
                'monthYear.monthNumber': json.monthYear.monthNumber
            }).fetch();
            if (check.length > 0) {
                return returnFaliure('Application already Initiated');
            } else {
                Meteor.call('generateType1And2', json);
                json.timestamp = new Date();
                json.viewFile = '/upload/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.pdf';
                json.filepath = process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.pdf';
                applicationCollection.insert(json);
                return returnSuccess('Application Saved');
            }
        } else if (json.appType == 'incentive_charge') {
            var check = applicationCollection.find({
                'appType': json.appType,
                'financial_year': json.financial_year
            }).fetch();
            if (check.length > 0) {
                return returnFaliure('Application already Initiated in: ' + json.financial_year);
            } else {
                Meteor.call('generateType3', json);
                json.timestamp = new Date();
                json.viewFile = '/upload/six_level/' + json.appType + '_' + json.financial_year + '.pdf';
                json.filepath = process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '.pdf';
                applicationCollection.insert(json);
                return returnSuccess('Application Saved');
            }
        } else if (json.appType == 'SLDC_charge') {
            console.log(json);
            var check = applicationCollection.find({
                'appType': json.appType,
                'financial_year': json.financial_year,
                'month.startingMonth.monthNumber': json.month.startingMonth.monthNumber,
                'month.endingMonth.monthNumber': json.month.endingMonth.monthNumber
            }).fetch();
            if (check.length > 0) {
                return returnFaliure('Application already Initiated in: ' + json.financial_year + ' ' + json.month.startingMonth.monthWords + ' to ' + json.month.endingMonth.monthWords);
            } else {
                Meteor.call('generateType4', json);
                json.timestamp = new Date();
                json.viewFile = '/upload/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.pdf';
                json.filepath = process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.pdf';
                applicationCollection.insert(json);
                return returnSuccess('Application Saved');
            }
        } else if (json.appType == 'trans_charge_Rajasthan') {
            var check = applicationCollection.find({
                'appType': json.appType,
                'financial_year': json.financial_year,
                'month.startingMonth.monthNumber': json.month.startingMonth.monthNumber,
                'month.endingMonth.monthNumber': json.month.endingMonth.monthNumber
            }).fetch();
            if (check.length > 0) {
                return returnFaliure('Application already Initiated in: ' + json.financial_year + ' ' + json.month.startingMonth.monthWords + ' to ' + json.month.endingMonth.monthWords);
            } else {
                Meteor.call('generateType5', json);
                json.timestamp = new Date();
                json.viewFile = '/upload/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.pdf';
                json.filepath = process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.pdf';
                applicationCollection.insert(json);
                return returnSuccess('Application Saved');
            }
        } else if (json.appType == 'trans_charge_GETCO') {
            var check = applicationCollection.find({
                'appType': json.appType,
                'financial_year': json.financial_year,
                'monthYear.monthNumber': json.monthYear.monthNumber
            }).fetch();
            if (check.length > 0) {
                return returnFaliure('Application already Initiated in: ' + json.monthYear.monthWords);
            } else {
                Meteor.call('generateType6', json);
                json.timestamp = new Date();
                json.viewFile = '/upload/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.pdf';
                json.filepath = process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.pdf';
                applicationCollection.insert(json);
                return returnSuccess('Application Saved');
            }
        }else if (json.appType == 'trans_charge_MP') {
          var check = applicationCollection.find({
              'appType': json.appType,
              'financial_year': json.financial_year,
              'monthYear.monthNumber': json.monthYear.monthNumber
          }).fetch();
          if (check.length > 0) {
              return returnFaliure('Application already Initiated');
          } else {
              Meteor.call('generateType7', json);
              json.timestamp = new Date();
              json.viewFile = '/upload/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.pdf';
              json.filepath = process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.pdf';
              applicationCollection.insert(json);
              return returnSuccess('Application Saved');
          }
        }
    },
    generateType1And2(json) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath(json.appType + '.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
            'SOC': json.SOC,
            'MOC': json.MOC,
            'genDate': json.generatedDate,
            'monthWord': json.monthYear.monthWords,
            'year': json.monthYear.getYear,
            'totalNumber': json.amount.amountNumber,
            'totalWord': json.amount.amountWords
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx', buffer);

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx');
        }, 4000);
    },
    generateType3(json) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath(json.appType + '.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        var mainArray = [];
        for (var i = 0; i < json.data.capacity.length; i++) {
            var jsonData = {
                'key0': json.data.serialNumber[i],
                'key1': json.data.capacity[i],
                'key2': json.data.byRVPN[i],
                'key3': json.data.bySECI[i],
                'key4': json.data.difference[i]
            };
            mainArray.push(jsonData)
        }

        var check = false;
        var createRemark = [];
        for (var i = 0; i < json.data.difference.length; i++) {
            if (Number(json.data.difference[i]) == 0) {} else {
                check = true;
                createRemark.push(i);
            }
        }

        var string = [];
        for (var i = 0; i < createRemark.length - 1; i++) {
            var set = createRemark[i];
            var val = Number([i]) + 1 + ') ' + json.data.remarks[set];
            string.push(val);
        }
        if (check) {
            var enterKey = String.fromCharCode(13);
            var start = 'The differential amount is coming due to' + enterKey + enterKey;
            var join = string.join(enterKey);
            var end = enterKey + enterKey + ' The differential amount may be adjusted through Payment Security Mechanism (PSM)'
            var stringThis = start + join + end;
        } else {
            var stringThis = ' ';
        }

        doc.setData({
            'tableData': mainArray,
            'genDate': json.generatedDate,
            'year': json.year,
            'totalNumber': json.amount.amountNumber,
            'totalWord': json.amount.amountWords,
            'remarks': stringThis
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '.docx', buffer);

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '.docx');
        }, 4000);
    },
    generateType4(json) {
        console.log('type 4 generated');
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath(json.appType + '.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        var mainArray = [];
        for (var i = 0; i < json.data.billNumber.length; i++) {
            var count = 1 + i;
            var jsonData = {
                'key0': count,
                'key1': json.data.billNumber[i],
                'key2': json.data.sldcPeriod[i],
                'key3': json.data.sldcCapacity[i],
                'key4': json.data.sldcDueDate[i],
                'key5': json.data.amount[i]
            };
            mainArray.push(jsonData);
        }
        doc.setData({
            'tableData': mainArray,
            'genDate': json.generatedDate,
            'rate': json.sldcRate,
            'startingMonth': json.month.startingMonth.monthWords,
            'endingMonth': json.month.endingMonth.monthWords,
            'amountNumber': json.amount.amountNumber,
            'amountWords': json.amount.amountWords
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.docx', buffer);

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.docx');
        }, 4000);
    },
    generateType5(json) {
        console.log('type 5 generated');
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath(json.appType + '.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        var mainArray = [];
        for (var i = 0; i < json.data.billNumber.length; i++) {
            var count = 1 + i;
            var jsonData = {
                'key0': count,
                'key1': json.data.billNumber[i],
                'key2': json.data.transPeriod[i],
                'key3': json.data.transCapacity[i],
                'key4': json.data.transDueDate[i],
                'key5': json.data.totalAmount[i],
                'key6': json.data.transExcess[i],
                'key7': json.data.paymentAmount[i]
            };
            mainArray.push(jsonData);
        }
        doc.setData({
            'tableData': mainArray,
            'genDate': json.generatedDate,
            'rate': json.transmissionRate,
            'startingMonth': json.month.startingMonth.monthWords,
            'endingMonth': json.month.endingMonth.monthWords,
            'amountNumber': json.amount.amountNumber,
            'amountWords': json.amount.amountWords
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.docx', buffer);

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.month.startingMonth.monthNumber + 'to' + json.month.endingMonth.monthNumber + '.docx');
        }, 4000);
    },
    generateType6(json) {
        console.log('type 6 generated');
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath(json.appType + '.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        var mainArray = [];
        for (var i = 0; i < json.data.invoiceNumber.length; i++) {
            var array = [];
            array.push({
                'key1': json.data.invoiceNumber[i],
                'key2': json.data.invoiceAmount,
                'key3': json.data.invoiceDate[i],
                'key4': json.data.dueDate[i],
                'key5': json.data.daysJson.GERC,
                'key6': json.data.daysJson.days,
                'key7': json.data.deduct[i],
                'key8': json.data.paymentAmount[i]
            })
            mainArray.push(array);
        }
        doc.setData({
            'r1': mainArray[0],
            'r2': mainArray[1],
            'r3': mainArray[2],
            'r4': mainArray[3],
            'year': json.monthYear.getYear,
            'genDate': json.generatedDate,
            'raisedDate': json.raisedDate,
            'recievedDate': json.recievedDate,
            'totInvoice': json.data.totalInvoiceAmount,
            'monthWord': json.monthYear.monthWords,
            'totalNumber': json.amount.amountNumber,
            'totalWord': json.amount.amountWords
        });

        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx', buffer);

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx');
        }, 4000);
    },
    generateType7(json){
      console.log('type 7 generated');
      console.log(json);
      var fs = require('fs');
      var Docxtemplater = require('docxtemplater');
      var filepath = Assets.absoluteFilePath(json.appType + '.docx');
      var content = fs.readFileSync(filepath, "binary");
      var doc = new Docxtemplater(content);
      var mainArray = [];
      for (var i = 0; i < json.data.billNumber.length; i++) {
          var count = 1 + i;
          var jsonData = {
              'key0': count,
              'key1': json.data.billNumber[i],
              'key2': json.data.transPeriod[i],
              'key3': json.data.transCapacity[i],
              'key4': json.data.transDueDate[i],
              'key5': json.data.totalAmount[i],
              'key6': json.data.transExcess[i],
              'key7': json.data.paymentAmount[i]
          };
          mainArray.push(jsonData);
      }
      doc.setData({
          'tableData': mainArray,
          'genDate': json.generatedDate,
          'monthWord': json.monthYear.monthWords,
          'year': json.monthYear.getYear,
          'amountNumber': json.amount.amountNumber,
          'amountWords': json.amount.amountWords
      });
      doc.render();
      var buffer = doc.getZip().generate({
          type: "nodebuffer"
      });
      fs.writeFileSync(process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx', buffer);
      spawn = Npm.require('child_process').spawn;
      console.log("Executing post");
      command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx', '--outdir', process.env.PWD + '/.uploads/six_level']);
      command.stdout.on('data', function(data) {
          console.log('stdout: ' + data);
      });
      command.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
      });
      command.on('exit', function(code) {
          console.log('child process exited with code ' + code);
      });
      Meteor.setTimeout(function() {
          Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/six_level/' + json.appType + '_' + json.financial_year + '_' + json.monthYear.monthNumber + '.docx');
      }, 4000)
    }
});

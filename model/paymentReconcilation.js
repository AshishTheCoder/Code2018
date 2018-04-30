Meteor.methods({
    gettingSPDandDiscomData1(radioType) {
        var json = '';
        if (radioType == 'discom') {
            var data = Discom.find({}).fetch();
            if (data.length > 0) {
                json = data;
            }
        } else if (radioType == 'spd') {
            var data = Meteor.users.find({
                'profile.user_type': 'spd',
                'profile.status': 'approved'
            }).fetch();
            if (data.length > 0) {
                json = data;
            }
        }
        return returnSuccess("Getting User Profile by Admin", json);
    },
    gettingDiscomDataTable2(Quarter, discomId, discomlist, financialYear) {
      var openingBalance = '0';
      if (Quarter == '2') {
        var QuaterPrev = '1';
        var splitFYArr = financialYear.split("-");
        var yearMinusOne = (Number(splitFYArr[0]) - Number(1));
        var previousFY = yearMinusOne+"-"+ (Number(yearMinusOne) + Number(1));
        var getOpeningData = PaymentReconcilationDiscom.find({quarter : QuaterPrev, financial_year : previousFY, discomId : discomId}).fetch();
        if (getOpeningData.length > 0) {
          openingBalance = getOpeningData[0].closing_balance;
        }
      }else {
        if (Quarter == '1') {
          var QuaterPrev = '4';
        }else {
          var getQuater = Number(Quarter) - 1;
          var QuaterPrev = getQuater.toString();
        }
        var getOpeningData = PaymentReconcilationDiscom.find({quarter : QuaterPrev, financial_year : financialYear, discomId : discomId}).fetch();
        if (getOpeningData.length > 0) {
          openingBalance = getOpeningData[0].closing_balance;
        }
      }
        var totalEnergy = 0;
        var toatlTransm = 0;
        var totalSLDC = 0;
        var finalTotal = 0;
        var year = 0;
        var j = 0;
        var k = 0;
        var l = 0;
        var l1 = 0;
        var returnAllDataArr = [];
        var energyArr = [];
        var transArr = [];
        var SLDCArr = [];
        var amtRecev = [];
        var json = '';
        var typeJson = {};
        typeJson.discomName = discomlist;
        typeJson.discomId = discomId;
        typeJson.financialYear = financialYear;
        if (Quarter == '1') {
            var quaterArr = ['01', '02', '03'];
        } else if (Quarter == '2') {
            var quaterArr = ['04', '05', '06'];
        } else if (Quarter == '3') {
            var quaterArr = ['07', '08', '09'];
        } else if (Quarter == '4') {
            var quaterArr = ['10', '11', '12'];
        }
        var openingMon = quaterArr[0];
        var closingMon = quaterArr[2];
        if (closingMon == '03' || closingMon == '12') {
            var choosClosDate = '31';
        } else if (closingMon == '06' || closingMon == '09') {
            var choosClosDate = '30';
        }
        for (var i = 0; i < quaterArr.length; i++) {
          var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          var monthInWords = getArray(dateArr, quaterArr[i]);
            var month = quaterArr[i];
            var data = LogbookDiscom.find({
                'discomId': discomId,
                'financial_year': financialYear,
                'month': month
            }).fetch();
            var data1 = LogbookTransmission.find({
                'discomId': discomId,
                'financial_year': financialYear,
                'month': month
            }).fetch();

            var data2 = LogbookSLDC.find({
                'discomId': discomId,
                'financial_year': financialYear,
                'month': month
            }).fetch();
            if (data.length > 0) {
                var yearMade = 0;
                var totalEnrgData = 0;
                var dateOfPayment = 0;
                json = data;
                l1++;
                var period = monthInWords+"'"+data[0].year;
                data.forEach(function(item) {
                    year = item.year;
                    yearMade = item.year.substr(-2)
                    dateOfPayment = item.date_of_payment;
                    j++;
                    totalEnrgData = Number(totalEnrgData) + Number(item.payment_amount);
                    finalTotal = Number(finalTotal) + Number(totalEnrgData);
                    // Table of Energy
                    var json = {
                        'Month': period,
                        'InvoiceNo': item.invoice_number,
                        'InvoiceDate': item.energy_invoice_generation_date,
                        'Energy': item.total_energy,
                        'Amount': (item.amount_of_invoice)
                    };
                    json.serialNo = j;
                    totalEnergy += Number(json.Amount);
                    energyArr.push(json);
                });
                // Table No 4th Energy
                amtRecev.push({
                    'serialNo': l1,
                    'month': period,
                    'amountReceived': totalEnrgData,
                    'paymentRecvDate': dateOfPayment
                });
            }
            var value = '';
            var type = '';
            if (data1.length > 0) {
                var yearMade = 0;
                var dateOfPayment = 0;
                var totalEnrgData = 0;
                l1++;
                var json1 = data1;
                if (json1[0].spdState == 'Gujarat' || json1[0].spdState == 'Rajasthan') {
                    type = 'Contracted Capacity(kW)';
                } else if (json1[0].spdState == 'MP') {
                    type = 'Energy';
                }
                typeJson.trasmissionType = type;
                var period = monthInWords+"'"+data1[0].year;
                data1.forEach(function(item) {
                    k++;
                    year = item.year;
                    dateOfPayment = item.date_of_payment;
                    yearMade = item.year.substr(-2)
                    totalEnrgData = Number(totalEnrgData) + Number(item.payment_amount);
                    finalTotal = Number(finalTotal) + Number(totalEnrgData);
                    // Table of Transmission
                    var json2 = {
                        'Month': period,
                        'InvoiceNo': item.invoice_number,
                        'InvoiceDate': item.generation_date,
                        'value': item.total_energy_or_project_capicity,
                        'Amount': (item.total_transmission_invoice)
                    };
                    json2.serialNo = k;
                    toatlTransm += Number(json2.Amount);
                    transArr.push(json2);
                });
                toatlTransm1 = toatlTransm.toFixed(2);
                // Table No 4th Transmission
                amtRecev.push({
                    'serialNo': l1,
                    'month': period,
                    'amountReceived': totalEnrgData,
                    'paymentRecvDate': dateOfPayment
                });
            }

            if (data2.length > 0 && i == 2) {
                l1++;
                var yearMade = 0;
                var dateOfPayment = 0;
                var totalEnrgData = 0;
                var jsonsldc = {};
                json = data2;
                var period = monthInWords+"'"+data2[0].year;
                data2.forEach(function(item) {
                    l++;
                    year = item.year;
                    dateOfPayment = item.date_of_payment;
                    yearMade = item.year.substr(-2)
                    totalEnrgData = Number(totalEnrgData) + Number(item.payment_amount);
                    finalTotal = Number(finalTotal) + Number(totalEnrgData);
                    // Table of SLDC
                    var json2 = {
                        'Month': period,
                        'InvoiceNo': item.invoice_number,
                        'InvoiceDate': item.generation_date,
                        'ContractedCapacity': item.project_capicity,
                        'Amount': (Number(item.total_amount))
                    };
                    json2.serialNo = l;
                    totalSLDC += (Number(json2.Amount));
                    SLDCArr.push(json2);
                });
                // Table ono 4th SLDC
                amtRecev.push({
                    'serialNo': l1,
                    'month': period,
                    'amountReceived': totalEnrgData,
                    'paymentRecvDate': dateOfPayment
                });
            }
        }
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var monthInWordsOPEn = getArray(dateArr, quaterArr[0]);
        var monthInWordsCLOs = getArray(dateArr, quaterArr[2]);
        var period = monthInWordsOPEn + "'" + year + "-" + monthInWordsCLOs + "'" + year;
        var openingDate = "01." + openingMon + "." + year;
        var closingDate = choosClosDate + "." + closingMon + "." + year;
        var closingBalance = Number(openingBalance) + Number(totalEnergy) + Number(toatlTransm) + Number(totalSLDC) - Number(finalTotal);
        var totalAmountInWords = amountInWords(Number(closingBalance).toFixed(2));
        typeJson.finalTotal = finalTotal;
        typeJson.totalWords = totalAmountInWords;
        typeJson.closingBalance = closingBalance;
        typeJson.period = period;
        var jsonFinal = {
            'key1': energyArr,
            'key2': transArr,
            'key3': SLDCArr,
            'key4': totalEnergy,
            'key5': toatlTransm,
            'key6': totalSLDC,
            'key7': amtRecev,
            'finalTotal': typeJson.finalTotal,
            'transcoType': typeJson.trasmissionType,
            'financialYear': typeJson.financialYear,
            'selectedDiscom': typeJson.discomName,
            'totalWords': typeJson.totalWords,
            'period': typeJson.period,
            'openingDate': openingDate,
            'closingDate': closingDate,
            'action_date': moment().format('DD-MM-YYYY'),
            'openingBalance': Number(openingBalance).toFixed(2),
            'closingBalance': typeJson.closingBalance,
        };
        //inserting data quaterly
        var discomData =  Discom.find({_id:discomId}).fetch();
        var timeStamp = new Date();
        var discomState = discomData[0].discom_state;
        var discomName = discomData[0].nameof_buyingutility
        PaymentReconcilationDiscom.update({
          "quarter" : Quarter,
          "financial_year" : financialYear,
          "discomId" : discomId
        }, {
           "quarter" : Quarter,
           "discomId" : discomId,
           "discom_state" : discomState,
           "discom_name" : discomName,
           "financial_year" : financialYear,
           "opening_balance_A" : openingBalance,
           "energy_total_B" : totalEnergy,
           "transmission_total_C" : toatlTransm,
           "sldc_total_D" : totalSLDC,
           "received_payament_total_E" : finalTotal,
           "closing_balance" : closingBalance,
           "timestamp" : timeStamp
        },{ upsert: true });
        var pathis;
        Meteor.call('genetratePdfForPaymentRecon', jsonFinal, function(error, result) {
            if (error) {
                console.log("Line No - 270 , Error");
            } else {
                pathis = result;
            }
        });
        return pathis;
    },

    genetratePdfForPaymentRecon(jsonFinal) {
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('payment_reconciliation_Discom.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
            'energyArr': jsonFinal.key1,
            'transArr': jsonFinal.key2,
            'SLDCArr': jsonFinal.key3,
            'totalEnergy': jsonFinal.key4,
            'toatlTransm': jsonFinal.key5,
            'totalSLDC': jsonFinal.key6,
            'paymentAmt': jsonFinal.key7,
            'amountEnergyApr': jsonFinal.amountEnergyApr,
            'transcoType': jsonFinal.transcoType,
            'allTotal': jsonFinal.finalTotal,
            'totalWords': jsonFinal.totalWords,
            'SelectedDiscomName': jsonFinal.selectedDiscom,
            'period': jsonFinal.period,
            'openingDate': jsonFinal.openingDate,
            'closingDate': jsonFinal.closingDate,
            'openingBalance': jsonFinal.openingBalance,
            'closingBalance': jsonFinal.closingBalance,
            'currentDate': jsonFinal.action_date,
            'financialYear': jsonFinal.financialYear
        })
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/paymentReconciliation/payment_reconciliation_Discom' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedDiscom +'_'+random+ '.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        if (/^win/.test(process.platform)) {
            command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/paymentReconciliation/payment_reconciliation_Discom' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedDiscom +'_'+random+'.docx', '--outdir', process.env.PWD + "/.uploads/paymentReconciliation/payment_reconciliation_Discom" + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedDiscom +'_'+random+".pdf"]);
        } else {
            command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD +'/.uploads/paymentReconciliation/payment_reconciliation_Discom' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedDiscom+'_'+random+ '.docx', '--outdir', process.env.PWD+ '/.uploads/paymentReconciliation/']);
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
        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/paymentReconciliation/payment_reconciliation_Discom' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedDiscom +'_'+random+ '.docx');
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/paymentReconciliation/payment_reconciliation_Discom' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedDiscom +'_'+random+ '.pdf');
        }, 10000);

        var filePath = '/upload/paymentReconciliation/payment_reconciliation_Discom' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedDiscom +'_'+random+ '.pdf'
        return filePath;
    },

    gettingSPDTable2(Quarter, spdId, spdlist, financialYear) {
        var openingBalance = '0';
        if (Quarter == '2') {
          var QuaterPrev = '1';
          var splitFYArr = financialYear.split("-");
          var yearMinusOne = (Number(splitFYArr[0]) - Number(1));
          var previousFY = yearMinusOne+"-"+ (Number(yearMinusOne) + Number(1));
          var getOpeningData = PaymentReconcilationSPD.find({quarter : QuaterPrev, financial_year : previousFY, spdId : spdId}).fetch();
          if (getOpeningData.length > 0) {
            openingBalance = getOpeningData[0].closing_balance;
          }
        }else {
          if (Quarter == '1') {
            var QuaterPrev = '4';
          }else {
            var getQuater = Number(Quarter) - 1;
            var QuaterPrev = getQuater.toString();
          }
          var getOpeningData = PaymentReconcilationSPD.find({quarter : QuaterPrev, financial_year : financialYear, spdId : spdId}).fetch();
          if (getOpeningData.length > 0) {
            openingBalance = getOpeningData[0].closing_balance;
          }
        }
        var totalEnergy = 0;
        var finalTotal = 0;
        var totalAmtPaidBySeci = 0;
        var totalDeduction = 0;
        var year = 0;
        var typeJson = {};
        typeJson.spdName = spdlist;
        typeJson.financialYear = financialYear;
        var returnAllDataArr = [];
        var json = '';
        if (Quarter == '1') {
            var quaterArr = ['01', '02', '03'];
        } else if (Quarter == '2') {
            var quaterArr = ['04', '05', '06'];
        } else if (Quarter == '3') {
            var quaterArr = ['07', '08', '09'];
        } else if (Quarter == '4') {
            var quaterArr = ['10', '11', '12'];
        }
        var openingMon = quaterArr[0];
        var closingMon = quaterArr[2];
        if (closingMon == '03' || closingMon == '12') {
            var choosClosDate = '31';
        } else if (closingMon == '06' || closingMon == '09') {
            var choosClosDate = '30';
        }
        var energyArr = [];
        var paymentArr = [];
        var j = 0;
        var k = 0;
        for (var i = 0; i < quaterArr.length; i++) {
            var month = quaterArr[i];
            var invoiceNo = 0;
            var data = LogBookSpd.find({
                'clientId': spdId,
                'financial_year': financialYear,
                'month': month
            }).fetch();
            if (data.length > 0) {
                json = data;
                year = json[0].year;
                data.forEach(function(item) {
                    j++;
                    var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    var monthInWordSpd = getArray(dateArr, Number(item.month)) + "'" + year;
                    var json = {
                        'Month': monthInWordSpd,
                        'InvoiceNo': item.invoiceNumber,
                        'InvoiceDate': item.dateOfReceipt,
                        'Energy': Number(item.billedUnits).toFixed(2),
                        'Amount': Number(item.invoiceAmount).toFixed(2)
                    };
                    json.serialNo = j;
                    invoiceNo = item.invoiceNumber;
                    totalEnergy += Number(json.Amount);
                    energyArr.push(json);
                    var data1 = EnergyPaymentNoteDetails.find({
                        'invoiceNumber': invoiceNo,
                        'financialYear' : financialYear,
                        "clientId" : spdId
                    }).fetch();
                    if (data1.length > 0) {
                        var totalEnrgData = 0;
                        json = data1;
                        data1.forEach(function(item) {
                            k++;
                            var year = item.year.substr(-2)
                            var monthMade = item.month + "/" + year;
                            totalAmtPaidBySeci += Number(item.releasedPayment);
                            totalDeduction += Number(item.deducationIfAny);
                            var json = {
                                'Month': monthMade,
                                'Deduction': Number(item.deducationIfAny).toFixed(2),
                                'Amount': Number(item.releasedPayment).toFixed(2),
                                'Remarks': item.remark,
                                'paymentDate': item.generatedDate
                            };
                            json.serialNo = k;
                            paymentArr.push(json);
                        });
                        totalAmtPaidBySeci = Number(totalAmtPaidBySeci.toFixed(2));
                        totalDeduction = Number(totalDeduction.toFixed(2));
                    }
                });
            }
        }
        var miniTotalAmt = Number(Number(totalDeduction) + Number(totalAmtPaidBySeci)).toFixed(2);
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var monthInWordsOPEn = getArray(dateArr, quaterArr[0]);
        var monthInWordsCLOs = getArray(dateArr, quaterArr[2]);
        var period = monthInWordsOPEn + "'" + year + "-" + monthInWordsCLOs + "'" + year;
        var openingDate = "01." + openingMon + "." + year;
        var closingDate = choosClosDate + "." + closingMon + "." + year;
        var closingBalance = Number(Number(openingBalance) + Number(totalEnergy) - Number(miniTotalAmt)).toFixed(2);
        var totalAmountInWords = amountInWords(closingBalance);
        typeJson.totalWords = totalAmountInWords;
        typeJson.closingBalance = closingBalance;
        typeJson.period = period;
        typeJson.totalEnergy = Number(totalEnergy.toFixed(2));
        var jsonFinal = {
            'key1': energyArr,
            'key2': paymentArr,
            'key3': Number(totalEnergy).toFixed(2),
            'key4': Number(totalDeduction).toFixed(2),
            'key5': Number(totalAmtPaidBySeci).toFixed(2),
            'key6': miniTotalAmt,
            'selectedSpd': typeJson.spdName,
            'financialYear': typeJson.financialYear,
            'closingBalance': typeJson.closingBalance,
            'totalWords': typeJson.totalWords,
            'period': typeJson.period,
            'openingDate': openingDate,
            'closingDate': closingDate,
            'openingBalance': Number(openingBalance).toFixed(2),
            'action_date': moment().format('DD-MM-YYYY')
        };


        var spdData =  Meteor.users.find({_id:spdId}).fetch();
        var timeStamp = new Date();
        var spdState = spdData[0].profile.registration_form.name_of_spd;
        var spdName = spdData[0].profile.registration_form.spd_state;
        PaymentReconcilationSPD.update({
          "quarter" : Quarter,
          "financial_year" : financialYear,
          "spdId" : spdId
        }, {
           "quarter" : Quarter,
           "spdId" : spdId,
           "spd_state" : spdState,
           "spd_name" : spdName,
           "financial_year" : financialYear,
           "opening_balance_A" : Number(openingBalance).toFixed(2),
           "energy_total_B" : Number(totalEnergy).toFixed(2),
           "total_amount_paid_C" : Number(totalAmtPaidBySeci).toFixed(2),
           "deduction_D" : Number(totalDeduction).toFixed(2),
           "total_received_payament_E" : miniTotalAmt,
           "closing_balance" : closingBalance,
           "timestamp" : timeStamp
        },{ upsert: true });
        var pathis;
        Meteor.call('genetratePdfForPaymentReconSpd', jsonFinal, function(error, result) {
            if (error) {
                console.log("error is showing===> line 126");
            } else {
                console.log("Line No - 504 , Error");
                pathis = result;
            }
        });
        return pathis;
    },
    genetratePdfForPaymentReconSpd(jsonFinal) {
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('payment_Reconciliation_spdEnergy.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
            'energyArr': jsonFinal.key1,
            'paymentArr': jsonFinal.key2,
            'totalEnergy': jsonFinal.key3,
            'totalDeduction': jsonFinal.key4,
            'totalAmtPaidBySeci': jsonFinal.key5,
            'miniTotalAmt': jsonFinal.key6,
            'totalWords': jsonFinal.totalWords,
            'selectedSpdName': jsonFinal.selectedSpd,
            'financialYear': jsonFinal.financialYear,
            'period': jsonFinal.period,
            'openingDate': jsonFinal.openingDate,
            'closingDate': jsonFinal.closingDate,
            'openingBalance': jsonFinal.openingBalance,
            'closingBalance': jsonFinal.closingBalance,
            'currentDate': jsonFinal.action_date
        })
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/paymentReconciliation/payment_Reconciliation_spdEnergy' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedSpd +'_'+random+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        if (/^win/.test(process.platform)) {
            command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', process.env.PWD + '/payment_Reconciliation_spdEnergy' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedSpd +'_'+random+'.docx', '--outdir', process.env.PWD + "/payment_Reconciliation_spdEnergy" + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedSpd + ".pdf"]);
        } else {
            command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/paymentReconciliation/payment_Reconciliation_spdEnergy' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedSpd +'_'+random+ '.docx', '--outdir', process.env.PWD+ '/.uploads/paymentReconciliation/']);
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
        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/paymentReconciliation/payment_Reconciliation_spdEnergy' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedSpd+'_'+random+'.docx');
            Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/paymentReconciliation/payment_Reconciliation_spdEnergy' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedSpd+'_'+random+'.pdf');
        }, 10000);
        var filePath = '/upload/paymentReconciliation/payment_Reconciliation_spdEnergy' + '_' + jsonFinal.financialYear + '_' + jsonFinal.period + '_' + jsonFinal.selectedSpd+'_'+random+'.pdf';
        return filePath;
    }
});

function getArray(ary, month) {
    return ary[month - 1];
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
}

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
    str += (n[1] != 0) ?
        (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' :
        '';
    str += (n[2] != 0) ?
        (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' :
        '';
    str += (n[3] != 0) ?
        (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' :
        '';
    str += (n[4] != 0) ?
        (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' :
        '';
    str += (n[5] != 0) ?
        ((str != '') ?
            '' :
            '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) :
        '';
    return str;
};

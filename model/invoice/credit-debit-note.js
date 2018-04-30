Meteor.methods({
    "gettingDiscomStateCreditDebit": function() {
        var disArr = [];
        var discomData = Discom.find().fetch();
        discomData.forEach(function(itemData) {
            disArr.push(itemData.discom_state);
        });
        var index = disArr.indexOf("Maharashtra");
        if (index > -1) {
            disArr.splice(index, 1);
        }
        var index1 = disArr.indexOf("MP");
        if (index > -1) {
            disArr.splice(index1, 1);
        }
        return returnSuccess('Found Discom List', _.uniq(disArr));
    },
    "InvoiceEnergyDetails": function(month, financial_year, discomState, region) {
      if (discomState == 'Bihar') {
        var json = {"month": month, "financial_year": financial_year, "discom_state": discomState, "spd_direction" : region};
      }else {
        var json = {"month": month, "financial_year": financial_year, "discom_state": discomState};
      }
        var invoiceEnergyDetails = EnergyInvoiceDetails.find(json).fetch();
        if (invoiceEnergyDetails.length > 0) {
            return returnSuccess('Getting Energy invoice details', invoiceEnergyDetails[0]);
        } else {
            return returnFaliure('Energy Invoice Details not found');
        }
    },
    "getTransmissionDetails": function(month, financial_year, state, discomState) {
        if (discomState == 'North' || discomState == 'South') {
            var stateVar = 'Bihar';
            var region =discomState+" Bihar";
            var transmissionInvoiceDetails = TransmissionInvoiceDetails.find({
                "month": month,
                "financial_year": financial_year,
                "discom_state": stateVar,
                "region":region
            }).fetch();
        } else {
            var stateVar = discomState;
            var transmissionInvoiceDetails = TransmissionInvoiceDetails.find({
                "month": month,
                "financial_year": financial_year,
                "discom_state": discomState
            }).fetch();
        }
        var datalength = transmissionInvoiceDetails.length;
        if (transmissionInvoiceDetails.length > 0) {
            return returnSuccess('Getting Transmission invoice details', transmissionInvoiceDetails[0]);
        } else {
            return returnFaliure('Transmission Invoice Details not found');
        }
    },
    "CreditDebitPdf": function(month, year, stateId, invoiceNumber, previous_rate, invoiceDate, prevEnergy, currEnergy, signatureJson,biharRegion) {
        // var differ = Number(currEnergy) - Number(prevEnergy)
        // var total_amount = Number(differ) * Number(previous_rate);
        // total_amount = Number(total_amount).toFixed(2);
        // var amountWords = amountInWords(total_amount);

        var presentAmt = Number(currEnergy) * Number(previous_rate);
        var previousAmt = Number(prevEnergy) * Number(previous_rate);
        var ActualTotalAmt = Number(presentAmt) - Number(previousAmt);
        total_amount = Number(ActualTotalAmt).toFixed(2);
        var amountWords = amountInWords(total_amount);
        var myDate = moment().add(30, 'days');
        if (prevEnergy > currEnergy) {
            var type = 'Credit';
            var dueDate = '';
            var dueDateForViewOnly = '';
        } else if (currEnergy > prevEnergy) {
            var type = 'Debit';
            var dueDate = myDate.format('DD-MM-YYYY');
            var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
        } else {
            return returnFaliure('Credit/Debit Note does not exist');
        }
        var discomData = Discom.find({
            "discom_state": stateId
        }).fetch();
        var InvoiceEnergyDetails = EnergyInvoiceDetails.find({
            "month": month,
            "financial_year": year,
            "discom_id": discomData[0]._id
        }).fetch();
        var datalength = InvoiceEnergyDetails.length;
        if (datalength == 0) {
            return returnFaliure('Energy invoice details not found');
        }
        var currentDate = new Date();
        var currentYear = moment(currentDate).format('YYYY');
        var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var transGenerationdate = InvoiceEnergyDetails[0].generation_date;
        var period = dateArr[Number(month) - 1] + "'" + InvoiceEnergyDetails[0].year;
        fromPeriod = '01' + ' ' + dateArr[Number(month) - 1] + ' ' + InvoiceEnergyDetails[0].year;
        var number_of_days = moment('"' + InvoiceEnergyDetails[0].year + '-' + month + '"', "YYYY-MM").daysInMonth()
        var ToPeriod = number_of_days + ' ' + dateArr[Number(month) - 1] + ' ' + InvoiceEnergyDetails[0].year;


        var count = CreditDebitEnergy.find({}).count() + 1;
        if (stateId == "Bihar") {
          var discom_name = biharRegion+' '+InvoiceEnergyDetails[0].discom_name;
          var region = biharRegion;
        }else {
          var discom_name = InvoiceEnergyDetails[0].discom_name;
          var region = stateId

        }
        var random = Math.random().toString().substr(-3);
        var filePathToInsert = 'Credit_Debit_Note/Energy/'+discomData[0].discom_state + '_' + year + '_' + month + '_' + random;
          // var filePathToInsert = 'python/'+discomData[0].discom_state + '_' + year + '_' + month + '_' + random;
        var stateInCaps = discomData[0].discom_state.toUpperCase();
        var addressJson = {
            reference_number: "SECI/PS/" + stateInCaps + '/' + moment().format('YYYY'),
            month: InvoiceEnergyDetails[0].month,
            year: InvoiceEnergyDetails[0].year,
            financial_year: InvoiceEnergyDetails[0].financial_year,
            spd_state: InvoiceEnergyDetails[0].spd_state,
            type: type,
            shortName : InvoiceEnergyDetails[0].discom_short_name,
            discom_name: discom_name,
            discom_state: discomData[0].discom_state,
            discomStateCap: stateInCaps,
            discom_Id: discomData[0]._id,
            invoiceDate: InvoiceEnergyDetails[0].energy_invoice_generation_date,
            period: period,
            prevEnergy: prevEnergy,
            prevAmt: Number(previousAmt).toFixed(2),
            presentEnergy: currEnergy,
            presentAmt: Number(presentAmt).toFixed(2),
            rate: previous_rate,
            genDate: dateFormatToInsert,
            dueDate: dueDateForViewOnly,
            invoice_number: InvoiceEnergyDetails[0].invoice_number,
            total_amount: total_amount,
            region:region,
            delete_status: false,
            file_path: '/upload/'+filePathToInsert+'.pdf',
            file_path_docx: '/upload/'+filePathToInsert+'.docx',
        }
          var dataEnergy = CreditDebitEnergy.insert(addressJson);
          var dataEnergyForDiscom=CreditDebitEnergy.find({
              "month": InvoiceEnergyDetails[0].month,
              "financial_year": InvoiceEnergyDetails[0].financial_year,
              "spd_state": InvoiceEnergyDetails[0].spd_state,
              "discom_state": discomData[0].discom_state
          }).fetch();

        var dataAvailable={
            document_id:dataEnergyForDiscom[0]._id,
            amount_of_invoice : total_amount,
            date_of_payment : '',
            discom_name : discom_name,
            discomId : discomData[0]._id,
            discomState : discomData[0].discom_state,
            energy_invoice_due_date : dueDate,
            energy_invoice_generation_date : dateFormatToInsert,
            financial_year : InvoiceEnergyDetails[0].financial_year,
            invoice_number : InvoiceEnergyDetails[0].invoice_number,
            invoice_type : type,
            max_energy : '',
            min_energy : '',
            month : moment().format('MM'),
            year : moment().format('YYYY'),
            payment_amount : 0,
            rate_per_unit : previous_rate,
            remarks : '',
            short_payment: '',
            sir_charge_amount : 0,
            total_energy : currEnergy,
            usedCollection : "CreditDebitEnergy",
            timeStamp : new Date(),
        }

        var logbookEnergy=LogbookDiscom.insert(dataAvailable);

        addressJson.nameof_buyingutility = discom_name;
        addressJson.invoice_raised_to = discomData[0].invoice_raised_to;
        addressJson.discom_address = discomData[0].discom_address + ' ' + discomData[0].discom_address_line_two;
        addressJson.discom_city = discomData[0].discom_city;
        addressJson.discom_pin = discomData[0].discom_pin;
        addressJson.scheme = discomData[0].scheme;
        addressJson.fax = discomData[0].discom_fax;
        addressJson.psaDate = discomData[0].date_of_amendment_one;
        addressJson.name = signatureJson.name;
        addressJson.designation = signatureJson.designation;
        addressJson.full_form = signatureJson.full_form;
        addressJson.phone = signatureJson.phone;
        addressJson.amountWords = amountWords;
        addressJson.count = count;

        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        if (type = 'Credit') {
          var filepath = Assets.absoluteFilePath('EnergyManualCreditNote.docx');
        }else {
          var filepath = Assets.absoluteFilePath('EnergyManualDebitNote.docx');
        }
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        var fileName = 'Credit_Debit_Note/Energy/'+discomData[0].discom_state + '_' + year + '_' + month + '_' + random;
        // var fileName = '/python'+discomData[0].discom_state + '_' + year + '_' + month + '_' + random;
        var filepathToGeneratePdf = process.env.PWD + '/.uploads/';
        // var filepathToGeneratePdf = process.env.location + '/.python/';
        doc.setData(
            addressJson,
        );
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });

        fs.writeFileSync(filepathToGeneratePdf + fileName + '.docx', buffer);
        spawn = Npm.require('child_process').spawn;

        if (/^win/.test(process.platform)) {
            command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+fileName]);
        } else {
            command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+'Credit_Debit_Note/Energy']);
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
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile',filepathToGeneratePdf + fileName +'.docx');
        // }, 10000);
        var filePathToReturn = '/upload/'+filePathToInsert+'.pdf';
        return returnSuccess('Pdf data found',filePathToReturn);
    },

gettingsldcperioddetails(periodId){
  var data = SLDCInvoiceDetails.find({
      _id:periodId,
      delete_status: false
  }).fetch();
  if (data.length > 0) {
      return returnSuccess('Getting sldc details period wise', data[0]);
  } else {
      return returnFaliure("SLDC Invoice Not Generated!");
  }
},
    gettingcreditSLDCInvoicePeriod(financialYear, discomState) {
        var data = SLDCInvoiceDetails.find({
            financial_year: financialYear,
            discom_state: discomState,
            delete_status: false
        }).fetch();
        var returnData = [];
        _.each(data, function(item) {
            var period = item.sldc_charges_from + " - " + item.sldc_charges_to;
            returnData.push({
                id: item._id,
                period: period
            });
        });
        if (data.length > 0) {
            return returnSuccess('Getting Period For SLDC Log Book', returnData);
        } else {
            return returnFaliure("SLDC Invoice Not Generated!");
        }
    },
    "CreditRajasthanSPDListForTransmissionCharges": function(CreditState) {
        var spdArr = [];
        var discomData = Discom.find().fetch();
        discomData.forEach(function(itemData) {
            itemData.spdIds.forEach(function(item) {
                if (item.transaction_type == 'Inter' && item.spdState == 'Rajasthan') {
                    spdArr.push(itemData.discom_state);
                }
            });
        });
        return returnSuccess('Found SPD List', _.uniq(spdArr));
    },
    "TransmissionCreditPdf": function(json, signatureJson) {
        if (json.CreditState == 'MP') {
          var previousEnergy = json.PrevEnergy;
          var presentEnergy = json.CurrEnergy;
          var biharRegion = '';
          var rowHead = '';
          if (json.DiscomState == 'North') {
            biharRegion = 'N';
            rowHead = 'North Bihar power Distribution Co. Ltd. (46%)';
            var prevEergyPercentage = Number(Number((Number(previousEnergy) * Number(46))/100)).toFixed(2);
            var presEnergyPercentage = Number(Number((Number(presentEnergy) * Number(46))/100)).toFixed(2);
          }else if (json.DiscomState == 'South') {
            biharRegion = 'S';
            rowHead = 'South Bihar power Distribution Co. Ltd. (56%)';
            var prevEergyPercentage = Number(Number((Number(previousEnergy) * Number(54))/100)).toFixed(2);
            var presEnergyPercentage = Number(Number((Number(presentEnergy) * Number(54))/100)).toFixed(2);
          }
            var total_amount = (Number(presEnergyPercentage) * Number(json.CurrRate)) - (Number(prevEergyPercentage) * Number(json.PrevRate));
            total_amount = Number(total_amount).toFixed(2);
            var currAmount = Number(presEnergyPercentage) * Number(json.CurrRate);
            currAmount = Number(currAmount).toFixed(2);
            var prevAmount = Number(prevEergyPercentage) * Number(json.PrevRate);
            prevAmount = Number(prevAmount).toFixed(2);
            var amountWords = amountInWords(total_amount);
            if (total_amount < 0) {
                var type = 'Credit';
                var typ = 'C';
                var dueDate = '';
                var dueDateForViewOnly = '';
            } else if (total_amount > 0) {
                var type = 'Debit';
                var typ = 'D';
                var myDate = moment().add(30, 'days');
                var dueDate = myDate.format('DD-MM-YYYY');
                var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
            } else {
                return returnFaliure('Credit/Debit Note does not exist');
            }
            json.type = type;
            var dataMP = json;
            if (json.DiscomState == 'North' || json.DiscomState == 'South') {
                var stateVar = 'Bihar';
                var region =json.DiscomState+" Bihar";
                var transmissionInvoiceDetails = TransmissionInvoiceDetails.find({
                    "month": json.month,
                    "financial_year": json.FinancialYear,
                    "spd_state": json.CreditState,
                    "discom_state": stateVar,
                    "region" : region
                }).fetch();
                  var discom_name = json.DiscomState+' '+transmissionInvoiceDetails[0].discom_name;
            } else {
                var stateVar = json.DiscomState;
                var transmissionInvoiceDetails = TransmissionInvoiceDetails.find({
                    "month": json.month,
                    "financial_year": json.FinancialYear,
                    "spd_state": json.CreditState,
                    "discom_state": stateVar,
                }).fetch();
                  var discom_name = transmissionInvoiceDetails[0].discom_name;
            }
            var discomData = Discom.find({
                "discom_state": stateVar
            }).fetch();

            var datalength = transmissionInvoiceDetails.length;
            if (datalength == 0) {
                return returnFaliure('Transmission details not found');
            }
            var currentDate = new Date();
            var currentYear = moment(currentDate).format('YYYY');
            var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var transGenerationdate = transmissionInvoiceDetails[0].generation_date;
            var period = dateArr[Number(json.month) - 1] + "'" + transmissionInvoiceDetails[0].year;
            fromPeriod = '01' + ' ' + dateArr[Number(json.month) - 1] + ' ' + transmissionInvoiceDetails[0].year;
            var number_of_days = moment('"' + transmissionInvoiceDetails[0].year + '-' + json.month + '"', "YYYY-MM").daysInMonth()
            var ToPeriod = number_of_days + ' ' + dateArr[Number(json.month) - 1] + ' ' + transmissionInvoiceDetails[0].year;
            var currEnergypercent = (Number(json.CurrEnergy) * 3) / 5;
            var prevEnergypercent = (Number(json.PrevEnergy) * 3) / 5;

            var random = Math.random().toString().substr(-3);
            // var filePath = discomData[0].discom_state + '_' + json.FinancialYear + '_' + json.month + '_' + random;
            var filePathToInsert = 'Credit_Debit_Note/Transmission/'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year  + '_' + json.month + '_' + random;
            var count1 = CreditDebitTransmission.find({month: transmissionInvoiceDetails[0].month, year: transmissionInvoiceDetails[0].year, discom_state: discomData[0].discom_state}).count() + 1;
            if (discomData[0].discom_state == 'Bihar') {
              var addressJson = {
                  month: transmissionInvoiceDetails[0].month,
                  year: transmissionInvoiceDetails[0].year,
                  financial_year: transmissionInvoiceDetails[0].financial_year,
                  spd_state: transmissionInvoiceDetails[0].spd_state,
                  type: type,
                  typ: typ,
                  fromdate: json.FromDate,
                  todate: json.ToDate,
                  period: period,
                  fromPeriod: fromPeriod,
                  toPeriod: ToPeriod,
                  reference_number: "SECI/PT/"+type.toUpperCase()+" NOTE/" + currentYear + '/' + count1,
                  discom_state: discomData[0].discom_state,
                  discom_Id: discomData[0]._id,
                  discom_short_name: biharRegion + discomData[0].discom_short_name,
                  nameof_buyingutility: json.DiscomState +' '+ discomData[0].nameof_buyingutility,
                  genDate: dateFormatToInsert,
                  dueDate: dueDate,
                  dueDateToView: dueDateForViewOnly,
                  region:region,
                  rowHead:rowHead,
                  prevEnergypercent: prevEergyPercentage,
                  currEnergypercent: presEnergyPercentage,
                  PrevEnergy: json.PrevEnergy,
                  CurrEnergy: json.CurrEnergy,
                  PrevRate: json.PrevRate,
                  CurrRate: json.CurrRate,
                  currAmount: currAmount,
                  prevAmount: prevAmount,
                  invoiceDate: transmissionInvoiceDetails[0].generation_date,
                  invoice_number: transmissionInvoiceDetails[0].invoice_number,
                  total_amount: total_amount,
                  delete_status: false,
                  file_path: '/upload/'+filePathToInsert+'.pdf',
                  file_path_docx: '/upload/'+filePathToInsert+'.docx',
              }
            } else {
                var addressJson = {
                    month: transmissionInvoiceDetails[0].month,
                    year: transmissionInvoiceDetails[0].year,
                    financial_year: transmissionInvoiceDetails[0].financial_year,
                    spd_state: transmissionInvoiceDetails[0].spd_state,
                    type: type,
                    period: period,
                    fromPeriod: fromPeriod,
                    ToPeriod: ToPeriod,
                    fromdate: json.FromDate,
                    todate: json.ToDate,
                    prevEnergypercent: prevEnergypercent,
                    currEnergypercent: currEnergypercent,
                    reference_number: "SECI/PT/"+type.toUpperCase()+" NOTE/" + currentYear + '/' + count1,
                    discom_Id: discomData[0]._id,
                    discom_name: discom_name,
                    discom_state: discomData[0].discom_state,
                    nameof_buyingutility: discomData[0].nameof_buyingutility,
                    PrevEnergy: json.PrevEnergy,
                    CurrEnergy: json.CurrEnergy,
                    PrevRate: json.PrevRate,
                    CurrRate: json.CurrRate,
                    currAmount: Number(currAmount).toFixed(2),
                    prevAmount: Number(prevAmount).toFixed(2),
                    genDate: dateFormatToInsert,
                    dueDate: dueDate,
                    dueDateToView: dueDateForViewOnly,
                    region:discomData[0].discom_state,
                    invoiceDate: transmissionInvoiceDetails[0].generation_date,
                    invoice_number: transmissionInvoiceDetails[0].invoice_number,
                    total_amount: total_amount,
                    delete_status: false,
                    file_path: '/upload/'+filePathToInsert+'.pdf',
                    file_path_docx: '/upload/'+filePathToInsert+'.docx',
                }
            }
            var idd = CreditDebitTransmission.insert(addressJson);
            addressJson.invoice_raised_to = discomData[0].invoice_raised_to;
            addressJson.discom_address = discomData[0].discom_address + ' ' + discomData[0].discom_address_line_two;
            addressJson.discom_city = discomData[0].discom_city;
            addressJson.discom_pin = discomData[0].discom_pin;
            addressJson.fax = discomData[0].discom_fax;
            addressJson.discom_short_name = biharRegion + discomData[0].discom_short_name;
            addressJson.date_of_amendment_one = discomData[0].date_of_amendment_one;
            addressJson.name = signatureJson.name;
            addressJson.designation = signatureJson.designation;
            addressJson.full_form = signatureJson.full_form;
            addressJson.phone = signatureJson.phone;
            addressJson.count = count1;
            addressJson.amountWords = amountWords;

            // var pdfMP={
            //    referenceNumberVar = "SECI/PT/CREDIT NOTE/"+currentYear+'/'+'90'+'1';
            //    invoice_raised_to=discomData[0].invoice_raised_to;
            //    discom_address=discomData[0].discom_address;
            //    discom_address_line_two=discomData[0].discom_address_line_two;
            //    discom_city=discomData[0].discom_city;
            //    discom_pin=discomData[0].discom_pin;
            //    discom_state=discomData[0].discom_state;
            //    date_of_amendment_one=discomData[0].date_of_amendment_one;
            //    nameof_buyingutility=discomData[0].date_of_amendment_one;
            // }
            var fs = require('fs');
            var Docxtemplater = require('docxtemplater');
            if (discomData[0].discom_state == 'Bihar') {// for bihar used other docx file
              if (type == 'Credit') {
                var filepath = Assets.absoluteFilePath('MP_Bihar_TransmissionManualCreditNote.docx');
              }else {
                var filepath = Assets.absoluteFilePath('MP_Bihar_TransmissionManualDebitNote.docx');
              }
            }else {
              if (type == 'Credit') {
                var filepath = Assets.absoluteFilePath('MP_TransmissionManualCreditNote.docx');
              }else {
                var filepath = Assets.absoluteFilePath('MP_TransmissionManualDebitNote.docx');
              }
            }
            var content = fs.readFileSync(filepath, "binary");
            var doc = new Docxtemplater(content);
            var fileName = 'Credit_Debit_Note/Transmission/'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year + '_' + json.month + '_' + random;
            // var fileName = '/python'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year+ '_' + json.month + '_' + random;
            var filepathToGeneratePdf = process.env.PWD + '/.uploads/';
            // var filepathToGeneratePdf = process.env.location + '/.python/';
            doc.setData(
                addressJson,
            );
            doc.render();
            var buffer = doc.getZip().generate({
                type: "nodebuffer"
            });

            fs.writeFileSync(filepathToGeneratePdf + fileName + '.docx', buffer);
            spawn = Npm.require('child_process').spawn;

            if (/^win/.test(process.platform)) {
                command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+fileName]);
            } else {
                command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+'Credit_Debit_Note/Transmission']);
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
            // Meteor.setTimeout(function() {
            //     Meteor.call('deleteUploadedFile',filepathToGeneratePdf + fileName +'.docx');
            // }, 10000);
            var filePathToReturn = '/upload/'+filePathToInsert+'.pdf';
            return returnSuccess('Pdf data found',filePathToReturn);






        } else if (json.CreditState == 'Rajasthan') {
            var transmissionInvoiceDetails = TransmissionInvoiceDetails.find({
                "month": json.month,
                "financial_year": json.FinancialYear,
                "spd_state": json.CreditState,
                "discom_state": json.DiscomState
            }).fetch();
            var datalength = transmissionInvoiceDetails.length;
            if (datalength == 0) {
                return returnFaliure('Transmission details not found');
            }
            var capacity = transmissionInvoiceDetails[0].project_capicity;
            if (transmissionInvoiceDetails[0].delete_status == false && transmissionInvoiceDetails[0].project_capicity != 0) {
                var capacity = transmissionInvoiceDetails[0].project_capicity;
                var total_amount = (capacity * Number(json.CurrRate)) - (capacity * Number(json.PrevRate));
                total_amount = Number(total_amount).toFixed(2);
                var amountWords = amountInWords(total_amount);
                if (total_amount < 0) {
                    var type = 'Credit';
                    var dueDate = '';
                    var dueDateForViewOnly = '';
                } else if (total_amount > 0) {
                    var type = 'Debit';
                    var myDate = moment().add(30, 'days');
                    var dueDate = myDate.format('DD-MM-YYYY');
                    var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
                } else {
                    return returnFaliure('Credit/debit note does not exist for Rajasthan');
                }
            } else {
                return returnFaliure('Credit/debit note does not exist for Rajasthan');
            }
            json.type = type;
            var dataRajasthan = json;
            var discomData = Discom.find({"discom_state": json.DiscomState}).fetch();
            var currentDate = new Date();
            var currentYear = moment(currentDate).format('YYYY');
            var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var transGenerationdate = transmissionInvoiceDetails[0].generation_date;
            var period = dateArr[Number(json.month) - 1] + "'" + transmissionInvoiceDetails[0].year;
            fromPeriod = '01' + ' ' + dateArr[Number(json.month) - 1] + ' ' + transmissionInvoiceDetails[0].year;
            var number_of_days = moment('"' + transmissionInvoiceDetails[0].year + '-' + json.month + '"', "YYYY-MM").daysInMonth()
            var ToPeriod = number_of_days + ' ' + dateArr[Number(json.month) - 1] + ' ' + transmissionInvoiceDetails[0].year;
            var currAmount = Number(capacity) * Number(json.CurrRate);
            var prevAmount = Number(capacity) * Number(json.PrevRate);
            var referenceCredit = 'SECI/' + discomData[0].discom_short_name + '/Rajasthan' + '/Transmission Charges/';
            var discom_name = transmissionInvoiceDetails[0].discom_name;
            var count2 = CreditDebitTransmission.find({month: transmissionInvoiceDetails[0].month, year: transmissionInvoiceDetails[0].year, discom_state: discomData[0].discom_state}).count() + 1;
            var random = Math.random().toString().substr(-3);
            var filePathToInsert = 'Credit_Debit_Note/Transmission/'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year  + '_' + json.month + '_' + random;

            // var filePath = discomData[0].discom_state + '_' + json.FinancialYear + '_' + json.month + '_' + random;
            var addressJson = {
                month: transmissionInvoiceDetails[0].month,
                year: transmissionInvoiceDetails[0].year,
                financial_year: transmissionInvoiceDetails[0].financial_year,
                spd_state: transmissionInvoiceDetails[0].spd_state,
                type: type,
                reference_number: "SECI/PT/"+type.toUpperCase()+" NOTE/" + currentYear + '/' + count2,
                discom_name: discom_name,
                discom_state: discomData[0].discom_state,
                discom_Id: discomData[0]._id,
                nameof_buyingutility: discomData[0].nameof_buyingutility,
                period: period,
                invoiceDate: transmissionInvoiceDetails[0].generation_date,
                invoice_number: transmissionInvoiceDetails[0].invoice_number,
                fromPeriod: fromPeriod,
                toPeriod: ToPeriod,
                PrevRate: json.PrevRate,
                CurrRate: json.CurrRate,
                CurrCapacity: capacity,
                PrevCapacity: capacity,
                currAmount: Number(currAmount).toFixed(2),
                prevAmount: Number(prevAmount).toFixed(2),
                genDate: dateFormatToInsert,
                dueDate: dueDate,
                dueDateToView: dueDateForViewOnly,
                total_amount: total_amount,
                delete_status: false,
                file_path: '/upload/'+filePathToInsert+'.pdf',
                file_path_docx: '/upload/'+filePathToInsert+'.docx',
            }

            var dataRajasthan = CreditDebitTransmission.insert(addressJson);
            addressJson.invoice_raised_to = discomData[0].invoice_raised_to;
            addressJson.discom_address = discomData[0].discom_address + ' ' + discomData[0].discom_address_line_two;
            addressJson.discom_city = discomData[0].discom_city;
            addressJson.discom_pin = discomData[0].discom_pin;
            addressJson.fax = discomData[0].discom_fax;
            addressJson.discom_short_name = discomData[0].discom_short_name;
            addressJson.date_of_amendment_one = discomData[0].date_of_amendment_one;
            addressJson.name = signatureJson.name;
            addressJson.designation = signatureJson.designation;
            addressJson.full_form = signatureJson.full_form;
            addressJson.phone = signatureJson.phone;
            addressJson.count = count2;
            addressJson.amountWords = amountWords;

            var fs = require('fs');
            var Docxtemplater = require('docxtemplater');
            if (type == 'Credit') {
              var filepath = Assets.absoluteFilePath('RajasthanAndGujaratTransmissionManualCreditNote.docx');
            }else {
              var filepath = Assets.absoluteFilePath('RajasthanAndGujaratTransmissionManualDebitNote.docx');
            }
            var content = fs.readFileSync(filepath, "binary");
            var doc = new Docxtemplater(content);
            var fileName = 'Credit_Debit_Note/Transmission/'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year + '_' + json.month + '_' + random;
            // var fileName = '/python'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year+ '_' + json.month + '_' + random;
            var filepathToGeneratePdf = process.env.PWD + '/.uploads/';
            // var filepathToGeneratePdf = process.env.location + '/.python/';
            doc.setData(
                addressJson,
            );
            doc.render();
            var buffer = doc.getZip().generate({
                type: "nodebuffer"
            });

            fs.writeFileSync(filepathToGeneratePdf + fileName + '.docx', buffer);
            spawn = Npm.require('child_process').spawn;

            if (/^win/.test(process.platform)) {
                command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+fileName]);
            } else {
                command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+'Credit_Debit_Note/Transmission']);
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
            // Meteor.setTimeout(function() {
            //     Meteor.call('deleteUploadedFile',filepathToGeneratePdf + fileName +'.docx');
            // }, 10000);
            var filePathToReturn = '/upload/'+filePathToInsert+'.pdf';
            return returnSuccess('Pdf data found',filePathToReturn);
        } else if (json.CreditState == 'Gujarat') {
            var transmissionInvoiceDetails = TransmissionInvoiceDetails.find({
                "month": json.month,
                "financial_year": json.FinancialYear,
                "spd_state": json.CreditState,
                "discom_state": "Odisha"
            }).fetch();
            var datalength = transmissionInvoiceDetails.length;
            if (datalength == 0) {
                return returnFaliure('Transmission details not found');
            }
            var capacity = transmissionInvoiceDetails[0].project_capicity;
            if (transmissionInvoiceDetails[0].delete_status == false && transmissionInvoiceDetails[0].project_capicity != 0) {
                var capacity = transmissionInvoiceDetails[0].project_capicity;
                var total_amount = ((Number(capacity) * Number(json.CurrRate)) - (Number(capacity) * Number(json.PrevRate)));
                total_amount = Number(total_amount).toFixed(2);
                var amountWords = amountInWords(total_amount);
                if (total_amount < 0) {
                    var type = 'Credit';
                    var dueDate = '';
                    var dueDateForViewOnly = '';
                } else if (total_amount > 0) {
                    var type = 'Debit';
                    var myDate = moment().add(30, 'days');
                    var dueDate = myDate.format('DD-MM-YYYY');
                    var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
                } else {
                    return returnFaliure('Credit/debit Note does not exist');
                }
            } else {
                return returnFaliure('Credit/debit Note does not exist for gujarat');
            }
            json.type = type;
            var dataGujarat = json;
            var discomData = Discom.find({
                "discom_state": "Odisha"
            }).fetch();
            var currentDate = new Date();
            var currentYear = moment(currentDate).format('YYYY');
            var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var transGenerationdate = transmissionInvoiceDetails[0].generation_date;
            var period = dateArr[Number(json.month) - 1] + "'" + transmissionInvoiceDetails[0].year;
            fromPeriod = '01 ' + dateArr[Number(json.month) - 1] + ' ' + transmissionInvoiceDetails[0].year;
            var number_of_days = moment('"' + transmissionInvoiceDetails[0].year + '-' + json.month + '"', "YYYY-MM").daysInMonth()
            var ToPeriod = number_of_days + ' ' + dateArr[Number(json.month) - 1] + ' ' + transmissionInvoiceDetails[0].year;
            var currAmount = Number(capacity) * Number(json.CurrRate);
            var prevAmount = Number(capacity) * Number(json.PrevRate);
            var discom_name = transmissionInvoiceDetails[0].discom_name;
            var count3 = CreditDebitTransmission.find({month: transmissionInvoiceDetails[0].month, year: transmissionInvoiceDetails[0].year, discom_state: discomData[0].discom_state}).count() + 1;
            var random = Math.random().toString().substr(-3);
            var filePathToInsert = 'Credit_Debit_Note/Transmission/'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year  + '_' + json.month + '_' + random;

            // var filePath = discomData[0].discom_state + '_' + json.FinancialYear + '_' + json.month + '_' + random;
            // var referenceCredit = 'SECI/' + discomData[0].discom_short_name + '/Gujarat' + '/Transmission Charges/';
            var addressJson = {
                month: transmissionInvoiceDetails[0].month,
                year: transmissionInvoiceDetails[0].year,
                financial_year: transmissionInvoiceDetails[0].financial_year,
                spd_state: transmissionInvoiceDetails[0].spd_state,
                type: type,
                discom_name: discom_name,
                discom_Id: discomData[0]._id,
                discom_state: discomData[0].discom_state,
                invoiceDate: transmissionInvoiceDetails[0].generation_date,
                nameof_buyingutility: discomData[0].nameof_buyingutility,
                reference_number: "SECI/PT/"+type.toUpperCase()+" NOTE/" + currentYear + '/' + count3,
                period: period,
                fromPeriod: fromPeriod,
                toPeriod: ToPeriod,
                PrevRate: json.PrevRate,
                CurrRate: json.CurrRate,
                CurrCapacity: capacity,
                PrevCapacity: capacity,
                currAmount: Number(currAmount).toFixed(2),
                prevAmount: Number(prevAmount).toFixed(2),
                genDate: dateFormatToInsert,
                dueDate: dueDate,
                dueDateToView: dueDateForViewOnly,
                total_amount: total_amount,
                invoice_date: json.Invoicedate,
                invoice_number: transmissionInvoiceDetails[0].invoice_number,
                delete_status: false,
                file_path: '/upload/'+filePathToInsert+'.pdf',
                file_path_docx: '/upload/'+filePathToInsert+'.docx',
            }
            var dataGujarat = CreditDebitTransmission.insert(addressJson);
            addressJson.invoice_raised_to = discomData[0].invoice_raised_to;
            addressJson.discom_address = discomData[0].discom_address + ' ' + discomData[0].discom_address_line_two;
            addressJson.discom_city = discomData[0].discom_city;
            addressJson.discom_pin = discomData[0].discom_pin;
            addressJson.fax = discomData[0].discom_fax;
            addressJson.discom_short_name = discomData[0].discom_short_name;
            addressJson.date_of_amendment_one = discomData[0].date_of_amendment_one;
            addressJson.name = signatureJson.name;
            addressJson.designation = signatureJson.designation;
            addressJson.full_form = signatureJson.full_form;
            addressJson.phone = signatureJson.phone;
            addressJson.count = count3;
            addressJson.amountWords = amountWords;

            var fs = require('fs');
            var Docxtemplater = require('docxtemplater');
            if (type == 'Credit') {
              var filepath = Assets.absoluteFilePath('RajasthanAndGujaratTransmissionManualCreditNote.docx');
            }else {
              var filepath = Assets.absoluteFilePath('RajasthanAndGujaratTransmissionManualDebitNote.docx');
            }
            var content = fs.readFileSync(filepath, "binary");
            var doc = new Docxtemplater(content);
            var fileName = 'Credit_Debit_Note/Energy/'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year + '_' + json.month + '_' + random;
            // var fileName = '/python'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year+ '_' + json.month + '_' + random;
            var filepathToGeneratePdf = process.env.PWD + '/.uploads/';
            // var filepathToGeneratePdf = process.env.location + '/.python/';
            doc.setData(
                addressJson,
            );
            doc.render();
            var buffer = doc.getZip().generate({
                type: "nodebuffer"
            });

            fs.writeFileSync(filepathToGeneratePdf + fileName + '.docx', buffer);
            spawn = Npm.require('child_process').spawn;

            if (/^win/.test(process.platform)) {
                command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+fileName]);
            } else {
                command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+'Credit_Debit_Note/Transmission']);
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
            // Meteor.setTimeout(function() {
            //     Meteor.call('deleteUploadedFile',filepathToGeneratePdf + fileName +'.docx');
            // }, 10000);
            var filePathToReturn = '/upload/'+filePathToInsert+'.pdf';
            return returnSuccess('Pdf data found',filePathToReturn);
        }

    },
    "SLDCCreditDebitPdf": function(financial_year, state, discomState, period, previous_rate, current_rate, periodId, signatureJson) {
        var InvoiceSLDCdetails = SLDCInvoiceDetails.find({
            "_id": periodId
        }).fetch();
        var datalength = InvoiceSLDCdetails.length;
        if (datalength == 0) {
            return returnFaliure('SLDC invoice not generated!');
        }
        var capacity = InvoiceSLDCdetails[0].project_capicity;
        if (InvoiceSLDCdetails[0].delete_status == false && InvoiceSLDCdetails[0].project_capicity != 0) {
            var capacity = InvoiceSLDCdetails[0].project_capicity;
            var total_amount = ((Number(capacity) * Number(current_rate)) - (Number(capacity) * Number(previous_rate)));
            total_amount = Number(total_amount).toFixed(2);
            var amountWords = amountInWords(total_amount);
            if (total_amount < 0) {
                var type = 'Credit';
                var typ = 'C';
                var dueDate = '';
                var dueDateForViewOnly = '';
            } else if (total_amount > 0) {
                var type = 'Debit';
                var typ = 'D';
                var myDate = moment().add(30, 'days');
                var dueDate = myDate.format('DD-MM-YYYY');
                var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
            } else {
                return returnFaliure('Credit/debit Note does not exist');
            }
        } else {
            return returnFaliure('Credit/debit Note does not exist for gujarat');
        }
        var discomData = Discom.find({
            "discom_state": discomState
        }).fetch();
        var currentDate = new Date();
        var currentYear = moment(currentDate).format('YYYY');
        var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var transGenerationdate = InvoiceSLDCdetails[0].generation_date;
        var sldcPeriod = period.split("-");
        var fromPeriod = period.substring(0, 10);
        var ToPeriod = period.substring(12);

        var sldcFromPeriod = dateArr[Number(sldcPeriod[1]) - 1] + "'" + sldcPeriod[2];
        var sldcMedPeriod = dateArr[Number(sldcPeriod[1])] + "'" + sldcPeriod[2];
        var sldcToPeriod = dateArr[Number(sldcPeriod[4]) - 1] + "'" + sldcPeriod[5];
        // var period=dateArr[Number(InvoiceSLDCdetails[0].month)-1]+"'"+InvoiceSLDCdetails[0].year;
        // fromPeriod='01 '+dateArr[Number(InvoiceSLDCdetails[0].month)-1]+' '+ InvoiceSLDCdetails[0].year;
        // var number_of_days = moment('"' + InvoiceSLDCdetails[0].year + '-' +  InvoiceSLDCdetails[0].month + '"', "YYYY-MM").daysInMonth()
        // var ToPeriod=number_of_days+' ' + dateArr[Number(InvoiceSLDCdetails[0].month)-1] +' '+ InvoiceSLDCdetails[0].year;

        var currAmount = Number(capacity) * Number(current_rate);
        var prevAmount = Number(capacity) * Number(previous_rate);
        var discom_name = InvoiceSLDCdetails[0].discom_name;
        var count4 = CreditDebitSLDC.find({month: InvoiceSLDCdetails[0].month, year: InvoiceSLDCdetails[0].year, discom_state: discomData[0].discom_state}).count() + 1;
        var random = Math.random().toString().substr(-3);
        // var filePath = discomData[0].discom_state + '_' + financial_year + '_' + InvoiceSLDCdetails[0].month + '_' + random;
        var filePathToInsert = 'Credit_Debit_Note/SLDC/'+discomData[0].discom_state + '_' + InvoiceSLDCdetails[0].year  + '_' + InvoiceSLDCdetails[0].month + '_' + random;

        var addressJson = {
            month: InvoiceSLDCdetails[0].month,
            year: InvoiceSLDCdetails[0].year,
            financial_year: InvoiceSLDCdetails[0].financial_year,
            spd_state: state,
            type: type,
            typ: typ,
            discom_name: discom_name,
            discom_Id: discomData[0]._id,
            discom_state: discomData[0].discom_state,
            discom_name: discom_name,
            invoiceDate: InvoiceSLDCdetails[0].generation_date,
            nameof_buyingutility: discomData[0].nameof_buyingutility,
            reference_number: "SECI/PT/"+type.toUpperCase()+" NOTE/" + currentYear + '/' + count4,
            fromPeriod: fromPeriod,
            ToPeriod: ToPeriod,
            PrevRate: previous_rate,
            CurrRate: current_rate,
            CurrCapacity: capacity,
            PrevCapacity: capacity,
            genDate: dateFormatToInsert,
            dueDate: dueDate,
            dueDateToView: dueDateForViewOnly,
            invoice_number: InvoiceSLDCdetails[0].invoice_number,
            total_amount: total_amount,
            delete_status: false,
            file_path: '/upload/'+filePathToInsert+'.pdf',
            file_path_docx: '/upload/'+filePathToInsert+'.docx',
        }
        var dataSLDC = CreditDebitSLDC.insert(addressJson);

        addressJson.currAmount = Number(currAmount).toFixed(2);
        addressJson.prevAmount = Number(prevAmount).toFixed(2);
        addressJson.sldcFromPeriod = sldcFromPeriod;
        addressJson.sldcMedPeriod = sldcMedPeriod;
        addressJson.sldcToPeriod = sldcToPeriod;
        addressJson.invoice_raised_to = discomData[0].invoice_raised_to;
        addressJson.discom_address = discomData[0].discom_address + ' ' + discomData[0].discom_address_line_two;
        addressJson.discom_city = discomData[0].discom_city;
        addressJson.discom_pin = discomData[0].discom_pin;
        addressJson.fax = discomData[0].discom_fax;
        addressJson.discom_short_name = discomData[0].discom_short_name;
        addressJson.date_of_amendment_one = discomData[0].date_of_amendment_one;
        addressJson.name = signatureJson.name;
        addressJson.designation = signatureJson.designation;
        addressJson.full_form = signatureJson.full_form;
        addressJson.phone = signatureJson.phone;
        addressJson.count = count4;
        addressJson.amountWords = amountWords;

        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        if (type == 'Credit') {
          var filepath = Assets.absoluteFilePath('SLDC_ManualCreditNote.docx');
        }else {
          var filepath = Assets.absoluteFilePath('SLDC_ManualDebitNote.docx');
        }
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        var fileName = 'Credit_Debit_Note/SLDC/'+discomData[0].discom_state + '_' + InvoiceSLDCdetails[0].year + '_' + InvoiceSLDCdetails[0].month + '_' + random;
        // var fileName = '/python'+discomData[0].discom_state + '_' + transmissionInvoiceDetails[0].year+ '_' + json.month + '_' + random;
        var filepathToGeneratePdf = process.env.PWD + '/.uploads/';
        // var filepathToGeneratePdf = process.env.location + '/.python/';
        doc.setData(
            addressJson,
        );
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });

        fs.writeFileSync(filepathToGeneratePdf + fileName + '.docx', buffer);
        spawn = Npm.require('child_process').spawn;

        if (/^win/.test(process.platform)) {
            command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+fileName]);
        } else {
            command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', filepathToGeneratePdf + fileName + '.docx', '--outdir', filepathToGeneratePdf+'Credit_Debit_Note/SLDC']);
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
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile',filepathToGeneratePdf + fileName +'.docx');
        // }, 10000);
        var filePathToReturn = '/upload/'+filePathToInsert+'.pdf';
        return returnSuccess('Pdf data found',filePathToReturn);
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

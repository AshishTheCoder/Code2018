Meteor.methods({
  'getDiscomList': function() {
    var discomNameVar = [];
    var data = Discom.find().fetch();
    data.forEach(function(item){
      discomNameVar.push({discomId:item._id,state:item.discom_state});
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
  'gettingAllInvoiceData': function(json) {
    var typeOfInvoiceArr = json.typeOfInvoiceArr;
    var dataLogArr = [];
    // if (json.filterType == 'Month') {
      var monthArr = json.monthArr;
      monthArr.forEach( function(mon) {
        var month = mon;
        var financialYear = json.financialYear;
        json.discomArr.forEach( function (item) {
          var discomId = item;
          var data = Discom.find({_id:item}).fetch();
          var discomState = data[0].discom_state;
          typeOfInvoiceArr.forEach( function(invType) {
            var invoiceType = invType;
            if (invoiceType == 'Energy') {//-------------------------------------------------------------Energy Calculation
              if (discomState == 'Rajasthan' || discomState == 'Maharashtra') {
                var invoiceArr = ['Provisional_Invoice', 'Credit', 'Debit'];
              }else {
                var invoiceArr = ['Provisional_Invoice'];
              }
              invoiceArr.forEach(function (inv) {
                var invoice_type = inv;

                if (discomState == 'Rajasthan') {
                  var cityArr = ['ajmer_discom', 'jaipur_discom', 'jodhpur_discom'];
                        cityArr.forEach( function(cty) {
                              var json = {
                                discomId:discomId,
                                discomState:discomState,
                                month:month,
                                financialYear:financialYear,
                                invoice_type:invoice_type,
                                city:cty
                              };
                              var data = getLogBookDataRepo(json);
                              if (data != 'Inoice Not Found') {
                                dataLogArr.push(data);
                              }
                            });
                }else if (discomState == 'Maharashtra') {
                              var cityArr = ['jsonILFS','JsonTodayGreen','jsonShardaConstruction','jsnVishvajEnergy','jsonSunilHitech'];
                              cityArr.forEach( function(cty) {
                              var json = {
                                discomId:discomId,
                                discomState:discomState,
                                month:month,
                                financialYear:financialYear,
                                invoice_type:invoice_type,
                                city:cty
                              };
                              var data = getLogBookDataRepo(json);
                              if (data != 'Inoice Not Found') {
                                dataLogArr.push(data);
                              }
                            });
                }else if (discomState == 'MP') {
                              var cityArr = ['cleanSolarJson','seiSitaraJson','seiVoltaJson','finnSuryaJson','focalPhotoJson'];
                              cityArr.forEach( function(cty) {
                              var json = {
                                discomId:discomId,
                                discomState:discomState,
                                month:month,
                                financialYear:financialYear,
                                invoice_type:invoice_type,
                                city:cty
                              };
                              var data = getLogBookDataRepo(json);
                              if (data != 'Inoice Not Found') {
                                dataLogArr.push(data);
                              }
                            });
                }else if (discomState == 'Bihar') {
                              var cityArr = ['North','South'];
                              cityArr.forEach( function(cty) {
                              var json = {
                                discomId:discomId,
                                discomState:discomState,
                                month:month,
                                financialYear:financialYear,
                                invoice_type:invoice_type,
                                city:cty
                              };
                              var data = getLogBookDataRepo(json);
                              if (data != 'Inoice Not Found') {
                                dataLogArr.push(data);
                              }
                            });
                }else if (discomState == 'Odisha') {
                            var cityArr = ['Gujarat','Rajasthan'];
                            cityArr.forEach( function(cty) {
                              var json = {
                                discomId:discomId,
                                discomState:discomState,
                                month:month,
                                financialYear:financialYear,
                                invoice_type:invoice_type,
                                city:cty
                              };
                              var data = getLogBookDataRepo(json);
                              if (data != 'Inoice Not Found') {
                                dataLogArr.push(data);
                              }
                            });
                }else {
                  var json = {
                    discomId:discomId,
                    discomState:discomState,
                    month:month,
                    financialYear:financialYear,
                    invoice_type:invoice_type
                  };
                  var data = getLogBookDataRepo(json);
                  if (data != 'Inoice Not Found') {
                    dataLogArr.push(data);
                  }
                }
              });
            }
            if (invoiceType == 'Incentive') {//-------------------------------------------------------------Incentive Calculation
              var checkInter = Discom.find({discom_state: discomState, transaction_type: 'Inter'}).fetch();
              if (checkInter.length > 0) {
                var json = {discomId:discomId,discomState:discomState,month:month,financialYear:financialYear};
                var data = getLogBookDataReportForIncentive(json);
                if (data != 'Inoice Not Found') {
                  dataLogArr.push(data);
                }
              }
            }
            if (invoiceType == 'SLDC') {//-------------------------------------------------------------SLDC Calculation
              if (discomState == 'Jharkhand' || discomState == 'Haryana' || discomState == 'Delhi(BYPL)' || discomState == 'Delhi(BRPL)' || discomState == 'Delhi(TPDDL)' || discomState == 'Himachal Pradesh' || discomState == 'Assam' || discomState == 'Punjab' || discomState == 'Maharashtra') {
                var json = {discomId:discomId,discomState:discomState,month:month,financialYear:financialYear};
                var data = getLogBookDataReportForSLDC(json,'Rajasthan');
                if (data != 'Inoice Not Found') {
                  dataLogArr.push(data);
                }
              }
              if (discomState == 'Odisha') {
                var arrState = ['Rajasthan', 'Gujarat']
                var json = {discomId:discomId,discomState:discomState,month:month,financialYear:financialYear};
                arrState.forEach( function(spdState) {
                var data = getLogBookDataReportForSLDC(json, spdState);
                if (data != 'Inoice Not Found') {
                  dataLogArr.push(data);
                }
              });
              }
            }
            if (invoiceType == 'Transmission') {//-------------------------------------------------------------Transmission Calculation
              var json = {discomId:discomId,discomState:discomState,month:month,financialYear:financialYear};
              if (discomState == 'Bihar') {
                var arrState = ['North Bihar', 'South Bihar']
                arrState.forEach( function(region) {
                  var json = {discomId:discomId,discomState:discomState, spdState:'MP', region:region, month:month,financialYear:financialYear};
                var data = getLogBookDataReportForTransmission(json);
                if (data != 'Inoice Not Found') {
                  dataLogArr.push(data);
                }
              });
            }else if (discomState == 'Odisha' || discomState == 'Maharashtra') {
              if (discomState == 'Odisha') {
                var arrState = ['Rajasthan', 'Gujarat'];
              }else {
                var arrState = ['Rajasthan', 'MP'];
              }
              arrState.forEach( function(spdState) {
                var json = {discomId:discomId,discomState:discomState, spdState:spdState, month:month,financialYear:financialYear};
              var data = getLogBookDataReportForTransmission(json);
              if (data != 'Inoice Not Found') {
                dataLogArr.push(data);
              }
            });
            }else {
                if (discomState == 'Goa' || discomState == 'Chhattisgarh') {
                  var spdStateVar = 'MP';
                }else {
                  var spdStateVar = 'Rajasthan';
                }
                var json = {discomId:discomId,discomState:discomState, spdState:spdStateVar, month:month,financialYear:financialYear};
                var data = getLogBookDataReportForTransmission(json);
                if (data != 'Inoice Not Found') {
                  dataLogArr.push(data);
                }
              }
            }
          });
        });
      });
    // console.log('************************************************************************************************************************************');
    // console.log(dataLogArr);
    // console.log('************************************************************************************************************************************');
    return returnSuccess('Getting All Invoices Data',dataLogArr);
  },


  submitInvoiceLogFilterData(dataArr, invoiceType){
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
      dataArr.forEach(function(jsonData) {
        if(jsonData.invoice_type == 'Incentive'){
          var getDocId = Discom.find({discom_state:jsonData.discomState}).fetch();
          var incentiveJson = {
            "discomId": getDocId[0]._id,
            "discom_name": getDocId[0].nameof_buyingutility,
            "discom_state": jsonData.discomState,
            "month": jsonData.month,
            "financial_year": jsonData.financial_year,
            "invoice_number": jsonData.invoice_number,
            "capacity": jsonData.capacity,
            "rate_per_unit": jsonData.rate_per_unit,
            "generation_date": jsonData.energy_invoice_generation_date,
            "due_date": jsonData.energy_invoice_due_date,
            "incentive_charges": jsonData.amount_of_invoice,
            "payment_amount": jsonData.payment_amount,
            "short_payment_amount": jsonData.short_payment,
            "date_of_payment": jsonData.date_of_payment,
            "sur_charge_amount": jsonData.sir_charge_amount,
            "sur_charge": '1.25%',
            "timestamp": new Date(),
            "remarks": jsonData.remarks
          };
          var checkData = LogbookIncentive.find({financial_year:incentiveJson.financial_year,invoice_number:incentiveJson.invoice_number,discomId:incentiveJson.discomId}).fetch();
          if (checkData.length > 0) {
            if (checkData[0].date_of_payment == '' && Number(checkData[0].payment_amount) == 0 && Number(checkData[0].sur_charge_amount) == 0) {
              var test = LogbookIncentive.update({_id:checkData[0]._id}, {$set: {payment_amount:incentiveJson.payment_amount, date_of_payment:incentiveJson.date_of_payment, short_payment_amount:incentiveJson.short_payment_amount,sur_charge_amount:incentiveJson.sur_charge_amount, remarks:incentiveJson.remarks}})
            }else {
              if (Number(incentiveJson.payment_amount) > 0 && incentiveJson.date_of_payment != '') {
                LogbookIncentive.insert(incentiveJson);
              }
            }
          }else {
            LogbookIncentive.insert(incentiveJson);
          }
          LogDetails.insert({
              ip_address:ipArr,
              user_id: Meteor.userId(),
              user_name: Meteor.user().username,
              log_type: 'Incentive LogBook',
              template_name: 'logbook_discom',
              event_name: 'logbookdiscumform',
              action_date: moment().format('DD-MM-YYYY'),
              timestamp: new Date(),
              json: incentiveJson
          });
        }else if (jsonData.invoice_type == 'SLDC') {
          var getDocId = Discom.find({discom_state:jsonData.discomState}).fetch();
          var sldcJson = {
            "discomId": getDocId[0]._id,
            "discom_name": getDocId[0].nameof_buyingutility,
            "discom_state" : jsonData.discomState,
            "financial_year" : jsonData.financial_year,
            "document_id" : jsonData.document_id,
            "invoice_number" : jsonData.invoice_number,
            "project_capicity" : jsonData.project_capicity,
            "generation_date" : jsonData.energy_invoice_generation_date,
            "due_date" : jsonData.energy_invoice_due_date,
            "total_amount" : jsonData.amount_of_invoice,
            "short_payment_amount" : jsonData.short_payment,
            "date_of_payment" : jsonData.date_of_payment,
            "payment_amount" : jsonData.payment_amount,
            "sur_charge_amount" : jsonData.sir_charge_amount,
            "sur_charge" : "1.25%",
            "sldc_charges" : jsonData.rate_per_unit,
            "sldc_charges_from" : jsonData.sldc_charges_from,
            "sldc_charges_to" : jsonData.sldc_charges_to,
            "year" : jsonData.year,
            "month" : jsonData.month,
            "timestamp" : new Date(),
            "remarks" : jsonData.remarks,
            "spdState" : jsonData.spd_state
          };
          var checkData = LogbookSLDC.find({financial_year:sldcJson.financial_year,invoice_number:sldcJson.invoice_number,discomId:sldcJson.discomId}).fetch();
          if (checkData.length > 0) {
            if (checkData[0].date_of_payment == '' && Number(checkData[0].payment_amount) == 0 && Number(checkData[0].sur_charge_amount) == 0) {
              var test = LogbookSLDC.update({_id:checkData[0]._id}, {$set: {payment_amount:sldcJson.payment_amount, date_of_payment:sldcJson.date_of_payment, short_payment_amount:sldcJson.short_payment_amount,sur_charge_amount:sldcJson.sur_charge_amount, remarks:sldcJson.remarks}})
            }else {
              if (Number(sldcJson.payment_amount) > 0 && sldcJson.date_of_payment != '') {
                LogbookSLDC.insert(sldcJson);
              }
            }
          }else {
            LogbookSLDC.insert(sldcJson);
          }
          LogDetails.insert({
              ip_address:ipArr,
              user_id: Meteor.userId(),
              user_name: Meteor.user().username,
              log_type: 'SLDC LogBook',
              template_name: 'logbook_discom',
              event_name: 'logbookdiscumform',
              action_date: moment().format('DD-MM-YYYY'),
              timestamp: new Date(),
              json: sldcJson
          });

        }else if (jsonData.invoice_type == 'Transmission') {
          var getDocId = Discom.find({discom_state:jsonData.discomState}).fetch();
          var transmissionJson = {
            "discomId": getDocId[0]._id,
            "discom_name": getDocId[0].nameof_buyingutility,
            "month" : jsonData.month,
            "year" : jsonData.year,
            "financial_year" : jsonData.financial_year,
            "discom_state" : jsonData.discomState,
            "generation_date" : jsonData.energy_invoice_generation_date,
            "due_date" : jsonData.energy_invoice_due_date,
            "invoice_number" : jsonData.invoice_number,
            "date_of_payment" : jsonData.date_of_payment,
            "total_transmission_invoice" : jsonData.amount_of_invoice,
            "transmission_charges" :  jsonData.rate_per_unit,
            "payment_amount" : jsonData.payment_amount,
            "short_payment_amount" : jsonData.short_payment,
            "sur_charge_amount" : jsonData.sir_charge_amount,
            "sur_charge" : "1.25%",
            "remarks" : jsonData.remarks,
            "timestamp" : new Date(),
            "total_energy_or_project_capicity" : jsonData.total_energy_or_project_capicity,
            "spdState" : jsonData.spd_state,
          };
          if (jsonData.discomState == 'Bihar') {
            transmissionJson.region = jsonData.region;
          }

          var checkData = LogbookTransmission.find({financial_year:transmissionJson.financial_year,invoice_number:transmissionJson.invoice_number,discomId:transmissionJson.discomId}).fetch();
          if (checkData.length > 0) {
            if (checkData[0].date_of_payment == '' && Number(checkData[0].payment_amount) == 0 && Number(checkData[0].sur_charge_amount) == 0) {
              var test = LogbookTransmission.update({_id:checkData[0]._id}, {$set: {payment_amount:transmissionJson.payment_amount, date_of_payment:transmissionJson.date_of_payment, short_payment_amount:transmissionJson.short_payment_amount,sur_charge_amount:transmissionJson.sur_charge_amount, remarks:transmissionJson.remarks}})
            }else {
              if (Number(transmissionJson.payment_amount) > 0 && transmissionJson.date_of_payment != '') {
                LogbookTransmission.insert(transmissionJson);
              }
            }
          }else {
            LogbookTransmission.insert(transmissionJson);
          }
          LogDetails.insert({
              ip_address:ipArr,
              user_id: Meteor.userId(),
              user_name: Meteor.user().username,
              log_type: 'Transmission LogBook',
              template_name: 'logbook_discom',
              event_name: 'logbookdiscumform',
              action_date: moment().format('DD-MM-YYYY'),
              timestamp: new Date(),
              json: transmissionJson
          });
        }else {
          var checkInvoiceType = jsonData.invoice_type;
          if (checkInvoiceType != 'Incentive' && checkInvoiceType != 'SLDC' && checkInvoiceType != 'Transmission') {
            jsonData.timeStamp = new Date();
            if (jsonData.invoice_type == 'Debit' || jsonData.invoice_type == 'Credit') {
              var checkData = LogbookDiscom.find({month:jsonData.month,invoice_from:jsonData.invoice_from,invoice_type:jsonData.invoice_type,financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number}).fetch();
              if (checkData.length > 0) {
                if (checkData[0].date_of_payment == '' && Number(checkData[0].payment_amount) == 0 && Number(checkData[0].sir_charge_amount) == 0) {
                  var test = LogbookDiscom.update({_id:checkData[0]._id}, {$set: {payment_amount:jsonData.payment_amount, date_of_payment:jsonData.date_of_payment, short_payment:jsonData.short_payment,sir_charge_amount:jsonData.sir_charge_amount, remarks:jsonData.remarks}})
                }else {
                  if (Number(jsonData.payment_amount) > 0 && jsonData.date_of_payment != '') {
                    LogbookDiscom.insert(jsonData);
                  }
                }
              }else {
                LogbookDiscom.insert(jsonData);
              }
            }else {
              var checkData = LogbookDiscom.find({month:jsonData.month,financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number}).fetch();
              if (checkData.length > 0) {
                if (checkData[0].date_of_payment == '' && Number(checkData[0].payment_amount) == 0 && Number(checkData[0].sir_charge_amount) == 0) {
                  var test = LogbookDiscom.update({_id:checkData[0]._id}, {$set: {payment_amount:jsonData.payment_amount, date_of_payment:jsonData.date_of_payment, short_payment:jsonData.short_payment,sir_charge_amount:jsonData.sir_charge_amount, remarks:jsonData.remarks}})
                }else {
                  // removing _id from json to insert new Document
                  var keyToDelete = "_id";
                  delete jsonData[keyToDelete];
                  if (Number(jsonData.payment_amount) > 0 && jsonData.date_of_payment != '') {
                    LogbookDiscom.insert(jsonData);
                  }
                }
              }else {
                LogbookDiscom.insert(jsonData);
              }
            }
            // data insert in log Details collection
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: 'Energy LogBook',
                template_name: 'logbook_discom',
                event_name: 'logbookdiscumform',
                action_date: moment().format('DD-MM-YYYY'),
                timestamp: new Date(),
                json: jsonData
            });
          }
        }
      });
      return returnSuccess('Saved Successfully Logbook_Discom');
  }
});

getSurCharges = function(invoiceAmount, dateOfPayment, dueDateVar){
  var sirChargeAmountVar = 0;
  var payment = dateOfPayment;
  var dueDateVar = dueDateVar;
  var dueValue = dueDateVar.split('-');
  dueValueSplit = dueValue[2] + '/' + dueValue[1] + '/' + dueValue[0];
  dueValueSplit = moment(dueValueSplit, 'YYYY-MM-DD');
  var paymentValue = payment.split('-');
  paymentValueSplit = paymentValue[2] + '/' + paymentValue[1] + '/' + paymentValue[0];
  paymentValueSplit = moment(paymentValueSplit, 'YYYY-MM-DD');
  var daysDifference = dueValueSplit.diff(paymentValueSplit, 'days');
  if (daysDifference < 0) {
      var amountRecieved = invoiceAmount;
      var difference = Math.abs(daysDifference);
      var multiply = Number(amountRecieved) * 0.0125 * 12 * Number(difference);
      var sirCharge = Number(multiply) / Number(365);
      sirChargeAmountVar = sirCharge;
  } else {
      sirChargeAmountVar = 0;
  }
  return sirChargeAmountVar;
}


getLogBookDataRepo = function(json) {
  if (json.discomState == 'Rajasthan' || json.discomState == 'Maharashtra') {
    if (json.invoice_type == 'Provisional_Invoice') {
      if (json.discomState == 'Rajasthan') {
        var dataAvailable = LogbookDiscom.find({
            discomId: json.discomId,
            month: json.month,
            financial_year: json.financialYear,
            invoice_type: json.invoice_type,
            invoice_from: json.city
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
      }else {
        var dataAvailable = LogbookDiscom.find({
            discomId: json.discomId,
            month: json.month,
            financial_year: json.financialYear,
            invoice_type: json.invoice_type
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
      }
      var dataAvailable = LogbookDiscom.find({
          discomId: json.discomId,
          month: json.month,
          financial_year: json.financialYear,
          invoice_type: json.invoice_type,
          invoice_from: json.city
      }, {
          sort: {
              $natural: -1
          },
          limit: 1
      }).fetch();
    }else {
      var dataAvailable = LogbookDiscom.find({
          discomId: json.discomId,
          month: json.month,
          financial_year: json.financialYear,
          invoice_type: json.invoice_type,
          invoice_from: json.city
      }, {
          sort: {
              $natural: -1
          },
          limit: 1
      }).fetch();
    }
  }else if(json.discomState == 'Odisha' || json.discomState == 'MP' || json.discomState == 'Bihar') {
    var dataAvailable = LogbookDiscom.find({
        discomId: json.discomId,
        month: json.month,
        financial_year: json.financialYear,
        invoice_type: json.invoice_type,
        invoice_from: json.city
    }, {
        sort: {
            $natural: -1
        },
        limit: 1
    }).fetch();
  } else {
    var dataAvailable = LogbookDiscom.find({
        discomId: json.discomId,
        month: json.month,
        financial_year: json.financialYear,
        invoice_type: json.invoice_type
    }, {
        sort: {
            $natural: -1
        },
        limit: 1
    }).fetch();
  }
  if (dataAvailable.length > 0) {
    dataAvailable[0].energy_invoice_generation_date = dataAvailable[0].energy_invoice_generation_date;
    dataAvailable[0].energy_invoice_due_date = dataAvailable[0].energy_invoice_due_date;
    dataAvailable[0].total_energy = Number(dataAvailable[0].total_energy);
    dataAvailable[0].amount_of_invoice = Number(Number(dataAvailable[0].amount_of_invoice) - Number(dataAvailable[0].payment_amount)).toFixed(2);
    dataAvailable[0].min_energy = Discom.findOne({_id: json.discomId}).min_energy;
    dataAvailable[0].max_energy = Discom.findOne({_id: json.discomId}).max_energy;
    dataAvailable[0].discomState = Discom.findOne({_id: json.discomId}).discom_state;
    dataAvailable[0].usedCollection = 'LogbookDiscom';
    return returnSuccess("Discom data already available in logbook_discom", dataAvailable[0]);
  } else {
    var jsonEnergy = EnergyInvoiceDetails.find({financial_year: json.financialYear, month: json.month, discom_id: json.discomId, type: json.invoice_type,delete_status:false}).fetch();
    if (jsonEnergy.length > 0) {
        if (json.discomState == 'Rajasthan' || json.discomState == 'Maharashtra') {
          if (json.invoice_type == 'Provisional_Invoice') {
            if (json.discomState == 'Rajasthan') {
              var data = {
                  invoice_number: jsonEnergy[0][json.city].invoice_number,
                  total_energy: jsonEnergy[0][json.city].total_energy,
                  rate_per_unit: jsonEnergy[0][json.city].rate_per_unit,
                  amount_of_invoice: jsonEnergy[0][json.city].total_amount,
                  actual_energy: jsonEnergy[0][json.city].actual_energy,
                  spdId: jsonEnergy[0][json.city].spdId,
                  energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                  energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                  month: jsonEnergy[0].month,
                  year: jsonEnergy[0].year,
                  invoice_type: jsonEnergy[0].type,
                  invoice_from: json.city
              }
            }else {
              var data = {
                  invoice_number: jsonEnergy[0].invoice_number,
                  total_energy: jsonEnergy[0].total_energy,
                  rate_per_unit: jsonEnergy[0].rate_per_unit,
                  amount_of_invoice: jsonEnergy[0].total_amount,
                  energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                  energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                  month: jsonEnergy[0].month,
                  year: jsonEnergy[0].year,
                  invoice_type: jsonEnergy[0].type,
                  invoice_from: json.city
              }
            }
          }else {
              var data = {
                  invoice_number: jsonEnergy[0][json.city].invoice_number,
                  total_energy: jsonEnergy[0][json.city].total_energy,
                  rate_per_unit: jsonEnergy[0][json.city].rate_per_unit,
                  amount_of_invoice: jsonEnergy[0][json.city].total_amount,
                  actual_energy: jsonEnergy[0][json.city].actual_energy,
                  spdId: jsonEnergy[0][json.city].spdId,
                  energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                  energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                  month: jsonEnergy[0].month,
                  year: jsonEnergy[0].year,
                  invoice_type: jsonEnergy[0].type,
                  invoice_from: json.city
              }
          }
        }else if (json.discomState == 'MP') {
          var data = {
              invoice_number: jsonEnergy[0][json.city].invoice_number,
              total_energy: jsonEnergy[0][json.city].total_energy,
              rate_per_unit: jsonEnergy[0][json.city].rate_per_unit,
              amount_of_invoice: jsonEnergy[0][json.city].total_amount,
              actual_energy: jsonEnergy[0][json.city].actual_energy,
              spdId: jsonEnergy[0][json.city].spdId,
              energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
              energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
              month: jsonEnergy[0].month,
              year: jsonEnergy[0].year,
              invoice_type: jsonEnergy[0].type,
              invoice_from: json.city

          }
        }else if (json.discomState == 'Bihar') {
            var data = {};
            _.each(jsonEnergy, function(item, key) {
                if (item.spd_direction == json.city) {
                    data.invoice_number = item.invoice_number,
                    data.total_energy = item.total_energy,
                    data.rate_per_unit = item.rate_per_unit,
                    data.amount_of_invoice = item.total_amount,
                    data.energy_invoice_generation_date = item.energy_invoice_generation_date,
                    data.energy_invoice_due_date = item.energy_invoice_due_date,
                    data.month = item.month,
                    data.year = item.year,
                    data.invoice_type = jsonEnergy[0].type,
                    data.invoice_from = json.city
                }
            })
        } else if (json.discomState == 'Odisha') {
            var data = {}
            _.each(jsonEnergy, function(item, key) {
                if (item.spd_state == json.city.toUpperCase()) {
                    data.invoice_number = item.invoice_number,
                    data.total_energy = item.total_energy,
                    data.rate_per_unit = item.rate_per_unit,
                    data.amount_of_invoice = item.total_amount,
                    data.energy_invoice_generation_date = item.energy_invoice_generation_date,
                    data.energy_invoice_due_date = item.energy_invoice_due_date,
                    data.month = item.month,
                    data.year = item.year,
                    data.invoice_type = jsonEnergy[0].type,
                    data.invoice_from = json.city
                }
            })
        } else {
            var data = {
                invoice_number: jsonEnergy[0].invoice_number,
                total_energy: jsonEnergy[0].total_energy,
                rate_per_unit: jsonEnergy[0].rate_per_unit,
                amount_of_invoice: jsonEnergy[0].total_amount,
                energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                month: jsonEnergy[0].month,
                year: jsonEnergy[0].year,
                invoice_type: jsonEnergy[0].type
            }
        }
        data.financial_year = json.financialYear;
        data.discomId = json.discomId;
        data.discom_name = Discom.findOne({_id: json.discomId}).nameof_buyingutility;
        data.discomState = Discom.findOne({_id: json.discomId}).discom_state;
        data.min_energy = Discom.findOne({_id: json.discomId}).min_energy;
        data.max_energy = Discom.findOne({_id: json.discomId}).max_energy;
        data.usedCollection = 'EnergyInvoiceDetails';
        var toReturn = {data:data};
        return toReturn;
    } else {
        return 'Inoice Not Found';
    }
  }
}

getLogBookDataReportForIncentive = function(json) {
  var returnData = '';
  var checkData = LogbookIncentive.find({discomId:json.discomId,discom_state:json.discomState,financial_year:json.financialYear, month: json.month}).fetch();
  if (checkData.length == 0) {
    var data = IncentiveChargesDetail.find({delete_status:false,discom_state:json.discomState,financial_year:json.financialYear, month: json.month}).fetch();
    if (data.length > 0) {
      var jsonData = {
        month: data[0].month,
        financial_year:data[0].financial_year,
        invoice_number:data[0].invoice_number,
        capacity:data[0].capacity,
        discomState : data[0].discom_state,
        invoice_type : 'Incentive',
        rate_per_unit:data[0].rate_per_unit,
        energy_invoice_generation_date:data[0].generation_date,
        energy_invoice_due_date:data[0].due_date,
        amount_of_invoice: Number(Number(data[0].incentive_charges)).toFixed(3),
      };
      returnData = jsonData;
    }
  }else {
    var data = LogbookIncentive.find({discomId:json.discomId,financial_year:json.financialYear, month:json.month},{sort: {$natural: -1},limit: 1}).fetch();
    var jsonData = {
      month: data[0].month,
      financial_year:data[0].financial_year,
      invoice_number:data[0].invoice_number,
      capacity:data[0].capacity,
      discomState : data[0].discom_state,
      invoice_type : 'Incentive',
      rate_per_unit:data[0].rate_per_unit,
      energy_invoice_generation_date:data[0].generation_date,
      energy_invoice_due_date:data[0].due_date,
      amount_of_invoice: Number(Number(data[0].incentive_charges) - Number(data[0].payment_amount)).toFixed(3),
    };
    returnData = jsonData;
  }
  var toReturn = {data:returnData};
  if (data.length > 0) {
    return toReturn;
  }else {
    return "Inoice Not Found";
  }
}

getLogBookDataReportForSLDC = function(json, spdState) {
  var returnData = '';
  if (json.discomState == 'Odisha') {
    var data = LogbookSLDC.find({discom_state:json.discomState, month:json.month, financial_year:json.financialYear, spdState: spdState},{sort: {$natural: -1},limit: 1}).fetch();
  }else {
    var data = LogbookSLDC.find({discom_state:json.discomState, month:json.month, financial_year:json.financialYear},{sort: {$natural: -1},limit: 1}).fetch();
  }
  if (data.length > 0) {
    var jsonData = {
      document_id : data[0].document_id,
      invoice_number : data[0].invoice_number,
      discomState : data[0].discom_state,
      month : data[0].month,
      year : data[0].year,
      financial_year : json.financialYear,
      project_capicity : data[0].project_capicity,
      invoice_type : 'SLDC',
      energy_invoice_generation_date : data[0].generation_date,
      energy_invoice_due_date : data[0].due_date,
      amount_of_invoice : Number(Number(data[0].total_amount) - Number(data[0].payment_amount)).toFixed(2),
      rate_per_unit : data[0].sldc_charges,
      sldc_charges_from : data[0].sldc_charges_from,
      sldc_charges_to : data[0].sldc_charges_to,
      spd_state : spdState,
    };
    returnData = jsonData;
  }else {
    if (json.discomState == 'Odisha') {
      var data = SLDCInvoiceDetails.find({delete_status: false, month:json.month, financial_year:json.financialYear, discom_state:json.discomState, spd_state: spdState}).fetch();
    }else {
      var data = SLDCInvoiceDetails.find({delete_status: false, month:json.month, financial_year:json.financialYear, discom_state:json.discomState}).fetch();
    }
    if (data.length > 0) {
      var jsonData = {
        document_id : data[0]._id,
        invoice_number : data[0].invoice_number,
        discomState : data[0].discom_state,
        month : data[0].month,
        year : data[0].year,
        financial_year : json.financialYear,
        project_capicity : data[0].project_capicity,
        invoice_type : 'SLDC',
        energy_invoice_generation_date : data[0].generation_date,
        energy_invoice_due_date : data[0].due_date,
        amount_of_invoice : Number(Number(data[0].total_amount)).toFixed(2),
        rate_per_unit : data[0].sldc_charges,
        sldc_charges_from : data[0].sldc_charges_from,
        sldc_charges_to : data[0].sldc_charges_to,
        spd_state : spdState,
      };
      var returnData = jsonData;
    }
  }
  var toReturn = {data:returnData};
  if (data.length > 0) {
    return toReturn;
  }else {
    return "Inoice Not Found";
  }
}


getLogBookDataReportForTransmission = function(json) {
  var returnData = '';
  if (json.discomState == 'Odisha' || json.discomState == 'Maharashtra'){
    var checkData = LogbookTransmission.find({discom_state:json.discomState, spdState:json.spdState, month:json.month,financial_year:json.financialYear}).fetch();
  }else if (json.discomState == 'Bihar') {
    var checkData = LogbookTransmission.find({discom_state:json.region,month:json.month,financial_year:json.financialYear}).fetch();
  }else {
    var checkData = LogbookTransmission.find({discom_state:json.discomState,month:json.month,financial_year:json.financialYear}).fetch();
  }
  if (checkData.length == 0) {
    if (json.discomState == 'Bihar') {
      var data = TransmissionInvoiceDetails.find({delete_status:false,month:json.month,discom_state:json.discomState,region:json.region,financial_year:json.financialYear}).fetch();
    }else if (json.discomState == 'Odisha' || json.discomState == 'Maharashtra') {
      var data = TransmissionInvoiceDetails.find({delete_status:false,month:json.month,discom_state:json.discomState,spd_state:json.spdState,financial_year:json.financialYear}).fetch();
    }else {
      var data = TransmissionInvoiceDetails.find({delete_status:false,month:json.month,discom_state:json.discomState,financial_year:json.financialYear}).fetch();
    }
    if (data.length > 0) {
      var jsonData = {
        month: data[0].month,
        year:data[0].year,
        financial_year : json.financialYear,
        invoice_type : 'Transmission',
        discomState: data[0].discom_state,
        invoice_number:data[0].invoice_number,
        rate_per_unit:data[0].transmission_charges,
        energy_invoice_generation_date:data[0].generation_date,
        energy_invoice_due_date:data[0].due_date,
        amount_of_invoice: Number(data[0].total_transmission_invoice),
        spd_state : json.spdState
      };
      if (json.spdState == 'MP') {
        jsonData.total_energy_or_project_capicity = data[0].total_energy;
      }else {
        jsonData.total_energy_or_project_capicity = data[0].project_capicity;
      }
      if (json.discomState == 'Bihar') {
        jsonData.region = json.region;
      }
    }
    returnData = jsonData;
  }else {
    if (json.discomState == 'Bihar') {
      var data = LogbookTransmission.find({month:json.month,discom_state:json.region,financial_year:json.financialYear},{sort: {$natural: -1},limit: 1}).fetch();
    }else if (json.discomState == 'Odisha' || json.discomState == 'Maharashtra') {
      var data = LogbookTransmission.find({month:json.month,discom_state:json.discomState,spdState:json.spdState,financial_year:json.financialYear}).fetch();
    }else {
      var data = LogbookTransmission.find({month:json.month,discom_state:json.discomState,financial_year:json.financialYear},{sort: {$natural: -1},limit: 1}).fetch();
    }
    if (data.length > 0) {
      var jsonData = {
        month: data[0].month,
        year:data[0].year,
        financial_year : json.financialYear,
        invoice_type : 'Transmission',
        discomState: data[0].discom_state,
        invoice_number:data[0].invoice_number,
        rate_per_unit:data[0].transmission_charges,
        total_energy_or_project_capicity:data[0].total_energy_or_project_capicity,
        energy_invoice_generation_date:data[0].generation_date,
        energy_invoice_due_date:data[0].due_date,
        amount_of_invoice: Number(data[0].total_transmission_invoice) - Number(data[0].payment_amount).toFixed(2),
        spd_state : json.spdState
      };
      if (json.discomState == 'Bihar') {
        jsonData.region = json.region;
      }
      returnData = jsonData;
    }
  }
  var toReturn = {data:returnData};
  if (data.length > 0) {
    return toReturn;
  }else {
    return "Inoice Not Found";
  }
}

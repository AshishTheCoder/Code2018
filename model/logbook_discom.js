Meteor.methods({
    callDiscomAllNames() {
        var json = Discom.find({}, {sort: {nameof_buyingutility: 1}}).fetch();
        if (json.length > 0) {
            var namesArray = [];
            json.forEach(function(item) {
                namesArray.push({names: item.nameof_buyingutility, discomId: item._id, discomState: item.discom_state})
            })
            return returnSuccess("Got all discoms from logbook_discom", namesArray);
        } else {
            return returnFaliure("Discom Not Available for logbook_discom");
        }
    },
    getDiscomAllNamesForIC() {
        var json = Discom.find({transaction_type:'Inter'}, {sort: {nameof_buyingutility: 1}}).fetch();
        if (json.length > 0) {
            var namesArray = [];
            json.forEach(function(item) {
                namesArray.push({names: item.nameof_buyingutility, discomId: item._id, discomState: item.discom_state})
            })
            return returnSuccess("Got all discoms from logbook_discom", namesArray);
        } else {
            return returnFaliure("Discom Not Available for logbook_discom");
        }
    },
    //---------------------------------
    callDiscomData(json) {
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
          console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
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
            console.log(dataAvailable.length);
            console.log(dataAvailable);
        }
        if (dataAvailable.length > 0) {
            dataAvailable[0].energy_invoice_generation_date = dataAvailable[0].energy_invoice_generation_date;
            dataAvailable[0].energy_invoice_due_date = dataAvailable[0].energy_invoice_due_date;
            dataAvailable[0].total_energy = Number(dataAvailable[0].total_energy);
            dataAvailable[0].total_amount = Number(dataAvailable[0].amount_of_invoice) - Number(dataAvailable[0].payment_amount);
            dataAvailable[0].min_energy = Discom.findOne({_id: json.discomId}).min_energy;
            dataAvailable[0].max_energy = Discom.findOne({_id: json.discomId}).max_energy;
            dataAvailable[0].usedCollection = 'LogbookDiscom';
            return returnSuccess("Discom data already Available in logbook_discom", dataAvailable[0]);
        } else {
            var jsonEnergy = EnergyInvoiceDetails.find({financial_year: json.financialYear, month: json.month, discom_id: json.discomId, type: json.invoice_type,delete_status:false}).fetch();
            if (jsonEnergy.length > 0) {
                if (json.discomState == 'Rajasthan' || json.discomState == 'Maharashtra') {
                  if (json.invoice_type == 'Provisional_Invoice') {
                    if (json.discomState == 'Rajasthan') {
                      var toReturn = {
                          invoice_number: jsonEnergy[0][json.city].invoice_number,
                          total_energy: jsonEnergy[0][json.city].total_energy,
                          rate_per_unit: jsonEnergy[0][json.city].rate_per_unit,
                          total_amount: jsonEnergy[0][json.city].total_amount,
                          actual_energy: jsonEnergy[0][json.city].actual_energy,
                          spdId: jsonEnergy[0][json.city].spdId,
                          energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                          energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                          month: jsonEnergy[0].month,
                          year: jsonEnergy[0].year
                      }
                    }else {
                      var toReturn = {
                          invoice_number: jsonEnergy[0].invoice_number,
                          total_energy: jsonEnergy[0].total_energy,
                          rate_per_unit: jsonEnergy[0].rate_per_unit,
                          total_amount: jsonEnergy[0].total_amount,
                          energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                          energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                          month: jsonEnergy[0].month,
                          year: jsonEnergy[0].year
                      }
                    }
                  }else {
                      var toReturn = {
                          invoice_number: jsonEnergy[0][json.city].invoice_number,
                          total_energy: jsonEnergy[0][json.city].total_energy,
                          rate_per_unit: jsonEnergy[0][json.city].rate_per_unit,
                          total_amount: jsonEnergy[0][json.city].total_amount,
                          actual_energy: jsonEnergy[0][json.city].actual_energy,
                          spdId: jsonEnergy[0][json.city].spdId,
                          energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                          energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                          month: jsonEnergy[0].month,
                          year: jsonEnergy[0].year
                      }
                  }
                }else if (json.discomState == 'MP') {
                  var toReturn = {
                      invoice_number: jsonEnergy[0][json.city].invoice_number,
                      total_energy: jsonEnergy[0][json.city].total_energy,
                      rate_per_unit: jsonEnergy[0][json.city].rate_per_unit,
                      total_amount: jsonEnergy[0][json.city].total_amount,
                      actual_energy: jsonEnergy[0][json.city].actual_energy,
                      spdId: jsonEnergy[0][json.city].spdId,
                      energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                      energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                      month: jsonEnergy[0].month,
                      year: jsonEnergy[0].year
                  }
                }else if (json.discomState == 'Bihar') {
                    var toReturn = {}
                    _.each(jsonEnergy, function(item, key) {
                        if (item.spd_direction == json.city) {
                            toReturn.invoice_number = item.invoice_number,
                            toReturn.total_energy = item.total_energy,
                            toReturn.rate_per_unit = item.rate_per_unit,
                            toReturn.total_amount = item.total_amount,
                            toReturn.energy_invoice_generation_date = item.energy_invoice_generation_date,
                            toReturn.energy_invoice_due_date = item.energy_invoice_due_date,
                            toReturn.month = item.month,
                            toReturn.year = item.year
                        }
                    })
                } else if (json.discomState == 'Odisha') {
                    var toReturn = {}
                    _.each(jsonEnergy, function(item, key) {
                        if (item.spd_state == json.city.toUpperCase()) {
                            toReturn.invoice_number = item.invoice_number,
                            toReturn.total_energy = item.total_energy,
                            toReturn.rate_per_unit = item.rate_per_unit,
                            toReturn.total_amount = item.total_amount,
                            toReturn.energy_invoice_generation_date = item.energy_invoice_generation_date,
                            toReturn.energy_invoice_due_date = item.energy_invoice_due_date,
                            toReturn.month = item.month,
                            toReturn.year = item.year
                        }
                    })
                } else {
                    var toReturn = {
                        invoice_number: jsonEnergy[0].invoice_number,
                        total_energy: jsonEnergy[0].total_energy,
                        rate_per_unit: jsonEnergy[0].rate_per_unit,
                        total_amount: jsonEnergy[0].total_amount,
                        energy_invoice_generation_date: jsonEnergy[0].energy_invoice_generation_date,
                        energy_invoice_due_date: jsonEnergy[0].energy_invoice_due_date,
                        month: jsonEnergy[0].month,
                        year: jsonEnergy[0].year
                    }
                }

                toReturn.min_energy = Discom.findOne({_id: json.discomId}).min_energy;
                toReturn.max_energy = Discom.findOne({_id: json.discomId}).max_energy;
                toReturn.usedCollection = 'EnergyInvoiceDetails';
                return returnSuccess("Fetching discom data from energy invoice", toReturn);
            } else {
                return returnFaliure("No Discom data Available in Energy Invoice");
            }
        }
    },
    "saveDiscomLogbook": function(jsonData,invoiceType) {
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      if (invoiceType == 'Energy Invoice') {
        jsonData.timeStamp = new Date();
        if (jsonData.invoice_type == 'Debit' || jsonData.invoice_type == 'Credit') {
          if(LogbookDiscom.discom_state=='Rajasthan' || LogbookDiscom.discom_state=='Maharashtra'){
          var checkData = LogbookDiscom.find({month:jsonData.month,invoice_from:jsonData.invoice_from,invoice_type:jsonData.invoice_type,financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number}).fetch();
        }else{
          var checkData = LogbookDiscom.find({month:jsonData.month,invoice_type:jsonData.invoice_type,financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number}).fetch();
        }
        // console.log(jsonData);
        console.log("888888888888888888888888888888888888811111111111111111111111111111");
        console.log(checkData.length);
        // console.log(checkData);
          if (checkData.length > 0) {
            if (checkData[0].date_of_payment != '') {
              var test = LogbookDiscom.update({_id:checkData[0]._id}, {$set: {payment_amount:jsonData.payment_amount, date_of_payment:jsonData.date_of_payment, short_payment:jsonData.short_payment,sur_charge_amount:jsonData.sur_charge_amount, remarks:jsonData.remarks, max_energy:jsonData.max_energy, min_energy:jsonData.min_energy,}})
            }else {
              LogbookDiscom.insert(jsonData);
            }
          }else {
            LogbookDiscom.insert(jsonData);
          }
        }else {
          var checkData = LogbookDiscom.find({month:jsonData.month,financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number}).fetch();
          if (checkData.length > 0) {
            if (checkData[0].date_of_payment != '' && Number(checkData[0].payment_amount) == 0 && Number(checkData[0].sur_charge_amount) == 0) {
              var test = LogbookDiscom.update({_id:checkData[0]._id}, {$set: {payment_amount:jsonData.payment_amount, date_of_payment:jsonData.date_of_payment, short_payment:jsonData.short_payment,sur_charge_amount:jsonData.sur_charge_amount, remarks:jsonData.remarks ,}})
            }else {
              LogbookDiscom.insert(jsonData);
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
        return returnSuccess('Saved Successfully Logbook_Discom');
      }
      else if (invoiceType == 'Transmission Invoice') {
        if (jsonData.discom_state == 'North Bihar' || jsonData.discom_state == 'South Bihar') {
          var discomData = Discom.find({discom_state:'Bihar'}).fetch();
          jsonData.region = jsonData.discom_state;
          jsonData.discom_state = 'Bihar';
        }else {
          var discomData = Discom.find({discom_state:jsonData.discom_state}).fetch();
        }
        jsonData.discomId = discomData[0]._id;
        jsonData.discom_name = discomData[0].nameof_buyingutility;
        var checkData = LogbookTransmission.find({month:jsonData.month,financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number,discom_state:jsonData.discom_state}).fetch();
        if (checkData.length > 0) {
          if (checkData[0].date_of_payment != ''){
            LogbookTransmission.update({_id:checkData[0]._id},{$set:{payment_amount:jsonData.payment_amount, date_of_payment:jsonData.date_of_payment, short_payment_amount:jsonData.short_payment_amount,sur_charge_amount:jsonData.sur_charge_amount, remarks:jsonData.remarks}});
          }else {
            LogbookTransmission.insert(jsonData);
          }
        }else {
          LogbookTransmission.insert(jsonData);
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
            json: jsonData
        });
        return returnSuccess('Transmission Logbook Saved Successfully!');
      }
      else if (invoiceType == 'SLDC Invoice') {
        var discomData = Discom.find({discom_state:jsonData.discom_state}).fetch();
        jsonData.discomId = discomData[0]._id;
        jsonData.discom_name = discomData[0].nameof_buyingutility;
        var checkData = LogbookSLDC.find({financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number,discom_state:jsonData.discom_state}).fetch();
        if (checkData.length > 0) {
          if (checkData[0].date_of_payment != ''){
            LogbookSLDC.update({_id:checkData[0]._id},{$set:{payment_amount:jsonData.payment_amount, date_of_payment:jsonData.date_of_payment, short_payment_amount:jsonData.short_payment_amount,sur_charge_amount:jsonData.sur_charge_amount, remarks:jsonData.remarks}});
          }else {
            LogbookSLDC.insert(jsonData);
          }
        }else {
          LogbookSLDC.insert(jsonData);
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
            json: jsonData
        });
        return returnSuccess('SLDC Logbook Saved Successfully!');
      }
      else if (invoiceType == 'Incentive Invoice') {
        var discomData = Discom.find({discom_state:jsonData.discom_state}).fetch();
        jsonData.discomId = discomData[0]._id;
        jsonData.discom_name = discomData[0].nameof_buyingutility;
        var checkData = LogbookIncentive.find({financial_year:jsonData.financial_year,invoice_number:jsonData.invoice_number,discomId:jsonData.discomId}).fetch();
        if (checkData.length > 0) {
          jsonData.month = checkData[0].month;
          if (checkData[0].date_of_payment != '' && Number(checkData[0].payment_amount) == 0 && Number(checkData[0].sur_charge_amount) == 0) {
            var test = LogbookIncentive.update({_id:checkData[0]._id}, {$set: {payment_amount:jsonData.payment_amount, date_of_payment:jsonData.date_of_payment, short_payment_amount:jsonData.short_payment_amount,sur_charge_amount:jsonData.sur_charge_amount, remarks:jsonData.remarks}})
          }else {
            LogbookIncentive.insert(jsonData);
          }
        }else {
          LogbookIncentive.insert(jsonData);
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
            json: jsonData
        });
        return returnSuccess('SLDC Logbook Saved Successfully!');
      }
    },
    // saveDiscomLogbook(month,financeYear,discomId){
    //   --------------------------------Edit Option Is Time Taking,,,, thats why we can add delecte option for  last submitted invoice--------------------------
    //   return returnSuccess('Energy Data Fetched For Update!');
    // },
    gettingDiscomState(state){
      var spdStateArr = [];
      var data = Meteor.users.find({
          "profile.registration_form.spd_state": state,
          "profile.registration_form.transaction_type": "Inter"
      }).fetch();
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
      if (state == 'MP') {
        var index = discomStateVar.indexOf('Bihar');
        discomStateVar.splice(index, 1);
        discomStateVar.push('North Bihar');
        discomStateVar.push('South Bihar');
      }
      return returnSuccess('Returning Discom State For TC Log Book',discomStateVar);
    },
    gettingTCdataForLogBook(monthVar,spdState,discomState,financialYear){
      var returnData = '';
      if (discomState == 'North Bihar' || discomState == 'South Bihar') {
        var checkData = LogbookTransmission.find({spdState:spdState,month:monthVar,region:discomState,financial_year:financialYear}).fetch();
      }else {
        var checkData = LogbookTransmission.find({spdState:spdState,month:monthVar,discom_state:discomState,financial_year:financialYear}).fetch();
      }
      if (checkData.length == 0) {
        if (discomState == 'North Bihar' || discomState == 'South Bihar') {
          var data = TransmissionInvoiceDetails.find({delete_status:false,month:monthVar,spd_state:spdState,region:discomState,financial_year:financialYear}).fetch();
        }else {
          var data = TransmissionInvoiceDetails.find({delete_status:false,month:monthVar,spd_state:spdState,discom_state:discomState,financial_year:financialYear}).fetch();
        }
        if (discomState == 'North Bihar' || discomState == 'South Bihar') {
          var getDocId = Discom.find({discom_state:'Bihar'}).fetch();
        }else {
          var getDocId = Discom.find({discom_state:discomState}).fetch();
        }
        if (data.length > 0) {
          if (spdState == 'MP') {
            returnData = data[0];
            var totalEnergy = returnData.total_energy;
            var keyToDelete = "total_energy";
            delete returnData[keyToDelete];
            returnData.total_energy_or_project_capicity = totalEnergy;
            returnData.discomId = getDocId[0]._id;
            returnData.discom_name = getDocId[0].nameof_buyingutility;
          }else {
            returnData = data[0];
            var projectCapicity = returnData.project_capicity;
            var keyToDelete = "project_capicity";
            delete returnData[keyToDelete];
            returnData.total_energy_or_project_capicity = projectCapicity;
            returnData.discomId = getDocId[0]._id;
            returnData.discom_name = getDocId[0].nameof_buyingutility;
          }
        }
      }else {
        if (discomState == 'North Bihar' || discomState == 'South Bihar') {
          var data = LogbookTransmission.find({month:monthVar,spdState:spdState,region:discomState,financial_year:financialYear},{sort: {$natural: -1},limit: 1}).fetch();
        }else {
          var data = LogbookTransmission.find({month:monthVar,spdState:spdState,discom_state:discomState,financial_year:financialYear},{sort: {$natural: -1},limit: 1}).fetch();
        }
        var json = {
          year:data[0].year,
          invoice_number:data[0].invoice_number,
          total_energy_or_project_capicity:data[0].total_energy_or_project_capicity,
          total_energy:data[0].total_energy,
          generation_date:data[0].generation_date,
          due_date:data[0].due_date,
          transmission_charges: data[0].transmission_charges,
          total_transmission_invoice: Number(data[0].total_transmission_invoice) - Number(data[0].payment_amount),
        };
        returnData = json;
      }
      if (data.length > 0) {
        return returnSuccess('Finding Data For TC Log Book',returnData);
      }else {
        return returnFaliure("Transmission Invoice Not Generated!");
      }
    },
    gettingSLDCInvoicePeriod(financialYear, discomState){
      var data = SLDCInvoiceDetails.find({financial_year:financialYear,discom_state:discomState,delete_status:false}).fetch();
      var returnData = [];
      _.each(data, function(item){
        var period = item.sldc_charges_from+" - "+item.sldc_charges_to;
        returnData.push({id:item._id, period:period});
      });
      if (data.length > 0) {
        return returnSuccess('Getting Period For SLDC Log Book',returnData);
      }else {
        return returnFaliure("SLDC Invoice Not Generated!");
      }
    },
    gettingDocumentForSLDCInvoice(id){
      var sldcDatadata = SLDCInvoiceDetails.find({_id:id}).fetch();
      var data = LogbookSLDC.find({invoice_number:sldcDatadata[0].invoice_number},{sort: {$natural: -1},limit: 1}).fetch();
      if (data.length > 0) {
      	var returnJson = {
          invoice_number : data[0].invoice_number,
        	project_capicity : data[0].project_capicity,
        	generation_date : data[0].generation_date,
        	due_date : data[0].due_date,
        	total_amount : Number(Number(data[0].total_amount) - Number(data[0].payment_amount)).toFixed(2),
          sldc_charges : data[0].sldc_charges,
          sldc_charges_from : data[0].sldc_charges_from,
          sldc_charges_to : data[0].sldc_charges_to
        };
      }else {
        var data = SLDCInvoiceDetails.find({_id:id}).fetch();
        var returnJson = data[0];
      }
        return returnSuccess('Getting Period For SLDC Log Book',returnJson);
    },
    gettingIncentiveInvoice(financialYear,discomState,discomId){
      var returnData = '';
      var checkData = LogbookIncentive.find({discomId:discomId,discom_state:discomState,financial_year:financialYear}).fetch();
      if (checkData.length == 0) {
        var data = IncentiveChargesDetail.find({delete_status:false,discom_state:discomState,financial_year:financialYear}).fetch();
        if (data.length > 0) {
          returnData = data[0];
        }
      }else {
        var data = LogbookIncentive.find({discomId:discomId,financial_year:financialYear},{sort: {$natural: -1},limit: 1}).fetch();
        var json = {
          financial_year:data[0].financial_year,
          invoice_number:data[0].invoice_number,
          capacity:data[0].capacity,
          rate_per_unit:data[0].rate_per_unit,
          generation_date:data[0].generation_date,
          due_date:data[0].due_date,
          incentive_charges: Number(Number(data[0].incentive_charges) - Number(data[0].payment_amount)).toFixed(3),
        };
        returnData = json;
      }
      if (data.length > 0) {
        return returnSuccess('Fetching Incentive Charges Data!',returnData);
      }else {
        return returnFaliure("Incentive Invoice Not Generated!");
      }
    }
});

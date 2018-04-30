Meteor.methods({
  gettingAllInvoiceDataForReporting(json) {
    var financialYear = json.financialYear;
    var monthArr = json.monthArr;
    var discomArr = json.discomArr;
    var typeOfInvoiceArr = json.typeOfInvoiceArr;
    var allDataArr = [];
    if (json.filterType == 'Payment Received') {
      discomArr.forEach( function(discomId) {
        typeOfInvoiceArr.forEach( function(typeofInvoice) {
          //  getting differe of fromDate nad toDate and creating loop to check it
          fromDate = json.fromDate.split('-');
          toDate = json.toDate.split('-');
          fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
          toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
          date1_unixtime = parseInt(fromDate.getTime() / 1000);
          date2_unixtime = parseInt(toDate.getTime() / 1000);
          var timeDifference = date2_unixtime - date1_unixtime;
          var timeDifferenceInHours = timeDifference / 60 / 60;
          var timeDifferenceInDays = timeDifferenceInHours / 24;
          if (timeDifferenceInDays >= 0) {
              fromDate.setDate(fromDate.getDate());
              for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
                  var loopDate = moment(fromDate).format('DD-MM-YYYY');
                  if (typeofInvoice == 'Energy') {
                    var energyData = LogbookDiscom.find({date_of_payment : loopDate, discomId:discomId}).fetch();
                    energyData.forEach(function(item) {
                      var json = {
                        month: item.month,
                        year: item.year,
                        financial_year : item.financial_year,
                        invoice_type : 'Energy',
                        discomState: item.discomState,
                        discom_name: item.discom_name,
                        invoice_number:item.invoice_number,
                        total_energy_or_project_capicity:item.total_energy,
                        rate_per_unit:item.rate_per_unit,
                        generation_date:item.energy_invoice_generation_date,
                        due_date:item.energy_invoice_due_date,
                        amount_of_invoice: item.amount_of_invoice,
                        payment_amount: item.payment_amount,
                        date_of_payment: item.date_of_payment,
                        short_payment_amount: item.short_payment,
                        sirChargeAmount: item.sir_charge_amount,
                        remarks: item.remarks
                      };
                      allDataArr.push(json);
                    });
                  }
                  if (typeofInvoice == 'Incentive') {
                    var incentiveData = LogbookIncentive.find({date_of_payment : loopDate, discomId: discomId}).fetch();
                    incentiveData.forEach(function(item) {
                      var json = {
                        month: item.month,
                        year: item.year,
                        financial_year : item.financial_year,
                        invoice_type : 'Incentive',
                        discomState: item.discom_state,
                        discom_name: item.discom_name,
                        invoice_number:item.invoice_number,
                        total_energy_or_project_capicity:item.capacity,
                        rate_per_unit:item.rate_per_unit,
                        generation_date:item.generation_date,
                        due_date:item.due_date,
                        amount_of_invoice: item.incentive_charges,
                        payment_amount: item.payment_amount,
                        date_of_payment: item.date_of_payment,
                        short_payment_amount: item.short_payment_amount,
                        sirChargeAmount: item.sur_charge_amount,
                        remarks: item.remarks
                      };
                      allDataArr.push(json);
                    });
                  }
                  if (typeofInvoice == 'SLDC') {
                    var sldcData = LogbookSLDC.find({date_of_payment : loopDate, discomId: discomId}).fetch();
                    sldcData.forEach(function(item) {
                      var json = {
                        month: item.month,
                        year: item.year,
                        financial_year : item.financial_year,
                        invoice_type : 'SLDC',
                        discomState: item.discom_state,
                        discom_name: item.discom_name,
                        invoice_number:item.invoice_number,
                        total_energy_or_project_capicity:item.project_capicity,
                        rate_per_unit:item.sldc_charges,
                        generation_date:item.generation_date,
                        due_date:item.due_date,
                        amount_of_invoice: item.total_amount,
                        payment_amount: item.payment_amount,
                        date_of_payment: item.date_of_payment,
                        short_payment_amount: item.short_payment_amount,
                        sirChargeAmount: item.sur_charge_amount,
                        remarks: item.remarks
                      };
                      allDataArr.push(json);
                    });
                  }
                  if (typeofInvoice == 'Transmission') {
                    var transmissionData = LogbookTransmission.find({date_of_payment : loopDate, discomId: discomId}).fetch();
                    transmissionData.forEach(function(item) {
                      var json = {
                        month: item.month,
                        year: item.year,
                        financial_year : item.financial_year,
                        invoice_type : 'Transmission',
                        discomState: item.discom_state,
                        discom_name: item.discom_name,
                        invoice_number:item.invoice_number,
                        total_energy_or_project_capicity:item.total_energy_or_project_capicity,
                        rate_per_unit:item.transmission_charges,
                        generation_date:item.generation_date,
                        due_date:item.due_date,
                        amount_of_invoice: item.total_transmission_invoice,
                        payment_amount: item.payment_amount,
                        date_of_payment: item.date_of_payment,
                        short_payment_amount: item.short_payment_amount,
                        sirChargeAmount: item.sur_charge_amount,
                        remarks: item.remarks
                      };
                      allDataArr.push(json);
                    });
                  }
                  fromDate.setDate(fromDate.getDate() + 1);
              }
          } else {
              console.log('Days are in negative');
          }
        });
      });
    }else {
      discomArr.forEach( function(discomId) {
        typeOfInvoiceArr.forEach( function(typeofInvoice) {
          monthArr.forEach( function(month) {
            if (typeofInvoice == 'Energy') {
              var energyData = LogbookDiscom.find({month : month, financial_year : financialYear, discomId:discomId}).fetch();
              energyData.forEach(function(item) {
                var json = {
                  month: item.month,
                  year: item.year,
                  financial_year : item.financial_year,
                  invoice_type : 'Energy',
                  discomState: item.discomState,
                  discom_name: item.discom_name,
                  invoice_number:item.invoice_number,
                  total_energy_or_project_capicity:item.total_energy,
                  rate_per_unit:item.rate_per_unit,
                  generation_date:item.energy_invoice_generation_date,
                  due_date:item.energy_invoice_due_date,
                  amount_of_invoice: item.amount_of_invoice,
                  payment_amount: item.payment_amount,
                  date_of_payment: item.date_of_payment,
                  short_payment_amount: item.short_payment,
                  sirChargeAmount: item.sir_charge_amount,
                  remarks: item.remarks
                };
                allDataArr.push(json);
              });
            }
            if (typeofInvoice == 'Incentive') {
              var incentiveData = LogbookIncentive.find({month : month, financial_year : financialYear, discomId: discomId}).fetch();
              incentiveData.forEach(function(item) {
                var json = {
                  month: item.month,
                  year: item.year,
                  financial_year : item.financial_year,
                  invoice_type : 'Incentive',
                  discomState: item.discom_state,
                  discom_name: item.discom_name,
                  invoice_number:item.invoice_number,
                  total_energy_or_project_capicity:item.capacity,
                  rate_per_unit:item.rate_per_unit,
                  generation_date:item.generation_date,
                  due_date:item.due_date,
                  amount_of_invoice: item.incentive_charges,
                  payment_amount: item.payment_amount,
                  date_of_payment: item.date_of_payment,
                  short_payment_amount: item.short_payment_amount,
                  sirChargeAmount: item.sur_charge_amount,
                  remarks: item.remarks
                };
                allDataArr.push(json);
              });
            }
            if (typeofInvoice == 'SLDC') {
              var sldcData = LogbookSLDC.find({month : month, financial_year : financialYear, discomId: discomId}).fetch();
              sldcData.forEach(function(item) {
                var json = {
                  month: item.month,
                  year: item.year,
                  financial_year : item.financial_year,
                  invoice_type : 'SLDC',
                  discomState: item.discom_state,
                  discom_name: item.discom_name,
                  invoice_number:item.invoice_number,
                  total_energy_or_project_capicity:item.project_capicity,
                  rate_per_unit:item.sldc_charges,
                  generation_date:item.generation_date,
                  due_date:item.due_date,
                  amount_of_invoice: item.total_amount,
                  payment_amount: item.payment_amount,
                  date_of_payment: item.date_of_payment,
                  short_payment_amount: item.short_payment_amount,
                  sirChargeAmount: item.sur_charge_amount,
                  remarks: item.remarks
                };
                allDataArr.push(json);
              });
            }
            if (typeofInvoice == 'Transmission') {
              var transmissionData = LogbookTransmission.find({month : month, financial_year : financialYear, discomId: discomId}).fetch();
              transmissionData.forEach(function(item) {
                var json = {
                  month: item.month,
                  year: item.year,
                  financial_year : item.financial_year,
                  invoice_type : 'Transmission',
                  discomState: item.discom_state,
                  discom_name: item.discom_name,
                  invoice_number:item.invoice_number,
                  total_energy_or_project_capicity:item.total_energy_or_project_capicity,
                  rate_per_unit:item.transmission_charges,
                  generation_date:item.generation_date,
                  due_date:item.due_date,
                  amount_of_invoice: item.total_transmission_invoice,
                  payment_amount: item.payment_amount,
                  date_of_payment: item.date_of_payment,
                  short_payment_amount: item.short_payment_amount,
                  sirChargeAmount: item.sur_charge_amount,
                  remarks: item.remarks
                };
                allDataArr.push(json);
              });
            }
          });
        });
      });
    }
    return returnSuccess('Saved Successfully Logbook_Discom',allDataArr);
  },
// ----------------Below function is used for update discom state with new key "discomState" and its value in LogbookDiscom-----------//
  // updateLogVookDiscomStateForAll(){
  //   var data = LogbookDiscom.find().fetch();
  //   console.log('Total Document TO Update = '+data.length);
  //   data.forEach( function(item) {
  //     var discomStateVar = Discom.findOne({_id:item.discomId}).discom_state;
  //     console.log(discomStateVar);
  //     LogbookDiscom.update({_id:item._id}, {$set: {discomState:discomStateVar}});
  //   });
  //   console.log('All Document Updated  Successfully!');
  // }
});

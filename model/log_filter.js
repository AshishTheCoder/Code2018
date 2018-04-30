Meteor.methods({
    createAlertDataByLogFilter(userDetails) {
        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $push: {
                'profile.alert': userDetails
            }
        });
        return returnSuccess('Alert created by log filter module');
    },
    alertCreatedForDiscom(userDetails) {
        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $push: {
                'profile.alert': userDetails
            }
        });
        return returnSuccess('Alert Created for discom by log filter module');
    },
    "callRaisedBySeci": function(schemeName) {
        var discomNames = [];
        var data = Discom.find({scheme:schemeName}, {
            sort: {
                'nameof_buyingutility': 1
            }
        }).fetch();
        data.forEach(function(item) {
            discomNames.push({discomId: item._id, names: item.nameof_buyingutility});
        })
        return returnSuccess('Raised by seci Discoms from log_filter', discomNames);
    },
    callDiscomReport(discomId, financialYear) {
            var returnArr = [];
            var json = LogbookDiscom.find({financial_year : { $in: financialYear},discomId: { $in: discomId}}).fetch();
            if (json.length > 0) {
                var calArray = [];
                json.forEach(function(item) {
                    calArray.push(item.total_energy);
                });
                let camulativeTotal = Number(sumOfArray(calArray)).toFixed(2);

                json.forEach(function(item) {
                  let discomId = item.discomId;
                  let maxEnergy = Discom.findOne({_id: discomId}).min_energy;
                  let minEnergy = Discom.findOne({_id: discomId}).max_energy;
                  item.max_energy = maxEnergy;
                  item.min_energy = minEnergy;
                  let diff = Number(maxEnergy) - Number(camulativeTotal);
                  let percentage = (Number(diff) / Number(maxEnergy)) * 100;
                  let returnPercentage = Number(100) - Number(percentage.toFixed(2));
                  if (Number(returnPercentage) > 85) {
                    item.difference = returnPercentage.toFixed(2) + "%";
                    item.alert = true;
                  }else {
                    item.difference = 0 + "%";
                    item.alert = false;
                  }
                  returnArr.push(item);
                });

                var amountOfInvoice = 0;
                var paymentAmount = 0;
                var shortPayment = 0;
                var totalEnergy = 0;
                var maxEnergy = 0;
                var minEnergy = 0;
                var sirChargeAmount = 0;
                _.each(returnArr, function(item) {
                  amountOfInvoice += Number(item.amount_of_invoice);
                  paymentAmount += Number(item.payment_amount);
                  shortPayment += Number(item.short_payment);
                  totalEnergy += Number(item.total_energy);
                  maxEnergy += Number(item.max_energy);
                  minEnergy += Number(item.min_energy);
                  sirChargeAmount += Number(item.sir_charge_amount);
                });
                var totalJson = {
                  amountOfInvoice:Number(amountOfInvoice).toFixed(2),
                  paymentAmount:Number(paymentAmount).toFixed(2),
                  shortPayment:Number(shortPayment).toFixed(2),
                  totalEnergy:Number(totalEnergy).toFixed(2),
                  maxEnergy:Number(maxEnergy).toFixed(2),
                  minEnergy:Number(minEnergy).toFixed(2),
                  sirChargeAmount:Number(sirChargeAmount).toFixed(2),
                };
                var toReturn = {
                    list: returnArr,
                    cumulative: camulativeTotal,
                    totalJson:totalJson
                }
                return returnSuccess("Discom Data fetched from log_filter", toReturn);
            } else {
                return returnFaliure("No data Available in " + financialYear);
            }
    },
    callDiscomReportOfMonth(discomId, selectedMonth, financialYear) {
            var json = LogbookDiscom.find({month : { $in: selectedMonth},financial_year : { $in: financialYear},discomId: { $in: discomId}}).fetch();
            var returnArr = [];
            json.forEach(function(item) {
              var discomId = item.discomId;
              item.max_energy = Discom.findOne({_id: discomId}).max_energy;
              item.min_energy = Discom.findOne({_id: discomId}).min_energy;
              returnArr.push(item);
            });

            var amountOfInvoice = 0;
            var paymentAmount = 0;
            var shortPayment = 0;
            var totalEnergy = 0;
            var maxEnergy = 0;
            var minEnergy = 0;
            var sirChargeAmount = 0;
            _.each(returnArr, function(item) {
              amountOfInvoice += Number(item.amount_of_invoice);
              paymentAmount += Number(item.payment_amount);
              shortPayment += Number(item.short_payment);
              totalEnergy += Number(item.total_energy);
              maxEnergy += Number(item.max_energy);
              minEnergy += Number(item.min_energy);
              sirChargeAmount += Number(item.sir_charge_amount);
            });
            var totalJson = {
              amountOfInvoice:Number(amountOfInvoice).toFixed(2),
              paymentAmount:Number(paymentAmount).toFixed(2),
              shortPayment:Number(shortPayment).toFixed(2),
              totalEnergy:Number(totalEnergy).toFixed(2),
              maxEnergy:Number(maxEnergy).toFixed(2),
              minEnergy:Number(minEnergy).toFixed(2),
              sirChargeAmount:Number(sirChargeAmount).toFixed(2),
            };
            var toReturn = {
                list: returnArr,
                totalJson:totalJson
            }
            return returnSuccess("Month Report called from log_filter of " + monthInWords(selectedMonth), toReturn);
    },
    callDiscomReportOfPayment(fromDate, toDate) {
        var fromValue = fromDate.split('-');
        fromDate = fromValue[2] + '-' + fromValue[1] + '-' + fromValue[0];
        var toValue = toDate.split('-');
        toDate = toValue[2] + '-' + toValue[1] + '-' + toValue[0];
        from = moment(fromDate, 'YYYY-MM-DD');
        to = moment(toDate, 'YYYY-MM-DD');
        var duration = to.diff(from, 'days');
        var dataArray = [];

        for (var i = 0; i <= duration; i++) {
            if (i == 0) {
                var initial = moment(fromDate, 'YYYY-MM-DD');
                var json = LogbookDiscom.find({date_of_payment: moment(initial).format('DD-MM-YYYY')}).fetch();
                if (json.length > 0) {
                    dataArray.push(json[0]);
                }
            } else {
                var myDate = from.add(1, 'days');
                var jsonNxt = LogbookDiscom.find({date_of_payment: moment(myDate).format('DD-MM-YYYY')}).fetch();
                if (jsonNxt.length > 0) {
                    dataArray.push(jsonNxt[0]);
                }
            }
        }
        var amountOfInvoice = 0;
        var paymentAmount = 0;
        var shortPayment = 0;
        var totalEnergy = 0;
        var maxEnergy = 0;
        var minEnergy = 0;
        var sirChargeAmount = 0;
        _.each(dataArray, function(item) {
          amountOfInvoice += Number(item.amount_of_invoice);
          paymentAmount += Number(item.payment_amount);
          shortPayment += Number(item.short_payment);
          totalEnergy += Number(item.total_energy);
          maxEnergy += Number(item.max_energy);
          minEnergy += Number(item.min_energy);
          sirChargeAmount += Number(item.sir_charge_amount);
        });
        var totalJson = {
          amountOfInvoice:Number(amountOfInvoice).toFixed(2),
          paymentAmount:Number(paymentAmount).toFixed(2),
          shortPayment:Number(shortPayment).toFixed(2),
          totalEnergy:Number(totalEnergy).toFixed(2),
          maxEnergy:Number(maxEnergy).toFixed(2),
          minEnergy:Number(minEnergy).toFixed(2),
          sirChargeAmount:Number(sirChargeAmount).toFixed(2),
        };
        var toReturn = {
            list: dataArray,
            totalJson:totalJson
        }
        return returnSuccess("Data for payment from log_filter", toReturn);
    },
    "callLogSpdList": function(value, scheme) {
      if (scheme) {
        var json = Meteor.users.find({'profile.registration_form.dcr_nonDcr' : { $in: value},"profile.user_type": "spd",'profile.status': 'approved', 'profile.registration_form.scheme':scheme}).fetch();
      }else {
        var json = Meteor.users.find({'profile.registration_form.dcr_nonDcr' : { $in: value},"profile.user_type": "spd",'profile.status': 'approved'}).fetch();
      }
        var spdNames = [];
        json.forEach(function(item) {
            spdNames.push({id: item._id, names: item.profile.registration_form.name_of_spd});
        });
        return returnSuccess("DCR/NON-DCR SPD List Created for log_filter", spdNames);
    },
    "getingSPDStateUniq": function(filterType, value, scheme) {
      if (scheme) {
        var json = Meteor.users.find({'profile.registration_form.dcr_nonDcr' : { $in: value},"profile.user_type": "spd",'profile.status': 'approved', 'profile.registration_form.scheme':scheme}).fetch();
      }else {
        var json = Meteor.users.find({'profile.registration_form.dcr_nonDcr' : { $in: value},"profile.user_type": "spd",'profile.status': 'approved'}).fetch();
      }
        var stateArr = [];
        json.forEach(function(item) {
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
        return returnSuccess("DCR/NON-DCR SPD State List For Log Filter", returnStateArr);
    },
    callMonthFilter(month, financeYear) {
        var data = LogBookSpd.find({month : { $in: month},financial_year : { $in: financeYear}}).fetch();
        if (data.length > 0) {
          var dataArray = data;
          var totalBuildUnit = 0;
          var totalInvoiceAmount = 0;
          var paymentAmountTotal = 0;
          var shortPaymentTotal = 0;
          var exceedEnergyTotal = 0;
          var exceedAmountTotal = 0;
          var minUnitTotal = 0;
          var maxUnitTotal = 0;
          dataArray.forEach(function(dItem) {
            totalBuildUnit += Number(dItem.billedUnits);
            totalInvoiceAmount += Number(dItem.invoiceAmount);
            paymentAmountTotal += Number(dItem.paymentMode);
            shortPaymentTotal += Number(dItem.shortPaymentDone);
            exceedEnergyTotal += Number(dItem.exceedEnergy);
            exceedAmountTotal += Number(dItem.exceedAmount);
            minUnitTotal += Number(dItem.minkWh);
            maxUnitTotal += Number(dItem.maxkWh);
          });
          var json = {totalBuildUnit:Number(totalBuildUnit).toFixed(3), totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:Number(paymentAmountTotal).toFixed(2), shortPaymentTotal:Number(shortPaymentTotal).toFixed(2), exceedEnergyTotal:Number(exceedEnergyTotal).toFixed(2), exceedAmountTotal:Number(exceedAmountTotal).toFixed(2), minUnitTotal: Number(minUnitTotal).toFixed(2), maxUnitTotal:Number(maxUnitTotal).toFixed(2)};
          var jsonData = {total:json, dataArray:data};
            return returnSuccess("Month filter List Created for log_filter", jsonData);
        } else {
            return returnFaliure("No data Available for month" + monthInWords(month));
        }
    },
    callYearFilter(year) {
        var data = LogBookSpd.find({financial_year : { $in: year}}).fetch();
        if (data.length > 0) {
          var dataArray = data;
          var totalBuildUnit = 0;
          var totalInvoiceAmount = 0;
          var paymentAmountTotal = 0;
          var shortPaymentTotal = 0;
          var exceedEnergyTotal = 0;
          var exceedAmountTotal = 0;
          var minUnitTotal = 0;
          var maxUnitTotal = 0;
          dataArray.forEach(function(dItem) {
            totalBuildUnit += Number(dItem.billedUnits);
            totalInvoiceAmount += Number(dItem.invoiceAmount);
            paymentAmountTotal += Number(dItem.paymentMode);
            shortPaymentTotal += Number(dItem.shortPaymentDone);
            exceedEnergyTotal += Number(dItem.exceedEnergy);
            exceedAmountTotal += Number(dItem.exceedAmount);
            minUnitTotal += Number(dItem.minkWh);
            maxUnitTotal += Number(dItem.maxkWh);
          });
          var json = {totalBuildUnit:Number(totalBuildUnit).toFixed(3), totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:Number(paymentAmountTotal).toFixed(2), shortPaymentTotal:Number(shortPaymentTotal).toFixed(2), exceedEnergyTotal:Number(exceedEnergyTotal).toFixed(2), exceedAmountTotal:Number(exceedAmountTotal).toFixed(2), minUnitTotal: Number(minUnitTotal).toFixed(2), maxUnitTotal:Number(maxUnitTotal).toFixed(2)};
          var jsonData = {total:json, dataArray:data};
            return returnSuccess("Year filter List Created for log_filter", jsonData);
        } else {
            return returnFaliure("No data Available for Selected Filter");
        }
    },
    callDueDateFilter(date) {
        var data = LogBookSpd.find({dueDate: date}).fetch();
        if (data.length > 0) {
          var dataArray = data;
          var totalBuildUnit = 0;
          var totalInvoiceAmount = 0;
          var paymentAmountTotal = 0;
          var shortPaymentTotal = 0;
          var exceedEnergyTotal = 0;
          var exceedAmountTotal = 0;
          var minUnitTotal = 0;
          var maxUnitTotal = 0;
          dataArray.forEach(function(dItem) {
            totalBuildUnit += Number(dItem.billedUnits);
            totalInvoiceAmount += Number(dItem.invoiceAmount);
            paymentAmountTotal += Number(dItem.paymentMode);
            shortPaymentTotal += Number(dItem.shortPaymentDone);
            exceedEnergyTotal += Number(dItem.exceedEnergy);
            exceedAmountTotal += Number(dItem.exceedAmount);
            minUnitTotal += Number(dItem.minkWh);
            maxUnitTotal += Number(dItem.maxkWh);
          });
          var json = {totalBuildUnit:Number(totalBuildUnit).toFixed(3), totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:Number(paymentAmountTotal).toFixed(2), shortPaymentTotal:Number(shortPaymentTotal).toFixed(2), exceedEnergyTotal:Number(exceedEnergyTotal).toFixed(2), exceedAmountTotal:Number(exceedAmountTotal).toFixed(2), minUnitTotal: Number(minUnitTotal).toFixed(2), maxUnitTotal:Number(maxUnitTotal).toFixed(2)};
          var jsonData = {total:json, dataArray:data};
            return returnSuccess("Due Date filter List Created", jsonData);
        } else {
            return returnFaliure("No data Available for Selected Filter");
        }
    },
    callStateFilter(dcrValue, state, financeYear) {
        var logListArray = [];
          var json = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved', 'profile.registration_form.spd_state' : { $in: state}}).fetch();
        json.forEach(function(item) {
            var data = LogBookSpd.find({'clientId': item._id, 'financial_year':{ $in: financeYear}}).fetch();
            if (data.length > 0) {
                _.each(data, function(s, v) {
                    logListArray.push(s);
                })
            }
        })

        if (logListArray.length > 0) {
            var calArray = [];
            logListArray.forEach(function(item) {
                calArray.push(item.billedUnits);
            })
            // var toReturn = {
            //     list: logListArray,
            //     cumulative: Number(sumOfArray(calArray)).toFixed(2)
            // }
            var dataArray = logListArray;
            var totalBuildUnit = 0;
            var totalInvoiceAmount = 0;
            var paymentAmountTotal = 0;
            var shortPaymentTotal = 0;
            var exceedEnergyTotal = 0;
            var exceedAmountTotal = 0;
            var minUnitTotal = 0;
            var maxUnitTotal = 0;
            dataArray.forEach(function(dItem) {
              totalBuildUnit += Number(dItem.billedUnits);
              totalInvoiceAmount += Number(dItem.invoiceAmount);
              paymentAmountTotal += Number(dItem.paymentMode);
              shortPaymentTotal += Number(dItem.shortPaymentDone);
              exceedEnergyTotal += Number(dItem.exceedEnergy);
              exceedAmountTotal += Number(dItem.exceedAmount);
              minUnitTotal += Number(dItem.minkWh);
              maxUnitTotal += Number(dItem.maxkWh);
            });
            var json = {totalBuildUnit:Number(totalBuildUnit).toFixed(3), totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:Number(paymentAmountTotal).toFixed(2), shortPaymentTotal:Number(shortPaymentTotal).toFixed(2), exceedEnergyTotal:Number(exceedEnergyTotal).toFixed(2), exceedAmountTotal:Number(exceedAmountTotal).toFixed(2), minUnitTotal: Number(minUnitTotal).toFixed(2), maxUnitTotal:Number(maxUnitTotal).toFixed(2)};
            var jsonData = {total:json, dataArray:logListArray, cumulative: Number(sumOfArray(calArray)).toFixed(2)};
            return returnSuccess("State filter List Created for log_filter", jsonData);
        } else {
            return returnFaliure("No data Available for Selected Filter");
        }
    },
    callSpdFilter(spdid, financeYear) {
          var data = LogBookSpd.find({clientId : { $in: spdid},financial_year : { $in: financeYear}}).fetch();
        // }
        if (data.length > 0) {
            if (_.isArray(spdid)) {} else {
                var valuesReturn = {
                    maxkWhValue: Meteor.users.findOne({_id: spdid}).profile.registration_form.spd_max_energy_as_per_ppa,
                    minkWhValue: Meteor.users.findOne({_id: spdid}).profile.registration_form.spd_min_energy_as_per_ppa
                }
            }
            var calArray = [];
            data.forEach(function(item) {
                calArray.push(item.billedUnits);
            })
            // var toReturn = {
            //     list: data,
            //     count: Number(sumOfArray(calArray)).toFixed(2),
            //     valuesReturn: valuesReturn
            // }

            var dataArray = data;
            var totalBuildUnit = 0;
            var totalInvoiceAmount = 0;
            var paymentAmountTotal = 0;
            var shortPaymentTotal = 0;
            var exceedEnergyTotal = 0;
            var exceedAmountTotal = 0;
            var minUnitTotal = 0;
            var maxUnitTotal = 0;
            dataArray.forEach(function(dItem) {
              totalBuildUnit += Number(dItem.billedUnits);
              totalInvoiceAmount += Number(dItem.invoiceAmount);
              paymentAmountTotal += Number(dItem.paymentMode);
              shortPaymentTotal += Number(dItem.shortPaymentDone);
              exceedEnergyTotal += Number(dItem.exceedEnergy);
              exceedAmountTotal += Number(dItem.exceedAmount);
              minUnitTotal += Number(dItem.minkWh);
              maxUnitTotal += Number(dItem.maxkWh);
            });
            var json = {totalBuildUnit:Number(totalBuildUnit).toFixed(3), totalInvoiceAmount:Number(totalInvoiceAmount).toFixed(2), paymentAmountTotal:Number(paymentAmountTotal).toFixed(2), shortPaymentTotal:Number(shortPaymentTotal).toFixed(2), exceedEnergyTotal:Number(exceedEnergyTotal).toFixed(2), exceedAmountTotal:Number(exceedAmountTotal).toFixed(2), minUnitTotal: Number(minUnitTotal).toFixed(2), maxUnitTotal:Number(maxUnitTotal).toFixed(2)};
            var jsonData = {total:json, dataArray:data, count: Number(sumOfArray(calArray)).toFixed(2), valuesReturn: valuesReturn};
            return returnSuccess("Spd filter List Created for log_filter", jsonData);
        } else {
            return returnFaliure("No data Available for Selected Filter");
        }
    }
})

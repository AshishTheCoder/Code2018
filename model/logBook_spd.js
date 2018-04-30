Meteor.methods({
    "callEntityDetails": function(scheme) {
        var json = Meteor.users.find({
            'profile.user_type': 'spd',
            'profile.status': 'approved',
            'profile.registration_form.scheme' : scheme,
        }, {
            sort: {
                'profile.registration_form.name_of_spd': 1
            }
        }).fetch();
        var spdNames = [];
        json.forEach(function(item) {
            spdNames.push({id: item._id, names: item.profile.registration_form.name_of_spd, state: item.profile.registration_form.spd_state});
        });
        return returnSuccess('Got SPD names for logbook_spd module', spdNames);
    },
    "saveSpdLogbook": function(logbook) {
      logbook.timeStamp = new Date();
      var checkData = LogBookSpd.find({clientId:logbook.clientId,clientState:logbook.clientState,month:logbook.month,year:logbook.year, financial_year: logbook.financial_year}).fetch();
      if (checkData.length > 0) {
        if (checkData[0].dateOfPayment == '' && Number(checkData[0].paymentMode) == 0) {
          var test = LogBookSpd.update({_id:checkData[0]._id}, {$set: {paymentMode:logbook.paymentMode, dateOfPayment:logbook.dateOfPayment, shortPaymentDone:logbook.shortPaymentDone, remark:logbook.remark}})
        }else {
          LogBookSpd.insert(logbook);
        }
      }else {
        LogBookSpd.insert(logbook);
      }
        // data insert in log Details collection
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            log_type: 'Log Book',
            template_name: 'logBook_spd',
            event_name: 'logBook_spd_form',
            timestamp: new Date(),
            action_date: moment().format('DD-MM-YYYY'),
            json: logbook
        });
        return returnSuccess('logbook_spd data Inserted');
    },
    // selectedEntityDetails(id) {
    //     var data = Meteor.users.find({_id: id}).fetch();
    //     if (data[0].profile.registration_form) {
    //         var toReturn = {}
    //         toReturn.rate = data[0].profile.registration_form.rate_per_unit;
    //         toReturn.minkWhValue = data[0].profile.registration_form.spd_min_energy_as_per_ppa;
    //         toReturn.maxkWhValue = data[0].profile.registration_form.spd_max_energy_as_per_ppa;
    //         return returnSuccess('Got selected spd data from logbook_spd', toReturn);
    //     }
    // },
    callSpdJmrUnits(id, month, financial_year,invoiceType) {
        var spdData = Meteor.users.find({_id: id}).fetch();
          var checkData = LogBookSpd.find({clientId:id,month:month,financial_year:financial_year, invoice_type: invoiceType}, {sort: {$natural: -1 }, limit: 1 }).fetch();
        if (checkData.length > 0) {
          var toReturn = {
            billedUnits : checkData[0].billedUnits,
            invoiceNumber : checkData[0].invoiceNumber,
            dateOfReceipt : checkData[0].dateOfReceipt,
            dueDate : checkData[0].dueDate,
            invoiceAmount : Number(Number(checkData[0].invoiceAmount) - Number(checkData[0].paymentMode)).toFixed(2),
            exceedEnergy : checkData[0].exceedEnergy,
            exceedAmount : checkData[0].exceedAmount,
            rate : checkData[0].rate,
            filehref : checkData[0].filehref,
            dataFrom : 'LogBookSpd',
            rate : spdData[0].profile.registration_form.rate_per_unit,
            minkWhValue : spdData[0].profile.registration_form.spd_min_energy_as_per_ppa,
            maxkWhValue : spdData[0].profile.registration_form.spd_max_energy_as_per_ppa,
          };
        }
        else {
          var data = Jmr.find({userId:id,month:month,financial_year:financial_year}).fetch();
          if (data.length > 0) {
              var toReturn = {};
              toReturn.billedUnits = data[0].billedUnits;
              toReturn.invoiceNumber = data[0].invoiceNumber;
              toReturn.invoiceAmount = Number(data[0].amount);
              toReturn.exceedEnergy = data[0].exceedEnergy;
              toReturn.exceedAmount = data[0].exceedAmount;
              toReturn.rate = data[0].rate;
              toReturn.filehref = data[0].filehref;
              toReturn.dataFrom = 'JMR';
              toReturn.rate = spdData[0].profile.registration_form.rate_per_unit;
              toReturn.minkWhValue = spdData[0].profile.registration_form.spd_min_energy_as_per_ppa;
              toReturn.maxkWhValue = spdData[0].profile.registration_form.spd_max_energy_as_per_ppa;
          } else {
              var toReturn = {};
              toReturn.billedUnits = "0";
              toReturn.invoiceNumber = "0";
              toReturn.invoiceAmount = "0";
              toReturn.exceedEnergy = "0";
              toReturn.exceedAmount = "0";
              toReturn.rate = '0';
              toReturn.dataFrom = 'Data Not Found';
              toReturn.rate = spdData[0].profile.registration_form.rate_per_unit;
              toReturn.minkWhValue = spdData[0].profile.registration_form.spd_min_energy_as_per_ppa;
              toReturn.maxkWhValue = spdData[0].profile.registration_form.spd_max_energy_as_per_ppa;
          }
        }
        return returnSuccess("Got Billed units from JMR module", toReturn);
    }
})

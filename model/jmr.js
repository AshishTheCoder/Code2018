Meteor.methods({
    "callTypeDetails": function(type, month, financial_year) {
        var preMonth = Number(month) - 1;
        var pre = preMonth.toString();
        var detailsJson = {};
        var dataPrevious = Jmr.find({
            userId: Meteor.userId(),
            month: pre,
            financial_year: financial_year
        }).fetch();
        if (dataPrevious.length > 0) {
            detailsJson.importPrevious = dataPrevious[0].import;
            detailsJson.exportPrevious = dataPrevious[0].export;
        } else {
            detailsJson.importPrevious = "0";
            detailsJson.exportPrevious = "0";
        }

        var dataJson = Jmr.find({
            userId: Meteor.userId(),
            financial_year: financial_year
        }).fetch();
        var array = [];
        dataJson.forEach(function(item) {
            array.push(item.billedUnits);
        })
        var count = 0;
        for (var i = array.length; i--;) {
            count += Number(array[i]);
        }
        detailsJson.tillDateBilledUnits = count;
        detailsJson.meterNumber = Meteor.user().profile.registration_form.main_meter_number;
        detailsJson.rate = Meteor.user().profile.registration_form.rate_per_unit;
        return returnSuccess("Initial Data retrived", detailsJson);
    },
    "saveJmrJson": function(json) {
      var checkSECIHoliday = checkSECIholidaysORWeakEnd();
        if (checkSECIHoliday != 'holiday' && checkSECIHoliday != 'weakend') {
          var month = json.month;
          var financial_year = json.financial_year;
          var data = Jmr.find({
              userId: Meteor.userId(),
              "month": month,
              "financial_year": financial_year
          }).fetch();
          if (data.length > 0) {
              return returnFaliure(data[0].type+" already submitted for "+getMonthName(month));
          } else {
              if (json.exceedEnergy > 0) {
                  var admin = Meteor.users.find({
                      'profile.user_type': 'admin'
                  }).fetch();
                  var jsonToInsert = {
                      userId: Meteor.userId(),
                      spdName: Meteor.user().profile.registration_form.name_of_spd,
                      month: month,
                      financialYear: financial_year,
                      energy: json.exceedEnergy,
                      amount: json.exceedAmount
                  };
                  Meteor.users.update({
                      _id: admin[0]._id
                  }, {
                      $push: {
                          'profile.exceedJmrData': jsonToInsert
                      }
                  });
              }
              Jmr.insert(json);
              var currentDate = new Date();
              var todayDate = moment(currentDate).format('DD-MM-YYYY');
              var ip= this.connection.httpHeaders['x-forwarded-for'];
              var ipArr = ip.split(',');
              // data insert in log Details collection
              LogDetails.insert({
                  ip_address:ipArr,
                  user_id: Meteor.userId(),
                  user_name: Meteor.user().username,
                  log_type: 'JMR Monthly',
                  template_name: 'jmr',
                  event_name: 'submitJmr',
                  timestamp: new Date(),
                  action_date:todayDate,
                  json_in_JMR: json,
              });
              return returnSuccess('JMR Submitted');
          }
        }else {
          return returnFaliure("Today is "+checkSECIHoliday+", that's why request can not be submit today!");
        }
    },
    "saveSeaJson": function(json) {
        var month = json.month;
        var financial_year = json.financial_year;
        var data = Jmr.find({
            userId: Meteor.userId(),
            "month": month,
            "financial_year": financial_year
        }).fetch();
        if (data.length > 0) {
            return returnFaliure(data[0].type+" already submitted for "+getMonthName(month));
        } else {
            if (json.exceedEnergy > 0) {
                var admin = Meteor.users.find({
                    'profile.user_type': 'admin'
                }).fetch();
                var jsonToInsert = {
                    userId: Meteor.userId(),
                    spdName: Meteor.user().profile.registration_form.name_of_spd,
                    month: month,
                    financialYear: financial_year,
                    energy: json.exceedEnergy,
                    amount: json.exceedAmount
                };

                Meteor.users.update({
                    _id: admin[0]._id
                }, {
                    $push: {
                        'profile.exceedJmrData': jsonToInsert
                    }
                });
            }
            Jmr.insert(json);
            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            // data insert in log Details collection
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: 'SEA Monthly',
                template_name: 'jmr',
                event_name: 'submitSea',
                timestamp: new Date(),
                action_date:todayDate,
                json: json
            });
            return returnSuccess('SEA Submitted');
        }
    },
    "saveReaJson": function(json) {
        var month = json.month;
        var financial_year = json.financial_year;
        var data = Jmr.find({
            userId: Meteor.userId(),
            "month": month,
            "financial_year": financial_year
        }).fetch();
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        if (data.length > 0) {
            return returnFaliure(data[0].type+" already submitted for "+getMonthName(month));
        } else {
            if (json.exceedEnergy > 0) {
                var admin = Meteor.users.find({
                    'profile.user_type': 'admin'
                }).fetch();
                var jsonToInsert = {
                    userId: Meteor.userId(),
                    spdName: Meteor.user().profile.registration_form.name_of_spd,
                    month: month,
                    financialYear: financial_year,
                    energy: json.exceedEnergy,
                    amount: json.exceedAmount
                };

                Meteor.users.update({
                    _id: admin[0]._id
                }, {
                    $push: {
                        'profile.exceedJmrData': jsonToInsert
                    }
                });
            }
            Jmr.insert(json);
            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            // data insert in log Details collection
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: 'REA Monthly',
                template_name: 'jmr',
                event_name: 'submitRea',
                timestamp: new Date(),
                action_date:todayDate,
                json: json
            });
            return returnSuccess('REA Submitted');
        }
    }
});

function getMonthName(month) {
    var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return dateArr[Number(month) - 1];
};

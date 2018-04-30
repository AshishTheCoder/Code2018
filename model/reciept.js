Meteor.methods({
    "callRecieptSpds": function(state) {
        var json = Meteor.users.find().fetch();
        var spdNames = [];
        json.forEach(function(item) {
            if (item.profile.registration_form) {
                if (item.profile.user_type == 'spd' && item.profile.registration_form.spd_state == state) {
                    spdNames.push({
                        id: item._id,
                        names: item.profile.registration_form.name_of_spd
                    });
                }
            }
        });
        return returnSuccess('SPD names', spdNames);
    },
    "callRecieptSpdsData": function(spdId, month, year) {
        var data = Meteor.users.find({
            "_id": spdId
        }).fetch();
        var json = {
            name: data[0].profile.registration_form.name_of_spd,
            capacity:data[0].profile.registration_form.project_capicity,
            state:data[0].profile.registration_form.spd_state
        }
        var jmrData=Jmr.find({"userId":spdId,"month":month,"year":year}).fetch();
        if (jmrData.length>0) {
          json.invoiceNumber=jmrData[0].invoiceNumber;
          json.amount=Number(jmrData[0].billedUnits)*Number(jmrData[0].rate);
          var date=new Date();
          json.today=moment(date).format('DD/MM/YYYY');
          var today=moment();
          var adviceDate=today.add(7, 'days');
          json.paymentDate=moment(adviceDate).format('DD/MM/YYYY');
          json.billedUnit=jmrData[0].billedUnits;
          return returnSuccess('SPD data', json);
        }else {
          return returnFaliure("cannot get jmrData");
        }
    },
    "saveReciept":function (json) {
      // PaymentAdvice.insert(json);
      return returnSuccess("reciept saved successfully");
    }
});

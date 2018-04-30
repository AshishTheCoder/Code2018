Meteor.methods({
    'getDiscomScheme': function() {
        var discomNameVar = [];
        var data = Schemes.find().fetch();
        data.forEach(function(item) {
            discomNameVar.push({
                discomSchemeId: item._id,
                discomScheme: item.scheme
            });
        });
        var ar = discomNameVar.sort(function(a, b) {
            var nA = a.discomScheme.toLowerCase();
            var nB = b.discomScheme.toLowerCase();
            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });
        return returnSuccess('Discom List Array', ar);
    },
    'SaveTranscoSheet': function(json) {
        var transaction_type = json.stu_transaction_type;
        if (transaction_type == 'SOC' || transaction_type == 'MOC' ) {
          TranscoSheetSocMoc.update({
               month:json.month,
                  financial_year:json.financial_year,
                  stu_ctu:json.stu_ctu,
                  stu_transaction_type:json.stu_transaction_type,
                  soc_moc_state:json.soc_moc_state,
            }, {
                $set: json
            },{
              upsert: true,
            });
           return returnSuccess('Data successfully saved');
        }else if(transaction_type == 'Transmission'){
          TranscoSheetTransmission.update({
            month:json.month,
               financial_year:json.financial_year,
               stu_ctu:json.stu_ctu,
               stu_transaction_type:json.stu_transaction_type
         }, {
             $set: json
         },{
           upsert: true,
         });
        return returnSuccess('Data successfully saved');
        }else if(transaction_type == 'Incentive'){
          TranscoSheetIncentive.update({
            month:json.month,
               financial_year:json.financial_year,
               stu_ctu:json.stu_ctu,
               stu_transaction_type:json.stu_transaction_type
         }, {
             $set: json
         },{
           upsert: true,
         });
        return returnSuccess('Data successfully saved');
        }else if(transaction_type == 'SLDC'){
          TranscoSheetSldc.update({
            month:json.month,
               financial_year:json.financial_year,
               stu_ctu:json.stu_ctu,
               stu_transaction_type:json.stu_transaction_type
         }, {
             $set: json
         },{
           upsert: true,
         });
        return returnSuccess('Data successfully saved');
        }
        // if (transaction_type == 'Transmission') {
        //     console.log(json.month);
        //     console.log(json.financial_year);
        //     console.log(json.discom_state);
        //     var data = LogbookTransmission.find({
        //         "month": json.month,
        //         "financial_year": json.financial_year,
        //         "discomId": json.discomId
        //     }).fetch();
        //     if (data.length > 0) {
        //         json.invoice_amount = data[0].total_transmission_invoice;
        //     } else {
        //         return returnFaliure("Transmission data can't submitted for this month!");
        //     }
        // } else if (transaction_type == 'Incentive') {
        //     console.log(json.month);
        //     console.log(json.financial_year);
        //     console.log(json.discom_state);
        //     var data = LogbookIncentive.find({
        //         "month": json.month,
        //         "financial_year": json.financial_year,
        //         "discom_state": json.discom_state
        //     }).fetch();
        //     console.log(data.length);
        //     console.log(data);
        //     if (data.length > 0) {
        //         json.invoice_amount = data[0].incentive_charges;
        //     } else {
        //         return returnFaliure("Incentive data can't submitted for this month!");
        //     }
        // } else if (transaction_type == 'SLDC') {
        //     console.log(json.month);
        //     console.log(json.financial_year);
        //     console.log(json.discom_state);
        //     var data = LogbookSLDC.find({
        //         "month": json.month,
        //         "financial_year": json.financial_year,
        //         "discom_state": json.discom_state
        //     }).fetch();
        //     console.log(data.length);
        //     console.log(data);
        //     if (data.length > 0) {
        //         json.invoice_amount = data[0].total_amount;
        //     } else {
        //         return returnFaliure("SLDc data can't submitted for this month!");
        //     }
        // }
        //
        // var data1 = TranscoSheetEntry.find({
        //     "month": json.month,
        //     "financial_year": json.financial_year,
        //     "discomId": json.discomId,
        //     "stu_transaction_type": json.stu_transaction_type
        // }).fetch();
        // var dataLength = data1.length;
        // if (dataLength > 0) {
        //     return returnSuccess('Data repeated', dataLength);
        // }
        // var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // if (transaction_type == 'Incentive') {
        //     var fromDateMonth = getArray(dateArr, Number(data[0].month));
        //     // var period = fromDateMonth + "'" + data[0].financial_year;
        //     var period = fromDateMonth;
        // } else {
        //     var fromDateMonth = getArray(dateArr, Number(data[0].month));
        //     var period = fromDateMonth + "'" + data[0].year;
        // }
        // var discomData = Discom.find({
        //     _id: json.discomId
        // }).fetch();
        //
        // json.discom_shortName = discomData[0].discom_short_name;
        // json.discom_name = discomData[0].nameof_buyingutility;
        // json.period = period;
        // json.generation_date = data[0].generation_date;
        // json.due_date = data[0].due_date;
        // json.payment_amount = data[0].payment_amount;
        // json.invoice_number = data[0].invoice_number;
        // json.date_of_payment = data[0].date_of_payment;
        // json.payment_amount = data[0].payment_amount;
        // json.short_payment_amount = data[0].short_payment_amount;
        // json.remarks = "";
        // var idd = TranscoSheetEntry.insert(json);
        // return returnSuccess('Data Inserted', json);
    },

    'UpdateTranscoSheet': function(json) {
        var data = TranscoSheetEntry.find({
            "month": json.month,
            "financial_year": json.financial_year,
            "discomId": json.discomId,
            "stu_transaction_type": json.stu_transaction_type
        }).fetch();
        var id = data[0]._id;
        TranscoSheetEntry.update({
            _id: id
        }, {
            $set: json
        })
        return returnSuccess('Data updated');
    },

    'getDiscom': function(discomScheme) {
        var discomNameVar = [];
        var data = Discom.find({
            "scheme": discomScheme
        }).fetch();
        data.forEach(function(item) {
            discomNameVar.push({
                discomId: item._id,
                state: item.discom_state
            });
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
        return returnSuccess('Discom List Array', ar);
    },
});

function getArray(ary, month) {
    return ary[month - 1];
};

Meteor.methods({
  "callDiscomStates":function (value) {
    var data=Discom.find().fetch();
    var discomList=[];
    data.forEach(function(item){
      discomList.push({
        id:item._id,
        discom_state:item.discom_state
      });
    })
    return returnSuccess('discom state',discomList);
  },

  "saveRateValues":function (state,invoiceType,oldValue,newValue,financialYearVar) {
    var currentDate = new Date();
    var todayDate = moment(currentDate).format('DD-MM-YYYY');
    if(oldValue=="No rate available"){
      var json = {
        invoice_type:invoiceType,
        state:state,
        rate:newValue,
        state:state,
        financial_year:financialYearVar,
        timestamp:new Date()
      };
      InvoiceCharges.insert(json);
      return returnSuccess("Invoice charge updated!");
    }else{
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      var invoiceData = InvoiceCharges.find({state:state,invoice_type:invoiceType,financial_year:financialYearVar}).fetch();
      if(invoiceData.length > 0){
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            log_type: 'Invoice Charges Updated for '+state,
            template_name: 'invoiceChargesDetails',
            event_name: 'RateChargesForm',
            timestamp: new Date(),
            action_date:moment(currentDate).format('DD-MM-YYYY'),
            state:state,
            before_update:invoiceData[0],
            new_rate:newValue
        });
        InvoiceCharges.update({state:state,invoice_type:invoiceType,financial_year:financialYearVar}, {$set:{rate:newValue, timestamp:new Date()}});
      }else{
        var json = {
          invoice_type:invoiceType,
          state:state,
          rate:newValue,state:state,
          financial_year:financialYearVar,
          timestamp:new Date()
        };
        InvoiceCharges.insert(json);
        LogDetails.insert({
            ip_address:ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            log_type: 'Invoice Charges Submitted for '+state,
            template_name: 'invoiceChargesDetails',
            event_name: 'RateChargesForm',
            timestamp: new Date(),
            action_date:moment(currentDate).format('DD-MM-YYYY'),
            state:state,
            json:json
        });
      }
      return returnSuccess("Invoice charge updated!");
    }
  },
  "callRateValues":function (state,invoiceType,financialYearVar) {
    var data= InvoiceCharges.find({state:state,invoice_type:invoiceType,financial_year:financialYearVar}).fetch();
    if(data.length > 0){
      return returnSuccess("Rate Retrived",data[0].rate);
    }else{
      return returnSuccess("Rate Retrived","No rate available");
    }
  }
})

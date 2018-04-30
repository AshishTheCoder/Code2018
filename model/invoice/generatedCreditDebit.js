Meteor.methods({
  getEnergyCreditDebitData(month, year){
    var energyCreditDebitData = CreditDebitEnergy.find({month:month,year:year,delete_status:false}).fetch();
    if(energyCreditDebitData.length > 0){
      return returnSuccess('Invoice found',energyCreditDebitData);
    }else{
      return returnFaliure('Credit/Debit not generated!');
    }
  },
  getTransmissionCreditDebitData(month, year){
    var transmissionCreditDebitData = CreditDebitTransmission.find({month:month,year:year,delete_status:false}).fetch();
    if(transmissionCreditDebitData.length > 0){
      return returnSuccess('Invoice found',transmissionCreditDebitData);
    }else{
      return returnFaliure('Credit/Debit not generated!');
    }
  },
  getSldcCreditDebitData(financialYear){
    var sldCreditDebitData = CreditDebitSLDC.find({financial_year:financialYear,delete_status:false}).fetch();
    if(sldCreditDebitData.length > 0){
      return returnSuccess('Invoice found',sldCreditDebitData);
    }else{
      return returnFaliure('Credit/Debit not generated!');
    }
  },
  deleteCreditDebitAndPdfFile(invoiceId,filePath,typeVar,month,year, financialYear){
    if (typeVar == 'Energy') {
      var backupData = CreditDebitEnergy.find({_id:invoiceId}).fetch();
    }else if (typeVar == 'Transmission') {
      var backupData = CreditDebitTransmission.find({_id:invoiceId}).fetch();
    }else if (typeVar == 'SLDC') {
      var backupData = CreditDebitSLDC.find({_id:invoiceId}).fetch();
    }
    // creating log of deleted invoice
    var currentDate = new Date();
    var todayDate = moment(currentDate).format('DD-MM-YYYY');
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');
    LogDetails.insert({
        ip_address: ipArr,
        user_id: Meteor.userId(),
        user_name: Meteor.user().username,
        user_type: Meteor.user().profile.user_type,
        log_type: typeVar+' Invoice Deleted',
        template_name: 'energyInvoiceReport',
        event_name: 'deleteGeneratedCreditDebit',
        timestamp: new Date(),
        action_date: todayDate,
        json: backupData[0],
    });

    if (typeVar == 'Energy') {
      CreditDebitEnergy.update({
        _id:invoiceId
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = CreditDebitEnergy.find({month:month,year:year,delete_status:false}).fetch();
    }else if (typeVar == 'Transmission') {
      CreditDebitTransmission.update({
        _id:invoiceId
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = CreditDebitTransmission.find({month:month,year:year,delete_status:false}).fetch();
    }else if (typeVar == 'SLDC') {
      CreditDebitSLDC.update({
        _id:invoiceId
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = CreditDebitSLDC.find({month:month,year:year,delete_status:false}).fetch();
    }
    return returnSuccess('Invoice and pdf file deleted!',returnData);
  }
});

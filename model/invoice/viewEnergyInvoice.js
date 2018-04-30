Meteor.methods({
  getEnergyInvoiceData(month, year){
    var energyInvoiceData = EnergyInvoiceDetails.find({month:month,year:year,delete_status:false}).fetch();
    if(energyInvoiceData.length > 0){
      return returnSuccess('Invoice found',energyInvoiceData);
    }else{
      return returnFaliure('Invoice not generated!');
    }
  },
  getTransmissionInvoiceData(month, year){
    var transmissionInvoiceData = TransmissionInvoiceDetails.find({month:month,year:year,delete_status:false}).fetch();
    if(transmissionInvoiceData.length > 0){
      return returnSuccess('Invoice found',transmissionInvoiceData);
    }else{
      return returnFaliure('Invoice not generated!');
    }
  },
  getSldcInvoiceData(financialYear){
    var sldcInvoiceData = SLDCInvoiceDetails.find({financial_year:financialYear,delete_status:false}).fetch();
    if(sldcInvoiceData.length > 0){
      return returnSuccess('Invoice found',sldcInvoiceData);
    }else{
      return returnFaliure('Invoice not generated!');
    }
  },
  getIncentiveInvoiceReport(financialYear){
    var returnData = IncentiveChargesDetail.find({financial_year:financialYear,delete_status:false}).fetch();
    if(returnData.length > 0){
      return returnSuccess(' Incentive Invoice found',returnData);
    }else{
      return returnFaliure(' Incentive Invoice not generated!');
    }
  },
  deleteInvocieAndPdfFile(invoiceId,filePath,typeVar,month,year, financialYear){
    if (typeVar == 'Energy') {
      var backupData = EnergyInvoiceDetails.find({_id:invoiceId}).fetch();
    }else if (typeVar == 'Transmission') {
      var backupData = TransmissionInvoiceDetails.find({_id:invoiceId}).fetch();
    }else if (typeVar == 'SLDC') {
      var backupData = SLDCInvoiceDetails.find({_id:invoiceId}).fetch();
    }else if (typeVar == 'Incentive') {
      var backupData = IncentiveChargesDetail.find({_id:invoiceId}).fetch();
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
        event_name: 'deleteGeneratedInvoice',
        timestamp: new Date(),
        action_date: todayDate,
        json: backupData[0],
    });

    if (typeVar == 'Energy') {
      EnergyInvoiceDetails.update({
        _id:invoiceId
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = EnergyInvoiceDetails.find({month:month,year:year,delete_status:false}).fetch();
    }else if (typeVar == 'Transmission') {
      TransmissionInvoiceDetails.update({
        _id:invoiceId
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = TransmissionInvoiceDetails.find({month:month,year:year,delete_status:false}).fetch();
    }else if (typeVar == 'SLDC') {
      SLDCInvoiceDetails.update({
        _id:invoiceId
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = SLDCInvoiceDetails.find({financial_year:financialYear,delete_status:false}).fetch();
    }else if (typeVar == 'Incentive') {
      IncentiveChargesDetail.update({
        _id:invoiceId
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = IncentiveChargesDetail.find({financial_year:financialYear,delete_status:false}).fetch();
    }
    return returnSuccess('Invoice and pdf file deleted!',returnData);
  }
});

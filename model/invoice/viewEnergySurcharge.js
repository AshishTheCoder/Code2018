Meteor.methods({
  getEnergySurchargeData(month, financialYear){
    var energySurchargeData = SurchargeEnergy.find({month:month,financial_year:financialYear,delete_status:false}).fetch();
    if(energySurchargeData.length > 0){
      return returnSuccess('Surcharge found',energySurchargeData);
    }else{
      return returnFaliure('Surcharge not generated!');
    }
  },
  getTransmissionSurchargeData(month, financialYear){
    // console.log(month);
    var transmissionSurchargeData = SurchargeTransmission.find({month:month,financial_year:financialYear,delete_status:false}).fetch();
    console.log(transmissionSurchargeData);
    if(transmissionSurchargeData.length > 0){
      return returnSuccess('Surcharge found',transmissionSurchargeData);
    }else{
      return returnFaliure('Surcharge not generated!');
    }
  },
  getSldcSurchargeData(financialYear){
    var sldcSurchargeData = SurchargeSLDC.find({financial_year:financialYear,delete_status:false}).fetch();
    if(sldcSurchargeData.length > 0){
      return returnSuccess('Surcharge found',sldcSurchargeData);
    }else{
      return returnFaliure('Surcharge not generated!');
    }
  },
  getIncentiveSurchargeData(financialYear){
    var incentiveSurchargeData = SurchargeIncentive.find({financial_year:financialYear,delete_status:false}).fetch();
    if(incentiveSurchargeData.length > 0){
      return returnSuccess('Incentive Surcharge found',incentiveSurchargeData);
    }else{
      return returnFaliure('Incentive Surcharge not generated!');
    }
  },
  deleteSurchargeAndPdfFile(id,filePath,typeVar,month,year){
    if (typeVar == 'Energy') {
      var backupData = SurchargeEnergy.find({_id:id}).fetch();
    }else if (typeVar == 'Transmission') {
      var backupData = SurchargeTransmission.find({_id:id}).fetch();
    }else if (typeVar == 'SLDC') {
      var backupData = SurchargeSLDC.find({_id:id}).fetch();
    }else if (typeVar == 'Incentive') {
      var backupData = SurchargeIncentive.find({_id:id}).fetch();
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
        log_type: typeVar+'Surcharge Deleted',
        template_name: 'viewEnergySurcharge',
        event_name: 'deleteGeneratedSurcharge',
        timestamp: new Date(),
        action_date: todayDate,
        json: backupData[0],
    });

    if (typeVar == 'Energy') {
      SurchargeEnergy.update({
        _id:id
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = SurchargeEnergy.find({month:month,financial_year:year,delete_status:false}).fetch();
    }else if (typeVar == 'Transmission') {
      SurchargeTransmission.update({
        _id:id
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = SurchargeTransmission.find({month:month,financial_year:year,delete_status:false}).fetch();
    }else if (typeVar == 'SLDC') {
      SurchargeSLDC.update({
        _id:id
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = SurchargeSLDC.find({month:month,financial_year:year,delete_status:false}).fetch();
    }else if (typeVar == 'Incentive') {
      SurchargeIncentive.update({
        _id:id
      },{
        $set : {
          delete_status:true,
          deleted_by_userid:Meteor.userId(),
          deleted_by_username:Meteor.user().username,
          deleted_timestamp:new Date()
        }
      });
      var returnData = SurchargeIncentive.find({financial_year:year,delete_status:false}).fetch();
    }
    return returnSuccess('Surcharge and pdf file deleted!',returnData);
  }
})

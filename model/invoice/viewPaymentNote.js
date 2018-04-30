Meteor.methods({
    viewGeneratedPaymentNote(month, year) {
        var energyPaymentNoteData = EnergyPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
        if (energyPaymentNoteData.length > 0) {
            return returnSuccess('Energy Payment Note found', energyPaymentNoteData);
        } else {
            return returnFaliure('Energy Payment note not generated!');
        }
    },
    viewGeneratedTransmissionPaymentNote(month, year) {
        var data = TransmissionPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
        if (data.length > 0) {
            return returnSuccess('Transmission Payment Note found', data);
        } else {
            return returnFaliure('Transmission Payment note not generated!');
        }
    },
    viewGeneratedRLDCPaymentNote(month, year) {
        var data = RLDCPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
        if (data.length > 0) {
            return returnSuccess('RLDC Payment Note found', data);
        } else {
            return returnFaliure('RLDC Payment note not generated!');
        }
    },
    viewGeneratedSLDCPaymentNote(month, year) {
        var data = SLDCPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
        if (data.length > 0) {
            return returnSuccess('SLDC Payment Note found', data);
        } else {
            return returnFaliure('SLDC Payment note not generated!');
        }
    },
    viewGeneratedIncentivePaymentNote(year) {
        var data = IncentivePaymentNoteDetails.find({
            year: year,
            delete_status: false
        }).fetch();
        if (data.length > 0) {
            return returnSuccess('Incentive Payment Note found', data);
        } else {
            return returnFaliure('Incentive Payment note not generated!');
        }
    },
    paymentNoteInitializedForSixLevel(ids, month, year,filePath,typeOfPaymentNote) {
      if (typeOfPaymentNote == 'Energy') {
        let dataVar = EnergyPaymentNoteDetails.find({_id:ids}).fetch();
        var jsonForSixLevel = {
          documentId:dataVar[0]._id,
          month:dataVar[0].month,
          year:dataVar[0].year,
          spd_id:dataVar[0].clientId,
          spd_name:dataVar[0].nameOfEntity,
          financial_year:dataVar[0].financialYear,
          state:dataVar[0].state,
          file_type:dataVar[0].type,
          file_path:dataVar[0].file_path,
          timestamp: new Date(),
          sixLevelStatus:'Pending',
          delete_status: false,
          typeOfPaymentNote :'Energy',
          levelOne : {username:'',level:1,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelTwo : {username:'',level:2,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelThree : {username:'',level:3,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFour : {username:'',level:4,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFive : {username:'',level:5,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelSix : {username:'',level:6,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()}
        };
        SixLevelApproval.insert(jsonForSixLevel);
          EnergyPaymentNoteDetails.update({
              _id: ids
          }, {
              $set: {
                  initialisedForApproval: true,
                  sixLevelStatus:'Pending'
              }
          });
          // finding data
          var data = EnergyPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
          return returnSuccess('Payment Note Initialised',data);
      }
      else if (typeOfPaymentNote == 'Transmission') {
        let dataVar = TransmissionPaymentNoteDetails.find({_id:ids}).fetch();
        var jsonForSixLevel = {
          documentId:dataVar[0]._id,
          month:dataVar[0].month,
          year:dataVar[0].year,
          financial_year:dataVar[0].financialYear,
          state:dataVar[0].state,
          file_type:dataVar[0].type,
          file_path:dataVar[0].file_path,
          timestamp: new Date(),
          sixLevelStatus:'Pending',
          delete_status: false,
          typeOfPaymentNote : 'Transmission',
          levelOne : {username:'',level:1,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelTwo : {username:'',level:2,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelThree : {username:'',level:3,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFour : {username:'',level:4,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFive : {username:'',level:5,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelSix : {username:'',level:6,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()}
        };
        SixLevelApproval.insert(jsonForSixLevel);
          TransmissionPaymentNoteDetails.update({
              _id: ids
          }, {
              $set: {
                  initialisedForApproval: true,
                  sixLevelStatus:'Pending'
              }
          });
          // finding data
          var data = TransmissionPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
          return returnSuccess('Payment Note Initialised',data);
      }
      else if (typeOfPaymentNote == 'SLDC') {
        let dataVar = SLDCPaymentNoteDetails.find({_id:ids}).fetch();
        var jsonForSixLevel = {
          documentId:dataVar[0]._id,
          month:dataVar[0].month,
          year:dataVar[0].year,
          financial_year:dataVar[0].financialYear,
          state:dataVar[0].state,
          file_type:dataVar[0].type,
          file_path:dataVar[0].file_path,
          timestamp: new Date(),
          sixLevelStatus:'Pending',
          delete_status: false,
          typeOfPaymentNote : 'SLDC',
          levelOne : {username:'',level:1,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelTwo : {username:'',level:2,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelThree : {username:'',level:3,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFour : {username:'',level:4,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFive : {username:'',level:5,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelSix : {username:'',level:6,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()}
        };
        SixLevelApproval.insert(jsonForSixLevel);
          SLDCPaymentNoteDetails.update({
              _id: ids
          }, {
              $set: {
                  initialisedForApproval: true,
                  sixLevelStatus:'Pending'
              }
          });
          // finding data
          var data = SLDCPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
          return returnSuccess('Payment Note Initialised',data);
      }
      else if (typeOfPaymentNote == 'RLDC') {
        let dataVar = RLDCPaymentNoteDetails.find({_id:ids}).fetch();
        var jsonForSixLevel = {
          documentId:dataVar[0]._id,
          month:dataVar[0].month,
          year:dataVar[0].year,
          financial_year:dataVar[0].financial_year,
          state:dataVar[0].state,
          file_type:dataVar[0].type,
          file_path:dataVar[0].file_path,
          timestamp: new Date(),
          sixLevelStatus:'Pending',
          delete_status: false,
          typeOfPaymentNote : 'RLDC',
          levelOne : {username:'',level:1,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelTwo : {username:'',level:2,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelThree : {username:'',level:3,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFour : {username:'',level:4,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFive : {username:'',level:5,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelSix : {username:'',level:6,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()}
        };
        SixLevelApproval.insert(jsonForSixLevel);
          RLDCPaymentNoteDetails.update({
              _id: ids
          }, {
              $set: {
                  initialisedForApproval: true,
                  sixLevelStatus:'Pending'
              }
          });
          // finding data
          var data = RLDCPaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
          return returnSuccess('Payment Note Initialised',data);
      }
      else if (typeOfPaymentNote == 'Incentive') {
        let dataVar = IncentivePaymentNoteDetails.find({_id:ids}).fetch();
        var jsonForSixLevel = {
          documentId:dataVar[0]._id,
          year:dataVar[0].year,
          financial_year:dataVar[0].financialYear,
          state:dataVar[0].state,
          file_type:dataVar[0].type,
          file_path:dataVar[0].file_path,
          timestamp: new Date(),
          sixLevelStatus:'Pending',
          delete_status: false,
          typeOfPaymentNote : 'Incentive',
          levelOne : {username:'',level:1,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelTwo : {username:'',level:2,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelThree : {username:'',level:3,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFour : {username:'',level:4,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelFive : {username:'',level:5,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()},
          levelSix : {username:'',level:6,comment:'No comment',status:'Pending',date:moment().format('DD-MM-YYYY'),timestamp:new Date()}
        };
        SixLevelApproval.insert(jsonForSixLevel);
          IncentivePaymentNoteDetails.update({
              _id: ids
          }, {
              $set: {
                  initialisedForApproval: true,
                  sixLevelStatus:'Pending'
              }
          });
          // finding data
          var data = IncentivePaymentNoteDetails.find({
            month: month,
            year: year,
            delete_status: false
        }).fetch();
          return returnSuccess('Payment Note Initialised',data);
      }
      else if (typeOfPaymentNote == 'UI') {

      }
    },
    deletePaymentNoteAndPdfFile(ids,filePath, month, year, typeOfPaymentNote){
      if(typeOfPaymentNote == 'Energy'){
        var backupData = EnergyPaymentNoteDetails.find({_id:ids}).fetch();
        var clientId = backupData[0].clientId;
        var financialYear = backupData[0].financialYear;
        var month = backupData[0].month;
        var checkData = LogBookSpd.find({clientId:clientId, month:month, financial_year:financialYear},{sort: {$natural: -1}}).fetch();
        if (checkData.length > 0) {
          if (checkData.length == 1) {
            LogBookSpd.update({clientId:clientId, month:month, financial_year:financialYear}, {$set: {paymentMode:'0', dateOfPayment:'', shortPaymentDone:'0', remark:''}});
          }else {
            //--------------spd data--------------//
          }
        }

        // creating log
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            user_type: Meteor.user().profile.user_type,
            log_type: 'Payment Note Deleted',
            template_name: 'paymentNoteReport',
            event_name: 'deletePaymentNote',
            timestamp: new Date(),
            action_date: moment().format('DD-MM-YYYY'),
            json: backupData[0],
        });
        EnergyPaymentNoteDetails.update({
          _id:ids
        },{
          $set : {
            delete_status:true,
            deleted_by_userid:Meteor.userId(),
            deleted_by_username:Meteor.user().username,
            deleted_timestamp:new Date()
          }
        });
        var approvalDataVar = SixLevelApproval.find({documentId:ids}).fetch();
        if (approvalDataVar.length > 0) {
          SixLevelApproval.update({
            documentId:ids
          },{
            $set : {
              delete_status:true,
              deleted_by_userid:Meteor.userId(),
              deleted_by_username:Meteor.user().username,
              deleted_timestamp:new Date()
            }
          });
        }
        var data = EnergyPaymentNoteDetails.find({
          month: month,
          year: year,
          delete_status: false
        }).fetch();


        return returnSuccess('Payment Note and pdf file deleted!',data);
      }
      else if (typeOfPaymentNote == 'Transmission') {
        var backupData = TransmissionPaymentNoteDetails.find({_id:ids}).fetch();
        // creating log
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            user_type: Meteor.user().profile.user_type,
            log_type: 'Payment Note Deleted',
            template_name: 'paymentNoteReport',
            event_name: 'deletePaymentNote',
            timestamp: new Date(),
            action_date: moment().format('DD-MM-YYYY'),
            json: backupData[0],
        });
        TransmissionPaymentNoteDetails.update({
          _id:ids
        },{
          $set : {
            delete_status:true,
            deleted_by_userid:Meteor.userId(),
            deleted_by_username:Meteor.user().username,
            deleted_timestamp:new Date()
          }
        });
        var approvalDataVar = SixLevelApproval.find({documentId:ids}).fetch();
        if (approvalDataVar.length > 0) {
          SixLevelApproval.update({
            documentId:ids
          },{
            $set : {
              delete_status:true,
              deleted_by_userid:Meteor.userId(),
              deleted_by_username:Meteor.user().username,
              deleted_timestamp:new Date()
            }
          });
        }
        var data = TransmissionPaymentNoteDetails.find({
          month: month,
          year: year,
          delete_status: false
        }).fetch();
        return returnSuccess('Payment Note and pdf file deleted!',data);
      }
      else if (typeOfPaymentNote == 'SLDC') {
        var backupData = SLDCPaymentNoteDetails.find({_id:ids}).fetch();
        // creating log
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            user_type: Meteor.user().profile.user_type,
            log_type: 'Payment Note Deleted',
            template_name: 'paymentNoteReport',
            event_name: 'deletePaymentNote',
            timestamp: new Date(),
            action_date: moment().format('DD-MM-YYYY'),
            json: backupData[0],
        });
        SLDCPaymentNoteDetails.update({
          _id:ids
        },{
          $set : {
            delete_status:true,
            deleted_by_userid:Meteor.userId(),
            deleted_by_username:Meteor.user().username,
            deleted_timestamp:new Date()
          }
        });
        var approvalDataVar = SixLevelApproval.find({documentId:ids}).fetch();
        if (approvalDataVar.length > 0) {
          SixLevelApproval.update({
            documentId:ids
          },{
            $set : {
              delete_status:true,
              deleted_by_userid:Meteor.userId(),
              deleted_by_username:Meteor.user().username,
              deleted_timestamp:new Date()
            }
          });
        }
        var data = SLDCPaymentNoteDetails.find({
          month: month,
          year: year,
          delete_status: false
        }).fetch();
        return returnSuccess('Payment Note and pdf file deleted!',data);
      }
      else if (typeOfPaymentNote == 'RLDC') {
        var backupData = RLDCPaymentNoteDetails.find({_id:ids}).fetch();
        // creating log
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            user_type: Meteor.user().profile.user_type,
            log_type: 'Payment Note Deleted',
            template_name: 'paymentNoteReport',
            event_name: 'deletePaymentNote',
            timestamp: new Date(),
            action_date: moment().format('DD-MM-YYYY'),
            json: backupData[0],
        });
        RLDCPaymentNoteDetails.update({
          _id:ids
        },{
          $set : {
            delete_status:true,
            deleted_by_userid:Meteor.userId(),
            deleted_by_username:Meteor.user().username,
            deleted_timestamp:new Date()
          }
        });
        var approvalDataVar = SixLevelApproval.find({documentId:ids}).fetch();
        if (approvalDataVar.length > 0) {
          SixLevelApproval.update({
            documentId:ids
          },{
            $set : {
              delete_status:true,
              deleted_by_userid:Meteor.userId(),
              deleted_by_username:Meteor.user().username,
              deleted_timestamp:new Date()
            }
          });
        }
        var data = RLDCPaymentNoteDetails.find({
          month: month,
          year: year,
          delete_status: false
        }).fetch();
        return returnSuccess('Payment Note and pdf file deleted!',data);
      }
      else if (typeOfPaymentNote == 'Incentive') {
        var backupData = IncentivePaymentNoteDetails.find({_id:ids}).fetch();
        // creating log
        var ip= this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            user_type: Meteor.user().profile.user_type,
            log_type: 'Payment Note Deleted',
            template_name: 'paymentNoteReport',
            event_name: 'deletePaymentNote',
            timestamp: new Date(),
            action_date: moment().format('DD-MM-YYYY'),
            json: backupData[0],
        });
        IncentivePaymentNoteDetails.update({
          _id:ids
        },{
          $set : {
            delete_status:true,
            deleted_by_userid:Meteor.userId(),
            deleted_by_username:Meteor.user().username,
            deleted_timestamp:new Date()
          }
        });
        var approvalDataVar = SixLevelApproval.find({documentId:ids}).fetch();
        if (approvalDataVar.length > 0) {
          SixLevelApproval.update({
            documentId:ids
          },{
            $set : {
              delete_status:true,
              deleted_by_userid:Meteor.userId(),
              deleted_by_username:Meteor.user().username,
              deleted_timestamp:new Date()
            }
          });
        }
        var data = IncentivePaymentNoteDetails.find({
          month: month,
          year: year,
          delete_status: false
        }).fetch();
        return returnSuccess('Payment Note and pdf file deleted!',data);
      }
      else if (typeOfPaymentNote == 'UI') {

      }
    }
});

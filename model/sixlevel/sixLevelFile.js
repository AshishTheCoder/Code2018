Meteor.methods({
  getDataForApproval(){
    let data = SixLevelApproval.find({sixLevelStatus:'Pending',delete_status:false},{sort: {$natural:-1}}).fetch();
    var userName = Meteor.user().username;
    var userArr = [];
     var userData = Meteor.users.find({'profile.status':'approved','profile.registration_form.sixLevelUser':true}).fetch();
     _.each(userData, function(item) {
       if (item.username != userName) {
         userArr.push(item);
       }
     });

     var json = {data:data,userData:userArr};
    return returnSuccess('Data received for approval',json);
  },
  filterPaymentNoteForApproval(noteType){
    var returnData = '';
    if (noteType != '') {
       returnData = SixLevelApproval.find({sixLevelStatus:'Pending',typeOfPaymentNote:noteType,delete_status:false},{sort: {$natural:-1}}).fetch();
    }else {
       returnData = SixLevelApproval.find({sixLevelStatus:'Pending',delete_status:false},{sort: {$natural:-1}}).fetch();
    }
    return returnSuccess('Data received for six level approval',returnData);
  },
  gettingApprovalData(ids){
    var getApprovalDetails = false;
    let data = SixLevelApproval.find({_id:ids}).fetch();
    if (data[0].levelOne.status == 'Approved' && data[0].levelTwo.status == 'Approved' && data[0].levelThree.status == 'Approved' && data[0].levelFour.status == 'Approved' && data[0].levelFive.status == 'Approved' && data[0].levelSix.status == 'Approved') {
      getApprovalDetails = true;
    }
    var json = {dataJson:data[0],getApprovalDetails:getApprovalDetails}
    return returnSuccess('Returning approval details',json);
  },
  submitPaymentNoteStatus(ids,status,comment,remark,forwardTo,selectedUseLevel,userStatus,userComment,keyArr,noteType,forwardedPersonName){
    var fileNoVar = '001';
    // var fileNoVar = Math.floor((Math.random() * 10000) + 1).toString();
    var userLevelVar = Meteor.user().profile.registration_form.levelNumber;
    var checkLevel = Number(selectedUseLevel) - Number(userLevelVar);
    console.log('Level Difference = '+checkLevel);
    var fieldname = Meteor.user().profile.registration_form.level;
    console.log('Level = ' +fieldname);
    var backupData = SixLevelApproval.find({_id:ids}).fetch();
    // var dataDocumentId = backupData[0].documentId;
    // var typeOfPaymentNoteData = backupData[0].typeOfPaymentNote;
    var fileType = backupData[0].file_type;
    var ip= this.connection.httpHeaders['x-forwarded-for'];
    var ipArr = ip.split(',');

    if (checkLevel  > 1) {
        LogDetails.insert({
            ip_address: ipArr,
            user_id: Meteor.userId(),
            user_name: Meteor.user().username,
            user_type: Meteor.user().profile.user_type,
            log_type: 'Payment Note '+status,
            template_name: 'sixLevelFilesInitialization',
            event_name: 'btnSubmitApproval',
            timestamp: new Date(),
            action_date: moment().format('DD-MM-YYYY'),
            documentId:backupData[0].documentId,
            userLevel:fieldname,
            statusForUpdate:userStatus,
            commentForUpdate:userComment,
            json: backupData[0],
        });
        var i = 0;
        _.each(keyArr, function(item) {
            SixLevelApproval.update({
              _id:ids
            },{
              $set: {
                [item.levelString+'.status']:userStatus[i],
                [item.levelString+'.name']:item.name,
                [item.levelString+'.username']:item.username,
                [item.levelString+'.comment']:userComment[i],
                [item.levelString+'.remark']:item.remark,
                [item.levelString+'.forward_to_name']:item.forwardedPersonName,
                [item.levelString+'.forward_to_username']:item.forwardTo,
                [item.levelString+'.date']:moment().format('DD-MM-YYYY'),
                [item.levelString+'.timestamp']:new Date()
              }
            });
            i++;
        });
    }else {
      LogDetails.insert({
          ip_address: ipArr,
          user_id: Meteor.userId(),
          user_name: Meteor.user().username,
          user_type: Meteor.user().profile.user_type,
          log_type: 'Payment Note '+status,
          template_name: 'sixLevelFilesInitialization',
          event_name: 'btnSubmitApproval',
          timestamp: new Date(),
          action_date: moment().format('DD-MM-YYYY'),
          documentId:backupData[0].documentId,
          userLevel:fieldname,
          statusForUpdate:status,
          commentForUpdate:comment,
          json: backupData[0],
      });
      SixLevelApproval.update({
        _id:ids
      },{
        $set: {
          [fieldname+'.status']:status,
          [fieldname+'.name']:Meteor.user().profile.registration_form.name,
          [fieldname+'.username']:Meteor.user().username,
          [fieldname+'.comment']:comment,
          [fieldname+'.remark']:remark,
          [fieldname+'.forward_to_name']:forwardedPersonName,
          [fieldname+'.forward_to_username']:forwardTo,
          [fieldname+'.date']:moment().format('DD-MM-YYYY'),
          [fieldname+'.timestamp']:new Date()
        }
      });
    }
    // if (status == 'Rejected') {
      var userData = Meteor.users.find({username:forwardTo}).fetch();
      var json = {
        documentId : backupData[0]._id,
        date : moment().format('DD-MM-YYYY'),
        name : forwardedPersonName,
        username : forwardTo,
        forward_to_level : userData[0].profile.registration_form.levelNumber,
        status : status,
        remark : remark,
        comment : comment,
        file_type : backupData[0].file_type,
        state : backupData[0].state,
        forwarded_by_name : Meteor.user().profile.registration_form.name,
        forwarded_by_username : Meteor.user().username,
        forwarded_by_level : Meteor.user().profile.registration_form.levelNumber,
        deleted_status : false,
        hidden: false,
        timestamp :  new Date()
      };
      EprocessingFileStatus.insert(json);
    // }
    if (Meteor.user().profile.user_type ==  'admin' || Meteor.user().profile.user_type ==  'commercial' || Meteor.user().profile.user_type ==  'master') {
      // if (status == 'Closed' || status == 'Rejected') {
      if (status == 'Closed') {
        SixLevelApproval.update({_id:ids},{$set: {sixLevelStatus:status}});
        if (backupData[0].typeOfPaymentNote == 'Energy') {
          EnergyPaymentNoteDetails.update({
              _id: backupData[0].documentId
          }, {
              $set: {
                  sixLevelStatus: status
              }
          });
        }else if (backupData[0].typeOfPaymentNote == 'Transmission') {
          TransmissionPaymentNoteDetails.update({
              _id: backupData[0].documentId
          }, {
              $set: {
                  sixLevelStatus: status
              }
          });
        }else if (backupData[0].typeOfPaymentNote == 'SLDC') {
          SLDCPaymentNoteDetails.update({
              _id: backupData[0].documentId
          }, {
              $set: {
                  sixLevelStatus: status
              }
          });
        }else if (backupData[0].typeOfPaymentNote == 'RLDC') {
          RLDCPaymentNoteDetails.update({
              _id: backupData[0].documentId
          }, {
              $set: {
                  sixLevelStatus: status
              }
          });
        }else if (backupData[0].typeOfPaymentNote == 'Incentive') {
          IncentivePaymentNoteDetails.update({
              _id: backupData[0].documentId
          }, {
              $set: {
                  sixLevelStatus: status
              }
          });
        }
      }
    }
    if (status != 'Closed') {
      // Mail will not sent when file will closed
      var name = Meteor.user().profile.registration_form.name;
      var designation = Meteor.user().profile.registration_form.designation;
      paymentNoteApprovalConformationMail(forwardTo,name,designation,fileType);
    }
    let data = '';
    if (noteType != '') {
      data =  SixLevelApproval.find({sixLevelStatus:'Pending',typeOfPaymentNote:noteType,delete_status:false},{sort: {$natural:-1}}).fetch();
   }else {
      data = SixLevelApproval.find({sixLevelStatus:'Pending',delete_status:false},{sort: {$natural:-1}}).fetch();
   }
    return returnSuccess('Status successfully updated',data);
  }
});

paymentNoteApprovalConformationMail = function(forwardTo,name,designation, fileType, fileNoVar){
  var title = fileType;
  var date = moment().format('DD-MM-YYYY');
  var subject = 'File Forword';
  var message = "Dear Sir/Ma'am,<br><br><b>File Forward Details</b><br><br>File No        : "+fileNoVar+"<br>Subject        : "+title+"<br>Designation    : "+designation+"<br>Name           : "+name+"<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
  var email = forwardTo;
  // var email = 'neeraj@cybuzzsc.com';
  Meteor.setTimeout(function() {
          Meteor.call("sendMandrillEmailForPaymentNote", email, subject, message, function(error, result) {
              if (error) {
                  var ErrorJson = {
                      email: email,
                      message: message,
                      status: "false",
                      log: error,
                      date: date,
                      timeStamp: new Date()
                  };
                  EmailLogs.insert(ErrorJson);
              } else {
                  if (result.message == "sent") {
                      var SentJson = {
                          email: email,
                          message: message,
                          status: "true",
                          date: date,
                          log: result,
                          timeStamp: new Date()
                      }
                      EmailLogs.insert(SentJson);
                  } else {
                      var ErrorJson = {
                          email: email,
                          message: message,
                          status: "false",
                          date: date,
                          log: result,
                          timeStamp: new Date()
                      };
                      EmailLogs.insert(ErrorJson);
                  }
              }
          })
  }, 10000);
};

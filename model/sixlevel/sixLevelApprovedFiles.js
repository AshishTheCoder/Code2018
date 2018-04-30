Meteor.methods({
  gettingSchemeForUtility(){
    var schemeData = Schemes.find().fetch();
    return returnSuccess('Getting Sechemes!',schemeData);
  },
  gettingSPDonTheBasisOfScheme(schemeArr){
    var spdListArr = [];
      var spdList = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved','profile.registration_form.scheme':{ $in: schemeArr}}).fetch();
    return returnSuccess('Getting Sechemes!',spdList);
  },
  gettingApprovedPaymentNote(json){
    var returnAllDataArr = [];
      var filterType = json.filterType;
      var spdListArr = json.spdListArr;
      if(filterType == 'financialYear' || filterType == 'month') {
        var financialYearArr = json.financialYearArr;
        var monthArr = json.monthArr;
        spdListArr.forEach( function(spdId) {
          financialYearArr.forEach(function(financialYear) {
            monthArr.forEach(function(month) {
              var logBookData = LogBookSpd.find({clientId:spdId, month : month, financial_year: financialYear}).fetch();
              if (logBookData.length > 0) {
                var clientId = logBookData[0].clientId;
                var energyPaymentNote = EnergyPaymentNoteDetails.find({clientId:clientId, month : month, financialYear: financialYear, delete_status:false}).fetch();
                if (energyPaymentNote.length > 0) {
                  var documentId = energyPaymentNote[0]._id;
                  // var sixLeveldata = SixLevelApproval.find({documentId:documentId, sixLevelStatus:'Closed', file_type:"Energy Payment Note"}).fetch();
                  var sixLeveldata = SixLevelApproval.find({documentId:documentId,file_type:"Energy Payment Note"}).fetch();
                  if (sixLeveldata.length > 0) {
                    logBookData.forEach(function(item) {
                      returnAllDataArr.push({logBook:item, paymentNote:energyPaymentNote[0]});
                    });
                  }
                }
              }
            });
          });
        });
      }else if (filterType == 'dueDate' || filterType == 'dateOfPayment') {
        fromDate = json.fromDate.split('-');
        toDate = json.toDate.split('-');
        fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
        toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        date1_unixtime = parseInt(fromDate.getTime() / 1000);
        date2_unixtime = parseInt(toDate.getTime() / 1000);
        var timeDifference = date2_unixtime - date1_unixtime;
        var timeDifferenceInHours = timeDifference / 60 / 60;
        var timeDifferenceInDays = timeDifferenceInHours / 24;
        if (timeDifferenceInDays >= 0) {
          fromDate.setDate(fromDate.getDate());
              for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
                spdListArr.forEach( function(spdId) {
                  var loopDate = moment(fromDate).format('DD-MM-YYYY');
                  if (filterType == 'dueDate') {
                    var logBookData = LogBookSpd.find({clientId:spdId, dueDate: loopDate}).fetch();
                  }else if (filterType == 'dateOfPayment') {
                    var logBookData = LogBookSpd.find({clientId:spdId, dateOfPayment: loopDate}).fetch();
                  }
                  if (logBookData.length > 0) {
                    var clientId = logBookData[0].clientId;
                    var month = logBookData[0].month;
                    var year = logBookData[0].year;
                    var energyPaymentNote = EnergyPaymentNoteDetails.find({clientId:clientId, month : month, year: year, delete_status:false}).fetch();
                    if (energyPaymentNote.length > 0) {
                      var documentId = energyPaymentNote[0]._id;
                      // var sixLeveldata = SixLevelApproval.find({documentId:documentId,sixLevelStatus:'Closed', file_type:"Energy Payment Note"}).fetch();
                      var sixLeveldata = SixLevelApproval.find({documentId:documentId, file_type:"Energy Payment Note"}).fetch();
                      if (sixLeveldata.length > 0) {
                        logBookData.forEach(function(item) {
                          returnAllDataArr.push({logBook:logBookData[0], paymentNote:energyPaymentNote[0]});
                        });
                      }
                    }
                  }
                });
                fromDate.setDate(fromDate.getDate() + 1);
              }
        }
      }
    console.log('Final Array Length == '+returnAllDataArr.length);
    return returnSuccess('Getting SPD Approved Paymnet Note!', returnAllDataArr);
  },
  gettingApprovedSLDCAndRLDCPaymentNote(json){
    var returnAllDataArr = [];
      var filterType = json.filterType;
      if(filterType == 'financialYear' || filterType == 'month') {
        var financialYearArr = json.financialYearArr;
        var monthArr = json.monthArr;
        financialYearArr.forEach(function(financialYear) {
          monthArr.forEach(function(month) {
            if (json.paymentNoteType == 'SLDC') {
              var paymentNoteData = SLDCPaymentNoteDetails.find({month : month, financialYear: financialYear, state:json.stateForRLDC, delete_status:false}).fetch();
              if (paymentNoteData.length > 0) {
                var documentId = paymentNoteData[0]._id;
                // var sixLeveldata = SixLevelApproval.find({documentId:documentId, sixLevelStatus:'Closed', file_type:"SLDC Payment Note"},{sort: {$natural:-1}}).fetch();
                var sixLeveldata = SixLevelApproval.find({documentId:documentId},{sort: {$natural:-1}}).fetch();
                if (sixLeveldata.length > 0) {
                  returnAllDataArr.push({data:paymentNoteData[0], sixLeveldata:sixLeveldata[0]});
                }
              }
            }else if (json.paymentNoteType == 'RLDC') {
              var paymentNoteData = RLDCPaymentNoteDetails.find({month : month, financial_year: financialYear, state:json.stateForRLDC, delete_status:false}).fetch();
              if (paymentNoteData.length > 0) {
                var documentId = paymentNoteData[0]._id;
                // var sixLeveldata = SixLevelApproval.find({documentId:documentId, sixLevelStatus:'Closed', file_type:"RLDC Payment Note"},{sort: {$natural:-1}}).fetch();
                var sixLeveldata = SixLevelApproval.find({documentId:documentId},{sort: {$natural:-1}}).fetch();
                if (sixLeveldata.length > 0) {
                  returnAllDataArr.push({data:paymentNoteData[0], sixLeveldata:sixLeveldata[0]});
                }
              }
            }
          });
        });
      }
      // else if (filterType == 'dueDate' || filterType == 'dateOfPayment') {
      //   fromDate = json.fromDate.split('-');
      //   toDate = json.toDate.split('-');
      //   fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
      //   toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
      //   date1_unixtime = parseInt(fromDate.getTime() / 1000);
      //   date2_unixtime = parseInt(toDate.getTime() / 1000);
      //   var timeDifference = date2_unixtime - date1_unixtime;
      //   var timeDifferenceInHours = timeDifference / 60 / 60;
      //   var timeDifferenceInDays = timeDifferenceInHours / 24;
      //   if (timeDifferenceInDays >= 0) {
      //     fromDate.setDate(fromDate.getDate());
      //         for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
      //           spdListArr.forEach( function(spdId) {
      //             var loopDate = moment(fromDate).format('DD-MM-YYYY');
      //             if (filterType == 'dueDate') {
      //               var logBookData = LogBookSpd.find({clientId:spdId, dueDate: loopDate}).fetch();
      //             }else if (filterType == 'dateOfPayment') {
      //               var logBookData = LogBookSpd.find({clientId:spdId, dateOfPayment: loopDate}).fetch();
      //             }
      //             if (logBookData.length > 0) {
      //               var clientId = logBookData[0].clientId;
      //               var month = logBookData[0].month;
      //               var year = logBookData[0].year;
      //               var energyPaymentNote = EnergyPaymentNoteDetails.find({clientId:clientId, month : month, year: year, delete_status:false}).fetch();
      //               if (energyPaymentNote.length > 0) {
      //                 var documentId = energyPaymentNote[0]._id;
      //                 // var sixLeveldata = SixLevelApproval.find({documentId:documentId,sixLevelStatus:'Closed', file_type:"Energy Payment Note"},{sort: {$natural:-1}}).fetch();
      //                 var sixLeveldata = SixLevelApproval.find({documentId:documentId, file_type:"Energy Payment Note"},{sort: {$natural:-1}}).fetch();
      //                 if (sixLeveldata.length > 0) {
      //                   returnAllDataArr.push({logBook:logBookData[0], paymentNote:energyPaymentNote[0]});
      //                 }
      //               }
      //             }
      //           });
      //           fromDate.setDate(fromDate.getDate() + 1);
      //         }
      //   }
      // }
    console.log('Final Array Length ==== '+returnAllDataArr.length);
    return returnSuccess('Getting SPD Approved SLDC & RLDC Paymnet Note!', returnAllDataArr);
  }
});


// {'capacity_mw' : '20', 'scheme' : 'P-II,B-III (2000MW)'}
// {'capacity_mw' : '20', 'scheme' : 'P-II,B-IV (5000MW)'}
// {'capacity_mw' : '20', 'scheme' : 'P-II,B-I (750 MW)'}
// {'capacity_mw' : '20', 'scheme' : 'Border Solarization'}
// {'capacity_mw' : '20', 'scheme' : 'Delhi Pwd'}

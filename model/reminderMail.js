Meteor.methods({
  InvoiceEnergyReminderMail(){
    var currentDate = moment().format('DD-MM-YYYY');
    var todayDay = moment().format('dddd');
    var month = moment().format('MM');
    var year = moment().format('YYYY');
    var checkHoliday = SeciHolidaysDetails.find({date:currentDate}).fetch();
    if (checkHoliday.length == 0) {
      if (todayDay == 'Monday' || todayDay == 'Tuesday' || todayDay == 'Wednesday' || todayDay == 'Thursday' || todayDay == 'Friday') {
        var checkData = ReminderEnergyInvoice.find({month:month,year:year}).fetch();
        if (checkData.length == 0) {
          var subject = 'Gentle Reminder for Invoice Energy';
          var bodyMsg = 'Dear Sir/Ma’am,<br><br> Greetings of the day from Solar Energy Corporation of India Ltd. It is gentle reminder to enter your invoice details on SECI portal i.e. ‘secipowertrading.com’ by date '+currentDate+'.<br><br>*If already processed kindly ignore the mail.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com';
          var array = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved'}).fetch();
          var sendToArrBySMTP = [];
          var sendCCArrBySMTP = ['shibasish@seci.gov.in', 'avnish.parashar@seci.gov.in', 'neeraj@cybuzzsc.com'];
          for (var i = 0; i < array.length; i++) {
            var sendTo = array[i].username;
            var sendToArr = [
              {email: sendTo,type:'to'},
              {email: 'shibasish@seci.gov.in',type:'cc'},
              {email: 'avnish.parashar@seci.gov.in',type:'cc'},
              {email: 'neeraj@cybuzzsc.com',type:'cc'}
            ];
            sendToArrBySMTP.push(sendTo);
          }

          Meteor.setTimeout(function() {
            Meteor.call("sendReminderMailUsingMandrillEmail", sendToArr, subject, bodyMsg, sendToArrBySMTP, sendCCArrBySMTP);
          }, 10000);
          ReminderEnergyInvoice.insert({date:currentDate,month:month,year:year,sentMailStatus:true});
        }else {
          console.log('Reminder mail already sent!');
        }
      }else {
        console.log('Today is weekend!');
      }
    }else {
      console.log('Today is holiday!');
    }
  },
  dailyActualGenerationReminderMail(){
    var subject = 'Gentle Reminder to Submit Actual Generation Data';
    var bodyMsg = 'Dear Sir/Ma’am,<br><br> Greetings of the day from Solar Energy Corporation of India Ltd. It is gentle reminder to submit the data of Actual Generation on till 9 pm to avoid consequences.<br><br>*If already processed kindly ignore the mail.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com';
    var array = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved', 'profile.registration_form.transaction_type': 'Inter', 'profile.registration_form.spd_state': 'Rajasthan'}).fetch();
    var currentDate = moment().format('DD-MM-YYYY');
    var checkArray = [];
    var usersArr = [];
    var sendToArrBySMTP = [];
    array.forEach( function(item){
      var data = JmrDaily.find({clientId: item._id, date: currentDate}).fetch();
      if (data.length == 0) {
        checkArray.push({email: item.username,type:'to'});
        usersArr.push({email: item.username,type:'to'});
        sendToArrBySMTP.push(item.username);
      }
    });
    var sendCCArrBySMTP = ['shibasish@seci.gov.in', 'avnish.parashar@seci.gov.in', 'seci.scheduling@gmail.com', 'neeraj@cybuzzsc.com'];

    usersArr.push({email: 'shibasish@seci.gov.in',type:'cc'});
    usersArr.push({email: 'avnish.parashar@seci.gov.in',type:'cc'});
    usersArr.push({email: 'seci.scheduling@gmail.com',type:'cc'});
    usersArr.push({email: 'neeraj@cybuzzsc.com',type:'cc'});

    Meteor.setTimeout(function() {
      var sendToArr = usersArr;
      if (checkArray.length > 0) {
        Meteor.call("sendReminderMailUsingMandrillEmail", sendToArr, subject, bodyMsg, sendToArrBySMTP, sendCCArrBySMTP);
      }
    }, 10000);
  },
  discomReminderMailBeforeSevenDaysFromDueDate(){
    var myDate = moment().add(7, 'days');
    var duedate = myDate.format('DD-MM-YYYY');
      var dataArr = [];
      var energyData = EnergyInvoiceDetails.find({energy_invoice_due_date:duedate,type:'Provisional_Invoice',delete_status:false}).fetch();
      console.log('Energy Array Length = '+energyData.length);
      if (energyData.length > 0) {
        energyData.forEach(function(item) {
          var discomState = item.discom_state;
          if (discomState == 'Bihar') {
            discomState == item.spd_direction+' Bihar';
          }
          var emailArr = getingDiscomMailIdsForReminderMail(discomState);
          dataArr.push({emailArr:emailArr, invoiceNumber:item.invoice_number,total_amount:item.total_amount,dateofInvoice:item.energy_invoice_generation_date,invoiceType:'Energy'});
        });
      }
      var tcData = TransmissionInvoiceDetails.find({due_date:duedate,type:'Transmission_Charges',delete_status:false}).fetch();
      console.log('Transmission Array Length = '+tcData.length);
      if (tcData.length > 0) {
        tcData.forEach(function(item) {
          var discomState = item.discom_state;
          if (discomState == 'Bihar') {
            discomState == item.region;
          }
          var emailArr = getingDiscomMailIdsForReminderMail(discomState);
          dataArr.push({emailArr:emailArr, invoiceNumber:item.invoice_number,total_amount:item.total_transmission_invoice,dateofInvoice:item.generation_date,invoiceType:'Transmission'});
        });
      }

      var sldcData = SLDCInvoiceDetails.find({due_date:duedate,type:'SLDC_Charges',delete_status:false}).fetch();
      console.log('SLDC Array Length = '+sldcData.length);
      if (sldcData.length > 0) {
        sldcData.forEach(function(item) {
          var discomState = item.discom_state;
          var emailArr = getingDiscomMailIdsForReminderMail(discomState);
          dataArr.push({emailArr:emailArr, invoiceNumber:item.invoice_number,total_amount:item.total_amount,dateofInvoice:item.generation_date,invoiceType:'SLDC'});
        });
      }

      var incentiveData = IncentiveChargesDetail.find({due_date:duedate,type:'Incentive_Charges',delete_status:false}).fetch();
      console.log('Incentive Array Length = '+incentiveData.length);
      if (incentiveData.length > 0) {
        incentiveData.forEach(function(item) {
          var discomState = item.discom_state;
          var emailArr = getingDiscomMailIdsForReminderMail(discomState);
          dataArr.push({emailArr:emailArr, invoiceNumber:item.invoice_number,total_amount:item.incentive_charges,dateofInvoice:item.generation_date,invoiceType:'Incentive'});
        });
      }

      console.log('Final Data Array Length = '+dataArr.length);
      if (dataArr.length > 0) {
        Meteor.setTimeout(function() {
          for (var i = 0; i < dataArr.length; i++) {
            var invoiceNumber = dataArr[i].invoiceNumber;
            var dated = dataArr[i].dateofInvoice;
            var dueAmount = dataArr[i].total_amount;
            var invoiceType = dataArr[i].invoiceType;
            var subject = 'Gentle Reminder for Payment to SECI';
            var bodyMsg = "Dear Sir/Ma’am,<br><br> Greetings of the day from Solar Energy Corporation of India Ltd. It is gentle Reminder for payment of "+invoiceType+". Having invoice no. "+invoiceNumber+" dated "+dated+" of Rs. "+dueAmount+" Due date of invoice is "+duedate+" it is requested to kindly process the payment on time.<br><br>*If already processed kindly ignore the mail.<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
            var sendToArr = dataArr[i].emailArr;
            var sendToArrBySMTP = [];
            sendToArr.forEach( function(emailItem) {
              if (emailItem.type == 'to') {
                sendToArrBySMTP.push(emailItem.email);
              }
            })
            // var sendToArr = [{email: 'neeraj@cybuzzsc.com',type:'to'}];
            var sendCCArrBySMTP = ['shibasish@seci.gov.in', 'avnish.parashar@seci.gov.in', 'neeraj@cybuzzsc.com'];
            Meteor.call("sendReminderMailUsingMandrillEmail", sendToArr, subject, bodyMsg, sendToArrBySMTP, sendCCArrBySMTP);
          }
        }, 10000);
      }
  },
  secilReminderMailBeforeSevenDaysFromDueDateOfSPDpayment(){
    var myDate = moment().add(7, 'days');
    var duedatewithSlace = myDate.format('DD/MM/YYYY');
    var duedate = myDate.format('DD-MM-YYYY');
    var month = myDate.format('MM');
    var dataArr = [];
    // var energyData = LogBookSpd.find({dueDate:duedate, dateOfPayment: ''}).fetch();
    var energyData = LogBookSpd.find({dueDate:duedate}).fetch();
    if (energyData.length > 0) {
      energyData.forEach(function(item) {
        var getScheme = Meteor.users.find({_id:item.clientId}).fetch();
        if (getScheme[0].profile.registration_form.scheme) {
          var spdUnderScheme = getScheme[0].profile.registration_form.scheme;
        }else {
          var spdUnderScheme = "_";
        }
        var period = monthInWords(item.month)+"'"+item.year;
        dataArr.push({invoiceNumber:item.invoiceNumber, period:period, dueDate:duedatewithSlace, entity:item.nameOfEntity, scheme:' under “'+spdUnderScheme+'”.', invoiceType:'Energy', utility:'SPD'});
      });
    }

    var dateArr = [];
    dateArr.push(duedate);
    var transcoData =  TransmissionPaymentNoteDetails.find({delete_status:false, dueDate: {$all : dateArr}}).fetch();
      if (transcoData.length > 0) {
        transcoData.forEach(function(item) {
          var monthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
          var period = monthArr[Number(item.month) - 1]+"'"+item.year;
          dataArr.push({invoiceNumber:"Transmission", period:period, dueDate:duedatewithSlace, entity:item.state, scheme:'.', invoiceType:'Transmission', utility:'Transmission Utility'});
        });
      }

    var sldcData =  SLDCPaymentNoteDetails.find({delete_status:false, dueDate: {$all : dateArr}}).fetch();
      if (sldcData.length > 0) {
        sldcData.forEach(function(item) {
          var monthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
          var period = monthArr[Number(item.month) - 1]+"'"+item.year;
          dataArr.push({invoiceNumber:"SLDC", period:period, dueDate:duedatewithSlace, entity:item.state, scheme:'.', invoiceType:'SLDC', utility:'SLDC'});
        });
      }

    if (dataArr.length > 0) {
      Meteor.setTimeout(function() {
        var bodyMsgA = "";
        for (var i = 0; i < dataArr.length; i++) {
          var entity = dataArr[i].entity;
          var period = dataArr[i].period;
          var scheme = dataArr[i].scheme;
          var subject = 'Reminder for Due Payment of SPD';
          var bodyMsgAA = 'Due date of payment for - '+entity+' for the month of '+period+' is due on '+duedatewithSlace+' '+scheme+'<br>';
          bodyMsgA = bodyMsgA + bodyMsgAA;
          var sendToArr = [
            {email: 'shibasish@seci.gov.in',type:'to'},
            {email: 'avnish.parashar@seci.gov.in',type:'to'},
            {email: 'tarun.mukhija@seci.co.in',type:'to'},
            {email: 'anilyadav@seci.co.in',type:'to'}
          ];
        }
        var bodyMsg = "Dear Sir/Ma’am,<br><br>"+bodyMsgA+"<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        var sendToArrBySMTP = ['shibasish@seci.gov.in', 'avnish.parashar@seci.gov.in', 'tarun.mukhija@seci.co.in', 'anilyadav@seci.co.in'];
        var sendCCArrBySMTP = ['neeraj@cybuzzsc.com'];
        Meteor.call("sendReminderMailUsingMandrillEmail", sendToArr, subject, bodyMsg,  sendToArrBySMTP, sendCCArrBySMTP);
      }, 10000);
    }else {
      console.log('Reminder for Due Payment of SPD Is Not Available For '+duedatewithSlace);
    }
  },
});


getClockTime = function(){
   var now    = new Date();
   var hour   = now.getHours();
   var minute = now.getMinutes();
   var second = now.getSeconds();
   var ap = "AM";
   if (hour   > 11) { ap = "PM";             }
   if (hour   > 12) { hour = hour - 12;      }
   if (hour   == 0) { hour = 12;             }
   if (hour   < 10) { hour   = "0" + hour;   }
   if (minute < 10) { minute = "0" + minute; }
   if (second < 10) { second = "0" + second; }
   var timeString = hour + ':' + minute + " " + ap;
   return timeString;
}

 getingDiscomMailIdsForReminderMail  = function(discomState) {
   if (discomState == 'Haryana') {//--------------------------------------------Haryana
     var emailArr = [
       {email: 'cehppc@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Delhi(BRPL)') {//----------------------------------Delhi(BRPL)
     var emailArr = [
       {email: 'sanjay.srivastav@relianceada.com',type:'to'},
       {email: 'shobhit.dhar@relianceada.com',type:'to'},
       {email: 'himanshu.chauhan@relianceada.com',type:'to'},
       {email: 'anil.k.arora@relianceada.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Delhi(BYPL)') {//----------------------------------Delhi(BYPL)
     var emailArr = [
       {email: 'sunil.kakkar@relianceada.com',type:'to'},
       {email: 'shekhar.saklani@relianceada.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Delhi(TPDDL)') {//---------------------------------Delhi(TPDDL)
     var emailArr = [
       {email: 'mithun.chakraborty@tatapower-ddl.com',type:'to'},
       {email: 'uttam.kumar@tatapower-ddl.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Assam') {//----------------------------------------Assam
     var emailArr = [
       {email: 'acecomt.aseb@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Punjab') {//---------------------------------------Punjab
     var emailArr = [
       {email: 'se-isb-ppr@pspcl.in',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Jharkhand') {//------------------------------------Jharkhand
     var emailArr = [
       {email: 'coml.rev@rediffmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Goa') {//------------------------------------------Goa
     var emailArr = [
       {email: 'eediv3@yahoo.co.in',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Himachal Pradesh') {//-----------------------------Himachal Pradesh
     var emailArr = [
       {email: 'seinterstate@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Chhattisgarh') {//---------------------------------Chhattisgarh
     var emailArr = [
       {email: 'cecomcseb@rediffmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Odisha') {//---------------------------------------Odisha
     var emailArr = [
       {email: 'dircommercial@yahoo.com',type:'to'},
       {email: 'patajoshisasmita@yahoo.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Maharashtra') {//----------------------------------Maharashtra
     var emailArr = [
       {email: 'cepp@mahadiscom.in',type:'to'},
       {email: 'secpmsedcl@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'North Bihar') {//----------------------------------North Bihar
     var emailArr = [
       {email: 'nbpdcl.pp.2012@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'South Bihar') {//----------------------------------South Bihar
     var emailArr = [
       {email: 'aeecomsbpdcl@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'MP') {//-------------------------------------------MP
     var emailArr = [
       {email: 'makarand.chincholkar@mppmcl.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ]
   }else if (discomState == 'Tamil Nadu') {//-----------------------------------Tamil Nadu
     var emailArr = [
       {email: 'cences@tnebnet.org',type:'to'},
       {email: 'sesolar@tnebnet.org',type:'to'},
       {email: 'setrym@tnebnet.org',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Karnataka') {//------------------------------------Karnataka
     var emailArr = [
       {email: 'gmpp@bescom.co.in',type:'to'},
       {email: 'gmpp.work@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'New Delhi') {//------------------------------------New Delhi
     var emailArr = [
       {email: 'eeepwddelhim253@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Rajasthan') {//------------------------------------Rajasthan
     var emailArr = [
       {email: 'cerdppc@gmail.com',type:'to'},
       {email: 'ruvnlwind@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Rajasthan(APMPL)') {//-----------------------------Rajasthan(APMPL)
     var emailArr = [
       {email: 'cerdppc@gmail.com',type:'to'},
       {email: 'ruvnlwind@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'New Delhi(NTPC)') {//------------------------------New Delhi(NTPC)
     var emailArr = [
       {email: 'nvvnsolar@gmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }else if (discomState == 'Gujarat') {//--------------------------------------Gujarat
     var emailArr = [
       {email: 'coacom@gebmail.com',type:'to'},
       {email: 'shibasish@seci.gov.in',type:'cc'},
       {email: 'avnish.parashar@seci.gov.in',type:'cc'}
     ];
   }
   return emailArr;
 };

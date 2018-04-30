if (developmentmode===0) {
  // //--------------- Energy Invoice Mail Alert to SPD ---------------//
  SyncedCron.add({
      name: 'Energy Invoice Mail Alert to SPD',
      schedule: function(parser) {
          return parser.text('at 09:15 am');
      },
      job: function() {
        console.log("Energy Invoice Mail Alert to SPD at 09:15 AM")
        Meteor.call('InvoiceEnergyReminderMail');
      }
  });

  // //--------------- Daily Actual Generation Submission Mail Alert---------------//
  SyncedCron.add({
      name: 'Daily Actual Generation Reminder Mail',
      schedule: function(parser) {
          return parser.text('at 09:00 pm');
      },
      job: function() {
        console.log("Daily Actual Generation Mail Alert at 09:00 PM")
        Meteor.call('dailyActualGenerationReminderMail');
      }
  });

  //---------- Discom Reminder Mail Alert Seven Days Before From Due Date----------//
  SyncedCron.add({
      name: 'Discom Reminder Mail Reminder Mail',
      schedule: function(parser) {
          return parser.text('at 09:25 am');
      },
      job: function() {
        console.log("Discom Reminder Mail Alert Seven Days Before From Due Date at 09:25 AM")
        Meteor.call('discomReminderMailBeforeSevenDaysFromDueDate');
      }
  });

  //----------------------- Send Reminders to SECIL-----------------------//
  SyncedCron.add({
      name: 'Send Reminders to SECIL',
      schedule: function(parser) {
          return parser.text('at 09:45 am');
      },
      job: function() {
        console.log("Send Reminders to SECIL For SPD Payment Due Date at 09:45 AM")
        Meteor.call('secilReminderMailBeforeSevenDaysFromDueDateOfSPDpayment');
      }
  });


  SyncedCron.add({
      name: 'Getting Defaulters At Ten Thirty AM',
      schedule: function(parser) {
          return parser.text('at 10:30 am');
      },
      job: function() {
          console.log("Cron Started")
          Meteor.call('makeDefaultersList');
      }
  });
  SyncedCron.add({
      name: 'MP SLDC Report At Ten PM',
      schedule: function(parser) {
          return parser.text('at 10:00 pm');
      },
      job: function() {
          console.log("MP sending Started at 2200")
          // Meteor.call('dayAheadMpAtTen');
          Meteor.call('dayAheadMpAtTenWithAvaiblityAndForcasting');
      }
  });
  SyncedCron.add({
      name: 'Rajasthan DA SLDC Report At 10:05 PM',
      schedule: function(parser) {
          return parser.text('at 10:05 pm');
      },
      job: function() {
          Meteor.call('SyncronCalledForRajasthanDayAheadSLDCeport');
      }
  });
  SyncedCron.add({
      name: 'Rajasthan DA Discom Report At 10:06 PM',
      schedule: function(parser) {
          return parser.text('at 10:06 pm');
      },
      job: function() {
          Meteor.call('SyncronCalledForRajasthanDayAheadRevisionDISCOMReport');
      }
  });
  SyncedCron.add({
      name: 'Gujarat SLDC Report At Five Fifty PM',
      schedule: function(parser) {
          return parser.text('at 05:50 pm');
      },
      job: function() {
          console.log("gujarat at 1750")
          Meteor.call('dayAheadGujaratAtSix');
      }
  });
  SyncedCron.add({
      name: 'Gujarat Discom Report At Five Fifty One',
      schedule: function(parser) {
          return parser.text('at 05:51 pm');
      },
      job: function() {
          console.log("gujarat at 1751")
          Meteor.call('dayAheadGujaratAtSixDiscom');
      }
  });
  SyncedCron.add({
      name: 'DISCOM & SLDC Report',
      schedule: function(parser) {
            return parser.recur().every(15).minute();
      },
      job: function() {
          Meteor.call('SyncronCalledDISCOMReportForAll');
          Meteor.call('gujaratSLDCReportMethodCalledBySyncron');
          Meteor.call('SyncronCalledMPSLDCReportMethod');
          Meteor.call('SyncronCalledRajasthanSLDCReportMethod');
      }
  });
}

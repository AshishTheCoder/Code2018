// Router.onBeforeAction(function() {
//     if (!Meteor.user() && !Meteor.loggingIn()) {
//         // this.render('login');
//         // this.stop();
//         this.redirect('/login');
//     } else {
//         // required by Iron to process the route handler
//         var userType = Meteor.user().profile.user_type;
//         var currentDate = new Date();
//         var dateFormat = moment(currentDate).format("DD-MM-YYYY");
//         LogDetails.insert({user_id:Meteor.userId(),user_name: Meteor.user().username,user_type:userType,url:this.url,log_type:this.url,text:'URL Called',action_date:dateFormat,timestamp:new Date()});
//         this.next();
//     }
// }, {
//     except: ['login', 'signup', 'forgot', 'update', '/app/login']
// });

Router.route('/update', {
        where: 'server'
    })
    .get(function() {
        spawn = Npm.require('child_process').spawn;

        console.log("Executing get");

        //command = spawn('git', ['pull', 'origin', 'master']);
        command = spawn('sh', ['/root/deploy.sh']);

        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });

        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        this.response.end('initiated');
    })
    .post(function() {
        spawn = Npm.require('child_process').spawn;

        console.log("Executing post");

        //command = spawn('git', ['pull', 'origin', 'master']);
        command = spawn('sh', ['/root/deploy.sh']);


        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });

        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        this.response.end('initiated');
    });

Router.configure({
    layoutTemplate: 'layout'
});
Router.route("/signup", function() {
    this.render('signup');
});
Router.route('/verify-email/:_token', function() {
    this.render('login', {
        data: {
            token: this.params._token
        }
    });
});
Router.route("/login", function() {
    this.render('login');
});
Router.route("/", function() {
    this.render('login');
});
Router.route("/forgot", function() {
    this.render('forgot');
});
Router.route('/logout', function() {
    var self = this;
    Meteor.logout(function(err) {
        if (err) {
            console.log('Error Logging out: ' + err);
        }
        SessionStore.clear();
        Router.go('/login');
    });
});


//---------------------- Admin Routes ----------------------//
Router.route("/users-profile", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        Meteor.subscribe('SchemesDetails');
        this.render('users_profile');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/admin-home", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        Meteor.subscribe('StuChargesDetails');
        Meteor.subscribe('ChangeCredentialDetails');
        Meteor.subscribe('UserList');
        this.render('realtime');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/discom-profile", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('discom');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/reports-menu", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('reports');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/daily-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('dailyReportSECIL');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/billing-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('billingReportSECIL');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/monthly-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('monthlyReportSECIL');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/admin-schedule-status", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('TimeBlockDetails');
        this.render('adminScheduleStatus');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/logbook-spd", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        Meteor.subscribe('SchemesDetails');
        this.render('logBook_spd');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/logbook-discom", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('logbook_discom');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/open-access", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('open_access');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/STU-charges", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('stuChargesDetails');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/export-excel", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType == 'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('exportExcelSLDCANDDiscom');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/invoice-charges", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('invoiceChargesDetails');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/sldc-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('sldc_report');
    }
});
Router.route("/generate-invoice", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('generateInvoice');
    }
});
Router.route("/gst/generate-invoice", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('generateInvoiceGSTFormat');
    }
});
Router.route("/payment-note", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('paymentNoteForSPDInvoice');
    }
});
Router.route("/view-payment-note", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('paymentNoteReport');
    }
});
Router.route("/payment-note-approval", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType == 'finance' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('sixLevelFilesInitialization');
    }
});
Router.route("/approved-payment-note", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType == 'finance' || userType ==  'commercial' || userType ==  'master') {
        this.render('sixLevelApprovedFiles');
    }
});
Router.route("/energy-invoice-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('energyInvoiceReport');
    }
});
Router.route("/log-filter", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        Meteor.subscribe('SchemesDetails');
        this.render('logFilter');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/transmission-log-filter", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('logFilterTransmissionInvoice');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/incentive-log-filter", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('logFilterIncentiveInvoice');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/sldc-log-filter", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('logFilterSLDCInvoice');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/spd-audit-trail", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('spdAuditTrail');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/upload-rrf", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('uploadRRF');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/view-rrf", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('viewRRFdata');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/mail-timing", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('mailTiming');
    }else{
        Router.go('/restricted-page');
    }
});
Router.route("/user-log-details", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('userLogDetails');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/spd-payment-advice", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('paymentAdviceBySECI');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/purchase-sale", function() {
    var userType = Meteor.user().profile.user_type;
  if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
      Meteor.subscribe('ShowRevisionsData');
      this.render('purchase_sale');
  } else {
      Router.go('/restricted-page');
  }
});
Router.route("/daily-actual-generation", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('daily_actual_Generation');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/update-data", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('serverFetch');
    } else {
        Router.go('/restricted-page');
    }
});

Router.route("/submit-rea", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('submitRea');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/logbook", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('logbook_menu');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/logbook/spd", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('logbook_menu_spd');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/logbook/stu-ctu", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'finance' || userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('logbook_menu_stuCtu');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/check-rrf", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('checkRRFdata');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/MP-monthly-revision", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('MP_monthly_revision');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/discom-log-filter", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        this.render('discomLogFilter');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/discom-log-filter-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        this.render('discomLogFilterReporting');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/spd-log-filter", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
      Meteor.subscribe('SchemesDetails');
        this.render('spdLogFilter');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/spd-log-filter-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('SchemesDetails');
        this.render('spdLogFilterReporting');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/invoice/transco-sheet-entry", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('transcotransmission');
    }
});
Router.route("/invoice/transco-sheet-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('transcoTransmissionReport');
    }
});
Router.route("/payment-reconciliation", function() {
    this.render('payment_reconciliation');
});
Router.route("/surcharge", function() {
    this.render('surcharge');
});

Router.route("/energy-surcharge-report", function() {
    this.render('viewEnergySurcharge');
});
Router.route("/invoice/upload-master-sheet", function() {
    this.render('uploadMasterSheet');
});

Router.route("/credit-debit-note", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('credit-debit-note');
    }
});
Router.route("/generateCreditDebit", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('generateCreditDebit');
    }
});



Router.route("/ticket-system", function() {
    this.render('ticketSystem');
});
Router.route("/rldc-comparision", function() {
    this.render('rldc_comparision');
});
Router.route("/jmr-data", function() {
        Meteor.subscribe('ShowRevisionsData');
        this.render('viewJMRData');
});
Router.route("/add-holidays", function() {
    Meteor.subscribe('SeciHolidaysPublish');
    this.render('addHolidaysList');
});
Router.route("/restricted-page", function() {
  this.render('restrictedPage');
});
Router.route("/search", function() {
  Meteor.subscribe('ModuleListsPublish');
  this.render('searchModules');
});
Router.route("/master-sheet", function() {
    this.render('masterSheet');
});

//---------------------- SPD Routes ----------------------//
Router.route("/about-us", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        this.render('aboutseci');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/schedule-submission", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            if (Meteor.user().profile.registration_form.transaction_type == 'Inter') {
                Meteor.subscribe('TimeBlockDetails');
                this.render('scheduleSubmission');
            } else {
                Router.go("/myprofile");
            }
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go('/restricted-page');
    }
});

Router.route("/change-credential", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            Meteor.subscribe('ChangeCredentialDetails');
            this.render('change_credential');
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go('/restricted-page');
    }
});

Router.route("/revisions", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd' && Meteor.user().profile.registration_form.transaction_type == 'Inter') {
        if (Meteor.user().profile.status == "approved") {
            Meteor.subscribe('TimeBlockDetails');
            this.render('revisions');
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go("/myprofile");
    }
});
Router.route("/spd-schedule-status", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            this.render('SpdScheduleStatus');
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/registration-form", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        this.render('secilRegistrationForm');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/myprofile", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            this.render('myprofile');
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/jmr", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            this.render('jmr');
        } else {
            Router.go('/restricted-page');
        }
    } else {
        Router.go('/restricted-page');
    }
});

Router.route("/daily-generation", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            this.render('actual_Generation');
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/generation-report", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            this.render('SpdActualGenerationReport');
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/view-payment-advice", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
        if (Meteor.user().profile.status == "approved") {
            this.render('viewPaymentAdviceToSPD');
        } else {
            Router.go('/about-us');
        }
    } else {
        Router.go('/restricted-page');
    }
});

//
// var moduleArr = [
//   {url:'/users-profile', name:'Users Profile', allowToaccess:'Seci Staff'},
//   {url:'/admin-home', name:'Dashboard', allowToaccess:'Seci Staff'},
//   {url:'/discom-profile', name:'Discom Profile', allowToaccess:'Seci Staff'},
//   {url:'/reports-menu', name:'Reports Menu', allowToaccess:'Seci Staff'},
//   {url:'/daily-report', name:'Daily Report', allowToaccess:'Seci Staff'},
//   {url:'/billing-report', name:'Billing Report', allowToaccess:'Seci Staff'},
//   {url:'/admin-schedule-status', name:'Schedules', allowToaccess:'Seci Staff'},
//   {url:'/monthly-report', name:'Schedules Monthly Report', allowToaccess:'Seci Staff'},
//   {url:'/admin-schedule-status', name:'Schedules', allowToaccess:'Seci Staff'},
//   {url:'/open-access', name:'Open Access', allowToaccess:'Seci Staff'},
//   {url:'/STU-charges', name:'STU Charges', allowToaccess:'Seci Staff'},
//   {url:'/export-excel', name:'Download Excel', allowToaccess:'Seci Staff'},
//   {url:'/invoice-charges', name:'Invoice Charges', allowToaccess:'Seci Staff'},
//   {url:'/sldc-report', name:'SLDC Report', allowToaccess:'Seci Staff'},
//   {url:'/generate-invoice', name:'Invoice', allowToaccess:'Seci Staff'},
//   {url:'/payment-note', name:'Payment Note', allowToaccess:'Seci Staff'},
//   {url:'/view-payment-note', name:'View Payment Note', allowToaccess:'Seci Staff'},
//   {url:'/payment-note-approval', name:'Six Level Approval', allowToaccess:'Seci Staff'},
//   {url:'/energy-invoice-report', name:'View Generated Invoices', allowToaccess:'Seci Staff'},
//   {url:'/logbook', name:'Log Book', allowToaccess:'Seci Staff'},
//   {url:'/logbook-spd', name:'SPD Log Book', allowToaccess:'Seci Staff'},
//   {url:'/logbook-discom', name:'Discom Log Book', allowToaccess:'Seci Staff'},
//   {url:'/log-filter', name:'Log Filter', allowToaccess:'Seci Staff'},
//   {url:'/transmission-log-filter', name:'Transmission Log Filter', allowToaccess:'Seci Staff'},
//   {url:'/sldc-log-filter', name:'SLDC Log Filter', allowToaccess:'Seci Staff'},
//   {url:'/incentive-log-filter', name:'Incentive Log Filter', allowToaccess:'Seci Staff'},
//   {url:'/spd-audit-trail', name:'SPD Audt Trail', allowToaccess:'Seci Staff'},
//   {url:'/upload-rrf', name:'Upload RRF', allowToaccess:'Seci Staff'},
//   {url:'/view-rrf', name:'View RRF', allowToaccess:'Seci Staff'},
//   {url:'/mail-timing', name:'Mail Timing', allowToaccess:'Seci Staff'},
//   {url:'/user-log-details', name:'User Log Details', allowToaccess:'Seci Staff'},
//   {url:'/spd-payment-advice', name:'Payment Advice', allowToaccess:'Seci Staff'},
//   {url:'/purchase-sale', name:'Purchase and Sale', allowToaccess:'Seci Staff'},
//   {url:'/daily-actual-generation', name:'Daily Actual Generation', allowToaccess:'Seci Staff'},
//   {url:'/update-data', name:'Fetch RLDC Data', allowToaccess:'Seci Staff'},
//   {url:'/submit-rea', name:'Submit REA', allowToaccess:'Seci Staff'},
//   {url:'/check-rrf', name:'Check RRF Data', allowToaccess:'Seci Staff'},
//   {url:'/MP-monthly-revision', name:'MP Monthly Revision Report', allowToaccess:'Seci Staff'},
//   {url:'/rldc-comparision', name:'RLDC Comparision Report', allowToaccess:'Seci Staff'},
//   {url:'/jmr-data', name:'View JMR/SEA/REA Data', allowToaccess:'Seci Staff'},
//   {url:'/add-holidays', name:'Holidays List', allowToaccess:'Seci Staff'},
//   {url:'/discom-log-filter', name:'Discom Log Filter', allowToaccess:'Seci Staff'},
//   {url:'/discom-log-filter-report', name:'Discom Log Filter Report', allowToaccess:'Seci Staff'},
//   {url:'/spd-log-filter', name:'SPD Log Filter', allowToaccess:'Seci Staff'},
//   {url:'/approved-payment-note', name:'Approved Payment Note Files', allowToaccess:'Seci Staff'},
//   {url:'/about-us', name:'About Us', allowToaccess:'spd'},
//   {url:'/schedule-submission', name:'Schedule Submission', allowToaccess:'spd'},
//   {url:'/change-credential', name:'Change Request', allowToaccess:'spd'},
//   {url:'/revisions', name:'Revision', allowToaccess:'spd'},
//   {url:'/spd-schedule-status', name:'Schedule Status', allowToaccess:'spd'},
//   {url:'/myprofile', name:'My Profile', allowToaccess:'spd'},
//   {url:'/daily-generation', name:'Daily Actual Generation', allowToaccess:'spd'},
//   {url:'/generation-report', name:'VIew Actual Generation Report', allowToaccess:'spd'},
//   {url:'/jmr', name:'JMR/SEA/REA', allowToaccess:'spd'},
//   {url:'/jmr-data', name:'VIew JMR/SEA/REA Data', allowToaccess:'spd'},
//   {url:'/add-holidays', name:'SECI Holidays List', allowToaccess:'spd'}
// ];

//------ Unused URl And Its Mudules------///
//?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????//

Router.route("/extra-charges", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('extra_charges');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/billing", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('seciBillingModule');
    } else {
        Router.go('/restricted-page');
    }
});
Router.route("/uiCharges1", function() {
    Meteor.subscribe("collapseData");
    this.render('uiCharges1');
});
Router.route("/ui-charges", function() {
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType ==  'commercial' || userType ==  'master') {
        Meteor.subscribe('ShowRevisionsData');
        this.render('uiChargesForm1');
    }
});
// payment advice-------//--- under testing
Router.route("/reciept", function() {
    this.render('reciept');
});
Router.route("/payment-advice", function() {
  this.render('credit_debit');
});


Router.route("/invoice", function() {
  this.render('invoice');
});

Router.route("/reports-requirement", function() {
    this.render('reportsRequirement');
});
Router.route("/schedule-mail", function() {
    this.render('schedule_mail');
});
Router.route("/defaulters-mail", function() {
    this.render('defaultersMail');
});
//------Six Level Approval------------//
Router.route("/PaymentAdviceFront", function() {
    this.render('PaymentAdviceFront');
});
Router.route("/ApplicationData", function() {
    if (Meteor.user().profile.role == 'Applicant'){
      if (userType == 'applicant1') {
        this.render('ApplicationData');
      }else{
        Router.go('/restricted-page');
      }

    }
});



// LOGIN API FOR APP USERS
Router.route('/app/login',{where: 'server'})
.post(function() {
  var response;
  var checkData = this.request.body;
  if (checkData.verifyString == "55a5s0342seci00010c06110seci94174c01ea03@660c5f!00000i44%454550s%4b204b5e4d4150secil202000$000%00O00000^00er00da") {
    var email = checkData.username;
    var password = checkData.password;
    if (email === 'admin' && password === 'password@123') {
      response = {
        "authentication":'success',
        'message':'Login Success!',
        'verified' : true
      }
    }else {
      response = {
        "authentication":'fail',
        'message':'Oops, incorrect username or password!',
        'verified' : false
      }
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(response));
  }else {
    this.response.end('Unauthorised user!');
  }
});

//----- Discom List -----//
Router.route('/app/discom/discomlist',{where: 'server'})
.post(function() {
  var response;
  var checkData = this.request.body;
  if (checkData.verifyString == "55a5s0342seci00010c06110seci94174c01ea03@660c5f!00000i44%454550s%4b204b5e4d4150secil202000$000%00O00000^00er00da") {
    var dataArr = [];
    Discom.find().map(function(doc) {
      dataArr.push({discomId:doc._id, discomName:doc.nameof_buyingutility, discomState:doc.discom_state});
    });
    var discomListArr = dataArr.sort(function(a, b) {
        var nA = a.discomState.toLowerCase();
        var nB = b.discomState.toLowerCase();
        if (nA < nB)
            return -1;
        else if (nA > nB)
            return 1;
        return 0;
    });
    response = {
      "data": discomListArr,
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(response));
  }else {
    this.response.end('Unauthorised user!');
  }
});

//----- Trading Marging Dashboard -----//
Router.route('/app/dashboard',{where: 'server'})
.post(function() {
  var response;
  var checkData = this.request.body;
  if (checkData.verifyString == "55a5s0342seci00010c06110seci94174c01ea03@660c5f!00000i44%454550s%4b204b5e4d4150secil202000$000%00O00000^00er00da") {
    var currentFinancialYear = getCurrentFinancialYear();
    var totalEnergy = 0;
    var totalAmountReceived = 0;
    var totalDueReceived = 0;
    MasterSheetEntry.find({financial_year:currentFinancialYear,delete_status:false}).map(function(doc) {
      totalEnergy += Number(doc.energy);
      totalAmountReceived += Number(doc.recev_amount);
    });
    var tradingMargin = Number((Number(totalAmountReceived)/5.5) * 0.05).toFixed(2);
    var json = {financialYear:currentFinancialYear ,totalEnergy:totalEnergy, tradingMargin: tradingMargin};
    response = {
      "data": json,
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(response));
  }else {
    this.response.end('Unauthorised user!');
  }
});
//----- Trading Marging Dashboard -----//
Router.route('/app/masterSheet/individualData',{where: 'server'})
.post(function() {
  var response;
  var checkData = this.request.body;
  if (checkData.verifyString == "55a5s0342seci00010c06110seci94174c01ea03@660c5f!00000i44%454550s%4b204b5e4d4150secil202000$000%00O00000^00er00da") {
    var month = checkData.month;
    var financialYear = checkData.financialYear;
    var discomId = checkData.discomId;
    var totalEnergy = 0;
    var totalAmountReceived = 0;
    var totalDueReceived = 0;
    // MasterSheetEntry.find({month:month, financial_year:financialYear, discomId: discomId, delete_status:false}).map(function(doc) {
    //   totalEnergy += Number(doc.energy);
    //   totalAmountReceived += Number(doc.recev_amount);
    //   totalAmountReceived += Number(doc.due_amount);
    // });
    var data = MasterSheetEntry.find({month:month, financial_year:financialYear, discomId: discomId, delete_status:false}).fetch();
    if (data.length > 0) {
      var json = data[0];
      var msg = 'Success';
    }else {
      var json = '';
      var msg = 'Data Not Found';
    }
    response = {
      "data": json,
       msg : msg
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(response));
  }else {
    this.response.end('Unauthorised user!');
  }
});



//----- Energy Payment Note & Invoice Payment Note Dashboard -----//
Router.route('/app/invoice',{where: 'server'})
.post(function() {
  var response;
  var checkData = this.request.body;
  if (checkData.verifyString == "55a5s0342seci00010c06110seci94174c01ea03@660c5f!00000i44%454550s%4b204b5e4d4150secil202000$000%00O00000^00er00da") {
    var reportType = checkData.reportType;
    var invoiceType = checkData.invoiceType;
    var month = checkData.month;
    var yearType = checkData.yearType;
    var returnDataArr = [];
    var msgVar = '';
    if (reportType == 'Invoice') {
      if (invoiceType == 'Energy') {
        var invoiceData = EnergyInvoiceDetails.find({month:month,financial_year:yearType, delete_status:false}).fetch();
      }else if (invoiceType == 'Transmission') {
        var invoiceData = TransmissionInvoiceDetails.find({month:month, financial_year:yearType, delete_status:false}).fetch();
      }else if (invoiceType == 'SLDC') {
        var invoiceData = SLDCInvoiceDetails.find({financial_year:yearType,delete_status:false}).fetch();
      }else if (invoiceType == 'Incentive') {
        var invoiceData = IncentiveChargesDetail.find({financial_year:yearType,delete_status:false}).fetch();
      }
      var n = 1;
      if (invoiceData.length > 0) {
        invoiceData.forEach(function(item) {
          var filePath = 'http://seci.cybuzz.sc/'+item.file_path;
          returnDataArr.push({sn : n, name:item.discom_name, type: item.typeOfInvoice, filePath : filePath});
          n++;
        })
        msgVar = 'Data Received!';
      }else {
        returnDataArr = [];
        msgVar = 'Data Not Found!';
      }
      response = {
        "data" : returnDataArr,
        "message":msgVar,
      }
    }else if (reportType == 'Payment Note') {
      if (invoiceType == 'Energy') {
        var energyPaymentNoteData = EnergyPaymentNoteDetails.find({month: month,year: yearType,delete_status: false}).fetch();
        var n = 1;
        energyPaymentNoteData.forEach(function(item) {
          var filePath = 'http://seci.cybuzz.sc/upload/'+item.file_path;
          returnDataArr.push({sn : n, name:item.nameOfEntity, type : item.type, filePath : filePath});
          n++;
        })
      }else if (invoiceType == 'Transmission') {
        var transmissionPaymentNoteData = TransmissionPaymentNoteDetails.find({month: month, year : yearType ,delete_status: false}).fetch();
        var n = 1;
        transmissionPaymentNoteData.forEach(function(item) {
          var filePath = 'http://seci.cybuzz.sc/upload/'+item.file_path;
          returnDataArr.push({sn : n, name:item.state, type : item.type, filePath : filePath});
          n++;
        })
      }else if (invoiceType == 'SLDC') {
        var sldcPaymentNoteData = SLDCPaymentNoteDetails.find({month: month,year: yearType,delete_status: false}).fetch();
        var n = 1;
        sldcPaymentNoteData.forEach(function(item) {
          var filePath = 'http://seci.cybuzz.sc/upload/'+item.file_path;
          returnDataArr.push({sn : n, name:item.state, type : item.type, filePath : filePath});
          n++;
        })
      }else if (invoiceType == 'Incentive') {
        var incentivePaymentNoteData = IncentivePaymentNoteDetails.find({year: yearType,delete_status: false}).fetch();
        var n = 1;
        incentivePaymentNoteData.forEach(function(item) {
          var filePath = 'http://seci.cybuzz.sc/upload/'+item.file_path;
          returnDataArr.push({sn : n, name:item.state, type : item.type, filePath : filePath});
          n++;
        })
      }else if (invoiceType == 'RLDC') {
        var rldcPaymentNoteData = RLDCPaymentNoteDetails.find({month: month,year: yearType,delete_status: false}).fetch();
        var n = 1;
        rldcPaymentNoteData.forEach(function(item) {
          var filePath = 'http://seci.cybuzz.sc/upload/'+item.file_path;
          returnDataArr.push({sn : n, name:item.state, type : item.type, filePath : filePath});
          n++;
        })
      }
      response = {
        "data" : returnDataArr,
        "message":'Data Received!',
      }
    }else {
      response = {
        "data" : 'invalid',
        "message":'Invalid Request!',
      }
    }
    this.response.setHeader('Content-Type','application/json');
    this.response.end(JSON.stringify(response));
  }else {
    this.response.end('Unauthorised user!');
  }
});

function sortFunction(a,b){
    var dateA = new Date(a.current_date_timestamp).getTime();
    var dateB = new Date(b.current_date_timestamp).getTime();
    return dateA < dateB ? 1 : -1;
};

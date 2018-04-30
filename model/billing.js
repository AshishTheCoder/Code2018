Meteor.methods({
    "usedForDiscomDetails": function() {
        var discomNameVar = Discom.find().fetch();
        return returnSuccess('Discom Data Found!', discomNameVar);
    },

    "billingUsedForCreditDebit": function() {

    //   var spddata = Meteor.users.find({'profile.status':'approved','profile.user_type':'spd'}).fetch();
    //   console.log(spddata.length);
    //   var excelbuilder = require('msexcel-builder');
    //   var workbook = excelbuilder.createWorkbook(process.env.PWD+'/', 'abcd.xlsx');
    //   var sheet1 = workbook.createSheet('sheet1', 100, 100);
    //   sheet1.set(1, 1, 'Sl. No.');
    //   sheet1.set(2, 1, 'Name of SPD');
    //   sheet1.set(3, 1, 'SPD State');
    //   sheet1.set(4, 1, 'Capacity(MW)');
    //   sheet1.set(5, 1, 'Registration Date & Time');
    //   var i = 1;
    //   spddata.forEach(function(item) {
    //     sheet1.set(1, i, i);
    //     sheet1.set(2, i, item.profile.registration_form.name_of_spd);
    //     sheet1.set(3, i,  item.profile.registration_form.spd_state);
    //     sheet1.set(4, i,  item.profile.registration_form.project_capicity);
    //     sheet1.set(5, i,  item.createdAt);
    //     i++;
    //   });
    //   workbook.save(function(ok){
    //   if (!ok)
    //     workbook.cancel();
    //   else
    //     console.log('congratulations, your workbook created');
    // });











      var spdData = [{sn:1,spd_nane:'Line(Medha, Rajani, ACME R, ACME G and ACME M)',total_energy:'9185688',rate:'5.50',amount:'50521284.00'},
                      {sn:2,spd_nane:'Northern Solaire Prakash Pvt. Ltd.',total_energy:'3396786',rate:'5.50',amount:'18682323.00'},
                      {sn:3,spd_nane:'Azure Green Tech Pvt.Ltd. & Azure Sunshine Pvt. Ltd.',total_energy:'8635716',rate:'5.50',amount:'47496438.00'},
                      {sn:4,spd_nane:'Suryauday Solaire Prakash Pvt. Ltd.',total_energy:'1860028',rate:'5.50',amount:'10230151.80'},
                      {sn:5,spd_nane:'SEI Suryalabh Pvt. Ltd.',total_energy:'5893200',rate:'5.50',amount:'32412600.00'},
                      {sn:6,spd_nane:'RDA Energy Pvt. Ltd.',total_energy:'1338696',rate:'5.50',amount:'7362828.00'}
            ];
      var discomData = [{sn:1, discom_nane:'TPDDL',total_energy:'3894326',rate:'5.50',amount:'21418793.00'},
                        {sn:2, discom_nane:'APDCL',total_energy:'3812123',rate:'5.50',amount:'20966677.10'},
                        {sn:3, discom_nane:'HPSEB',total_energy:'4045999',rate:'5.50',amount:'22252994.00'},
                        {sn:4, discom_nane:'BRPL',total_energy:'4001059',rate:'5.50',amount:'22005824.80'},
                        {sn:5, discom_nane:'BYPL',total_energy:'3942856',rate:'5.50',amount:'21685708.00'},
                        {sn:6, discom_nane:'HPPC',total_energy:'12924126',rate:'5.50',amount:'71082694.31'}
            ];
      var jaipurDiscom = {jaipur_percentage:'40',jaipur_energy:'5370411.027',jaipur_amount:'29537260.65'};
      var ajmerDiscom = {ajmer_percentage:'28',ajmer_energy:'3759287.719',ajmer_amount:'20676082.45'};
      var jodhpurDiscom = {jodhpur_percentage:'32',jodhpur_energy:'4296328.821',jodhpur_amount:'23629808.52'};
      // final json
        var json = {
            start_month: '01 June 2016',
            end_month: '31 June 2016',
            spdData: spdData,
            spd_total_energy_A: '57325300.06',
            spd_total_amount_A: '315289135.30',
            discomData:discomData,
            discom_total_energy_B: '43899273.06',
            discom_total_amount_B: '241446001.68',
            total_energy:'13426028',
            total_amount: '7384315162',
            jaipurDiscom:jaipurDiscom,
            ajmerDiscom:ajmerDiscom,
            jodhpurDiscom:jodhpurDiscom
        };
        console.log(json);


//         var Delhi(BRPL)_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ11'
//             report_type: 'discom_report',
//             discom_state: 'Delhi(BRPL)',
//             spd_state: 'Rajasthan',
//             email_ids: ['sanjay.srivastav@relianceada.com', 'System.Operation@relianceada.com', 'Satinder.Sondhi@relianceada.com', 'dtldata@gmail.com','dtldata@rediffmail.com','dtldata@yahoo.co.in']
//         };
//         var Delhi(BYPL)_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ12'
//             report_type: 'discom_report',
//             discom_state: 'Delhi(BYPL)',
//             spd_state: 'Rajasthan',
//             email_ids: ['dtldata@yahoo.co.in', 'shekhar.saklani@relianceada.com', 'sunil.kakkar@relianceada.com', 'dtldata@gmail.com','dtldata@rediffmail.com']
//         };
//         var Delhi(TPDDL)_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ13'
//             report_type: 'discom_report',
//             discom_state: 'Delhi(TPDDL)',
//             spd_state: 'Rajasthan',
//             email_ids: ['uttam.kumar@tatapower-ddl.com', 'mithun.chakraborty@tatapower-ddl.com', 'Power.Manager@tatapower-ddl.com', 'dtldata@gmail.com','dtldata@rediffmail.com','dtldata@yahoo.co.in']
//         };
//         var Haryana_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ14'
//             report_type: 'discom_report',
//             discom_state: 'Haryana',
//             spd_state: 'Rajasthan',
//             email_ids: ['ucrpanchkula@gmail.com', 'crsosldc@gmail.com', 'openaccessharyana@gmail.com', 'cehppc@gmail.com','XENSTP@gmail.com','XENLTP2HPPC@gmail.com','seemasidana69@gmail.com']
//         };
//         var Odisha_Gujarat = {
//             _id:'2Rh33EFsoNeeraJ15'
//             report_type: 'discom_report',
//             discom_state: 'Odisha',
//             spd_state: 'Gujarat',
//             email_ids: ['sldcgridco@yahoo.com', 'srgmppgridco@yahoo.com', 'gridco.trading.cell@gmail.com', 'system_support@rediffmail.com','dircommercial@yahoo.com']
//         };
//         var Odisha_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ16'
//             report_type: 'discom_report',
//             discom_state: 'Odisha',
//             spd_state: 'Rajasthan',
//             email_ids: ['sldcgridco@yahoo.com', 'srgmppgridco@yahoo.com', 'gridco.trading.cell@gmail.com', 'system_support@rediffmail.com','dircommercial@yahoo.com']
//         };
//         var Maharashtra_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ17'
//             report_type: 'discom_report',
//             discom_state: 'Maharashtra',
//             spd_state: 'Rajasthan',
//             email_ids: ['scheduling@mahasldc.in', 'cesldc@mahasldc.in']
//         };
//         var Maharashtra_MP = {
//             _id:'2Rh33EFsoNeeraJ18'
//             report_type: 'discom_report',
//             discom_state: 'Maharashtra',
//             spd_state: 'MP',
//             email_ids: ['cesldc@mahasldc.in', 'scheduling@mahasldc.in']
//         };
//         var Jharkhand_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ19'
//             report_type: 'discom_report',
//             discom_state: 'Jharkhand',
//             spd_state: 'Rajasthan',
//             email_ids: ['sldcranchi@gmail.com', 'coml.rev@rediffmail.com']
//         };
//         var Assam_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ20'
//             report_type: 'discom_report',
//             discom_state: 'Assam',
//             spd_state: 'Rajasthan',
//             email_ids: ['acecomt.aseb@rediffmail.com', 'sldcaseb@rediffmail.com']
//         };
//         var Punjab_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ21'
//             report_type: 'discom_report',
//             discom_state: 'Punjab',
//             spd_state: 'Rajasthan',
//             email_ids: ['pcpatiala@gmail.com', 'pcpseb@gmail.com']
//         };
//         var Chhattisgarh_MP = {
//             _id:'2Rh33EFsoNeeraJ22'
//             report_type: 'discom_report',
//             discom_state: 'Chhattisgarh',
//             spd_state: 'MP',
//             email_ids: ['csebsldc@gmail.com', 'satish1362@gmail.com','CECOMCSEB@rediffmail.com','mukherjeegopalchandra@yahoo.com']
//         };
//         var Goa_MP = {
//             _id:'2Rh33EFsoNeeraJ23'
//             report_type: 'discom_report',
//             discom_state: 'Goa',
//             spd_state: 'MP',
//             email_ids: ['220kvged@gmail.com', 'cee-elec.goa@nic.in','se2north@gmail.com','aeipm@yahoo.com','ee3-elec.goa@nic.in']
//         };
//         var Bihar_MP = {
//             _id:'2Rh33EFsoNeeraJ24'
//             report_type: 'discom_report',
//             discom_state: 'Bihar',
//             spd_state: 'MP',
//             email_ids: ['rakesh.bseb@gmail.com', 'sldc.bseb@yahoo.com','bseb.sldc@gmail.com','sldc.bseb@gmail.com']
//         };
//         var HimachalPradesh_Rajasthan = {
//             _id:'2Rh33EFsoNeeraJ25'
//             report_type: 'discom_report',
//             discom_state: 'Himachal Pradesh',
//             spd_state: 'Rajasthan',
//             email_ids: ['ceso@hpseb.com', 'pcshimla2003@gmail.com']
//         };
//
//
//
// //-------------_SLDC -------------
//
//           var MPSLDC = {
//               _id:'3Rhe3RFsNeeraJ222'
//               report_type: 'sldc_report',
//               sldc_state: 'MP',
//               email_ids: ['sldcmpjbp@gmail.com', 'controlroom.tradeco@gmail.com' , 'control.room@mppmcl.com']
//           };
//           var GUJARATSLDC = {
//               _id:'3Rh33RFsNeeraJ111'
//               report_type: 'sldc_report',
//               sldc_state: 'Gujarat',
//               email_ids: ['sldc.getco@gmail.com', 'schedulesldc@gmail.com' , 'impl.sldc@gmail.com', 'sldcgridco@yahoo.com', 'srgmppgridco@yahoo.com', 'gridco.trading.cell@gmail.com', 'system_support@rediffmail.com', 'dircommercial@yahoo.com']
//           };
//           var RAJASTHANSLDC = {
//               _id:'3Rhde5FsNeeraJ332'
//               report_type: 'sldc_report',
//               sldc_state: 'Rajasthan',
//               email_ids: ['se.ldrvpnl@gmail.com', 'ldrvpnl@gmail.com' , 'ldshutdown@gmail.com', 'rppcsm@gmail.com', 'rppc_sm@yahoo.co.in', 'rppc_sm@yahoo.com', 'ldrvpnl@yahoo.co.in', 'ldrvpnl@yahoo.com','ldshutdown@yahoo.com']
//           };
//
// //-------------_Regional Real -------------
//
//
//             var ERLDC_MP_BIHAR = {
//                 _id:'3Rhedf6sNeeraJ442'
//                 report_type: 'regionl_area',
//                 discom_state: 'Bihar',
//                 spd_state: 'MP',
//                 email_ids: ['erldc.cal@gmail.com' , 'erldcoa@gmail.com']
//             };
//
//-------------_Regional Real -------------
              //
              // var MPRevision = {
              //     _id:'3wd2dfsNeeraJ442'
              //     report_type: 'revision',
              //     discom_state: 'Bihar',
              //     spd_state: 'MP',
              //     email_ids: ['sldcmpjbp@gmail.com' , 'controlroom.tradeco@gmail.com', 'control.room@mppmcl.com', 'remcjbp@gmail.com', 'remcjbp@yahoo.com']
              // };

    }
});

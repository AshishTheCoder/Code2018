import {
  ReactiveVar
} from 'meteor/reactive-var';

Template.transcotransmission.onCreated(function abc() {
  this.discomScheme = new ReactiveVar;
  this.discomName = new ReactiveVar;
  this.monthTypeSelected = new ReactiveVar;
  this.YearTypeSelected = new ReactiveVar;
  this.DiscomSchemeSelected = new ReactiveVar;
  this.DiscomSelected = new ReactiveVar;
  this.StuCtuType = new ReactiveVar;
  this.StuCtuInfo = new ReactiveVar();
  this.socMoc = new ReactiveVar();
  this.valueSocMoc = new ReactiveVar();
  this.TransmissionAndGujarat = new ReactiveVar();
  this.TransmissionAndMP = new ReactiveVar();
  this.TransmissionAndRajasthan = new ReactiveVar();
  this.IncentiveAndRajasthan = new ReactiveVar();
  this.SLDCAndRajasthan = new ReactiveVar();
});

Template.transcotransmission.onRendered(function abc() {
  $("#transcotransmission").validate({
    rules: {
      month: {
        required: true
      },
      financial_year: {
        required: true
      },
      scheme: {
        required: true
      },
      discom_state: {
        required: true
      },
      stu_ctu: {
        required: true
      },
      stu_transaction_type: {
        required: true
      },
      stu_invoiceNum: {
        required: true
      },
      stu_invoiceDate: {
        required: true
      },
      stu_dueDate: {
        required: true
      },
      stu_amountRaised: {
        required: true,
        number: true
      },
      soc_moc_state: {
        required: true,
      },
    },
    messages: {
      month: {
        required: "Please select month"
      },
      financial_year: {
        required: "Please select year"
      },
      scheme: {
        required: "Please select scheme"
      },
      discom_state: {
        required: "Please select discom"
      },
      stu_ctu: {
        required: "Please select stu/ctu type"
      },
      stu_transaction_type: {
        required: "Please select transaction type"
      },
      stu_invoiceNum: {
        required: "Please enter invoice number"
      },
      stu_invoiceDate: {
        required: "Please select invoice date"
      },
      stu_dueDate: {
        required: "Please select due date"
      },
      stu_amountRaised: {
        required: "Please enter amount",
        number: "Please enter only number"
      },
      soc_moc_state: {
        required: "Please select state",
      },
    }
  });
   $('#saveTranscoSheet').hide();
});

Template.transcotransmission.events({
  "submit form#transcotransmission": function(e) {
    e.preventDefault();
    var month = $('#month').val();
    var financial_year = $('#financial_year').val();
    var scheme = $('#scheme').val();
    var stu_ctu = $('#stu_ctu').val();
    var stu_transaction_type = $('#stu_transaction_type').val();
    // var checkData = instance.checkGeneratedCreditDebitNote.get();
       if(stu_transaction_type=="SOC" || stu_transaction_type=="MOC"){
    var stu_invoiceNum = $('#stu_invoiceNum').val();
    var stu_invoiceDate = $('#stu_invoiceDate').val();
    var stu_dueDate = $('#stu_dueDate').val();
    var stu_amountRaised = $('#stu_amountRaised').val();
    var stu_remarks = $('#stu_remarks').val();
    var soc_moc_state =$('#soc_moc_state').val();
    var json = {
      month:month,
      financial_year:financial_year,
      scheme:scheme,
      stu_ctu:stu_ctu,
      stu_transaction_type:stu_transaction_type,
      soc_moc_state:soc_moc_state,
      stu_invoiceDate:stu_invoiceDate,
      invoiceNumber:stu_invoiceNum,
      stu_dueDate:stu_dueDate,
      stu_amountRaised:stu_amountRaised,
      stu_remarks:stu_remarks,
    };
    if(soc_moc_state != '' && stu_invoiceNum != '' && stu_invoiceDate != '' && stu_dueDate != '' && stu_amountRaised != '' && stu_remarks != ''){
      console.log(json);
      // if (Number(checkData) > 0) {
      //   swal({
      //       title: "Are you sure?",
      //       text: "It is already generated, Do you want to generate it again ?",
      //       type: "warning",
      //       showCancelButton: true,
      //       confirmButtonColor: "#55dd6b",
      //       confirmButtonText: "Yes, generate it!",
      //       closeOnConfirm: false
      //   }, function(isConfirm) {
      //       if (isConfirm) {
      //         Meteor.call('SaveTranscoSheet',json, function(error, result){
      //           if (error) {
      //               swal('Please try again!');
      //           }else {
      //             if(result.status){
      //               swal("Success!", "Transcosheet Successfully Updated", "success");
      //             }
      //           }
      //         });
      //       } else {
      //           // if user do not want to generate
      //       }
      //   });
      // }else {
        Meteor.call('SaveTranscoSheet',json, function(error, result){
          if (error) {
              swal('Please try again!');
          }else {
              swal("Success!", "Transco Sheet Successfully Saved", "success");
          }
        });
      // }
    }else{
      swal("All fields are required!");
    }
  }else if(stu_ctu=="GETCO"){
    var raisedDate = $('.raisedDate').val();
    var receivedDate = $('.recievedDate').val();
    var invoiceNumber = [];
    $('.invoiceNumber').each(function() {
        if ($(this).val()) {
            invoiceNumber.push($(this).val());
        } else {
            swal("All fields Required");
            throw new Error("All fields Required!");
        }
    });
    var invoiceAmount = [];
    $('.invoiceAmount').each(function() {
        if ($(this).val()) {
          if ($(this).val().match(/^[0-9]*\.?[0-9]*$/)) {
              invoiceAmount.push($(this).val());
          }else{
            swal("Enter only digits in Amount fields");
            throw new Error("Use only digits!");
          }
        } else {
            swal("All fields Required");
            throw new Error("All fields Required!");
        }
    });
    var invoiceDate = [];
    $('.invoiceDate').each(function() {
        if ($(this).val()) {
            invoiceDate.push($(this).val());
        } else {
            swal("All fields Required");
            throw new Error("All fields Required!");
        }
    });
    var dueDate = [];
    $('.dueDate').each(function() {
        if ($(this).val()) {
            dueDate.push($(this).val());
        } else {
            swal("All fields Required");
            throw new Error("All fields Required!");
        }
    });
    var json = {
      month:month,
      financial_year:financial_year,
      scheme:scheme,
      stu_ctu:stu_ctu,
      stu_transaction_type:stu_transaction_type,
      raisedDate:raisedDate,
      receivedDate:receivedDate,
      invoiceNumber:invoiceNumber,
      invoiceAmount:invoiceAmount,
      invoiceDate:invoiceDate,
      dueDate:dueDate,
    };
    if(month != '' && financial_year != '' && raisedDate != '' && receivedDate != ''){
      console.log(json);
      Meteor.call('SaveTranscoSheet',json, function(error, result){
        if (error) {
            swal('Please try again!');
        }else {
            swal("Success!", "Transco Sheet Successfully Saved", "success");
        }
      });
    }else{
      swal("All fields are required!");
    }
  }else if(stu_ctu=="MPPTCL"){
    var txtEncloserDate = $('#txtEncloserDateMP').val();
    var txtbillNumber = $('.txtbillNumber').val();
    var txtbillDate = $('.txtbillDate').val();
    var txtperiodFrom = $('.txtperiodFrom').val();
    var txtperiodTo = $('.txtperiodTo').val();
    var txtCapacity = $('.txtCapacity').val();
    var txtDueDate = $('.txtDueDate').val();
    var txtTotalAmount = $('.txtTotalAmount').val();
    var invoiceRaisedDateTC = $('.invoiceRaisedDateTC').val();
    var transPeriod = txtperiodFrom+"-"+txtperiodTo;
    if (txtTotalAmount.match(/^[0-9]*\.?[0-9]*$/)) {

    }else{
      swal("Enter only digits in Amount field");
      throw new Error("Use only digits!");
    }
    if (txtCapacity.match(/^[0-9]*\.?[0-9]*$/)) {

    }else{
      swal("Enter only digits in Capicity field");
      throw new Error("Use only digits!");
    }
    var json = {
      month:month,
      financial_year:financial_year,
      scheme:scheme,
      stu_ctu:stu_ctu,
      stu_transaction_type:stu_transaction_type,
      invoiceRaisedDateTC:invoiceRaisedDateTC,
      txtperiodFrom:txtperiodFrom,
      txtperiodTo:txtperiodTo,
      encloserDate : txtEncloserDate,
      billNumber:txtbillNumber,
      billDate:txtbillDate,
      transPeriod:transPeriod,
      capacity:txtCapacity,
      dueDate:txtDueDate,
      totalAmount:txtTotalAmount,
      generatedDate:moment().format('DD-MM-YYYY'),
      delete_status: false,
      initialisedForApproval: false,
      sixLevelStatus:'',
      timestamp: new Date()
    };
    if(month != '' && financial_year != '' && scheme != '' && stu_ctu != '' && stu_transaction_type!= ''&& invoiceRaisedDateTC != '' && txtEncloserDate != '' && txtbillNumber != '' && txtbillDate != '' && txtperiodFrom != '' && txtperiodTo != '' && txtCapacity != '' && txtDueDate != '' && txtTotalAmount != ''){
     console.log(json);
     Meteor.call('SaveTranscoSheet',json, function(error, result){
       if (error) {
           swal('Please try again!');
       }else {
           swal("Success!", "Transco Sheet Successfully Saved", "success");
       }
     });
    }else{
      swal("All fields are required!")
    }
    }else if(stu_ctu=="RVPN"){
    if(stu_transaction_type=='Incentive'){
      var capacityArr = [];
      var countCapacity = 0;
      var serialNumber = [];
      var serial = 1;
      $('.txtCapacity').each(function() {
          var match = $(this).val();
          if (match.match(/^[0-9]*\.?[0-9]*$/)) {
              countCapacity += Number($(this).val());
              capacityArr.push(Number($(this).val()));
          } else {
              swal("Enter only digits in Capacity fields");
              throw new Error("Use only digits!");
          }
          serialNumber.push(serial);
          serial++;
      })
      serialNumber.push('Total');
      capacityArr.push(countCapacity.toFixed(2));
      var countbyRVPN = 0;
      var raisedByRVPN = [];
      $('.txtRaisedByRVPN').each(function() {
          var match = $(this).val();
          if (match.match(/^[0-9]*\.?[0-9]*$/)) {
              countbyRVPN += Number($(this).val());
              raisedByRVPN.push(Number($(this).val()));
          } else {
              swal("Enter only digits in Amount(Rs) Raised by RVPN");
              throw new Error("Use only digits!");
          }
      })
      raisedByRVPN.push(countbyRVPN.toFixed(2));

      var countbySECI = 0;
      var raisedBySeciArr = [];
      $('.txtRaisedBySeci').each(function() {
          var match = $(this).val();
          if (match.match(/^[0-9]*\.?[0-9]*$/)) {
              countbySECI += Number($(this).val());
              raisedBySeciArr.push(Number($(this).val()));
          } else {
              swal("Enter only digits in Amount(Rs) to be raised by SECI");
              throw new Error("Use only digits!");
          }
      });
      raisedBySeciArr.push(countbySECI.toFixed(2));

      var difference = [];
      for (var i = 0; i < raisedByRVPN.length; i++) {
          var value = Number(raisedByRVPN[i]) - Number(raisedBySeciArr[i]);
          difference.push(value.toFixed(2));
      }

      var remarksArr = [];
      $('.txtRemarks').each(function() {
          if ($(this).val()) {
              remarksArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      remarksArr.push(' ');

      var json = {
        month:month,
        financial_year:financial_year,
        scheme:scheme,
        stu_ctu:stu_ctu,
        stu_transaction_type:stu_transaction_type,
        countbyRVPN:countbyRVPN,
        countbySECI:countbySECI,
        serialNumber:serialNumber,
        capacity:capacityArr,
        total_capacity:countCapacity,
        byRVPN:raisedByRVPN,
        bySECI:raisedBySeciArr,
        difference:difference,
        total_difference:value,
        remarks:remarksArr,
        generatedDate:moment().format('DD-MM-YYYY'),
        delete_status: false,
        initialisedForApproval: false,
        sixLevelStatus:'',
        timestamp: new Date()
      };
      if(month != '' && financial_year != '' && scheme != '' && stu_transaction_type != ''){
        console.log(json);
        Meteor.call('SaveTranscoSheet',json, function(error, result){
          if (error) {
              swal('Please try again!');
          }else {
              swal("Success!", "Transco Sheet Successfully Saved", "success");
          }
        });
      }else {
          swal("All fields are required!");
        }
    }else if(stu_transaction_type=='SLDC'){
      var billNumberArr = [];
      $('.txtbillNumber').each(function() {
          if ($(this).val()) {
              billNumberArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var billDateArr = [];
      $('.txtbillDate').each(function() {
          if ($(this).val()) {
              billDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodFromArr = [];
      $('.txtperiodFrom').each(function() {
          if ($(this).val()) {
              periodFromArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodToArr = [];
      $('.txtperiodTo').each(function() {
          if ($(this).val()) {
              periodToArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var sldcPeriod = [];
      for (var i = 0; i < periodFromArr.length; i++) {
          sldcPeriod.push(periodFromArr[i] + ' - ' + periodToArr[i]);
      }
      var capacityArr = [];
      $('.txtCapacity').each(function() {
          if ($(this).val()) {
            if ($(this).val().match(/^[0-9]*\.?[0-9]*$/)) {
                capacityArr.push($(this).val());
            }else{
              swal("Enter only digits in Capacity fields");
              throw new Error("Use only digits!");
            }
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var dueDateArr = [];
      $('.txtDueDate').each(function() {
          if ($(this).val()) {
              dueDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var random = Math.floor((Math.random() * 10000) + 1).toString();
      var invoiceRaisedDate = $('.invoiceRaisedDateSLDC').val();
      var invoiceRecievedDate = $('.invoiceRecievedDateSLDC').val();
      var json = {
        random:random,
        month:month,
        financial_year:financial_year,
        scheme:scheme,
        stu_ctu:stu_ctu,
        stu_transaction_type:stu_transaction_type,
        periodFromArr:periodFromArr,
        periodToArr:periodToArr,
        invoiceRaisedDate:invoiceRaisedDate,
        invoiceRecievedDate:invoiceRecievedDate,
        billNumber:billNumberArr,
        billDate:billDateArr,
        sldcPeriod:sldcPeriod,
        capacity:capacityArr,
        dueDate:dueDateArr,
        generatedDate:moment().format('DD-MM-YYYY'),
        delete_status: false,
        initialisedForApproval: false,
        sixLevelStatus:'',
        timestamp: new Date()
      };
      if(month != '' && financial_year != '' && scheme != '' && stu_ctu != '' && stu_transaction_type != '' && invoiceRaisedDate != '' && invoiceRecievedDate != ''){
        console.log(json);
        Meteor.call('SaveTranscoSheet',json, function(error, result){
          if (error) {
              swal('Please try again!');
          }else {
              swal("Success!", "Transco Sheet Successfully Saved", "success");
          }
        });
      }else{
        swal("All fields are required!");
      }
    }else if(stu_transaction_type=='Transmission'){
      var billNumberArr = [];
      $('.txtbillNumber').each(function() {
          if ($(this).val()) {
              billNumberArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var billDateArr = [];
      $('.txtbillDate').each(function() {
          if ($(this).val()) {
              billDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodFromArr = [];
      $('.txtperiodFrom').each(function() {
          if ($(this).val()) {
              periodFromArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var periodToArr = [];
      $('.txtperiodTo').each(function() {
          if ($(this).val()) {
              periodToArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var transPeriod = [];
      for (var i = 0; i < periodFromArr.length; i++) {
          transPeriod.push(periodFromArr[i] + ' - ' + periodToArr[i]);
      }

      var capacityArr = [];
      $('.txtCapacity').each(function() {
          if ($(this).val()) {
            if ($(this).val().match(/^[0-9]*\.?[0-9]*$/)) {
                capacityArr.push($(this).val());
            }else{
              swal("Enter only digits in Capacity fields");
              throw new Error("Use only digits!");
            }
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var dueDateArr = [];
      $('.txtDueDate').each(function() {
          if ($(this).val()) {
              dueDateArr.push($(this).val());
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });

      var totalAmountArr = [];
      $('.txtTotalAmount').each(function() {
          if ($(this).val()) {
            if ($(this).val().match(/^[0-9]*\.?[0-9]*$/)) {
                totalAmountArr.push($(this).val());
            }else{
              swal("Enter only digits in Amount fields");
              throw new Error("Use only digits!");
            }
          } else {
              swal("All fields Required");
              throw new Error("All fields Required!");
          }
      });
      var raisedDate = $('.invoiceRaisedDateTC').val();
      var receivedDate = $('.recievedDate').val();
      var json = {
        month:month,
        financial_year:financial_year,
        scheme:scheme,
        stu_ctu:stu_ctu,
        stu_transaction_type:stu_transaction_type,
        invoiceRaisedDateTC:raisedDate,
        invoiceReceivedDateTC:receivedDate,
        billNumber:billNumberArr,
        billDate:billDateArr,
        periodFromArr:periodFromArr,
        periodToArr:periodToArr,
        transPeriod:transPeriod,
        capacity:capacityArr,
        dueDate:dueDateArr,
        totalAmount:totalAmountArr,
        generatedDate:moment().format('DD-MM-YYYY'),
        delete_status: false,
        initialisedForApproval: false,
        sixLevelStatus:'',
        timestamp: new Date()
      };
      if(month != '' && financial_year != '' && stu_ctu != '' && stu_transaction_type != '' && raisedDate != '' && receivedDate != ''){
       console.log(json);
       Meteor.call('SaveTranscoSheet',json, function(error, result){
         if (error) {
             swal('Please try again!');
         }else {
             swal("Success!", "Transco Sheet Successfully Saved", "success");
         }
       });
    }else{
      swal("All fields are required!");
    }
  }
    // var json = '{';
    // $(" #transcotransmission input.form-control, #transcotransmission select.form-control").each(function(value, element) {
    //   json += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
    // });
    // json = $.parseJSON(json.replace(/,\s*$/, '') + '}');
    // json.discomId = $("#discom_state option:selected").attr("attr");
    // json.schemeId = $("#scheme option:selected").attr("attr");
    // Meteor.call('SaveTranscoSheet', json, function(error, result) {
    //   if (error) {
    //     swal("Oops...", "Please try again!", "error");
    //   } else {
    //     if(result.status){
    //       if (result.data == 1) {
    //         swal({
    //           title: "Are you sure?",
    //           text: "Data is already submitted for this month, Do you want to update!",
    //           type: "warning",
    //           showCancelButton: true,
    //           confirmButtonColor: "#55dd6b",
    //           confirmButtonText: "Yes, update it!",
    //           closeOnConfirm: false
    //         }, function(isConfirm) {
    //           if (isConfirm) {
    //             Meteor.call('UpdateTranscoSheet', json, function(error, result) {
    //               if (error) {
    //                 swal("Oops...", "Please try again!", "error");
    //               } else {
    //                 swal('Data successfully Updated!');
    //                 instance.DiscomSelected.set(false);
    //               }
    //             });
    //           } else {
    //
    //           }
    //         });
    //       } else {
    //         swal("Data Successfully Submitted!");
    //         instance.DiscomSelected.set(false);
    //       }
    //     }else {
    //       swal(result.message);
    //     }
    //   }
    // });
  }
},
    'focus .datepicker' () {
        $('.datepicker').datepicker({format: 'dd-mm-yyyy', autoclose: true})
    },
  'focus #stu_invoiceDate' () {
    $('#stu_invoiceDate').datepicker({
      format: 'dd-mm-yyyy',
      startDate: '01-01-2016',
      // endDate: '0d',
      autoclose: true
    })
  },
  'focus #stu_dueDate' () {
    $('#stu_dueDate').datepicker({
      format: 'dd-mm-yyyy',
      startDate: '01-01-2016',
      // endDate: '+1y',
      autoclose: true
    })
  },
  'change #month' (e, instance) {
    e.preventDefault();
    var month = $(e.currentTarget).val();
    instance.DiscomSchemeSelected.set();
    instance.YearTypeSelected.set();
    instance.StuCtuInfo.set();
    instance.socMoc.set();
    instance.DiscomSelected.set();
    instance.valueSocMoc.set();
    instance.IncentiveAndRajasthan.set();
    instance.TransmissionAndGujarat.set();
    instance.TransmissionAndMP.set();
    instance.TransmissionAndRajasthan.set();
    instance.SLDCAndRajasthan.set();
    if (month != '') {
      instance.monthTypeSelected.set(true);
      $('#financial_year').val('');
    } else {
      instance.monthTypeSelected.set();
    }
    $('#saveTranscoSheet').hide();
  },
  'change #financial_year' (e, instance) {
    e.preventDefault();
    instance.YearTypeSelected.set();
    instance.DiscomSchemeSelected.set();
    instance.StuCtuInfo.set();
    instance.DiscomSelected.set();
    instance.socMoc.set();
    instance.valueSocMoc.set();
    instance.IncentiveAndRajasthan.set();
    instance.TransmissionAndGujarat.set();
    instance.TransmissionAndMP.set();
    instance.TransmissionAndRajasthan.set();
    instance.SLDCAndRajasthan.set();
    var financialYearArr = $(e.currentTarget).val();
    if (financialYearArr != '') {
      instance.YearTypeSelected.set(true);
      $('#scheme').val('');
      Meteor.call('getDiscomScheme', function(error, result) {
        if (error) {
          swal("Oops...", "Please try again!", "error");
        } else {
          if (result.status) {
            instance.discomScheme.set(result.data);
          }
        }
      });
    } else {
      instance.discomScheme.set();
    }
    $('#saveTranscoSheet').hide();
  },
  'change #stu_ctu' (e, instance) {
    e.preventDefault();
    var type = $(e.currentTarget).find(':selected').attr('attrType');
    instance.valueSocMoc.set();
    instance.socMoc.set();
    instance.IncentiveAndRajasthan.set();
    instance.TransmissionAndGujarat.set();
    instance.TransmissionAndMP.set();
    instance.TransmissionAndRajasthan.set();
    instance.SLDCAndRajasthan.set();
    $('#stu_transaction_type').val('');
    if (type != '') {
      instance.socMoc.set("socmoc");
      instance.StuCtuType.set(type);
    } else {
      instance.socMoc.set("socmoc");
      instance.StuCtuType.set();
    }
    $('#saveTranscoSheet').hide();
  },
  'change #stu_transaction_type' (e, instance) {
    e.preventDefault();
    var stu_transaction_type = $(e.currentTarget).val();
    var stu_ctu_tye=$('#stu_ctu').val();
    console.log(stu_ctu_tye);
    console.log(stu_transaction_type);
    instance.IncentiveAndRajasthan.set();
    instance.TransmissionAndGujarat.set();
    instance.TransmissionAndMP.set();
    instance.TransmissionAndRajasthan.set();
    instance.SLDCAndRajasthan.set();
    if (stu_transaction_type != '') {
      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      if(stu_transaction_type=="SOC" || stu_transaction_type=="MOC"){
        console.log("pppppppppppppppppp");
        instance.valueSocMoc.set("valueSocMoc");
      }else if(stu_transaction_type=="Transmission" && stu_ctu_tye=="GETCO"){
        console.log("000000000000");
        instance.TransmissionAndGujarat.set("transmissionandgujarat");
      }else if(stu_transaction_type=="Transmission" && stu_ctu_tye=="MPPTCL"){
        instance.TransmissionAndMP.set("transmissionandmp");
      }else if(stu_transaction_type=="Transmission" && stu_ctu_tye=="RVPN"){
        instance.TransmissionAndRajasthan.set("transmissionandraj");
      }else if(stu_transaction_type=="Incentive" && stu_ctu_tye=="RVPN"){
        instance.IncentiveAndRajasthan.set("incentiveandraj");
      }else if(stu_transaction_type=="SLDC" && stu_ctu_tye=="RVPN"){
        instance.SLDCAndRajasthan.set("sldcandrajasthan");
      }
      $('#saveTranscoSheet').show();
    }else{
      instance.valueSocMoc.set()
      instance.TransmissionAndGujarat.set();
      instance.TransmissionAndMP.set();
      instance.TransmissionAndRajasthan.set();
      instance.IncentiveAndRajasthan.set();
      instance.SLDCAndRajasthan.set();
      $('#saveTranscoSheet').hide();
    }
  },
  'change #scheme' (e, instance) {
    e.preventDefault();
    $('#stu_ctu').val('');
    instance.StuCtuInfo.set();
    instance.valueSocMoc.set()
    instance.TransmissionAndGujarat.set();
    instance.TransmissionAndMP.set();
    instance.TransmissionAndRajasthan.set();
    instance.IncentiveAndRajasthan.set();
    var scheme = $(e.currentTarget).val();
    instance.socMoc.set();
    instance.valueSocMoc.set();
    if($(scheme!='')){
    instance.StuCtuInfo.set("stuctu");
  }else{
    instance.StuCtuInfo.set();
  }
  $('#saveTranscoSheet').hide();
    // instance.DiscomSchemeSelected.set();
    // instance.DiscomSelected.set();
    // var discomScheme = $(e.currentTarget).val();
    // if (discomScheme != '') {
    //   Meteor.call('getDiscom', discomScheme, function(error, result) {
    //     instance.DiscomSchemeSelected.set(true);
    //     if (error) {
    //       swal("Oops...", "Please try again!", "error");
    //     } else {
    //       if (result.status) {
    //         instance.discomName.set(result.data);
    //       }
    //     }
    //   });
    // } else {
    //   instance.discomName.set();
    // }
  }
});

Template.transcotransmission.helpers({
  monthShow() {
    return monthReturn();
  },
  yearHelper() {
    return dynamicFinancialYear();
  },
  discomSchemeArr() {
    if (Template.instance().discomScheme.get()) {
      return Template.instance().discomScheme.get();
    } else {
      return false;
    }
  },
  discomListArr() {
    if (Template.instance().discomName.get()) {
      return Template.instance().discomName.get();
    } else {
      return false;
    }
  },
  ifMonthTypeSelected() {
    if (Template.instance().monthTypeSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifYearTypeSelected() {
    if (Template.instance().YearTypeSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifDiscomSchemeSelected() {
    if (Template.instance().DiscomSchemeSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifDiscomSelected() {
    if (Template.instance().DiscomSelected.get()) {
      return true;
    } else {
      return false;
    }
  },
  stuType() {
    if (Template.instance().StuCtuType.get() == 'STU') {
      return true;
    } else {
      return false;
    }
  },
  ctuType() {
    if (Template.instance().StuCtuType.get() == 'CTU') {
      return true;
    } else {
      return false;
    }
  },
  stuRajasthan() {
    if (Template.instance().StuCtuType.get() == 'Rajasthan') {
      return true;
    } else {
      return false;
    }
  },
  ifStuCtuInfo(){
    if (Template.instance().StuCtuInfo.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifsocMoc(){
    if (Template.instance().socMoc.get()) {
      return true;
    } else {
      return false;
    }
  },
  ifvalueSocMoc(){
    if (Template.instance().valueSocMoc.get()) {
      return true;
    } else {
      return false;
    }
  },
  loopAry(){
    var dd = [1,2,3,4,5];
    return dd;
  },
  loopArrSLDC(){
    var dd = [1,2,3,4,5];
    return dd;
  },
  loopArrIncentive(){
    var dd = [1,2,3,4];
    return dd;
  },
  TransmissionAndGujarat(){
    if (Template.instance().TransmissionAndGujarat.get()) {
      return true;
    } else {
      return false;
    }
  },
  TransmissionAndMP(){
    if (Template.instance().TransmissionAndMP.get()) {
      return true;
    } else {
      return false;
    }
  },
  TransmissionAndRajasthan(){
    if (Template.instance().TransmissionAndRajasthan.get()) {
      return true;
    } else {
      return false;
    }
  },
  IncentiveAndRajasthan(){
    if (Template.instance().IncentiveAndRajasthan.get()) {
      return true;
    } else {
      return false;
    }
  },
  SLDCAndRajasthan(){
    if (Template.instance().SLDCAndRajasthan.get()) {
      return true;
    } else {
      return false;
    }
  }
});

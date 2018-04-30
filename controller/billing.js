import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.seciBillingModule.onCreated(function billingForSECI() {
    this.radioValue = new ReactiveVar;
    this.discomState = new ReactiveVar;
});
Template.seciBillingModule.rendered = function() {
SessionStore.set("isLoading",false);
};

Template.seciBillingModule.events({
    "change #inlineRadioForBill": function(e, t) {
        var instance = Template.instance();
        instance.radioValue.set($(e.currentTarget).val());


        // //msg for all discom
        // var message ="Please find attached the schedule for 30-Sept-2016";
        // // subject for all discom
        // var subject1 = "Schedule for 30.09.2016 MP-Bihar ( Gen : Focal Renewable Energy Two)";
        // var subject2 = "Schedule for 30.09.2016 MP-Goa (Gen : IL&FS)";
        // var subject3 = "Schedule for 30.09.2016 MP-Maharashtra ( Gen : IL&FS)";
        // var subject4 = "Schedule for 30.09.2016 MP-Chattisgarh (Gen :Waaneep and Focal Energy Solar One)";
        //
        // var subject5 = "Schedule for 30.09.2016 Raj-Jharkhand ( Gen : Laxmi Diamond Pvt. Ltd.)";
        // var subject6 = "Schedule for 30.09.2016 Raj-Maharashtra ( Gen : Today Green Energy Pvt. Ltd)";
        // var subject7 = "Schedule for 30.09.2016 Raj-BYPL ( Gen : Acme Mumbai Power Pvt. Ltd.)";
        // var subject8 = "Schedule for 30.09.2016 Raj-BRPL ( Gen : Acme Gurgaon Power)";
        // var subject9 = "Schedule for 30.09.2016 Raj-Himachal ( Gen : Acme Rajdhani Power Pvt. Ltd.)";
        // var subject10 = "Schedule for 30.09.2016 Raj-Odisha ( Gen : Suryauday Solaire Prakash Private Limited)";
        // var subject11 = "Schedule for 30.09.2016 Raj-HPPC ( Gen : Northern, Azure Green, Azure Sunshine)";
        // var subject12 = "Schedule for 30.09.2016 RAJ-ASSAM (Gen: Ranji Solar Energy Pvt. Ltd.)";
        // var subject13 = "Schedule for 30.09.2016 RAJ-DELHI (TPDDL) (Gen: Medha Energy Pvt. Ltd.)";
        // var subject14 = "SOLAR Schedule for 30.09.2016 Raj-PUNJAB ( Gen : TODAY GREEN ENERGY)";
        // var subject15 = "Schedule for 27.09.2016 GUJ - ODISHA (Gen: GPCL, GSECL, BACKBONE ENTERPRISE, ENERSAN POWER LTD)";
        //
        //
        //
        //
        //
        //
        //
        //
        // var revisionSubjectVarA1 = "REVISION No.-02 SOLAR SCHEDULE from IL&FS to MAHARASTRA & GOA DT:- 26.09.2016";
        // var msgA1 = "1. The change in revision is more than +/-2% with the last one.";
        // var msgA2 = "2. Revision is from  61-96 BLOCKS IN (GEN: IL&FS) to MAHARASHTRA & GOA.";
        // var msgA3 = "3. THERE WILL BE NO REVISION IN TIME BLOCK 58-64 FOR GENERATOR IL&FS.";
        //
        // var revisionSubjectVarC1 = "REVISION No.-03 SOLAR SCHEDULE from WAANEEP TO CHATTISGARH DT:- 30.09.2016";
        // var msgC1 = "1. The change in revision is more than +/-2% with the last one.";
        // var msgC2 = "2. Revision is from 50-73 BLOCKS IN (GEN: WAANEEP) to CHATTISGARH.";
        // var msgC3 = "3 THERE WILL BE NO REVISION IN TIME BLOCK 45-50 FOR GENERATOR WAANEEP.";
        //
        // var revisionSubjectVarD1 = "REVISION No.-01 SOLAR SCHEDULE from FOCAL TWO TO BIHAR DT:- 30.09.2016";
        // var msgD1 = "1. The change in revision is more than +/-2% with the last one.";
        // var msgD2 = "2. Revision is from 28-96 BLOCKS IN (GEN: FOCAL TWO) to BIHAR.";
        // var msgD3 = "3 THERE WILL BE NO REVISION IN TIME BLOCK 27-32 FOR GENERATOR FOCAL TWO.";















    },
    //----------------- Event Used For Credit/Debit Note --------------------//
    "change #ddlDisomStateCreditDebit": function(e, t) {
        var instance = Template.instance();
        $('#ddlTransactionTypeCreditDebit').val('');
        $('#ddlMonthCreditDebit').val('');
        $('#ddlYearCreditDebit').val('');
        var data = $(e.currentTarget).val();
        // console.log(data);
        // instance.radioValue.set($(e.currentTarget).val());
    },
    "change #ddlTransactionTypeCreditDebit": function(e, t) {
        var instance = Template.instance();
        $('#ddlMonthCreditDebit').val('');
        $('#ddlYearCreditDebit').val('');
        var data = $(e.currentTarget).val();
        // console.log(data);
        // instance.radioValue.set($(e.currentTarget).val());
    },
    "change #ddlMonthCreditDebit": function(e, t) {
        var instance = Template.instance();
        $('#ddlYearCreditDebit').val('');
        var data = $(e.currentTarget).val();
        // console.log(data);
        // instance.radioValue.set($(e.currentTarget).val());
    },
    "change #ddlYearCreditDebit": function(e, t) {
        var instance = Template.instance();
        var data1 = $('#ddlDisomStateCreditDebit').val();
        var data2 = $('#ddlTransactionTypeCreditDebit').val();
        var data3 = $('#ddlMonthCreditDebit').val();
        var data4 = $(e.currentTarget).val();
        Meteor.call("billingUsedForCreditDebit", function(error, result) {
            if (error) {
                swal('Please try again!')
            } else {
                if (result.status) {
                  console.log(result.data);
                }
            }
        });
        // instance.radioValue.set($(e.currentTarget).val());
    }
});

Template.seciBillingModule.helpers({
    isProvisionSeletedByRadio: function() {
        if (Template.instance().radioValue.get() == 'provision_invoice') {
            return true;
        } else {
            return false;
        }
    },
    isCreditDebitNoteSeletedByRadio: function() {
        if (Template.instance().radioValue.get() == 'credit_debit_note') {
            return true;
        } else {
            return false;
        }
    },
    dataForDiscomNameHelper: function() {
        var returnData = Template.instance().discomState.get();
        if (returnData) {
            return returnData;
        } else {
            return false;
        }
    },
});

import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.monthlyReportSECIL.onCreated(function abcd() {
    this.ddlReportForAdminVar = new ReactiveVar('');
    this.ddlMonthlyYearlyVar = new ReactiveVar('');
    this.monthSelectedVar = new ReactiveVar('');
    this.ddlSelectYearVar = new ReactiveVar('');
    this.userList = new ReactiveVar('');
    this.totalIndividualMonthlyDataVar = new ReactiveVar('');
    this.totalIndividualYearlyDataVar = new ReactiveVar('');
    this.userListOfDiscom = new ReactiveVar('');
    this.gettingSPDNamesFromDiscom = new ReactiveVar('');
    this.totalIndividualMonthlyDiscomReportVar = new ReactiveVar('');
    this.totalIndividualMonthlyDiscomReportForAllVar = new ReactiveVar('');
    this.showOrissaInterState = new ReactiveVar(false);
    this.isMaharshtraDiscomSelected = new ReactiveVar(false);
    this.YearlyIndividualReportByDiscom = new ReactiveVar('');
    this.totalIndividualYearlyDiscomReportForAllVar = new ReactiveVar('');
    this.isSLDCMonthlyReportAvailable = new ReactiveVar('');
    this.isSLDCYearlyReportAvailable = new ReactiveVar('');
    this.selectedSLDCState = new ReactiveVar('');
    this.isStateSelectedForSLDCYearly = new ReactiveVar('');
});
Template.monthlyReportSECIL.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.monthlyReportSECIL.events({
    "change #ddlReportForAdmin": function(e, t) {
        var instance = Template.instance();
        $("#ddlMonthlyYearly").val('');
        $("#ddlSelectMonth").val('');
        $("#ddlSelectYear").val('');
        $("#ddlSelectSPDList").val('');
        $("#ddlDiscomState").val('');
        $('#ddlSLDCSelectMonth').val('');
        $('#ddlSLDCSelectMonthly').val('');
        $('#ddlSLDCState').val('');
        $('#ddlSLDCSelectYearly').val('');
        $('#ddlSLDCStateYearly').val('');
        instance.ddlMonthlyYearlyVar.set('');
        instance.monthSelectedVar.set('');
        instance.ddlSelectYearVar.set('');
        instance.userList.set('');
        instance.totalIndividualMonthlyDataVar.set('');
        instance.totalIndividualYearlyDataVar.set('');
        instance.gettingSPDNamesFromDiscom.set('');
        instance.totalIndividualMonthlyDiscomReportVar.set('');
        instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
        instance.YearlyIndividualReportByDiscom.set('');
        instance.isSLDCMonthlyReportAvailable.set('');
        instance.isSLDCYearlyReportAvailable.set('');
        instance.showOrissaInterState.set(false);
        instance.isMaharshtraDiscomSelected.set(false);
        instance.totalIndividualYearlyDiscomReportForAllVar.set('');
        instance.selectedSLDCState.set('');
        instance.isStateSelectedForSLDCYearly.set('');
        var reportTypeVar = $(e.currentTarget).val();
        instance.ddlReportForAdminVar.set(reportTypeVar);
        if(reportTypeVar == 'SPD'){
          Meteor.call("gettingSPDListForMonthlyYearlyReport", function(error, result) {
              if (error) {
                SessionStore.set("isLoading",false);
                swal("Oops...", "Please try again!", "error");
              } else {
                  if (result.status) {
                      var jsonGot = result.data;
                      // sorting SPD Name, Alphabetically in array
                      var ar = jsonGot.sort(function(a, b)
                        {
                          var nA = a.profile.registration_form.name_of_spd.toLowerCase();
                          var nB = b.profile.registration_form.name_of_spd.toLowerCase();
                          if(nA < nB)
                            return -1;
                          else if(nA > nB)
                            return 1;
                         return 0;
                        });
                      instance.userList.set(ar);
                      SessionStore.set("isLoading",false);
                  }
              }
          });
        }else if(reportTypeVar == 'DISCOM'){
          Meteor.call("gettingDISCOMListForMonthlyYearlyReport", function(error, result) {
              if (error) {
                SessionStore.set("isLoading",false);
                swal("Oops...", "Please try again!", "error");
              } else {
                  if (result.status) {
                      var jsonGot = result.data;
                      // sorting SPD Name, Alphabetically in array
                      var ar = jsonGot.sort(function(a, b)
                        {
                          var nA = a.discom_state.toLowerCase();
                          var nB = b.discom_state.toLowerCase();
                          if(nA < nB)
                            return -1;
                          else if(nA > nB)
                            return 1;
                         return 0;
                        });
                      instance.userListOfDiscom.set(ar);
                      SessionStore.set("isLoading",false);
                  }
              }
          });
        }
    },
    "change #ddlMonthlyYearly": function(e, t) {
        var instance = Template.instance();
        $("#ddlSelectMonth").val('');
        $("#ddlSelectYear").val('');
        $("#ddlSelectSPDList").val('');
        $("#ddlDiscomState").val('');
        //discom data
        $("#ddlSelectYearForDiscom").val('');
        $("#ddlDiscomState").val('');
        $("#ddlSPDListByDiscom").val('');
        //sldc data
        $('#ddlSLDCSelectMonth').val('');
        $('#ddlSLDCSelectMonthly').val('');
        $('#ddlSLDCState').val('');
        $('#ddlSLDCSelectYearly').val('');
        $('#ddlSLDCStateYearly').val('');
        instance.monthSelectedVar.set('');
        instance.ddlSelectYearVar.set('');
        instance.totalIndividualMonthlyDataVar.set('');
        instance.totalIndividualYearlyDataVar.set('');
        instance.gettingSPDNamesFromDiscom.set('');
        instance.totalIndividualMonthlyDiscomReportVar.set('');
        instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
        instance.YearlyIndividualReportByDiscom.set('');
        instance.showOrissaInterState.set(false);
        instance.isMaharshtraDiscomSelected.set(false);
        instance.totalIndividualYearlyDiscomReportForAllVar.set('');
        instance.isSLDCMonthlyReportAvailable.set('');
        instance.isSLDCYearlyReportAvailable.set('');
        instance.selectedSLDCState.set('');
        instance.isStateSelectedForSLDCYearly.set('');
        var typeVar = $(e.currentTarget).val();
        instance.ddlMonthlyYearlyVar.set(typeVar);
    },
    "change #ddlSelectMonth": function(e, t) {
        var instance = Template.instance();
        $("#ddlSelectYear").val('');
        $("#ddlSelectSPDList").val('');
        instance.ddlSelectYearVar.set('');
        instance.totalIndividualMonthlyDataVar.set('');
        var ddlSelectMonthVar = $(e.currentTarget).val();
        instance.monthSelectedVar.set(ddlSelectMonthVar);
    },
    "change #ddlSelectYear": function(e, t) {
        var instance = Template.instance();
        $("#ddlSelectSPDList").val('');
        instance.totalIndividualMonthlyDataVar.set('');
        instance.totalIndividualYearlyDataVar.set('');
        var ddlSelectYear = $(e.currentTarget).val();
        instance.ddlSelectYearVar.set(ddlSelectYear);
    },
    "change #ddlSelectSPDList": function(e, t) {
        var instance = Template.instance();
        instance.totalIndividualMonthlyDataVar.set('');
        instance.totalIndividualYearlyDataVar.set('');
        var spdid =   $('#ddlSelectSPDList').val();
        var spdName =  $("#ddlSelectSPDList").find(':selected').attr("attrName");
        var spdState =  $("#ddlSelectSPDList").find(':selected').attr("attrState");
        var reportType = $('#ddlReportForAdmin').val();
        var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
        var selectedMonth = $('#ddlSelectMonth').val();
        var selectedYear = $('#ddlSelectYear').val();
        if(monthlyORyearlyVar == 'Monthly'){
          if(reportType != '' && monthlyORyearlyVar != '' && selectedMonth != '' && selectedYear != '' && spdid != ''){
            Meteor.call("getMonthlyReportForInvidualSPD",spdid,selectedMonth,selectedYear, function(error, result){
              if(error){
                swal("Oops...", "Please try again!", "error");
              }else{
                if(result.status){
                  instance.totalIndividualMonthlyDataVar.set(result.data);
                }
              }
            });
          }else{
            swal('All fields are required!');
          }
        }else if(monthlyORyearlyVar == 'Yearly'){
          if(reportType != '' && monthlyORyearlyVar != '' && selectedYear != '' && spdid != ''){
            SessionStore.set("isLoading",true);
            Meteor.call("getYearlyReportForInvidualSPD",spdid,selectedYear, function(error, result){
              if(error){
                SessionStore.set("isLoading",false);
                swal("Oops...", "Please try again!", "error");
              }else{
                if(result.status){
                  SessionStore.set("isLoading",false);
                  instance.totalIndividualYearlyDataVar.set(result.data);
                }
              }
            });
          }else{
            SessionStore.set("isLoading",false);
            swal('All fields are required!');
          }
        }
    },
    "change #ddlSelectMonthForDiscom": function(e, t) {
        var instance = Template.instance();
        $("#ddlSelectYearForDiscom").val('');
        $("#ddlDiscomState").val('');
        $("#ddlSPDListByDiscom").val('');
        instance.totalIndividualMonthlyDiscomReportVar.set('');
        instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
        instance.showOrissaInterState.set(false);
        instance.isMaharshtraDiscomSelected.set(false);
    },
    "change #ddlSelectYearForDiscom": function(e, t) {
        var instance = Template.instance();
        $("#ddlDiscomState").val('');
        $("#ddlSPDListByDiscom").val('');
        instance.totalIndividualMonthlyDiscomReportVar.set('');
        instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
        instance.YearlyIndividualReportByDiscom.set('');
        instance.totalIndividualYearlyDiscomReportForAllVar.set('');
        instance.showOrissaInterState.set(false);
        instance.isMaharshtraDiscomSelected.set(false);
    },
    "change #ddlDiscomState": function(){
      var instance = Template.instance();
      var discomId = $("#ddlDiscomState").val();
      instance.gettingSPDNamesFromDiscom.set('');
      instance.totalIndividualMonthlyDiscomReportVar.set('');
      instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
      instance.YearlyIndividualReportByDiscom.set('');
      instance.totalIndividualYearlyDiscomReportForAllVar.set('');
      instance.showOrissaInterState.set(false);
      instance.isMaharshtraDiscomSelected.set(false);
      if(discomId != ''){
        SessionStore.set("isLoading",true);
        Meteor.call("getSPDNamesOntheBasisOfDiscom",discomId, function(error, result){
          if(error){
            SessionStore.set("isLoading",false);
            swal("Oops...", "Please try again!", "error");
          }else{
            if(result.status){
              SessionStore.set("isLoading",false);
              instance.gettingSPDNamesFromDiscom.set(result.data);
            }
          }
        });
      }
    },
    "change #ddlSPDListByDiscom": function(){
      var instance = Template.instance();
      $('#ddlOdishaSelected').val('');
      $('#ddlMaharshtraSelected').val('');
      var reportType = $('#ddlReportForAdmin').val();
      var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
      var monthVar  = $("#ddlSelectMonthForDiscom").val();
      var YearVar  = $("#ddlSelectYearForDiscom").val();
      var discomId  = $("#ddlDiscomState").val();
      var sdpId  = $("#ddlSPDListByDiscom").val();
      var discomState =  $("#ddlDiscomState").find(':selected').attr("attrState");
      instance.totalIndividualMonthlyDiscomReportVar.set('');
      instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
      instance.YearlyIndividualReportByDiscom.set('');
      instance.totalIndividualYearlyDiscomReportForAllVar.set('');
       if(discomState == 'Odisha' && sdpId == 'All'){
       instance.showOrissaInterState.set(true);
       instance.isMaharshtraDiscomSelected.set(false);
     }else if(discomState == 'Maharashtra'&& sdpId == 'All'){
       instance.showOrissaInterState.set(false);
       instance.isMaharshtraDiscomSelected.set(true);
     }else{
       instance.showOrissaInterState.set(false);
       instance.isMaharshtraDiscomSelected.set(false);
      if(monthlyORyearlyVar == 'Monthly'){
        if(reportType != '' && monthlyORyearlyVar != '' && monthVar != '' && YearVar != '' && sdpId != '' && discomId != ''){
          SessionStore.set("isLoading",true);
          Meteor.call("getMonthlyReportForInvidualSPDByDiscom",sdpId,monthVar,YearVar,discomId,'discomState','spdState', function(error, result){
            if(error){
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
            }else{
              if(result.status){
                SessionStore.set("isLoading",false);
                if(sdpId != 'All'){
                  instance.totalIndividualMonthlyDiscomReportVar.set(result.data);
                }else{
                  instance.totalIndividualMonthlyDiscomReportForAllVar.set(result.data);
                }

              }
            }
          });
        }else{
          SessionStore.set("isLoading",false);
          swal('All fields are required!');
        }
      }else if(monthlyORyearlyVar == 'Yearly'){
          if(reportType != '' && monthlyORyearlyVar != '' && YearVar != '' && sdpId != '' && discomId != ''){
            SessionStore.set("isLoading",true);
            Meteor.call("getYearlyReportForInvidualSPDByDiscom",sdpId,YearVar,discomId,discomState,'selectedState', function(error, result){
              if(error){
                SessionStore.set("isLoading",false);
                swal("Oops...", "Please try again!", "error");
              }else{
                if(result.status){
                  SessionStore.set("isLoading",false);
                  if(sdpId != 'All'){
                    instance.YearlyIndividualReportByDiscom.set(result.data);
                  }else{
                    instance.totalIndividualYearlyDiscomReportForAllVar.set(result.data);
                  }
                }
              }
            });
          }else{
            SessionStore.set("isLoading",false);
            swal('All fields are required!');
          }
      }
     }
    },
    "change #ddlOdishaSelected": function(e){
      var instance = Template.instance();
      var reportType = $('#ddlReportForAdmin').val();
      var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
      var monthVar  = $("#ddlSelectMonthForDiscom").val();
      var YearVar  = $("#ddlSelectYearForDiscom").val();
      var discomId  = $("#ddlDiscomState").val();
      var sdpId  = $("#ddlSPDListByDiscom").val();
      var discomState =  $("#ddlDiscomState").find(':selected').attr("attrState");
      var selectedState = $(e.currentTarget).val();
      instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
      instance.totalIndividualYearlyDiscomReportForAllVar.set('');
      if(monthlyORyearlyVar == 'Monthly'){
        if(reportType != '' && monthlyORyearlyVar != '' && monthVar != '' && YearVar != '' && sdpId != '' && discomId != '' && selectedState != ''){
          SessionStore.set("isLoading",true);
          Meteor.call("getMonthlyReportForInvidualSPDByDiscom",sdpId,monthVar,YearVar,discomId,discomState,selectedState, function(error, result){
            if(error){
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
            }else{
              if(result.status){
                  SessionStore.set("isLoading",false);
                  instance.totalIndividualMonthlyDiscomReportForAllVar.set(result.data);
              }
            }
          });
        }else{
          SessionStore.set("isLoading",false);
          swal('All fields are required!');
        }
      }else if(monthlyORyearlyVar == 'Yearly'){
        if(reportType != '' && monthlyORyearlyVar != '' && YearVar != '' && sdpId != '' && discomId != '' && selectedState != ''){
          SessionStore.set("isLoading",true);
          Meteor.call("getYearlyReportForInvidualSPDByDiscom",sdpId,YearVar,discomId,discomState,selectedState, function(error, result){
            if(error){
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
            }else{
              if(result.status){
                SessionStore.set("isLoading",false);
                instance.totalIndividualYearlyDiscomReportForAllVar.set(result.data);
              }
            }
          });
        }else{
          SessionStore.set("isLoading",false);
          swal('All fields are required!');
        }
      }
    },
    "change #ddlMaharshtraSelected": function(e){
      var instance = Template.instance();
      var reportType = $('#ddlReportForAdmin').val();
      var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
      var monthVar  = $("#ddlSelectMonthForDiscom").val();
      var YearVar  = $("#ddlSelectYearForDiscom").val();
      var discomId  = $("#ddlDiscomState").val();
      var sdpId  = $("#ddlSPDListByDiscom").val();
      var discomState =  $("#ddlDiscomState").find(':selected').attr("attrState");
      var selectedState = $(e.currentTarget).val();
      instance.totalIndividualMonthlyDiscomReportForAllVar.set('');
      instance.totalIndividualYearlyDiscomReportForAllVar.set('');
      if(monthlyORyearlyVar == 'Monthly'){
        if(reportType != '' && monthlyORyearlyVar != '' && monthVar != '' && YearVar != '' && sdpId != '' && discomId != '' && selectedState != ''){
          SessionStore.set("isLoading",true);
          Meteor.call("getMonthlyReportForInvidualSPDByDiscom",sdpId,monthVar,YearVar,discomId,discomState,selectedState, function(error, result){
            if(error){
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
            }else{
              if(result.status){
                SessionStore.set("isLoading",false);
                instance.totalIndividualMonthlyDiscomReportForAllVar.set(result.data);
              }
            }
          });
        }else{
          SessionStore.set("isLoading",false);
          swal('All fields are required!');
        }

      }else if(monthlyORyearlyVar == 'Yearly'){
        if(reportType != '' && monthlyORyearlyVar != '' && YearVar != '' && sdpId != '' && discomId != '' && selectedState != ''){
          SessionStore.set("isLoading",true);
          Meteor.call("getYearlyReportForInvidualSPDByDiscom",sdpId,YearVar,discomId,discomState,selectedState, function(error, result){
            if(error){
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
            }else{
              if(result.status){
                SessionStore.set("isLoading",false);
                instance.totalIndividualYearlyDiscomReportForAllVar.set(result.data);
              }
            }
          });
        }else{
          SessionStore.set("isLoading",false);
          swal('All fields are required!');
        }
      }
    },
    "change #ddlSLDCSelectMonth": function(e, instance){
      $('#ddlSLDCSelectMonthly').val('');
      $('#ddlSLDCState').val('');
      instance.isSLDCMonthlyReportAvailable.set('');
    },
    "change #ddlSLDCSelectMonthly": function(e, instance){
      instance.selectedSLDCState.set('');
      $('#ddlSLDCState').val('');
      instance.isSLDCMonthlyReportAvailable.set('');
    },
    "change #ddlSLDCState": function(e, instance){
        instance.isSLDCMonthlyReportAvailable.set('');
        var ddlSLDCState = $(e.currentTarget).val();
        instance.selectedSLDCState.set(ddlSLDCState);
        var reportType = $('#ddlReportForAdmin').val();
        var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
        var ddlSelectedYear = $('#ddlSLDCSelectMonthly').val();
        var ddlSelectedMonth = $('#ddlSLDCSelectMonth').val();
        if(reportType != '' && monthlyORyearlyVar != '' && ddlSLDCState != '' && ddlSelectedMonth != '' && ddlSelectedYear != ''){
          SessionStore.set("isLoading",true);
          Meteor.call("getMonthlySLDCReport",reportType,monthlyORyearlyVar,ddlSLDCState,ddlSelectedMonth,ddlSelectedYear, function(error, result){
            if(error){
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
            }else{
              if(result.status){
                SessionStore.set("isLoading",false);
                instance.isSLDCMonthlyReportAvailable.set(result.data);
              }
            }
          });
        }else{
          SessionStore.set("isLoading",false);
          swal("All fields are required!");
        }
    },
    "change #ddlSLDCSelectYearly": function(e, instance){
      var sldcYearVar = $(e.currentTarget).val();
      $('#ddlSLDCStateYearly').val('');
      instance.isSLDCYearlyReportAvailable.set('');
      instance.isStateSelectedForSLDCYearly.set('');
    },
    "change #ddlSLDCStateYearly": function(e, instance){
      instance.isStateSelectedForSLDCYearly.set('');
      instance.isSLDCYearlyReportAvailable.set('');
      var sldcStateVar = $(e.currentTarget).val();
      var reportType = $('#ddlReportForAdmin').val();
      var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
      var ddlSelectedYear = $('#ddlSLDCSelectYearly').val();
      if(sldcStateVar != '' && reportType != '' && monthlyORyearlyVar != '' && ddlSelectedYear != ''){
        SessionStore.set("isLoading",true);
        Meteor.call("getYearlySLDCReport",reportType,monthlyORyearlyVar,ddlSelectedYear,sldcStateVar, function(error, result){
          if(error){
            SessionStore.set("isLoading",false);
            swal("Oops...", "Please try again!", "error");
          }else{
            if(result.status){
              SessionStore.set("isLoading",false);
              instance.isSLDCYearlyReportAvailable.set(result.data);
              instance.isStateSelectedForSLDCYearly.set(sldcStateVar);
            }
          }
        });
      }else{
        SessionStore.set("isLoading",false);
        swal("All fields are required!");
      }
    },
    "click #BtnExportSPDReport": function(e, instance) {
      var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
      if(monthlyORyearlyVar == 'Yearly'){
        var stateVar =  $("#ddlSelectSPDList").find(':selected').attr("attrName");
        var ddlSelectedYear = $('#ddlSelectYear').val();
      }else{
        var stateVar =  $("#ddlSelectSPDList").find(':selected').attr("attrName");
        var monthVar = $('#ddlSelectMonth').val();
        var YearVar = $('#ddlSelectYear').val();
        var ddlSelectedYear = monthVar+'_'+YearVar;
      }
      tableToExcel('exportSPDReport', 'SHEET1',stateVar,ddlSelectedYear);
    },
    "click #BtnExportDISCOMYearlyReport": function(e, instance) {
      var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
      if(monthlyORyearlyVar == 'Yearly'){
        var discomStateVar =  $("#ddlDiscomState").find(':selected').attr("attrState");
        var ddlSelectedYear = $('#ddlSelectYearForDiscom').val();
        var sdpId  = $("#ddlSPDListByDiscom").val();
        if(discomStateVar == 'Odisha' && sdpId == 'All'){
          var spdSateVar = $('#ddlOdishaSelected').val();
          var stateVar =  spdSateVar+'_'+discomStateVar;
        }else if(discomStateVar == 'Maharashtra' && sdpId == 'All'){
          var spdSateVar = $('#ddlMaharshtraSelected').val();
          var stateVar =  spdSateVar+'_'+discomStateVar;
        }else{
          var stateVar =  $("#ddlDiscomState").find(':selected').attr("attrState");
        }
      }
      else{
        var discomStateVar =  $("#ddlDiscomState").find(':selected').attr("attrState");
        var YearVar = $('#ddlSelectYearForDiscom').val();
        var ddlSelectedMonth = $('#ddlSelectMonthForDiscom').val();
        var ddlSelectedYear = ddlSelectedMonth+'_'+YearVar;
        var sdpId  = $("#ddlSPDListByDiscom").val();
        if(discomStateVar == 'Odisha' && sdpId == 'All'){
          var spdSateVar = $('#ddlOdishaSelected').val();
          var stateVar =  spdSateVar+'_'+discomStateVar;
        }else if(discomStateVar == 'Maharashtra' && sdpId == 'All'){
          var spdSateVar = $('#ddlMaharshtraSelected').val();
          var stateVar =  spdSateVar+'_'+discomStateVar;
        }else{
          var stateVar =  $("#ddlDiscomState").find(':selected').attr("attrState");
        }
      }
      tableToExcel('exportDISCOMYearlyReport', 'SHEET1',stateVar,ddlSelectedYear);
    },
    "click #BtnExportSLDCYearlyReport": function(e, instance) {
      var monthlyORyearlyVar  = $('#ddlMonthlyYearly').val();
      if(monthlyORyearlyVar == 'Yearly'){
        var stateVar =  $("#ddlSLDCStateYearly").val();
        var ddlSelectedYear = $('#ddlSLDCSelectYearly').val();
      }else{
        var stateVar =  $("#ddlSLDCState").val();
        var monthVar = $('#ddlSLDCSelectMonth').val();
        var YearVar = $('#ddlSLDCSelectMonthly').val();
        var ddlSelectedYear = monthVar+'_'+YearVar;
      }
      tableToExcel('exportSLDCYearlyReport', 'SHEET1',stateVar,ddlSelectedYear);
    },
});

Template.monthlyReportSECIL.helpers({
    yearHelper() {
        return dynamicYear();
    },
    isReportTypeSPDSelectedForMonthly() {
        if (Template.instance().ddlReportForAdminVar.get() == 'SPD' && Template.instance().ddlMonthlyYearlyVar.get() == 'Monthly') {
            return true;
        } else {
            return false;
        }
    },
    isReportTypeSPDSelectedForYearly() {
        if (Template.instance().ddlReportForAdminVar.get() == 'SPD' && Template.instance().ddlMonthlyYearlyVar.get() == 'Yearly') {
            return true;
        } else {
            return false;
        }
    },
    isReportTypeDISCOMSelectedForMonthly() {
        if (Template.instance().ddlReportForAdminVar.get() == 'DISCOM' && Template.instance().ddlMonthlyYearlyVar.get() == 'Monthly') {
            return true;
        } else {
            return false;
        }
    },
    isReportTypeDISCOMSelectedForYearly() {
        if (Template.instance().ddlReportForAdminVar.get() == 'DISCOM' && Template.instance().ddlMonthlyYearlyVar.get() == 'Yearly') {
            return true;
        } else {
            return false;
        }
    },
    isReportTypeSLDCSelectedForMonthly() {
        if (Template.instance().ddlReportForAdminVar.get() == 'SLDC' && Template.instance().ddlMonthlyYearlyVar.get() == 'Monthly') {
            return true;
        } else {
            return false;
        }
    },
    isReportTypeSLDCSelectedForYearly() {
        if (Template.instance().ddlReportForAdminVar.get() == 'SLDC' && Template.instance().ddlMonthlyYearlyVar.get() == 'Yearly') {
            return true;
        } else {
            return false;
        }
    },
    isGujaratSLDCSelectedMonthlyReport() {
        if (Template.instance().selectedSLDCState.get() == 'Gujarat') {
            return true;
        } else {
            return false;
        }
    },
    isMPSLDCSelectedForMonthlyReport() {
        if (Template.instance().selectedSLDCState.get() == 'MP') {
            return true;
        } else {
            return false;
        }
    },
    isRajasthanSLDCSelectedForMonthlyReport() {
        if (Template.instance().selectedSLDCState.get() == 'Rajasthan') {
            return true;
        } else {
            return false;
        }
    },
    monthShow() {
        return monthReturn();
    },
    isSLDCMonthlyReportAvailable(){
      if(Template.instance().isSLDCMonthlyReportAvailable.get()){
        return true;
      }else{
        return false;
      }
    },
    returnGujarat(){
      if(Template.instance().isSLDCMonthlyReportAvailable.get()){
        return Template.instance().isSLDCMonthlyReportAvailable.get();
      }else{
        return false;
      }
    },
    returnMPData(){
      if(Template.instance().isSLDCMonthlyReportAvailable.get()){
        return Template.instance().isSLDCMonthlyReportAvailable.get();
      }else{
        return false;
      }
    },
    returnRajasthan(){
      if(Template.instance().isSLDCMonthlyReportAvailable.get()){
        var data = Template.instance().isSLDCMonthlyReportAvailable.get();
        return data.nameJson;
      }else{
        return false;
      }
    },
    returnRajasthanForData(){
      if(Template.instance().isSLDCMonthlyReportAvailable.get()){
        var data = Template.instance().isSLDCMonthlyReportAvailable.get();
        return data.monthlyArr;
      }else{
        return false;
      }
    },
    monthlyTotalRaj(){
      if(Template.instance().isSLDCMonthlyReportAvailable.get()){
        var data = Template.instance().isSLDCMonthlyReportAvailable.get();
        return data.finalTotalJson;
      }else{
        return false;
      }
    },
    isSLDCYearlyReportAvailable(){
      if(Template.instance().isSLDCYearlyReportAvailable.get() != '' && Template.instance().isStateSelectedForSLDCYearly.get() == 'Rajasthan'){
        return true;
      }else{
        return false;
      }
    },
    isMPSLDCSelectedForYearlyReport(){
      if(Template.instance().isSLDCYearlyReportAvailable.get() != '' && Template.instance().isStateSelectedForSLDCYearly.get() == 'MP'){
        return true;
      }else{
        return false;
      }
    },
    isGujaratSLDCSelectedYearlyReport(){
      if(Template.instance().isSLDCYearlyReportAvailable.get() != '' && Template.instance().isStateSelectedForSLDCYearly.get() == 'Gujarat'){
        return true;
      }else{
        return false;
      }
    },
    returnGujaratSLDCReport(){
      if(Template.instance().isSLDCYearlyReportAvailable.get() != '' && Template.instance().isStateSelectedForSLDCYearly.get() == 'Gujarat'){
        return Template.instance().isSLDCYearlyReportAvailable.get();
      }else{
        return false;
      }
    },
    MPSLDCYearlyData(){
      if(Template.instance().isSLDCYearlyReportAvailable.get() != '' && Template.instance().isStateSelectedForSLDCYearly.get() == 'MP'){
        return Template.instance().isSLDCYearlyReportAvailable.get();
      }else{
        return false;
      }
    },
    RajasthanYearly(){
      if(Template.instance().isSLDCYearlyReportAvailable.get()){
        var data = Template.instance().isSLDCYearlyReportAvailable.get();
        return data.nameJson;
      }else{
        return false;
      }
    },
    returnRajasthanYearlyReport(){
      if(Template.instance().isSLDCYearlyReportAvailable.get()){
        var data = Template.instance().isSLDCYearlyReportAvailable.get();
        return data.monthlyArr;
      }else{
        return false;
      }
    },
    yearlyTotalRaj(){
      if(Template.instance().isSLDCYearlyReportAvailable.get()){
        var data = Template.instance().isSLDCYearlyReportAvailable.get();
        return data.finalTotalJson;
      }else{
        return false;
      }
    },
    returningDataHelper(array, index, values) {
        if (array) {
            return array[values][index];
        }
    },
    returningData(array, index, value) {
        if (array) {
            return array[index][value];
        }
    },
    sldListArr(){
      if(Template.instance().userList.get()){
        return Template.instance().userList.get();
      }else{
        return false;
      }
    },
    discoListArr(){
      if(Template.instance().userListOfDiscom.get()){
        return Template.instance().userListOfDiscom.get();
      }else{
        return false;
      }
    },
    showInvidualMonthlyDataTable(){
      if(Template.instance().totalIndividualMonthlyDataVar.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    ShowIndividualMonthlySPDData(){
      var data = Template.instance().totalIndividualMonthlyDataVar.get();
      if(Template.instance().totalIndividualMonthlyDataVar.get() != ''){
        return data[0].result;
      }else{
        return false;
      }
    },
    ShowIndividualMonthlyTotalData(){
      var data = Template.instance().totalIndividualMonthlyDataVar.get();
      if(Template.instance().totalIndividualMonthlyDataVar.get() != ''){
        return data[1].totalJson;
      }else{
        return false;
      }
    },
    showInvidualYearlyDataTable(){
      if(Template.instance().totalIndividualYearlyDataVar.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    ShowIndividualYearlySPDData(){
      var data = Template.instance().totalIndividualYearlyDataVar.get();
      if(Template.instance().totalIndividualYearlyDataVar.get() != ''){
        return data[0].monthlyReportArr;
      }else{
        return false;
      }
    },
    ShowIndividualYearlyTotalData(){
      var data = Template.instance().totalIndividualYearlyDataVar.get();
      if(Template.instance().totalIndividualYearlyDataVar.get() != ''){
        return data[1].monthlyTotalJsonVar;
      }else{
        return false;
      }
    },
    isSpdListAvailabel(){
      if(Template.instance().gettingSPDNamesFromDiscom.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    listOfSPDArr(){
      if(Template.instance().gettingSPDNamesFromDiscom.get() != ''){
        return Template.instance().gettingSPDNamesFromDiscom.get();
      }else{
        return false;
      }
    },

    isMonthlyIndividualDiscomReport(){
      if(Template.instance().totalIndividualMonthlyDiscomReportVar.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    ShowIndividualMonthlyDiscomReportData(){
      var data = Template.instance().totalIndividualMonthlyDiscomReportVar.get();
      if(Template.instance().totalIndividualMonthlyDiscomReportVar.get() != ''){
        return data[0].result;
      }else{
        return false;
      }
    },
    ShowIndividualMonthlyDiscomReportTotalData(){
      var data = Template.instance().totalIndividualMonthlyDiscomReportVar.get();
      if(Template.instance().totalIndividualMonthlyDiscomReportVar.get() != ''){
        return data[1].totalJson;
      }else{
        return false;
      }
    },
    ifDiscomOdishaStatesSlectedAndAll() {
        return Template.instance().showOrissaInterState.get();
    },
    ifDiscomMaharashtraStatesSlectedAndAll() {
        return Template.instance().isMaharshtraDiscomSelected.get();
    },
    isDiscomMonthlyAllAvailable(){
      if(Template.instance().totalIndividualMonthlyDiscomReportForAllVar.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    DiscomMonthlyAllData(){
      if(Template.instance().totalIndividualMonthlyDiscomReportForAllVar.get() != ''){
        return Template.instance().totalIndividualMonthlyDiscomReportForAllVar.get();
      }else{
        return false;
      }
    },
    isDiscomYearlyIndividualReportAvailable(){
      if(Template.instance().YearlyIndividualReportByDiscom.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    ShowIndividualYearlyDiscomReportData(){
      var data = Template.instance().YearlyIndividualReportByDiscom.get();
      if(Template.instance().YearlyIndividualReportByDiscom.get() != ''){
        return data[0].yearlyReportArr;
      }else{
        return false;
      }
    },
    ShowTotalIndividualYearlyDiscomReportData(){
      var data = Template.instance().YearlyIndividualReportByDiscom.get();
      if(Template.instance().YearlyIndividualReportByDiscom.get() != ''){
        return data[1].yearlyTotalJsonVar;
      }else{
        return false;
      }
    },
    isDiscomYearlyAllAvailable(){
      if(Template.instance().totalIndividualYearlyDiscomReportForAllVar.get() != ''){
        return true;
      }else{
        return false;
      }
    },
    DiscomYearlyAllData(){
      if(Template.instance().totalIndividualYearlyDiscomReportForAllVar.get() != ''){
        return Template.instance().totalIndividualYearlyDiscomReportForAllVar.get();
      }else{
        return false;
      }
    },
    "showHelper": function(array, index, value) {
    if (array) {
        var data = getMyData(array, value, index);
        return data;
    } else {
        return false;
    }
  },
  serial(index) {
      return index + 1;
  },
  returningColoum(array,index){
    if (array) {
      var data = returningColoum(array,index);
      return Number(data).toFixed(7);
    }
  }
});

function getMyData(array, value, index) {
    var toReturn = array[value][index];
    return toReturn;
}



var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        }
    return function(table, name, data,date) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname= data+'_'+date+".xls";
        var link = document.createElement("A");
      link.href =  uri + base64(format(template, ctx))
      link.download = excelname || 'Workbook.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
})()

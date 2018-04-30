import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.SpdScheduleStatus.onCreated(function spdScheduleStatus() {
    this.radioBtnSelection = new ReactiveVar();
    this.ViewDataVar = new ReactiveVar('');
    this.viewScheduleDates = new ReactiveVar();
    this.userProfileVar = new ReactiveVar('');
    this.RealTimeBidViewClickedVar = new ReactiveVar(false);
    this.viewrealTimeData = new ReactiveVar;
    this.realTimeData = new ReactiveVar;
    this.selectedDateForExcel = new ReactiveVar;
});

Template.SpdScheduleStatus.rendered = function() {
  SessionStore.set("isLoading",false);
};
Template.SpdScheduleStatus.events({
    "focus #txtFromDate": function() {
        $('#txtFromDate').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        });
    },
    "focus #txtToDate": function() {
        $('#txtToDate').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        });
    },
    "click #buttonSubmit": function(e, instance) {
        instance.selectedDateForExcel.set();
        instance.realTimeData.set();
        instance.RealTimeBidViewClickedVar.set(false);
        var txtFromDate = $('#txtFromDate').val();
        var txtToDate = $('#txtToDate').val();
        if (txtFromDate != '' && txtToDate != '') {
          fromDate = txtFromDate.split('-');
          toDate = txtToDate.split('-');
          fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
          toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
          date1_unixtime = parseInt(fromDate.getTime() / 1000);
          date2_unixtime = parseInt(toDate.getTime() / 1000);
          var timeDifference = date2_unixtime - date1_unixtime;
          var timeDifferenceInHours = timeDifference / 60 / 60;
          var timeDifferenceInDays = timeDifferenceInHours / 24;
            if (timeDifferenceInDays > 0) {
              SessionStore.set("isLoading", true);
                Meteor.call("radioScheduleStatusSPD", txtFromDate, txtToDate, function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading", false);
                        swal('Please try again !');
                    } else {
                        if (result.status) {
                            var jsonData = result.data;
                            instance.ViewDataVar.set(jsonData);
                            SessionStore.set("isLoading", false);
                        }
                    }
                });

            } else {
                swal('To date should be greater than from date!');
            }
        } else {
            swal('All fields are required !');
        }
    },
    "click .btnViewScheduleRealTime": function(e, instance) {
        var dateVar = $(e.currentTarget).attr('selectedDate');
        instance.selectedDateForExcel.set(dateVar);
        SessionStore.set("isLoading", true);
        Meteor.call("getRealTimeData", dateVar, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Error : " + error);
            } else {
                SessionStore.set("isLoading", false);
                instance.realTimeData.set(result.data);
                instance.RealTimeBidViewClickedVar.set(true);
            }
        });
        Meteor.call("getRealTimeTotalMWHData", dateVar, function(error, result) {
            if (error) {
              SessionStore.set("isLoading", false);
                // swal("Error : " + error);
            } else {
                instance.viewrealTimeData.set(result.data);
                SessionStore.set("isLoading", false);
            }
        });

    },
    "click #exportRevisons": function(e, instance) {
        var selectedDate = instance.selectedDateForExcel.get();
        var excelnameVar = 'schedule_'+selectedDate;
        tableToExcel('revisionTable', 'SHEET1',excelnameVar);
    },
});

Template.SpdScheduleStatus.helpers({
    "getValues": function(value) {
        keys = Object.keys(value);
        var values = [];
        keys.forEach(function(v) {
            values.push(value[v]);
        });
        return values;
    },
    "getTableHeadings": function(value) {
      if (loggedInUserState('SPD')) {
        keys = Object.keys(value[0]);
        var values = [];
        var len = keys.length;
        values.push("Date");
        values.push("Time Slot");
        for (i = 0; i < Number(len - 2)/2; i++) {
            values.push("Availability");
            values.push("R" + i);
        }
        return values;
      }else {
        keys = Object.keys(value[0]);
        var values = [];
        var len = keys.length;
        values.push("Sr. No.");
        values.push("Date");
        values.push("Time Slot");
        for (i = 0; i < len - 2; i++) {
            values.push("R" + i);
        }
        return values;
      }
    },
    serial(index){
      return index+1;
    },
    "isRealTimeViewBtnClicked": function() {
        if (Template.instance().realTimeData.get()) {
            return Template.instance().realTimeData.get();
        } else {
            return false;
        }
    },
    "isRealTimeTotalMwhView": function() {
        if (Template.instance().viewrealTimeData.get()) {
            return Template.instance().viewrealTimeData.get();
        } else {
            return false;
        }
    },

    "dataShow": function() {
      if(Template.instance().ViewDataVar.get()){
        return Template.instance().ViewDataVar.get();
      }else{
        return false;
      }
    },
    "dataShowAll": function() {
      if(Template.instance().ViewDataVar.get()){
        return true;
      }else{
        return false;
      }
    },
    'isDateSelected': function() {
        if (Template.instance().ViewDataVar.get() != '') {
            return true;
        } else {
            return false;
        }
    },
    'isRealTimeViewScheduleClicked': function() {
        if (Template.instance().RealTimeBidViewClickedVar.get()) {
            return true;
        } else {
            return false;
        }
    },
    isMPStateSPSSelectedForScheduleSubmission(){
      if (loggedInUserState('SPD')) {
        return true;
      }else {
        return false;
      }
    }
});


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
    return function(table, name, excelnameVar) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = excelnameVar + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

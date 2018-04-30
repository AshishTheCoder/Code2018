import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.dailyReportSECIL.onCreated(function abcd() {
    this.dateSelected = new ReactiveVar;
    this.stateSelected = new ReactiveVar('');
    this.selectedStateSTU = new ReactiveVar('');
    this.showTable = new ReactiveVar;
    this.radioValue = new ReactiveVar;
    this.showIndividual = new ReactiveVar;
    this.onlyStateValue = new ReactiveVar;
    this.showMaharashtraDropdown = new ReactiveVar;
    this.showRRF = new ReactiveVar;

    //allNewInstance//
    this.totalAry = new ReactiveVar;
    this.spdStateName = new ReactiveVar;
    this.setLdcValues = new ReactiveVar;
    this.setComparisonArray = new ReactiveVar;
    this.fetchedData = new ReactiveVar;
    this.fetchedDataIndi = new ReactiveVar;

    //discom react variables///
    this.discomStates = new ReactiveVar;
    this.discomStateSelected = new ReactiveVar;
    this.selectedDiscomStateIds = new ReactiveVar;
    this.listOfDiscom = new ReactiveVar;
    this.MPstateSelected = new ReactiveVar;
    this.MPdiscomData = new ReactiveVar;

    //orissa react variables///
    this.showOrissaDropdown = new ReactiveVar;
    this.listOrissaDynamic = new ReactiveVar;
});

Template.dailyReportSECIL.rendered = function() {
  SessionStore.set("isLoading",false);
    $('#selectDate').datepicker({
        format: 'dd-mm-yyyy',
        endDate: '+1d',
        autoclose: true
    });
};
Template.dailyReportSECIL.events({
    "change #selectDate": function(e) {
        Template.instance().dateSelected.set('');
        if ($(e.currentTarget).val()) {
            Template.instance().dateSelected.set($(e.currentTarget).val());
            Template.instance().showTable.set(false);
        }
    },
    "change #inlineRadio": function(e, instance) {
        if ($(e.currentTarget).val()) {
            Template.instance().radioValue.set($(e.currentTarget).val());
            Template.instance().showTable.set(false);
            Template.instance().discomStateSelected.set('');
            Template.instance().listOfDiscom.set('');
            $('#selectStateDiscom').val('');
        }
    },
    "change #selectStateDiscom": function(e, instance) {
        instance.listOfDiscom.set('');
        instance.fetchedData.set('');
        $('#selectDiscomData').val('');

        instance.showTable.set(false);

        instance.discomStateSelected.set($(e.currentTarget).val());
        instance.stateSelected.set($(e.currentTarget).val());
        if ($(e.currentTarget).val()) {
            instance.setLdcValues.set($("#selectStateDiscom").find(':selected').attr("ldcAttr"));
            Meteor.call("callDiscomSpdIdsDaily", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again", "error");
                } else {
                    if (result.status) {
                        if (result.data.length > 0) {
                            instance.listOfDiscom.set(result.data);
                        } else {
                            swal("Discom not available");
                            instance.showTable.set(false);
                            instance.discomStateSelected.set('');
                            instance.listOfDiscom.set('');
                        }
                    }
                }
            });
        }
    },
    "change #selectDiscomData": function(e, instance) {
        instance.showTable.set(false);
        instance.showOrissaDropdown.set(false);
        instance.listOrissaDynamic.set('');
        instance.setComparisonArray.set('');
        if ($(e.currentTarget).val()) {
            if ($(e.currentTarget).val() != "all") {
                var nameOfSpd = $("#selectDiscomData").find(':selected').attr("attrName");
                var discomStateThis = $("#selectDiscomData").find(':selected').attr("attrState");
                instance.spdStateName.set(discomStateThis);
                instance.showIndividual.set(true);
                instance.showTable.set(true);
                Meteor.call("callDailyDiscomIndividual", $(e.currentTarget).val(), discomStateThis, instance.dateSelected.get(), instance.discomStateSelected.get(), nameOfSpd, function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            instance.fetchedData.set('');
                            instance.fetchedDataIndi.set(result.data);
                        } else {
                            swal(result.message);
                        }
                    }
                })
            } else if (instance.discomStateSelected.get() == "Odisha") {
                instance.fetchedData.set('');
                instance.showOrissaDropdown.set(true);
                instance.setComparisonArray.set('');

            } else if (instance.discomStateSelected.get() == "Maharashtra") {
                instance.fetchedData.set('');
                instance.showMaharashtraDropdown.set(true);
                instance.setComparisonArray.set('');

            } else {
                instance.fetchedData.set('');
                var list = instance.listOfDiscom.get();
                var spdState = list[0].state;
                instance.spdStateName.set(spdState);
                instance.setComparisonArray.set('');

                var spdState = Template.instance().spdStateName.get();
                var blankArray = [];
                if (spdState == "Rajasthan") {
                    blankArray.push("NRLDC")
                } else if (spdState == "Gujarat") {
                    blankArray.push("WRLDC");
                } else if (spdState == "MP") {
                    blankArray.push("WRLDC");
                }
                if (Template.instance().setLdcValues.get()) {
                    blankArray.push(Template.instance().setLdcValues.get());
                    if (Template.instance().discomStateSelected.get() == "Assam") {
                        blankArray.push("ERLDC");
                    }
                }
                var returnArray = [];
                for (var i = 0; i < blankArray.length; i++) {
                    returnArray.push(blankArray[i]);
                }
                instance.setComparisonArray.set(returnArray);

                Meteor.call("callDailyDiscom", instance.listOfDiscom.get(), instance.dateSelected.get(), instance.discomStateSelected.get(), instance.setComparisonArray.get(), function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            instance.showIndividual.set(false);
                            instance.showTable.set(true);
                            instance.fetchedData.set(result.data);
                        } else {
                            swal(result.message);
                        }
                    }
                })
            }
        }
    },
    "change #selectOrissa": function(e) {
        if ($(e.currentTarget).val()) {
            var instance = Template.instance();
            var list = [];
            var aryAll = instance.listOfDiscom.get();
            aryAll.forEach(function(item) {
                if (item.state == $(e.currentTarget).val()) {
                    list.push(item);
                }
            })
            instance.listOrissaDynamic.set(list);
            instance.spdStateName.set($(e.currentTarget).val());
            instance.setComparisonArray.set('');

            var spdState = Template.instance().spdStateName.get();
            var blankArray = [];
            if (spdState == "Rajasthan") {
                blankArray.push("NRLDC")
            } else if (spdState == "Gujarat") {
                blankArray.push("WRLDC");
            } else if (spdState == "MP") {
                blankArray.push("WRLDC");
            }
            if (Template.instance().setLdcValues.get()) {
                blankArray.push(Template.instance().setLdcValues.get());
                if (Template.instance().discomStateSelected.get() == "Assam") {
                    blankArray.push("ERLDC");
                }
            }
            var returnArray = [];
            for (var i = 0; i < blankArray.length; i++) {
                returnArray.push(blankArray[i]);
            }
            instance.setComparisonArray.set(returnArray);
            Meteor.call("callDailyDiscom", list, instance.dateSelected.get(), "ORISSA", instance.setComparisonArray.get(), function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again", "error");
                } else {
                    if (result.status) {
                        instance.showIndividual.set(false);
                        instance.showTable.set(true);
                        instance.fetchedData.set(result.data);
                    } else {
                        swal(result.message);
                    }
                }
            })
        }
    },
    "change #selectMaharashtra": function(e, instance) {
        if ($(e.currentTarget).val()) {
            var list = [];
            var aryAll = instance.listOfDiscom.get();
            aryAll.forEach(function(item) {
                if (item.state == $(e.currentTarget).val()) {
                    list.push(item);
                }
            })
            instance.listOrissaDynamic.set(list);
            instance.spdStateName.set($(e.currentTarget).val());

            var spdState = instance.spdStateName.get();
            var blankArray = [];
            if (spdState == "Rajasthan") {
                blankArray.push("NRLDC")
            } else if (spdState == "Gujarat") {
                blankArray.push("WRLDC");
            }
            //  else if (spdState == "MP") {
            //     blankArray.push("WRLDC");
            // }
            if (Template.instance().setLdcValues.get()) {
                blankArray.push(Template.instance().setLdcValues.get());
                if (Template.instance().discomStateSelected.get() == "Assam") {
                    blankArray.push("ERLDC");
                }
            }
            var returnArray = [];
            for (var i = 0; i < blankArray.length; i++) {
                returnArray.push(blankArray[i]);
            }
            instance.setComparisonArray.set(returnArray);
            Meteor.call("callDailyDiscom", list, instance.dateSelected.get(), "Maharashtra", instance.setComparisonArray.get(), function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again", "error");
                } else {
                    if (result.status) {
                        instance.showIndividual.set(false);
                        instance.showTable.set(true);
                        instance.fetchedData.set(result.data);
                    } else {
                        swal(result.message);
                    }
                }
            })
        }
    },

    'click #shootDiscomReport': function(e) {
        var getState = $('#shootDiscomReport').attr('attr');

        var valueArray = [{
            state: 'Maharashtra',
            value: 'Today Green Energy Pvt. Ltd(5RJ)'
        }, {
            state: 'Odisha',
            value: 'Suryauday Solaire Prakash Private Limited'
        }, {
            state: 'Haryana',
            value: 'Northern, Azure Green, Azure Sunshine'
        }, {
            state: 'Himachal Pradesh',
            value: 'Acme Rajdhani Power Pvt. Ltd.'
        }, {
            state: 'Delhi(BRPL)',
            value: 'Acme Gurgaon Power Pvt. Ltd'
        }, {
            state: 'Delhi(BYPL)',
            value: 'Acme Mumbai Power Pvt. Ltd.'
        }, {
            state: 'Delhi(TPDDL)',
            value: 'Medha Energy Pvt. Ltd.'
        }, {
            state: 'Assam',
            value: 'Ranji Solar Energy Pvt. Ltd.'
        }, {
            state: 'Punjab',
            value: 'TODAY GREEN ENERGY'
        }, {
            state: 'Jharkhand',
            value: 'Laxmi Diamond Pvt. Ltd.'
        }, {
            state: 'Chhattisgarh',
            value: 'Waaneep and Focal Energy Solar One'
        }, {
            state: 'Bihar',
            value: 'Focal Renewable Energy Two'
        }, {
            state: 'Goa',
            value: 'IL&FS'
        }];

        var stateArray = []
        valueArray.forEach(function(item) {
            if (item.state == getState) {
                stateArray.push(item)
            }
        })
        swal({
                title: "Are you sure?",
                text: "You want to send DISCOM report!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, send it!",
                closeOnConfirm: false
            },
            function() {
                swal("Sent!", "Discom report successfully sent.", "success");
                Meteor.call("mailShootForMultipleSpd", stateArray, function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            // swal(result.message);
                        }
                    }
                });
            });
    },
    'change #selectMPDiscom' (e, instance) {
        if ($(e.currentTarget).val()) {
            SessionStore.set("isLoading", true);
            instance.MPstateSelected.set($(e.currentTarget).val());
            Meteor.call("callDiscomForMp", $(e.currentTarget).val(), instance.dateSelected.get(), function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again", "error");
                } else {
                    if (result.status) {
                        SessionStore.set("isLoading", false);
                        instance.MPdiscomData.set(result.data)
                        console.log(result.data);
                    } else {
                        SessionStore.set("isLoading", false);
                        swal(result.message);
                    }
                }
            });
        }
    },
    'change #selectMPRevision' (e, instance) {
        if ($(e.currentTarget).val()) {
          var data=instance.MPdiscomData.get().hrefArray;
          var matchHref='#';
          data.forEach(function (item) {
            if (item.revisionNumber==$(e.currentTarget).val()) {
              matchHref=item.hrefValue;
            }
          })
          instance.showRRF.set(matchHref);
        }else {
          return '#';
        }
    },
    'click #shootMPReport' (e, instance) {
        // var date=$('#shootMPReport').attr('attrDate');
        // var state=$('#shootMPReport').attr('attrState');
        if (instance.MPdiscomData.get()) {
            swal({
                    title: "Are you sure?",
                    text: "You want to send MP DISCOM report!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#55dd6b",
                    confirmButtonText: "Yes, send it!",
                    closeOnConfirm: false
                },
                function() {
                    swal("Sent!", "MP Discom report successfully sent.", "success");
                    Meteor.call("sendDiscomForMP", instance.MPdiscomData.get(), function(error, result) {
                        if (error) {
                            swal("Oops...", "Please try again!", "error");
                        } else {
                            if (result.status) {
                                swal(result.message);
                            } else {
                                swal("Oops...", "Report not sent!", "error");
                            }
                        }
                    })
                });
        } else {
            console.log('Sending data not Available');
        }
    },
    "click #discomInterAll": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedData.get().spdState + '_' + instance.fetchedData.get().discomSate + '_' + reportType + '_' + instance.fetchedData.get().scheduleDate;
        tableToExcel('discomInterAllTable', 'SHEET1', data);
    },
    "click #discomInterIndi": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedDataIndi.get().spdState + '_' + instance.fetchedDataIndi.get().discomSate + '_' + reportType + '_' + instance.fetchedDataIndi.get().scheduleDate;
        tableToExcel('discomInterIndiTable', 'SHEET1', data);
    },
    "click #discomIntraAll": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedData.get().spdState + '_' + instance.fetchedData.get().discomSate + '_' + reportType + '_' + instance.fetchedData.get().scheduleDate;
        tableToExcel('discomIntraAllTable', 'SHEET1', data);
    },
    "click #discomIntraIndi": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedDataIndi.get().spdState + '_' + instance.fetchedDataIndi.get().discomSate + '_' + reportType + '_' + instance.fetchedDataIndi.get().scheduleDate;
        tableToExcel('discomIntraIndiTable', 'SHEET1', data);
    },
    "click #discomOrissa": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedData.get().spdState + '_' + instance.fetchedData.get().discomSate + '_' + reportType + '_' + instance.fetchedData.get().scheduleDate;
        tableToExcel('discomOrissaTable', 'SHEET1', data);
    },
    "click #spdInterAll": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedData.get().spdState + '_' + instance.fetchedData.get().discomSate + '_' + reportType + '_' + instance.fetchedData.get().scheduleDate;
        tableToExcel('spdInterAllTable', 'SHEET1', data);
    },
    "click #spdInterIndi": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedDataIndi.get().spdState + '_' + instance.fetchedDataIndi.get().discomSate + '_' + reportType + '_' + instance.fetchedDataIndi.get().scheduleDate;
        tableToExcel('spdInterIndiTable', 'SHEET1', data);
    },
    "click #spdIntraAll": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedData.get().spdState + '_' + instance.fetchedData.get().discomSate + '_' + reportType + '_' + instance.fetchedData.get().scheduleDate;
        tableToExcel('spdIntraAllTable', 'SHEET1', data);
    },
    "click #spdIntraIndi": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedDataIndi.get().spdState + '_' + instance.fetchedDataIndi.get().discomSate + '_' + reportType + '_' + instance.fetchedDataIndi.get().scheduleDate;
        tableToExcel('spdIntraIndiTable', 'SHEET1', data);
    },
    "click #discomMP": function(e, instance) {
        if (Template.instance().radioValue.get() == 'comparision') {
            var reportType = 'RLDC_Comparision';
        } else if (Template.instance().radioValue.get() == 'discom') {
            var reportType = 'Discom_Report';
        }
        var data = instance.fetchedData.get().spdState + '_' + instance.fetchedData.get().discomSate + '_' + 'Discom_Report' + '_' + instance.fetchedData.get().scheduleDate;
        tableToExcel('discomMPTable', 'SHEET1', data);
    },
});

Template.dailyReportSECIL.helpers({
    "viewDateSelected": function() {
        return Template.instance().dateSelected.get();
    },
    "viewStateSelected": function() {
        return Template.instance().discomStateSelected.get();
    },
    viewStateSelectedForMp() {
        return Template.instance().MPstateSelected.get();
    },
    "viewDiscomStateName": function() {
        if (Template.instance().discomStateSelected.get()) {
            return Template.instance().discomStateSelected.get().toUpperCase();
        }
    },
    "viewTable": function() {
        return Template.instance().showTable.get();
    },
    tableForMp() {
        if (Template.instance().radioValue.get() == 'MPdiscom') {
            if (Template.instance().MPstateSelected.get()) {
                if (Template.instance().MPdiscomData.get()) {
                    return true;
                }
            }
        }

    },
    "viewStates": function() {
        if (Template.instance().radioValue.get() == 'comparision' || Template.instance().radioValue.get() == 'discom') {
            if (Template.instance().dateSelected.get()) {
                Template.instance().MPstateSelected.set('');
                return true;
            }
        }
    },
    viewMpDiscomReport() {
        if (Template.instance().radioValue.get() == 'MPdiscom') {
            if (Template.instance().dateSelected.get()) {
                return true;
            }
        }
    },
    hideDuetoMpDiscom() {
        if (Template.instance().radioValue.get() == 'discom') {
            if (Template.instance().dateSelected.get()) {
                return false;
            }
        } else {
            return true;
        }
    },
    "viewIndividualButton": function() {
        return Template.instance().showIndividual.get();
    },
    showComparisionList() {
        if (Template.instance().radioValue.get() == "comparision" && Template.instance().discomStateSelected.get() != '') {
            return true;
        }
    },
    showReportList() {
        if (Template.instance().radioValue.get() == "discom" && Template.instance().discomStateSelected.get() != '') {
            return true;
        }
    },
    "serialNumber": function(index) {
        return Number(index) + 1;
    },
    blockCount() {
        var array = [];
        for (var i = 0; i < 96; i++) {
            array.push(i);
        }
        return array;
    },
    returnSlots(type, index) {
        var slots = mySlotFunction();
        if (type == "from") {
            return slots[index];
        } else if (type == "to") {
            var ret = Number(index) + 1;
            return slots[ret];
        }
    },
    "returnHelper": function(array, index, loopBig) {
        if (array) {
            return array[loopBig][index];
        }
    },
    "collspanLength": function() {
        if (Template.instance().fetchedData.get()) {
            var data = Template.instance().fetchedData.get().spdNamesListTotal;
            return data.length;
        }
    },
    "totalShow": function(array, loopBig) {
        if (Template.instance().fetchedData.get()) {
            if (array) {
                var data = Template.instance().fetchedData.get().result;
                var finalLength = data[0].length;
                var myData = spdTotal(array, loopBig, finalLength - 1);
                return myData;
            }
        }
    },
    "totalShowError": function(array, loopBig) {
        if (Template.instance().fetchedData.get()) {
            if (array) {
                var data = Template.instance().fetchedData.get().lossResult;
                var finalLength = data[0].length;
                var myData = spdTotal(array, loopBig, finalLength - 1);
                return myData;
            }
        }
    },
    showOrissaCaseState() {
        if (Template.instance().discomStateSelected.get() == "Odisha") {
            if (Template.instance().showOrissaDropdown.get()) {
                return true;
            }
        }
    },
    viewHrefValue(){
      if (Template.instance().showRRF.get()) {
        return Template.instance().showRRF.get();
      }
    },
    showMaharashtraCaseState() {
        if (Template.instance().discomStateSelected.get() == "Maharashtra") {
            if (Template.instance().showMaharashtraDropdown.get()) {
                return true;
            }
        }
    },
    dynamicComparisionTable() {
        if (Template.instance().spdStateName.get()) {
            return Template.instance().setComparisonArray.get();
        }
    },
    serverDataShow(array, BigIndex) {
        if (Template.instance().fetchedData.get()) {
            if (array == "NRLDC") {
                if (Template.instance().fetchedData.get().NRData.length > 0) {
                    var data = Template.instance().fetchedData.get().NRData;
                    return data[BigIndex];
                }
            } else if (array == "ERLDC") {
                if (Template.instance().fetchedData.get().ERData.length > 0) {
                    var fetchER = Template.instance().fetchedData.get().ERData;
                    return fetchER[BigIndex];
                }
            } else if (array == "NERLDC") {
                if (Template.instance().fetchedData.get().NERData.length > 0) {
                    var fetchNER = Template.instance().fetchedData.get().NERData;
                    return fetchNER[BigIndex];
                }
            } else if (array == "WRLDC") {
                if (Template.instance().fetchedData.get().WRData.length > 0) {
                    var fetchWR = Template.instance().fetchedData.get().WRData;
                    return fetchWR[BigIndex];
                }
            }
        }
    },
    returningFullJsonAll() {
        if (Template.instance().fetchedData.get()) {
            return Template.instance().fetchedData.get();
        }
    },
    returningFullJsonIndi() {
        if (Template.instance().fetchedDataIndi.get()) {
            return Template.instance().fetchedDataIndi.get();
        }
    },
    returningMPDiscomJson() {
        if (Template.instance().MPdiscomData.get()) {
            return Template.instance().MPdiscomData.get();
        }
    },
    "individualHelper": function(array, index) {
        if (array) {
            return array[index];
        }
    },
    "discomReportShow": function() {
        if (Template.instance().listOfDiscom.get()) {
            if (Template.instance().radioValue.get() == 'discom') {
                return true;
            }
        }
    },
    "discomComparisionShow": function() {
        if (Template.instance().listOfDiscom.get()) {
            if (Template.instance().radioValue.get() == 'comparision') {
                return true;
            }
        }
    },
    "discomNamesDynamic": function() {
        return Template.instance().listOfDiscom.get();
    },
    "isStateOrissa": function() {
        if (Template.instance().discomStateSelected.get() == "Odisha" && Template.instance().radioValue.get() == 'discom') {
            return true;
        }
    },
    showSpdState() {
        if (Template.instance().spdStateName.get()) {
            return Template.instance().spdStateName.get().toUpperCase();
        }
    }
});

function spdData(array, index, loopBig) {
    return array[loopBig][index];
};

function spdTotal(array, loopBig, length) {
    return array[loopBig][length];
};

function error(array, index) {
    return array[index];
};

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
    return function(table, name, data) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            }
            // dynamic name in excelname
        var excelname = data + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

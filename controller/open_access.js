Template.open_access.onCreated(function ss() {
    this.radio = new ReactiveVar;
    this.userList = new ReactiveVar;
    this.isUserSelected = new ReactiveVar('');
    this.spdListOpenAccess = new ReactiveVar('');
    this.usedForEditOption = new ReactiveVar('');
    this.tempVar = new ReactiveVar('');
    this.usedForIntraDiscom = new ReactiveVar('');
    this.usedForViewData = new ReactiveVar('');
});

Template.open_access.rendered = function() {
  SessionStore.set("isLoading",false);
    $("#openaccessform").validate({
        rules: {
            CTUName: {
                required: true
            },
            CTULtaIntimationNo: {
                required: true
            },
            CTUdateofLTA: {
                required: true
            },
            CTUFromDate: {
                required: true
            },
            CTUToDate: {
                required: true
            },
            CTUValidUptoDate: {
                required: true
            },
            CTUCapacity: {
                required: true
            },
            STUname: {
                required: true
            },
            STULtaIntimationNo: {
                required: true
            },
            STUdateofLTA: {
                required: true
            },
            STUFromDate: {
                required: true
            },
            STUToDate: {
                required: true
            },
            STUValidUptoDate: {
                required: true
            },
            STUCapacity: {
                required: true
            },
            DISCOMNocRefNo: {
                required: true
            },
            DISCOMLtaIntimationNo: {
                required: true
            },
            DISCOMDateOfNOC: {
                required: true
            },
            DISCOMFromDate: {
                required: true
            },
            DISCOMToDate: {
                required: true
            },
            DISCOMValidUptoDate: {
                required: true
            },
            DISCOMPSAValidityFromDate: {
                required: true
            },
            DISCOMPSAValidityToDate: {
                required: true
            },
            DISCOMCapacity: {
                required: true
            }
        },
        messages: {
            CTUName: {
                required: 'Please enter CTU name'
            },
            CTULtaIntimationNo: {
                required: 'Please enter LTA intimation number'
            },
            CTUdateofLTA: {
                required: 'Please enter date of LTA'
            },
            CTUFromDate: {
                required: 'Please enter from date'
            },
            CTUToDate: {
                required: 'Please enter to date'
            },
            CTUValidUptoDate: {
                required: 'Please enter valid upto'
            },
            CTUCapacity: {
                required: 'Please enter capacity'
            },
            //------------STU validation-------
            STUname: {
                required: 'Please enter STU name'
            },
            STULtaIntimationNo: {
                required: 'Please enter LTA intimation number'
            },
            STUdateofLTA: {
                required: 'Please enter date of LTA'
            },
            STUFromDate: {
                required: 'Please enter from date'
            },
            STUToDate: {
                required: 'Please enter to date'
            },
            STUValidUptoDate: {
                required: 'Please enter valid upto'
            },
            STUCapacity: {
                required: 'Please enter capacity'
            },
            //---------Discom---------
            DISCOMNocRefNo: {
                required: 'Please enter NOC reference number'
            },
            DISCOMLtaIntimationNo: {
                required: 'Please enter LTA intimation number'
            },
            DISCOMDateOfNOC: {
                required: 'Please enter date of NOC'
            },
            DISCOMFromDate: {
                required: 'Please enter from date'
            },
            DISCOMToDate: {
                required: 'Please enter to date'
            },
            DISCOMValidUptoDate: {
                required: 'Please enter valid upto'
            },
            DISCOMPSAValidityFromDate: {
                required: 'Please enter PSA validity from'
            },
            DISCOMPSAValidityToDate: {
                required: 'Please enter PSA validity to'
            },
            DISCOMCapacity: {
                required: 'Please enter capacity'
            }
        }
    });

    var instance = Template.instance();
    Meteor.call("callRadioValueAccess", function(error, result) {
        if (error) {
            swal('Please try again!')
        } else {
            if (result.status) {
                instance.userList.set(result.data);
            }
        }
    })
};


Template.open_access.events({
    "focus .txtDate": function() {
        $('.txtDate').datepicker({
            format: 'dd/mm/yyyy',
            autoclose: true
        });
    },
    "change #selectedUser": function(e) {
        var instance = Template.instance();
        instance.spdListOpenAccess.set('');
        instance.usedForEditOption.set('');
        instance.tempVar.set('');
        instance.usedForIntraDiscom.set('');
        instance.isUserSelected.set($(e.currentTarget).val());
        if ($(e.currentTarget).val() != '') {
            Meteor.call("openAccessGetSPDNames", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    swal('Please try again!')
                } else {
                    if (result.status) {
                        instance.spdListOpenAccess.set(result.data);
                    }
                }
            })
        }
    },
    // "change .getDateValidity": function() {
    //   var fromDate = $('#txtCTUFromDate').val();
    //   var toDate = $('#txtCTUToDate').val();
    //   if(fromDate != '' && toDate != ''){
    //     var fromYear = Number(moment(fromDate).format('YYYY'));
    //     var fromMonth = Number(moment(fromDate).format('MM'));
    //     var fromDay = Number(moment(fromDate).format('DD'));
    //
    //     var toYear = Number(moment(toDate).format('YYYY'));
    //     var toMonth = Number(moment(toDate).format('MM'));
    //     var toDay = Number(moment(toDate).format('DD'));
    //     console.log(toYear);
    //     console.log(toMonth);
    //     console.log(toDay);
    //       //using for geting date difference in years months and days
    //       var b = moment([toDay, toMonth, toYear]);
    //       var a = moment([fromDay, fromMonth, fromYear]);
    //       var yearVar = 0;
    //       var monthVar = 0;
    //       var dayVar = 0;
    //       var diffDuration = moment.duration(a.diff(b));
    //       if (diffDuration.years() > 0) {
    //           yearVar = diffDuration.years();
    //       }
    //       if (diffDuration.months() > 0) {
    //           monthVar = diffDuration.months();
    //       }
    //       if (diffDuration.days() > 0) {
    //           dayVar = diffDuration.days();
    //       }
    //       console.log(yearVar + ' years, ' + monthVar + ' months, ' + dayVar + ' days');
    //   }
    // },
    "submit #openaccessform": function(e) {
        e.preventDefault();
        var instance = Template.instance();
        var data = instance.spdListOpenAccess.get();
        if (data.discom_state == 'Rajasthan' || data.discom_state == 'Tamil Nadu' || data.discom_state == 'Karnataka') {
            var discomPSAValidityFromDateVar = $('#txtDISCOMPSAValidityFromDate').val();
            var discomPSAValidityToDateVar = $('#txtDISCOMPSAValidityToDate').val();
            var discomCapacityVar = $('#txtDISCOMCapacity').val();
            var discomjson = {
                discom_psa_validity_from: discomPSAValidityFromDateVar,
                discom_psa_validity_to: discomPSAValidityToDateVar,
                discom_capacity: discomCapacityVar,
                connected_spd: data.spdData

            };
            Meteor.call("insertOpenAccessData", data.discom_state, instance.isUserSelected.get(), '', '', discomjson, function(error, result) {
                if (error) {
                    swal('Please try again!')
                } else {
                    if (result.status) {
                        swal(result.message);
                        $('#selectedUser').val('');
                        instance.isUserSelected.set('');
                    }
                }
            });
        } else {
            var ctuNameVar = $('#txtCTUName').val();
            var ctuLtaIntimationNoVar = $('#txtCTULtaIntimationNo').val();
            var ctudateofLTAVar = $('#txtCTUdateofLTA').val();
            var ctuFromDateVar = $('#txtCTUFromDate').val();
            var ctuToDateVar = $('#txtCTUToDate').val();
            var ctuValidUptoDateVar = $('#txtCTUValidUptoDate').val();
            var ctuCapacityVar = $('#txtCTUCapacity').val();

            var stuNameVar = $('#txtSTUname').val();
            var stuLtaIntimationNoVar = $('#txtSTULtaIntimationNo').val();
            var studateofLTAVar = $('#txtSTUdateofLTA').val();
            var stuFromDateVar = $('#txtSTUFromDate').val();
            var stuToDateVar = $('#txtSTUToDate').val();
            var stuValidUptoDateVar = $('#txtSTUValidUptoDate').val();
            var stuCapacityVar = $('#txtSTUCapacity').val();

            var discomNocRefNoVar = $('#txtDISCOMNocRefNo').val();
            var discomLtaIntimationNoVar = $('#txtDISCOMLtaIntimationNo').val();
            var discomdateofNocVar = $('#txtDISCOMDateOfNOC').val();
            var discomFromDateVar = $('#txtDISCOMFromDate').val();
            var discomToDateVar = $('#txtDISCOMToDate').val();
            var discomValidUptoDateVar = $('#txtDISCOMValidUptoDate').val();
            var discomPSAValidityFromDateVar = $('#txtDISCOMPSAValidityFromDate').val();
            var discomPSAValidityToDateVar = $('#txtDISCOMPSAValidityToDate').val();
            var discomCapacityVar = $('#txtDISCOMCapacity').val();
            var ctujson = {
                ctu_name: ctuNameVar,
                ctu_intimation_no: ctuLtaIntimationNoVar,
                ctu_lta_date: ctudateofLTAVar,
                ctu_from_date: ctuFromDateVar,
                ctu_to_date: ctuToDateVar,
                ctu_valid_upto: ctuValidUptoDateVar,
                ctu_capacity: ctuCapacityVar,
                connected_spd: data.spdData
            };
            var stujson = {
                stu_name: stuNameVar,
                stu_intimation_no: stuLtaIntimationNoVar,
                stu_lta_date: studateofLTAVar,
                stu_from_date: stuFromDateVar,
                stu_to_date: stuToDateVar,
                stu_valid_upto: stuValidUptoDateVar,
                stu_capacity: stuCapacityVar
            };
            var discomjson = {
                discom_noc_refNo: discomNocRefNoVar,
                discom_intimation_no: discomLtaIntimationNoVar,
                discom_noc_date: discomdateofNocVar,
                discom_from_date: discomFromDateVar,
                discom_to_date: discomToDateVar,
                discom_valid_upto: discomValidUptoDateVar,
                discom_psa_validity_from: discomPSAValidityFromDateVar,
                discom_psa_validity_to: discomPSAValidityToDateVar,
                discom_capacity: discomCapacityVar
            };
            Meteor.call("insertOpenAccessData", data.discom_state, instance.isUserSelected.get(), ctujson, stujson, discomjson, function(error, result) {
                if (error) {
                    swal('Please try again!')
                } else {
                    if (result.status) {
                        swal(result.message);
                        $('#selectedUser').val('');
                        instance.isUserSelected.set('');
                    }
                }
            });
        }
    },
    "click #btnEdit": function() {
        var instance = Template.instance();
        var discomIdVar = instance.isUserSelected.get();
        var data = instance.spdListOpenAccess.get();
        if (data.discom_state == 'Rajasthan' || data.discom_state == 'Tamil Nadu' || data.discom_state == 'Karnataka') {

            Meteor.call("UserWantToEditAndUpdateData", data.discom_state, discomIdVar, function(error, result) {
                if (error) {
                    swal('Please try again!')
                } else {
                    if (result.status) {
                        instance.usedForEditOption.set(result.data);
                        instance.tempVar.set('No');
                        instance.usedForIntraDiscom.set(data.discom_state);

                    }
                }
            });
        } else {
            Meteor.call("UserWantToEditAndUpdateData", data.discom_state, discomIdVar, function(error, result) {
                if (error) {
                    swal('Please try again!')
                } else {
                    if (result.status) {
                        instance.tempVar.set('No');
                        instance.usedForEditOption.set(result.data);
                    }
                }
            });
        }
    },
    "click #btnView": function() {
        var instance = Template.instance();
        Meteor.call("viewReportOnModalBody", instance.isUserSelected.get(), function(error, result) {
            if (error) {
                swal('Please try again!')
            } else {
                if (result.status) {
                    instance.usedForViewData.set(result.data);
                    $("#modalForOpenAccess").click();
                }
            }
        });
    },
    "click #idForExportToExcelAll": function() {
        tableToExcel('openAccessCovertToExcel', 'SHEET1');
    },
});
Template.open_access.helpers({
    "spdListHelper": function() {
        var data = Template.instance().spdListOpenAccess.get();
        if (data != '') {
            return data.spdData;
        } else {
            return false;
        }
    },
    validationForSomeDiscoms: function() {
        var discomState = Template.instance().spdListOpenAccess.get();
        var state = discomState.discom_state;
        if (Template.instance().usedForIntraDiscom.get() != '') {
            state = Template.instance().usedForIntraDiscom.get();
        }
        if (state == 'Rajasthan' || state == 'Tamil Nadu' || state == 'Karnataka') {
            return false;
        } else {
            return true;
        }
    },
    "returnJsonAccess": function() {
        return Template.instance().userList.get();
    },
    "userSelected": function() {
        var data = Template.instance().spdListOpenAccess.get();
        var checkData = data.check_data;
        if (Template.instance().tempVar.get() != '') {
            checkData = Template.instance().tempVar.get();
        }
        if (checkData == 'No' && Template.instance().isUserSelected.get() != '') {
            return true;
        } else {
            return false;
        }
    },
    "isRegistereduserSelected": function() {
        var data = Template.instance().spdListOpenAccess.get();
        if (data.check_data == 'Yes' && Template.instance().isUserSelected.get() != '') {
            return true;
        } else {
            return false;
        }
    },
    "dataUsedForEditingHelper": function() {
        var data = Template.instance().usedForEditOption.get();
        if (data != '') {
            return data;
        } else {
            return false;
        }
    },
    "updateButtonShowAfterClickEditBtn": function() {
        var data = Template.instance().usedForEditOption.get();
        if (data != '') {
            return true;
        } else {
            return false;
        }
    },
    "helperUsedForViewData": function() {
        var returnData = Template.instance().usedForViewData.get();
        if (returnData != '') {
            return returnData;
        } else {
            return false;
        }
    },
    validationForViewSelectedState: function() {
        var discomState = Template.instance().spdListOpenAccess.get();
        var state = discomState.discom_state;
        if (state == 'Rajasthan' || state == 'Tamil Nadu' || state == 'Karnataka') {
            return true;
        } else {
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
    return function(table, name) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        window.location.href = uri + base64(format(template, ctx))
    }
})()

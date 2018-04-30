Template.viewJMRData.onCreated(function xyz() {
    this.getJMRDataVar = new ReactiveVar();
    this.uniqSPDStateListArr = new ReactiveVar;
    this.spdListArr = new ReactiveVar;
    this.checkAllAreSelected = new ReactiveVar(false);
    this.invoiceType = new ReactiveVar();
});

Template.viewJMRData.rendered = function abc() {

};

Template.viewJMRData.events({
    'change #ddlMonthForAdmin': function(e, instance) {
        $('#ddlFinancialYearForAdmin').val('');
        $('#ddlSPDStateList').val('');
        $('#ddlSPDList').val('');
        instance.uniqSPDStateListArr.set();
        instance.spdListArr.set();
        instance.checkAllAreSelected.set(false);
        instance.getJMRDataVar.set();
    },
    'change #ddlFinancialYearForAdmin': function(e, instance) {
        $('#ddlSPDStateList').val('');
        $('#ddlTypeForAdmin').val('');
        instance.getJMRDataVar.set();
        var financialYear = $(e.currentTarget).val();
        if (financialYear != '') {
            SessionStore.set("isLoading", true);
            Meteor.call("gettingSPLDStateListUniq", function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.uniqSPDStateListArr.set(result.data);
                        SessionStore.set("isLoading", false);
                    }
                }
            });
        } else {
            instance.spdListArr.set();
            instance.checkAllAreSelected.set(false);
        }
    },
    'change #ddlSPDStateList': function(e, instance) {
        $('#ddlSPDList').val('');
        $('#ddlTypeForAdmin').val('');
        instance.getJMRDataVar.set();
        var spdState = $(e.currentTarget).val();
        if (spdState != '') {
            SessionStore.set("isLoading", true);
            Meteor.call("gettingSPLDForJMRData", spdState, function(error, result) {
                if (error) {
                    SessionStore.set("isLoading", false);
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.spdListArr.set(result.data);
                        SessionStore.set("isLoading", false);
                    }
                }
            });
        } else {
            instance.spdListArr.set();
            instance.checkAllAreSelected.set(false);
        }
    },
    'change #ddlSPDList': function(e, instance) {
        $('#ddlTypeForAdmin').val('');
        instance.getJMRDataVar.set();
        var month = $('#ddlMonthForAdmin').val();
        var financialYear = $('#ddlFinancialYearForAdmin').val();
        var spdState = $('#ddlSPDStateList').val();
        var spd = $(e.currentTarget).val();
        if (month != '' && financialYear != '' && spdState != '' && spd != '') {
            instance.checkAllAreSelected.set(true);
        } else {
            instance.checkAllAreSelected.set(false);
        }
    },
    'change #ddlTypeForAdmin': function(e, instance) {
        var type = $(e.currentTarget).val();
        instance.invoiceType.set(type);
        var month = $('#ddlMonthForAdmin').val();
        var financialYear = $('#ddlFinancialYearForAdmin').val();
        var spdState = $('#ddlSPDStateList').val();
        var spdName = $('#ddlSPDList').val();
        var spdId = $("#ddlSPDList").find(':selected').attr("attrId");
        if (month != '' && financialYear != '' && spdState != '' && spdName != '' && type != '') {
            Meteor.call("getJMRDataMonthlyForAdmin", month, financialYear, spdState, spdName, type, spdId, function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.getJMRDataVar.set(result.data);
                    } else {
                        swal(result.message);
                        instance.getJMRDataVar.set();
                    }
                }
            });
        } else {
            instance.getJMRDataVar.set();
        }
    },
    'change #ddlMonth': function(e, instance) {
        $('#ddlFinancialYear').val('');
        $('#ddlType').val('');
        instance.getJMRDataVar.set();
    },
    'change #ddlFinancialYear': function(e, instance) {
        $('#ddlType').val('');
        instance.getJMRDataVar.set();
    },
    'change #ddlType': function(e, instance) {
        var type = $(e.currentTarget).val();
        instance.invoiceType.set(type);
        var month = $('#ddlMonth').val();
        var financialYear = $('#ddlFinancialYear').val();
        if (month != '' && financialYear != '' && type != '') {
            Meteor.call("getJMRDataMonthly", month, financialYear, type, function(error, result) {
                if (error) {
                    swal("Oops...", "Please try again!", "error");
                } else {
                    if (result.status) {
                        instance.getJMRDataVar.set(result.data);
                    } else {
                        swal(result.message);
                        instance.getJMRDataVar.set();
                    }
                }
            });
        } else {
            swal('All fields are required!');
            instance.getJMRDataVar.set();
        }
    },
    "click #exportJMRData": function(e, instance) {
        var month = $('#ddlMonthForAdmin').val();
        var financialYear = $('#ddlFinancialYearForAdmin').val();
        var name = $('#ddlTypeForAdmin').val();
        var nameUsedForExcel = name + '_' + financialYear + '_' + month;
        tableToExcel('exportJMRDataFromTable', 'SHEET1', nameUsedForExcel);
    },
});

Template.viewJMRData.helpers({
    monthShow() {
        return monthReturn();
    },
    yearShow() {
        return yearReturn();
    },
    serial(index) {
        return index + 1;
    },
    spdStateList() {
        if (Template.instance().uniqSPDStateListArr.get()) {
            return Template.instance().uniqSPDStateListArr.get();
        } else {
            return false;
        }
    },
    allSPDListArr() {
        if (Template.instance().spdListArr.get()) {
            return Template.instance().spdListArr.get();
        } else {
            return false;
        }
    },
    restAllFieldsAreSelected() {
        if (Template.instance().checkAllAreSelected.get()) {
            return true;
        } else {
            return false;
        }
    },
    returnDataHelper() {
        if (Template.instance().getJMRDataVar.get()) {
            return true;
        } else {
            return false;
        }
    },
    returnData() {
        if (Template.instance().getJMRDataVar.get()) {
            return Template.instance().getJMRDataVar.get();
        } else {
            return false;
        }
    },
    invType() {
        if (Template.instance().invoiceType.get()) {
            return Template.instance().invoiceType.get();
        } else {
            return false;
        }
    },
    invoiceTypeForTableJMR() {
        if (Template.instance().invoiceType.get() == 'JMR') {
            return true;
        } else {
            return false;
        }
    },
    invoiceTypeForTableSEAandREA() {
        if (Template.instance().invoiceType.get() == 'SEA' || Template.instance().invoiceType.get() == 'REA') {
            return true;
        } else {
            return false;
        }
    },
    isComericalUserForViewJMRData() {
        if (Meteor.userId()) {
            if (Meteor.user().profile.user_type == 'master' || Meteor.user().profile.user_type == 'commercial') {
                return true;
            } else {
                return false;
            }
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
    return function(table, name, nameUsedForExcel) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
                worksheet: name || 'Worksheet',
                table: table.innerHTML
            }
            // dynamic name in excelname
        var excelname = nameUsedForExcel + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

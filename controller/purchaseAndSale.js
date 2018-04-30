import {ReactiveVar} from 'meteor/reactive-var';

Template.purchase_sale.onCreated(function ss() {
    this.monthAndYearSelected = new ReactiveVar(false);
    this.isAllDataAvailable = new ReactiveVar(false);
    this.summaryData = new ReactiveVar(false);
});
Template.purchase_sale.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.purchase_sale.events({
    "change #ddlMonth": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
            instance.isAllDataAvailable.set(false);
        }
    },
    "change #ddlYear": function(e, instance) {
        instance.isAllDataAvailable.set(false);
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            instance.monthAndYearSelected.set(true);
        } else {
            instance.monthAndYearSelected.set(false);
        }
    },
    "click #viewBtn": function(e, instance) {
        instance.summaryData.set('');
        instance.isAllDataAvailable.set(false);
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        if (monthVar != '' && yearVar != '') {
            Meteor.call("getSummary", monthVar, yearVar, function(error, result) {
                if (error) {
                    swal("Please try again !");
                } else {
                    if (result.status) {
                        console.log(result.data);
                        instance.isAllDataAvailable.set(true);
                        instance.summaryData.set(result.data);
                    }
                }
            });
        } else {
            swal("All fields are required!");
        }
    },
    "click #exportPurchaseAndSaleSheet": function(e, instance) {
        var monthVar = $('#ddlMonth').val();
        var yearVar = $('#ddlYear').val();
        // tableToExcel('purchaseAndSaleTable', 'SHEET1', monthVar, yearVar);
        var json = instance.summaryData.get();
        Meteor.call("createExcelForSellAndPurchase",monthVar,yearVar,json, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                    console.log(result.data);
                    window.open('/upload/'+result.data);
                }
            }
        });
    }
});

Template.purchase_sale.helpers({
    monthShow() {
        return monthReturn();
    },
    yearHelper() {
        return dynamicYear();
    },
    returnJson() {
        if (Template.instance().summaryData.get()) {
            return Template.instance().summaryData.get();
        }
    },
    isMonthAndYearSelected() {
        if (Template.instance().monthAndYearSelected.get()) {
            return true;
        } else {
            return false;
        }
    },
    isAllDataAvailable() {
        if (Template.instance().isAllDataAvailable.get()) {
            return true;
        } else {
            return false;
        }
    },
    indexHelper(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            if (index == 0) {
                var toReturn = ''
                ary.forEach(function(item, value) {
                    if (item.discomState == state) {
                        toReturn = item.discom_short;
                    }
                })
                return toReturn;
            } else {
                return '';
            }
        }
    },
    returnSold(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            var toReturn = ''
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    toReturn = item.soldUnits;
                }
            })
            return toReturn[index];
        }
    },
    indexHelperGoa(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            var toReturn = ''
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    toReturn = item.discom_short;
                }
            })
            return toReturn[index];
        }
    },
    returnSoldForMP(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            var thisId = '';
            var thisUnits = '';
            var toReturn = 0;
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    thisId = item.spdList;
                    thisUnits = item.soldUnits;
                }
            })
            _.each(thisUnits, function(i, v) {
                if (i.spdId == thisId[index].spdId) {
                    toReturn = i.units;
                }
            })
            return toReturn;
        }
    },
    returnDifferenceMP(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            var thisId = '';
            var thisUnits = '';
            var toReturn = 0;
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    thisId = item.spdList;
                    thisUnits = item.soldUnits;
                }
            })
            _.each(thisUnits, function(i, v) {
                if (i.spdId == thisId[index].spdId) {
                    toReturn = i.differenceValue;
                }
            })
            return toReturn;
        }
    },
    returnDifferenceMaha(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            if (index > 0) {
                var thisId = '';
                var thisUnits = '';
                var toReturn = 0;
                ary.forEach(function(item, value) {
                    if (item.discomState == state) {
                        thisId = item.spdList;
                        thisUnits = item.soldUnits;
                    }
                })
                _.each(thisUnits, function(i, v) {
                    if (i.spdId == thisId[index].spdId) {
                        toReturn = i.differenceValue;
                    }
                })
                return toReturn;
            }
        }
    },
    returnSoldOdisha(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            var toReturn = ''
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    toReturn = item.soldUnits;
                }
            })
            if (index == 0) {
                var ret = '0';
                _.each(toReturn, function(item, value) {
                    if (item.spdState == 'Rajasthan') {
                        ret = item.units;
                    }
                })
                return ret;
            } else if (index == 1) {
                var ret = 0
                _.each(toReturn, function(item, value) {
                    if (item.spdState == 'Gujarat') {
                        ret = item.units;
                    }
                })
                return ret;
            }
        }
    },
    returnSoldBihar(index, ary, state, city) {
        if (Template.instance().isAllDataAvailable.get()) {
            var toReturn = ''
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    toReturn = item.soldUnits;
                }
            })
            var ret = '0';
            _.each(toReturn, function(item, value) {
                if (item.spdState == city) {
                    ret = item.units;
                }
            })
            return ret;
        }
    },
    stateHead(ary, state) {
        if (ary) {
            var toReturn = ''
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    toReturn = item.spdList;
                }
            })
            return toReturn;
        }
    },
    returnDifferenceOdisha(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            if (index == 1) {
                var toReturn = ''
                ary.forEach(function(item, value) {
                    if (item.discomState == state) {
                        toReturn = item.difference;
                    }
                })
                return toReturn;
            }
        }
    },
    returnDifference(index, ary, state) {
        if (Template.instance().isAllDataAvailable.get()) {
            if (index == 0) {
                var toReturn = ''
                ary.forEach(function(item, value) {
                    if (item.discomState == state) {
                        toReturn = item.difference;
                    }
                })
                return toReturn;
            }
        }
    },
    stateShortName(ary, state) {
        if (ary) {
            var toReturn = ''
            ary.forEach(function(item, value) {
                if (item.discomState == state) {
                    toReturn = item.discom_short;
                }
            })
            return toReturn;
        }
    },
    serialNum(index){
      return Number(index)+1
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
    return function(table, name, monthVar, yearVar) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = 'purchase and sale report_'+monthVar + '_' + yearVar + ".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()

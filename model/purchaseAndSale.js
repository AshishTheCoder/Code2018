Meteor.methods({
    getSummary(month, year) {
        var allAry = [];
        _.each(Discom.find().fetch(), function(item, key) {
            allAry.push({
                discomState: item.discom_state,
                discomId: item._id,
                discom_short: item.discom_short_name,
                spdList: item.spdIds
            });
        });

        //removing azure power mars and green energy from users////
        var removeKey = '';
        var removeKey1 = '';
        var removeKey2 = '';
        _.each(allAry, function(item, value) {
            if (item.discomState == 'Odisha') {
                var listary = [];
                _.each(item.spdList, function(i, key) {
                    if (key == 5) {} else {
                        listary.push(i);
                    }
                })
                item.spdList = listary;
            }
            if (item.discomState == 'Rajasthan(APMPL)') {
                removeKey = value;
            }
            if (item.discomState == 'New Delhi') {
                removeKey1 = value;
            }
            if (item.discomState == "New Delhi(NTPC)") {
                removeKey2 = value;
            }
        })
        allAry.splice(removeKey2, 1);
        allAry.splice(removeKey, 1);
        allAry.splice(removeKey1, 1);
        var totalBilledUnits = [];
        var totalSoldUnits = [];
        _.each(allAry, function(item) {
            var arySold = [];
            if (item.discomState == 'Rajasthan') {
                var RajData = LogbookDiscom.find({
                    discomId: item.discomId,
                    year: year,
                    month: month,
                    $or: [{
                        invoice_type: 'Credit'
                    }, {
                        invoice_type: 'Debit'
                    }]
                }).fetch();
                _.each(RajData, function(i) {
                    arySold.push(i.actual_energy);
                    totalSoldUnits.push(i.actual_energy);
                })
                if (arySold.length < 3) {
                    arySold.push(0);
                }
            } else if (item.discomState == 'Bihar' || item.discomState == 'Odisha' || item.discomState == 'MP') {
                if (LogbookDiscom.find({discomId: item.discomId,invoice_type: 'Provisional_Invoice',month: month}).count() > 0) {
                    var elseData = LogbookDiscom.find({discomId: item.discomId,invoice_type: 'Provisional_Invoice',month: month,year: year}).fetch();
                    if (item.discomState == 'MP') {
                        _.each(elseData, function(i, k) {
                            totalSoldUnits.push(i.total_energy);
                            arySold.push({
                                spdState: i.invoice_from,
                                units: i.total_energy,
                                spdId: i.spdId
                            });
                        })
                    } else {
                        _.each(elseData, function(i, k) {
                            totalSoldUnits.push(i.total_energy);
                            arySold.push({
                                spdState: i.invoice_from,
                                units: i.total_energy
                            });
                        })
                    }
                } else {
                    arySold.push(0);
                }
            } else if (item.discomState == 'Maharashtra') {
                var MahaData = LogbookDiscom.find({
                    discomId: item.discomId,
                    year: year,
                    month: month,
                    $or: [{
                        invoice_type: 'Credit'
                    }, {
                        invoice_type: 'Debit'
                    }]
                }).fetch();
                _.each(MahaData, function(i) {
                    totalSoldUnits.push(i.total_energy);
                    arySold.push({
                        spdState: i.invoice_from,
                        units: i.total_energy,
                        spdId: i.spdId
                    });
                })
            } else {
                if (LogbookDiscom.findOne({
                        discomId: item.discomId,
                        invoice_type: 'Provisional_Invoice',
                        month: month,
                        year: year,
                    })) {
                    totalSoldUnits.push(LogbookDiscom.findOne({
                        discomId: item.discomId,
                        invoice_type: 'Provisional_Invoice',
                        month: month,
                        year: year,
                    }).total_energy);
                    arySold.push(LogbookDiscom.findOne({
                        discomId: item.discomId,
                        invoice_type: 'Provisional_Invoice',
                        month: month,
                        year: year,
                    }).total_energy);
                } else {
                    arySold.push(0);
                }
            }
            item.soldUnits = arySold;

            _.each(item.spdList, function(i) {
                if (LogBookSpd.findOne({
                        month: month,
                        year: year,
                        clientId: i.spdId
                    })) {
                    i.billedUnits = LogBookSpd.findOne({
                        month: month,
                        year: year,
                        clientId: i.spdId
                    }).billedUnits;
                    totalBilledUnits.push(LogBookSpd.findOne({
                        month: month,
                        year: year,
                        clientId: i.spdId
                    }).billedUnits);
                } else {
                    i.billedUnits = 0;
                }
            })
        })

        var mainArray = [];
        var purchaseRaj = [];
        var soldRaj = [];
        _.each(allAry, function(item, key) {
            var aryFrom = ''
            if (item.discomState == 'Odisha') {
                var midAry = [];
                _.each(item.soldUnits, function(i, k) {
                    if (i.spdState == 'Gujarat') {
                        midAry.push(i.units)
                    } else {
                        soldRaj.push(i.units);
                    }
                })
                aryFrom = midAry;
            } else if (item.discomState == 'Bihar' || item.discomState == 'MP') {
                var midAry = [];
                _.each(item.soldUnits, function(i, k) {
                    midAry.push(i.units)
                })
                aryFrom = midAry;
            } else {
                aryFrom = item.soldUnits
            }

            if (_.contains([
                    'Delhi(TPDDL)',
                    'Assam',
                    'Haryana',
                    'Himachal Pradesh',
                    'Delhi(BRPL)',
                    'Delhi(BYPL)',
                    'Jharkhand',
                    'Punjab'
                ], item.discomState)) {
                soldRaj.push(item.soldUnits[0]);
            }

            var aryTo = [];
            _.each(item.spdList, function(i) {
                if (i.spdState == 'Rajasthan') {
                    purchaseRaj.push(i.billedUnits);
                } else {
                    aryTo.push(i.billedUnits)
                }
            })
            if (Number(sumOfArray(aryTo) - sumOfArray(aryFrom)).toFixed(2) == 'NaN') {
                item.difference = 0;
            } else {
                item.difference = Number(sumOfArray(aryTo) - sumOfArray(aryFrom)).toFixed(2);
            }
        })
        var rajTopTotal = ''
        allAry.forEach(function(item, value) {
            if (item.discomState == 'MP' || item.discomState == 'Maharashtra') {
                _.each(item.spdList, function(i, v) {
                    _.each(item.soldUnits, function(s, q) {
                        if (i.spdId == s.spdId) {
                            s.differenceValue = Number(i.billedUnits) - Number(s.units);
                        }
                        if (v == 0 && s.spdState == 'JsonTodayGreen') {
                            soldRaj.push(s.units);
                        }
                    })
                })
            } else if (item.discomState == 'Rajasthan') {
                rajTopTotal = Number(sumOfArray(item.soldUnits)).toFixed(2);
            }
        })

        //manupulating for goa///;
        var cutSpd = '';
        var cutSold = '';
        var copyShortName = ''
        var MPId = '';
        var spdKey = '';
        var soldKey = '';
        _.each(allAry, function(item, key) {
            if (item.discomState == 'Maharashtra') {
                _.each(item.spdList, function(i, k) {
                    if (k == 4) {
                        MPId = i.spdId
                        spdKey = k;
                    }
                })
                _.each(item.soldUnits, function(i, k) {
                    if (i.spdId == MPId) {
                        soldKey = k;
                    }
                })
                cutSold = item.soldUnits.splice(soldKey, 1);
                cutSpd = item.spdList.splice(spdKey, 1);
                copyShortName = item.discom_short;
            }
        })
        _.each(allAry, function(item, key) {
            if (item.discomState == 'Goa') {
                if (cutSpd.length > 0) {
                    item.spdList.splice(0, 0, cutSpd[0]);
                }
                if (cutSold.length > 0) {
                    item.soldUnits.splice(0, 0, cutSold[0].units);
                }else{
                    item.soldUnits.splice(0, 0, 0);
                }
                var sAry = [];
                _.each(item.spdList, function(s, v) {
                    sAry.push(s.billedUnits)
                })
                item.difference = Number((sumOfArray(sAry)) - Number(sumOfArray(item.soldUnits))).toFixed(2);
                var shortAry = [copyShortName, item.discom_short];
                item.discom_short = shortAry;
            } else if (item.discomState == 'Rajasthan') {
                if (Number(sumOfArray(purchaseRaj) - (Number(rajTopTotal) + sumOfArray(soldRaj))).toFixed(2) == 'NaN') {
                    item.difference = 0;
                } else {
                    item.difference = Number(sumOfArray(purchaseRaj) - (Number(rajTopTotal) + sumOfArray(soldRaj))).toFixed(2);
                }
            } else if (item.discomState == 'MP') {
                var billAry = [];
                _.each(item.spdList, function(s, v) {
                    if (v == 1 || v == 2 || v == 3) {
                        billAry.push(s.billedUnits)
                    }
                })
                _.each(item.soldUnits, function(s, v) {
                    if (s.spdState == 'cleanSolarJson') {
                        s.differenceValue = Number(sumOfArray(billAry) - Number(s.units))
                    }
                })
            }
        });
        var calcuateJson = {
            billedUnits: totalBilledUnits,
            purchaseRaj: purchaseRaj,
            purchaseRajTotalLeft: Number(sumOfArray(purchaseRaj)).toFixed(2),
            soldRaj: soldRaj,
            soldRajTotalRight: Number(sumOfArray(soldRaj)).toFixed(2),
            rajTopTotal: rajTopTotal
        }
        console.log(totalSoldUnits.length);
        console.log('----------------------------------------------------------------');
        console.log(totalSoldUnits);
        console.log('----------------------------------------------------------------');

        var columnTotalVar = getColumnTotal(allAry);
        var toReturn = {
            calcuateJson: calcuateJson,
            stateUsers: allAry,
            totalBilledUnits: Number(sumOfArray(totalBilledUnits)).toFixed(2),
            totalSoldUnits: Number(sumOfArray(totalSoldUnits)).toFixed(2),
            differenceTotalCol:columnTotalVar,
            totalDifference: Number((sumOfArray(totalBilledUnits)) - Number(sumOfArray(totalSoldUnits))).toFixed(2),
            monthNumber: month,
            monthWord: monthInWords(month),
            year: year
        }
        return returnSuccess("Got summary sheet for: " + month + ',' + year, toReturn);
    },
    createExcelForSellAndPurchase(month, year, json) {
        var period = monthInWords(month) + "'" + year;
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/', 'purchase_sale/purchaseAndSaleReport_' + monthInWords(month) + '_' + year +'_'+random+ '.xlsx');
        var sheet1 = workbook.createSheet('sheet1', 100, 126);
        sheet1.set(1, 1, 'Summary Sheet of Units Purchased Versus Units Sold for ' + period);
        sheet1.font(1, 1, {sz:'14',bold:'true'});
        sheet1.align(1, 1, 'center');
        sheet1.merge({
            col: 1,
            row: 1
        }, {
            col: 6,
            row: 1
        });

        sheet1.width(1, 15);

        sheet1.width(2, 35);
        sheet1.height(1, 25);

        sheet1.width(3, 20);
        sheet1.height(2, 21);

        sheet1.width(4, 24);
        sheet1.height(3, 17);

        sheet1.width(5, 20);
        // sheet1.height(4, 25);

        sheet1.width(6, 20);
        // sheet1.height(1, 25);

        sheet1.set(1, 2, 'S.No.');
        sheet1.align(1, 2, 'center');
        sheet1.valign(1, 2, 'center');
        sheet1.font(1, 2, {sz:'11', bold:'true'});
        sheet1.merge({
            col: 1,
            row: 2
        }, {
            col: 1,
            row: 3
        });

        sheet1.set(2, 2, 'Units Purchased JMR/SEA/REA');
        sheet1.align(2, 2, 'center');
        sheet1.font(2, 2, {sz:'11', bold:'true'});
        sheet1.merge({
            col: 2,
            row: 2
        }, {
            col: 3,
            row: 2
        });
        sheet1.set(4, 2, 'Units Sold');
        sheet1.font(4, 2, {sz:'11', bold:'true'});
        sheet1.align(4, 2, 'center');
        sheet1.merge({
            col: 4,
            row: 2
        }, {
            col: 5,
            row: 2
        });
        sheet1.set(6, 2, " ");
        sheet1.align(6, 2, 'center');
        sheet1.set(2, 3, 'Name of SPD');
        sheet1.font(2, 3, {sz:'11', bold:'true'});
        sheet1.align(2, 3, 'center');
        sheet1.set(3, 3, 'Total Units (kWh)');
        sheet1.font(3, 3, {sz:'11', bold:'true'});
        sheet1.align(3, 3, 'center');
        sheet1.set(4, 3, 'Buying Utility');
        sheet1.font(4, 3, {sz:'11', bold:'true'});
        sheet1.align(4, 3, 'center');
        sheet1.set(5, 3, 'No. of Units (kWh)');
        sheet1.font(5, 3, {sz:'11', bold:'true'});
        sheet1.align(5, 3, 'center');
        sheet1.set(6, 3, 'Difference');
        sheet1.font(6, 3, {sz:'11', bold:'true'});
        sheet1.align(6, 3, 'center');

        var dataArr = salePurchaseSPDArr(json);
        for (var i = 4; i < dataArr.length + 4; i++) {
            if (dataArr[i - 4].discomState == 'Bihar') {
                sheet1.set(2, i, dataArr[i - 4].spdName);
                sheet1.merge({
                    col: 2,
                    row: i
                }, {
                    col: 2,
                    row: i + 1
                });
                sheet1.set(3, i, Number(dataArr[i - 4].billedUnits));
                sheet1.align(3, i, 'center');
                sheet1.merge({
                    col: 3,
                    row: i
                }, {
                    col: 3,
                    row: i + 1
                });

            } else {
                sheet1.set(2, i, dataArr[i - 4].spdName);
                sheet1.set(3, i, Number(dataArr[i - 4].billedUnits));
                sheet1.align(3, i, 'center');
            }

        }
        // for Rajasthan Discom
        sheet1.set(4, 4, dataArr[0].discom_short);
        sheet1.align(4, 4, 'center');
        sheet1.merge({
            col: 4,
            row: 4
        }, {
            col: 4,
            row: 10
        });
        // for Haryana Discom
        sheet1.set(4, 11, dataArr[7].discom_short);
        sheet1.align(4, 11, 'center');
        sheet1.merge({
            col: 4,
            row: 11
        }, {
            col: 4,
            row: 13
        });
        // for Himachal Pradesh Discom
        sheet1.set(4, 14, dataArr[10].discom_short);
        sheet1.align(4, 14, 'center');
        // for DELHI BRPL Discom
        sheet1.set(4, 15, dataArr[11].discom_short);
        sheet1.align(4, 15, 'center');
        // for DELHI BYPL Discom
        sheet1.set(4, 16, dataArr[12].discom_short);
        sheet1.align(4, 16, 'center');
        // for DELHI TPDDL Discom
        sheet1.set(4, 17, dataArr[13].discom_short);
        sheet1.align(4, 17, 'center');
        // for Assam Discom
        sheet1.set(4, 18, dataArr[14].discom_short);
        sheet1.align(4, 18, 'center');
        // for Odisha Discom
        sheet1.set(4, 19, dataArr[15].discom_short);
        sheet1.align(4, 19, 'center');
        sheet1.merge({
            col: 4,
            row: 19
        }, {
            col: 4,
            row: 23
        });
        // for Punjab Discom
        sheet1.set(4, 24, dataArr[20].discom_short);
        sheet1.align(4, 24, 'center');
        sheet1.merge({
            col: 4,
            row: 24
        }, {
            col: 4,
            row: 26
        });

        // for Maharashtra Discom
        sheet1.set(4, 27, dataArr[23].discom_short);
        sheet1.align(4, 27, 'center');
        sheet1.merge({
            col: 4,
            row: 27
        }, {
            col: 4,
            row: 30
        });
        // for Maharashtra Discom
        sheet1.set(4, 31, dataArr[23].discom_short);
        sheet1.align(4, 31, 'center');
        // for Goa Discom
        sheet1.set(4, 32, dataArr[28].discom_short[1]);
        sheet1.align(4, 32, 'center');
        // for Jharkhand Discom
        sheet1.set(4, 33, dataArr[29].discom_short);
        sheet1.align(4, 33, 'center');
        // for MP Discom
        sheet1.set(4, 34, dataArr[30].discom_short);
        sheet1.align(4, 34, 'center');
        sheet1.merge({
            col: 4,
            row: 34
        }, {
            col: 4,
            row: 40
        });
        // for Chhattisgarh Discom
        sheet1.set(4, 41, dataArr[37].discom_short);
        sheet1.align(4, 41, 'center');
        sheet1.merge({
            col: 4,
            row: 41
        }, {
            col: 4,
            row: 42
        });
        // for Tamil Nadu Discom
        sheet1.set(4, 43, dataArr[39].discom_short);
        sheet1.align(4, 43, 'center');
        // for Karnataka Discom
        sheet1.set(4, 44, dataArr[40].discom_short);
        sheet1.align(4, 44, 'center');
        // for Bihar Discom
        sheet1.set(4, 45, dataArr[41].discom_short);
        sheet1.align(4, 45, 'center');
        sheet1.merge({
            col: 4,
            row: 45
        }, {
            col: 4,
            row: 46
        });
        // for Rajasthan Discom Build Units
        for (var j = 4; j < 11; j++) {
            if (j <= 6) {
                if (dataArr[0].soldUnits.length > 1) {
                    sheet1.set(5, j, Number(dataArr[0].soldUnits[j - 4]));
                } else {
                    sheet1.set(5, j, 0);
                }
            }
            sheet1.align(5, j, 'center');
        }
        // for Haryana Discom Units
        sheet1.set(5, 11, Number(dataArr[7].soldUnits[0]));
        sheet1.align(5, 11, 'center');
        sheet1.merge({
            col: 5,
            row: 11
        }, {
            col: 5,
            row: 13
        });
        // for Himachal Pradesh Discom Units
        sheet1.set(5, 14, Number(dataArr[10].soldUnits[0]));
        sheet1.align(5, 14, 'center');
        // for DELHI BRPL Discom Units
        sheet1.set(5, 15, Number(dataArr[11].soldUnits[0]));
        sheet1.align(5, 15, 'center');
        // for DELHI BYPL Discom Units
        sheet1.set(5, 16, Number(dataArr[12].soldUnits[0]));
        sheet1.align(5, 16, 'center');
        // for DELHI TPDDL Discom Units
        sheet1.set(5, 17, Number(dataArr[13].soldUnits[0]));
        sheet1.align(5, 17, 'center');
        // for Assam Discom Units
        sheet1.set(5, 18, Number(dataArr[14].soldUnits[0]));
        sheet1.align(5, 18, 'center');
        // for Rajasthan Odisha Sold  Units
        if (dataArr[15].soldUnits.length > 1) {
            sheet1.set(5, 19, Number(dataArr[15].soldUnits[1].units));
            sheet1.set(5, 20, Number(dataArr[15].soldUnits[0].units));
        } else {
            sheet1.set(5, 19, Number(dataArr[15].soldUnits[0]));
            sheet1.set(5, 20, Number(dataArr[15].soldUnits[0]));
        }
        // for Rajasthan Odisha design
        sheet1.align(5, 19, 'center');
        // for Gujarat Odisha Sold  Units
        sheet1.align(5, 20, 'center');
        sheet1.merge({
            col: 5,
            row: 20
        }, {
            col: 5,
            row: 23
        });
        // for Punjab Sold Units
        sheet1.set(5, 24, Number(dataArr[20].soldUnits[0]));
        sheet1.align(5, 24, 'center');
        sheet1.merge({
            col: 5,
            row: 24
        }, {
            col: 5,
            row: 26
        });

        // for Maharashtra Sold  Units
        if (dataArr[25].soldUnits.length > 1) {
            sheet1.set(5, 27, Number(dataArr[25].soldUnits[0].units));
            sheet1.set(5, 28, Number(dataArr[25].soldUnits[1].units));
            sheet1.set(5, 29, Number(dataArr[25].soldUnits[2].units));
            sheet1.set(5, 30, Number(dataArr[25].soldUnits[3].units));
        } else {
            sheet1.set(5, 27, 0);
            sheet1.set(5, 28, 0);
            sheet1.set(5, 29, 0);
            sheet1.set(5, 30, 0);
        }
        // for Maharashtra Sold Units
        sheet1.align(5, 27, 'center');
        // for Maharashtra Sold Units
        sheet1.align(5, 28, 'center');
        // for Maharashtra Sold Units
        sheet1.align(5, 28, 'center');
        // for Maharashtra Sold Units
        sheet1.align(5, 29, 'center');
        // for Maharashtra Sold Units
        sheet1.align(5, 30, 'center');
        // for GOA Sold Units
        if (dataArr[28].soldUnits.length > 1) {
            sheet1.set(5, 31, Number(dataArr[28].soldUnits[0]));
            sheet1.set(5, 32, Number(dataArr[28].soldUnits[1]));
        } else {
            sheet1.set(5, 31, 0);
            sheet1.set(5, 32, 0);
        }
        // for GOA Sold Units
        sheet1.align(5, 31, 'center');
        // for GOA Sold Units
        sheet1.align(5, 32, 'center');
        // for Jharkhand Sold Units
        sheet1.set(5, 33, Number(dataArr[29].soldUnits[0]));
        sheet1.align(5, 33, 'center');
        // for MP Sold Units
        if (dataArr[30].soldUnits.length > 1) {
            sheet1.set(5, 34, Number(dataArr[30].soldUnits[4].units));
            sheet1.set(5, 35, Number(dataArr[30].soldUnits[0].units));
            sheet1.set(5, 38, Number(dataArr[30].soldUnits[3].units));
            sheet1.set(5, 39, Number(dataArr[30].soldUnits[1].units));
            sheet1.set(5, 40, Number(dataArr[30].soldUnits[2].units));
        } else {
            sheet1.set(5, 34, 0);
            sheet1.set(5, 35, 0);
            sheet1.set(5, 38, 0);
            sheet1.set(5, 39, 0);
            sheet1.set(5, 40, 0);
        }
        sheet1.align(5, 34, 'center');
        sheet1.align(5, 35, 'center');
        sheet1.merge({
            col: 5,
            row: 35
        }, {
            col: 5,
            row: 37
        });
        sheet1.align(5, 38, 'center');
        sheet1.align(5, 39, 'center');
        sheet1.align(5, 40, 'center');
        // for Chhattisgarh Discom soldUnits
        sheet1.set(5, 41, Number(dataArr[37].soldUnits[0]));
        sheet1.align(5, 41, 'center');
        sheet1.merge({
            col: 5,
            row: 41
        }, {
            col: 5,
            row: 42
        });
        // for Tamil Nadu Discom soldUnits
        sheet1.set(5, 43, Number(dataArr[39].soldUnits[0]));
        sheet1.align(5, 43, 'center');
        // for Tamil Nadu Discom soldUnits
        sheet1.set(5, 44, Number(dataArr[40].soldUnits[0]));
        sheet1.align(5, 44, 'center');
        // for Bihar Discom soldUnits
        if (dataArr[41].soldUnits.length > 1) {
            sheet1.set(5, 45, Number(dataArr[41].soldUnits[0].units));
            sheet1.set(5, 46, Number(dataArr[41].soldUnits[1].units));
        } else {
            sheet1.set(5, 45, Number(dataArr[41].soldUnits[0]));
            sheet1.set(5, 46, Number(dataArr[41].soldUnits[0]));
        }
        // for Bihar Discom soldUnits
        sheet1.align(5, 45, 'center');
        sheet1.align(5, 46, 'center');
        // for Rajasthan Discom difference
        sheet1.set(6, 4, Number(dataArr[0].difference));
        sheet1.align(6, 4, 'center');
        sheet1.merge({
            col: 6,
            row: 4
        }, {
            col: 6,
            row: 10
        });
        // // for Haryana Discom difference
        // sheet1.set(5, 11, '');
        // sheet1.align(5, 11, 'center');
        sheet1.merge({
            col: 6,
            row: 11
        }, {
            col: 6,
            row: 13
        });



        // // for Himachal Pradesh Discom difference
        // sheet1.set(5, 14, '');
        // sheet1.align(5, 14, 'center');
        // // for DELHI BRPL Discom difference
        // sheet1.set(5, 15, '');
        // sheet1.align(5, 15, 'center');
        // // for DELHI BYPL Discom difference
        // sheet1.set(5, 16, '');
        // sheet1.align(5, 16, 'center');
        // // for DELHI TPDDL Discom difference
        // sheet1.set(5, 17, '');
        // sheet1.align(5, 17, 'center');
        // // for Assam Discom difference
        // sheet1.set(5, 18, '');
        // sheet1.align(5, 18, 'center');
        // // for for Rajasthan Odisha Discom difference
        // sheet1.set(5, 19, '');
        // sheet1.align(5, 19, 'center');
        // // for Gujarat Odisha Discom difference




        sheet1.set(6, 20, Number(dataArr[17].difference));
        sheet1.align(6, 20, 'center');
        sheet1.merge({
            col: 6,
            row: 20
        }, {
            col: 6,
            row: 23
        });

        // // for Punjab Discom difference
        // sheet1.set(5, 24, '');
        // sheet1.align(5, 24, 'center');


        sheet1.merge({
            col: 6,
            row: 24
        }, {
            col: 6,
            row: 26
        });

        // // for Rajasthan Maharashtra Discom difference
        // sheet1.set(5, 27, '');
        // sheet1.align(5, 27, 'center');


        // for Maharashtra Sold  Units
        if (dataArr[25].soldUnits.length > 1) {
            sheet1.set(6, 28, Number(dataArr[25].soldUnits[1].differenceValue));
            sheet1.set(6, 29, Number(dataArr[25].soldUnits[2].differenceValue));
            sheet1.set(6, 30, Number(dataArr[25].soldUnits[3].differenceValue));
        } else {
            sheet1.set(6, 28, 0);
            sheet1.set(6, 29, 0);
            sheet1.set(6, 30, 0);
        }

        // for  Maharashtra Discom difference
        sheet1.align(6, 28, 'center');
        // for  Maharashtra Discom difference
        sheet1.align(6, 29, 'center');
        // for Maharashtra Discom difference
        sheet1.align(6, 30, 'center');


        // for Goa and Maharashtra Discom difference
        sheet1.set(6, 31, Number(dataArr[28].difference));
        sheet1.align(6, 31, 'center');
        sheet1.merge({
            col: 6,
            row: 31
        }, {
            col: 6,
            row: 32
        });

        // // for Jharkhand Discom difference
        // sheet1.set(5, 33, '');
        // sheet1.align(5, 33, 'center');

        // for MP Discom difference
        if (dataArr[31].soldUnits.length > 1) {
            sheet1.set(6, 34, Number(dataArr[30].soldUnits[4].differenceValue));
            sheet1.set(6, 35, Number(dataArr[31].soldUnits[0].differenceValue));
            sheet1.set(6, 38, Number(dataArr[32].soldUnits[3].differenceValue));
            sheet1.set(6, 39, Number(dataArr[33].soldUnits[1].differenceValue));
            sheet1.set(6, 40, Number(dataArr[34].soldUnits[2].differenceValue));
        } else {
            sheet1.set(6, 34, 0);
            sheet1.set(6, 35, 0);
            sheet1.set(6, 38, 0);
            sheet1.set(6, 39, 0);
            sheet1.set(6, 40, 0);
        }
        // for MP Discom difference
        sheet1.align(6, 34, 'center');
        // for MP Discom difference
        sheet1.align(6, 35, 'center');
        sheet1.merge({
            col: 6,
            row: 35
        }, {
            col: 6,
            row: 37
        });
        // for MP Discom difference
        sheet1.align(6, 38, 'center');
        // for MP Discom difference
        sheet1.align(6, 39, 'center');
        // for MP Discom difference
        sheet1.align(6, 40, 'center');
        // for Chhattisgarh Discom difference
        sheet1.set(6, 41, Number(dataArr[37].difference));
        sheet1.align(6, 41, 'center');
        sheet1.merge({
            col: 6,
            row: 41
        }, {
            col: 6,
            row: 42
        });





        // for Tamil Nadu Discom difference
        sheet1.set(6, 43, Number(dataArr[39].difference));
        sheet1.align(6, 43, 'center');
        // for Karnataka Discom difference
        sheet1.set(6, 44, Number(dataArr[40].difference));
        sheet1.align(6, 44, 'center');
        // for Bihar Discom difference
        sheet1.set(6, 45, Number(dataArr[41].difference));
        sheet1.align(6, 45, 'center');
        sheet1.merge({
            col: 6,
            row: 45
        }, {
            col: 6,
            row: 46
        });
        // for Final Total
        sheet1.set(2, 47, 'Total');
        sheet1.font(2, 47, {bold:'true'});
        sheet1.align(2, 47, 'center');
        // for Final Total SPD
        sheet1.set(3, 47, Number(json.totalBilledUnits));
        sheet1.align(3, 47, 'center');

        // // for blank
        // sheet1.set(3, 47, '');
        // sheet1.align(3, 47, 'center');

        // for Final Total Discom
        sheet1.set(5, 47, Number(json.totalSoldUnits));
        sheet1.align(5, 47, 'center');
        // for Final Total Difference
        sheet1.set(6, 47, '('+json.differenceTotalCol+')');
        sheet1.font(6, 47, {bold:'true'});
        sheet1.align(6, 47, 'center');

        // // for Bihar Discom difference
        // sheet1.set(1, 48, '');
        // sheet1.align(1, 48, 'center');
        sheet1.merge({
            col: 2,
            row: 48
        }, {
            col: 6,
            row: 48
        });
        // for Final Total Calculation
        sheet1.set(3, 49, 'Purchase(kWh)');
        sheet1.align(3, 49, 'center');
        // for Final Total Calculation
        sheet1.set(4, 49, Number(json.totalBilledUnits));
        sheet1.align(4, 49, 'center');
        // for Final Total Calculation
        sheet1.set(3, 50, 'Sell(kWh)');
        sheet1.align(3, 50, 'center');
        // for Final Total Calculation
        sheet1.set(4, 50, Number(json.totalSoldUnits));
        sheet1.align(4, 50, 'center');
        // for Final Total Calculation
        sheet1.set(4, 51, '('+json.totalDifference+')');
        sheet1.align(4, 51, 'center');
        sheet1.font(4, 51, {bold:'true'});

        sheet1.set(3, 54, 'Note:');
        sheet1.font(3, 54, {sz:'11', bold:'true'});

        sheet1.set(4, 54, 'Excess sell energy amount may be transferred to PSM');
        sheet1.merge({
            col: 4,
            row: 54
        }, {
            col: 6,
            row: 54
        });
        // sheet1.font(3, 54, {sz:'11', bold:'true'});
        sheet1.set(4, 55, 'Excess purchase may be recovered from SPDs');
        sheet1.merge({
            col: 4,
            row: 55
        }, {
            col: 6,
            row: 55
        });
        sheet1.set(4, 56, '**Provisional Invoice raised. However, Credit/Debit Note will be issued in the next month billing.');
        sheet1.merge({
            col: 4,
            row: 56
        }, {
            col: 6,
            row: 57
        });
        sheet1.wrap(4, 56, 'true');

        // // border
        for (var i = 1; i < 48; i++) {
            for (var s = 1; s < 7; s++) {
                sheet1.border(s, i, {
                    left: 'thin',
                    top: 'thin',
                    right: 'thin',
                    bottom: 'thin'
                });
                sheet1.valign(s, i, 'center');
                if (i > 3 && i < 47) {
                    sheet1.set(1, i , Number(i) - 3);
                    sheet1.align(1, i, 'center');
                    sheet1.height(i, 23);
                }
            }
        }

        for (var j = 4; j < 34; j++) {
          if(j < 20){
            sheet1.fill(3,j, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
            });
            if (j > 10 && j < 20) {
              sheet1.fill(5,j, {
                  type: 'solid',
                  fgColor: 'fdff00',
                  bgColor: '64'
              });
            }
          }else if (j > 23 && j < 28) {
            sheet1.fill(3,j, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
            });
            sheet1.fill(5,j, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
            });
          }else if (j > 32 && j < 34) {
            sheet1.fill(3,j, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
            });
            sheet1.fill(5,j, {
                type: 'solid',
                fgColor: 'fdff00',
                bgColor: '64'
            });
          }
        }
        workbook.save(function(err) {
            console.log('Purchase and  Sale Excel File Saved for the month of '+monthInWords(month)+"'"+year +'_'+random+ (err ? 'failed' : ' ok'));
        });
        console.log('purchase_sale/purchaseAndSaleReport_'+monthInWords(month)+'_'+year+'_'+random+ '.xlsx');

        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('putimage', [
            process.env.PWD + '/.uploads/purchase_sale/purchaseAndSaleReport_'+monthInWords(month)+'_'+year+'_'+random+ '.xlsx',
            process.env.PWD + '/public/img/secillogo.jpg',
            '',
            '1'
        ]);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // spawn = Npm.require('child_process').spawn;
        // console.log("Executing post");
        // command = spawn('putimage', [
        //     process.env.PWD + '/.uploads/'+'purchase_sale/purchaseAndSaleReport_'+monthInWords(month)+'_'+year+'_'+random+ '.xlsx',
        //     process.env.PWD + '/public/img/secillogo.jpg',
        //     'F1',
        //     '0'
        // ]);
        // command.stdout.on('data', function(data) {
        //     // console.log('stdout: ' + data);
        // });
        // command.stderr.on('data', function(data) {
        //     // console.log('stderr: ' + data);
        // });
        // command.on('exit', function(code) {
        //     // console.log('child process exited with code ' + code);
        // });
        var filePath = 'purchase_sale/purchaseAndSaleReport_' + monthInWords(month) + '_' + year +'_'+random+ '.xlsx';
        console.log(filePath);
        return returnSuccess("Returning Purchase and Sale file path ", filePath);
    }
});

function getColumnTotal(allAry) {
  var arryTotal = 0;
  if (allAry.length > 0) {
    allAry.forEach( function(item){
      if (item.discomState == 'Rajasthan') {
        var total = Number(item.difference);
        arryTotal += total;
        // console.log('Rajasthan difference ='+total);
      }else if (item.discomState == 'Odisha') {
        var total = Number(item.difference);
        arryTotal += total;
        // console.log('Odisha difference ='+total);
      }else if (item.discomState == 'Maharashtra') {
        var soldUnits = item.soldUnits;
        if (soldUnits.length > 0) {
          soldUnits.forEach(function(soldItem){
            if (soldItem.spdState == 'jsonShardaConstruction') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('jsonShardaConstruction difference ='+total);
            }else if (soldItem.spdState == 'jsnVishvajEnergy') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('jsnVishvajEnergy difference ='+total);
            }else if (soldItem.spdState == 'jsonSunilHitech') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('jsonSunilHitech difference ='+total);
            }
          });
        }
      }else if (item.discomState == 'Goa') {
        var total = Number(item.difference);
        arryTotal += total;
        // console.log('Goa difference ='+total);
      }else if (item.discomState == 'MP') {
        var soldUnits = item.soldUnits;
        if (soldUnits.length > 0) {
          soldUnits.forEach(function(soldItem){
            if (soldItem.spdState == 'cleanSolarJson') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('cleanSolarJson difference ='+total);
            }else if (soldItem.spdState == 'seiSitaraJson') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('seiSitaraJson difference ='+total);
            }else if (soldItem.spdState == 'seiVoltaJson') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('seiVoltaJson difference ='+total);
            }else if (soldItem.spdState == 'finnSuryaJson') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('finnSuryaJson difference ='+total);
            }else if (soldItem.spdState == 'focalPhotoJson') {
              var total = Number(soldItem.differenceValue);
              arryTotal += total;
              // console.log('focalPhotoJson difference ='+total);
            }
          });
        }
      }else if (item.discomState == 'Chhattisgarh') {
        var total = Number(item.difference);
        arryTotal += total;
        // console.log('Chhattisgarh difference ='+total);
      }else if (item.discomState == 'Bihar') {
        var total = Number(item.difference);
        arryTotal += total;
        // console.log('Bihar difference ='+total);
      }else if (item.discomState == 'Tamil Nadu') {
        var total = Number(item.difference);
        arryTotal += total;
        // console.log('Tamil Nadu difference ='+total);
      }else if (item.discomState == 'Karnataka') {
        var total = Number(item.difference);
        arryTotal += total;
        // console.log('Karnataka difference ='+total);
      }
    });
    console.log('Column Difference Total = '+arryTotal);
    return arryTotal;
  }else {
    return '0';
  }


}

function salePurchaseSPDArr(json) {
    var dataArr = [];
    var discomData = json.stateUsers;
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Rajasthan') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Haryana') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Himachal Pradesh') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Delhi(BRPL)') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Delhi(BYPL)') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Delhi(TPDDL)') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Assam') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Odisha') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Punjab') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Maharashtra') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Goa') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Jharkhand') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'MP') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Chhattisgarh') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Tamil Nadu') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Karnataka') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    _.each(json.stateUsers, function(item) {
        if (item.discomState == 'Bihar') {
            _.each(item.spdList, function(spdItem) {
                var json = {
                    difference: item.difference,
                    spdName: spdItem.spdName,
                    billedUnits: spdItem.billedUnits,
                    discom_short: item.discom_short,
                    soldUnits: item.soldUnits,
                    discomState: item.discomState
                };
                dataArr.push(json);
            });
        }
    });
    return dataArr;
};

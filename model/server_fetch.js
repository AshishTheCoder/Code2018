Meteor.methods({
    callLastUpdatedNRLDC(selectedDate) {
        var json = NRWRData.find({
            date: selectedDate,
            dataType: 'NRLDC'
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        if (json.length > 0) {
            return returnSuccess("Got latest data NRLDC", json[0].createdAt + ' Rev: ' + json[0].revision);
        } else {
            return returnSuccess("No data available NRLDC", "Data not available for " + selectedDate);
        }
    },
    scrapeit(date, state, generatedId) {
        var request = require('request');
        var requestMe = request.defaults({
            jar: true
        });
        fs = require('fs');
        FetchStatus.update({
            '_id': generatedId,
            'type': 'NRData'
        }, {
            $set: {
                'status': 'At server'
            }
        });
        // url for NRLDC data fetching - http://nrldc.in:83/WBS/OATrans.aspx?dt=12-04-2017&ty=0&st=RAJASTHAN&rev=37
        requestMe.post('http://nrldc.in:83/WBS/OATrans.aspx?dt=' + date + '&ty=0&st=' + 'RAJASTHAN' + '&rev=898989', Meteor.bindEnvironment(function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var cheerio = require('cheerio');
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'NRData'
                }, {
                    $set: {
                        'status': 'Got response from the URL'
                    }
                });
                var cheerioTableparser = require('cheerio-tableparser');
                $ = cheerio.load(body);
                var latestRevisonNumber = $('#RevPickerID').children().first().text()
                var selectedRevisonNumber = $('#RevPickerID').children("[selected='selected']").text()

                var table = $("#demoTable").html();
                table = "<table id='demoTable'>" + table + "</table>";
                demoTable = cheerio.load(table);

                cheerioTableparser(demoTable);
                var data = demoTable("#demoTable").parsetable(true, true, true);
                var seciArray = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    headerValue = data[i][0].toUpperCase().trim();
                    if (headerValue === "SECI") {
                        seciArray.push(data[i]);
                    }
                }
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'NRData'
                }, {
                    $set: {
                        'status': 'Data fetched from server'
                    }
                });
                dbvalue = {
                    date: date,
                    type: "LTA",
                    state: state,
                    dataType: 'NRLDC',
                    revision: selectedRevisonNumber,
                    secidata: seciArray,
                    createdAt: new Date()
                };
                NRWRData.insert(dbvalue);
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'NRData'
                }, {
                    $set: {
                        'status': 'Data Extracted Successfull!!'
                    }
                });
                console.log('Data inserted in DB for NERLDC');
            } else {
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'NRData'
                }, {
                    $set: {
                        'status': 'Response from URL Failed try again'
                    }
                });
            }
        }));
        return returnSuccess("Please check date and time for last retrived data of NRLDC");
    },
    callLastUpdatedERLDC(selectedDate) {
        var json = ERData.find({
            date: selectedDate,
            dataType: "ERLDC"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        if (json.length > 0) {
            return returnSuccess("Got latest data ERLDC", json[0].createdAt + ' Rev: ' + json[0].revision);
        } else {
            return returnSuccess("No data available ERLDC", "Data not available for " + selectedDate);
        }
    },

    callERLDCdata(selectedDate, generatedId) {
        var insertDate = selectedDate;
        var download = require('download-file')
        var toValue = selectedDate.split('-');
        toDate = toValue[2] + '/' + toValue[1] + '/' + toValue[0];
        var to = moment(toDate, 'YYYY-MM-DD');
        var daysDifference = moment().diff(to, 'days');
        FetchStatus.update({
            '_id': generatedId,
            'type': 'ERData'
        }, {
            $set: {
                'status': 'At server'
            }
        });
        if (selectedDate == moment().format('DD-MM-YYYY')) {
          console.log('ERLDC If case executing,,,,,,,,,,,,,,');
            var url = 'initial';
            FetchStatus.update({
                '_id': generatedId,
                'type': 'ERData'
            }, {
                $set: {
                    'status': 'Creating URL'
                }
            });
            var changeDate = moment().format('DDMMYY');
            console.log(changeDate);
        //  http://103.7.131.201/wbes_test/netschedule/ExportFlowGateScheduleToPDF?scheduleDate=28-06-2017&getTokenValue=1498648818168&fileType=xlsx&revisionNumber=47&pathId=11&scheduleType=4&isLink=1
        //  http://103.7.131.201/wbes_test/netschedule/ExportFlowGateScheduleToPDF?scheduleDate=29-06-2017&getTokenValue=1498711796023&fileType=xlsx&revisionNumber=26&pathId=11&scheduleType=4&isLink=1
            var request = require('request');
            var requestMe = request.defaults({jar: true});
            fs = require('fs');

            requestMe.post('http://103.7.131.201/wbes_test/Report/LTANew', Meteor.bindEnvironment(function(error, response, body) {
              console.log(response.statusCode);
                if (!error && response.statusCode == 302) {
                    var cheerio = require('cheerio');
                    var cheerioTableparser = require('cheerio-tableparser');
                    $ = cheerio.load(body);
                    // var latestRevisonNumber = $('#ddlRevision').children().first().text()
                    var selectedRevisonNumber = $('#ddlRevision').children("[selected='selected']").text()
                    console.log(selectedRevisonNumber);
                    url = "http://www.erldc.org/current_schedule/bilateral/bilt" + changeDate + "-Rev.No" + selectedRevisonNumber + ".xls";
                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'ERData'
                    }, {
                        $set: {
                            'status': 'URL Created'
                        }
                    });
                }else {
                  FetchStatus.update({
                      '_id': generatedId,
                      'type': 'ERData'
                  }, {
                      $set: {
                          'status': 'URL Creation Failed'
                      }
                  });
                }

            }));
        } else {
          console.log('ERLDC else case executing,,,,,,,,,,,,,,');
            var changeDate = moment(to).format('DDMMYY');
            console.log(changeDate);
            var url = "http://www.erldc.org/Final_schedule/Final%20Schedule%20" + changeDate + ".xls";
            FetchStatus.update({
                '_id': generatedId,
                'type': 'ERData'
            }, {
                $set: {
                    'status': 'URL Created'
                }
            });
        }

        Meteor.setTimeout(function() {
            console.log('url to fetch ' + url);
            var options = {
                directory: process.env.PWD + '/.uploads/ERLDC/',
                filename: changeDate + '.xls'
            }
            FetchStatus.update({
                '_id': generatedId,
                'type': 'ERData'
            }, {
                $set: {
                    'status': 'Starting file Download'
                }
            });
            download(url, options, Meteor.bindEnvironment(function(err) {
                if (err) {
                    console.log("Download Error");

                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'ERData'
                    }, {
                        $set: {
                            'status': 'Download Error!! File not Downloaded'
                        }
                    });
                } else {
                    var filename = process.env.PWD + '/.uploads/ERLDC/' + changeDate + '.xls';
                    var fs = Npm.require('fs');
                    var excel = new Excel('xls');
                    var workbook = excel.readFile(filename);
                    var yourSheetsName = workbook.SheetNames;

                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'ERData'
                    }, {
                        $set: {
                            'status': 'Reading Downloaded excel file'
                        }
                    });

                    var orissaRajasthan = ["ORISSA", "ERLDC", "RAJASTHAN"]; //Odisha
                    var jharkhand = ["JHARKHAND", "ERLDC", "RAJASTHAN"];
                    var assam = ["ASSAM", "ERLDC", "RAJASTHAN"];
                    var orissaGujarat = ["ORISSA", "ERLDC", "GUJARAT"]; //Odisha
                    var bihar = ["BIHAR", "ERLDC", "MP"];

                    var seciArray = [jharkhand, assam, bihar, orissaGujarat, orissaRajasthan];
                    if (daysDifference == 0) {
                        for (var i = 2552; i <= 2647; i++) {
                            orissaRajasthan.push(workbook.Sheets[yourSheetsName[1]]['I' + [i]].v);
                            jharkhand.push(workbook.Sheets[yourSheetsName[1]]['J' + [i]].v);
                            assam.push(workbook.Sheets[yourSheetsName[1]]['K' + [i]].v);
                            orissaGujarat.push(workbook.Sheets[yourSheetsName[1]]['N' + [i]].v);
                            bihar.push(workbook.Sheets[yourSheetsName[1]]['O' + [i]].v);
                        };
                        var revision = workbook.Sheets[yourSheetsName[1]]['F' + [2540]].v;

                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'ERData'
                        }, {
                            $set: {
                                'status': 'For Current revision Excel Reading'
                            }
                        });

                    } else {
                        for (var i = 3023; i <= 3118; i++) {
                            orissaRajasthan.push(workbook.Sheets[yourSheetsName[2]]['I' + [i]].v);
                            jharkhand.push(workbook.Sheets[yourSheetsName[2]]['J' + [i]].v);
                            assam.push(workbook.Sheets[yourSheetsName[2]]['K' + [i]].v);
                            orissaGujarat.push(workbook.Sheets[yourSheetsName[2]]['N' + [i]].v);
                            bihar.push(workbook.Sheets[yourSheetsName[2]]['O' + [i]].v);
                        };
                        var revision = 'FINAL';

                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'ERData'
                        }, {
                            $set: {
                                'status': 'For Final revision reading Excel'
                            }
                        });
                    }
                    var toInsert = {
                        date: insertDate,
                        type: "LTA",
                        dataType: "ERLDC",
                        revision: revision,
                        secidata: seciArray,
                        createdAt: new Date()
                    };
                    ERData.insert(toInsert);
                    console.log('Data inserted in DB for ERLDC');

                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'ERData'
                    }, {
                        $set: {
                            'status': 'Data Extracted Successfull!!'
                        }
                    });
                }
            }))
        }, 5000);
        return returnSuccess("Please check date and time for last retrived data of ERLDC");
    },
    callLastUpdatedNERLDC(selectedDate) {
        var json = ERData.find({
            date: selectedDate,
            dataType: "NERLDC"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        if (json.length > 0) {
            return returnSuccess("Got latest data NERLDC", json[0].createdAt + ' Rev: ' + json[0].revision);
        } else {
            return returnSuccess("No data available NERLDC", "Data not available for " + selectedDate);
        }
    },
    callNERLDCdata(selectedDate, generatedId) {
        FetchStatus.update({
            '_id': generatedId,
            'type': 'NERdata'
        }, {
            $set: {
                'status': 'At server'
            }
        });
        var insertDate = selectedDate;
        var download = require('download-file')
        var toValue = selectedDate.split('-');
        var toDate = toValue[2] + '/' + toValue[1] + '/' + toValue[0];
        var to = moment(toDate, 'YYYY-MM-DD');
        var changeDate = moment(to).format('DDMMYY');
        var daysDifference = moment().diff(to, 'days');

        if (selectedDate == moment().format('DD-MM-YYYY')) {
          console.log('NERLDC.. If case is executing,,,,,,,,,,,,,,,,');
            FetchStatus.update({
                '_id': generatedId,
                'type': 'NERdata'
            }, {
                $set: {
                    'status': 'For Current revision'
                }
            });
            var url = 'initial';
            var changeDate = moment().format('DDMMYY');
            console.log(changeDate);
            var request = require('request');
            var requestMe = request.defaults({
                jar: true
            });

            fs = require('fs');

            FetchStatus.update({
                '_id': generatedId,
                'type': 'NERdata'
            }, {
                $set: {
                    'status': 'Creating URL....'
                }
            });
            requestMe.post('http://www.nerldc.org/dispatch.aspx', Meteor.bindEnvironment(function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var cheerio = require('cheerio');
                    var cheerioTableparser = require('cheerio-tableparser');
                    $ = cheerio.load(body);
                    var latestRevisonNumber = $('#ctl00_ContentPlaceHolder1_List1').children().last().text()
                    var selectedRevisonNumber = $('#ctl00_ContentPlaceHolder1_List1').children("[selected='selected']").text()

                    console.log('latestRevisonNumber: ' + latestRevisonNumber);
                    console.log('selectedRevisonNumber: ' + selectedRevisonNumber);
                    url = 'http://www.nerldc.org/SCH_Date/ER/ER_' + changeDate + '_R' + latestRevisonNumber + '.xls';

                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NERdata'
                    }, {
                        $set: {
                            'status': 'URL Created'
                        }
                    });
                } else {
                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NERdata'
                    }, {
                        $set: {
                            'status': 'URL Response Failed'
                        }
                    });
                }
            }));
        }
        else {
          console.log('NERLDC..... else case is executing........................?');
            FetchStatus.update({
                '_id': generatedId,
                'type': 'NERdata'
            }, {
                $set: {
                    'status': 'For Current revision'
                }
            });
            var url = 'initial';
            var changeDate = moment(to).format('DDMMYY');
            // var changeDate = moment().format('DDMMYY');
            console.log('Selected Date : '+changeDate);
            var request = require('request');
            var requestMe = request.defaults({
                jar: true
            });
            fs = require('fs');
            FetchStatus.update({
                '_id': generatedId,
                'type': 'NERdata'
            }, {
                $set: {
                    'status': 'Creating URL....'
                }
            });
            requestMe.post('http://www.nerldc.org/dispatch_nextday.aspx', Meteor.bindEnvironment(function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var cheerio = require('cheerio');
                    var cheerioTableparser = require('cheerio-tableparser');
                    $ = cheerio.load(body);
                    // var latestRevisonNumber = $('#ctl00_ContentPlaceHolder1_List1').children().last().text()
                    // var selectedRevisonNumber = $('#ctl00_ContentPlaceHolder1_List1').children("[selected='selected']").text()
                    console.log('DDL REV ID is - ctl00_ContentPlaceHolder1_RevNo');
                    var latestRevisonNumber = $('#ctl00_ContentPlaceHolder1_RevNo').children().last().text()
                    var selectedRevisonNumber = $('#ctl00_ContentPlaceHolder1_RevNo').children("[selected='selected']").text()

                    console.log('Day Aheard latestRevisonNumber : ' + latestRevisonNumber);
                    console.log('Day Aheard selectedRevisonNumber : ' + selectedRevisonNumber);
                    url = 'http://www.nerldc.org/SCH_Date/ER/ER_' + changeDate + '_R' + latestRevisonNumber + '.xls';

                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NERdata'
                    }, {
                        $set: {
                            'status': 'URL Created'
                        }
                    });
                } else {
                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NERdata'
                    }, {
                        $set: {
                            'status': 'URL Response Failed'
                        }
                    });
                }
            }));

            // console.log('NERLDC.. Else case is executing,,,,,,,,,,,,,,,,');
            // var changeDate = moment(to).format('DDMMYY');
            // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa');
            // console.log(changeDate);
            // var url = "http://www.nerldc.org/SCH_Date/ER/ER_" + changeDate +'_R0'+ ".xls";
            //
            // FetchStatus.update({
            //     '_id': generatedId,
            //     'type': 'NERdata'
            // }, {
            //     $set: {
            //         'status': 'URL Created'
            //     }
            // });
        }

        Meteor.setTimeout(function() {
            console.log('url to fetch ' + url);
            var options = {
                directory: process.env.PWD + '/.uploads/NERLDC/',
                filename: changeDate + '.xls'
            }
            FetchStatus.update({
                '_id': generatedId,
                'type': 'NERdata'
            }, {
                $set: {
                    'status': 'Starting file Download'
                }
            });

            download(url, options, Meteor.bindEnvironment(function(err) {
                if (err) {
                    console.log("Download Error");

                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NERdata'
                    }, {
                        $set: {
                            'status': 'Download Error!! File not Downloaded'
                        }
                    });

                } else {
                    var filename = process.env.PWD + '/.uploads/NERLDC/' + changeDate + '.xls';
                    var fs = Npm.require('fs');
                    var excel = new Excel('xls');
                    var workbook = excel.readFile(filename);
                    var yourSheetsName = workbook.SheetNames;
                    var assamAry = ["ASSAM", "NERLDC", "RAJASTHAN"];
                    var seciArray = [assamAry];

                    if (daysDifference == 0) {
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'NERdata'
                        }, {
                            $set: {
                                'status': 'For Current revision Excel Reading'
                            }
                        });

                        for (var i = 254; i <= 301; i++) {
                            assamAry.push(workbook.Sheets[yourSheetsName[0]]['D' + [i]].v);
                        };
                        for (var i = 309; i <= 356; i++) {
                            assamAry.push(workbook.Sheets[yourSheetsName[0]]['D' + [i]].v);
                        };
                        var revision = workbook.Sheets[yourSheetsName[0]]['C' + [305]].v;
                    } else {

                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'NERdata'
                        }, {
                            $set: {
                                'status': 'For Final revision Excel Reading'
                            }
                        });

                        for (var i = 252; i <= 299; i++) {
                            assamAry.push(workbook.Sheets[yourSheetsName[0]]['D' + [i]].v);
                        };
                        for (var i = 307; i <= 354; i++) {
                            assamAry.push(workbook.Sheets[yourSheetsName[0]]['D' + [i]].v);
                        };
                        var revision = 'FINAL';
                    }

                    var toInsert = {
                        date: insertDate,
                        type: "LTA",
                        dataType: "NERLDC",
                        secidata: seciArray,
                        revision: revision,
                        createdAt: new Date()
                    };
                    ERData.insert(toInsert);

                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NERdata'
                    }, {
                        $set: {
                            'status': 'Data Extracted Successfull'
                        }
                    });

                    console.log('Data inserted in DB for NERLDC');
                }
            }))
        }, 5000);
        return returnSuccess("Please check date and time for last retrived data of NERLDC");
    },
    callLastUpdatedWRLDC(selectedDate) {
        var json = NRWRData.find({
            date: selectedDate,
            dataType: "WRLDC"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        if (json.length > 0) {
            return returnSuccess("Got latest data WRLDC", json[0].createdAt + ' Rev: ' + json[0].revision);
        } else {
            return returnSuccess("No data available WRLDC", "Data not available for " + selectedDate);
        }
    },
    callWRLDCdataMP(date, state, generatedId) {
      console.log(date);
      console.log(state);
      console.log(generatedId);
        FetchStatus.update({
            '_id': generatedId,
            'type': 'WRRajdata'
        }, {
            $set: {
                'status': 'At Server'
            }
        });
        var request = require('request');
        var requestMe = request.defaults({
            jar: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
            }
        });
        fs = require('fs');
        FetchStatus.update({
            '_id': generatedId,
            'type': 'WRMPdata'
        }, {
            $set: {
                'status': 'Creating URL'
            }
        });
        requestMe.post('http://103.7.130.121/WBES/Report/GetNetScheduleRevisionNoForSpecificRegion?regionid=2&ScheduleDate=' + date, Meteor.bindEnvironment(function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var cheerio = require('cheerio');
                $ = cheerio.load(body);
                var arrayReturn = body;
                var data = arrayReturn.split(',');
                var revisionHighest = data.length - 1;
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'WRMPdata'
                }, {
                    $set: {
                        'status': 'Got Highest revisionNumber'
                    }
                });
                requestMe.post('http://103.7.130.121/WBES/Report/GetStoaMtoaLtaDeatil?regionId=2&scheduleDate=' + date + '&sellerId=816e288b-53b8-4690-bf19-f1747dc15cee&buyerId=ALL&traderId=fbe1fd2a-179f-4aaa-bf1a-1818057ef563&revisionNumber=' + revisionHighest + '&scheduleType=4&isFullSchedule=1&isDrawal=0', Meteor.bindEnvironment(function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var cheerio = require('cheerio');
                        $ = cheerio.load(body);
                        console.log('helllo');
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRMPdata'
                        }, {
                            $set: {
                                'status': 'Got response from URL data'
                            }
                        });
                        var bihar = ['Bihar'];
                        var goa = ['Goa'];
                        var chhattisgarh = ['Chhattisgarh'];
                        var maharashtra = ['Maharashtra'];
                        obj = JSON.parse(body);
                        obj.jaggedarray.forEach(function(item) {
                            bihar.push(item[2]);
                            goa.push(item[3]);
                            chhattisgarh.push(item[4]);
                            maharashtra.push(item[5]);
                        })
                        var mergeArray = [bihar, goa, chhattisgarh, maharashtra];
                        var toInsert = {
                            date: date,
                            revision: revisionHighest,
                            type: 'LTA',
                            state: state,
                            dataType: 'WRLDC',
                            createdAt: new Date(),
                            secidata: mergeArray
                        }
                        NRWRData.insert(toInsert);
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRMPdata'
                        }, {
                            $set: {
                                'status': 'Data Extracted Successfull!!'
                            }
                        });
                        console.log('Data inserted in DB for ' + state);
                    } else {
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRMPdata'
                        }, {
                            $set: {
                                'status': 'Failed URL response to get Data from URL'
                            }
                        });
                    }
                }));
            } else {
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'WRMPdata'
                }, {
                    $set: {
                        'status': 'Failed URL response to get Revision number'
                    }
                });
            }
        }));
        return returnSuccess('working for: ' + state);
    },
    callWRLDCdataRajasthan(date, state, generatedId) {
        FetchStatus.update({
            '_id': generatedId,
            'type': 'WRRajdata'
        }, {
            $set: {
                'status': 'At Server'
            }
        })
        var request = require('request');
        var requestMe = request.defaults({
            jar: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
            }
        });
        fs = require('fs');
        FetchStatus.update({
            '_id': generatedId,
            'type': 'WRRajdata'
        }, {
            $set: {
                'status': 'Creating URL'
            }
        })
        requestMe.post('http://103.7.130.121/WBES/Report/GetNetScheduleRevisionNoForSpecificRegion?regionid=2&ScheduleDate=' + date, Meteor.bindEnvironment(function(error, response, body) {
            if (!error && response.statusCode == 200) {
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'WRRajdata'
                }, {
                    $set: {
                        'status': 'URL Created'
                    }
                })
                var cheerio = require('cheerio');
                $ = cheerio.load(body);
                var arrayReturn = body;
                var data = arrayReturn.split(',');
                var revisionHighest = data.length - 1;
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'WRRajdata'
                }, {
                    $set: {
                        'status': 'Got Highest revisionNumber'
                    }
                })
                requestMe.post('http://103.7.130.121/WBES/Report/GetStoaMtoaLtaDeatil?regionId=2&scheduleDate=' + date + '&sellerId=ALL&buyerId=49ef2331-1a8e-4125-9c1e-4e76e978b784&traderId=fbe1fd2a-179f-4aaa-bf1a-1818057ef563&revisionNumber=' + revisionHighest + '&scheduleType=4&isFullSchedule=1&isDrawal=0', Meteor.bindEnvironment(function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRRajdata'
                        }, {
                            $set: {
                                'status': 'Extracting Data'
                            }
                        })
                        var cheerio = require('cheerio');
                        $ = cheerio.load(body);
                        var maharashtra = ['Maharashtra'];
                        obj = JSON.parse(body);
                        obj.jaggedarray.forEach(function(item) {
                            maharashtra.push(item[2]);
                        })
                        var mergeArray = [maharashtra];
                        var toInsert = {
                            date: date,
                            revision: revisionHighest,
                            type: 'LTA',
                            state: state,
                            dataType: 'WRLDC',
                            createdAt: new Date(),
                            secidata: mergeArray
                        }
                        NRWRData.insert(toInsert);
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRRajdata'
                        }, {
                            $set: {
                                'status': 'Data Extracted Successfull!!'
                            }
                        })
                        console.log('Data inserted in DB for ' + state);
                    } else {
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRRajdata'
                        }, {
                            $set: {
                                'status': 'Failed to extract data!!'
                            }
                        })
                    }
                }));
            } else {
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'WRRajdata'
                }, {
                    $set: {
                        'status': 'URL Response Failed!!'
                    }
                })
            }
        }));
        return returnSuccess('working for: ' + state);
    },
    callWRLDCdataGujarat(date, state, generatedId) {
      FetchStatus.update({
          '_id': generatedId,
          'type': 'WRGujdata'
      }, {
          $set: {
              'status': 'At Server'
          }
      })
        var request = require('request');
        var requestMe = request.defaults({
            jar: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
            }
        });
        fs = require('fs');
        FetchStatus.update({
            '_id': generatedId,
            'type': 'WRGujdata'
        }, {
            $set: {
                'status': 'Creating URL....'
            }
        })
        requestMe.post('http://103.7.130.121/WBES/Report/GetNetScheduleRevisionNoForSpecificRegion?regionid=2&ScheduleDate=' + date, Meteor.bindEnvironment(function(error, response, body) {
            if (!error && response.statusCode == 200) {
              FetchStatus.update({
                  '_id': generatedId,
                  'type': 'WRGujdata'
              }, {
                  $set: {
                      'status': 'Got Response from URL.'
                  }
              })
                var cheerio = require('cheerio');
                $ = cheerio.load(body);
                var arrayReturn = body;
                var data = arrayReturn.split(',');
                var revisionHighest = data.length - 1;
                FetchStatus.update({
                    '_id': generatedId,
                    'type': 'WRGujdata'
                }, {
                    $set: {
                        'status': 'Got Highest revisionNumber'
                    }
                })
                requestMe.post('http://103.7.130.121/WBES/Report/GetStoaMtoaLtaDeatil?regionId=2&scheduleDate=' + date + '&sellerId=7b83e22d-6299-4434-af4e-ad8f927289e3&buyerId=ALL&traderId=ALL&revisionNumber=' + revisionHighest + '&scheduleType=4&isFullSchedule=1&isDrawal=0', Meteor.bindEnvironment(function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                      FetchStatus.update({
                          '_id': generatedId,
                          'type': 'WRGujdata'
                      }, {
                          $set: {
                              'status': 'Extracting Data'
                          }
                      })
                        var cheerio = require('cheerio');
                        $ = cheerio.load(body);
                        var Odisha = ['ORISSA'];
                        obj = JSON.parse(body);
                        obj.jaggedarray.forEach(function(item) {
                            Odisha.push(item[2]);
                        })
                        var mergeArray = [Odisha];
                        var toInsert = {
                            date: date,
                            revision: revisionHighest,
                            type: 'LTA',
                            state: state,
                            dataType: 'WRLDC',
                            createdAt: new Date(),
                            secidata: mergeArray
                        }
                        NRWRData.insert(toInsert);
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRGujdata'
                        }, {
                            $set: {
                                'status': 'Data Extracted Successfull!!'
                            }
                        })
                        console.log('Data inserted in DB for ' + state);
                    }else {
                      FetchStatus.update({
                          '_id': generatedId,
                          'type': 'WRGujdata'
                      }, {
                          $set: {
                              'status': 'Data Extracted Failed!!'
                          }
                      })
                    }
                }));
            }else {
              FetchStatus.update({
                  '_id': generatedId,
                  'type': 'WRGujdata'
              }, {
                  $set: {
                      'status': 'Response from URL Failed!!'
                  }
              })
            }
        }));
        return returnSuccess('working for: ' + state);
    },
});

//    fs.writeFile("/tmp/test", body, function(err) {
//     if(err) {
//         return console.log(err);
//     }
//
//     console.log("The file was saved!");
// });

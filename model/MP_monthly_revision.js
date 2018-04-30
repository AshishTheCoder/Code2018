Meteor.methods({
    getMpRevisions(month, year) {
        var spdArray = [];
        var list = Meteor.users.find({
            "profile.user_type": 'spd'
        }).fetch();
        var jsonArray = [];
        var discom = Discom.find().fetch();
        list.forEach(function(item) {
            if (item.profile.registration_form) {
                if (item.profile.registration_form.spd_state == 'MP' && item.profile.registration_form.transaction_type == "Inter") {
                    spdArray.push(item._id);
                    discom.forEach(function(DiscomItem) {
                        DiscomItem.spdIds.forEach(function(testSpds) {
                            if (testSpds.spdId == item._id) {
                                jsonArray.push({
                                    discomState: DiscomItem.discom_state,
                                    spdName: testSpds.spdName,
                                    spdId: item._id
                                })
                            }
                        })
                    })
                }
            }
        })
        var mainArray = [];
        _.each(jsonArray, function(item, key) {
            if (item.discomState == "Maharashtra") {} else {
                mainArray.push(item);
            }
            if (item.discomState == "Goa") {
                item.spdName = 'IL&FS Energy Development Company Limited';
            }
        })

        var date = new Date(year, month - 1, 1);
        var result = [];
        var arrayOfDates = [];
        while (date.getMonth() == month - 1) {
            var update = date.getDate() + "-" + month + "-" + year;
            var newDate = update.split("-");
            var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            var show = [];

            /////////////id loop//////////////
            for (var i = 0; i < mainArray.length; i++) {
                var schedule = ScheduleSubmission.find({
                    clientId: mainArray[i].spdId,
                    date: moment(myObject).format('DD-MM-YYYY')
                }).fetch();
                if (schedule != '') {
                    schedule.forEach(function(item) {
                        var jsonData = item.json;
                        var length = jsonData.length;
                        show.push(length - 1);
                    });
                } else {
                    show.push(0);
                }
            }
            //////id loop over///////////////
            var count = 0;
            for (var i = show.length; i--;) {
                count += Number(show[i]);
            }
            show.push(Number(count));
            result.push(show);
            arrayOfDates.push(moment(myObject).format('DD-MM-YYYY'));
            date.setDate(date.getDate() + 1);
        }
        var totalArray = [];
        for (var z = 0; z < result[0].length; z++) {
            var sum = 0;
            for (var k = 0; k < result.length; k++) {
                sum += Number(result[k][z]);
            }
            totalArray.push(Number(sum));
        }
        var selectedPeriod = getPeriodFromDate('01-'+month+'-'+year);
        var toReturn = {
            monthYear: month + '-' + year,
            period : selectedPeriod,
            spdArray: mainArray,
            datesArray: arrayOfDates,
            revisionValues: result,
            totalRevision: totalArray
        }
        return returnSuccess('Got MP Revision for: ' + month + '-' + year, toReturn);
    },
    sendMpRevisions(toReturn,month,year) {
        var excelbuilder = require('msexcel-builder');
        var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/MP_revisions/', toReturn.monthYear + '.xlsx');
        var sheet1 = workbook.createSheet('sheet1', 100, 126);
        sheet1.set(2, 2, 'Revision Sought by');
        sheet1.font(2, 2, {sz:'11',bold:'true'});
        sheet1.align(2, 2, 'center');
        sheet1.merge({
            col: 2,
            row: 2
        }, {
            col: 5,
            row: 2
        });
        sheet1.set(6, 3, 'Total No. of Revision');
        sheet1.wrap(6, 3, 'true');
        sheet1.align(6, 3, 'center');
        sheet1.font(6, 2, {sz:'11',bold:'true'});
        sheet1.align(6, 2, 'center');

        sheet1.width(6, 18);
        sheet1.set(1, 3, 'Dates');
        sheet1.align(1, 3, 'center');
        sheet1.set(2, 3, toReturn.spdArray[3].spdName + '(REV.NO)');
        sheet1.set(3, 3, toReturn.spdArray[0].spdName + '(REV.NO)');
        sheet1.set(4, 3, toReturn.spdArray[2].spdName + '(REV.NO)');
        sheet1.set(5, 3, toReturn.spdArray[1].spdName + '(REV.NO)');
        sheet1.height(3, 60);
        for (var i = 0; i < toReturn.spdArray.length; i++) {
            sheet1.width(i + 2, 18);
            sheet1.wrap(i + 2, 3, 'true');
            sheet1.align(i + 2, 3, 'center');
        }
        sheet1.width(1, 12);
        for (var i = 0; i < toReturn.datesArray.length; i++) {
            var update = toReturn.datesArray[i];
            var newDate = update.split("-");
            var dateObj = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            var dateVar = moment(dateObj).format('MM/DD/YYYY');
            sheet1.set(1, i + 4, dateVar);

            sheet1.set(2, i + 4, returnHelper(toReturn.revisionValues, 3, i));
            sheet1.set(3, i + 4, returnHelper(toReturn.revisionValues, 0, i));
            sheet1.set(4, i + 4, returnHelper(toReturn.revisionValues, 2, i));
            sheet1.set(5, i + 4, returnHelper(toReturn.revisionValues, 1, i));
            for (var k = 0; k < toReturn.spdArray.length; k++) {
                sheet1.set(6, i + 4, returnHelper(toReturn.revisionValues, 4, i));
            }
        }
        sheet1.set(1, toReturn.datesArray.length + 4, 'TOTAL');
        // for (var i = 0; i < toReturn.spdArray.length; i++) {
            sheet1.set(2, toReturn.datesArray.length + 4, returningColoum(toReturn.totalRevision, 3));
            sheet1.set(3, toReturn.datesArray.length + 4, returningColoum(toReturn.totalRevision, 0));
            sheet1.set(4, toReturn.datesArray.length + 4, returningColoum(toReturn.totalRevision, 2));
            sheet1.set(5, toReturn.datesArray.length + 4, returningColoum(toReturn.totalRevision, 1));
        // }
        sheet1.set(6, toReturn.datesArray.length + 4, returningColoum(toReturn.totalRevision, 4));
        sheet1.set(1, toReturn.datesArray.length + 6, 'Note: ');
        sheet1.set(2, toReturn.datesArray.length + 6, 'Revision "0" is not included');

        for (var t = 1; t < 7; t++) {
            sheet1.font(t, 3, {sz:'11',bold:'true'});
            sheet1.align(t, 3, 'center');

            sheet1.font(t, toReturn.datesArray.length + 4, {sz:'11',bold:'true'});
            sheet1.align(t, toReturn.datesArray.length + 4, 'center');
        }

        for (var i = 1; i < toReturn.datesArray.length + 5; i++) {
            for (var s = 1; s < 7; s++) {
                sheet1.border(s, i, {
                    left: 'thin',
                    top: 'thin',
                    right: 'thin',
                    bottom: 'thin'
                });
                sheet1.align(s, i, 'center');
                sheet1.valign(s, i, 'center');
            }
        }

        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok ? 'ok' : 'MP Revision Report'));
        });

        var selectedPeriod = toReturn.period;
        var toInsert = {
            filePath: process.env.PWD + '/.uploads/MP_revisions/' + toReturn.monthYear + '.xlsx',
            stateName: 'MP',
            fileName: month+"'"+year + ' Revision Report' + '.xlsx',
            subject: 'REGARDING REAL TIME REVISION INFORMATION FOR THE MONTH OF ' + selectedPeriod.toUpperCase(),
            reportType: 'MP_monthly_revision',
            createdAt: new Date()
        }
        ReportUrls.insert(toInsert);

        var data = ReportUrls.find({
            reportType: 'MP_monthly_revision',
            stateName: "MP"
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        var attachmentUrl = data[0].filePath;
        var fileName = data[0].fileName;
        var subject = data[0].subject;
        var message = "Dear Sir/Ma'am,<br><br>Please find attached the Real -time revision data for the month of <b>"+selectedPeriod.toUpperCase()+".</b>"+"<br><br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
        var email = ["seci.scheduling@gmail.com"];
        Meteor.setTimeout(function() {
            for (var i = 0; i < email.length; i++) {
                console.log("sending mail Inserted");
                Meteor.call("sendMandrillEmailAttachment", email[i], subject, message, attachmentUrl, fileName, function(error, result) {
                    if (error) {
                        var ErrorJson = {
                            email: email[i],
                            message: message,
                            status: "false",
                            log: error,
                            timeStamp: new Date()
                        };
                        EmailLogs.insert(ErrorJson);
                    } else {
                        if (result.message == "queued") {
                            var SentJson = {
                                email: email[i],
                                message: message,
                                status: "true",
                                log: result,
                                timeStamp: new Date()
                            }
                            EmailLogs.insert(SentJson);
                        } else {
                            var ErrorJson = {
                                email: email[i],
                                message: message,
                                status: "false",
                                log: result,
                                timeStamp: new Date()
                            };
                            EmailLogs.insert(ErrorJson);
                        }
                    }
                })
            }
        }, 10000);
        return returnSuccess('Excel Created for: ' + toReturn.monthYear);
    }
})

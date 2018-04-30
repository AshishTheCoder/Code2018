Meteor.methods({
    getPriviousInsetrdTime(selectedDate, ddlTypeVar, ddlStateVar) {
        if (ddlTypeVar == 'DISCOM') {
            var data = MailTiming.find({
                date: selectedDate,
                report_type: ddlTypeVar
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            if (data.length > 0) {
                var timeData = data[0].time;
                return returnSuccess("Getting Time From MailTiming Collection by Admin", timeData);
            } else {
                return returnSuccess("Getting Time From MailTiming Collection by Admin", 'Timing Not Submitted');
            }
        } else if (ddlTypeVar == 'SLDC') {
            var data = MailTiming.find({
                date: selectedDate,
                report_type: ddlTypeVar,
                state: ddlStateVar
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            if (data.length > 0) {
                var timeData = data[0].time;
                return returnSuccess("Getting Time From MailTiming Collection by Admin", timeData);
            } else {
                return returnSuccess("Getting Time From MailTiming Collection by Admin", 'Timing Not Submitted');
            }
        }
    },
    reportTimingData(selectedDate, ddlTypeVar, ddlTimeVar, ddlStateVar) {
        var currentDate = new Date();
        var todayDate = moment(currentDate).format('DD-MM-YYYY');
        if (ddlTypeVar == 'DISCOM') {
            var json = {
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                date: selectedDate,
                report_type: ddlTypeVar,
                time: ddlTimeVar,
                timestamp: new Date()
            };
            // MailTiming.insert(json);
            MailTiming.update({
                date: selectedDate,
                report_type: ddlTypeVar
            }, {
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                date: selectedDate,
                report_type: ddlTypeVar,
                time: ddlTimeVar,
                timestamp: new Date()
            }, {upsert: true})
            SyncedCron.start();
            //data inserted in log details collection
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: 'Discom Report Mail Timing Submitted',
                template_name: 'mailTiming',
                event_name: 'btnSubmitTime',
                action_date: todayDate,
                timestamp: new Date(),
                json: json
            });
        } else if (ddlTypeVar == 'SLDC') {
            var json = {
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                date: selectedDate,
                report_type: ddlTypeVar,
                state: ddlStateVar,
                time: ddlTimeVar,
                timestamp: new Date()
            };
            // MailTiming.insert(json);
            MailTiming.update({
                date: selectedDate,
                report_type: ddlTypeVar,
                state: ddlStateVar
            }, {
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                date: selectedDate,
                report_type: ddlTypeVar,
                state: ddlStateVar,
                time: ddlTimeVar,
                timestamp: new Date()
            }, {upsert: true})

            SyncedCron.start();
            //data inserted in log details collection
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_address:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                log_type: ddlStateVar+' SLDC Mail Time Submitted',
                template_name: 'mailTiming',
                event_name: 'btnSubmitTime',
                action_date: todayDate,
                timestamp: new Date(),
                json: json
            });
        }
        return returnSuccess('Modified Cron timming for: ' + selectedDate, true);
    },
    viewReportTimingData(fromDate, toDate, reportType, ddlStateVar) {
        var array = [];
        fromDate = fromDate.split('-');
        toDate = toDate.split('-');
        fromDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);
        toDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        date1_unixtime = parseInt(fromDate.getTime() / 1000);
        date2_unixtime = parseInt(toDate.getTime() / 1000);
        var timeDifference = date2_unixtime - date1_unixtime;
        var timeDifferenceInHours = timeDifference / 60 / 60;
        var timeDifferenceInDays = timeDifferenceInHours / 24;
        if (timeDifferenceInDays >= 0) {
            if (reportType == 'DISCOM') {
                fromDate.setDate(fromDate.getDate());
                for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
                    var details = MailTiming.find({
                        report_type: reportType,
                        date: moment(fromDate).format('DD-MM-YYYY')
                    }, {
                        sort: {
                            $natural: -1
                        }
                    }).fetch();
                    fromDate.setDate(fromDate.getDate() + 1);
                    if (details.length > 0) {
                        var check = {};
                        var myJson = details[0];
                        check.date = details[0].date;
                        check.report_type = details[0].report_type;
                        check.time = details[0].time;
                        array.push(check);
                    }
                }
            } else if (reportType == 'SLDC') {
                fromDate.setDate(fromDate.getDate());
                for (var i = 1; i <= timeDifferenceInDays + 1; i++) {
                    var details = MailTiming.find({
                        report_type: reportType,
                        state: ddlStateVar,
                        date: moment(fromDate).format('DD-MM-YYYY')
                    }, {
                        sort: {
                            $natural: -1
                        }
                    }).fetch();
                    fromDate.setDate(fromDate.getDate() + 1);
                    if (details.length > 0) {
                        var sateVar = details[0].state + ' ' + details[0].report_type;
                        var check = {};
                        var myJson = details[0];
                        check.date = details[0].date;
                        check.report_type = sateVar;
                        check.time = details[0].time;
                        array.push(check);
                    }
                }
            }
        }
        return returnSuccess('Getting time to view by admin',array);
    }
});

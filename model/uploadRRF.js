Meteor.methods({
    readRRFfile(revisedState, filepath, href, selectedDate, extraData) {
        console.log(selectedDate);
        var fs = Npm.require('fs');
        var excel = new Excel('xlsx');
        var workbook = excel.readFile(filepath);
        var yourSheetsName = workbook.SheetNames;
        var revision = workbook.Sheets[yourSheetsName[0]]['B' + [9]].v;
        var dateAdd = new Date('1900', '0', '1');
        var toDate = workbook.Sheets[yourSheetsName[0]]['B' + [8]].v;
        var date = moment(dateAdd).add(Number(toDate) - 2, 'days');
        var uploadedDate = moment(date).format('DD-MM-YYYY');

        var fromValue = selectedDate.split('-');
        console.log(fromValue);
        fromDate = fromValue[2] + '/' + fromValue[1] + '/' + fromValue[0];
        var toValue = uploadedDate.split('-');
        console.log(toValue);
        toDate = toValue[2] + '/' + toValue[1] + '/' + toValue[0];
        from = moment(fromDate, 'YYYY-MM-DD');
        to = moment(toDate, 'YYYY-MM-DD');

        if (extraData) {
            var diffInDays = 0;
        } else {
            var diffInDays = to.diff(from, 'days');
        }

        console.log('days: ' + diffInDays);

        var lastFileData = RrfData.find({
            rrfDate: selectedDate
        }).fetch();

        var revError = "hello";
        console.log('uploaded revision: ' + revision);
        lastFileData.forEach(function(item) {
            console.log('revision data base: ' + item.revisionNumber);
            if (item.revisionNumber == revision) {
                revError = "true";
            }
        })

        var lastUploadedRevision = RrfData.find({
            rrfDate: selectedDate
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();

        if (revError == "true") {
            return returnFaliure('Same revision REV-' + revision + ' not allowed to upload again');
        } else {
            if (diffInDays == 0) {
                var Chhattisgarh = ['Chhattisgarh', 'Waneep Solar Pvt. Ltd. & Focal Energy Solar One India Pvt. Ltd. (MW)'];
                var Goa = ['Goa', 'IL&FS Energy Development Co. Ltd.(MW)'];
                var Maharashtra = ['Maharashtra', 'IL&FS Energy Development Co. Ltd.(MW)'];
                var Bihar = ['Bihar', 'Focal Renewable Energy Two India Pvt. Ltd. (MW)'];
                for (var i = 13; i <= 108; i++) {
                    Chhattisgarh.push(workbook.Sheets[yourSheetsName[0]]['D' + [i]].v);
                    Goa.push(workbook.Sheets[yourSheetsName[0]]['E' + [i]].v);
                    Maharashtra.push(workbook.Sheets[yourSheetsName[0]]['F' + [i]].v);
                    Bihar.push(workbook.Sheets[yourSheetsName[0]]['G' + [i]].v);
                };

                if (lastUploadedRevision.length > 0) {
                    if (lastUploadedRevision[0].revisionNumber + 1 == revision) {
                        if (Chhattisgarh.length < 96 || Goa.length < 96 || Maharashtra.length < 96 || Bihar.length < 96) {
                            return returnFaliure('Required data not Available');
                        } else {
                            var mergeArray = [Chhattisgarh, Goa, Maharashtra, Bihar];
                            var toInsert = {
                                rrfDate: selectedDate,
                                filePath: filepath,
                                revisedState: revisedState,
                                hrefValue: href,
                                verified: false,
                                revisionNumber: revision,
                                timeStamp: new Date(),
                                mergeArray
                            }
                            RrfData.insert(toInsert);
                            // data insert in log Details collection
                            var currentDate = new Date();
                            var todayDate = moment(currentDate).format('DD-MM-YYYY');
                            var ip = this.connection.httpHeaders['x-forwarded-for'];
                            var ipArr = ip.split(',');
                            LogDetails.insert({
                                ip_address: ipArr,
                                user_id: Meteor.userId(),
                                user_name: Meteor.user().username,
                                uploaded_by: Meteor.user().profile.user_type,
                                log_type: 'RRF Uploaded R' + revision,
                                template_name: 'uploadRRF',
                                event_name: 'uploadRRFfile',
                                timestamp: new Date(),
                                action_date: todayDate,
                                rrf_json: toInsert
                            });
                            return returnSuccess('File data read');
                        }
                    } else {
                        return returnFaliure('Some mid revision missing');
                    }
                } else {
                    if (Chhattisgarh.length < 96 || Goa.length < 96 || Maharashtra.length < 96 || Bihar.length < 96) {
                        return returnFaliure('Required data not Available');
                    } else {
                        var mergeArray = [Chhattisgarh, Goa, Maharashtra, Bihar];
                        var toInsert = {
                            rrfDate: selectedDate,
                            filePath: filepath,
                            revisedState: revisedState,
                            verified: false,
                            hrefValue: href,
                            revisionNumber: revision,
                            timeStamp: new Date(),
                            mergeArray
                        }
                        RrfData.insert(toInsert);
                        // data insert in log Details collection
                        var currentDate = new Date();
                        var todayDate = moment(currentDate).format('DD-MM-YYYY');
                        var ip = this.connection.httpHeaders['x-forwarded-for'];
                        var ipArr = ip.split(',');
                        LogDetails.insert({
                            ip_address: ipArr,
                            user_id: Meteor.userId(),
                            user_name: Meteor.user().username,
                            uploaded_by: Meteor.user().profile.user_type,
                            log_type: 'RRF Uploaded R' + revision,
                            template_name: 'uploadRRF',
                            event_name: 'uploadRRFfile',
                            timestamp: new Date(),
                            action_date: todayDate,
                            rrf_json: toInsert
                        });
                        return returnSuccess('File data read');
                    }
                }
            } else {
                return returnFaliure('Selected and excel date Mismatch');
            }
        }
    },
    deleteUploadedFile(filepath) {
        var fs = Npm.require('fs');
        fs.unlink(filepath, (err) => {
            if (err)
                throw err;
            console.log('File Successfully Deleted');
        });
    }
});

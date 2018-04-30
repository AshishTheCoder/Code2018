import {Meteor} from 'meteor/meteor';

Meteor.startup(() => {
    UploadServer.init({
        tmpDir: process.env.PWD + '/.uploads/tmp',
        uploadDir: process.env.PWD + '/.uploads/',
        checkCreateDirectories: true,
        acceptFileTypes: /.(xlsx|xls|pdf)$/i,
        validateFile: function(file, req) {
            var data = file.name.split('.');
            if (data.length > 2) {
                return "File cannot have more than one extension";
            }
            return null;
        },
        finished(fileInfo, formFields) {
            if (formFields.uploadedFrom == 'uploadRRF') {
                var fs = Npm.require('fs');
                fs.renameSync(process.env.PWD + '/.uploads/' + fileInfo.name, process.env.PWD + '/.uploads/rrf_uploads/' + fileInfo.name);
                fileInfo.hrefValue = '/upload/rrf_uploads/' + fileInfo.name;
                fileInfo.actualPath = process.env.PWD + '/.uploads/rrf_uploads/' + fileInfo.name;
            }else {
                if (formFields.uploadedFrom == 'uploadJMR') {
                    var fs = Npm.require('fs');
                    fs.renameSync(process.env.PWD + '/.uploads/' + fileInfo.name, process.env.PWD + '/.uploads/jmr_uploads/' + fileInfo.name);
                    fileInfo.hrefValue = '/upload/jmr_uploads/' + fileInfo.name;
                    fileInfo.actualPath = process.env.PWD + '/.uploads/jmr_uploads/' + fileInfo.name;
                }
            }
            return fileInfo;
        }
    });
    reCAPTCHA.config({privatekey: '6LcFOykTAAAAAPsRv38WnYEat3vuv2HQ_0YdKG-C'});
    // code to run on server at startup
    var timeBlockVar = TimeBlock.find().fetch();
    if (timeBlockVar.length < 97) {
        var timeSlot = [
            {
                "time_slot": "00:00"
            }, {
                "time_slot": "00:15"
            }, {
                "time_slot": "00:30"
            }, {
                "time_slot": "00:45"
            }, {
                "time_slot": "01:00"
            }, {
                "time_slot": "01:15"
            }, {
                "time_slot": "01:30"
            }, {
                "time_slot": "01:45"
            }, {
                "time_slot": "02:00"
            }, {
                "time_slot": "02:15"
            }, {
                "time_slot": "02:30"
            }, {
                "time_slot": "02:45"
            }, {
                "time_slot": "03:00"
            }, {
                "time_slot": "03:15"
            }, {
                "time_slot": "03:30"
            }, {
                "time_slot": "03:45"
            }, {
                "time_slot": "04:00"
            }, {
                "time_slot": "04:15"
            }, {
                "time_slot": "04:30"
            }, {
                "time_slot": "04:45"
            }, {
                "time_slot": "05:00"
            }, {
                "time_slot": "05:15"
            }, {
                "time_slot": "05:30"
            }, {
                "time_slot": "05:45"
            }, {
                "time_slot": "06:00"
            }, {
                "time_slot": "06:15"
            }, {
                "time_slot": "06:30"
            }, {
                "time_slot": "06:45"
            }, {
                "time_slot": "07:00"
            }, {
                "time_slot": "07:15"
            }, {
                "time_slot": "07:30"
            }, {
                "time_slot": "07:45"
            }, {
                "time_slot": "08:00"
            }, {
                "time_slot": "08:15"
            }, {
                "time_slot": "08:30"
            }, {
                "time_slot": "08:45"
            }, {
                "time_slot": "09:00"
            }, {
                "time_slot": "09:15"
            }, {
                "time_slot": "09:30"
            }, {
                "time_slot": "09:45"
            }, {
                "time_slot": "10:00"
            }, {
                "time_slot": "10:15"
            }, {
                "time_slot": "10:30"
            }, {
                "time_slot": "10:45"
            }, {
                "time_slot": "11:00"
            }, {
                "time_slot": "11:15"
            }, {
                "time_slot": "11:30"
            }, {
                "time_slot": "11:45"
            }, {
                "time_slot": "12:00"
            }, {
                "time_slot": "12:15"
            }, {
                "time_slot": "12:30"
            }, {
                "time_slot": "12:45"
            }, {
                "time_slot": "13:00"
            }, {
                "time_slot": "13:15"
            }, {
                "time_slot": "13:30"
            }, {
                "time_slot": "13:45"
            }, {
                "time_slot": "14:00"
            }, {
                "time_slot": "14:15"
            }, {
                "time_slot": "14:30"
            }, {
                "time_slot": "14:45"
            }, {
                "time_slot": "15:00"
            }, {
                "time_slot": "15:15"
            }, {
                "time_slot": "15:30"
            }, {
                "time_slot": "15:45"
            }, {
                "time_slot": "16:00"
            }, {
                "time_slot": "16:15"
            }, {
                "time_slot": "16:30"
            }, {
                "time_slot": "16:45"
            }, {
                "time_slot": "17:00"
            }, {
                "time_slot": "17:15"
            }, {
                "time_slot": "17:30"
            }, {
                "time_slot": "17:45"
            }, {
                "time_slot": "18:00"
            }, {
                "time_slot": "18:15"
            }, {
                "time_slot": "18:30"
            }, {
                "time_slot": "18:45"
            }, {
                "time_slot": "19:00"
            }, {
                "time_slot": "19:15"
            }, {
                "time_slot": "19:30"
            }, {
                "time_slot": "19:45"
            }, {
                "time_slot": "20:00"
            }, {
                "time_slot": "20:15"
            }, {
                "time_slot": "20:30"
            }, {
                "time_slot": "20:45"
            }, {
                "time_slot": "21:00"
            }, {
                "time_slot": "21:15"
            }, {
                "time_slot": "21:30"
            }, {
                "time_slot": "21:45"
            }, {
                "time_slot": "22:00"
            }, {
                "time_slot": "22:15"
            }, {
                "time_slot": "22:30"
            }, {
                "time_slot": "22:45"
            }, {
                "time_slot": "23:00"
            }, {
                "time_slot": "23:15"
            }, {
                "time_slot": "23:30"
            }, {
                "time_slot": "23:45"
            }, {
                "time_slot": "24:00"
            }
        ];
        timeSlot.forEach(function(item) {
            TimeBlock.insert({time_slot: item.time_slot});
        });
    };

    // var mandrillUserName = "controlroom@secipowertrading.com";
    // var mandrillApiKey = "mSLd6pGuNJMpjZVpa5lJnQ";
    // // code to run on server at startup
    // Mandrill.config({username: mandrillUserName, key: mandrillApiKey});

    // code to run on server at startup
    process.env.MAIL_URL="smtp://controlroom@secipowertrading.com:Seci@0000@smtp.gmail.com:465/";
    console.log(process.env.MAIL_URL);

    var jsonToInsert = {
        "_id": "MQkW2Kfq8ShJ8iDRM",
        "createdAt": new Date(),
        "services": {
            "password": {
                "bcrypt": "$2a$10$If0yyjTP/dCywWZ824U0XuD0ldvmDDU6dO2XX99/Jtpp1CFRU7Ose"
            },
            "email": {
                "verificationTokens": [
                    {
                        "token": "DqEoPoWEcw7gLnJI_KC_3c318sF35rN_Y_PwiwXCMWH",
                        "address": "seci.scheduling@gmail.com",
                        "when": new Date()
                    }, {
                        "token": "nHp4nUYrSU3KFQNImHn_OtjxRVeGS7ZKM_xhJSGUa2n",
                        "address": "seci.scheduling@gmail.com",
                        "when": new Date()
                    }
                ]
            },
            "resume": {
                "loginTokens": []
            }
        },
        "username": "seci.scheduling@gmail.com",
        "emails": [
            {
                "address": "seci.scheduling@gmail.com",
                "verified": true
            }
        ],
        "profile": {
            "role": "User",
            "status": "approved",
            "user_type": "admin",
            "registration_form": {
                "name_of_spd": "Seci@admin",
                "project_id": "CYBZ32",
                "project_capicity": "10",
                "project_location": "New Delhi",
                "connected_substation_details": "abc",
                "injection_voltage": "abc",
                "point_of_supply": "abc",
                "name_of_coordinator_for_energy_schedules": "abc",
                "contact_details": "abc",
                "pan_number": "abc",
                "tan_number": "abc",
                "bank_details": "abc",
                "main_meter_number": "abc",
                "check_meter_number": "abc",
                "max_cuf_as_per_ppa": "abc",
                "spd_min_energy_as_per_ppa": "abc",
                "spd_max_energy_as_per_ppa": "abc",
                "transaction_type": "xyz",
                "spd_state": "nothing"
            }
        }
    };
    var data = Meteor.users.find({_id: "MQkW2Kfq8ShJ8iDRM"}).fetch();
    if (data.length > 0) {
        console.log("Admin already created!");
    } else {
        Meteor.users.insert(jsonToInsert);
        console.log("Admin created successfully!");
    }
    console.log('Syncron Refreshed.');
    SyncedCron.start();
});

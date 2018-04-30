Meteor.methods({

});


// var jsonToInsertapplicant1 = {
//     "_id": "MQkW2Kfapplicant1",
//     "createdAt": new Date(),
//     "services": {
//         "password": {
//             "bcrypt": "$2a$10$If0yyjTP/dCywWZ824U0XuD0ldvmDDU6dO2XX99/Jtpp1CFRU7Ose"
//         },
//         "email": {
//             "verificationTokens": [{
//                 "token": "DqEoPoWEcw7gLnJI_KC_3c318sF35rN_Y_Pwapplicant1",
//                 "address": "applicant1@cybuzzsc.com",
//                 "when": new Date()
//             }]
//         },
//         "resume": {
//             "loginTokens": []
//         }
//     },
//     "username": "applicant1@cybuzzsc.com",
//     "emails": [{
//         "address": "applicant1@cybuzzsc.com",
//         "verified": true
//     }],
//     "profile": {
//         "role": "Applicant",
//         "status": "approved",
//         "user_type": "applicant1",
//         "registration_form": {
//             "name_of_spd": "applicant1",
//             "project_id": "CYBZ32",
//             "project_capicity": "10",
//             "project_location": "New Delhi",
//             "connected_substation_details": "abc",
//             "injection_voltage": "abc",
//             "point_of_supply": "abc",
//             "name_of_coordinator_for_energy_schedules": "abc",
//             "contact_details": "abc",
//             "pan_number": "abc",
//             "tan_number": "abc",
//             "bank_details": "abc",
//             "main_meter_number": "abc",
//             "check_meter_number": "abc",
//             "max_cuf_as_per_ppa": "abc",
//             "spd_min_energy_as_per_ppa": "abc",
//             "spd_max_energy_as_per_ppa": "abc",
//             "transaction_type": "xyz",
//             "spd_state": "nothing"
//         }
//     }
// };
// var dataapplicant1 = Meteor.users.find({
//     _id: "MQkW2Kfapplicant1"
// }).fetch();
// if (dataapplicant1.length > 0) {
//     console.log("Applicant One already created!");
// } else {
//     Meteor.users.insert(jsonToInsertapplicant1);
//     console.log("Applicant One created successfully!");
// }
//
// var jsonToInsertapplicant2 = {
//     "_id": "MQkW2Kfapplicant2",
//     "createdAt": new Date(),
//     "services": {
//         "password": {
//             "bcrypt": "$2a$10$If0yyjTP/dCywWZ824U0XuD0ldvmDDU6dO2XX99/Jtpp1CFRU7Ose"
//         },
//         "email": {
//             "verificationTokens": [{
//                 "token": "DqEoPoWEcw7gLnJI_KC_3c318sF35rN_Y_Pwapplicant2",
//                 "address": "applicant2@cybuzzsc.com",
//                 "when": new Date()
//             }]
//         },
//         "resume": {
//             "loginTokens": []
//         }
//     },
//     "username": "applicant2@cybuzzsc.com",
//     "emails": [{
//         "address": "applicant2@cybuzzsc.com",
//         "verified": true
//     }],
//     "profile": {
//         "role": "Applicant",
//         "status": "approved",
//         "user_type": "applicant2",
//         "registration_form": {
//             "name_of_spd": "applicant2",
//             "project_id": "CYBZ32",
//             "project_capicity": "10",
//             "project_location": "New Delhi",
//             "connected_substation_details": "abc",
//             "injection_voltage": "abc",
//             "point_of_supply": "abc",
//             "name_of_coordinator_for_energy_schedules": "abc",
//             "contact_details": "abc",
//             "pan_number": "abc",
//             "tan_number": "abc",
//             "bank_details": "abc",
//             "main_meter_number": "abc",
//             "check_meter_number": "abc",
//             "max_cuf_as_per_ppa": "abc",
//             "spd_min_energy_as_per_ppa": "abc",
//             "spd_max_energy_as_per_ppa": "abc",
//             "transaction_type": "xyz",
//             "spd_state": "nothing"
//         }
//     }
// };
// var dataapplicant2 = Meteor.users.find({
//     _id: "MQkW2Kfapplicant2"
// }).fetch();
// if (dataapplicant2.length > 0) {
//     console.log("Applicant Two already created!");
// } else {
//     Meteor.users.insert(jsonToInsertapplicant2);
//     console.log("Applicant Two created successfully!");
// }
//
// var jsonToInsertapplicant3 = {
//     "_id": "MQkW2Kfapplicant3",
//     "createdAt": new Date(),
//     "services": {
//         "password": {
//             "bcrypt": "$2a$10$If0yyjTP/dCywWZ824U0XuD0ldvmDDU6dO2XX99/Jtpp1CFRU7Ose"
//         },
//         "email": {
//             "verificationTokens": [{
//                 "token": "DqEoPoWEcw7gLnJI_KC_3c318sF35rN_Y_Pwapplicant3",
//                 "address": "applicant3@cybuzzsc.com",
//                 "when": new Date()
//             }]
//         },
//         "resume": {
//             "loginTokens": []
//         }
//     },
//     "username": "applicant3@cybuzzsc.com",
//     "emails": [{
//         "address": "applicant3@cybuzzsc.com",
//         "verified": true
//     }],
//     "profile": {
//         "role": "Applicant",
//         "status": "approved",
//         "user_type": "applicant3",
//         "registration_form": {
//             "name_of_spd": "applicant3",
//             "project_id": "CYBZ32",
//             "project_capicity": "10",
//             "project_location": "New Delhi",
//             "connected_substation_details": "abc",
//             "injection_voltage": "abc",
//             "point_of_supply": "abc",
//             "name_of_coordinator_for_energy_schedules": "abc",
//             "contact_details": "abc",
//             "pan_number": "abc",
//             "tan_number": "abc",
//             "bank_details": "abc",
//             "main_meter_number": "abc",
//             "check_meter_number": "abc",
//             "max_cuf_as_per_ppa": "abc",
//             "spd_min_energy_as_per_ppa": "abc",
//             "spd_max_energy_as_per_ppa": "abc",
//             "transaction_type": "xyz",
//             "spd_state": "nothing"
//         }
//     }
// };
// var dataapplicant3 = Meteor.users.find({
//     _id: "MQkW2Kfapplicant3"
// }).fetch();
// if (dataapplicant3.length > 0) {
//     console.log("Applicant Three already created!");
// } else {
//     Meteor.users.insert(jsonToInsertapplicant3);
//     console.log("Applicant Three created successfully!");
// }
//
// var jsonToInsertapplicant4 = {
//     "_id": "MQkW2Kfapplicant4",
//     "createdAt": new Date(),
//     "services": {
//         "password": {
//             "bcrypt": "$2a$10$If0yyjTP/dCywWZ824U0XuD0ldvmDDU6dO2XX99/Jtpp1CFRU7Ose"
//         },
//         "email": {
//             "verificationTokens": [{
//                 "token": "DqEoPoWEcw7gLnJI_KC_3c318sF35rN_Y_Pwapplicant4",
//                 "address": "applicant4@cybuzzsc.com",
//                 "when": new Date()
//             }]
//         },
//         "resume": {
//             "loginTokens": []
//         }
//     },
//     "username": "applicant4@cybuzzsc.com",
//     "emails": [{
//         "address": "applicant4@cybuzzsc.com",
//         "verified": true
//     }],
//     "profile": {
//         "role": "Applicant",
//         "status": "approved",
//         "user_type": "applicant4",
//         "registration_form": {
//             "name_of_spd": "applicant4",
//             "project_id": "CYBZ32",
//             "project_capicity": "10",
//             "project_location": "New Delhi",
//             "connected_substation_details": "abc",
//             "injection_voltage": "abc",
//             "point_of_supply": "abc",
//             "name_of_coordinator_for_energy_schedules": "abc",
//             "contact_details": "abc",
//             "pan_number": "abc",
//             "tan_number": "abc",
//             "bank_details": "abc",
//             "main_meter_number": "abc",
//             "check_meter_number": "abc",
//             "max_cuf_as_per_ppa": "abc",
//             "spd_min_energy_as_per_ppa": "abc",
//             "spd_max_energy_as_per_ppa": "abc",
//             "transaction_type": "xyz",
//             "spd_state": "nothing"
//         }
//     }
// };
// var dataapplicant4 = Meteor.users.find({
//     _id: "MQkW2Kfapplicant4"
// }).fetch();
// if (dataapplicant4.length > 0) {
//     console.log("Applicant Four already created!");
// } else {
//     Meteor.users.insert(jsonToInsertapplicant4);
//     console.log("Applicant Four created successfully!");
// }
//
// var jsonToInsertapplicant5 = {
//     "_id": "MQkW2Kfapplicant5",
//     "createdAt": new Date(),
//     "services": {
//         "password": {
//             "bcrypt": "$2a$10$If0yyjTP/dCywWZ824U0XuD0ldvmDDU6dO2XX99/Jtpp1CFRU7Ose"
//         },
//         "email": {
//             "verificationTokens": [{
//                 "token": "DqEoPoWEcw7gLnJI_KC_3c318sF35rN_Y_Pwapplicant5",
//                 "address": "applicant5@cybuzzsc.com",
//                 "when": new Date()
//             }]
//         },
//         "resume": {
//             "loginTokens": []
//         }
//     },
//     "username": "applicant5@cybuzzsc.com",
//     "emails": [{
//         "address": "applicant5@cybuzzsc.com",
//         "verified": true
//     }],
//     "profile": {
//         "role": "Applicant",
//         "status": "approved",
//         "user_type": "applicant5",
//         "registration_form": {
//             "name_of_spd": "applicant5",
//             "project_id": "CYBZ32",
//             "project_capicity": "10",
//             "project_location": "New Delhi",
//             "connected_substation_details": "abc",
//             "injection_voltage": "abc",
//             "point_of_supply": "abc",
//             "name_of_coordinator_for_energy_schedules": "abc",
//             "contact_details": "abc",
//             "pan_number": "abc",
//             "tan_number": "abc",
//             "bank_details": "abc",
//             "main_meter_number": "abc",
//             "check_meter_number": "abc",
//             "max_cuf_as_per_ppa": "abc",
//             "spd_min_energy_as_per_ppa": "abc",
//             "spd_max_energy_as_per_ppa": "abc",
//             "transaction_type": "xyz",
//             "spd_state": "nothing"
//         }
//     }
// };
// var dataapplicant5 = Meteor.users.find({
//     _id: "MQkW2Kfapplicant5"
// }).fetch();
// if (dataapplicant5.length > 0) {
//     console.log("Applicant Five already created!");
// } else {
//     Meteor.users.insert(jsonToInsertapplicant5);
//     console.log("Applicant Five created successfully!");
// }
//
// var jsonToInsertapplicant6 = {
//     "_id": "MQkW2Kfapplicant6",
//     "createdAt": new Date(),
//     "services": {
//         "password": {
//             "bcrypt": "$2a$10$If0yyjTP/dCywWZ824U0XuD0ldvmDDU6dO2XX99/Jtpp1CFRU7Ose"
//         },
//         "email": {
//             "verificationTokens": [{
//                 "token": "DqEoPoWEcw7gLnJI_KC_3c318sF35rN_Y_Pwapplicant6",
//                 "address": "applicant6@cybuzzsc.com",
//                 "when": new Date()
//             }]
//         },
//         "resume": {
//             "loginTokens": []
//         }
//     },
//     "username": "applicant6@cybuzzsc.com",
//     "emails": [{
//         "address": "applicant6@cybuzzsc.com",
//         "verified": true
//     }],
//     "profile": {
//         "role": "Applicant",
//         "status": "approved",
//         "user_type": "applicant6",
//         "registration_form": {
//             "name_of_spd": "applicant6",
//             "project_id": "CYBZ32",
//             "project_capicity": "10",
//             "project_location": "New Delhi",
//             "connected_substation_details": "abc",
//             "injection_voltage": "abc",
//             "point_of_supply": "abc",
//             "name_of_coordinator_for_energy_schedules": "abc",
//             "contact_details": "abc",
//             "pan_number": "abc",
//             "tan_number": "abc",
//             "bank_details": "abc",
//             "main_meter_number": "abc",
//             "check_meter_number": "abc",
//             "max_cuf_as_per_ppa": "abc",
//             "spd_min_energy_as_per_ppa": "abc",
//             "spd_max_energy_as_per_ppa": "abc",
//             "transaction_type": "xyz",
//             "spd_state": "nothing"
//         }
//     }
// };
// var dataapplicant6 = Meteor.users.find({
//     _id: "MQkW2Kfapplicant6"
// }).fetch();
// if (dataapplicant6.length > 0) {
//     console.log("Applicant Six already created!");
// } else {
//     Meteor.users.insert(jsonToInsertapplicant6);
//     console.log("Applicant Six created successfully!");
// }

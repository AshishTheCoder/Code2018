Meteor.methods({
    "callRadioValueAccess": function() {
        var json = Discom.find().fetch();
        return returnSuccess('Returning Discom list on Open Access', json);
    },
    "openAccessGetSPDNames": function(discomId) {
        var discomData = Discom.find({
            _id: discomId
        }).fetch();
        //for unregister discom which is not submited detail by open access in OpenAccessDetails collection
        var openAccessData = OpenAccessDetails.find({
            discom_id: discomId
        }).fetch();
        if (openAccessData.length > 0) {
            var checkData = 'Yes';
        } else {
            var checkData = 'No';
        }
        var json = {
            check_data: checkData,
            discom_state: discomData[0].discom_state,
            spdData: discomData[0].spdIds
        };
        return returnSuccess('spd list', json);
    },
    "insertOpenAccessData": function(discom_state, discomId, ctujson, stujson, discomjson) {
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');
        if (discom_state == 'Rajasthan' || discom_state == 'Tamil Nadu' || discom_state == 'Karnataka') {
          var checkForUpdate = OpenAccessDetails.find({discom_id:discomId}).fetch();
          if(checkForUpdate.length > 0){
            // used for insert log data
            var openAccessData = OpenAccessDetails.find({discom_id:discomId}).fetch();
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_addrss:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                discom_id: discomId,
                discom_state:discom_state,
                log_type: 'Update Open Access',
                template_name: 'open_access',
                event_name: 'openaccessform',
                timestamp: new Date(),
                action_date:todayDate,
                before_update: openAccessData[0],
                after_update: {
                    discom_id: discomId,
                    discom_state: discom_state,
                    discom: discomjson,
                    timestamp: new Date()
                }
            });
            OpenAccessDetails.remove({discom_id:discomId});
            OpenAccessDetails.insert({
                discom_id: discomId,
                discom_state: discom_state,
                discom: discomjson,
                timestamp: new Date()
            });
            return returnSuccess('Successfully Updated!');
          }else{
            OpenAccessDetails.insert({
                discom_id: discomId,
                discom_state: discom_state,
                discom: discomjson,
                timestamp: new Date()
            });
            // used for insert log data
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_addrss:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                discom_id: discomId,
                discom_state:discom_state,
                log_type: 'Insert Open Access',
                template_name: 'open_access',
                event_name: 'openaccessform',
                timestamp: new Date(),
                action_date:todayDate,
                json:{
                    discom_id: discomId,
                    discom_state: discom_state,
                    discom: discomjson,
                    timestamp: new Date()
                }
            });
            return returnSuccess('Successfully Submited!');
          }
        } else {
          var checkForUpdate = OpenAccessDetails.find({discom_id:discomId}).fetch();
          if(checkForUpdate.length > 0){
            // used for insert log data
            var openAccessData = OpenAccessDetails.find({discom_id:discomId}).fetch();
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_addrss:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                discom_id: discomId,
                discom_state:discom_state,
                log_type: 'Update Open Access',
                template_name: 'open_access',
                event_name: 'openaccessform',
                timestamp: new Date(),
                action_date:todayDate,
                before_update: openAccessData[0],
                after_update: {
                  discom_id: discomId,
                  discom_state: discom_state,
                  ctu: ctujson,
                  stu: stujson,
                  discom: discomjson,
                  timestamp: new Date()
                }
            });
            OpenAccessDetails.remove({discom_id:discomId});
            OpenAccessDetails.insert({
                discom_id: discomId,
                discom_state: discom_state,
                ctu: ctujson,
                stu: stujson,
                discom: discomjson,
                timestamp: new Date()
            });
            return returnSuccess('Successfully Updated!');
          }else{
            OpenAccessDetails.insert({
                discom_id: discomId,
                discom_state: discom_state,
                ctu: ctujson,
                stu: stujson,
                discom: discomjson,
                timestamp: new Date()
            });
            // used for insert log data
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_addrss:ipArr,
                user_id: Meteor.userId(),
                user_name: Meteor.user().username,
                discom_id: discomId,
                discom_state:discom_state,
                log_type: 'Insert Open Access',
                template_name: 'open_access',
                event_name: 'openaccessform',
                timestamp: new Date(),
                action_date:todayDate,
                json: {
                  discom_id: discomId,
                  discom_state: discom_state,
                  ctu: ctujson,
                  stu: stujson,
                  discom: discomjson,
                  timestamp: new Date()
                }
            });
            return returnSuccess('Successfully Submited!');
          }
        }
    },
    "UserWantToEditAndUpdateData": function(discomState, discomId) {
        var returnJson = {};
        var findData = OpenAccessDetails.find({
            discom_id: discomId
        }).fetch();
        if (findData.length > 0) {
            if (discomState == 'Rajasthan' || discomState == 'Tamil Nadu' || discomState == 'Karnataka') {
                returnJson = {
                    discom_psa_validity_from: findData[0].discom.discom_psa_validity_from,
                    discom_psa_validity_to: findData[0].discom.discom_psa_validity_to,
                    discom_capacity: findData[0].discom.discom_capacity,
                    connected_spd: findData[0].discom.connected_spd
                };
            } else {
                returnJson = {
                    ctu_name: findData[0].ctu.ctu_name,
                    ctu_intimation_no: findData[0].ctu.ctu_intimation_no,
                    ctu_lta_date: findData[0].ctu.ctu_lta_date,
                    ctu_from_date: findData[0].ctu.ctu_from_date,
                    ctu_to_date: findData[0].ctu.ctu_to_date,
                    ctu_valid_upto: findData[0].ctu.ctu_valid_upto,
                    ctu_capacity: findData[0].ctu.ctu_capacity,
                    connected_spd: findData[0].ctu.connected_spd,

                    stu_name: findData[0].stu.stu_name,
                    stu_intimation_no: findData[0].stu.stu_intimation_no,
                    stu_lta_date: findData[0].stu.stu_lta_date,
                    stu_from_date: findData[0].stu.stu_from_date,
                    stu_to_date: findData[0].stu.stu_to_date,
                    stu_valid_upto: findData[0].stu.stu_valid_upto,
                    stu_capacity: findData[0].stu.stu_capacity,

                    discom_noc_refNo: findData[0].discom.discom_noc_refNo,
                    discom_intimation_no: findData[0].discom.discom_intimation_no,
                    discom_noc_date: findData[0].discom.discom_noc_date,
                    discom_from_date: findData[0].discom.discom_from_date,
                    discom_to_date: findData[0].discom.discom_to_date,
                    discom_valid_upto: findData[0].discom.discom_valid_upto,
                    discom_psa_validity_from: findData[0].discom.discom_psa_validity_from,
                    discom_psa_validity_to: findData[0].discom.discom_psa_validity_to,
                    discom_capacity: findData[0].discom.discom_capacity
                };
            }
        }
        return returnSuccess('Successfully Edited', returnJson);
    },
    "viewReportOnModalBody":function(discomId){
      var data = OpenAccessDetails.find({discom_id:discomId}).fetch();
      return returnSuccess('Successfully View',data[0]);
    }
});

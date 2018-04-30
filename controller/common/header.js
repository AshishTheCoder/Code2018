Template.header.events({
  "click .revDataHeader":function(e){
    var scheduleId =  $(e.currentTarget).attr("attrId")
    swal({
            title: "Are you sure?",
            text: "To revised the schedule!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, revised ",
            closeOnConfirm: true
        },
        function(isConfirm) {
            if (isConfirm) {
              Meteor.call("hideHeaderAlertAndUpdateStatusChecked",scheduleId, function(error, result) {
                  if (error) {
                      swal("Oops...", "Please try again!", "error");
                  } else {
                      if (result.status) {
                          // swal("Successfull","Schedule successfull revised!","success");
                      } else {

                      }
                  }
              });
            }
        });
  }
});



Template.header.helpers({
  "isLoading":function() {
    if(SessionStore.get("isLoading")) {
      return "display: unset";
    } else {
      return "display: none";
    }
  },
    "isUserTypeAdmin": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'admin') {
            return true;
        }else {
          return false;
        }
      }
    },
    "isUserAtLevel2": function() {
      if (Meteor.userId()) {
        if (Meteor.user().username == 'avnish.parashar@seci.co.in') {
            return true;
        }else {
          return false;
        }
      }
    },
    "isUserTypeCommercial": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'commercial') {
            return true;
        }else {
          return false;
        }
      }
    },
    "isUserTypeFinance": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'finance') {
            return true;
        }else {
          return false;
        }
      }
    },
    "isUserTypeMaster": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'master') {
            return true;
        }else {
          return false;
        }
      }
    },
    "ifRoleIsApplicant": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.role == 'Applicant') {
            return true;
        }else {
          return false;
        }
      }
    },
    "isUserTypeSPDApproved": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'spd' && Meteor.user().profile.status == 'approved') {
            return true;
        }else {
          return false;
        }
      }
    },
    "isUserTypeSPDPending": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'spd' && Meteor.user().profile.status == 'pending') {
            return true;
        }else {
          return false;
        }
      }
    },
    isUserAtLevelOne() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.registration_form) {
            if (Meteor.user().profile.user_type == 'applicant1') {
                return true;
            }else{
                return false;
            }
        }
      }
    },
    "showInterMenu": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.registration_form) {
            if (Meteor.user().profile.registration_form.transaction_type == "Inter" && Meteor.user().profile.registration_form.spd_state != 'Rajasthan') {
                return true;
            }
        }
      }
    },
    "showInterMenuForRajsthanInter": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.registration_form) {
            if (Meteor.user().profile.registration_form.transaction_type == "Inter" && Meteor.user().profile.registration_form.spd_state == 'Rajasthan') {
                return true;
            }
        }
      }
    },
    "isUserLogedIn": function () {
      if(Meteor.user()){
        if (Meteor.user().emails[0].verified == true) {
          return true;
        }
      }
    },
    "isSTUlossUpdatedForNextMonth": function(){
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'admin') {
          var dateInst = new moment();
          var data = new moment();
          // * adding 1 month from the present month and then subtracting 1 day,
          // * So you would get the last day of this month
          dateInst.add(1, 'months').date(1).subtract(1, 'days');
          var lastDateOfMonth = dateInst.format('DD-MM-YYYY');
          data.add(1, 'months').date(1).subtract(2, 'days');
          var secondLastDateOfMonth = data.format('DD-MM-YYYY');
          /* printing the last day of this month's date */
          var currentDate = new Date();
          currentDate.setTime(currentDate.getTime());
          var hrs = currentDate.getHours();
          var min = currentDate.getMinutes();
          var time = (hrs + ":" + min);
          var time2 = (hrs + ":" + Number(Number(min) - 1));
          var n = time;
          var n1 = n.split('_');
          var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
          console.log(time);

          var currentDateOfMonth = moment(currentDate).format("DD-MM-YYYY");
          var myDate = moment().add(1, 'months');
          var duedate = myDate.format('DD-MM-YYYY');
          var newDate = duedate.split("-");
          var nextMonth = newDate[1];
          var yearVar = newDate[2];
          var stateArr = [{state:'Rajasthan'},{state:'Gujarat'},{state:'MP'}];
          if(secondLastDateOfMonth == currentDateOfMonth){
              stateArr.forEach(function(item){
                var stuLossVar = StuCharges.find({state:item.state,month:nextMonth,year:yearVar}).fetch();
                if(stuLossVar.length == 0){
                  if (time == '10:00' || time == '13:00' || time == '16:00' || time >= '22:00') {
                    swal('Please submit STU loss for '+monthInWords(Number(nextMonth))+"' "+yearVar);
                  }
                }else{
                  return false;
                }
              });
          }else if(currentDateOfMonth == secondLastDateOfMonth){
            stateArr.forEach(function(item){
              var stuLossVar = StuCharges.find({state:item.state,month:nextMonth,year:yearVar}).fetch();
              if(stuLossVar.length == 0){
                // if (time == '10:00' || time == '12:00' || time == '14:00' || time >= '16:00') {
                  swal('Please submit STU loss for '+monthInWords(Number(nextMonth))+"' "+yearVar);
                // }
              }else{
                return false;
              }
            });
          }else{
            return false;
          }
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    "showLatestRevisionOnHeader":function(){
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'admin') {
          var currentDate = new Date();
          var todayDate = moment(currentDate).format('DD-MM-YYYY');
          currentDate.setTime(currentDate.getTime());
          var hrs = currentDate.getHours();
          var min = currentDate.getMinutes();
          var time = (hrs + ":" + min);
          var time2 = (hrs + ":" + Number(Number(min) - 1));
          var n = time;
          var n1 = n.split('_');
          var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);

          var testData = ScheduleSubmission.find({current_date_revision:todayDate,status:'unchecked'}, {sort: {current_date_timestamp :-1},limit: 1}).fetch();
          if(testData.length > 0){
            var dynamicLength = testData[0].json.length;
            var currentRevision = "REV-" + (Number(dynamicLength) - 1);
              // if actual_revision_time is == current time then if condition will true and alert will seen
            if(testData[0].actual_revision_time == time || testData[0].actual_revision_time == time2){
              swal(testData[0].revision_type+' '+currentRevision+' by '+testData[0].name_of_spd+' at '+testData[0].actual_revision_time);
            }
            var json ={schedule_id:testData[0]._id,current_revision:currentRevision,rev_type:testData[0].revision_type,spd_name:testData[0].name_of_spd};
            return json;
          }else{
            return false;
          }
        }else {
          return false;
        }
      }
    },
    "isLatestRevisionDataAvailable":function(){
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'admin') {
          var currentDate = new Date();
          var todayDate = moment(currentDate).format('DD-MM-YYYY');
          currentDate.setTime(currentDate.getTime());
          var hrs = currentDate.getHours();
          var min = currentDate.getMinutes();
          var time = (hrs + ":" + min);
          var n = time;
          var n1 = n.split('_');
          var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);
          var testData = ScheduleSubmission.find({current_date_revision:todayDate,status:'unchecked'}, {sort: {current_date_timestamp :-1},limit: 1}).fetch();
          // if(testData.length > 0 && testData[0].actual_revision_time == time){
          if(testData.length > 0){
            var dynamicLength = testData[0].json.length;
            if(dynamicLength > 1){
              return true;
            }else{
              return false;
            }
          }
        }else {
          return false;
        }
      }
    },
    "showUserId":function(){
      //meteor add remcoder:chronos
      // return Chronos.moment().format("HH:mm:ss");
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type != 'admin') {
          return Meteor.user().username;
        }else {
          return false;
        }
      }else {
        return false;
      }
    }
});

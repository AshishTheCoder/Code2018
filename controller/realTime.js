import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.realtime.onCreated(function abcd() {
    this.getUserFormvalues = new ReactiveVar;
    this.getChangeCredentials = new ReactiveVar;
    this.defaultersList = new ReactiveVar;
    this.sendEmailId = new ReactiveVar;
    this.gettingRejectedFile = new ReactiveVar;
});
Template.realtime.rendered = function() {
    var instance = Template.instance();
    var userType = Meteor.user().profile.user_type;
    if (userType == 'admin' || userType == 'master') {
      SessionStore.set("isLoading",true);
      Meteor.call("callDefaulterList", function(error, result) {
          if (error) {
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading",false);
                  instance.defaultersList.set(result.data);
              }else{
                SessionStore.set("isLoading",false);
                instance.defaultersList.set('');
              }
          }
      });
    }
    if (userType == 'commercial' || userType == 'master' || userType == 'finance') {
      SessionStore.set("isLoading",true);
      Meteor.call("gettingPaymentNoteStatus", function(error, result) {
          if (error) {
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading",false);
                  instance.gettingRejectedFile.set(result.data);
              }
          }
      });
    }
};
Template.realtime.events({
    "click #viewUser": function(e, t) {
        var instance = Template.instance();
        Meteor.call("callViewUser", $(e.currentTarget).attr("data-title"), function(error, result) {
            if (error) {
                swal("Oops...", "Please try again!", "error");
            } else {
                if (result.status) {
                    instance.getUserFormvalues.set(result.data);
                } else {}
            }
        })
    },
    "click #approveUser": function(e, t) {
        swal({
                title: "Are you sure?",
                text: "You want to approve user!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, approve it!",
                closeOnConfirm: false
            },
            function() {
                Meteor.call("callApproveUser", $(e.currentTarget).attr('attr'), function(error, result) {
                    if (error) {} else {
                        if (result.status) {
                            swal("Nice!", result.message, "success");
                        }
                    }
                })
            });
    },
    "click #rejectUser": function(e, t) {
        swal({
                title: "Are you sure?",
                text: "You want to reject spd, it will remove its all details!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d9534f",
                confirmButtonText: "Yes, reject it!",
                closeOnConfirm: false
            },
            function() {
                Meteor.call("callRejectUser", $(e.currentTarget).attr('attr'), function(error, result) {
                    if (error) {} else {
                        if (result.status) {
                            swal("Nice!", result.message, "success");
                        }
                    }
                })
            });
    },
    "click #viewChangeCredentials": function(e, t) {
        var instance = Template.instance();
        Meteor.call("callViewChangeCredentials", $(e.currentTarget).attr("data-title"), function(error, result) {
            if (error) {} else {
                if (result.status) {
                    instance.getChangeCredentials.set(result.data);
                } else {}
            }
        })
    },
    "click #approveChange": function(e, t) {
        swal({
                title: "Are you sure?",
                text: "You want to approve the change!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, approve it!",
                closeOnConfirm: false
            },
            function() {
                Meteor.call("callApproveChange", $(e.currentTarget).attr('attr'), $(e.currentTarget).attr('myattr'), function(error, result) {
                    if (error) {} else {
                        if (result.status) {
                            swal("Nice!", result.message, "success");
                        }
                    }
                })
            });
    },
    "click #rejectChange": function(e, t) {
        var instance = Template.instance();
        swal({
                title: "Are you sure?",
                text: "You want to reject the change!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d9534f",
                confirmButtonText: "Yes, reject it!",
                closeOnConfirm: false
            },
            function() {
                Meteor.call("callRejectChange", $(e.currentTarget).attr('attr'), $(e.currentTarget).attr('myattr'), function(error, result) {
                    if (error) {} else {
                        if (result.status) {
                            swal("Nice!", result.message, "success");
                        }
                    }
                })
            });
    },

    "click #sendEmail": function(e, t) {
        var showMailId = $(e.currentTarget).attr('data-title');
        Template.instance().sendEmailId.set(showMailId);
    },
    "click #sendIndividualMailBtn": function() {
        var txtEmailToVar = $('#txtEmailTO').val();
        var txtCurrentDateVar = $('#txtCurrentDate').val();
        var txtEmailSubjectVar = $('#txtEmailSubject').val();
        var txtEmailMessageVar = $('#txtEmailMessage').val();
        Meteor.call("SendIndividualMailToDefaulters", txtEmailToVar, txtCurrentDateVar, txtEmailSubjectVar, txtEmailMessageVar, function(error, result) {
            if (error) {
                swal("Please try again !");
            } else {
                if (result.status) {
                    swal("Sent!", "Email successfully sent!", "success");
                }
            }
        })
    },
    "click #remove": function(e) {
        var data = Meteor.user().profile.alert;
        var toInsert = [];
        data.forEach(function(item) {
            if (item.userId == $(e.currentTarget).attr('attr')) {} else {
                toInsert.push(item);
            }
        });
        SessionStore.set("isLoading",true);
        Meteor.call("updateAlert",toInsert, function(error, result) {
            if (error) {
                SessionStore.set("isLoading",false);
                swal("Please try again!");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading",false);
                }
            }
        });
    },
    "click #removeExtraJmr": function(e) {
        swal({
                title: "Are you sure?",
                text: "You want to reject extra energy request!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d9534f",
                confirmButtonText: "Yes, reject it!",
                closeOnConfirm: false
            },
            function() {
                var userId = $(e.currentTarget).attr('attr');
                var month = $(e.currentTarget).attr('atrMonth');
                var year = $(e.currentTarget).attr('atrYear');
                var data = Meteor.user().profile.exceedJmrData;
                var toInsert = [];
                data.forEach(function(item) {
                    if (item.userId == userId && item.month == month && item.financialYear == year) {} else {
                        toInsert.push(item);
                    }
                })
                Meteor.call("rejectExtraEnergyRequest", userId, month, year, toInsert, function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again!", "error");
                    } else {
                        if (result.status) {
                            swal("Nice!", result.message, "success");
                        }
                    }
                });
            });
    },
    "click #acceptExtraJmr": function(e) {
        swal({
                title: "Are you sure?",
                text: "You want to accept extra energy request!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#55dd6b",
                confirmButtonText: "Yes, accept it!",
                closeOnConfirm: false
            },
            function() {
                var userId = $(e.currentTarget).attr('attr');
                var month = $(e.currentTarget).attr('atrMonth');
                var year = $(e.currentTarget).attr('atrYear');
                var data = Meteor.user().profile.exceedJmrData;
                var toInsert = [];
                data.forEach(function(item) {
                    if (item.userId == userId && item.month == month && item.financialYear == year) {} else {
                        toInsert.push(item);
                    }
                });
                SessionStore.set("isLoading",true);
                Meteor.call("updateExceedJmrData",toInsert, function(error, result) {
                    if (error) {
                        SessionStore.set("isLoading",false);
                        swal("Please try again!");
                    } else {
                        if (result.status) {
                            SessionStore.set("isLoading",false);
                            swal("Nice!", "Extra energy request accepted!", "success");
                        }
                    }
                });
            });
    },
    'click #btnHideIt': function(e, instance) {
      var ids = $(e.currentTarget).attr('attrId');
      swal({
          title: "Are you sure?",
          text: "You want to hide it!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#55dd6b",
          confirmButtonText: "Yes, hide it!",
          closeOnConfirm: false
      },
      function() {
          SessionStore.set("isLoading",true);
          Meteor.call("gettingPaymentNoteStatus",ids, function(error, result) {
              if (error) {
                  SessionStore.set("isLoading",false);
                  swal("Oops...", "Please try again!", "error");
              } else {
                  if (result.status) {
                      SessionStore.set("isLoading",false);
                      instance.gettingRejectedFile.set(result.data);
                  }
              }
          });
      });
    }
});

Template.realtime.helpers({
  "isUserTypeAdminToShow": function() {
    if (Meteor.userId()) {
      var userType = Meteor.user().profile.user_type;
      if (userType == 'admin' || userType == 'master') {
          return true;
      }else {
        return false;
      }
    }
  },
  "isUserTypeFinancial_Master_Comercial": function() {
    if (Meteor.userId()) {
      var userType = Meteor.user().profile.user_type;
      if (userType == 'commercial' || userType == 'master' || userType == 'finance') {
          return true;
      }else {
        return false;
      }
    }
  },
  "isUserTypeCommercialToShow": function() {
    if (Meteor.userId()) {
      var userType = Meteor.user().profile.user_type;
      if (userType == 'commercial' || userType == 'master') {
          return true;
      }else {
        return false;
      }
    }
  },
    "userValues": function() {
      // if(Meteor.user().profile.user_type == 'commercial'){
        var data = Meteor.users.find({
            'profile.user_type': 'spd',
            'profile.status': 'pending'
        }).fetch();
        var userArray = [];
        data.forEach(function(item) {
            if (item.profile.registration_form) {
                var data = {};
                data.id = item._id;
                var createDate = item.createdAt;
                data.date = moment(createDate).format('DD-MM-YYYY');
                data.notice = "New Registration";
                data.name = item.profile.registration_form.name_of_spd;
                userArray.push(data);
            }
        });
        return userArray;
    },
    "viewFormSpdUser": function() {
        return Template.instance().getUserFormvalues.get();
    },
    "credentialRequest": function() {
      if (Meteor.user()) {
        var userType = Meteor.user().profile.user_type;
        if(userType == 'commercial' || userType == 'master'){
          var data = ChangeCredential.find({status:'Pending'}).fetch();
          var changeArray = [];
          data.forEach(function(item) {
              var requestJson = {};
              var createDate = item.timestamp;
              requestJson.date = moment(createDate).format('DD-MM-YYYY');
              requestJson.id = item._id;
              var details = Meteor.users.find({
                  _id: item.clientId
              }).fetch();
              requestJson.name = details[0].profile.registration_form.name_of_spd;
              requestJson.notice = "Change Request";
              requestJson.clientId = item.clientId;
              changeArray.push(requestJson);
          });
          return changeArray;
        }else{
          return false;
        }
      }
    },
    "allCredential": function() {
        return Template.instance().getChangeCredentials.get();
    },
    "viewTodayDate": function() {
        var date = new Date();
        return moment(date).format('DD-MM-YYYY');
    },
    "listOfDefaulters": function() {
        if (Template.instance().defaultersList.get()) {
            return Template.instance().defaultersList.get();
        } else {
            return false;
        }
    },
    "returnRejectedFileStatus": function() {
        if (Template.instance().gettingRejectedFile.get()) {
            return Template.instance().gettingRejectedFile.get();
        } else {
            return false;
        }
    },
    getMonthValue(monthIndex) {
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var myData = getArray(dateArr, monthIndex);
        return myData;
    },
    "tommorowDateShow": function() {
        var dateToday = moment();
        var tomorrow = dateToday.add(1, 'days');
        var tomorrowDate = moment(tomorrow).format("DD-MM-YYYY");
        return tomorrowDate;
    },
    "serial": function(index) {
        return index + 1;
    },
    "showEmail": function() {
        return Template.instance().sendEmailId.get();
    },
    callAlerts() {
        if (Meteor.user()) {
            if (Meteor.user().profile.alert) {
                return Meteor.user().profile.alert;
            }
        }
    },
    "showRevisions": function() {
        var today = new Date();
        var todayMoment = moment(today).format('DD-MM-YYYY');

        today.setTime(today.getTime());
        var hrs = today.getHours();
        var min = today.getMinutes();
        var time = (hrs + ":" + min);
        var n = time;
        var n1 = n.split('_');
        var time = am_pm_to_hours(n1[0] + ':' + n1[1] + ' ' + n1[2]);

        var myArray = [];
        var result = '';
        var tomorrowResult = '';
            result = ScheduleSubmission.find({date: todayMoment,revision_status:'revised'}).fetch();
              if (result.length > 0) {
                result.forEach( function(itemData){
                  if (result[0].json.length > 1) {
                      var dynamicLength = itemData.json.length;
                      var currentRevision = "R" + (Number(dynamicLength) - 1);
                      myArray.push({
                          id: itemData.clientId,
                          name: itemData.name_of_spd,
                          revision_date: itemData.date,
                          rev: "R" + (Number(dynamicLength) - 1),
                          rev_time: itemData.actual_revision_time,
                          type_of_revision: itemData.revision_type,
                          current_date_timestamp:itemData.current_date_timestamp
                      })
                  }
                });
              }

            if (time >= '15:00') {
              var tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              var tomorrowDate = moment(tomorrow).format('DD-MM-YYYY');
              tomorrowResult = ScheduleSubmission.find({
                  date: tomorrowDate,
                  revision_type: 'Day Ahead',
                  revision_status:'revised'
              }).fetch();
                if (tomorrowResult.length > 0) {
                  tomorrowResult.forEach( function(RevData){
                    if (tomorrowResult[0].json.length > 1) {
                        var dynamicLength = RevData.json.length;
                        var currentRevision = "R" + (Number(dynamicLength) - 1);
                        myArray.push({
                            id: RevData.clientId,
                            name: RevData.name_of_spd,
                            revision_date: tomorrowDate,
                            rev: "R" + (Number(dynamicLength) - 1),
                            rev_time: RevData.actual_revision_time,
                            type_of_revision: RevData.revision_type,
                            current_date_timestamp:RevData.current_date_timestamp
                        })
                    }
                  });
                }
            }
        SessionStore.set("isLoading",false);
        if (myArray.length > 0) {
          myArray.sort(sortFunction);
            return myArray;
        } else {
            return false;
        }
    },
    callAlertsJmrData() {
        if (Meteor.user()) {
            if (Meteor.user().profile.exceedJmrData) {
                return Meteor.user().profile.exceedJmrData;
            }
        }
    },
});
function getArray(ary, month) {
    return ary[month - 1];
};
function sortFunction(a,b){
    var dateA = new Date(a.current_date_timestamp).getTime();
    var dateB = new Date(b.current_date_timestamp).getTime();
    return dateA < dateB ? 1 : -1;
};

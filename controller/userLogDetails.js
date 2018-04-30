import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.userLogDetails.onCreated(function abcd() {
    this.selectedDate = new ReactiveVar;
    this.userType = new ReactiveVar;
    this.selectedUsers = new ReactiveVar;
    this.viewTable = new ReactiveVar;
    this.showUserNames = new ReactiveVar;
    this.userTypes = new ReactiveVar;
});
Template.userLogDetails.rendered = function() {
    $('.selectedDate').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true
    })
};
Template.userLogDetails.events({

    "change .selectedDate": function(e, instance) {
        Template.instance().selectedDate.set($(e.currentTarget).val());
        instance.viewTable.set(false);
        $("#selectUserType").val('');
        $("#selectSpdName").val('');
        instance.selectedUsers.set('');
        instance.userType.set('');
        instance.viewTable.set('');
        instance.showUserNames.set(false);
    },
    "change #selectUserType": function(e, instance) {
        instance.viewTable.set('');
        instance.userType.set($(e.currentTarget).val());
        instance.showUserNames.set(false);
        Meteor.call('returnUsersName', $(e.currentTarget).val(), function(err, response) {
            if (err) {
                alert(err.reason);
            } else {
                instance.selectedUsers.set(response);
            }
        })
    },
    "change #selectSpdName": function(e, instance) {
        var date = $(".selectedDate").val();
        var spdName = $("#selectUserType").val();
        if (date == '' || spdName == '' || $(e.currentTarget).val() == '') {
            instance.viewTable.set('');
            swal('All fields are required!');
        } else {
            var json = {
                "date": date,
                "userId": $(e.currentTarget).val()
            }
            Meteor.call('returnLogDetails', json, function(err, response) {
                if (err) {
                    alert(err.reason);
                } else {
                    if (response.status) {
                        instance.viewTable.set(response.data);
                    } else {
                      instance.viewTable.set();
                        swal(response.message);
                    }
                }
            })
        }
    }
});
Template.userLogDetails.helpers({
    serialNO(index) {
        return index + 1;
    },
    showDate() {
        if (Template.instance().selectedDate.get()) {
            return Template.instance().selectedDate.get();
        }
    },
    showUser() {
        if (Template.instance().spdName.get()) {
            return Template.instance().spdName.get();
        }
    },
    selectedUsers() {
        if (Template.instance().selectedUsers.get()) {
            return Template.instance().selectedUsers.get();
        }
    },
    showTable() {
        if (Template.instance().viewTable.get()) {
            return true;
        }
    },
    showTableData() {
        if (Template.instance().viewTable.get()) {
            return Template.instance().viewTable.get();
        }
    },
    showUserNames() {
        if (Template.instance().selectedUsers.get()) {
            return true;
        }
    },
    showuserTypes() {
        if (Template.instance().userTypes.get()) {
            return Template.instance().userTypes.get();
        }
    },
    isUserSPD() {
        if (Template.instance().userType.get() == 'spd') {
          return true;
        }else{
          return false;
        }
    },
    Timestamp(time) {
        var date = new Date(time);
        var hour = date.getTime();
        var time = moment(hour).format('HH:mm:ss')

        return time;
    },
    isUserTypeMaster(){
      if (Meteor.user().profile.user_type == 'master') {
        return true;
      }else {
        return false;
      }
    }

});

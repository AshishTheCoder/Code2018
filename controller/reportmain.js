import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.reports.onCreated(function xyz() {

});
Template.reports.rendered = function() {
    SessionStore.set("isLoading", false);
};

Template.reports.events({
});

Template.reports.helpers({
  "isUserTypeAdminToViewBIllingReport": function() {
    if (Meteor.userId()) {
      if (Meteor.user().profile.user_type == 'admin') {
          return true;
      }else {
        return false;
      }
    }
  },
  "isUserTypeAdminForReports": function() {
    if (Meteor.userId()) {
      if (Meteor.user().profile.user_type == 'admin' || Meteor.user().profile.user_type == 'master') {
          return true;
      }else {
        return false;
      }
    }
  },
  "isUserTypeCommercialForReports": function() {
    if (Meteor.userId()) {
      if (Meteor.user().profile.user_type == 'finance' || Meteor.user().profile.user_type == 'commercial' || Meteor.user().profile.user_type == 'master') {
          return true;
      }else {
        return false;
      }
    }
  }
});

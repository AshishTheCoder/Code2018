import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.myprofile.onCreated(function abcd() {
    this.registeredData = new ReactiveVar;
});

Template.myprofile.rendered = function() {
  SessionStore.set("isLoading",false);
};

Template.myprofile.events({

});

Template.myprofile.helpers({
    "returnData": function() {
      if(Meteor.user().profile.registration_form){
        return Meteor.user().profile.registration_form;
      }else{
        return false;
      }
    }
});

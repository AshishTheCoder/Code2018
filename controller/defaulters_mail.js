import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.defaultersMail.onCreated(function ss() {
});

Template.defaultersMail.rendered = function() {
  SessionStore.set("isLoading",false);
    Meteor.call("makeDefaultersList", function(error, result) {
      if(error){
        swal("Server error");
      }else {
        if(result.status){
          // console.log(result.message);
        }
      }
    })
};

Template.layout.helpers({
    // isLoading: function() {
    //     return SessionStore.get("loading");
    // },
    isLoggedin: function() {
        if (Meteor.userId()) {
            return true;
        }
    }
});

Template.logbook_menu.helpers({
  isUserTypeFinanceLoggedIn(){
    if (Meteor.userId()) {
      if (Meteor.user().profile.user_type == 'finance') {
        return false;
      }else {
        return true;
      }
    }
  }
});

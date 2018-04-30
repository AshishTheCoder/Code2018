Template.searchModules.onCreated(function abcd() {
    this.modulesListArr = new ReactiveVar;
});
Template.searchModules.rendered = function() {};

Template.searchModules.events({
  'keyup .txtSerachModule': function (e, instance) {
    var data = $(e.currentTarget).val();
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
      var userVar = 'spd'
    }else {
      var userVar = 'Seci Staff'
    }
    var dataModule = ModuleLists.find({allowToaccess:userVar,'name':{'$regex':data}}).fetch();
    instance.modulesListArr.set(dataModule);
  },
  'click #btnSearch': function(e, instance) {
    var selected = $('.txtSerachModule').val();
    var userType = Meteor.user().profile.user_type;
    if (userType == 'spd') {
      var userVar = 'spd'
    }else {
      var userVar = 'Seci Staff'
    }
    var data = ModuleLists.find({allowToaccess:userVar,'name':selected}).fetch();
    Router.go(data[0].url);
  }
});

Template.searchModules.helpers({
  returnList(){
    if (Template.instance().modulesListArr.get()) {
      return Template.instance().modulesListArr.get()
    }else {
      return false;
    }
  }
});

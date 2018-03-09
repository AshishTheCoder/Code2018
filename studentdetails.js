Template.studetails.onCreated(function () {
  this.details = new ReactiveVar;
});

Template.studetails.events({
  'change #stuclass':function (event,tmpl) {
    var class1=$('#stuclass').val();;
    console.log(class1);
    var getdetails=Student.find({"class":class1}).fetch();
    console.log(getdetails);
    var fulldetail= tmpl.details.set(getdetails);
  }
});

Template.studetails.helpers({
  details: function() {
    console.log(Template.instance().details.get());
      return Template.instance().details.get();
    }
});

Template.marks.onCreated(function () {
  this.marks = new ReactiveVar;
});

Template.marks.events({
  'change .form-control':function (event,tmpl) {
    var class1=$('#stuclass').val();
    console.log(class1);
    var getdetails=Student.find({"class":class1}).fetch();
    console.log(getdetails);
    var fulldetail= tmpl.marks.set(getdetails);
  },
  "submit .form-horizontal":function () {
    var math=event.target.Math.value;
    var English=event.target.English.value;
    var Hindi=event.target.Hindi.value;
    var Science=event.target.Science.value;
    var Arts=event.target.Arts.value;
var class1=$('#stuclass').val();
var stuname=$('#stuname').val();

    console.log(class1,stuname,math,English,Hindi,Science,Arts);
    Meteor.call('uploadmark',class1,stuname,math,English,Hindi,Science,Arts);
alert('Marks uploaded');
  }
});
Template.marks.helpers({
  marks: function() {
    console.log(Template.instance().marks.get());
      return Template.instance().marks.get();
    }
});

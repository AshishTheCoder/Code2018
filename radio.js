Template.radio1.onCreated(function () {
  this.getvalue1 = new ReactiveVar;
  this.getvalue2 = new ReactiveVar;
  this.getvalue3 = new ReactiveVar([1,2]);
});
// Template.radio1.onRendered(function () {
//
// })
Template.radio1.events({
  'change #check1':function (event,instance) {
    instance.getvalue3.set([]);
  var arr=[1,2,3];
  // var arr1=[1,2];

  // instance.getvalue2.set(arr);
   if($('#check1').prop('checked')==true) {
      var check1=$('#check1').val();
     instance.getvalue1.set(check1);
       instance.getvalue3.set(arr);

   }else {

       instance.getvalue1.set();
   }

  }
});

Template.radio1.helpers({
  details: function() {
    console.log(Template.instance().getvalue1.get());
      return Template.instance().getvalue1.get();
    },
    index(){
      if(Template.instance().getvalue1.get()){
        console.log(Template.instance().getvalue3.get());
          return Template.instance().getvalue3.get();
      }
      console.log(Template.instance().getvalue3.get());
      return Template.instance().getvalue3.get();


    },
});

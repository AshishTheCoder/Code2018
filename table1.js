Template.table1.onCreated(function () {
  this.getdata1 = new ReactiveVar;
	this.getdata11=new ReactiveVar({});
  	this.getdatalength=new ReactiveVar;
});
// Template.table1.onRendered(function (event,tmpl) {
//
//
// });
Template.table1.events({
  'click #t1':function(event,tmpl) {
    Meteor.call("getdetails1",function(err,result){
        if(err){
          alert("please try again");
        }else {
      //    tmpl.getdatalength.set(result.length);
          tmpl.getdata1.set(result);
          console.log(result);
        }
      })
  },
	'change .allFirst':function (event,instance) {
      // $('.first').prop('checked', true);
      if($('.allFirst').prop('checked')!=true)
      {
        $('.first').prop('checked', false);
      }else {
        $('.first').prop('checked', true);
        var json1={
         "id":this._id,
         "math":this.math,
         "English":this.English
        }
        instance.getdata11.set(json1);
      }
  },
  'click .first':function (event,instance) {
    // if($('.first').prop('checked')==false){
    //   $('.allFirst').prop('checked', false);
    // }else {
    //     $('.allFirst').prop('checked', true);
    // }
//     $('.first').each(function(){
//   alert(this._id);
// })
var j=0;

// var length=  instance.getdatalength.get();
// console.log(length);
 // for (var i = 0; i < length; i++) {
// while ($("input[name=mygroup]").prop('checked')==true) {
//   j++;
// }
 if($(".first").prop('checked')==true){
     var json1={
      "username":this.username,
      "math":this.math,
      "English":this.English
    };
     instance.getdata11.set(json1);
//     Meteor.call("getdetails11",id,function(err,result){
//         if(err){
//           alert("please try again");
//         }else {
//           console.log(result);
//           instance.getdata11.set(result);
//         }
//       })
//
// // }
//
  }
   console.log(j);
//}

}
});

Template.table1.helpers({
  reports: function() {
    console.log(Template.instance().getdata1.get());
      return Template.instance().getdata1.get();
    },
    getdata: function() {
      console.log(Template.instance().getdata11.get());
        return Template.instance().getdata11.get();
      },
  });

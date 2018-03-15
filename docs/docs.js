Template.wordfile.onCreated(function () {
  this.state1=new ReactiveVar;
  this.username=new ReactiveVar;
});

Template.wordfile.events({
  "change #state1":function (event,instance) {
      var states = $('#state1').val();
      console.log(states);
       instance.state1.set(states);

},
"submit .form-signup":function(event,instance){
  event.preventDefault();

  var name= event.target.name.value;
  var email= event.target.email.value;
  var dob= event.target.date.value;
  var gender= event.target.gender.value;
  var state= $('#state1').val();
  var City= event.target.City.value;
  var password= event.target.password.value;
  var password2= event.target.password2.value;
 instance.username.set(name);
  if(areValidPassword(password,password2))
{

      var r = confirm("Are u sure u want to submit?");
  if (r == true) {

        Meteor.call('docsfilegeneration',name,email,dob,gender,state,City,password,password2,function(err,res) {
          if (err) {
alert("please try again!!!!!!!!!!");
}else {
       alert(res);
}

        });
   alert("you have submitted form");
  } else {
    alert("you have canceled");
  }

}
  return false;
},
});


Template.wordfile.helpers({
  returnData1(){
    if (Template.instance().state1.get()) {
      var stateName = Template.instance().state1.get();
      var data= City.find({'state':stateName}).fetch();
      console.log(data);
      console.log(stateName);
      return data;
    }else {
        return false;
      }
    },
    returnData11(){
      if (Template.instance().username.get()) {
        var tt1=Template.instance().username.get();
        var path = docsfile.find({'jsonData.name':tt1},{'jsonData.filepath':-1}).fetch();
        console.log(path);
        return path;
      }else {
          return false;
        }
      }
})

areValidPassword=function(password, confirm){
    if(password!=confirm)
    {
  alert("Password do not match.....");
      return false;
    }
    return true;
  };

//import { Template } from 'meteor/templating';
//import '~/View/Registration.html';

Template.registers.events({
  "submit .form-signup":function(event){
    event.preventDefault();

    var name= event.target.name.value;
    var email= event.target.email.value;
    var dob= event.target.date.value;
    var gender= event.target.gender.value;
    var state= event.target.state.value;
    var country= event.target.country.value;
    var password= event.target.password.value;
    var password2= event.target.password2.value;

    if(areValidPassword(password,password2))
  {
      Meteor.call('addregister',name,email,dob,gender,state,country,password,password2);
    //alert(password);
  //  console.log(password);

Router.go("/login");
  }
    return false;
  }
});

areValidPassword=function(password, confirm){
    if(password!=confirm)
    {
  alert("Password do not match.....");
      return false;
    }
    return true;
  };

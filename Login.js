Template.logins.events({
  "click #btnLogin":function(event){
   var email = $('#txtEmail').val();
    var pwd = $('#txtPassword').val();
    //var email= event.target.email.value;
    //var password= event.target.txtPassword.value;

    console.log(email);
    console.log(pwd);
      Meteor.loginWithPassword(email,pwd,function(err){
        if(err){
      alert("incorrect");
      return false;
            }
      else{
        alert("correct");
        Router.go("/dashboard");
      }
    });
      return false;
  // var regDataArr = Registration.find({email:email, password:pwd}).fetch();
  //   if(regDataArr.length > 0){
  //     Router.go('/dashboard') ;
  //   }
  }
});

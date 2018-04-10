Template.resetpassword.rendered = function(){
    if (Accounts._resetPasswordToken){
      Session.set('resetPassword', Accounts._resetPasswordToken);
    }
  }

  // Template.resetpassword.helpers({
  //   resetPassword: function(){
  //     return Session.get('resetPassword') || false;
  //   }
  // });
  Template.resetpassword.events({
    "click #btnLogin":function (event) {
    var password=$('#txtPassword').val();;
    var password1=$('#txtPassword1').val();;
    console.log(password+password1);

    if (areValidPassword(password,password1)){
    Accounts.resetPassword(Session.get('resetPassword'), password, function(err) {
           if (err) {
             console.log(err.message);
             alert('wrong input details');
             console.log(password);
           } else {
             console.log("password has been updated");
                alert("password has been updated")
            // template.find('success').innerHTML = "Your password as been updated!";
             Session.set('resetPassword', null);
              Router.go("/login");
           }
         });
return false;
       }
  }
  })

  areValidPassword=function(password, confirm){

    if(password!=confirm)
    {
      return false;
    }
    return true;
  };

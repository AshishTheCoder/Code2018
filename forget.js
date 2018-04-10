Template.forget.events({
  "click #btnforgot":function (event) {
  var email=$('#txtEmail').val();
  console.log(email);
  Accounts.forgotPassword({
    email:email
  },function(err){
        if(!err){
            alert('email has been sent for ur new password');
          console.log(email+"---------test------------");

          // Router.go("/login");
        }else{
          alert('wrong input details');

        }
  });
return false;
}
})

Template.register.events({
  "submit .signup ":function (event) {
    var name=event.target.name.value;
    var email=event.target.email.value;
    var date=event.target.date.value;
    var gender=event.target.gender.value;
    var state=event.target.state.value;
    var country=event.target.country.value;
    var password=event.target.password.value;
    var password2=event.target.password2.value;

    if (areValidPassword(password,password2)){
         Accounts.createUser({
            name:name,
            email:email,
            date:date,
            gender:gender,
            state:state,
            country:country,
            password:password,
            password2:password2
        },function(err){
            if(err){
              alert('wrong input details');
              console.log(name);
            }else {
              alert('correct! your details are registered');
              Router.go("/login");
            }
      });
// alert('true');
     }
   else {
        alert('false');
      }
      return false;
  }
});



  areValidPassword=function(password, confirm){

    if(password!=confirm)
    {
      return false;
    }
    return true;
  };

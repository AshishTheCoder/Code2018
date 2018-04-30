Template.signup.rendered = function () {
    SessionStore.set("isLoading",false);
};

Template.signup.events({
    "submit #signupform": function(e) {
        e.preventDefault();
        var emailVar = $('#useremail').val();
        var passwordVar = $('#userPassword').val();
        var confirPasswordVar = $('#confirmpassword').val();
        var mobVar = $('#usermobnumber').val();

        //get the captcha data
        var captchaData = grecaptcha.getResponse();
        if (emailVar == "" || passwordVar == "" || confirPasswordVar == "" || mobVar == "") {
            swal("Oops...", "Please Fill All The Fields!", "error");
        } else {
            if (passwordVar === confirPasswordVar) {
              if (mobVar.match(/^[0-9]*\.?[0-9]*$/)) {} else {
                  swal("Not a valid mobile number!");
                  throw new Error("Not a valid Mobile Number!");
              }
              if(mobVar.length != 10){
                swal('Mobile number must be in ten digits!');
                throw new Error('Mobile number must be in ten digits!');
              }
              if(captchaData != ""){
                Meteor.call("userSignupData", emailVar, passwordVar, mobVar, captchaData, function(error, result) {
                    if (error) {
                      swal("Oops...", "User already exist!", "error");
                    } else {
                        if (result.status) {
                            Meteor.call("emailVerify", emailVar, function() {});
                            $("#useremail").val('');
                            $("#userPassword").val('');
                            $("#confirmpassword").val('');
                            $("#usermobnumber").val('');
                            swal("You have signed up successfully!", "Please check your email and verify to login.", "success");
                            Router.go("/login");
                        } else {
                            // Meteor.call("emailVerify", emailVar, function() {});
                            var passwordInfo = "Please ensure that :"+
                            "The length of the password is greater than or equal to 6 characters, it has"+
                            " at least 1 upper case character, 1 lower case character and 1 numeric character";
                            swal("Your password is not secure",passwordInfo, "warning");
                            // swal(result.message);
                        }
                    }
                });
              }else{
                swal("Please select captcha!");
              }
            } else {
                swal('Password does not match');
            }
        }
    }
});

Template.signup.helpers({});

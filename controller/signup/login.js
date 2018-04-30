Template.login.rendered = function () {
    SessionStore.set("isLoading",false);
    Meteor.logout(function () {
      // console.log("userlogout");
    });
};

Template.login.events({
    "click #signInBtnData": function () {
        var email = $("#useremail").val();
        var password = $("#userPassword").val();
        if (email == "" || password == "") {
            // swal('Please Fill All The Fields!');
            swal("Oops...", "Please Fill All The Fields!", "error");
            return 0;
        } else {
            Meteor.loginWithPassword(email, password, function (err) {
                if (err) {
                    swal("Oops...", "Incorrect Userid Or Password!", "error");
                } else {
                    if (Meteor.user().emails[0].verified == false) {
                        SessionStore.set("login_user", false);
                        Meteor.call("emailVerify", email, function () {});
                        swal("Please verify your email to login!");
                        return 0;
                        console.log(Meteor.user().profile.role);
                    } else if (Meteor.user().profile.role == "User") {
                        if (Meteor.user().profile.user_type == "spd") {
                          SessionStore.set("login_user", true);
                          if(Meteor.user().profile.status == 'approved'){
                            Meteor.call("userLogedInDetails",password, function () {});
                            Router.go("/schedule-submission");
                          }else{
                            Meteor.call("userLogedInDetails",password, function () {});
                            Router.go("/registration-form");
                          }
                        }else if (Meteor.user().profile.user_type == "commercial") {
                          SessionStore.set("login_user", true);
                          Meteor.call("userLogedInDetails",password, function () {});
                          Router.go("/admin-home");
                        }else if (Meteor.user().profile.user_type == "finance") {
                          SessionStore.set("login_user", true);
                          Meteor.call("userLogedInDetails",password, function () {});
                          Router.go("/payment-note-approval");
                        }else if (Meteor.user().profile.user_type == "master") {
                          SessionStore.set("login_user", true);
                          Meteor.call("userLogedInDetails",password, function () {});
                          Router.go("/admin-home");
                        }else{
                            SessionStore.set("login_user", true);
                            Meteor.call("userLogedInDetails",password, function () {});
                            Router.go("/admin-home");
                        }
                    } else if (Meteor.user().profile.role == "Applicant") {
                      if(Meteor.user().profile.user_type == 'applicant1'){
                        SessionStore.set("login_user", true);
                        Router.go("/ApplicationData");
                      }else{
                        SessionStore.set("login_user", true);
                        Router.go("/PaymentAdviceFront");
                      }
                    }
                }
            });
        }
    },
    'keypress input.newLink': function (evt, template) {
    if (evt.which === 13) {
     var email = $("#useremail").val();
     var password = $("#userPassword").val();
     if (email == "" || password == "") {
         swal("Oops...", "Please Fill All The Fields!", "error");
         return 0;
     } else {
         Meteor.loginWithPassword(email, password, function (err) {
             if (err) {
               swal("Oops...", "Incorrect Userid Or Password!", "error");
             } else {
                 if (Meteor.user().emails[0].verified == false) {
                     SessionStore.set("login_user", false);
                     Meteor.call("emailVerify", email, function () {});
                     swal("Please verify your email to login!");
                     return 0;
                 } else if (Meteor.user().profile.role == "User") {
                     if (Meteor.user().profile.user_type == "spd") {
                       SessionStore.set("login_user", true);
                       if(Meteor.user().profile.status == 'approved'){
                         Meteor.call("userLogedInDetails",password, function () {});
                         Router.go("/schedule-submission");
                       }else{
                         Meteor.call("userLogedInDetails",password, function () {});
                         Router.go("/registration-form");
                       }
                     }else if (Meteor.user().profile.user_type == "commercial") {
                       SessionStore.set("login_user", true);
                       Meteor.call("userLogedInDetails",password, function () {});
                       Router.go("/admin-home");
                     }else if (Meteor.user().profile.user_type == "finance") {
                       SessionStore.set("login_user", true);
                       Meteor.call("userLogedInDetails",password, function () {});
                       Router.go("/payment-note-approval");
                     }else if (Meteor.user().profile.user_type == "master") {
                       SessionStore.set("login_user", true);
                       Meteor.call("userLogedInDetails",password, function () {});
                       Router.go("/admin-home");
                     }else{
                         SessionStore.set("login_user", true);
                         Meteor.call("userLogedInDetails",password, function () {});
                         Router.go("/admin-home");
                     }
                 } else if (Meteor.user().profile.role == "Applicant") {
                   if(Meteor.user().profile.user_type == 'applicant1'){
                     SessionStore.set("login_user", true);
                     Router.go("/ApplicationData");
                   }else{
                     SessionStore.set("login_user", true);
                     Router.go("/PaymentAdviceFront");
                   }
                 }
             }
         });
     }
   }
 }
});
Template.login.helpers({
    "tokenLogin": function (token) {
        if (token != null) {
            Accounts.verifyEmail(token, function (err) {
                if (err != null) {
                    if (err.message = 'Verify email link expired [403]') {
                        swal("Oops...", "Token Expired Please try again!", "error");
                    }
                } else {
                    swal("Good job!", "Email Successfully Verified!", "success");
                }
            });
        }
    }
});

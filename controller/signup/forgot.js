Template.forgot.rendered = function () {
    SessionStore.set("isLoading",false);
};

Template.forgot.events({
    "click #forgotBtnData": function() {
        var email = $("#useremail").val();
        if (email == "") {
            swal("Oops...", "Please Enter Your Email ID !", "error");
            return 0;
        } else {
            Meteor.call("forgotPasswordMail", email, function(err, res) {
                if (err) {
                    $("#useremail").val('');
                    swal("Oops...", "This email does not exist!");
                } else {
                    $("#useremail").val('');
                    swal("Email Successfully Sent!", 'Check Your Mailbox.', "success");
                }
            });
        }
    }
});
Template.forgot.helpers({
    "tokenLogin": function(token) {
        if (token != null) {
            Accounts.verifyEmail(token, function(err) {
                if (err != null) {
                    if (err.message = 'Verify email link expired [403]') {
                        swal("Oops...", "Token Expired Please try again!", "error");
                    }
                } else {
                    swal("Password Reset Successfully!", 'Email Successfully Verified.', "success");
                }
            });
        }
    }
});




// Accounts.onResetPasswordLink((token, done) => {
//     // Display the password reset UI, get the new password...
//     swal({
//             title: "New Password",
//             text: "Enter new password:",
//             type: "input",
//             inputType: "password",
//             // showCancelButton: true,
//             closeOnConfirm: false,
//             animation: "slide-from-top",
//             inputPlaceholder: "Enter password"
//         },
//         function(inputValue) {
//
//             if (inputValue === false) return false;
//
//             if (inputValue === "") {
//                 swal.showInputError("You need to enter password!");
//                 return false
//             }
//             swal("Nice!", "Passowrd reset success", "success");
//         });
//     console.log(inputValue);
//     Accounts.resetPassword(token, inputValue, (err) => {
//         if (err) {
//             // Display error
//         } else {
//             // Resume normal operation
//             done();
//         }
//     });
// });

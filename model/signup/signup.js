Meteor.methods({
    "userSignupData": function(email, password, mobile, captchaData) {
        var data = scorePassword(password);
        var length = passwordLength(password);
        if (data > 45 && length >= 6) {
            var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaData);
            if (!verifyCaptchaResponse.success) {
                console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
                throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
            } else
                console.log('reCAPTCHA verification passed!');
            var user = {
                username: email,
                password: password,
                email: email,
                mobile: mobile,
                profile: {
                    role: "User",
                    status: 'pending',
                    user_type: "spd"
                }
            };
            Accounts.createUser(user);
            // data insert in log Details collection
            var currentDate = new Date();
            var todayDate = moment(currentDate).format('DD-MM-YYYY');
            var ip= this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            LogDetails.insert({
                ip_address:ipArr,
                log_type: 'User Sign Up',
                template_name: 'signup',
                event_name: 'signupform',
                timestamp: new Date(),
                action_date:todayDate,
                user_json:user
            });
            return returnSuccess('Successfully Submited', true);
        } else {
            return returnFaliure("Password strength id poor!");
        }
    },
    "emailVerify": function(email) {
        var userId = Meteor.users.find({
            username: email
        }).fetch();
        if (userId.length > 0) {
            var mail = sendVerificationEmail(userId[0]._id);
        }
    },
    "forgotPasswordMail": function(email) {
        var userId = Meteor.users.findOne({
            username: email
        })._id;
        var mail = sendResetPasswordEmail(userId, email);
    },
    "sendVerificationEmail": function(sendToEmailAddress, subject, message) {
        var fromEmailAddress = "controlroom@secipowertrading.com";
        var result = Mandrill.messages.sendTemplate({
            template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
            template_content: [{
                name: 'body',
                content: 'content'
            }],
            message: {
                subject: subject,
                from_email: fromEmailAddress,
                to: [{
                    email: sendToEmailAddress
                }],
                html: message,
            }
        });
        return returnSuccess(result.data[0].status);
    },
    "userLogedInDetails": function(password){
      // data insert in log Details collection
      var currentDate = new Date();
      var todayDate = moment(currentDate).format('DD-MM-YYYY');
      var ip= this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      if(Meteor.userId()){
        LogDetails.insert({
            ip_address:ipArr,
            user_id:Meteor.userId(),
            user_name: Meteor.user().username,
            user_password:password,
            user_type:Meteor.user().profile.user_type,
            user_status:Meteor.user().profile.status,
            log_type: 'User Login',
            login_status: 'login success',
            timestamp: new Date(),
            action_date:todayDate
        });
      }
    }
});


function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;
    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }
    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
    }
    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
}

function passwordLength(pass) {
    var score = 0;
    if (!pass)
        return score;
    var letters = new Object();
    for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }
    return pass.length;
}

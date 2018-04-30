var Random = Package.random.Random;
var _ = Package.underscore._;
sendVerificationEmail = function (userId, address) {                                                          // 740                                                //
  var user = Meteor.users.findOne(userId);
  // console.log(user);
  if (!user) throw new Error("Can't find user");                                                                       // 747
  if (!address) {                                                                                                      // 750
    var email = _.find(user.emails || [], function (e) {                                                               // 751
      return !e.verified;                                                                                              // 752
    });                                                                                                                // 752
    address = (email || {}).address;                                                                                   // 753
    // console.log(address);                                                                                                           //
    if (!address) {                                                                                                    // 755
      throw new Error("That user has no unverified email addresses.");                                                 // 756
    }                                                                                                                  // 757
  }                                                                                                                    // 758
  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address)) throw new Error("No such email address for user.");
  var tokenRecord = {                                                                                                  // 764
    token: Random.secret(),                                                                                            // 765
    address: address,                                                                                                  // 766
    when: new Date() };                                                                                                // 767
  Meteor.users.update({ _id: userId }, { $push: { 'services.email.verificationTokens': tokenRecord } });               // 768                                                                                                                 //
  Meteor._ensure(user, 'services', 'email');                                                                           // 773
  if (!user.services.email.verificationTokens) {                                                                       // 774
    user.services.email.verificationTokens = [];                                                                       // 775
  }                                                                                                                    // 776
  user.services.email.verificationTokens.push(tokenRecord);                                                            // 777
  var verifyEmailUrl = Accounts.urls.verifyEmail(tokenRecord.token);                                                   // 779                                                                                                                    //
         var res = verifyEmailUrl.replace("localhost:80", "secipowertrading.com");
          var subject="SECI Email Verification Mail";
           var message="Dear Sir/Ma'am,<br><br>Please click this link to verify your email <br>" +res +"<br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
      Meteor.call("sendVerificationEmail",address,subject,message )   ;                                                                                                              //
};
sendResetPasswordEmail = function (userId, email) {                                                           // 529
  // Make sure the user exists, and email is one of their addresses.                                                   //
  var user = Meteor.users.findOne(userId);                                                                             // 531
  if (!user) throw new Error("Can't find user");                                                                       // 532
  // pick the first email if we weren't passed an email.                                                               //
  if (!email && user.emails && user.emails[0]) email = user.emails[0].address;                                         // 535
  // make sure we have a valid email                                                                                   //
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email)) throw new Error("No such email for user.");
                                                                                                                       //
  var token = Random.secret();                                                                                         // 541
  var when = new Date();                                                                                               // 542
  var tokenRecord = {                                                                                                  // 543
    token: token,                                                                                                      // 544
    email: email,                                                                                                      // 545
    when: when                                                                                                         // 546
  };                                                                                                                   // 543
  Meteor.users.update(userId, { $set: {                                                                                // 548
      "services.password.reset": tokenRecord                                                                           // 549
    } });                                                                                                              // 548
  // before passing to template, update user object with new token                                                     //
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;                                                    // 552
                                                                                                                       //
  var resetPasswordUrl = Accounts.urls.resetPassword(token);                                                           // 554
         var res = resetPasswordUrl.replace("localhost:80", "secipowertrading.com");
    var subject="SECI Password Reset";
           var message="Dear Sir/Ma'am,<br><br>Please click this link to change your password <br>" +res +"<br><br>With best regards,<br><br><b>Solar Energy Corporation of India Ltd.</b><br>D-3, 1st floor, Wing-A, Religare Building, District Center, Saket, New Delhi-17<br>Tel.: 011-71989285/86, Fax No.: 011-71989287<br>Email: seci.scheduling@gmail.com";
      Meteor.call("sendVerificationEmail",email,subject,message )   ;                                                                                                               //
                                                                                                 // 577
};

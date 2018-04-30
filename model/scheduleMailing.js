// Meteor.methods({
//     sendMandrillEmailForPaymentNote: function(sendToEmailAddress, subject, message) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: [
//                    {email: sendToEmailAddress,type:'to'}
//                  ],
//                 html: message,
//             }
//         });
//         return returnSuccess(result.data[0].status);
//     },
//     sendReminderMailUsingMandrillEmail: function(sendToArr, subject, message) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: sendToArr,
//                 html: message,
//             }
//         });
//         return returnSuccess(result.data[0].status);
//     },
//     sendMandrillEmail: function(sendToEmailAddress, subject, message) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: [
//                   {email: sendToEmailAddress,type:'to'},
//                   {email: 'seci.scheduling@gmail.com',type:'cc'},
//                   {email: 'neeraj@cybuzzsc.com',type:'cc'}
//
//                  ],
//                 html: message,
//             }
//         });
//         return returnSuccess(result.data[0].status);
//     },
//     sendMandrillEmailAttachment: function(sendToEmailAddress, subject, message, attachmentUrl, fileName) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         console.log('sendToMailId ' + sendToEmailAddress);
//         console.log('urlvalue: ' + attachmentUrl);
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: [
//                   {email: sendToEmailAddress,type: 'to'},
//                   {email: 'neeraj@cybuzzsc.com',type: 'cc'},
//                   {email: 'controlroom@ptcindia.com',type: 'cc'}
//
//                ],
//                 html: message,
//                 attachments: [{
//                     "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                     "name": fileName,
//                     "content": base64_encode(attachmentUrl)
//                 }],
//             }
//         });
//         return returnSuccess(result.data[0].status);
//     }
// });
//
// var fs = require('fs');
// base64_encode = function(file) {
//     var bitmap = fs.readFileSync(file);
//     return new Buffer(bitmap).toString('base64');
// }


// Meteor.methods({
//     sendMandrillEmailForPaymentNote: function(sendToEmailAddress, subject, message) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: [
//                    {email: sendToEmailAddress,type:'to'}
//                  ],
//                 html: message,
//             }
//         });
//         console.log('Process Start------------------------------------------20');
//         Email.send({
//          to: ["neeraj@cybuzzsc.com"],
//          // cc: ["abc@gmail.com","xyz@gmail.com"],
//          from: "controlroom@secipowertrading.com",
//          subject: '[Testing Mail Using SMTP] '+subject,
//          html: message
//         });
//         console.log('Process end--------------------------------------------28');
//         return returnSuccess(result.data[0].status);
//     },
//     sendReminderMailUsingMandrillEmail: function(sendToArr, subject, message) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: sendToArr,
//                 html: message,
//             }
//         });
//         console.log('Process Start------------------------------------------47');
//         Email.send({
//          to: ["neeraj@cybuzzsc.com"],
//          // cc: ["abc@gmail.com","xyz@gmail.com"],
//          from: "controlroom@secipowertrading.com",
//          subject: '[Testing Mail Using SMTP] '+subject,
//          html: message
//         });
//         console.log('Process end--------------------------------------------55');
//         return returnSuccess(result.data[0].status);
//     },
//     sendMandrillEmail: function(sendToEmailAddress, subject, message) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: [
//                   {email: sendToEmailAddress,type:'to'},
//                   {email: 'seci.scheduling@gmail.com',type:'cc'},
//                   {email: 'neeraj@cybuzzsc.com',type:'cc'}
//
//                  ],
//                 html: message,
//             }
//         });
//         console.log('Process Start------------------------------------------79');
//         // console.log(process.env.MAIL_URL);
//         Email.send({
//          to: ["neeraj@cybuzzsc.com"],
//          // cc: ["abc@gmail.com","xyz@gmail.com"],
//          from: "controlroom@secipowertrading.com",
//          subject: '[Testing Mail Using SMTP] '+subject,
//          html: message
//         });
//         console.log('Process end--------------------------------------------88');
//         return returnSuccess(result.data[0].status);
//     },
//     sendMandrillEmailAttachment: function(sendToEmailAddress, subject, message, attachmentUrl, fileName) {
//         var fromEmailAddress = "controlroom@secipowertrading.com";
//         console.log("sending email...");
//         console.log('sendToMailId ' + sendToEmailAddress);
//         console.log('urlvalue: ' + attachmentUrl);
//         var result = Mandrill.messages.sendTemplate({
//             template_name: 'email-template', // open your mandrill account and goto outbound > templates and create a template named email-template and publish
//             template_content: [{
//                 name: 'body',
//                 content: 'content'
//             }],
//             message: {
//                 subject: subject,
//                 from_email: fromEmailAddress,
//                 to: [
//                   {email: sendToEmailAddress,type: 'to'},
//                   {email: 'neeraj@cybuzzsc.com',type: 'cc'},
//                   {email: 'controlroom@ptcindia.com',type: 'cc'}
//                ],
//                 html: message,
//                 attachments: [{
//                     "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                     "name": fileName,
//                     "content": base64_encode(attachmentUrl)
//                 }],
//             }
//         });
//         console.log('Process Start------------------------------------------119');
//         // console.log(process.env.MAIL_URL);
//         Email.send({
//          to: ["neeraj@cybuzzsc.com"],
//          // cc: ["abc@gmail.com","xyz@gmail.com"],
//          from: "controlroom@secipowertrading.com",
//          subject: '[Testing Mail Using SMTP] '+subject,
//          html: message,
//          attachments:[{fileName:fileName,filePath:attachmentUrl,contentType:'xlsx'}]
//         });
//         console.log('Process end-------------------------------------------129');
//         return returnSuccess(result.data[0].status);
//     },
// });

Meteor.methods({
    sendMandrillEmailForPaymentNote: function(sendToEmailAddress, subject, message) {
        console.log('Process Start------------------------------------------11111');
        Email.send({
         to: [sendToEmailAddress],
         // cc: ["abc@gmail.com","xyz@gmail.com"],
         from: "controlroom@secipowertrading.com",
         subject: '[Testing Mail Using SMTP] '+subject,
         html: message
        });
        console.log('Process end--------------------------------------------11111');
        return returnSuccess('result');
    },

    sendReminderMailUsingMandrillEmail: function(sendToArr, subject, message, sendToArrBySMTP, sendCCArrBySMTP) {
        console.log('Process Start------------------------------------------22222');
        console.log(process.env.MAIL_URL);
        Email.send({
         to: sendToArrBySMTP,
         cc: sendCCArrBySMTP,
         from: "controlroom@secipowertrading.com",
         subject: subject,
         html: message
        });
        console.log('Process end--------------------------------------------22222');
        return returnSuccess('result');
    },

    sendMandrillEmail: function(sendToEmailAddress, subject, message) {
        console.log('Process Start------------------------------------------33333');
        console.log(process.env.MAIL_URL);
        Email.send({
         to: [sendToEmailAddress],
         cc: ["seci.scheduling@gmail.com","neeraj@cybuzzsc.com"],
         from: "controlroom@secipowertrading.com",
         subject: subject,
         html: message
        });
        console.log('Process end--------------------------------------------33333');
        return returnSuccess('result');
    },
    sendMandrillEmailAttachment: function(sendToEmailAddress, subject, message, attachmentUrl, fileName) {
        console.log('Process Start------------------------------------------44444');
        console.log(process.env.MAIL_URL);
        Email.send({
         to: [sendToEmailAddress],
         cc: ["controlroom@ptcindia.com","neeraj@cybuzzsc.com"],
         from: "controlroom@secipowertrading.com",
         subject: subject,
         html: message,
         attachments:[{fileName:fileName,filePath:attachmentUrl,contentType:'xlsx'}]
        });
        console.log('Process end-------------------------------------------44444');
        return returnSuccess('result');
    },
});

var fs = require('fs');
base64_encode = function(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

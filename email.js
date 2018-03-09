Template.email.events({
  "click #emails": function (event) {
    var to = $('#to').val();;
    var sub = $('#sub').val();;
    var msg = $('#msg').val();;
  Meteor.call('sendingEmailByAshish',to,sub,msg,function(err,result) {
    if(err)
    {console.log("Please try again!!!");}
    else {
      console.log(result);
    }
  })
}
})

Template.continent.events({
  "submit .continent":function (event) {
    var continent=event.target.continent.value;
    if(continent)
    {
 Meteor.call('addcontinent',continent);
console.log(continent);
   alert("continent is added");
 }//Router.go('/country');
  else {
  alert("something went wrong!!!!!......")
}
 return false;

  }
})

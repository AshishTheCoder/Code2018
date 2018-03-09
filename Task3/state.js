Template.state.events({
  "submit .state":function (event) {
    var state=event.target.state.value;
    var country=event.target.country.value;
    var continent=event.target.continent.value;
    if(country)
    {
 Meteor.call('addstate',continent,country,state);
console.log(country+continent+state);
   alert("country is added");
 }//Router.go('/country');
  else {
  alert("something went wrong!!!!!......")
}
 return false;
  }
})

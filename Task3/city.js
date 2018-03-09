Template.city.events({
  "submit .city":function (event) {
    var city=event.target.city.value;
    var state=event.target.state.value;
    var country=event.target.country.value;
    var continent=event.target.continent.value;
    if(country)
    {
 Meteor.call('addcity',continent,country,state,city);
console.log(country+continent+state+city);
   alert("country is added");
 }//Router.go('/country');
  else {
  alert("something went wrong!!!!!......")
}
 return false;
  }
})

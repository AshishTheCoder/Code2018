Template.country.events({
  "submit .country":function (event) {
    var country=event.target.country.value;
    var continent=event.target.continent.value;
    if(country)
    {
 Meteor.call('addcountry',continent,country);
console.log(country+continent);
   alert("country is added");
 }//Router.go('/country');
  else {
  alert("something went wrong!!!!!......")
}
 return false;

}
});

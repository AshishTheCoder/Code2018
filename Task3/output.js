Template.output.rendered =function(){
 SessionStore.set('output');
};
Template.output.events({
  "onchange #continent":function (event) {
    var continent=event.target.continent.value;
    if(continent)
    {
     var getdata=City.find({});
console.log(getdata);
SessionStore.set('output',getdata);
   alert("output is find");
 }//Router.go('/country');
  else {
  alert("something went wrong!!!!!......")
}
 return false;

  }
});

Template.output.helpers({
  getdata(){
	if (SessionStore.get('output')) {
		return SessionStore.get('output');
	}else{
		return false;
	}
	}
})

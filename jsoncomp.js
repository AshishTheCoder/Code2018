Template.jsoncomp.onCreated(function(){
  // this.getvalue3 = new ReactiveVar([]);
//   // this.getvalue2 = new ReactiveVar;
//   // this.getvalue3 = new ReactiveVar([1,2]);
});
Template.jsoncomp.events({
  'click  #tt':function (event,instance) {
    // var json11={"arr":["abc",18,"delhi"]};
// var arr=["abc",18,"delhi"];
//      instance.getvalue3.set(arr);
 }
});

Template.jsoncomp.helpers({
  jsoncomparison1:function() {
    var json1={
    "name":"abc",
    "age":18,
   "city":"delhi"
   //"xyz":[]
  }
  console.log("==========================================");
  console.log(json1);
  return json1;
  },
jsoncomparison:function() {

//   var i=0;
  var j=0;
    var json1={
    "name":"abc",
    "age":18,
   "city":"delhi"
   //"xyz":[]
 };
 var json2={
   "name":"deep",
   "age":25,
  "city":"delhi"
};
//  // var res={"arr":[]};
 // var res={"arr1":[{}]};
 //var arr1=[];
var res1={};
for (x in json1) {
//  j++;
console.log("------------"+x+"----------");
console.log(json1[x]+"============"+json2[x]);
    if(json2[x]==json1[x]){
      console.log(json1[x]+"============"+json2[x]);
      // res1[x]=json1[x];
//  i++;
  }else {
      // res.arr1[j][x]=json2[x];
      res1[x]=json2[x];
      console.log("j================"+j);

    }
  }
  console.log("==========================================");
  console.log(res1);
//res.j=j;
// if(i>0){
//   console.log("compared"+i);
//   return i;
// }
//if(j>0) {
// var dd=JSON.stringify(res1)+"<h1>"+JSON.stringify(res)+"</h1>";
//    console.log("not compared json"+JSON.stringify(res));
//       return  dd;
//}
// console.log(json1.name+"==========="+json1.age+"============"+json1.city);
return res1;
}

})

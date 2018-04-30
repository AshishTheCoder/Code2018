Template.json1.helpers({
  "getarrjson":function() {
    //var j;
    var arr1=["abc","xyz","pqr"];
    var arr2=["bca","12","btech"];
    var arrjson=[];
    console.log("-------------------------");
for (var i = 0; i < arr1.length; i++){
  console.log("--------------"+i+"-----------");
//   for (j in arrjson){
//   arrjson[j].name=arr1[i];
//   arrjson[j].class=arr2[i];
// }
var obj={};
obj[arr1[i]]=arr2[i]
arrjson.push(obj);
// console.log(arrjson[i].name+"================="+arrjson[i].class);
}
console.log(JSON.stringify(arrjson));
 // return JSON.stringify(arrjson);
return arrjson;
  }
})

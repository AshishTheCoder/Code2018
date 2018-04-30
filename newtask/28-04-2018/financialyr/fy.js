Template.fy.helpers({
  "getfy":function(){
  var preyr=2015;
  var fy=[];

  // var j="";
  var yr=moment().format('YYYY');
// var yr1=yr-1;
// console.log("====================");
// console.log(yr1);
 var month=moment().format('MM');
// var month=03
 console.log("====================");
 console.log(month);

  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
 var month1=monthNames[month-1];
 console.log("====================");
 console.log(month1);
for (var i = preyr; i <=yr; i++) {
  if (month1=="January"||month1=="February"||month1=="March"){
    if (i==yr) {
      break;
    }
  }
  key=i+"-"+(i+1);
  value=(i-1)+"-"+i;

  // console.log("================"+j+"==============");
  var obj={};
  // obj[key]=value;
obj.key=key;
obj.value=value;
  fy.push(obj);
}
  // console.log(yr+month1);
  console.log("==============================================");
  console.log(fy);
  return fy;
  }
})

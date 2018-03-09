Template.viewtickets.onCreated(function () {
    this.spd = new ReactiveVar;
    this.tnumber = new ReactiveVar;
    this.tcount = new ReactiveVar;
    this.tyear=new ReactiveVar;
    this.tmonth=new ReactiveVar;
});


Template.viewtickets.events({
"change #yrs":function (event,templ1) {
  templ1.tmonth.set("");
  templ1.tcount.set("");
  templ1.tnumber.set("");
  templ1.spd.set("");

  $('#counttt').val("");
var mn=$('select option:contains("Select SPD")').prop('selected',true);
var mn=$('select option:contains("Select Month")').prop('selected',true);
  $('#ticket').val("");
 var yr=$('#yrs').val();
 console.log(yr);
  var getyr=Tickets.find({'ticketjson.year':yr}).fetch();
 var tyr=templ1.tyear.set(getyr);
 console.log(getyr.length);
},
"change #month":function (event,templ1) {
    templ1.tyear.set("");
    templ1.spd.set("");
    templ1.tcount.set("");
    templ1.tnumber.set("");
    $('#counttt').val("");
    $('select option:contains("Select SPD")').prop('selected',true);
  $('select option:contains("Select Year")').prop('selected',true);
    $('#ticket').val("");
 var mnth=$('#month').val();
 console.log(mnth);
 var months = [
    'January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September',
    'October', 'November', 'December'
    ];
var month1 = months.indexOf(mnth)+1;
if(month1<10)
{
  month1="0"+month1;
}
console.log(month1);
  var getmnth=Tickets.find({'ticketjson.month':month1}).fetch();
 var tmnth=templ1.tmonth.set(getmnth);
 console.log(getmnth.length);
},
"change #spdstate":function (event, template) {
  template.tyear.set("");
  template.tmonth.set("");
  template.tnumber.set("");
  template.tcount.set("");
  $('#counttt').val("");
  $('select option:contains("Select Month")').prop('selected',true);
$('select option:contains("Select Year")').prop('selected',true);
  $('#ticket').val("");
var ttnumber=$('#ticket').val();
var getspd=$('#spdstate').val();
var ttdata1=Tickets.find({'ticketjson.spdstate':getspd}).fetch();
 console.log(ttdata1+ttdata1.length);
console.log(getspd);
var ttr=template.spd.set(ttdata1);

},
"input #ticket":function (event, template) {
  template.tyear.set("");
  template.tmonth.set("");
  template.tcount.set("");
  template.spd.set("");
  $('#counttt').val("");
  $('select option:contains("Select Month")').prop('selected',true);
$('select option:contains("Select Year")').prop('selected',true);
  $('select option:contains("Select SPD")').prop('selected',true);
var ttnumber=$('#ticket').val();
// $('#projectid').val();
console.log(ttnumber);
var ttr=Tickets.find({'ticketjson.ticketnumber':{$regex:ttnumber}}).fetch();
console.log(ttr.length);
var tt1=template.tnumber.set(ttr);

},
"keyup #counttt":function (event, instance) {
  instance.tyear.set("");
  instance.tmonth.set("");
    instance.tnumber.set("");
    instance.spd.set("");
    $('#ticket').val("");
    $('select option:contains("Select Month")').prop('selected',true);
  $('select option:contains("Select Year")').prop('selected',true);
  $('select option:contains("Select SPD")').prop('selected',true);
var limit =$('#counttt').val();
console.log(limit);
  Meteor.call('getLatestInsertedData',limit, function(error, result) {
    if (error) {
      alert('Please try again!');
    }else {
      console.log(result);
      instance.tcount.set(result);
    }
  })
// var ttdata1 = Tickets.find({}, {
//               sort: {
//                   $natural: -1
//               },
//               limit: Number(limit)
//           }).fetch();

// var ttdata1=Tickets.find({},{sort:{$natural: -1},limit:Number(tttnumber)}).fetch();

}
});




Template.viewtickets.helpers({
  "getspd":function () {
    var spddata=SPD.find({}).fetch();
    console.log(spddata);
    return spddata;
  },

"gettickets":function () {
  var tt=Tickets.find({}).fetch();
  console.log(tt.length);
  return tt;
},
"getttdata":function () {
  var tt1=Template.instance().tnumber.get();
   console.log(tt1);
  return tt1;
},
"getttcount":function () {
  var ttc=Template.instance().tcount.get();
  console.log(ttc);
 return ttc;
},
"getttspd":function () {
  var ttspd=Template.instance().spd.get();
  console.log(ttspd);

  return ttspd;
},
// "gettdate":function () {
//
//  var tt=Tickets.find({ "ticketjson.raisedDate": 1}).fetch();
// console.log(tt);
//  var tyrs = new Date(tt);
//  var tyears=tyrs.getFullYear();
//  console.log(tyears);
//  var tyr1=Template.instance().tyear.get();
//  var tdata=Tickets.find({"ticketjson.raisedDate":tyears}).fetch();
// console.log(tdata);
//
//  return tdata;
// },







  "getMonth":function () {
    var month =  Template.instance().tmonth.get();
         console.log(month);

    return month;
  },

  "getYear":function () {
    var year = Template.instance().tyear.get();
    console.log(year);
    return year;
  }

})

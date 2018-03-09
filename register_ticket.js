Template.tickets.events({
	"submit .form-horizontal": function () {
		var spdstate = event.target.spdstate.value;
		var ticketnumber = event.target.ticketnumber.value;

		var status = event.target.status.value;
		var issue = event.target.issue.value;
		var raisedDate = event.target.raisedDate.value;

		var monthVar = moment().format('MM');
		var yearVar = moment().format('YYYY');
		console.log(monthVar);
		console.log(yearVar);


		if (isNotEmpty(spdstate) && isNotEmpty(issue) && isNotEmpty(ticketnumber) && isNotEmpty(raisedDate) && isNotEmpty(status)) {
			var ticketjson = {
				spdstate: spdstate,
				ticketnumber: ticketnumber,
				issue: issue,
				raisedDate: raisedDate,
				month: monthVar,
				year: yearVar,
				status: status,
			}
			console.log(ticketjson);
			Meteor.call('addtickets', ticketjson)
			alert("ticktes are raised");
		} else {
			return false;
		}

		event.target.spdstate.value = "Select SPD";
		event.target.ticketnumber.value = "";
		event.target.issue.value = "";
		// event.target.raisedDate.value="";
		event.target.status.value = "Pending";
		event.preventDefault();


	}
});

Template.tickets.helpers({
	"getspd": function () {
		var spddata = SPD.find({}).fetch();
		console.log(spddata);
		return spddata;
	},
	"getcurrentdate": function () {
		var currentdate = new Date();
		var month = currentdate.getMonth() + 1;
		var year = currentdate.getFullYear();
		var date = currentdate.getDate();
		var getdate = date + "/" + month + "/" + year;
		var datetime = {
			date: date,
			month: month,
			year: year,
			getdate: getdate
		};
		console.log(datetime);
		return getdate;
	}
})


var isNotEmpty = function (value) {
	if (value && value !== '') {
		return true;
	}
	alert("All fields are required");
	return false;
};

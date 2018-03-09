Template.report.onCreated(function () {
  this.reports = new ReactiveVar;
	this.getmarks=new ReactiveVar;
});
Template.report.events({
	'change .form-control':function (event,tmpl) {
    var class1=$('#stuclass').val();
    console.log(class1);
    var getdetails=Student.find({"class":class1}).fetch();
    console.log(getdetails);
    var fulldetail= tmpl.reports.set(getdetails);
  },
	'change #stuname':function (event,templ) {
  var class1=$('#stuclass').val();
		var name=$('#stuname').val();
    console.log(name+class1);
    var getdetail=Marks.find({"class":class1,"username":name}).fetch();
    console.log(getdetail);
    var fulldetail= templ.getmarks.set(getdetail);
  },
	'click #myButton': function() {
		var class1=$('#stuclass').val();
			var name=$('#stuname').val();
		// var generate = Customers.find().map(function(i){
		// 	return i.name;
	//	});

		// Define the pdf-document
	// 	var docDefinition = {
	// 		content: [
  //
  //
	// 			table: {
  //       // headers are automatically repeated if the table spans over multiple pages
  //       // you can declare how many rows should be treated as headers
  //       headerRows: 1,
  //       widths: [ '*', 'auto', 100, '*' ],
  //
  //       body: [
  //         [ 'Class', 'Name',  'Marks' ],
  //         [ 'class1', 'name', 'Value 3', 'Value 4' ],
  //         [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
  //       ]
  //     }
	// 		]
	// 	};
  //
	// 	// Start the pdf-generation process
	// 	pdfMake.createPdf(docDefinition).open();
	}
});
Template.report.helpers({
  reports: function() {
    console.log(Template.instance().reports.get());
      return Template.instance().reports.get();

    },
		getmarks:function () {
			console.log(Template.instance().getmarks.get());
	      return Template.instance().getmarks.get();
		}
	});

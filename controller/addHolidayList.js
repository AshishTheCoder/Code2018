import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.addHolidaysList.onCreated(function xyz() {
    this.ddlTypeSelectedVar = new ReactiveVar();
    this.docId = new ReactiveVar();
});

Template.addHolidaysList.rendered = function(){};

Template.addHolidaysList.events({
  "focus .txtDateClass": function() {
      // $('.txtDateClass').datepicker({format: 'dd-mm-yyyy', startDate: '0d', endDate: '+30d', autoclose: true});
      $('.txtDateClass').datepicker({format: 'dd-mm-yyyy', startDate: '0d', autoclose: true});
  },
  "click #btnAddHoliday": function(e, instance){
    $('#btnAddHoliday').hide();
    var selectedDate = $('#txtDate').val();
    var holidayName = $('#txtHoliday').val();
    if(selectedDate != '' && holidayName != ''){
      swal({
          title: "Are you sure?",
          text: "You want to add holiday!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#55dd6b",
          confirmButtonText: "Yes, add it!",
          closeOnConfirm: false
      }, function(isConfirm) {
          if (isConfirm) {
            Meteor.call("manageSECiHolidayList",selectedDate,holidayName, function(error, result){
              if(error){
                $('#btnAddHoliday').show();
                swal("Oops...", "Please try again!", "error");
              }else{
                if (result.status) {
                  $('#btnAddHoliday').show();
                  swal("Added!", "Holiday Successfully Added.", "success");
                  instance.ddlTypeSelectedVar.set();
                  $('#txtDate').val('');
                  $('#txtHoliday').val('');
                }
              }
            });
          } else {
            $('#btnAddHoliday').show();
          }
      });
    }else{
      $('#btnAddHoliday').show();
      swal("All fields are required!");
    }
  },
  "click #btnUpdateHoliday": function(e, instance){
    $('#btnUpdateHoliday').hide();
    var selectedDate = $('#txtDate').val();
    var holidayName = $('#txtHoliday').val();
    var docId  = instance.docId.get();
    if(selectedDate != '' && holidayName != ''){
      swal({
          title: "Are you sure?",
          text: "You want to update holiday!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#55dd6b",
          confirmButtonText: "Yes, update it!",
          closeOnConfirm: false
      }, function(isConfirm) {
          if (isConfirm) {
            Meteor.call("manageSECiHolidayList",selectedDate, holidayName, docId, function(error, result){
              if(error){
                $('#btnUpdateHoliday').show();
                swal("Oops...", "Please try again!", "error");
              }else{
                if (result.status) {
                  $('#btnUpdateHoliday').show();
                  swal("Added!", "Holiday Successfully Updated.", "success");
                  instance.ddlTypeSelectedVar.set();
                  $('#txtDate').val('');
                  $('#txtHoliday').val('');
                }
              }
            });
          } else {
            $('#btnUpdateHoliday').show();
          }
      });
    }else{
      $('#btnUpdateHoliday').show();
      swal("All fields are required!");
    }
  },
  "click a#edit": function(e, instance){
    var docId = $(e.currentTarget).attr("docid");
    instance.docId.set(docId);
    var data = SeciHolidaysDetails.find({_id:docId}).fetch();
    instance.ddlTypeSelectedVar.set(data[0]);
    $('#txtDate').val(data[0].date);
    $('#txtHoliday').val(data[0].name);

  },
  "click a#delete": function(e, instance){
    var docId = $(e.currentTarget).attr("docid");
    swal({
        title: "Are you sure?",
        text: "You want to delete it!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#55dd6b",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    }, function(isConfirm) {
        if (isConfirm) {
          SeciHolidaysDetails.remove(docId);
          swal("Deleted!", "Holiday Successfully Deleted.", "success");
        }
    });
  }
});

Template.addHolidaysList.helpers({
    settings: function () {
      var userType = Meteor.user().profile.user_type;
      if (userType == 'spd') {
        return {
            collection: SeciHolidaysDetails.find(),
            rowsPerPage: 11,
            showFilter: true,
            fields: [{key: 'date', label: 'Date'},{key: 'name', label: 'Name'},{key: 'month', label: 'Month'},{key: 'year', label: 'Year'}]
        };
      }else {
        return {
            collection: SeciHolidaysDetails.find(),
            rowsPerPage: 11,
            showFilter: true,
            fields: [{key: 'date', label: 'Date'},{key: 'name', label: 'Name'},{key: 'month', label: 'Month'},{key: 'year', label: 'Year'}, {
                    key: 'action',
                    label: 'Action',
                    fn: function (value, object) {
                        return new Spacebars.SafeString('<a id="edit" docid="' + object._id + '" class="btn btn-primary btn-xs">Edit</a>  <a id="delete" docid="' + object._id + '" class="btn btn-danger btn-xs">Delete</a>');
                    }
                }]
        };
      }
    },
    isView: function () {
        return true;
    },
    returnDataToEdit(){
      if (Template.instance().ddlTypeSelectedVar.get()) {
        return Template.instance().ddlTypeSelectedVar.get();
      }else {
        return false;
      }
    },
    "isUserTypeSPD": function() {
      if (Meteor.userId()) {
        if (Meteor.user().profile.user_type == 'spd') {
            return false;
        }else {
          return true;
        }
      }
    },
});

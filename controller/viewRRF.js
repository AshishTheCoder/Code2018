import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.viewRRFdata.onCreated(function viewrrf() {
  this.realTimeData = new ReactiveVar;
  this.viewrealTimeData = new ReactiveVar;
});

Template.viewRRFdata.rendered = function() {
  SessionStore.set("isLoading",false);
    $('.selectDate').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true
    });
};

Template.viewRRFdata.events({
    "change .selectDate" (e, instance) {
      instance.realTimeData.set('');
      instance.viewrealTimeData.set('');
    },
    "change #selectDiscomForRRF" (e, instance) {
        var selectedStateVar = $(e.currentTarget).val();
        instance.realTimeData.set('');
        instance.viewrealTimeData.set('');
    },
    "click #viewRRFdataBtn" (e, instance) {
        var selectedDate = $('.selectDate').val();
        var selectedState = $('#selectDiscomForRRF').val();
        var diffState = $('#selectDiscomForRRF').find(':selected').attr("attrState");
        if(selectedDate != '' && selectedState != ''){
          SessionStore.set("isLoading",true);
          Meteor.call("viewRRFDataToAdmin",selectedDate,selectedState,diffState, function(error, result){
            if(error){
              SessionStore.set("isLoading",false);
              swal("Oops...", "Please try again!", "error");
            }else{
              if(result.status){
                var data = result.data;
                instance.realTimeData.set(data.arr);
                instance.viewrealTimeData.set(data.totalArr);
                SessionStore.set("isLoading",false);
              }else{
                SessionStore.set("isLoading",false);
                swal(result.message);
              }
            }
          });
        }else{
          swal('All fields are required!');
        }
    }
});

Template.viewRRFdata.helpers({
  "getValues": function(value) {
      keys = Object.keys(value);
      var values = [];
      keys.forEach(function(v) {
          values.push(value[v]);
      });
      return values;
  },
  "getTableHeadings": function(value) {
      keys = Object.keys(value[0]);
      var values = [];
      var len = keys.length;
      values.push("Sr. No.");
      values.push("Date");
      values.push("Time Slot");
      for (i = 0; i < len - 3; i++) {
          values.push("R" + i);
      }
      return values;
  },
  "isRealTimeViewBtnClicked": function() {
      if (Template.instance().realTimeData.get()) {
          return Template.instance().realTimeData.get();
      } else {
          return false;
      }
  },
  "isRealTimeViewBtnClickedToViewRev": function() {
      if (Template.instance().realTimeData.get()) {
          return true;
      } else {
          return false;
      }
  },
  "isRealTimeTotalMwhView": function() {
      if (Template.instance().viewrealTimeData.get()) {
          return Template.instance().viewrealTimeData.get();
      } else {
          return false;
      }
  },

});

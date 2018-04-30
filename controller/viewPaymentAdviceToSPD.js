Template.viewPaymentAdviceToSPD.onCreated(function xyz() {
    this.getData = new ReactiveVar();
});

Template.viewPaymentAdviceToSPD.rendered = function(){
  SessionStore.set("isLoading", false);
};

Template.viewPaymentAdviceToSPD.events({
  'change #ddlFinancialYear': function(e, instance) {
    var fyear = $(e.currentTarget).val();
    $('#ddlMonth').val('');
    instance.getData.set();
  },
  'change #ddlMonth': function(e, instance) {
    var month = $(e.currentTarget).val();
    var fyear = $('#ddlFinancialYear').val();
    if (fyear != '' && month != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("getPaymentAdviceGeneratedBySECI",month, fyear, function(error, result) {
          if (error) {
              swal("Please try again!");
          } else {
              if (result.status) {
                  SessionStore.set("isLoading", false);
                  instance.getData.set(result.data);
              }else {
                SessionStore.set("isLoading", false);
                instance.getData.set();
                swal(result.message);
              }
          }
      });
    }else {
      swal('All fields are required!')
    }
  },
  'click #viewPaymentAdvicePdf': function(e, instance){
    var filePath = $(e.currentTarget).attr("filePath");
    window.open('upload/'+filePath);
  },
});

Template.viewPaymentAdviceToSPD.helpers({
  monthShow() {
      return monthReturn();
  },
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  returnData(){
    if (Template.instance().getData.get()) {
      return Template.instance().getData.get();
    }else {
      return false;
    }
  },
  isDataAvailable(){
    if (Template.instance().getData.get()) {
      return true;;
    }else {
      return false;
    }
  },
  serial(index){
    return index+1;
  }
});

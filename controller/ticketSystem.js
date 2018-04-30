
Template.ticketSystem.onCreated(function ticketSystem() {
    this.staticmodal = new ReactiveVar();
    this.radioBtnType = new ReactiveVar();
    this.getTicketStatus = new ReactiveVar();
    this.getSPDListArr = new ReactiveVar();
});

Template.ticketSystem.rendered = function() {
  var instance = Template.instance();
  SessionStore.set("isLoading", true);
  var limit = 15;
  Meteor.call("getTicketByAdmin",limit,  function(error, result) {
      if (error) {
          SessionStore.set("isLoading", false);
          swal("Oops...", "Please try again!", "error");
        } else {
          if (result.status) {
            SessionStore.set("isLoading", false);
            instance.getTicketStatus.set(result.data.ticketData);
            instance.getSPDListArr.set(result.data.spdArr);
          }else {
            SessionStore.set("isLoading", false);
            instance.getTicketStatus.set();
          }
      }
  });
};

Template.ticketSystem.events({
  'change #inlineRadioBtn': function(e, instance) {
    var selectedType = $(e.currentTarget).val();
    instance.radioBtnType.set(selectedType);
    if (selectedType == 'ViewStatus') {
      SessionStore.set("isLoading", true);
      Meteor.call("getTicketStatus",  function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
            } else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set(result.data);
              }else {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set();
                swal(result.message);
              }
          }
      });
    }
  },
  'change #ddlTicketStatusSearch': function(e, instance) {
    $('#ddlFilterYear').val("");
    $('#ddlMonth').val("");
    var status = $(e.currentTarget).val();
    var spdId = $('#ddlSPDList').val();
      SessionStore.set("isLoading", true);
      Meteor.call("getTicketStatus",spdId,status,  function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
            } else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set(result.data);
              }else {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set();
                swal(result.message);
              }
          }
      });
  },
  'keyup #txtSearchTicketNo': function (e, instance) {
    $('#ddlFilterYear').val('');
    $('#ddlMonth').val('');
    $('#ddlSPDList').val('');
    $('#txtLatestTicketAdmin').val('');
    var ticketNo = $(e.currentTarget).val();
    if (ticketNo != '') {
      var json = {ticketNo:ticketNo};
      SessionStore.set("isLoading", true);
      Meteor.call("getTicketStatusBySearch",'Ticket Number', json,  function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
            } else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set(result.data);
              }else {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set();
              }
          }
      });
    }
  },
  'change #ddlFilterYear': function (e, instance) {
    $('#txtSearchTicketNo').val('');
    $('#txtLatestTicketAdmin').val('');
    var year = $(e.currentTarget).val();
    if (year != '') {
      var json = {year:year};
      var spdid = $('#ddlSPDList').val();
      var status = $('#ddlTicketStatusSearch').val();
      SessionStore.set("isLoading", true);
      Meteor.call("getTicketStatusBySearch",'Year', json, spdid,status, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
            } else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set(result.data);
              }else {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set();
              }
          }
      });
    }else {
      instance.getTicketStatus.set();
    }
  },
  'change #ddlMonth': function (e, instance) {
    $('#txtSearchTicketNo').val('');
    $('#txtLatestTicketAdmin').val('');
    var month = $(e.currentTarget).val();
    var year = $('#ddlFilterYear').val();
    if (month != '') {
      var json = {month:month, year:''};
      if (year != '') {
        var json = {month:month, year:year};
      }
      var spdid = $('#ddlSPDList').val();
      var status = $('#ddlTicketStatusSearch').val();
      SessionStore.set("isLoading", true);
      Meteor.call("getTicketStatusBySearch",'Month', json, spdid, status,  function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
            } else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set(result.data);
              }else {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set();
              }
          }
      });
    }else {
      instance.getTicketStatus.set();
    }
  },
  'keyup #txtLatestTicketAdmin': function (e, instance) {
    $('#ddlSPDList').val('');
    var limit = $(e.currentTarget).val();
    if (limit != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("getTicketByAdmin",limit,  function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
            } else {
              if (result.status) {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set(result.data.ticketData);
                instance.getSPDListArr.set(result.data.spdArr);
              }else {
                SessionStore.set("isLoading", false);
                instance.getTicketStatus.set();
              }
          }
      });
    }else {
      instance.getTicketStatus.set();
    }
  },
  'click #btnRaiseTicket': function (e, instance) {
    var currentDate = $('#txtDate').val();
    var query = $('#txtRequest').val();
    if (currentDate != '' && query != '') {
      swal({
          title: "Are you sure?",
          text: "You want to raise ticket!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#55dd6b",
          confirmButtonText: "Yes, raise it!",
          closeOnConfirm: false
      }, function(isConfirm) {
          if (isConfirm) {
              SessionStore.set("isLoading", true);
              Meteor.call("spdTicketRaising",currentDate,query,  function(error, result) {
                  if (error) {
                      SessionStore.set("isLoading", false);
                      swal("Oops...", "Please try again!", "error");
                    } else {
                      if (result.status) {
                        SessionStore.set("isLoading", false);
                        swal("Success!", "Your ticket has been raised.", "success");
                        $('#txtRequest').val('');
                      }
                  }
              });
          }
      });
    }else {
      swal('Fields can not be blank!');
    }
  },
  "click .clsBtnAction": function(e, t) {
      var spdId = $(e.currentTarget).attr('attrIds');
      var spdName = $(e.currentTarget).attr('attrName');
      var ticketNo = $(e.currentTarget).attr('attrTicket');
      $('#txtTicketNoStatus').val(ticketNo);
      $('#txtSPDName').val(spdName);
      $('#btnAddTicketStatus').val(spdId);
  },
  "click #btnAddTicketStatus": function(e, instance) {
      var docId = $(e.currentTarget).val();
      var ticketNo = $('#txtTicketNoStatus').val();
      var spdName = $('#txtSPDName').val();
      var status = $('#ddlStatus').val();
      var comment = $('#txtComment').val();
      if (status != '' && comment!= '') {
        var json = {
          docId:docId,
          ticketNo:ticketNo,
          spdName:spdName,
          status:status,
          comment:comment
        };
        SessionStore.set("isLoading", true);
        Meteor.call("updateTicketStatus",json,  function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Oops...", "Please try again!", "error");
              } else {
                if (result.status) {
                  SessionStore.set("isLoading", false);
                  instance.getTicketStatus.set(result.data);
                  $('#txtTicketNoStatus').val("");
                  $('#txtSPDName').val("");
                  $('#ddlStatus').val("");
                  $('#txtComment').val("");
                }else {
                  SessionStore.set("isLoading", false);
                  instance.getTicketStatus.set();
                }
            }
        });
      }else {
        swal('All fields are required!');
      }

  },
});

Template.ticketSystem.helpers({
  monthShow() {
      return monthReturn();
  },
  yearShow() {
      return dynamicYear();
  },
  financialYearHelper(){
    return dynamicFinancialYear();
  },
  serial(index){
    return index+1;
  },
  currentDate(){
    return moment().format('DD-MM-YYYY');
  },
  spdListArr(){
    if (Template.instance().getSPDListArr.get()) {
      return Template.instance().getSPDListArr.get();
    }else {
      return false;
    }
  },
  raisedTicket(){
    if (Template.instance().radioBtnType.get() == 'RaiseTicket') {
      return true;
    }else {
      return false;
    }
  },
  viewRaisedTicket(){
    if (Template.instance().radioBtnType.get() == 'ViewStatus') {
      return true;
    }else {
      return false;
    }
  },
  "isUserTypeSPDApproved": function() {
    if (Meteor.userId()) {
      if (Meteor.user().profile.user_type == 'spd' && Meteor.user().profile.status == 'approved') {
          return true;
      }else {
        return false;
      }
    }
  },
  isDataAvailable(){
    if (Template.instance().getTicketStatus.get()) {
      return true;
    }else {
      return false;
    }
  },
  returnData(){
    if (Template.instance().getTicketStatus.get()) {
      return Template.instance().getTicketStatus.get();
    }else {
      return false;
    }
  }
});

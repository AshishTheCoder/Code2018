import {ReactiveVar} from 'meteor/reactive-var';

Template.sixLevelFilesInitialization.onCreated(function sixLevel() {
  this.getDataFromServer = new ReactiveVar;
  this.userDataComercial = new ReactiveVar;
  this.checkUserToForward = new ReactiveVar();
  this.userStatus = new ReactiveVar();
  this.approvalData = new ReactiveVar;
  this.getApprovalData = new ReactiveVar;
});

Template.sixLevelFilesInitialization.rendered = function () {
  SessionStore.set('isLoading',true);
   var instance = Template.instance();
  Meteor.call('getDataForApproval', function(error, result){
    if (error) {
      SessionStore.set('isLoading',false);
      swal('Please try again!');
    }else {
      if (result.status) {
        var finalData = result.data;
        SessionStore.set('isLoading',false);
        instance.getDataFromServer.set(finalData.data);
        instance.userDataComercial.set(finalData.userData);
      }
    }
  });
};

Template.sixLevelFilesInitialization.events({
  'click .paymentNotePdfBtn'(e, instance){
    var filePath = $(e.currentTarget).attr("filePath");
    window.open('/upload/'+filePath);
  },
  'change #ddlTypeOfPaymentNoteForApproval': function(e, instance){
    instance.userStatus.set();
    instance.checkUserToForward.set();
    var noteType = $(e.currentTarget).val();
    Meteor.call('filterPaymentNoteForApproval',noteType, function(error, result){
      if (error) {
        SessionStore.set('isLoading',false);
        swal('Please try again!');
      }else {
        if (result.status) {
          SessionStore.set('isLoading',false);
          instance.getDataFromServer.set(result.data);
        }
      }
    });
  },
  'click .actionBtnPaymentNote'(e, instance){
    instance.userStatus.set();
    instance.getApprovalData.set();
    var idVar = $(e.currentTarget).attr("attrId");
    Meteor.call('gettingApprovalData',idVar, function(error, result){
      if (error) {
        swal('Please try again!');
      }else {
        if (result.status) {
          instance.approvalData.set(result.data.dataJson);
          instance.getApprovalData.set(result.data.getApprovalDetails);
          $("#modalOpenSixLevel").click();
        }
      }
    });
  },
  'change #ddlStatus': function(e, instance){
    var status = $(e.currentTarget).val();
    if (status == 'Closed') {
      instance.userStatus.set(status);
    }else {
      instance.userStatus.set();
    }
  },
  'change #ddlForwardTo': function(e, instance){
    var forwardTo = $(e.currentTarget).val();
    var levelNumberVar = $(e.currentTarget).find(':selected').attr("levelNumber");
    var userLevelVar = Meteor.user().profile.registration_form.levelNumber;
    var checkLevel = Number(levelNumberVar) - Number(userLevelVar);
    var arr = [];
    if (checkLevel > 1) {
      var levelArr = ["Level One", "Level Two", "Level Three", "Level Four", "Level Five", "Level Six"];
      var levelsArr = ["levelOne", "levelTwo", "levelThree", "levelFour", "levelFive", "levelSix"];
      for (var i = 1; i < checkLevel; i++) {
        var keyJson = {levelString:levelsArr[(userLevelVar -1) + i],levelNumber:Number(userLevelVar + i), username: levelArr[(userLevelVar -1) + i], name : levelArr[(userLevelVar -1) + i], forwardedPersonName : '', forwardTo : '', remark:''};
        arr.push(keyJson);
      }
      instance.checkUserToForward.set(arr);
    }else {
      instance.checkUserToForward.set();
    }
  },
  'click #btnSubmitApproval'(e, instance){
    var idVar = $(e.currentTarget).attr("attrId");
    var status = $('#ddlStatus').val();
    var comment = $('#txtComments').val();
    var remark = $('#txtRemark').val();
    var forwardTo = $('#ddlForwardTo').val();
    var forwardedPersonName = $("#ddlForwardTo").find(':selected').attr("attrName");
    var noteType = $('#ddlTypeOfPaymentNoteForApproval').val();
    var keyArr = [];
    var skipedUserArr = instance.checkUserToForward.get();
    if (instance.checkUserToForward.get()) {
      skipedUserArr.forEach( function(item) {
        keyArr.push(item);
      });
    }
    var fieldname = Meteor.user().profile.registration_form.level;
    var levelNum = Meteor.user().profile.registration_form.levelNumber;
    var keyJson = {'levelString':fieldname, 'levelNumber':Number(levelNum), forwardedPersonName : forwardedPersonName, forwardTo : forwardTo, username : Meteor.user().username , name : Meteor.user().profile.registration_form.name, remark:remark};
    keyArr.push(keyJson);
    if ($('#ddlForwardTo').val()) {
      var levelNumberVar = $("#ddlForwardTo").find(':selected').attr("levelNumber");
    }else {
      var levelNumberVar = 0;
    }
    var userStatus = [];
    $('.ddlAbsentUserStatus').each(function() {
        if ($(this).val()) {
            userStatus.push($(this).val());
        } else {
            swal("All fields Required");
            throw new Error("All fields Required!");
        }
    });
    userStatus.push(status);
    var userComment = [];
    $('.txtAbsentUserStatusComments').each(function() {
        if ($(this).val()) {
            userComment.push($(this).val());
        } else {
            swal("All fields Required");
            throw new Error("All fields Required!");
        }
    });
    userComment.push(comment);
    if (status == 'Closed') {
      forwardTo = 'Dummy User';
    }
    if (status != '' && comment != '' && forwardTo != '') {
      swal({
          title: "Are you sure?",
          text: "You want to submit entered details!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#55dd6b",
          confirmButtonText: "Yes, submit it!",
          closeOnConfirm: false
        },
      function(){
          SessionStore.set("isLoading",true);
          Meteor.call("submitPaymentNoteStatus",idVar,status,comment,remark, forwardTo,levelNumberVar,userStatus,userComment,keyArr,noteType,forwardedPersonName, function(error, result) {
              if (error) {
                SessionStore.set("isLoading", false);
                  swal("Please try again !");
              } else {
                  if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.getDataFromServer.set(result.data);
                    instance.checkUserToForward.set();
                    swal("Success!", "Details successfully submitted.", "success");
                    $("#closeModalBtn").click();
                    $('#ddlStatus').val('');
                    $('#txtComments').val('');
                    $('#ddlForwardTo').val('');
                    $('.ddlAbsentUserStatus').val('');
                    $('.txtAbsentUserStatusComments').val('');
                  }
              }
          });
      });
    }else {
      swal('All fields are required!');
    }
  }
});

Template.sixLevelFilesInitialization.helpers({
  returnHelper(){
    if (Template.instance().getDataFromServer.get()) {
      return Template.instance().getDataFromServer.get();
    }else {
      return false;
    }
  },
  returnData(){
    if (Template.instance().approvalData.get()) {
      return Template.instance().approvalData.get();
    }else {
      return false;
    }
  },
  userComercial(){
    if (Template.instance().userDataComercial.get()) {
      return Template.instance().userDataComercial.get();
    }else {
      return false;
    }
  },
  userLevelIs(UserLevel){
    if (UserLevel) {
      if (UserLevel == Meteor.user().profile.registration_form.level) {
        return '#82ec69';
      }else {
        return false;
      }
    }else {
      return false;
    }
  },
  serial(index){
    return index+1;
  },
  absentUserComment(){
    if (Template.instance().checkUserToForward.get()) {
      return Template.instance().checkUserToForward.get();
    }else {
      return false;
    }
  },
  isUserComercialOrMaster(){
    if (Template.instance().getApprovalData.get()) {
      if (Meteor.user().profile.registration_form.level == "levelOne") {
        return true;
      }else {
        return false;
      }
      return Template.instance().getApprovalData.get();
    }else {
      return false;
    }
  },
  userStats(){
    if (Template.instance().userStatus.get() == 'Closed') {
      return false;
    }else {
      return true;
    }
  }
});

Template.PaymentAdviceFront.onCreated(function() {
    this.ApplicationTable = new ReactiveVar();
    this.ApplicationModal = new ReactiveVar();
    this.AppArray = new ReactiveVar();
    this.radioValueM = new ReactiveVar();
    this.confirmButton = new ReactiveVar();
    this.confirmButtonValue = new ReactiveVar();
});

Template.PaymentAdviceFront.onRendered(function() {
    SessionStore.set("isLoading", false);
    var instance = Template.instance();
    Meteor.call('ApplicationDataFetch', function(error, result) {
        if (error) {
            alert(error);
        } else {
            instance.ApplicationTable.set(result);
        }
    });
});

Template.PaymentAdviceFront.events({
    "click #openModal": function(e) {
        var instance = Template.instance();
        var get_id = $(e.currentTarget).attr("data-id");
        console.log(get_id);
        Meteor.call('ApplicationModalFetch', get_id, function(error, result) {
            if (error) {
                alert(error);
            } else {
              console.log(result[0].confrimButton);
              console.log(result);
                instance.confirmButton.set(result[0].confrimButton);
                instance.ApplicationModal.set(result);
            }
        });
        var absoURL = '';
        // Meteor.call("ApplicationURLInsert", absoURL, get_id, function(error, result) {
        //     if (error) {
        //         alert(error);
        //     } else
        //     if (result) {
        //         alert(absoURL);
        //     }
        // });
    },
    // "click #viewFilesBtn": function(){
    //
    // },
    "change .radioValue1": function(e) {
        var instance = Template.instance();
        var radioValue1 = $(e.currentTarget).val();
        instance.radioValueM.set(radioValue1);
        $(".modalCheck").prop({
            disabled: false
        });
        var Level = Meteor.user().profile.user_type;
        Level=Level.split("t")
        Level = Number(Level[1]);
        if (radioValue1 == "Approved") {
            if (Level == 1) {
                $(".modalCheck1").prop({
                    disabled: true
                });
            } else if (Level == 2) {
                $(".modalCheck1").prop({
                    disabled: true
                });
                $(".modalCheck2").prop({
                    disabled: true
                });
            } else if (Level == 3) {
                $(".modalCheck1").prop({
                    disabled: true
                });
                $(".modalCheck2").prop({
                    disabled: true
                });
                $(".modalCheck3").prop({
                    disabled: true
                });

            } else if (Level == 4) {
                $(".modalCheck1").prop({
                    disabled: true
                });
                $(".modalCheck2").prop({
                    disabled: true
                });
                $(".modalCheck3").prop({
                    disabled: true
                });
                $(".modalCheck4").prop({
                    disabled: true
                });

            } else if (Level == 5) {
                $(".modalCheck1").prop({
                    disabled: true
                });
                $(".modalCheck2").prop({
                    disabled: true
                });
                $(".modalCheck3").prop({
                    disabled: true
                });
                $(".modalCheck4").prop({
                    disabled: true
                });
                $(".modalCheck5").prop({
                    disabled: true
                });
            } else if (Level == 6) {
                $(".modalCheck1").prop({
                    disabled: true
                });
                $(".modalCheck2").prop({
                    disabled: true
                });
                $(".modalCheck3").prop({
                    disabled: true
                });
                $(".modalCheck4").prop({
                    disabled: true
                });
                $(".modalCheck5").prop({
                    disabled: true
                });
                $(".modalCheck6").prop({
                    disabled: true
                });
            }
        } else if (radioValue1 == "Reject") {
            if (Level == 1) {
                $(".modalCheck1").prop({
                    disabled: true
                });
                $(".modalCheck2").prop({
                    disabled: true
                });
                $(".modalCheck3").prop({
                    disabled: true
                });
                $(".modalCheck4").prop({
                    disabled: true
                });
                $(".modalCheck5").prop({
                    disabled: true
                });
                $(".modalCheck6").prop({
                    disabled: true
                });
            } else if (Level == 2) {
                $(".modalCheck2").prop({
                    disabled: true
                });
                $(".modalCheck3").prop({
                    disabled: true
                });
                $(".modalCheck4").prop({
                    disabled: true
                });
                $(".modalCheck5").prop({
                    disabled: true
                });
                $(".modalCheck6").prop({
                    disabled: true
                });
            } else if (Level == 3) {
                $(".modalCheck3").prop({
                    disabled: true
                });
                $(".modalCheck4").prop({
                    disabled: true
                });
                $(".modalCheck5").prop({
                    disabled: true
                });
                $(".modalCheck6").prop({
                    disabled: true
                });
            } else if (Level == 4) {
                $(".modalCheck4").prop({
                    disabled: true
                });
                $(".modalCheck5").prop({
                    disabled: true
                });
                $(".modalCheck6").prop({
                    disabled: true
                });
            } else if (Level == 5) {
                $(".modalCheck5").prop({
                    disabled: true
                });
                $(".modalCheck6").prop({
                    disabled: true
                });
            }
        }
    },
    "change .validateCheckbox": function(e) {
      var data = $(e.currentTarget).val();
      alert(data);
      // $(".validateCheckbox").each(function(value, element) {
      //   if($(this).val()!=data){
      //     $(this).prop({
      //         disabled: true
      //     });
      //   }
      // });
    },

    "submit form#modalForm": function(e) {
        e.preventDefault();
        var instance = Template.instance();
        var get_id = $(e.currentTarget).attr("data-id");
        var timestamp = new Date();
        timestamp = timestamp.toLocaleFormat('%d,%b,%Y');
        var data = '{';
        $("textarea.appmodal,select.appmodal,input.appmodal").each(function(value, element) {
            if ($(this).attr("type") == 'radio') {
                var value = $('input[name=' + $(this).attr("name") + ']:checked').val();
                data += '"' + $(this).attr("name") + '":"' + value + '",';
            } else {
                data += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
            }
        });
        data += '"' + "timestamp" + '":"' + timestamp + '",';
        data = $.parseJSON(data.replace(/,\s*$/, '') + '}');
        var radioValue = instance.radioValueM.get();
        Meteor.call("ApplicationModalUpdate", data, get_id, function(error, result) {
            if (error) {
                alert("Error");
            } else {
                alert("Data Updated Check Collection");
                $('.modalClose').click();
            }
        });
        Meteor.call("ApplicationArrayStatus", get_id, function(error, result) {
            if (error) {
                alert("Error");
            } else {
                instance.AppArray.set(result);
                var fetchArray = instance.AppArray.get();
                var ValueOfArray = [];
                ValueOfArray.push(fetchArray[0].appArray[0]);
                ValueOfArray.push(fetchArray[0].appArray[1]);
                ValueOfArray.push(fetchArray[0].appArray[2]);
                ValueOfArray.push(fetchArray[0].appArray[3]);
                ValueOfArray.push(fetchArray[0].appArray[4]);
                ValueOfArray.push(fetchArray[0].appArray[5]);
                if (radioValue == "Approved") {
                  var Level = Meteor.user().profile.user_type;
                  Level=Level.split("t")
                  Level = Number(Level[1]);
                    var CheckboxValue = $("input[name='check']:checked").val();
                    CheckboxValue = Number(CheckboxValue);
                    var CalcLevel = Level + (CheckboxValue - Level);
                    var CalcLevel2 = CalcLevel.toString();
                    var AtLevel = "Approved to" + CalcLevel;
                    if (Level == 1) {
                        for (var j = 6; j >= 1; j--) {
                            ValueOfArray.pop();
                        }
                        ValueOfArray.push(AtLevel);
                        for (var j = 2; j <= 6; j++) {
                            ValueOfArray.push("pending");
                        }
                    }
                    if (Level == 2) {
                        for (var j = 5; j >= 1; j--) {
                            ValueOfArray.pop();
                        }
                        ValueOfArray.push(AtLevel);
                        for (var j = 2; j <= 5; j++) {
                            ValueOfArray.push("pending");
                        }
                    }
                    if (Level == 3) {
                        for (var j = 5; j >= 2; j--) {
                            ValueOfArray.pop();
                        }
                        ValueOfArray.push(AtLevel);
                        for (var j = 3; j <= 5; j++) {
                            ValueOfArray.push("pending");
                        }
                    }
                    if (Level == 4) {
                        for (var j = 5; j >= 3; j--) {
                            ValueOfArray.pop();
                        }
                        ValueOfArray.push(AtLevel);
                        for (var j = 4; j <= 5; j++) {
                            ValueOfArray.push("pending");
                        }
                    }
                    if (Level == 5) {
                        for (var j = 5; j >= 4; j--) {
                            ValueOfArray.pop();
                        }
                        ValueOfArray.push(AtLevel);
                        for (var j = 5; j <= 5; j++) {
                            ValueOfArray.push("pending");
                        }
                    }
                    Meteor.call("ApplicationUpdateAppArray", get_id, ValueOfArray, function(error, result) {
                        if (error) {
                            alert("Error");
                        } else {
                            $(".modalClose").click();
                        }
                    });
                    Meteor.call("ApplicationUpdateButtonValue", get_id, CalcLevel2, function(error, result) {
                        if (error) {
                            alert("Error");
                        } else {}
                    });
                }
                if (radioValue == "Reject") {
                  var Level = Meteor.user().profile.user_type;
                  Level=Level.split("t")
                  Level = Number(Level[1]);
                    var CheckboxValue = $("input[name='check']:checked").val();
                    CheckboxValue = Number(CheckboxValue);
                    var CalcLevel = Level - (Level - CheckboxValue);
                    var CalcLevel2 = CalcLevel.toString();
                    var AtLevel = "Rejected to" + CalcLevel;
                    if (Level == 2) {
                        for (var j = 0; j >= 1; j++) {
                            ValueOfArray.shift();
                        }
                        ValueOfArray.unshift(AtLevel);
                        ValueOfArray.unshift("pending");
                    } else if (Level == 3) {
                        if ((Level - CheckboxValue) == 1) {
                            var Tempdata = ValueOfArray.slice(0, 1);
                            for (var j = 0; j <= 2; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 2) {
                            var Tempdata = ValueOfArray.slice(0, 1);
                            for (var j = 0; j <= 2; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                        }
                    } else if (Level == 4) {
                        if ((Level - CheckboxValue) == 1) {
                            var Tempdata = ValueOfArray.slice(0, 2);
                            for (var j = 0; j <= 3; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[1]);
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 2) {
                            var Tempdata = ValueOfArray.slice(0, 2);
                            for (var j = 0; j <= 3; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 3) {
                            var Tempdata = ValueOfArray.slice(0, 2);
                            for (var j = 0; j <= 3; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                        }
                    } else if (Level == 5) {
                        if ((Level - CheckboxValue) == 1) {
                            var Tempdata = ValueOfArray.slice(0, 3);
                            for (var j = 0; j <= 4; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[2]);
                            ValueOfArray.unshift(Tempdata[1]);
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 2) {
                            var Tempdata = ValueOfArray.slice(0, 3);
                            for (var j = 0; j <= 4; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[1]);
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 3) {
                            var Tempdata = ValueOfArray.slice(0, 3);
                            for (var j = 0; j <= 4; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 4) {
                            var Tempdata = ValueOfArray.slice(0, 3);
                            for (var j = 0; j <= 4; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                        }
                    } else if (Level == 6) {
                        if ((Level - CheckboxValue) == 1) {
                            var Tempdata = ValueOfArray.slice(0, 4);
                            for (var j = 0; j <= 5; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[3]);
                            ValueOfArray.unshift(Tempdata[2]);
                            ValueOfArray.unshift(Tempdata[1]);
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 2) {
                            var Tempdata = ValueOfArray.slice(0, 4);
                            for (var j = 0; j <= 5; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[2]);
                            ValueOfArray.unshift(Tempdata[1]);
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 3) {
                            var Tempdata = ValueOfArray.slice(0, 4);
                            for (var j = 0; j <= 5; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[1]);
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 4) {
                            var Tempdata = ValueOfArray.slice(0, 4);
                            for (var j = 0; j <= 5; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift(Tempdata[0]);
                        }
                        if ((Level - CheckboxValue) == 5) {
                            var Tempdata = ValueOfArray.slice(0, 4);
                            for (var j = 0; j <= 5; j++) {
                                ValueOfArray.shift();
                            }
                            ValueOfArray.unshift(AtLevel);
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                            ValueOfArray.unshift("pending");
                        }
                    }
                    Meteor.call("ApplicationUpdateAppArray", get_id, ValueOfArray, function(error, result) {
                        if (error) {
                            alert("Error");
                        } else {
                            $(".modalClose").click();
                        }
                    });
                    Meteor.call("ApplicationUpdateButtonValue", get_id, CalcLevel2, function(error, result) {
                        if (error) {
                            alert("Error");
                        } else {

                        }
                    });
                }
            }
        });
    },
});


Template.PaymentAdviceFront.helpers({
  //  validateLevelRadioButton (){
  //
  //    if(Template.instance().radioValueM.get()){
  //      return true;
  //    }else{
  //      return false;
  //    }
  //  },
    AppTable: function() {
        return Template.instance().ApplicationTable.get();
    },
    AppModal: function() {
        return Template.instance().ApplicationModal.get();
    },
    absoURL: function(){
      var absoURLVar = Template.instance().ApplicationModal.get();
      var urlVar = absoURLVar[0].viewFile;
      return urlVar;
    },
    serial: function(index) {
        return index + 1;
    },
    comment1: function() {
        if (Meteor.user().profile.user_type == "applicant1") {
            return true;
        } else {
            return false;
        }
    },
    comment2: function() {
        if (Meteor.user().profile.user_type == "applicant2") {
            return true;
        } else {
            return false
        }
    },
    comment3: function() {
        if (Meteor.user().profile.user_type == "applicant3") {
            return true;
        } else {
            return false
        }
    },
    comment4: function() {
        if (Meteor.user().profile.user_type == "applicant4") {
            return true;
        } else {
            return false
        }
    },
    comment5: function() {
        if (Meteor.user().profile.user_type == "applicant5") {
            return true;
        } else {
            return false
        }
    },
    comment6: function() {
        if (Meteor.user().profile.user_type == "applicant6") {
            return true;
        } else {
            return false
        }
    },
    confirmButton: function() {
      var Level = Meteor.user().profile.user_type;
      Level=Level.split("t")
      Level = Number(Level[1]);
    var button=Template.instance().confirmButton.get()
        if (Level == button) {
            return true;
        } else if (Level != matchLevel) {
            return false;
        }
    },
});


// for(var j=1;j<=Level;j++){
// var k= j.toString();
//   if(k==$(".modalCheck").attr("key")){
//     alert($(".modalCheck").attr("key"));
//     $(".modalCheck[abc=xyz]").attr("key").click();
//         $(e.currentTarget).prop({ disabled: true });
//            }
// }

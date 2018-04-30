import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.discom.onCreated(function ss() {
    this.getJson = new ReactiveVar;
    this.spdListVar = new ReactiveVar('');
    this.showSPDlist = new ReactiveVar([]);
});

Template.discom.rendered = function() {
  SessionStore.set("isLoading",false);
    $("#discumprofileform").validate({
        rules: {
            nameof_buyingutility: {
                required: true
            },

            discom_short_name: {
                required: true
            },
            transaction_type: {
                required: true
            },

            // LTOA_number: {
            //     required: true
            // },
            // fromdate: {
            //     date: true,
            //     required: true
            // },
            // todate: {
            //     date: true,
            //     required: true
            // },
            // bg_DDsubmitedto: {
            //     required: true
            // },
            // stuBG_DDamount: {
            //     required: true,
            //     number: true
            // },
            // bg_DDnumber: {
            //     required: true
            // },
            // validity: {
            //     date: true,
            //     required: true
            // },
            // bankname: {
            //     required: true
            // },
            // SLDC_OperatingChargesSubmitted: {
            //     required: true
            // },
            // SLDC_bgDDamount: {
            //     required: true,
            //     number: true
            // },
            // SLDC_bgDDno: {
            //     required: true
            // },
            // SLDC_validity: {
            //     date: true,
            //     required: true
            // },
            min_energy: {
                required: true
            },
            max_energy: {
                required: true
            },
            // SLDC_issuingbank: {
            //     required: true
            // },
            date_of_amendment_one: {
                required: true
            },
            discom_address: {
                required: true
            },
            // discom_address_line_two: {
            //     required: true
            // },
            discom_city: {
                required: true
            },
            discom_state: {
                required: true
            },
            discom_pin: {
                required: true
            },
            // discom_fax: {
            //     required: true
            // },
            invoice_raised_to:{
              required: true
            },
        },
        messages: {
            nameof_buyingutility: {
                required: "Please enter name of buying utility"
            },
            discom_short_name: {
                required: "Please enter buying utility short name"
            },
            transaction_type: {
                required: "Please enter transaction type"
            },
            // LTOA_number: {
            //     required: "Please enter LTOA number"
            // },
            // fromdate: {
            //     required: "Please enter a date ",
            //     date: "Please enter a valid date"
            // },
            // todate: {
            //     required: "Please enter a date",
            //     date: "Please enter a valid date"
            // },
            date_of_amendment_one: {
                required: "Please enter a date of amendment",
                date: "Please enter a valid date"
            },
            // bg_DDsubmitedto: {
            //     required: "Please enter name to whom DD submited"
            // },
            // stuBG_DDamount: {
            //     required: "Please enter DD amount",
            //     number: "Please enter only number"
            // },
            // bg_DDnumber: {
            //     required: "Please enter DD number"
            // },
            // validity: {
            //     required: "Please enter validity",
            //     date: "Please enter a valid date"
            // },
            // bankname: {
            //     required: "Please enter bank name"
            // },
            // SLDC_OperatingChargesSubmitted: {
            //     required: "Please enter name to whom charges submitted"
            // },
            // SLDC_bgDDamount: {
            //     required: "Please enter SLDC DD amount",
            //     number: "Please enter only number"
            // },
            // SLDC_bgDDno: {
            //     required: "Please enter SLDC DD number"
            // },
            // SLDC_validity: {
            //     required: "Please enter SLDC validity",
            //     date: "Please enter a valid date"
            // },
            // SLDC_issuingbank: {
            //     required: "Please enter SLDC Bank Name"
            // },
            max_energy: {
                required: "Please enter Maximum Energy"
            },
            min_energy: {
                required: "Please enter Minimum Energy"
            },
            discom_address: {
                required: "Please enter Address Line I"
            },
            // discom_address_line_two: {
            //     required: "Please enter Address Line II"
            // },
            discom_city: {
                required: "Please enter City"
            },
            discom_state: {
                required: "Please enter Discom State"
            },
            discom_pin: {
                required: "Please enter Pin"
            },
            // discom_fax: {
            //     required: "Please enter Fax No"
            // },
            invoice_raised_to:{
              required: "Please enter invoice raised to"
            }
        }
    });
    $('#dateFrom').datepicker().on('changeDate', function(ev) {
        $("form").validate().element("#dateFrom");
        $(this).datepicker('hide');
    });
    $('#dateTo').datepicker().on('changeDate', function(ev) {
        $("form").validate().element("#dateTo");
        $(this).datepicker('hide');
    });
    $('#dateLTA').datepicker().on('changeDate', function(ev) {
        $("form").validate().element("#dateLTA");
        $(this).datepicker('hide');
    });
    $('#dateAmendment').datepicker().on('changeDate', function(ev) {
        $("form").validate().element("#dateAmendment");
        $(this).datepicker('hide');
    });

    $('#validity').datepicker().on('changeDate', function(ev) {
        $("form").validate().element("#validity");
        $(this).datepicker('hide');
    });
    $('#SLDC_validity').datepicker().on('changeDate', function(ev) {
        $("form").validate().element("#SLDC_validity");
        $(this).datepicker('hide');
    });
    var instance = Template.instance();
    Meteor.call("spdListForSelection", function(error, result) {
        if (error) {
            swal("Please try again!");
        } else {
            if (result.status) {
                instance.spdListVar.set(result.data);

            }
        }
    });
};
Template.discom.events({
    "change #selectedSPDs": function(e) {
        var instance = Template.instance();
        var spdName = $(e.currentTarget).val();
        var spdids = $("#selectedSPDs").find(':selected').attr("spdids");
        var spdState = $("#selectedSPDs").find(':selected').attr("state");
        var transactionType = $("#selectedSPDs").find(':selected').attr("transaction_type");
        var arrData = [];
        if(spdName != ''){
          var jsonData = {
              sn: Number(instance.showSPDlist.get().length + 1),
              spdId: spdids,
              spdName: spdName,
              spdState: spdState,
              transaction_type: transactionType
          };
          arrData = instance.showSPDlist.get();
          arrData.push(jsonData);
          instance.showSPDlist.set(arrData);
        }
    },
    "click #removeSpd": function(e) {
        var instance = Template.instance();
        if (confirm("Are you sure! you want to remove SPD.")) {
            var index = $(e.currentTarget).attr('attr');
            var data = instance.showSPDlist.get();
            data.splice(index, 1);
            instance.showSPDlist.set(data);
        }
    },

    "submit form#discumprofileform": function(e) {
        e.preventDefault();
        var instance = Template.instance();
        var discumprofileform = '{';
        $("input.discumprofileform,select.discumprofileform").each(function(value, element) {
            discumprofileform += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        discumprofileform = $.parseJSON(discumprofileform.replace(/,\s*$/, '') + '}');
        var regionalArr = [];
        $('.RegionalArea').each(function() {
            var value = $('input[name=' + $(this).attr("name") + ']:checked').val();
            if (value == 'ERLDC' || value == 'NRLDC' || value == 'NERLDC' || value == 'WRLDC') {
                regionalArr.push(value);
            }
        });
        discumprofileform.regional_area = regionalArr;
        var data = instance.showSPDlist.get();
        discumprofileform.spdIds = data;
        instance.getJson.set(discumprofileform);
        swal({
            title: "Are you sure?",
            text: "You want to submit discom profile!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
              Meteor.call("saveDiscumprofileform", discumprofileform, function(error, result) {
                  if (error) {
                      swal("Please try again !");
                  } else {
                      if (result.status) {
                          swal('Discom Profile Successfully Submitted!');
                          $("input.discumprofileform,select.discumprofileform").each(function(value, element) {
                              $(this).val('');
                          });
                          instance.showSPDlist.set([]);
                      }
                  }
              });
            }
        });
    },
    "click #btnpreview": function(e, t) {
        e.preventDefault();
        var instance = Template.instance();
        var discumprofileform = '{';
        $("input.discumprofileform,select.discumprofileform").each(function(value, element) {
            discumprofileform += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        discumprofileform = $.parseJSON(discumprofileform.replace(/,\s*$/, '') + '}');
        instance.getJson.set(discumprofileform);
    },
});
Template.discom.helpers({
    showSPdTable() {
        if (Template.instance().showSPDlist.get().length > 0) {
            return true;
        }
    },
    "returnJson": function() {
        return Template.instance().getJson.get();
    },
    "spdameList": function() {
        var spds = Template.instance().spdListVar.get();
        if (spds != '') {
            return spds;
        } else {
            return false;
        }
    },
    "showSPDdata": function() {
        var showSPD = Template.instance().showSPDlist.get();
        if (showSPD.length > 0) {
            return showSPD;
        } else {
            return false;
        }
    }
});

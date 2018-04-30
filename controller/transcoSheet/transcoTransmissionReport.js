import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.transcoTransmissionReport.onCreated(function abc() {
    this.discomScheme = new ReactiveVar;
    this.discomName = new ReactiveVar;
    this.monthTypeSelected = new ReactiveVar;
    this.YearTypeSelected = new ReactiveVar;
    this.TransactionTypeSelected = new ReactiveVar();
    this.socMoc = new ReactiveVar();
    this.StuCtuType = new ReactiveVar;
    this.StuCtuSelected = new ReactiveVar;
});

Template.transcoTransmissionReport.onRendered(function abc() {
    $('#genearateTranscoSheet').hide();
});

Template.transcoTransmissionReport.events({
    "submit form#transcoTransmissionReport": function(e) {
        e.preventDefault();
        var json = '{';
        $(" #transcoTransmissionReport input.form-control, #transcoTransmissionReport select.form-control").each(function(value, element) {
            json += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        json = $.parseJSON(json.replace(/,\s*$/, '') + '}');
        Meteor.call('generateTranscoSheet', json, function(error, result) {
            if (error) {
                swal("Oops...", "Please try again!", "error");
            } else {
                if (result.status) {
                    window.open(result.data);
                } else {
                    swal(result.message);
                }
            }
        });
    },

    'change #ddlStuCtuType': function(e, instance) {
      e.preventDefault();
      $('#genearateTranscoSheet').hide();
      $('#stu_transaction_type').val('');
      instance.socMoc.set();
      var type = $(e.currentTarget).find(':selected').attr('attrType');
      if (type != '') {
        instance.socMoc.set("socmoc");
        instance.StuCtuType.set(type);
      } else {
        instance.socMoc.set("socmoc");
        instance.StuCtuType.set();
      }
    },
        // $('#stu_transaction_type').val('');
        // instance.stuCtuType.set();
        // instance.TransactionTypeSelected.set();
        // instance.DiscomSchemeSelected.set();
        // instance.YearTypeSelected.set();
        // instance.monthTypeSelected.set();
        // instance.DiscomSelected.set();
        // var type = $(e.currentTarget).val();
        // if (type != null) {
        //     instance.stuCtuType.set(type);
        //     Meteor.setTimeout(function() {
        //         $('#stu_transaction_type').multiselect({
        //             buttonWidth: '380px',
        //             includeSelectAllOption: true,
        //         });
        //     }, 100);
        // } else {
        //     instance.stuCtuType.set();
        // }
    // "click ._pdfGenerate": function(e) {
    //     Meteor.call('GeneratePDFForUplinkFromFOREX', function(error, result) {
    //         if (error) {
    //             swal("Oops...", "Please try again!", "error");
    //         } else {
    //             swal('Successfully generated');
    //         }
    //     });
    // },
    'change #stu_transaction_type' (e, instance) {
        e.preventDefault();
        $('#genearateTranscoSheet').hide();
        if($(e.currentTarget).val()!=''){
        $('#genearateTranscoSheet').show();
      }
    },
    'change #month' (e, instance) {
        e.preventDefault();
        $('#genearateTranscoSheet').hide();
        instance.StuCtuSelected.set();
        instance.YearTypeSelected.set();
        instance.socMoc.set();
        $('#financial_year').val('');
        var month = $(e.currentTarget).val();
        if (month != '') {

            // Meteor.setTimeout(function() {
            //     $('#month').multiselect({
            //         buttonWidth: '380px',
            //         includeSelectAllOption: true,
            //     });
            // }, 100);
            instance.YearTypeSelected.set(true);
        } else {
            instance.YearTypeSelected.set();
        }
    },
    'change #financial_year' (e, instance) {
        e.preventDefault();
        $('#genearateTranscoSheet').hide();
        instance.StuCtuSelected.set();
        instance.socMoc.set();
        $('#ddlStuCtuType').val('');
        var financialYearArr = $(e.currentTarget).val();
        if (financialYearArr != '') {
          instance.StuCtuSelected.set(true);
        } else {
            instance.StuCtuSelected.set();
        }
    },

    // 'change #scheme' (e, instance) {
    //     e.preventDefault();
    //     instance.DiscomSchemeSelected.set();
    //     var discomScheme = $(e.currentTarget).val();
    //     if (discomScheme != null) {
    //         Meteor.call('setDiscom', discomScheme, function(error, result) {
    //             instance.DiscomSchemeSelected.set(true);
    //             if (error) {
    //                 swal("Oops...", "Please try again!", "error");
    //             } else {
    //                 if (result.status) {
    //                     instance.discomName.set(result.data);
    //                 }
    //             }
    //         });
    //     } else {
    //         swal("Please select discom scheme")
    //         instance.discomName.set();
    //     }
    //     Meteor.setTimeout(function() {
    //         $('#discom_state').multiselect({
    //             buttonWidth: '380px',
    //             includeSelectAllOption: true,
    //         });
    //     }, 100);
    // },
    // 'change #discom_state' (e, instance) {
    //     e.preventDefault();
    //     $('#genearateTranscoSheet').show();
    //     var discom = $(e.currentTarget).val();
    //     if (discom == null) {
    //         $('#genearateTranscoSheet').hide();
    //         swal("Please select discom")
    //     }
    // }
});

Template.transcoTransmissionReport.helpers({
    monthShow() {
        return monthReturn();
    },
    yearHelper() {
        return dynamicFinancialYear();
    },
    ifMonthTypeSelected() {
        if (Template.instance().monthTypeSelected.get()) {
            return true;
        } else {
            return false;
        }
    },
    ifYearTypeSelected() {
        if (Template.instance().YearTypeSelected.get()) {
            return true;
        } else {
            return false;
        }
    },
    ifTransactionTypeSelected() {
        if (Template.instance().TransactionTypeSelected.get()) {
            return true;
        } else {
            return false;
        }
    },
    ifsocMoc(){
      if (Template.instance().socMoc.get()) {
        return true;
      } else {
        return false;
      }
    },
    stuRajasthan() {
      if (Template.instance().StuCtuType.get() == 'Rajasthan') {
        return true;
      } else {
        return false;
      }
    },
    stuType() {
      if (Template.instance().StuCtuType.get() == 'STU') {
        return true;
      } else {
        return false;
      }
    },
    ctuType() {
      if (Template.instance().StuCtuType.get() == 'CTU') {
        return true;
      } else {
        return false;
      }
    },
    ifStuCtuSelected(){
      if (Template.instance().StuCtuSelected.get()) {
        return true;
      } else {
        return false;
      }
    }
    // ctuType(){
    //   console.log('CTU == '+Template.instance().stuCtuType.get());
    //   if (Template.instance().stuCtuType.get() == 'CTU') {
    //     return true;
    //   }else {
    //     return false;
    //   }
    // }
});

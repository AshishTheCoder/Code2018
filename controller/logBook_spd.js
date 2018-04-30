import {ReactiveVar} from 'meteor/reactive-var';

Template.logBook_spd.onCreated(function helloOnCreated() {
    this.viewValue = new ReactiveVar;
    this.allEntityNames = new ReactiveVar;
    this.dueDateSet = new ReactiveVar;
    this.rateValue = new ReactiveVar;
    this.unitsValue = new ReactiveVar;
    this.shortPaymentValue = new ReactiveVar;
    this.financialYearArrAsYearSelected = new ReactiveVar;
});

Template.logBook_spd.rendered = function() {
    SessionStore.set("isLoading", false);
    $("#logBook_spd_form").validate({
        rules: {
            nameOfEntity: {
                required: true
            },
            invoiceNumber: {
                required: true
            },
            dateOfReceipt: {
                required: true
                // date: true
            },
            dueDate: {
                required: true
            },
            month: {
                required: true
            },
            year: {
                required: true
            },
            rate: {
                required: true,
                number: true
            },
            billedUnits: {
                required: true,
                number: true
            },
            invoiceAmount: {
                required: true,
                number: true
            },
            paymentMode: {
                number: true
            },
            shortPaymentDone: {
                number: true
            },
            financial_year: {
                required: true
            },
            invoice_type: {
                required: true
            },
            scheme: {
                required: true
            }
        },
        messages: {
            nameOfEntity: {
                required: 'Please enter name of entity'
            },
            invoiceNumber: {
                required: 'Please enter invoice number'
            },
            dateOfReceipt: {
                required: 'Please enter date of receipt'
            },
            dueDate: {
                required: 'Please enter due date'
            },
            month: {
                required: 'Please select month'
            },
            year: {
                required: 'Please select year'
            },
            billedUnits: {
                required: 'Please enter unit',
                number: 'Please enter valid unit'
            },
            rate: {
                required: 'Please enter rate',
                number: 'Please enter valid rate'
            },
            invoiceAmount: {
                required: 'Please enter invoice amount',
                number: 'Please enter valid invoice Amount'
            },
            paymentMode: {
                number: 'Please enter valid Payment Amount'
            },
            shortPaymentDone: {
                required: 'Please enter short payment done',
                number: 'Please enter valid short payment done'
            },
            dateOfPayment: {
                required: 'Please enter date of payment'
            },
            financial_year: {
                required: 'Please select financial year'
            },
            invoice_type: {
                required: 'Please select invoice type'
            },
            scheme: {
                required: 'Please select scheme'
            }
        }
    });

    $('.selectDate').datepicker({format: 'dd-mm-yyyy', autoclose: true});
};

Template.logBook_spd.events({
    "change #ddlScheme": function(e, instance) {
      var scheme = $(e.currentTarget).val();
      $('#txtSelectMonth').val('');
      $('#txtFinancialYear').val('');
      $('#ddlNameOfEntity').val('');
      instance.unitsValue.set();
      instance.shortPaymentValue.set();
      instance.allEntityNames.set();
      instance.financialYearArrAsYearSelected.set();
      if (scheme != '') {
        SessionStore.set("isLoading", true);
        Meteor.call("callEntityDetails",scheme, function(error, result) {
            if (error) {
                SessionStore.set("isLoading", false);
                swal("Please try again");
            } else {
                if (result.status) {
                    SessionStore.set("isLoading", false);
                    instance.allEntityNames.set(result.data);
                }
            }
        });
      }
    },
    "change #ddlNameOfEntity": function(e, instance) {
      $('#txtSelectMonth').val('');
      $('#ddlYear').val('');
      $('#txtFinancialYear').val('');
      instance.unitsValue.set();
      instance.shortPaymentValue.set();
      instance.financialYearArrAsYearSelected.set();
    },
    "change #txtSelectMonth": function(e, instance) {
      $('#ddlYear').val('');
      $('#txtFinancialYear').val('');
      instance.unitsValue.set();
      instance.shortPaymentValue.set();
      instance.financialYearArrAsYearSelected.set();
    },
    "change .entity": function(e, instance) {
        instance.unitsValue.set('');
        instance.rateValue.set();
        instance.financialYearArrAsYearSelected.set();
        // if ($(e.currentTarget).val()) {
            // var spdId = $(".entity").find(':selected').attr("clientId");
            // Meteor.call("selectedEntityDetails", spdId, function(error, result) {
            //     if (error) {
            //         swal("Please try again!");
            //     } else {
            //         if (result.status) {
            //             instance.rateValue.set(result.data);
            //         }
            //     }
            // });
        // }
    },
    "change #ddlYear": function(e, instance) {
      var year = $(e.currentTarget).val();
      instance.financialYearArrAsYearSelected.set();
      var financialYearArr = [];
      if (year != '') {
        var fin = (Number(year) -1) +'-'+year;
        var fin1 = year+'-'+ (Number(year) + 1);
        financialYearArr.push(fin);
        financialYearArr.push(fin1);
        instance.financialYearArrAsYearSelected.set(financialYearArr);
      }
    },
    "change .financialYear": function(e, instance) {
        instance.shortPaymentValue.set();
        var invoiceType = $('#ddlInvoiceType').val();
        if ($(e.currentTarget).val() != '') {
          if (invoiceType != '') {
            var spdId = $("#ddlNameOfEntity").find(':selected').attr("clientId");
            Meteor.call("callSpdJmrUnits", spdId, $('.selectMonth').val(), $(e.currentTarget).val(),invoiceType, function(error, result) {
                if (error) {
                    swal("Please try again!");
                } else {
                    if (result.status) {
                      var data =  result.data;
                      if (data.dataFrom == 'Data Not Found') {
                        instance.unitsValue.set(result.data);
                        swal('JMR Not Submitted!');
                      }else {
                        instance.unitsValue.set(result.data);
                      }
                    }
                }
            });
          }else {
            swal('Please select invoice type!');
          }
        }
    },
    "change #dateInvoice": function() {
        if ($('#dateInvoice').val()) {
            var date = $('#dateInvoice').val();
            myDate = date.split('-');
            var toChange = myDate[2] + '-' + myDate[1] + '-' + myDate[0];
            var momentDate = moment(toChange);
            var spdId = $(".entity").find(':selected').attr("clientId");
            if (spdId == 'EtQ85p78P6dpMDdWZ') {
              var dateHello = momentDate.add(75, 'days');
            }else {
              var dateHello = momentDate.add(60, 'days');
            }
            var dueDate = moment(dateHello).format('DD-MM-YYYY');
            Template.instance().dueDateSet.set(dueDate);
        }
    },
    'keyup #txtPaymentAmount': function(e, instance) {
      var invoiceAmount = $('#txtInvoiceAmount').val();
      var paymentAmount = $(e.currentTarget).val();
      if (invoiceAmount != '' && paymentAmount != '') {
        var shortPayment = Number(Number(invoiceAmount) - Number(paymentAmount)).toFixed(2);
        instance.shortPaymentValue.set(Number(shortPayment));
      }else {
        instance.shortPaymentValue.set();
      }
    },
    'keyup #txtLogBookUnit': function(e, instance) {
      var unitVar = $(e.currentTarget).val();
      var invoiceAmount = $('#txtLogBookRate').val();
      if (unitVar != '' && invoiceAmount != '') {
        var invoiceAmountVar = Number(Number(unitVar) * Number(invoiceAmount)).toFixed(3);
        var data = instance.unitsValue.get();
        data.billedUnits = unitVar;
        data.invoiceAmount = invoiceAmountVar;
        instance.unitsValue.set(data);
      }
    },
    'keyup #txtLogBookRate': function(e, instance) {
      var invoiceRate = $(e.currentTarget).val();
      var unitVar = $('#txtLogBookUnit').val();
      if (unitVar != '' && invoiceRate != '') {
        var invoiceAmountVar = Number(Number(unitVar) * Number(invoiceRate)).toFixed(3);
        var data = instance.unitsValue.get();
        data.rate = invoiceRate;
        data.invoiceAmount = invoiceAmountVar;
        instance.unitsValue.set(data);
      }
    },
    "submit form#logBook_spd_form": function(e, instance) {
        e.preventDefault();
        var logbook_spd = '{';
        $("input.logBook_spd_form,select.logBook_spd_form").each(function(value, element) {
            logbook_spd += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        logbook_spd = $.parseJSON(logbook_spd.replace(/,\s*$/, '') + '}');
        var paymentAmount = $('#txtPaymentAmount').val();
        if (paymentAmount != '') {
          if (paymentAmount.match(/^[0-9]*\.?[0-9]*$/)) {} else {
              swal("Oops...", "Amount paid to developer must be a number!", "error");
              throw new Error("Amount paid to developer must be a number!");
          }
          if (Number(paymentAmount) > 0) {
            if ($('#txtDateOfPayment').val() != '') {
              logbook_spd.paymentMode = paymentAmount;
            }else {
              swal("Please select date of payment!");
              throw new Error("Please select date of payment!");
            }
          }else {
            swal("Amount paid to developer must be greater than zero!");
            throw new Error("Amount paid to developer must be greater than zero!");
          }
        }else {
          logbook_spd.paymentMode = 0;
        }
        logbook_spd.filehref = instance.unitsValue.get().filehref;
        logbook_spd.clientId = $(".entity").find(':selected').attr("clientId");
        logbook_spd.clientState = $(".entity").find(':selected').attr("clientState");
        instance.viewValue.set(logbook_spd);
        swal({
            title: "Are you sure?",
            text: "You want to save SPD Logbook",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#55dd6b",
            confirmButtonText: "Yes, submit it!",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                Meteor.call("saveSpdLogbook", logbook_spd, function(error, result) {
                    if (error) {
                        swal("Please try again !");
                    } else {
                        if (result.status) {
                            $('.logBook_spd_form').each(function() {
                                $(this).val('');
                            });
                            $('#txtPaymentAmount').val('');
                            swal("Submitted!", "Successfully submitted.", "success");
                            instance.shortPaymentValue.set();
                            instance.rateValue.set();
                            instance.unitsValue.set();
                            instance.dueDateSet.set();
                        }else {
                          swal("Already Submitted!",result.message, "error");
                        }
                    }
                });
            }
        });

    },
    "click #preview": function() {
        var instance = Template.instance();
        var logbook_spd = '{';
        $("input.logBook_spd_form,select.logBook_spd_form").each(function(value, element) {
            logbook_spd += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
        });
        logbook_spd = $.parseJSON(logbook_spd.replace(/,\s*$/, '') + '}');
        instance.viewValue.set(logbook_spd);
    }
});
Template.logBook_spd.helpers({
    getMonthValue(monthIndex) {
        if (monthIndex) {
            return monthInWords(monthIndex);
        }
    },
    fileAvailability() {
        if (Template.instance().unitsValue.get()) {
            if (Template.instance().unitsValue.get().filehref) {
                return true;
            } else {
                return false;
            }
        }
    },
    retUnitAndInvoice() {
        if (Template.instance().unitsValue.get()) {
            return Template.instance().unitsValue.get();
        }
    },
    retUnitAndInvoiceForAmount() {
      if (Template.instance().unitsValue.get()) {
          return Template.instance().unitsValue.get();
      }
    },
    dateOfReceipt() {
      if (Template.instance().unitsValue.get()) {
        if (Template.instance().unitsValue.get().dataFrom == 'LogBookSpd') {
            return Template.instance().unitsValue.get().dateOfReceipt;
        }else {
          return false;
        }
      }else {
        return false;
      }
    },
    dateOfReceiptReadOnly() {
      if (Template.instance().unitsValue.get()) {
        if (Template.instance().unitsValue.get().dataFrom == 'LogBookSpd') {
            return 'disabled';
        }
      }
    },
    dueDateData() {
        if (Template.instance().unitsValue.get()) {
          if (Template.instance().unitsValue.get().dataFrom == 'LogBookSpd') {
              return Template.instance().unitsValue.get().dueDate;
          }else {
            return Template.instance().dueDateSet.get();
          }
        }else if (Template.instance().dueDateSet.get()) {
            return Template.instance().dueDateSet.get();
        } else {
            return "Due Date of Payment";
        }
    },

    retAsPerId() {
        if (Template.instance().rateValue.get()) {
            return Template.instance().rateValue.get().rate;
        }else {
          return '';
        }
    },
    userDetails() {
        if (Template.instance().allEntityNames.get()) {
            return Template.instance().allEntityNames.get();
        }
    },
    "shortPaymentHel": function() {
      if (Template.instance().shortPaymentValue.get()) {
        return Template.instance().shortPaymentValue.get();
      }else {
        return '0';
      }
    },
    "monthReturn": function() {
        return monthReturn();
    },
    "viewValue": function() {
        return Template.instance().viewValue.get();
    },
    returnYearHelper() {
        return yearReturn();
    },
    financialYearArrHelper() {
      if (Template.instance().financialYearArrAsYearSelected.get()) {
        return Template.instance().financialYearArrAsYearSelected.get();
      }else {
        return false;
      }
    },
    "returnSchemes": function() {
      var data = Schemes.find().fetch();
      return data;
    },
});

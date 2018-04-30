Template.credit_debit.rendered = function () {
    SessionStore.set("isLoading",false);
    SessionStore.set('credit_debit_redio_view', false);
};
Template.credit_debit.events({
    "focus #fromdate": function() {
        $('#fromdate').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        });
    },
    "focus #todate": function() {
        $('#todate').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        });
    },
     "focus #fromdate2": function() {
        $('#fromdate2').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        });
    },
    "focus #fromto2": function() {
        $('#fromto2').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true
        });
    },
    'click #submit': function (e) {
        e.preventDefault();
        if ($("#fromdate").val() == '')
        {
            swal("Please enter from date");
        } else if ($("#todate").val() == '') {
            swal("Please enter to date");
        } else {
            swal("Fields are filled");
        }
    },
    "click #submitForm2": function (e) {
        e.preventDefault();
        if ($("#fromdate2").val() == '' || $("#fromto2").val() == '' || $("#remarks").val() == '' || $("#upload").val() == '')
        {
            swal("All fields are required");
        } else {
            swal("Fields are filled");
        }
    },
    // id of the redio button
    "change #inlineRadio": function (e, t) {
        var credit_debit = $(e.currentTarget).val();
        SessionStore.set("credit_debit_redio_view", credit_debit);
        console.log(credit_debit);
    }
});
Template.credit_debit.helpers({
    'rediobuttonofpaymentclicked': function () {
        if (SessionStore.get("credit_debit_redio_view") === "CreditDebit")
        {
            return true;
        } else {
            return false;
        }
    }
});

Template.individulaStatus.rendered = function() {
  SessionStore.set("isLoading",false);
    $("#individula").validate({
        rules: {
            fromdate: {
                required: true,
                date: true
            },
            todate: {
                required: true,
                date: true
            },
            inlineRadioOptions: {
                required: true

            },
            FieldRequired: {
                required: true
            }
        },
        messages: {
            fromdate: {
                required: 'Please enter the start date'
            },
            todate: {
                required: 'Please enter the end date'
            },
            inlineRadioOptions: {
                required: 'Kindly select any input'
            },
            FieldRequired: {
                required: 'Please select any input'
            }

        }
    });
};

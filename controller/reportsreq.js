Template.reportsRequirement.rendered = function () {
  SessionStore.set("isLoading",false);
    $("#reportrs").validate({
        rules: {
            from: {
                required: true,
                date: true
            },
            to: {
                required: true,
                date: true
            },
            inlineRadioOptions: {
                required: true
            },
            Spd: {
                required: true
            },
            Discom: {
                required: true
            },
            State: {
                required: true
            }
        },
        messages: {
            from: {
                required: 'Please fill the start date'
            },
            to: {
                required: 'Please fill the end date'
            },
            inlineRadioOptions: {
                required: 'Kindly select input'
            },
            Spd: {
                required: 'Please select Spd'
            },
            Discom: {
                required: 'Please select Discom'
            },
            State: {
                required: 'Please select state'
            }

        }
    });
};

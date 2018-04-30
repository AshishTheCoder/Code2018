Meteor.methods({
    "extraChargesSubmitDetails": function (extraChargesSubmitDetails) {
        if (validateJson(extraChargesSubmitDetails) === true) {
            // Registerddd.insert(extraChargesSubmitDetails);
            return returnSuccess('Successfully Submited');
        } else {
            return returnSuccess('All Fields Are Required ');
        }
    }
  });

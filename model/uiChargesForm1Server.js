Meteor.methods({
  uiTableData: function(e) {
        UIChargesDataDetails.insert(e);
        return 'Successfully Submited';
    }
});

Meteor.methods({
  getPaymentAdviceGeneratedBySECI(month, fyear){
    var spdId = Meteor.userId();
    if (month == 'All') {
      var getData = EnergyPaymentAdvice.find({spdId:spdId,financial_year:fyear}).fetch();
    }else {
      var getData = EnergyPaymentAdvice.find({spdId:spdId,financial_year:fyear, month:month}).fetch();
    }
    if (getData.length > 0) {
      return returnSuccess('Payment Advice Received!',getData);
    }else {
      return returnFaliure('Payment advice not genrated!');
    }
  }
});

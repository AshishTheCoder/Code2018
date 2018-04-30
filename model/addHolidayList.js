Meteor.methods({
  manageSECiHolidayList(selectedDate,holidayName, docId){
    var splitDate = selectedDate.split("-");
    var month = splitDate[1]
    var year = splitDate[2]
    SeciHolidaysDetails.upsert({
          // Selector
          _id : docId,
      }, {
          // Modifier
          $set: {
              date : selectedDate,
              month : month,
              year : year,
              name : holidayName,
              timestamp: new Date() // no comma needed here
          }
      });
    return returnSuccess('Holiday Added Successfully!');
  }
});

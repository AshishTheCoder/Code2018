returnSuccess = function(msg, data) {
    if (msg === undefined) {
        msg = "The call succeeded. Cheers!";
    }
    var returnValue = {
        status: true,
        message: msg,
        data: data
    };
    console.log(msg);
    return returnValue;
};

returnFaliure = function(msg, data) {
    if (msg === undefined) {
        msg = "The call succeeded. Cheers!";
    }
    var returnValue = {
        status: false,
        message: msg,
        data: data
    };
    console.log(msg);
    return returnValue;
};

checkSECIholidaysORWeakEnd = function() {
  var currentDate = moment().format('DD-MM-YYYY');
  var todayDay = moment().format('dddd');
  var checkHoliday = SeciHolidaysDetails.find({date:currentDate}).fetch();
  if (checkHoliday.length == 0) {
    if (todayDay == 'Monday' || todayDay == 'Tuesday' || todayDay == 'Wednesday' || todayDay == 'Thursday' || todayDay == 'Friday') {
      flag = 'working';
    }else {
      flag = 'weakend';
    }
  }else {
    flag = 'holiday';
  }
  return flag;
};

loggedInUserState = function(userType, state){
  var flag = false;
  if (userType == 'SPD') {
    // it will set "MP" when mp avaiblity will start
    if (Meteor.user().profile.registration_form.spd_state == 'MP') {
      flag = true;
    }
  }else if (userType == 'Other') {
    if (state == 'MP') {
      flag = true;
    }
  }
  return flag;
};

returnHelper = function(array, index, loopBig) {
    if (array) {
        return Number(array[loopBig][index]);
    }
}
returningColoum = function(array, index) {
    if (array) {
        return Number(array[index]);
    }
}

dynamicMonth =  function() {
  var returnArr = [];
  var monthArr = [
      {key: "January",value: "01"},
      {key: "February",value: "02"},
      {key: "March",value: "03"},
      {key: "April",value: "04"},
      {key: "May",value: "05"},
      {key: "June",value: "06"},
      {key: "July",value: "07"},
      {key: "August",value: "08"},
      {key: "September",value: "09"},
      {key: "October",value: "10"},
      {key: "November",value: "11"},
      {key: "December",value: "12"}
    ];
  var currentMonth = Number(moment().format('MM'));
  monthArr.forEach(function(item) {
    if (Number(item.value) <= currentMonth) {
      var json = {key:item.key,value:item.value};
      returnArr.push(json);
    }
  });
  return returnArr;
}

dynamicYear =  function() {
  var yearArr = [];
    var currentYear = Number(moment().format('YYYY'));
  for (var i = 2016; i <= Number(currentYear); i++) {
    yearArr.push(i);
  }
  return yearArr;
}

dynamicFinancialYear =  function() {
  var financialYearArr = [];
  var currentMonth = moment().format('MM');
  if (Number(currentMonth) < 4) {
    var currentYear = Number(moment().format('YYYY'));
  }else {
    var currentYear = Number(moment().format('YYYY')) + 1;
  }
  for (var i = 2016; i < Number(currentYear); i++) {
    var currentYr = i;
    var nextYr = Number(currentYr) + 1;
    var financialYear = currentYr+'-'+nextYr;
    financialYearArr.push(financialYear);
  }
  return financialYearArr;
}

getCurrentFinancialYear =  function() {
  var currentYear = moment().format('YYYY');
  var currentMonth = moment().format('MM');
  if (Number(currentMonth) < 4) {
    var financialYear = Number(Number(currentYear) - 1)+'-'+currentYear;
  }else {
    var financialYear = currentYear+'-'+Number(Number(currentYear) + 1);
  }
  return financialYear;
}

getFinancialYearByMonthAndYear =  function(month, year) {
  var currentYear = year;
  var currentMonth = month;
  if (Number(currentMonth) < 4) {
    var financialYear = Number(Number(currentYear) - 1)+'-'+currentYear;
  }else {
    var financialYear = currentYear+'-'+Number(Number(currentYear) + 1);
  }
  return financialYear;
}

// ----------For JSON--------- //

validateJson = function(jsonData) {
    var returnType = '';
    for (var prop in jsonData) {
        if (typeof jsonData[prop] === 'object') {
            jsonData[prop].forEach(function(ex) {
                for (var de in ex) {
                    if (ex[de] === '') {
                        returnType = 'Blank';
                    }
                }
            });
        } else {
            if (jsonData[prop] === '') {
                returnType = 'Blank';
            }
        }
    }
    if (returnType !== 'Blank') {
        return true;
    } else {
        return false;
    }
};

am_pm_to_hours = function(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10)
        sHours = "0" + sHours;
    if (minutes < 10)
        sMinutes = "0" + sMinutes;
    return (sHours + ':' + sMinutes);
}

numberOfdaysInMonth = function(month, year) {
    var date = new Date(year, month - 1, 1);
    var result = [];
    var dateArr = [];

    while (date.getMonth() == month - 1) {
        var update = date.getDate() + "-" + month + "-" + year;
        var newDate = update.split("-");
        var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
        dateArr.push(myObject);
        date.setDate(date.getDate() + 1);
    }
    var firstDate = dateArr[0];
    var lastDate = dateArr[Number(dateArr.length - 1)];
    var NumberOfDays = moment(lastDate).format('DD');
    return NumberOfDays;
}


monthReturn = function() {
        var month = [{
            key: "January",
            value: "01"
        }, {
            key: "February",
            value: "02"
        }, {
            key: "March",
            value: "03"
        }, {
            key: "April",
            value: "04"
        }, {
            key: "May",
            value: "05"
        }, {
            key: "June",
            value: "06"
        }, {
            key: "July",
            value: "07"
        }, {
            key: "August",
            value: "08"
        }, {
            key: "September",
            value: "09"
        }, {
            key: "October",
            value: "10"
        }, {
            key: "November",
            value: "11"
        }, {
            key: "December",
            value: "12"
        }];
        return month;
    },

    timeSlotToIndex = function(timeBlock) {
        timeSlot = timeBlock.substr(-5);
        for (i = 0; i < arrTimeSlot.length; i++) {
            if (arrTimeSlot[i].time_slot === timeSlot) {
                return i;
            }
        }
        return false;
    }

mySlotFunction = function() {
    arrTimeSlotGet = [
        "00:00",
        "00:15",
        "00:30",
        "00:45",
        "01:00",
        "01:15",
        "01:30",
        "01:45",
        "02:00",
        "02:15",
        "02:30",
        "02:45",
        "03:00",
        "03:15",
        "03:30",
        "03:45",
        "04:00",
        "04:15",
        "04:30",
        "04:45",
        "05:00",
        "05:15",
        "05:30",
        "05:45",
        "06:00",
        "06:15",
        "06:30",
        "06:45",
        "07:00",
        "07:15",
        "07:30",
        "07:45",
        "08:00",
        "08:15",
        "08:30",
        "08:45",
        "09:00",
        "09:15",
        "09:30",
        "09:45",
        "10:00",
        "10:15",
        "10:30",
        "10:45",
        "11:00",
        "11:15",
        "11:30",
        '11:45',
        '12:00',
        '12:15',
        '12:30',
        '12:45',
        '13:00',
        "13:15",
        "13:30",
        "13:45",
        "14:00",
        "14:15",
        "14:30",
        "14:45",
        "15:00",
        "15:15",
        "15:30",
        "15:45",
        "16:00",
        "16:15",
        "16:30",
        "16:45",
        "17:00",
        "17:15",
        "17:30",
        "17:45",
        "18:00",
        "18:15",
        "18:30",
        "18:45",
        "19:00",
        "19:15",
        "19:30",
        "19:45",
        "20:00",
        "20:15",
        "20:30",
        "20:45",
        "21:00",
        "21:15",
        "21:30",
        "21:45",
        "22:00",
        "22:15",
        "22:30",
        "22:45",
        "23:00",
        "23:15",
        "23:30",
        "23:45",
        '24:00'
    ];
    return arrTimeSlotGet
}



arrTimeSlot = [
    {
      "_id": 0,
      "time_slot": "00:00"
  }, {
      "_id": 1,
      "time_slot": "00:15"
  }, {
      "_id": 2,
      "time_slot": "00:30"
  }, {
      "_id": 3,
      "time_slot": "00:45"
  }, {
      "_id": 4,
      "time_slot": "01:00"
  }, {
      "_id": 5,
      "time_slot": "01:15"
  }, {
      "_id": 6,
      "time_slot": "01:30"
  }, {
      "_id": 7,
      "time_slot": "01:45"
  }, {
      "_id": 8,
      "time_slot": "02:00"
  }, {
      "_id": 9,
      "time_slot": "02:15"
  }, {
      "_id": 10,
      "time_slot": "02:30"
  }, {
      "_id": 11,
      "time_slot": "02:45"
  }, {
      "_id": 12,
      "time_slot": "03:00"
  }, {
      "_id": 13,
      "time_slot": "03:15"
  }, {
      "_id": 14,
      "time_slot": "03:30"
  }, {
      "_id": 15,
      "time_slot": "03:45"
  }, {
      "_id": 16,
      "time_slot": "04:00"
  }, {
      "_id": 17,
      "time_slot": "04:15"
  }, {
      "_id": 18,
      "time_slot": "04:30"
  }, {
      "_id": 19,
      "time_slot": "04:45"
  }, {
      "_id": 20,
      "time_slot": "05:00"
  }, {
      "_id": 21,
      "time_slot": "05:15"
  }, {
      "_id": 22,
      "time_slot": "05:30"
  }, {
      "_id": 23,
      "time_slot": "05:45"
  }, {
      "_id": 24,
      "time_slot": "06:00"
  }, {
      "_id": 25,
      "time_slot": "06:15"
  }, {
      "_id": 26,
      "time_slot": "06:30"
  }, {
      "_id": 27,
      "time_slot": "06:45"
  }, {
      "_id": 28,
      "time_slot": "07:00"
  }, {
      "_id": 29,
      "time_slot": "07:15"
  }, {
      "_id": 30,
      "time_slot": "07:30"
  }, {
      "_id": 31,
      "time_slot": "07:45"
  }, {
      "_id": 32,
      "time_slot": "08:00"
  }, {
      "_id": 33,
      "time_slot": "08:15"
  }, {
      "_id": 34,
      "time_slot": "08:30"
  }, {
      "_id": 35,
      "time_slot": "08:45"
  }, {
      "_id": 36,
      "time_slot": "09:00"
  }, {
      "_id": 37,
      "time_slot": "09:15"
  }, {
      "_id": 38,
      "time_slot": "09:30"
  }, {
      "_id": 39,
      "time_slot": "09:45"
  }, {
      "_id": 40,
      "time_slot": "10:00"
  }, {
      "_id": 41,
      "time_slot": "10:15"
  }, {
      "_id": 42,
      "time_slot": "10:30"
  }, {
      "_id": 43,
      "time_slot": "10:45"
  }, {
      "_id": 44,
      "time_slot": "11:00"
  }, {
      "_id": 45,
      "time_slot": "11:15"
  }, {
      "_id": 46,
      "time_slot": "11:30"
  }, {
      "_id": 47,
      "time_slot": "11:45"
  }, {
      "_id": 48,
      "time_slot": "12:00"
  }, {
      "_id": 49,
      "time_slot": "12:15"
  }, {
      "_id": 50,
      "time_slot": "12:30"
  }, {
      "_id": 51,
      "time_slot": "12:45"
  }, {
      "_id": 52,
      "time_slot": "13:00"
  }, {
      "_id": 53,
      "time_slot": "13:15"
  }, {
      "_id": 54,
      "time_slot": "13:30"
  }, {
      "_id": 55,
      "time_slot": "13:45"
  }, {
      "_id": 56,
      "time_slot": "14:00"
  }, {
      "_id": 57,
      "time_slot": "14:15"
  }, {
      "_id": 58,
      "time_slot": "14:30"
  }, {
      "_id": 59,
      "time_slot": "14:45"
  }, {
      "_id": 60,
      "time_slot": "15:00"
  }, {
      "_id": 61,
      "time_slot": "15:15"
  }, {
      "_id": 62,
      "time_slot": "15:30"
  }, {
      "_id": 63,
      "time_slot": "15:45"
  }, {
      "_id": 64,
      "time_slot": "16:00"
  }, {
      "_id": 65,
      "time_slot": "16:15"
  }, {
      "_id": 66,
      "time_slot": "16:30"
  }, {
      "_id": 67,
      "time_slot": "16:45"
  }, {
      "_id": 68,
      "time_slot": "17:00"
  }, {
      "_id": 69,
      "time_slot": "17:15"
  }, {
      "_id": 70,
      "time_slot": "17:30"
  }, {
      "_id": 71,
      "time_slot": "17:45"
  }, {
      "_id": 72,
      "time_slot": "18:00"
  }, {
      "_id": 73,
      "time_slot": "18:15"
  }, {
      "_id": 74,
      "time_slot": "18:30"
  }, {
      "_id": 75,
      "time_slot": "18:45"
  }, {
      "_id": 76,
      "time_slot": "19:00"
  }, {
      "_id": 77,
      "time_slot": "19:15"
  }, {
      "_id": 78,
      "time_slot": "19:30"
  }, {
      "_id": 79,
      "time_slot": "19:45"
  }, {
      "_id": 80,
      "time_slot": "20:00"
  }, {
      "_id": 81,
      "time_slot": "20:15"
  }, {
      "_id": 82,
      "time_slot": "20:30"
  }, {
      "_id": 83,
      "time_slot": "20:45"
  }, {
      "_id": 84,
      "time_slot": "21:00"
  }, {
      "_id": 85,
      "time_slot": "21:15"
  }, {
      "_id": 86,
      "time_slot": "21:30"
  }, {
      "_id": 87,
      "time_slot": "21:45"
  }, {
      "_id": 88,
      "time_slot": "22:00"
  }, {
      "_id": 89,
      "time_slot": "22:15"
  }, {
      "_id": 90,
      "time_slot": "22:30"
  }, {
      "_id": 91,
      "time_slot": "22:45"
  }, {
      "_id": 92,
      "time_slot": "23:00"
  }, {
      "_id": 93,
      "time_slot": "23:15"
  }, {
      "_id": 94,
      "time_slot": "23:30"
  }, {
      "_id": 95,
      "time_slot": "23:45"
  }, {
      "_id": 96,
      "time_slot": "24:00"
  }
];

monthInWords = function(monthSelected) {
   var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   var monthSelect = Number(monthSelected);
   return dateArr[monthSelect - 1];
};

sumOfArray = function(array) {
    var sum = _.reduce(array, function(memo, num) {
        return Number(memo) + Number(num);
    }, 0)
    return sum;
}

yearReturn = function() {
    var year = [
        {
            key: "2016",
            value: "2016"
        }, {
            key: "2017",
            value: "2017"
        }, {
            key: "2018",
            value: "2018"
        }, {
            key: "2019",
            value: "2019"
        }, {
            key: "2020",
            value: "2020"
        }, {
            key: "2021",
            value: "2021"
        }
    ];
    return year;
}

authorisedSignature = function() {
    var signature = [
        {
            name: "Atulya Kumar Naik",
            designation: "Addl. General Manager (PS)",
            full_form:"Additional General Manager (Power Systems)",
            phone:"011-71989214"
        }, {
            name: "Shibasish Das",
            designation: "Manager (PS)",
            full_form:"Manager (Power Systems)",
            phone:"011-71989214"
        }, {
            name: "Avnish Parashar",
            designation: "Manager (PS)",
            full_form:"Manager (Power Systems)",
            phone:"011-71989214"
        }
    ];
    return signature;
}

monthInWordsShort = function(monthSelected) {
  var dateArr = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
   var monthSelect = Number(monthSelected);
   return dateArr[monthSelect - 1];
};
getPeriodFromDate = function(date) {
  var dateArr = date.split("-");
  var dateObj = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
  var getPeriod = moment(dateObj).format("MMMM'YY");
  return getPeriod;
};

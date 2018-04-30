Meteor.methods({
    spdTicketRaising(date, query) {
        var spdId = Meteor.userId();
        var spdNameVar = Meteor.user().profile.registration_form.name_of_spd;
        var month = moment().format('MM');
        var year = moment().format('YYYY');
        var todayDate = moment().format('DD-MM-YYYY');
        var ticketNo = Math.floor((Math.random() * 10000) + 1).toString();
        var json = {
            spdId: spdId,
            spdName: spdNameVar,
            ticket_no: ticketNo,
            date: todayDate,
            query: query,
            month: month,
            year: year,
            status: 'Open',
            action_date: '',
            commentedBySeci :'',
            timestamp : new Date()
        };
        TicketDetails.insert(json);
        return returnSuccess('Ticket Raised Successfully to SECI', ticketNo);
    },
    getTicketStatus(spdId, status){
      if (Meteor.user().profile.user_type == 'spd') {
        var spdId = Meteor.userId();
        var ticketData = TicketDetails.find({spdId:spdId}).fetch();
      }else {
        if (spdId != '') {
          if (status != 'All') {
            var ticketData = TicketDetails.find({spdId:spdId, status:status}).fetch();
          }else {
            var ticketData = TicketDetails.find({spdId:spdId}).fetch();
          }
        }else {
          if (status != 'All') {
            var ticketData = TicketDetails.find({status:status}).fetch();
          }else {
            var ticketData = TicketDetails.find().fetch();
          }
        }
      }
      if (ticketData.length > 0) {
        return returnSuccess('Ticket Status', ticketData);
      }else {
        return returnFaliure('Tickets not available!');
      }
    },
    getTicketStatusBySearch(type, json, spdId, status){
      if (Meteor.user().profile.user_type == 'spd') {
        var spdId = Meteor.userId();
        if (type == 'Ticket Number') {
          var ticketData = TicketDetails.find({spdId:spdId, 'ticket_no':{'$regex':json.ticketNo}}).fetch();
        }else if (type == 'Year') {
          var ticketData = TicketDetails.find({spdId:spdId, year:json.year}).fetch();
        }else if (type == 'Month') {
          if (json.year != '') {
            var ticketData = TicketDetails.find({spdId:spdId, month:json.month, year:json.year}).fetch();
          }else {
            var ticketData = TicketDetails.find({spdId:spdId, month:json.month}).fetch();
          }
        }
      }else {
        if (type == 'Ticket Number') {
          var json = {'ticket_no':{'$regex':json.ticketNo}};
        }else if (type == 'Year') {
          if (spdId != '') {
            if (status != 'All') {
              var json = {spdId:spdId, year:json.year, status:status};
            }else {
              var json = {spdId:spdId, year:json.year};
            }
          }else {
            if (status != 'All') {
              var json = {year:json.year, status:status};
            }else {
              var json = {year:json.year};
            }
          }
        }else if (type == 'Month') {
          if (json.year != '') {
            if (spdId != '') {
              if (status != 'All') {
                var json = {spdId:spdId, month:json.month, year:json.year, status:status};
              }else {
                var json = {spdId:spdId, month:json.month, year:json.year};
              }
            }else {
              if (status != 'All') {
                var json = {month:json.month, year:json.year, status:status};
              }else {
                var json = {month:json.month, year:json.year};
              }
            }

          }else {
            if (spdId != '') {
              if (status != 'All') {
                var json = {spdId:spdId, month:json.month, status:status};
              }else {
                var json = {spdId:spdId, month:json.month}
              }
            }else {
              if (status != 'All') {
                var json = {month:json.month, status:status};
              }else {
                var json = {month:json.month}
              }
            }
          }
        }
        var ticketData = TicketDetails.find(json).fetch();
      }
      if (ticketData.length > 0) {
        return returnSuccess('Ticket Status', ticketData);
      }else {
        return returnFaliure('Tickets not available!');
      }
    },
    getTicketByAdmin(limit){
        var ticketData = [];
        if (Meteor.user().profile.user_type != 'spd') {
           ticketData = TicketDetails.find({}, {
              sort: {
                  $natural: -1
              },
              limit: Number(limit)
          }).fetch();

          var jsonArr = Meteor.users.find({'profile.user_type': 'spd', 'profile.status': 'approved'}).fetch();
          var spdList = [];
          jsonArr.forEach(function(item) {
              spdList.push({Ids:item._id, spdName:item.profile.registration_form.name_of_spd});
          });
          var spdArr = spdList.sort(function(a, b) {
              var nA = a.spdName.toLowerCase();
              var nB = b.spdName.toLowerCase();
              if (nA < nB)
                  return -1;
              else if (nA > nB)
                  return 1;
              return 0;
          });
        }

      if (ticketData.length > 0) {
        var json = {ticketData:ticketData,spdArr:spdArr};
        return returnSuccess('Ticket Status', json);
      }else {
        return returnFaliure('Tickets not available!');
      }
    },
    updateTicketStatus(json){
      var actionDate = moment().format('DD-MM-YYYY');
      TicketDetails.update({_id:json.docId}, {$set : {action_date:actionDate, status:json.status, commentedBySeci:json.comment}});

      var ticketData = TicketDetails.find({}, {
          sort: {
              $natural: -1
          },
          limit: 15
      }).fetch();
      return returnSuccess('Ticket Status', ticketData);
    }
});

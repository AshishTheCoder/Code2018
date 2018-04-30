import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.reciept.onCreated(function ss() {
    this.spdList = new ReactiveVar;
    this.month = new ReactiveVar;
    this.year = new ReactiveVar;
    this.details = new ReactiveVar;
    this.tabularData = new ReactiveVar;
});
Template.reciept.rendered = function() {
SessionStore.set("isLoading",false);
};
Template.reciept.events({
    "change #selectMonth": function(e, instance) {
        instance.tabularData.set(false);
        instance.month.set($(e.currentTarget).val());
    },
    "change #selectYear": function(e, instance) {
        instance.tabularData.set(false);
        instance.year.set($(e.currentTarget).val());
    },
    "change #selectState": function(e, instance) {
        if ($(e.currentTarget).val()) {
            Meteor.call("callRecieptSpds", $(e.currentTarget).val(), function(error, result) {
                if (error) {
                    swal("Server Error");
                } else {
                    if (result.status) {
                        instance.tabularData.set(false);
                        instance.spdList.set(result.data);
                    }
                }
            })
        }
    },
    "change #selectSpd": function(e, instance) {
        instance.tabularData.set(false);
        var month = instance.month.get();
        var year = instance.year.get();
        instance.details.set('');
        if ($(e.currentTarget).val()) {
            Meteor.call("callRecieptSpdsData", $(e.currentTarget).val(), month, year, function(error, result) {
                if (error) {
                    swal("Server Error");
                } else {
                    if (result.status) {
                        instance.details.set(result.data);
                    } else {
                        swal("Data not available");
                    }
                }
            })
        }
    },
    "click #btnSend": function(e, instance) {
        var details = instance.details.get();
        details.reduction = $('#reduction').val();
        details.remark = $('#txtRemark').val();
        if (details.reduction.match(/^[0-9]*\.?[0-9]*$/)) {
          if (Number(details.amount) < Number(details.reduction)){
              instance.tabularData.set(false);
              swal("Released payment cannot be in negative");
          } else {
              details.releasedPayment = (Number(details.amount) - Number(details.reduction)).toFixed(2);
              details.refNo = "SECI/PS/PT 750 MW/" + instance.month.get() + '(' + details.name + ')' + "/SPD/" + instance.year.get();
              instance.details.set(details);
              console.log(details);
              instance.tabularData.set(true);
              $('#close').click();
          }
        }else {
          swal("Enter only digits");
        }
    },
    "click #print": function(e, instance) {
        var doc = new jsPDF();
        var specialElementHandlers = {
            '#editor': function(element, renderer) {
                return true;
            }
        };

        doc.fromHTML($('#content').html(), 15, 15, {
            'width': 170,
            'elementHandlers': specialElementHandlers
        });
        doc.save('sample-file.pdf');

        Meteor.call("saveReciept", instance.details.get(), function(error, result) {
            if (error) {
                swal("Server error");
            } else {
                if (result.status) {
                    swal(result.message);
                }
            }
        })
    }
});
Template.reciept.helpers({
    "spdList": function() {
        return Template.instance().spdList.get();
    },
    "showDetails": function() {
        return Template.instance().details.get();
    },
    "showMonth": function() {
        return Template.instance().month.get();
    },
    "showYear": function() {
        return Template.instance().year.get();
    },
    "disabledButton": function() {
        if (Template.instance().month.get() != '' && Template.instance().year.get() != '') {
            if (Template.instance().details.get()) {
                return "noDisabled";
            } else {
                return "disabled";
            }
        } else {
            return "disabled";
        }
    },
    "showTable": function() {
        return Template.instance().tabularData.get();
    },
    "amountInWords": function(amount) {
        console.log(amount);
        var newChange = amount.split(".");
        if (newChange[1] != "00") {
            var data1 = inWords(newChange[0]);
            var data2 = inWords(newChange[1]);
            return data1 + ' ' + "and" + ' ' + data2 + ' ' + "paise";
        } else {
            var data1 = inWords(newChange[0]);
            return data1 + ' ' + "and" + ' ' + "zero" + ' ' + "paise";
        }
    },
    "yearReturn": function() {
        var year = [];
        for (var i = 2015; i <= 2025; i++) {
            year.push(i);
        }
        return year;
    },
    "monthReturn": function() {
        var month = [{
            key: "January",
            value: "january"
        }, {
            key: "Febuary",
            value: "febuary"
        }, {
            key: "March",
            value: "march"
        }, {
            key: "April",
            value: "april"
        }, {
            key: "May",
            value: "may"
        }, {
            key: "June",
            value: "june"
        }, {
            key: "July",
            value: "july"
        }, {
            key: "August",
            value: "august"
        }, {
            key: "September",
            value: "september"
        }, {
            key: "October",
            value: "october"
        }, {
            key: "November",
            value: "november"
        }, {
            key: "December",
            value: "december"
        }];
        return month;
    },
});


function inWords(num) {
    var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? '' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
};

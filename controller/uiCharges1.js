Template.uiCharges1.onCreated(function abcd() {
    this.arrValue1 = new ReactiveVar('');
    this.arrValue2 = new ReactiveVar('');
    this.sumAmount = new ReactiveVar();
});

Template.uiCharges1.rendered = function() {
  SessionStore.set("isLoading",false);
};

Template.uiCharges1.events({

});

Template.uiCharges1.helpers({
    fromDate: function() {
        return SessionStore.get('sessionFromDate');
    },

    toDate: function() {
        return SessionStore.get('sessionToDate');
    },
    tableWeekDateRange: function() {
        return SessionStore.get('sessionWeekDates');
    },
    dueDate: function(index) {
        var arr1 = [],
            arr2 = [];
        arr1 = SessionStore.get('sessionDueDate');
        arr2 = arr1.slice(index, index + 1);
        var data1 = arr2[0];
        return data1;
    },
    Amount1: function(index) {
        var instance = Template.instance();
        var arr1 = [],
            arr2 = [];
        arr1 = SessionStore.get('sessionAmount1');
        arr2 = arr1.slice(index * 2, index * 2 + 2);
        var data1 = arr2[0];
        return data1;
    },
    Amount2: function(index) {
        var instance = Template.instance();
        var arr1 = [],
            arr2 = [];
        arr1 = SessionStore.get('sessionAmount1');
        arr2 = arr1.slice(index * 2, index * 2 + 2);
        var data2 = arr2[1];
        return data2;
    },
    Sum: function() {
        var arr1 = [];
        arr1 = SessionStore.get('sessionAmount1');
        console.log(arr1);
        var sum = 0;
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] > 0) {
                sum = Number(sum) + Number(arr1[i]);
            }
        }

        var instance = Template.instance();
        instance.sumAmount.set(sum);
        return (sum.toLocaleString());

    },

    weekArrayNo: function() {
        return SessionStore.get('sessionWeekArray');
    },
    currentDate: function() {
        var currentdate = new Date();
        var datevalue = currentdate.toLocaleDateString();
        return datevalue;
    },
    tabledatacollapse: function() {
        return UIChargesDataDetails.find({});
    },
    arrayin: function(index) {
        return index + 1;
    },
    amountInWords: function() {
        var instance = Template.instance();
        var num = instance.sumAmount.get();
        num = num.toString();

        var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
        var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

        if (num.length > 9) {
            return 'overflow';
        }
        var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return;
        var str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
        return str;
    }
});

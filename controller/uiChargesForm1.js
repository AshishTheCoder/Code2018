Template.uiChargesForm1.onCreated(function abcd() {
    this.WeekNo = new ReactiveVar();
    this.DateRange = new ReactiveVar([]);
    this.weekRecVar = new ReactiveVar();
    this.arrayRecVar = new ReactiveVar([]);
    this.generateRecVar = new ReactiveVar(false);

});

Template.uiChargesForm1.rendered = function() {
    SessionStore.set("isLoading", false);
    SessionStore.set('sessionFromDate', '');
    SessionStore.set('sessionToDate', '');
    SessionStore.set('sessionDueDate', []);
    SessionStore.set('sessionAmount1', []);
    SessionStore.set('sessionAmount2', '');
    SessionStore.set('sessionWeekDates', []);
    SessionStore.set('sessionWeekArray', []);
    SessionStore.set('sessionCollapseDataArray', []);
    arr1 = [];
    $(function() {
        $(".uichargesform").datepicker({autoclose: true});
    });
};

Template.uiChargesForm1.events({
    "submit form#collapsedataform": function(e) {
        e.preventDefault();
        var EditDueDate = [];
        var amount_arr = [];
        var data = '{';
        $("input.uichargesform,select.uichargesform").each(function(value, element) {
            if ($(this).attr("type") == 'radio') {
                var value = $('input[name=' + $(this).attr("name") + ']:checked').val();
                data += '"' + $(this).attr("name") + '":"' + value + '",';
            } else {
                data += '"' + $(this).attr("name") + '":"' + $(this).val() + '",';
            }
            if ($(this).attr("key") == "amount") {
                amount_arr.push($(this).val());
            }
            if ($(this).attr("key") == "duedate") {
                EditDueDate.push($(this).val());
            }
        });
        data += '"amount":"' + amount_arr + '",';
        data = $.parseJSON(data.replace(/,\s*$/, '') + '}');
        SessionStore.set('sessionDueDate', EditDueDate);
        SessionStore.set('sessionAmount1', amount_arr);
        Meteor.call("uiTableData", data, function(error, result) {
            if (error) {
                swal("Oops...", "Please try again!", "error");
            } else {
                swal("Data saved successfully");
            }
        });
    },

    "click #bthSaveId": function(e) {
        var instance = Template.instance();
        var data1 = $("#Amount1").val();
        var data2 = $("#Amount2").val();
        var data3 = $("#datetimepicker3").val();
        var data4 = $("#datetimepicker4").val();
        var arr = [];
        arr.push(data1);
        arr.push(data2);
        arr.push(data3);
        arr.push(data4);
        arr1.push(arr);
        instance.arrayRecVar.set(arr1);
    },

    "click #btngoid": function(e, instance) {
        var dateFrom = $("#datetimepicker1").val();
        var dateTo = $("#datetimepicker2").val();
        SessionStore.set('sessionFromDate', dateFrom);
        SessionStore.set('sessionToDate', dateTo);
        var result;
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        var firstDate = new Date($("#datetimepicker1").val());
        var secondDate = new Date($("#datetimepicker2").val());

        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
        if ((diffDays) % 6 == 0) {
            result = diffDays / 6;
            instance.WeekNo.set(result);
        } else if ((diffDays % 6) != 0) {
            result = Math.trunc(diffDays / 6) + 1;
            instance.WeekNo.set(result);
        }
        instance.generateRecVar.set(true);
    },
    "click .collapse1": function() {
        var secondDate = new Date($("#datetimepicker2").val());
        if ($(".uichargesDueDate").val() == '') {
            var dueDate = new Date(secondDate.setMonth(secondDate.getMonth() + 2));
            var dd = dueDate.getDate();
            var mm = dueDate.getMonth() + 1;
            var yyyy = dueDate.getFullYear();
            var NewDate = mm + '/' + dd + '/' + yyyy;
            $(".uichargesform2").val(NewDate);
        }
    },
    "click .collapse": function() {
        $(function() {
            $(".uichargesform1").datepicker({autoclose: true});
        });
        $(function() {
            $(".uichargesform2").datepicker({autoclose: true});
        });
    }
});

Template.uiChargesForm1.helpers({
    NumberOfWeeks: function() {
        return Template.instance().WeekNo.get();
    },
    CollapseDiv: function() {
        var value = Template.instance().WeekNo.get();
        var firstDateEx = new Date($("#datetimepicker1").val());
        var secondDateEx = new Date($("#datetimepicker2").val());
        var instance = Template.instance();
        var a = [];

        for (var i = 1; i <= value; i++) {
            var currentDateEx = new Date(firstDateEx);
            if (i == 1) {
                var d1 = firstDateEx.getDate();
                var m1 = firstDateEx.getMonth() + 1;
                var yyy1 = firstDateEx.getFullYear();
                var NewDate0 = m1 + '/' + d1 + '/' + yyy1;

                currentDateEx = new Date(currentDateEx.setDate(currentDateEx.getDate() + (6 * i)));
                currentDateTr = new Date(currentDateEx);
                var dd1 = currentDateEx.getDate();
                var mm1 = currentDateEx.getMonth() + 1;
                var yyyy1 = currentDateEx.getFullYear();
                var NewDate1 = mm1 + '/' + dd1 + '/' + yyyy1;
                var NewDateRange = NewDate0 + " " + 'To' + " " + NewDate1;
                a.push(NewDateRange);
            }
            if (i != 1) {
                currentDateEx = new Date(currentDateEx.setDate(currentDateEx.getDate() + ((6 * i) + (i - 1))));
                var dd1 = currentDateEx.getDate();
                var mm1 = currentDateEx.getMonth() + 1;
                var yyyy1 = currentDateEx.getFullYear();
                var NewDate2 = mm1 + '/' + dd1 + '/' + yyyy1;
                var currentDateEx2 = new Date(currentDateTr.setDate(currentDateTr.getDate() + 1));
                var dd2 = currentDateEx2.getDate();
                var mm2 = currentDateEx2.getMonth() + 1;
                var yyyy2 = currentDateEx2.getFullYear();
                var NewDate3 = mm2 + '/' + dd2 + '/' + yyyy2;
                currentDateTr = currentDateEx;
                var NewDateRange2 = NewDate3 + " " + 'To' + " " + NewDate2;
                a.push(NewDateRange2);
            }
        }
        SessionStore.set('sessionWeekDates', a);
        instance.DateRange.set(a);
        return Template.instance().DateRange.get();
    },
    collpaseNo: function(index) {
        var weekarr = [];
        for (var i = 1; i <= index + 1; i++) {
            weekarr.push(i);
        }
        SessionStore.set('sessionWeekArray', weekarr);
        return index + 1;
    },

    generate: function() {
        var instance = Template.instance();
        return instance.generateRecVar.get();
    }
});

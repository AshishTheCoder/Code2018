Template.ApplicationData.onCreated(function ss() {
    this.radioValue = new ReactiveVar;
    this.selectedApp = new ReactiveVar;
    this.totalAmount = new ReactiveVar;
    this.selectedMonth = new ReactiveVar;
    this.selectedYear = new ReactiveVar;
    this.monthYear = new ReactiveVar;
    this.calculatedIncentive = new ReactiveVar;
    this.calculatedCharges = new ReactiveVar;
    this.monthRangeSelected = new ReactiveVar;
    this.fixData = new ReactiveVar;
    this.raisedDateSave = new ReactiveVar;
    this.recievedDateSave = new ReactiveVar;
    this.varIndexing = new ReactiveVar(1);
    this.UI_typeSet = new ReactiveVar();
});
Template.ApplicationData.rendered = function() {};

Template.ApplicationData.events({
    'focus .datepicker' () {
        $('.datepicker').datepicker({format: 'dd-mm-yyyy', autoclose: true})
    },
    'focus .datepickerDot' () {
        $('.datepickerDot').datepicker({format: 'dd.mm.yyyy', autoclose: true})
    },
    'change #appType' (e, instance) {
        Template.instance().selectedMonth.get('');
        Template.instance().selectedYear.get('');
        Template.instance().fixData.get('');
        if ($('#financialYear').val()) {
            Template.instance().selectedApp.set($(e.currentTarget).val());
            if ($(e.currentTarget).val() == 'SLDC_charge' || $(e.currentTarget).val() == 'trans_charge_Rajasthan' || $(e.currentTarget).val() == 'trans_charge_MP' || $(e.currentTarget).val() == 'trans_charge_GETCO') {
                var state = $("#appType").find(':selected').attr("state");
                Meteor.call("getFixData", state, $('#financialYear').val(), $(e.currentTarget).val(), function(error, result) {
                    if (error) {
                        swal("Error");
                    } else {
                        if (result.status) {
                            instance.fixData.set(result.data);
                        }
                    }
                })
            }
        } else {
            $(e.currentTarget).val('');
            swal('Select financial Year');
        }
    },
    'change #selectMonth, change #selectYear, change .raisedDate, change .recievedDate' (e) {
        Template.instance().selectedMonth.set($('#selectMonth').val());
        Template.instance().selectedYear.set($('#selectYear').val());
        Template.instance().raisedDateSave.set($('.raisedDate').val());
        Template.instance().recievedDateSave.set($('.recievedDate').val());
    },
    'change #selectStartMonth, change #selectEndMonth' (e) {
        var json = {
            startingMonth: {
                'monthNumber': $('#selectStartMonth').val(),
                'monthWords': monthInWords($('#selectStartMonth').val())
            },
            endingMonth: {
                'monthNumber': $('#selectEndMonth').val(),
                'monthWords': monthInWords($('#selectEndMonth').val())
            }
        }
        if (Number($('#selectStartMonth').val()) < Number($('#selectEndMonth').val())) {} else {
            $('#selectEndMonth').val('');
            swal('Starting Month should be less than ending month');
        }
        Template.instance().monthRangeSelected.set(json);
    },
    'click #calAmount' (e, instance) {
        var count = 0;
        $('.total').each(function() {
            var match = $(this).val();
            if (match.match(/^[0-9]*\.?[0-9]*$/)) {
                count += Number($(this).val());
            } else {
                swal("Enter only digits");
                throw new Error("Use only digits!");
            }
        })
        var countDecimal = count.toFixed(2);
        instance.totalAmount.set({'amountNumber': amountInComman(countDecimal), 'amountWords': amountInWords(countDecimal)});
    },
    'click #calIncentive' () {
        Template.instance().calculatedIncentive.set('');
        var countCapacity = 0;
        var capacity = [];
        var serialNumber = [];
        var serial = 1;
        $('.capacity').each(function() {
            var match = $(this).val();
            if (match.match(/^[0-9]*\.?[0-9]*$/)) {
                countCapacity += Number($(this).val());
                capacity.push(Number($(this).val()));
            } else {
                swal("Enter only digits in Capacity fields");
                throw new Error("Use only digits!");
            }
            serialNumber.push(serial);
            serial++;
        })
        serialNumber.push('Total');
        capacity.push(countCapacity.toFixed(2));

        var countbyRVPN = 0;
        var byRVPN = [];
        $('.byRVPN').each(function() {
            var match = $(this).val();
            if (match.match(/^[0-9]*\.?[0-9]*$/)) {
                countbyRVPN += Number($(this).val());
                byRVPN.push(Number($(this).val()));
            } else {
                swal("Enter only digits in Amount(Rs) Raised by RVPN");
                throw new Error("Use only digits!");
            }
        })
        byRVPN.push(countbyRVPN.toFixed(2));

        var countbySECI = 0;
        var bySECI = [];
        $('.bySECI').each(function() {
            var match = $(this).val();
            if (match.match(/^[0-9]*\.?[0-9]*$/)) {
                countbySECI += Number($(this).val());
                bySECI.push(Number($(this).val()));
            } else {
                swal("Enter only digits in Amount(Rs) to be raised by SECI");
                throw new Error("Use only digits!");
            }
        })
        bySECI.push(countbySECI.toFixed(2));

        var difference = [];
        for (var i = 0; i < bySECI.length; i++) {
            var value = Number(byRVPN[i]) - Number(bySECI[i]);
            difference.push(value.toFixed(2));
        }

        var remarks = [];
        $('.remarks').each(function() {
            if ($(this).val()) {
                remarks.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var json = {
            'serialNumber': serialNumber,
            'capacity': capacity,
            'byRVPN': byRVPN,
            'bySECI': bySECI,
            'difference': difference,
            'remarks': remarks
        }
        Template.instance().totalAmount.set({
            'amountNumber': amountInComman(countbyRVPN.toFixed(2)),
            'amountWords': amountInWords(countbyRVPN.toFixed(2))
        });
        Template.instance().calculatedIncentive.set(json);
    },
    'click #calSldc' (e, instance) {
        var billNumber = [];
        $('.sldcBillNo').each(function() {
            if ($(this).val()) {
                billNumber.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var sldcPeriodStart = [];
        $('.sldcPeriodStart').each(function() {
            if ($(this).val()) {
                sldcPeriodStart.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var sldcPeriodEnd = [];
        $('.sldcPeriodEnd').each(function() {
            if ($(this).val()) {
                sldcPeriodEnd.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var sldcPeriod = [];
        for (var i = 0; i < sldcPeriodEnd.length; i++) {
            sldcPeriod.push(sldcPeriodStart[i] + ' - ' + sldcPeriodEnd[i]);
        }

        var sldcCapacity = [];
        $('.sldcCapacity').each(function() {
            if ($(this).val()) {
                sldcCapacity.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })
        var sldcDueDate = [];
        $('.dueDate').each(function() {
            if ($(this).val()) {
                sldcDueDate.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var monthDifference = Number($('#selectEndMonth').val() - Number($('#selectStartMonth').val()));
        var amount = [];
        var charge = Template.instance().fixData.get();
        for (i = 0; i < sldcCapacity.length; i++) {
            var value = Number(sldcCapacity[i]) * Number(charge) * (Number(monthDifference) + 1);
            amount.push(value.toFixed(2));
        }

        var count = 0;
        for (var i = 0; i < amount.length; i++) {
            count += Number(amount[i])
        }
        Template.instance().totalAmount.set({
            'amountNumber': amountInComman(count.toFixed(2)),
            'amountWords': amountInWords(count.toFixed(2))
        });
        var json = {
            billNumber: billNumber,
            sldcPeriod: sldcPeriod,
            sldcCapacity: sldcCapacity,
            sldcDueDate: sldcDueDate,
            amount: amount
        }
        Template.instance().calculatedCharges.set(json);
    },
    'click #calTransmissionRaj' () {
        var billNumber = [];
        $('.transBillNo').each(function() {
            if ($(this).val()) {
                billNumber.push($(this).val());
            } else {
                swal("All Bill Number Required");
                throw new Error("All fields Required!");
            }
        })

        var transPeriodStart = [];
        $('.transPeriodStart').each(function() {
            if ($(this).val()) {
                transPeriodStart.push($(this).val());
            } else {
                swal("All Period Required");
                throw new Error("All Period Required!");
            }
        })

        var transPeriodEnd = [];
        $('.transPeriodEnd').each(function() {
            if ($(this).val()) {
                transPeriodEnd.push($(this).val());
            } else {
                swal("All Period Required");
                throw new Error("All Period Required!");
            }
        })

        var transPeriod = [];
        for (var i = 0; i < transPeriodStart.length; i++) {
            transPeriod.push(transPeriodStart[i] + ' - ' + transPeriodEnd[i]);
        }

        var transCapacity = [];
        $('.transCapacity').each(function() {
            if ($(this).val()) {
                transCapacity.push($(this).val());
            } else {
                swal("All Capacity Required");
                throw new Error("All Capacity Required!");
            }
        })
        var transDueDate = [];
        $('.dueDate').each(function() {
            if ($(this).val()) {
                transDueDate.push($(this).val());
            } else {
                swal("All DueDate Required");
                throw new Error("All DueDate Required!");
            }
        })

        var transExcess = [];
        $('.transExcess').each(function() {
            if ($(this).val()) {
                transExcess.push($(this).val());
            } else {
                swal("All Excess Payment Required");
                throw new Error("All Excess Payment Required!");
            }
        })

        var totalAmount = [];
        var monthDifference = Number($('#selectEndMonth').val() - Number($('#selectStartMonth').val()));
        var charge = Template.instance().fixData.get();
        for (i = 0; i < transCapacity.length; i++) {
            var value = Number(transCapacity[i]) * Number(charge) * (Number(monthDifference) + 1);
            totalAmount.push(value.toFixed(2));
        }

        var paymentAmount = [];
        for (var i = 0; i < totalAmount.length; i++) {
            var payValue = Number(totalAmount[i]) - Number(transExcess[i]);
            paymentAmount.push(payValue);
        }

        var count = 0;
        for (var i = 0; i < paymentAmount.length; i++) {
            count += Number(paymentAmount[i])
        }

        Template.instance().totalAmount.set({
            'amountNumber': amountInComman(count.toFixed(2)),
            'amountWords': amountInWords(count.toFixed(2))
        });

        var json = {
            billNumber: billNumber,
            transPeriod: transPeriod,
            transCapacity: transCapacity,
            transDueDate: transDueDate,
            totalAmount: totalAmount,
            transExcess: transExcess,
            paymentAmount: paymentAmount
        }
        Template.instance().calculatedCharges.set(json);
    },
    'click #calTransmissionMP' (e, instance) {
        e.preventDefault();
        var billNumber = [];
        $('.transBillNo').each(function() {
            if ($(this).val()) {
                billNumber.push($(this).val());
            } else {
                swal("All Bill Number Required");
                throw new Error("All fields Required!");
            }
        })

        var transPeriodStart = [];
        $('.transPeriodStart').each(function() {
            if ($(this).val()) {
                transPeriodStart.push($(this).val());
            } else {
                swal("All Period Required");
                throw new Error("All Period Required!");
            }
        })

        var transPeriodEnd = [];
        $('.transPeriodEnd').each(function() {
            if ($(this).val()) {
                transPeriodEnd.push($(this).val());
            } else {
                swal("All Period Required");
                throw new Error("All Period Required!");
            }
        })

        var transPeriod = [];
        for (var i = 0; i < transPeriodStart.length; i++) {
            transPeriod.push(transPeriodStart[i] + ' - ' + transPeriodEnd[i]);
        }

        var transCapacity = [];
        $('.transCapacity').each(function() {
            if ($(this).val()) {
                transCapacity.push($(this).val());
            } else {
                swal("All Capacity Required");
                throw new Error("All Capacity Required!");
            }
        })
        var transDueDate = [];
        $('.dueDate').each(function() {
            if ($(this).val()) {
                transDueDate.push($(this).val());
            } else {
                swal("All DueDate Required");
                throw new Error("All DueDate Required!");
            }
        })

        var transExcess = [];
        $('.transExcess').each(function() {
            if ($(this).val()) {
                transExcess.push($(this).val());
            } else {
                swal("All Excess Payment Required");
                throw new Error("All Excess Payment Required!");
            }
        })

        var totalAmount = [];
        $('.totalAmount').each(function() {
            if ($(this).val()) {
                totalAmount.push($(this).val());
            } else {
                swal("All Total Amount Required");
                throw new Error("All Excess Payment Required!");
            }
        })

        var paymentAmount = [];
        for (var i = 0; i < totalAmount.length; i++) {
            var payValue = Number(totalAmount[i]) - Number(transExcess[i]);
            paymentAmount.push(payValue);
        }

        var count = 0;
        for (var i = 0; i < paymentAmount.length; i++) {
            count += Number(paymentAmount[i])
        }

        Template.instance().totalAmount.set({
            'amountNumber': amountInComman(count.toFixed(2)),
            'amountWords': amountInWords(count.toFixed(2))
        });

        var json = {
            billNumber: billNumber,
            transPeriod: transPeriod,
            transCapacity: transCapacity,
            transDueDate: transDueDate,
            totalAmount: totalAmount,
            transExcess: transExcess,
            paymentAmount: paymentAmount
        }
        console.log(json);
        Template.instance().calculatedCharges.set(json);
    },
    'click #calTransGETCO' (e, instance) {
        e.preventDefault();
        var invoiceAmount = 0;
        var json = {
            days: numberOfdaysInMonth(Template.instance().selectedMonth.get(), Template.instance().selectedYear.get()),
            GERC: Template.instance().fixData.get()
        }

        if (json.days > 28) {} else {
            swal("Please select month and year");
            throw new Error("month and year Required!");
        }
        invoiceAmount = Number(json.GERC) * Number(json.days) * 10;
        totalInvoiceAmount = invoiceAmount * 4;

        var invoiceNumber = [];
        $('.invoiceNumber').each(function() {
            if ($(this).val()) {
                invoiceNumber.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var invoiceDate = [];
        $('.invoiceDate').each(function() {
            if ($(this).val()) {
                invoiceDate.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })
        var dueDate = [];
        $('.dueDate').each(function() {
            if ($(this).val()) {
                dueDate.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var deduct = [];
        $('.deduct').each(function() {
            if ($(this).val()) {
                deduct.push($(this).val());
            } else {
                swal("All fields Required");
                throw new Error("All fields Required!");
            }
        })

        var paymentAmount = [];
        for (var i = 0; i < deduct.length; i++) {
            var payValue = Number(invoiceAmount) - Number(deduct[i]);
            paymentAmount.push(payValue);
        }
        var totalPaymentAmount = 0;
        for (var i = 0; i < paymentAmount.length; i++) {
            totalPaymentAmount += paymentAmount[i];
        }

        Template.instance().totalAmount.set({
            'amountNumber': amountInComman(totalPaymentAmount.toFixed(2)),
            'amountWords': amountInWords(totalPaymentAmount.toFixed(2))
        });

        var json = {
            invoiceNumber: invoiceNumber,
            invoiceAmount: invoiceAmount,
            totalInvoiceAmount: totalInvoiceAmount,
            invoiceDate: invoiceDate,
            dueDate: dueDate,
            deduct: deduct,
            paymentAmount: paymentAmount,
            daysJson: json
        }
        Template.instance().calculatedCharges.set(json);
    },
    'click #submitApplication' (e, instance) {
        e.preventDefault();
        if (instance.selectedApp.get()) {
            var newClass = '.' + instance.selectedApp.get();
            $(newClass).each(function() {
                if ($(this).val()) {} else {
                    swal("All fields are required");
                    throw new Error("All fields are required!");
                }
            })
            var toInsert = {
                'appName': $("#appName").val(),
                'appType': $("#appType").val(),
                'appArray': [
                    "pending1",
                    "pending2",
                    "pending3",
                    "pending4",
                    "pending5",
                    "pending6"
                ],
                'confrimButton': '1',
                'generatedDate': moment().format('DD-MM-YYYY'),
                'financial_year': $('#financialYear').val()
            }

            if (instance.selectedApp.get() == 'RLDC_gujarat' || instance.selectedApp.get() == 'RLDC_MP') {
                toInsert.SOC = $("#SOC").val();
                toInsert.MOC = $("#MOC").val();
                toInsert.monthYear = instance.monthYear.get();
                toInsert.amount = instance.totalAmount.get();
            } else if (instance.selectedApp.get() == 'incentive_charge') {
                toInsert.data = instance.calculatedIncentive.get();
                toInsert.amount = instance.totalAmount.get();
                toInsert.year = $("#selectYear").val();
            } else if (instance.selectedApp.get() == 'SLDC_charge') {
                toInsert.data = instance.calculatedCharges.get();
                toInsert.month = instance.monthRangeSelected.get();
                toInsert.sldcRate = instance.fixData.get();
                toInsert.amount = instance.totalAmount.get();
            } else if (instance.selectedApp.get() == 'trans_charge_Rajasthan') {
                toInsert.data = instance.calculatedCharges.get();
                toInsert.month = instance.monthRangeSelected.get();
                toInsert.transmissionRate = instance.fixData.get();
                toInsert.amount = instance.totalAmount.get();
            } else if (instance.selectedApp.get() == 'trans_charge_GETCO') {
                toInsert.data = instance.calculatedCharges.get();
                toInsert.raisedDate = $(".raisedDate").val();
                toInsert.recievedDate = $(".recievedDate").val();
                toInsert.monthYear = instance.monthYear.get();
                toInsert.amount = instance.totalAmount.get();
            } else if (instance.selectedApp.get() == 'trans_charge_MP') {
                toInsert.data = instance.calculatedCharges.get();
                toInsert.monthYear = instance.monthYear.get();
                toInsert.amount = instance.totalAmount.get();
            }
            console.log(toInsert);
            Meteor.call("saveApplication", toInsert, function(error, result) {
                if (error) {
                    swal("Error");
                } else {
                    if (result.status) {
                        $(newClass).each(function() {
                            $(this).val('')
                        })
                        instance.totalAmount.set('');
                        instance.selectedApp.set('');
                        instance.calculatedIncentive.set('');
                        instance.calculatedCharges.set('');
                        instance.monthRangeSelected.set('');
                        instance.fixData.set('');
                        instance.varIndexing.set(1);
                        swal(result.message);
                    } else {
                        $(newClass).each(function() {
                            $(this).val('')
                        })
                        instance.totalAmount.set('');
                        instance.selectedApp.set('');
                        instance.calculatedIncentive.set('');
                        instance.calculatedCharges.set('');
                        instance.varIndexing.set(1);
                        instance.monthRangeSelected.set('');
                        swal(result.message);
                    }
                }
            });
        } else {
            swal('All fields required');
        }
    },
    'click #addRow' () {
        var set = Template.instance().varIndexing.get();
        Template.instance().varIndexing.set(Number(set) + 1);
    },
    'click #removeRow' () {
        var set = Template.instance().varIndexing.get();
        Template.instance().varIndexing.set(Number(set) - 1);
    },
    'change .UI_type' (e, instance) {
        var chkArray = [];
        $('.UI_type').each(function() {
            if ($('input[name=' + $(this).attr("name") + ']:checked').val()) {
                chkArray.push($('input[name=' + $(this).attr("name") + ']:checked').val());
            }
        });
        _.find(chkArray, function(key) {
            if (key == 'revisions_only') {
                $('input[name="revisions_UI"]').attr("disabled", true);
                $('input[name="regular_UI"]').attr("disabled", true);
            } else {
                $('input[name="revisions_UI"]').removeAttr("disabled");
                $('input[name="regular_UI"]').removeAttr("disabled");
            }
            // if (key == 'regular_UI' || key == 'revisions_UI') {
            //   $('input[name="revisions_only"]').attr("disabled", true);
            // }else {
            //   $('input[name="revisions_only"]').removeAttr("disabled");
            // }
        })
        instance.UI_typeSet.set(chkArray);
        console.log(instance.UI_typeSet.get());
    },
    'change .start_week,change .end_week' (e, instance) {
      if ($(e.currentTarget).val()) {
        var json={
          startDate:$('.start_week').val(),
          startWeek:moment($('.start_week').val().toString(),'DD-MM-YYYY').week(),
          endDate:$('.end_week').val(),
          endWeek:moment($('.end_week').val().toString(),'DD-MM-YYYY').week(),
        }
        console.log(json);
      }
    }
});

Template.ApplicationData.helpers({
    startEndWeek() {
        if (Template.instance().selectedApp.get() == 'UI_charges') {
            var flag = false;
            _.find(Template.instance().UI_typeSet.get(), function(key) {
                if (key == 'regular_UI') {
                    flag = true;
                }
            })
            return flag;
        }
    },
    GETCOdates() {
        if (Template.instance().raisedDateSave.get()) {
            if (Template.instance().recievedDateSave.get()) {
                var json = {
                    raised: Template.instance().raisedDateSave.get(),
                    recieved: Template.instance().recievedDateSave.get()
                }
                return json;
            }
        }
    },
    manualIndexing() {
        var set = Template.instance().varIndexing.get();
        var ary = [];
        for (var i = 0; i < Number(set); i++) {
            ary.push(i);
        }
        return ary;
    },
    returnLastIndex() {
        return Template.instance().varIndexing.get();
    },
    individualHelper(array, index) {
        if (array) {
            return array[index];
        }
    },
    showMonth() {
        if (Template.instance().selectedApp.get() == 'RLDC_gujarat' || Template.instance().selectedApp.get() == 'RLDC_MP' || Template.instance().selectedApp.get() == 'trans_charge_GETCO' || Template.instance().selectedApp.get() == 'trans_charge_MP') {
            return true
        }
    },
    showYear() {
        var appSelected = Template.instance().selectedApp.get();
        if (appSelected == 'RLDC_gujarat' || appSelected == 'RLDC_MP' || appSelected == 'incentive_charge' || appSelected == 'trans_charge_GETCO' || appSelected == 'trans_charge_MP') {
            return true
        }
    },
    tableDescription() {
        if (Template.instance().selectedApp.get() == 'RLDC_gujarat' || Template.instance().selectedApp.get() == 'RLDC_MP') {
            return true
        }
    },
    returnTotalAmount() {
        if (Template.instance().totalAmount.get()) {
            return Template.instance().totalAmount.get();
        }
    },
    returnIncentive() {
        if (Template.instance().calculatedIncentive.get()) {
            return Template.instance().calculatedIncentive.get();
        }
    },
    returnCharges() {
        if (Template.instance().calculatedCharges.get()) {
            return Template.instance().calculatedCharges.get();
        }
    },
    validateClass() {
        if (Template.instance().selectedApp.get()) {
            return Template.instance().selectedApp.get();
        }
    },
    incentiveCharges() {
        if (Template.instance().selectedApp.get() == 'incentive_charge') {
            return true;
        }
    },
    sldcCharges() {
        if (Template.instance().selectedApp.get() == 'SLDC_charge') {
            if (Template.instance().monthRangeSelected.get()) {
                return true;
            }
        }
    },
    transmissionCharges() {
        if (Template.instance().selectedApp.get() == 'trans_charge_Rajasthan') {
            if (Template.instance().monthRangeSelected.get()) {
                return true;
            }
        } else if (Template.instance().selectedApp.get() == 'trans_charge_MP') {
            return true;
        }
    },
    stuNameAndClick() {
        if (Template.instance().selectedApp.get() == 'trans_charge_Rajasthan') {
            if (Template.instance().monthRangeSelected.get()) {
                var json = {
                    stuName: 'RVPN',
                    clickButton: 'calTransmissionRaj'
                };
                return json;
            }
        } else if (Template.instance().selectedApp.get() == 'trans_charge_MP') {
            var json = {
                stuName: 'MPPTCL',
                clickButton: 'calTransmissionMP'
            };
            return json;
        }
    },
    forTrans_charge_MP() {
        if (Template.instance().selectedApp.get() == 'trans_charge_MP') {
            return true;
        } else {
            return false;
        }
    },
    transmissionChargesGETCO() {
        if (Template.instance().selectedApp.get() == 'trans_charge_GETCO') {
            return true;
        }
    },
    serial(index) {
        return index + 1;
    },
    showSetMonthAndYear() {
        if (Template.instance().selectedMonth.get()) {
            var toReturn = {
                'monthNumber': Template.instance().selectedMonth.get(),
                'monthWords': monthInWords(Template.instance().selectedMonth.get()),
                'getYear': Template.instance().selectedYear.get()
            }
            Template.instance().monthYear.set(toReturn);
            return toReturn;
        }
    },
    monthDaysAndGERC() {
        if (Template.instance().selectedMonth.get()) {
            if (Template.instance().selectedYear.get()) {
                var json = {
                    days: numberOfdaysInMonth(Template.instance().selectedMonth.get(), Template.instance().selectedYear.get()),
                    GERC: Template.instance().fixData.get()
                }
                return json;
            }
        }
    },
    monthRange() {
        if (Template.instance().selectedApp.get() == 'SLDC_charge' || Template.instance().selectedApp.get() == 'trans_charge_Rajasthan') {
            return true;
        }
    },
    chargesGet() {
        if (Template.instance().fixData.get()) {
            return Template.instance().fixData.get();
        }
    },
    monthShow() {
        return monthReturn();
    },
    UIcharges() {
        if (Template.instance().selectedApp.get() == 'UI_charges') {
            return true;
        }
    }
});

function amountInComman(data) {
    var x = data;
    var returnData = x.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnData;
};

function amountInWords(amount) {
    var changeWord = amount;
    if (changeWord < 0) {
        changeWord = Number(-(amount)).toFixed(2);
    }
    var newChange = changeWord.split(".");
    var amountData = '';
    if (newChange[1] != "00") {
        var data1 = inWords(newChange[0]);
        var data2 = inWords(newChange[1]);
        amountData = data1 + ' ' + "and" + ' ' + data2 + ' ' + "Paise only";
    } else {
        var data1 = inWords(newChange[0]);
        amountData = data1 + " only";
    }
    return amountData;
};

function inWords(num) {
    var a = [
        '',
        'One ',
        'Two ',
        'Three ',
        'Four ',
        'Five ',
        'Six ',
        'Seven ',
        'Eight ',
        'Nine ',
        'Ten ',
        'Eleven ',
        'Twelve ',
        'Thirteen ',
        'Fourteen ',
        'Fifteen ',
        'Sixteen ',
        'Seventeen ',
        'Eighteen ',
        'Nineteen '
    ];
    var b = [
        '',
        '',
        'Twenty',
        'Thirty',
        'Forty',
        'Fifty',
        'Sixty',
        'Seventy',
        'Eighty',
        'Ninety'
    ];
    if ((num = num.toString()).length > 9)
        return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n)
        return;
    var str = '';
    str += (n[1] != 0)
        ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore '
        : '';
    str += (n[2] != 0)
        ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh '
        : '';
    str += (n[3] != 0)
        ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand '
        : '';
    str += (n[4] != 0)
        ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred '
        : '';
    str += (n[5] != 0)
        ? ((str != '')
            ? ''
            : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]])
        : '';
    return str;
};

// function numberOfdaysInMonth(month, year) {
//     var date = new Date(year, month - 1, 1);
//     var result = [];
//     var dateArr = [];
//
//     while (date.getMonth() == month - 1) {
//         var update = date.getDate() + "-" + month + "-" + year;
//         var newDate = update.split("-");
//         var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
//         dateArr.push(myObject);
//         date.setDate(date.getDate() + 1);
//     }
//     var firstDate = dateArr[0];
//     var lastDate = dateArr[Number(dateArr.length - 1)];
//     var NumberOfDays = moment(lastDate).format('DD');
//     return NumberOfDays;
// }

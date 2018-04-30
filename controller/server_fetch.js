import {
    ReactiveVar
} from 'meteor/reactive-var';

Template.serverFetch.onCreated(function ss() {
    this.radioValue = new ReactiveVar;
    this.lastUpdated = new ReactiveVar;
    this.randomId = new ReactiveVar;
});

Template.serverFetch.rendered = function() {
  SessionStore.set("isLoading",false);
    $('#selectDate').datepicker({
        format: 'dd-mm-yyyy',
        endDate: '+1d',
        autoclose: true
    });
};

Template.serverFetch.events({
    "change #selectDate" () {
        Template.instance().radioValue.set('');
        Template.instance().randomId.set('');
        $(".radio").prop("checked", false);
    },
    "change #inlineRadio" (e, instance) {
        if ($('#selectDate').val()) {
            Template.instance().randomId.set('');
            Template.instance().radioValue.set($(e.currentTarget).val());
            if ($(e.currentTarget).val() == "NRLDC") {
                Meteor.call("callLastUpdatedNRLDC", $('#selectDate').val(), function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            instance.lastUpdated.set(result.data);
                        }
                    }
                });
            } else if ($(e.currentTarget).val() == "WRLDC") {
                Meteor.call("callLastUpdatedWRLDC", $('#selectDate').val(), function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            instance.lastUpdated.set(result.data);
                        }
                    }
                });
            } else if ($(e.currentTarget).val() == "ERLDC") {
                Meteor.call("callLastUpdatedERLDC", $('#selectDate').val(), function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            instance.lastUpdated.set(result.data);
                        }
                    }
                });
            } else if ($(e.currentTarget).val() == "NERLDC") {
                Meteor.call("callLastUpdatedNERLDC", $('#selectDate').val(), function(error, result) {
                    if (error) {
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            instance.lastUpdated.set(result.data);
                        }
                    }
                });
            }
        } else {
            swal("Select Date");
        }

    },
    "click #getNRdata" () {
        if ($('#selectedState').val()) {
            var generatedId = Random.id();
            console.log(generatedId);
            Template.instance().randomId.set(generatedId);
            FetchStatus.insert({
                '_id': generatedId,
                'type': 'NRData',
                'status': 'Server Called'
            });
            Meteor.subscribe("FetchStatusDetails", generatedId);
            Meteor.call("scrapeit", $('#selectDate').val(), $('#selectedState').val(), generatedId, Meteor.bindEnvironment(function(error, result) {
                if (error) {
                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NRData',
                    }, {
                        $set: {
                            'status': 'URL Failed try again'
                        }
                    });
                    swal("Oops...", "Please try again", "error");
                } else {
                    if (result.status) {
                        // swal("Ok Data Updated");
                    }
                }
            }));
        } else {
            swal("Please Select State");
        }
    },
    "click #getERdata" () {
        if ($('#selectedStateER').val()) {
            var generatedId = Random.id();
            console.log(generatedId);
            Template.instance().randomId.set(generatedId);
            FetchStatus.insert({
                '_id': generatedId,
                'type': 'ERData',
                'status': 'Server Called'
            });
            Meteor.subscribe("FetchStatusDetails", generatedId);
            Meteor.call("callERLDCdata", $('#selectDate').val(), generatedId, function(error, result) {
                if (error) {
                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'ERData'
                    }, {
                        $set: {
                            'status': 'URL Failed try again'
                        }
                    });
                    swal("Oops...", "Please try again", "error");
                } else {
                    if (result.status) {
                        // swal("Ok Data Updated");
                    }
                }
            });
        } else {
            swal("Please Select State");
        }
    },
    "click #getNERdata" () {
        if ($('#selectedStateNER').val()) {
            var generatedId = Random.id();
            console.log(generatedId);
            Template.instance().randomId.set(generatedId);
            FetchStatus.insert({
                '_id': generatedId,
                'type': 'NERdata',
                'status': 'Server Called'
            });
            Meteor.subscribe("FetchStatusDetails", generatedId);
            console.log( $('#selectDate').val());
            Meteor.call("callNERLDCdata", $('#selectDate').val(), generatedId, function(error, result) {
                if (error) {
                    FetchStatus.update({
                        '_id': generatedId,
                        'type': 'NERdata'
                    }, {
                        $set: {
                            'status': 'URL Failed try again'
                        }
                    });
                    swal("Oops...", "Please try again", "error");
                } else {
                    if (result.status) {
                        // swal("Ok Data Updated");
                    }
                }
            });
        } else {
            swal("Please Select State");
        }
    },
    "click #getWRdata" () {
        if ($('#selectedStateWR').val()) {
            if ($('#selectedStateWR').val() == "MP") {
                var generatedId = Random.id();
                console.log(generatedId);
                Template.instance().randomId.set(generatedId);
                FetchStatus.insert({
                    '_id': generatedId,
                    'type': 'WRMPdata',
                    'status': 'Server Called'
                });
                Meteor.subscribe("FetchStatusDetails", generatedId);
                Meteor.call("callWRLDCdataMP", $('#selectDate').val(), $('#selectedStateWR').val(), generatedId, function(error, result) {
                    if (error) {
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRMPdata'
                        }, {
                            $set: {
                                'status': 'URL Failed try again'
                            }
                        });
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            // swal("Ok Data Updated");
                        } else {
                            swal(result.message);
                        }
                    }
                });
            } else if ($('#selectedStateWR').val() == "Rajasthan") {
                var generatedId = Random.id();
                console.log(generatedId);
                Template.instance().randomId.set(generatedId);
                FetchStatus.insert({
                    '_id': generatedId,
                    'type': 'WRRajdata',
                    'status': 'Server Called'
                });
                Meteor.subscribe("FetchStatusDetails", generatedId);
                Meteor.call("callWRLDCdataRajasthan", $('#selectDate').val(), $('#selectedStateWR').val(), generatedId, function(error, result) {
                    if (error) {
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRRajdata'
                        }, {
                            $set: {
                                'status': 'URL Failed try again'
                            }
                        })
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            // swal("Ok Data Updated");
                        } else {
                            swal(result.message);
                        }
                    }
                });
            } else if ($('#selectedStateWR').val() == "Gujarat") {
                var generatedId = Random.id();
                console.log(generatedId);
                Template.instance().randomId.set(generatedId);
                FetchStatus.insert({
                    '_id': generatedId,
                    'type': 'WRGujdata',
                    'status': 'Server Called'
                });
                Meteor.subscribe("FetchStatusDetails", generatedId);
                Meteor.call("callWRLDCdataGujarat", $('#selectDate').val(), $('#selectedStateWR').val(), generatedId, function(error, result) {
                    if (error) {
                        FetchStatus.update({
                            '_id': generatedId,
                            'type': 'WRGujdata'
                        }, {
                            $set: {
                                'status': 'URL Failed try again'
                            }
                        })
                        swal("Oops...", "Please try again", "error");
                    } else {
                        if (result.status) {
                            // swal("Ok Data Updated");
                        } else {
                            swal(result.message);
                        }
                    }
                });
            }
        } else {
            swal("Please Select State");
        }
    }
})

Template.serverFetch.helpers({
    showNRContent() {
        if (Template.instance().radioValue.get() == "NRLDC") {
            return true;
        }
    },
    showERContent() {
        if (Template.instance().radioValue.get() == "ERLDC") {
            return true;
        }
    },
    showNERContent() {
        if (Template.instance().radioValue.get() == "NERLDC") {
            return true;
        }
    },
    showWRContent() {
        if (Template.instance().radioValue.get() == "WRLDC") {
            return true;
        }
    },
    showLastUpdated() {
        if (Template.instance().lastUpdated.get()) {
            return Template.instance().lastUpdated.get();
        }
    },
    returnStatus() {
        if (Template.instance().randomId.get()) {
            var getStatus = FetchStatus.find({
                _id: Template.instance().randomId.get()
            }).fetch();
            if (getStatus.length > 0) {
                return getStatus[0].status;
            }
        } else {
            return '-----------';
        }
    }
})

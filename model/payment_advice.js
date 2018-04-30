Meteor.methods({
    ApplicationDataFetch: function() {
        return applicationCollection.find({}).fetch();
    },
    ApplicationModalFetch: function(get_id) {
        return applicationCollection.find({
            _id: get_id
        }).fetch();
    },
    ApplicationURLInsert: function(data, get_id) {
        applicationCollection.update({
            _id: get_id
        }, {
            $set: {
                "absoURL": data
            }
        });
    },
    ApplicationModalUpdate: function(data, get_id) {
        if (Meteor.user().profile.user_type == "applicant1") {
            applicationCollection.update({
                _id: get_id
            }, {
                $set: {
                    "ByLevel1": data
                }
            });
        } else if (Meteor.user().profile.user_type == "applicant2") {
            applicationCollection.update({
                _id: get_id
            }, {
                $set: {
                    "ByLevel2": data
                }
            });
        } else if (Meteor.user().profile.user_type == "applicant3") {
            applicationCollection.update({
                _id: get_id
            }, {
                $set: {
                    "ByLevel3": data
                }
            });
        } else if (Meteor.user().profile.user_type == "applicant4") {
            applicationCollection.update({
                _id: get_id
            }, {
                $set: {
                    "ByLevel4": data
                }
            });
        } else if (Meteor.user().profile.user_type == "applicant5") {
            applicationCollection.update({
                _id: get_id
            }, {
                $set: {
                    "ByLevel5": data
                }
            });
        } else if (Meteor.user().profile.user_type == "applicant6") {
            applicationCollection.update({
                _id: get_id
            }, {
                $set: {
                    "ByLevel6": data
                }
            });
        }
    },
    ApplicationArrayStatus: function(get_id) {
        return applicationCollection.find({
            _id: get_id
        }).fetch();
    },
    ApplicationUpdateAppArray: function(get_id, Value) {
        applicationCollection.update({
            _id: get_id
        }, {
            $set: {
                "appArray": Value
            }
        });
    },
    ApplicationUpdateButtonValue: function(get_id, Value) {
        applicationCollection.update({
            _id: get_id
        }, {
            $set: {
                "confrimButton": Value
            }
        });
    },
});

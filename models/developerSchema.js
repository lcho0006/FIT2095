const mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    Name: {
        FirstName: {
            type: String,
            required: true
        },
        LastName: String
    },
    Level: {
        type: String,
        validate: {
            validator: function (devLevel) {
                return devLevel == 'Beginner' || devLevel == 'Expert';
            },
            message: 'Invalid input for the level !'
        },
        required: true
    },
    Address: {
        State: {
            type: String
        },
        Suburb: {
            type: String
        },
        Street: {
            type: String
        },
        Unit: {
            type: String
        },
    }
});
module.exports = mongoose.model('Developer', developerSchema);
const mongoose = require('mongoose');
const Schmema = mongoose.Schema;

const databaseSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('donationModel', databaseSchema);
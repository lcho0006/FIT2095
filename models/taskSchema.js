const mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    TaskName: {
        type: String,
        required: true
    },
    TaskAssign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    TaskDue:
        {
            type: Date,
            required: true
        },
    TaskStatus:
        {
            type: String,
            required: true
        },
    TaskDesc:
        {
            type: String
        }
});
module.exports = mongoose.model('Task', taskSchema);
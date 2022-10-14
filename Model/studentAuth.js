const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: String,
    email: String,
    student_id:{
        type:String,
        required: true
    },
    classOf: {
        type: String
    }
})

module.exports = mongoose.model('studentAuth', schema)
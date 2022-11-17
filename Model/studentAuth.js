const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: String,
    email: String,
    student_id:{
        type:String,
        required: true
    },
    classOfStudent: {
        type: String,
        enum:["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]
    },
    courses:[{type: String}]
})

module.exports = mongoose.model('studentAuth', schema)
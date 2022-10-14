const mongoose = require('mongoose');

const markSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subject:{
        type: String,
        required: true
    },
    score:{
        type: Number,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    markType:{
        type: String,
        enum: ["Test", "Examination"],
        required: true
    },
    classOf:{
        type:String,
        ref:'auth'
    }
});

module.exports = mongoose.model('marks', markSchema);
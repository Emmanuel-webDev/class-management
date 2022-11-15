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
        enum:["1st", "2nd", "3rd"],
        required: true
    },
    markType:{
        type: String,
        enum: ["Test", "Examination"],
        required: true
    },
    classTeacherID:{
       type:mongoose.Schema.ObjectId,
       ref:"auth"
    },
    classOfteacher:{
        type:String,
        ref:"auth"
    }
});

module.exports = mongoose.model('marks', markSchema);
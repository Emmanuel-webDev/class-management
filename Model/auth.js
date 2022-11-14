const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name:String,
    email: String,
    classOf:{
      type: String,
       enum:["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]
    },
    isTeacher:{
      type:String,
        required: true
    },
    password:String
})

module.exports = mongoose.model("auth", schema)
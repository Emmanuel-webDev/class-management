const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name:String,
    email: String,
    classOf:{
      type: String,
       enum:["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]
    },
    password:String
})

module.exports = mongoose.model("auth", schema)
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name:String,
    email: String,
    classOf:String,
    password:String
})

module.exports = mongoose.model("auth", schema)
const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema({
    title:{
        type: String
    },

    message:{
       type: String
    },

    date_Created:Date,
classOfteacher:{
  type:String,
  ref: 'auth'
}
})

module.exports = mongoose.model('notice', noticeSchema)
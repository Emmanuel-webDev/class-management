const express = require('express');

const user = require('./controllers/Teacher')

const student = require('./controllers/student')

const mongoose = require('mongoose')


const app = express();

require('dotenv').config()

mongoose.connect('mongodb://127.0.0.1:27017/class-system', {UseNewUrlParser: true}).then(()=>{
//middleware

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(user)
app.use(student)
   


app.listen(process.env.PORT, ()=>{
    console.log(`Hello...from ${process.env.PORT}`)
})


})


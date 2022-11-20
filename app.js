const express = require('express');

const user = require('./controllers/Teacher')

const student = require('./controllers/student')

const mongoose = require('mongoose')


const app = express();

require('dotenv').config()

mongoose.connect(process.env.URI, {UseNewUrlParser: true}).then(()=>{
//middleware
app.set("views", "Frontend")
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(user)
app.use(student)
app.use((error, req, res, next)=>{
    res.render('./ErrorMessages/501')
})
   



app.listen(process.env.PORT, ()=>{
    console.log(`Hello...from ${process.env.PORT}`)
})


})


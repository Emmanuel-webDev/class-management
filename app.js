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
   
//teachers routes
app.post('/',  user.signup)
app.post('/login', user.login)
app.post('/createMarks', user.createMarks)
app.post('/notice',  user.notice)
app.post('/updateMark/:id', user.updateMark)
app.post('/del/:id', user.del)
app.post('/newStudent', user.addStudent)


//student routes
app.post('/studentLogin', student.login)
app.get('/notices', student.notice)
app.get('/studentMarks', student.getMarks)

app.listen(process.env.PORT, ()=>{
    console.log(`Hello...from ${process.env.PORT}`)
})


})


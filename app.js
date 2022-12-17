const express = require('express');

const user = require('./controllers/Teacher')

const student = require('./controllers/student')

const mongoose = require('mongoose')

const cors = require('cors')

const app = express();

//socket server
const http = require('http').createServer(app)
const socket = require('socket.io')
const io = socket(http,  {
    cors:{
        origin:"*",
        methods:['GET', 'POST']
    }

})

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
    res.status(500).send("Server broke down..")
})
   

//socket functionalities
io.on('connection', (socket)=>{
    console.log(`user ${socket.id} joined`)

    socket.on('message', (msg)=>{
        io.emit('message_clients', {
            message: msg
        })
    })
})

//app.listen(5050, ()=>{
   // console.log('Express server running..')
//})

http.listen(process.env.PORT, ()=>{
    console.log(`Hello...from ${process.env.PORT}`)
})


})


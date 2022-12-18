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
   
let users = []

//socket functionalities
io.on('connection', (socket)=>{
    console.log(`user ${socket.id} joined`)

    socket.on('usersVal', (data)=>{
        socket.user = data
        users.push(data)
        io.emit('usersData', users)
    })

    socket.on('message', (msg)=>{
        io.emit('message_clients', {
            message: msg,
            user: socket.user
        })    
    })

    socket.on('disconnect', ()=>{
        if(socket.user){
            users.splice(users.indexOf(socket.user), 1)
            io.emit("usersData", users)
            console.log(`${socket.user} left the chat`)
        }
     })

    })

  



app.listen(5000, ()=>{
   console.log('Express server running..')
})

http.listen(process.env.PORT, ()=>{
    console.log(`Hello...from ${process.env.PORT}`)
})


})


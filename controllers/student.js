const express = require('express')
const student = require('../Model/studentAuth')
const marks =require('../Model/marks')
const message = require('../Model/notice')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const route = express.Router()

route.use(cookie())


route.post('/studentLogin', async (req, res)=>{
    const {name, student_id} = req.body

    const existingStudent = await student.findOne({name: name})
    const check = await bcrypt.compare(student_id, existingStudent.student_id)
    if(!existingStudent){
        res.send('Invalid email/student_id')
        return;
    }
    if(!check){
        res.send('Invalid email/student_id')
        return;
    }

    const signUser = jwt.sign({id:existingStudent._id}, process.env.JWT_SECRET, {expiresIn: "3hr"})
    return res.cookie("e_token", signUser, {
        httpOnly: true,
        secure:false
    }).send('Student Login success')
})

const authorization = async function(req, res, next){
    const token = req.cookies.e_token
    if(!token){
        return res.send('No token found')
    }

    const verification = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await student.findById(verification.id)

    if(!verification){
        return res.status(403).send('Forbidden')
    }

    next();
}

route.get('/notices', authorization, async(req, res)=>{
    const studentClass = req.user.classOfStudent
    
 const getMessage = await message.aggregate([{$match:{classOf: studentClass}}]).sort({date_created: -1})
 if(getMessage===0 || getMessage.length=== 0){
    res.send('no notice')
    return;
 }
 res.send(getMessage);
})


route.get('/studentMarks', authorization, async (req, res)=>{
const result = await marks.aggregate([{
    $match:{classOfteacher:req.user.classOfStudent, name:req.user.name}
}])

if(result.length === 0){
    res.send('No marks for you')
    return
}

res.send(result);

})



module.exports = route

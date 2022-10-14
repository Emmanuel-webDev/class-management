const student = require('../Model/studentAuth')
const marks =require('../Model/marks')
const message = require('../Model/notice')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//login student
async function login(req, res){
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

    res.send('Student Login success')
}

//notice
async function notice(req, res){
    const search = await student.findOne({name: req.body.name})
    req.user = search.classOf
    console.log(req.user)

 const getMessage = await message.aggregate([{$match:{classOf:req.user}}]).sort({date_created: -1})
 if(getMessage===0 || getMessage.length=== 0){
    res.send('no notice')
    return;
 }
 res.send(getMessage);
}

//getmarks
async function getMarks(req, res){
const teacher = await student.findOne({name: req.body.name})
req.user = teacher.classOf
console.log(req.user)

const result = await marks.aggregate([{
    $match:{classOf:req.user, name:req.body.name}
}])

if(result.length === 0){
    res.send('no marks')
    return
}

res.send(result);

}


module.exports={
    login: login,
    getMarks: getMarks,
    notice:notice
}

const user = require('../Model/auth')
const marks =require('../Model/marks')
const message = require('../Model/notice')
const student = require('../Model/studentAuth')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function signup(req, res){
   const {name, email, classOf, password} = req.body
   
   if(!(name && email && classOf && password)){
    res.send('fields required')
   }

   const hashed = await bcrypt.hash(password, 12)
   req.body.password = hashed;

   const userSigned = await user.findOne({email: email})
   if(userSigned){
    res.send("User already exists")
    return
   }

   const newUser = new user({
    name: req.body.name,
    email: req.body.email,
    classOf: req.body.classOf,
    password: req.body.password
   })
   
   await newUser.save()
   res.send(newUser)

}

//login
async function login(req, res){
   const email = req.body.email
   const password = req.body.password

   //validation
   const existingUser = await user.findOne({email : email})

   const compare = await bcrypt.compare(password, existingUser.password)
   if(!existingUser.email && !compare){
    res.send('Creditentials Invalid')
    return
   }

   //authenticating users
   const token = jwt.sign({id:existingUser._id, email:existingUser.email}, process.env.JWT_SECRET, {expiresIn: '24h'})
   
   if(!token){
    return res.send('Token not registered')
   }

   res.cookie("e_token", token, {
    httpOnly: true,
    secure: false
   }).send({data:'Login success',  token})
}
//token verification
function verify(req, res, next){
    const token = req.cookies.e_token
    const verify  = jwt.verify(token, process.env.JWT_SECRET);

    if(!verify){
        return res.send("User not verified")
    }

    next()
}

//create Marks
async function createMarks(req, res){
    const studentMarks = new marks(req.body)
    await studentMarks.save();
    res.send(studentMarks)
}

//update Marks
async function updateMark(req, res){
    const edit = await marks.findByIdAndUpdate({_id:req.params.id}, {
        name: req.body.name,
        subject: req.body.subject,
        score: req.body.score,
        semester: req.body.semester,
        markType: req.body.markType,
    })
    res.send(edit);
}

//deleting Marks
async function del(req, res){
    const terminate = await marks.findByIdAndRemove({_id:req.params.id})
    res.send("Mark deleted")
}

//create notice
async function notice(req, res){
   const messages = new message({
    title:req.body.title,
    message: req.body.message,
    date_Created: new Date()
    //classOf: req.body.classOf
})
   await messages.save();
   res.send(messages)
}

//Add students
async function addStudent(req, res){
    const {name, email, student_id, classOf} = req.body
    const hashed = await bcrypt.hash(student_id, 12)
    req.body.student_id = hashed
    
    const signstudent = new student({
        name: req.body.name,
        email: req.body.email,
        student_id: req.body.student_id,
        classOf: req.body.classOf
    })
    await signstudent.save()
    res.send(signstudent)
}


module.exports={
    signup: signup,
    login:login,
    createMarks: createMarks,
    notice: notice,
    updateMark:updateMark,
    del: del,
    addStudent: addStudent,
    verify: verify
}

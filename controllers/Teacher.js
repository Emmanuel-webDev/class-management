const express = require('express')
const user = require('../Model/auth')
const marks =require('../Model/marks')
const message = require('../Model/notice')
const student = require('../Model/studentAuth')
const bcrypt = require('bcryptjs')
const cookie = require('cookie-parser')
const jwt = require('jsonwebtoken')
const route = express.Router()

route.use(cookie())

route.get('/', (req, res)=>{
    res.render('./Teacher/signup');
})

route.post('/', async (req, res)=>{
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

   //const classOccupied = await user.findOne({classOf: req.body.classOf})
   //if(classOccupied){
    //res.send("Class already registered with a teacher")
    //return;
   //}

   const newUser = new user({
    name: req.body.name,
    email: req.body.email,
    classOf: req.body.classOf,
    isTeacher: req.body.isTeacher,
    password: req.body.password
   })
   
   await newUser.save()
   res.redirect('/signin')

})

route.get('/signin', (req, res)=>{
    res.render('./Teacher/login')
})

route.post('/login', async (req, res)=>{
   const email = req.body.email
   const password = req.body.password

   //validation
   const existingUser = await user.findOne({email : email})

   const compare = await bcrypt.compare(password, existingUser.password)
   if(!existingUser.email && !compare){
    res.send('Creditentials Invalid')
    return
   }

   console.log(existingUser.classOf)

   //authenticating users
   const token = jwt.sign({id:existingUser._id, classOf:existingUser.classOf}, process.env.JWT_SECRET, {expiresIn: '3d'})
   
   if(!token){
    return res.send('Token not registered')
   }

   if(existingUser.isTeacher === 'on'){
     return res.cookie("access_token", token, {
    httpOnly: true,
    secure: false
   }).redirect('/dashboard')
   }

   return res.redirect('/');
   
})


const verification = async (req, res, next)=>{
    const token = req.cookies.access_token
    if(!token){
        return res.status(403).send('unauthorized activity ');
    }
    const verify  = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await user.findById(verify.id)

    if(!verify){
        return res.send("User not verified")
    }

    next()
}

route.get('/dashboard', verification, async(req, res)=>{
  const profile = await user.findOne({_id: req.user})
  res.render('./Teacher/dashboard', {profiles : profile})
})

route.get('/createMark', verification, (req, res)=>{
    res.render('./Teacher/Createmark')
})

route.post('/createMarks', verification, async(req, res)=>{
    const studentMarks = new marks({
        name: req.body.name,
        subject: req.body.subject,
        score: req.body.score,
        semester: req.body.semester,
        markType: req.body.markType,
        classTeacherID: req.user._id,
        classOfteacher: req.user.classOf
    })
    await studentMarks.save();
    res.redirect('/marks')
})

route.get('/marks', verification, async(req, res)=>{
    const getMark = await marks.aggregate([{
        $match:{classTeacherID: req.user._id}
    }])
    res.render('./Teacher/Marks', {getMarks: getMark})
})


route.post('/notice', verification, async(req, res)=>{
    const messages = new message({
     title:req.body.title,
     message: req.body.message,
     date_Created: new Date(),
     classOfteacher: req.user.classOf
 })
    await messages.save();
    res.send(messages)
 })

 route.post('updateMessage/:id', verification, async(req,res)=>{
    const update = await message.findByIdAndUpdate({_id: req.params.id}, {
        title: req.body.title,
        message: req.body.message,
        date_Created: new Date(),
        classOfteacher: req.user.classOf
    })

    res.send(update);
 })

 route.post('delMessage/:id', verification, async(req, res)=>{
    const remove = await message.findByIdAndRemove({_id: req.params.id})
 })

 route.get('/update/:id', verification, (req, res)=>{
    res.render('./Teacher/update')
 })

route.post('/updateMark/:id', verification, async(req, res)=>{
    const edit = await marks.findByIdAndUpdate({_id:req.params.id}, {
        name: req.body.name,
        subject: req.body.subject,
        score: req.body.score,
        semester: req.body.semester,
        markType: req.body.markType,
    })
    res.send(edit);
})

route.post('/delMark/:id', verification,  async(req, res)=>{
    const terminate = await marks.findByIdAndRemove({_id:req.params.id})
    res.send("Mark deleted")
})

route.get('/createStudent', verification, (req, res)=>{
    res.render('./Teacher/newStudent')
})

route.post('/newStudent',verification, async (req, res)=>{
    const {name, email, student_id, classOfStudent, courses} = req.body
    const hashed = await bcrypt.hash(student_id, 12)
    req.body.student_id = hashed

//get teachers class from the verification
const teacherClass = req.user.classOf

    const signstudent = new student({
        name: req.body.name,
        email: req.body.email,
        student_id: req.body.student_id,
        courses: req.body.courses,
        classOfStudent:req.body.classOfStudent
    })


    //teachers cant create class for other student
    if(teacherClass !== signstudent.classOfStudent){
        return res.send('cant create student for other class')
    }

    //unique students
    const studentexist = await student.findOne({name:name})
    if(studentexist){
        return res.send('Student already exists')
    }

    await signstudent.save()
    res.redirect('/Students')
})

route.get('/Students', verification, async(req, res)=>{
    const allStudent = await student.aggregate([{
        $match:{classOfStudent: req.user.classOf}
    }])

    if(allStudent.length === 0){
        res.send('Students not registered')
    }

    res.status(200).render('./Teacher/students', {students: allStudent})
})

route.post('/logout', verification, async(req, res)=>{
    return res.clearCookie('access_token').redirect('/')
})


module.exports= route






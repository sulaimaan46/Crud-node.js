const express = require('express')
const { default: mongoose } = require('mongoose')

const User = require('./model')

const app = express()
const port = 3000


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect('mongodb://localhost:27017/user-list');

mongoose.connection.once('open',function(){
    console.log('DB connected');
  }).on('error',function(error){
    console.log('error is:',error)
  })

app.post('/create-user',async(req, res)=>{
try{

    const userData =  new User({
        name: req.body.name,
        age: req.body.age
    })
    console.log(userData)
    await userData.save((err, response)=>{
        if(err){
            return res.json({
                error: err
            })
        }
        return res.json({
            data: response
        })

    })

}catch(error){
    return res.json({err: error})
}
})

app.get('/get-users',async(req,res)=>{
    try{
    const allUser = await User.find().select('-_id name').exec()
    if(allUser){
        return res.json({
            data: allUser
        })
    }
    }
    catch(err){
        return res.json({error: err})
    }
})


app.get('/get-users-by-id/:id',async(req,res)=>{
    try{
    const singleUserData = await User.findById(req.params.id).exec()
    if(singleUserData){
        return res.json({
            data: singleUserData
        })
    }
    }
    catch(err){
        return res.json({error: err})
    }
})

app.patch('/update-users-by-id/:id',async(req,res)=>{
    try{
        const id  = req.params.id
        const updates = {
            name : req.body.name
        }
        const options = {
            new: true
        }
    const singleUserData = await User.findByIdAndUpdate(id,updates, options).exec()
    if(singleUserData){
        return res.json({
            data: singleUserData
        })
    }
    }
    catch(err){
        return res.json({error: err})
    }
})

app.delete('/delete-by-id/:id',async(req,res)=>{
    try{
        const id  = req.params.id

    const singleUserData = await User.findByIdAndDelete({_id: id}).exec()
    if(singleUserData){
        return res.json({
            data: "success"
        })
    }
    }
    catch(err){
        return res.json({error: err})
    }
})
app.listen(port,()=>{
    console.log(`App is listening on ${port}`)

})
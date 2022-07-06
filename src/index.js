const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const route = require('./route/route')

const app = express()
app.use(bodyParser.json())

const url = ""
const port = process.env.PORT || 3000

mongoose.connect(url,{useNewUrlParser:true})
.then(()=>console.log("mongoDB is connected"))
.catch((error)=>console.log(error))

app.use('/',route)

app.listen(port,function(){
    console.log("express app is running on PORT"+(port))
})





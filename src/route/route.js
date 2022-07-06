const express = require('express');
const router = express.Router();
const userController=require("../controller/usercontroller")
const bookcontroller=require("../controller/bookcontroller")
const userModel = require("../models/userModel")
const validator=require("../validator/validator")


router.post('/register', userController.createUser)




module.exports=router;
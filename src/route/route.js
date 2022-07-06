const express = require('express');
const router = express.Router();
const userController=require("../controller/usercontroller")
const bookcontroller=require("../controller/bookcontroller")
const reviewController=require("../controller/reviewcontroller")
const userModel = require("../models/userModel")
const validator=require("../validator/validator")


router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/books/:bookId/review', reviewController.createReviewByParams)




module.exports=router;
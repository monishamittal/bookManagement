const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const validator=require("../validator/validator")
const jwt=require("jsonwebtoken")
const reviewModel = require("../models/reviewModel")


const createReviewByParams= async function(req,res){
    let review=req.body
    let book_Id=req.params.bookId
    

    let reviewData= await reviewModel.create(review)
    res.status(201).send({status:true,message:"Success",data:reviewData})
}

module.exports={createReviewByParams}
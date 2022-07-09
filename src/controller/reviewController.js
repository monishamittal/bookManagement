const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
//const validator = require("../validator/validator")
//const jwt = require("jsonwebtoken")
const reviewModel = require("../models/reviewModel")

const { isValidObjectId, isValidRequestBody, isValid } = require('../validator/validator')

const createReviewByParams = async function (req, res) {
    //===============================first check params===========================>
    let bookId = req.params.bookId
    if (isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "Book id number is not valid" })

    const checkbookId = await bookModel.findById(bookId)
    if (!checkbookId)
        return res.status(404).send({ status: false, message: "book Id is not found" })

    if (checkbookId.isDeleted == true)
        return res.status(404).send({ status: false, message: "bookId is not found or might be deleted" })


    //============================= form req.body======================================>

    let body = req.body
    //===================destructuring==============================================>
    const { reviewedBy, rating, review } = body
    //========================check valid body======================================>
    if (isValidRequestBody.body)
        return res.status(400).send({ satus: false, message: "please provide data" })
    //=========================check reviewer =======================================>
    if (!reviewedBy)
        return res.status(400).send({ status: false, message: "please provide review name" })
    //==================================check alphabetic character====================>
    if (!isValid.reviewedBy)
        return res.status(400).send({ status: false, message: "please give alphabetic character" })
    //====================================review========================================>
    if (!review)
        return res.status(400).send({ status: false, message: "please provide review" })
    //==========================check alphabetic character for review=============>
    if (!isValid.review)
        return res.status(400).send({ status: false, message: "please give alphabetic character" })


    if (!rating)
        return res.status(400).send({ status: false, message: "please provide rating" })
    if (!(rating < 6) && (rating > 0))
        return res.status(400).send({ status: false, message: "please type 1 to 5 number only" })

    body.bookId = bookId

    let reviewData = await reviewModel.create(body)
    await bookModel.updateOne({ _id: bookId }, { $inc: { reviews: 1 } })
    res.status(201).send({ status: true, message: "Success", data: reviewData })
}



const updateReviewByParams = async function (res, res) {
    const bookReviewId = req.params
    const { bookId, reviewId } = bookReviewId
    //=============================bookId check=======================================>
    if (isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "bookId is not valid" })
    const checkBookId = await bookModel.findById(bookId)
    if (!checkBookId)
        return res.status(404).send({ status: false, message: "book Id is not found" })
    //=================================isdeleted check============================>
    if (checkBookId.isDeleted === true)
        return res.status(404).send({ status: false, message: "Data is not found or might be deleted" })
    //============================review id check ==============================================>
    if (isValidObjectId(reviewId))
        return res.status(400).send({ status: false, message: "reviewId is not valid" })
    const checkReviewId = await reviewModel.findById(reviewId)
    if (!checkReviewId)
        return res.status(404).send({ status: false, message: "review Id is not found" })
    //=============================== body ========================================>
    const body = req.body
    //const { review, rating, reviewedBy } = body
    const updateData = await reviewModel.findOneAndUpdate(body, { new: true })
    res.status(200).send({ status: true, message: "Success", data: updateData })

}


const deleteByparams = async function (req, res) {
    const bookReviewId = req.params
    const { bookId, reviewId } = bookReviewId
    //=============================bookId check=======================================>
    if (isValidObjectId(bookId))
        return res.status(400).send({ status: false, message: "BookId is not valid" })
    const checkBookId = await bookModel.findById(bookId)
    if (!checkBookId)
        return res.status(404).send({ status: false, message: "Book Id is not found" })
    //=================================================================================>
    //const checkBookName = await bookModel.findById(bookId)
    if (!checkBookId.title)
        return res.status(404).send({ status: false, message: "Book name is not present" })

    //============================review id check ==============================================>
    if (isValidObjectId(reviewId))
        return res.status(400).send({ status: false, message: "reviewId is not valid" })
    const checkReviewId = await reviewModel.findById(reviewId)
    if (!checkReviewId)
        return res.status(404).send({ status: false, message: "Review Id is not found" })
    //const checkReviewName = await reviewModel.findById(reviewId)
    if (!checkReviewId.review)
        return res.status(404).send({ status: false, message: "Review name is not present" })
    //=======================================isDeleted======================================>
    if (checkReviewId.isDeleted === true)
        return res.status(404).send({ status: false, message: "Review might be deleted" })

    const updateDelete = await reviewModel.updateMany({ _id: reviewId }, { $set: { isDeleted: true } }, { new: true })
    await bookModel.updateOne({ _id: bookId }, { $inc: { reviews: -1 } })
    res.status(200).send({ status: true, mesaage: "Success", data: updateDelete })
}




module.exports = { createReviewByParams, updateReviewByParams, deleteByparams }
const bookModel = require("../models/bookModel")
const validator = require("../validator/validator")
const reviewModel = require("../models/reviewModel")

const { isValidObjectId, isValidRequestBody, isValid } = require('../validator/validator')

const createReviewByParams = async function (req, res) {
    try {
        let bookId = req.params.bookId                                   //===first check params=====>
        if (!isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Book id number is not valid" })

        const checkbookId = await bookModel.find({ bookId: bookId, isDeleted: false })
        if (!checkbookId) return res.status(404).send({ status: false, message: "book Id is not found." })
        if (checkbookId.isDeleted == true) return res.status(404).send({ status: false, message: "bookId is not found or might be deleted" })

        let body = req.body                                                                //======== form req.body======>
        const { reviewedBy, rating, review, reviewedAt } = body                            //=========destructuring========>
        if (isValidRequestBody.body) return res.status(400).send({ satus: false, message: "please provide data" })      //===check valid body====>
        if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "please provide review name" }) //=check alphabetic character=>
        if (!review) return res.status(400).send({ status: false, message: "please provide review" })    //============review====>
        if (!isValid(review)) return res.status(400).send({ status: false, message: "please give alphabetic character" })    //=========check alphabetic character for review====================>

        if (!validator.isValid(reviewedAt)) return res.status(400).send({ status: false, message: "Enter reviewedAt" })
        if (!validator.isValidDate(reviewedAt)) return res.status(400).send({ status: false, message: "Enter a valid reviewedAt format - YYYY-MM-DD " })

        if (!rating) return res.status(400).send({ status: false, message: "please provide rating" })
        if (!(rating < 6) && (rating > 0)) return res.status(400).send({ status: false, message: "please type 1 to 5 number only" })

        body.bookId = bookId
        let reviewData = await reviewModel.create(body)
        await bookModel.updateOne({ _id: bookId }, { $inc: { reviews: 1 } })
        res.status(201).send({ status: true, message: "Success", data: reviewData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const updateReviewByParams = async function (req, res) {
    try {
        const bookReviewId = req.params
        const { bookId, reviewId } = bookReviewId

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })      //====bookId check====>
        const checkBookId = await bookModel.findById(bookId)
        if (!checkBookId) return res.status(404).send({ status: false, message: "book Id is not found" })
        //===isdeleted check==>
        if (checkBookId.isDeleted === true) return res.status(404).send({ status: false, message: "Data is not found or might be deleted" })

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not valid" })    //===review id check=====>
        const checkReviewId = await reviewModel.findById(reviewId)
        if (!checkReviewId) return res.status(404).send({ status: false, message: "review Id is not found" })

        const body = req.body                     //==== body ============>
        const { review, rating, reviewedBy } = body
        if (!(rating < 6) && (rating > 0)) return res.status(400).send({ status: false, message: "please give rating between 1 to 5" })

        await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { review, rating, reviewedBy } }, { new: true })
        let getReviewdata = await reviewModel.find({ _id: reviewId, isDeleted: false })                      //=====fetch reviews detail===>
        if (!getReviewdata) { return res.status(404).send({ status: false, msg: "Review data not present for this bookId." }) }

        Object.assign(checkBookId._doc, { reviewsData: getReviewdata });              //====reviewsData check======>
        res.status(200).send({ status: true, message: "Book List", data: checkBookId });
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const deleteByparams = async function (req, res) {
    try {
        const bookReviewId = req.params
        const { bookId, reviewId } = bookReviewId

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "BookId is not valid" })  //===bookId check====>

        const checkBookId = await bookModel.findById(bookId)
        if (!checkBookId) return res.status(404).send({ status: false, message: "Book Id is not found" })
        if (!checkBookId) return res.status(404).send({ status: false, message: "Book name is not present" })

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "reviewId is not valid" }) //====review id check ===>

        const checkReviewId = await reviewModel.findById(reviewId)
        if (!checkReviewId) return res.status(404).send({ status: false, message: "Review Id is not found" })
        if (!checkReviewId.review) return res.status(404).send({ status: false, message: "Review name is not present" })
        if (checkReviewId.isDeleted === true) return res.status(404).send({ status: false, message: "Review might be deleted" }) //===isDeleted=====>

        const updateDelete = await reviewModel.updateMany({ _id: reviewId }, { $set: { isDeleted: true } }, { new: true })
        await bookModel.updateOne({ _id: bookId }, { $inc: { reviews: -1 } })
        res.status(200).send({ status: true, mesaage: "Successfully deleted", data: `deleted data count = ${updateDelete.modifiedCount}` })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
module.exports = { createReviewByParams, updateReviewByParams, deleteByparams }
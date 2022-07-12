const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator")
const mongoose = require("mongoose");

const createBook = async function (req, res) {
    try {
        let body = req.body;                 // -------body ----------------->
        const { userId, title, excerpt, category, subcategory, ISBN, releasedAt } = body
        if (validator.isValidRequestBody.body) return res.status(400).send({ status: false, message: "Please provide data" });

        if (!validator.isValid(title)) return res.status(400).send({ status: false, message: "Please provide title" });    //-----title--->

        let titleCheck = await bookModel.findOne({ title: title })
        if (titleCheck) return res.status(400).send({ status: false, message: "Title already in used" })

        if (!validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "Please provide excerpt" });   //-----excerpt-->

        if (!validator.isValid(userId)) return res.status(400).send({ status: false, message: "Please provide userId" }); //-------userId------>

        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })
        let userIdcheck = await userModel.findById(body.userId)
        if (!userIdcheck) return res.send({ status: false, mesaage: "UserId not found" })

        //Authorization-if the user doesn't created the book, then won't be able to Update it.
        if (userId != req.userId) {
            return res.status(401).send({ status: false, message: "Unauthorized access." })
        }

        if (!ISBN) return res.status(400).send({ status: false, message: "Please provide ISBN" });       //------ISBN----------->

        if (!validator.isvalidISBN(ISBN)) return res.status(400).send({ status: false, message: "Please provide valid ISBN" });
        let ISBNCheck = await bookModel.findOne({ ISBN: body.ISBN })              //--------ISBN checking ----------->
        if (ISBNCheck) return res.status(400).send({ status: false, mesaage: "ISBN is already used" })

        if (!validator.isValid(category)) return res.status(400).send({ status: false, message: "Please provide category" });   //---category----->

        if (!validator.isValid(subcategory)) return res.status(400).send({ status: false, mesaage: "Please provide subcategory" });//-subcategory->

        if (!validator.isValid(releasedAt)) return res.status(400).send({ status: false, message: "Enter releasedAt" })      //---releasedAt---->
        if (!validator.isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Enter a valid releasedAt format - YYYY-MM-DD " })
        const releasedDate = new Date().toLocaleDateString("af-ZA")
        body.releasedAt = releasedDate

        let createData = await bookModel.create(body);
        res.status(201).send({ status: true, message: "Success", data: createData });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

const getBook = async function (req, res) {
    try {
        const queryParams = req.query
        const { userId, category, subcategory } = queryParams

        //Validation for invalid userId in params
        if (userId) {
            if (!(userId.length == 24)) return res.status(400).send({ status: false, message: "Invalid userId in params." })
        }

        //Combinations of query params.
        if (userId || category || subcategory) {

            let obj = {};
            if (userId) { obj.userId = userId }
            if (category) { obj.category = category; }
            if (subcategory) { obj.subcategory = subcategory }
            obj.isDeleted = false

            //Searching books according to the request 
            const books = await bookModel.find(obj).select({ subcategory: 0, ISBN: 0, isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 }).sort({ title: 1 });
            const countBooks = books.length
            //If no found by the specific combinations revert error msg ~-> No books found.
            if (books == false) {
                return res.status(404).send({ status: false, message: "No books found" });
            } else res.status(200).send({ status: true, message: `${countBooks} books found.`, data: books })
        } else return res.status(400).send({ status: false, message: "No filters applied." });

    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

const getBookByParams = async function (req, res) {
    try {
        let bookid = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookid)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of bookId' }) }
        let getBookData = await bookModel.findById({ _id: bookid })
        if (!getBookData) { return res.status(404).send({ status: false, msg: "bookId  not found" }) }
        if (getBookData.isDeleted == true) return res.status(400).send({ status: false, message: "Book has been already deleted." })

        let getReviewdata = await reviewModel.find({ bookId: bookid, isDeleted: false })
        if (!getReviewdata) return res.status(404).send({ status: false, msg: "Review data not present for this bookId." })

        Object.assign(getBookData._doc, { reviewsData: getReviewdata });
        res.status(200).send({ status: true, message: "Book List", data: getBookData });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

const updateBookByParams = async function (req, res) {
    try {
        let bookId = req.params.bookId;

        let userData = await bookModel.findById(bookId)
        if (!validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Invalid bookId." }) }

        //Authorization-if the user doesn't created the book, then won't be able to Update it.
        if (userData.userId != req.userId) { return res.status(401).send({ status: false, message: "Unauthorized access." }) }
        //======isdeleted check=======>
        if (userData.isDeleted === true) return res.status(404).send({ status: false, message: "Data is not found or might be deleted" })

        let body = req.body;  //==body =======>
        const { title, excerpt, ISBN, releasedAt } = body
        if (!validator.isValidRequestBody(body)) return res.status(400).send({ status: false, message: "Please provide data" });

        if (!validator.isValid(title)) return res.status(400).send({ status: false, message: "Please provide title" });  //<====title check==>
        let checktitle = await bookModel.findOne({ title: title });
        if (checktitle) return res.status(400).send({ status: false, message: "Title Already Exits" });

        if (!validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "Please provide excerpt." });  //<==excerpt check==>
        let checkexcerpt = await bookModel.findOne({ excerpt: excerpt });
        if (checkexcerpt) return res.status(400).send({ status: false, message: "excerpt Already Exits" });

        if (!validator.isValid(ISBN)) return res.status(400).send({ status: false, message: "Please provide ISBN." })  //<==ISBN valid check==>
        if (!validator.isvalidISBN(ISBN)) return res.status(400).send({ status: false, message: "Please provide valid ISBN" });

        let checkISBN = await bookModel.findOne({ ISBN: body.ISBN });    //===ISBN db call for check unique==>
        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN Already Exits" });

        if (!validator.isValid(releasedAt)) return res.status(400).send({ status: false, message: "Enter releasedAt" })
        if (!validator.isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "Enter a valid releasedAt format - YYYY-MM-DD " })

        let updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { title, excerpt, ISBN, releasedAt } }, { releasedAt: new Date, new: true });
        res.status(200).send({ status: true, message: "Success", data: updateData });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

const deleteBookByParams = async function (req, res) {
    try {
        const params = req.params.bookId;
        //validation for Invalid params.
        if (!validator.isValidObjectId(params)) return res.status(400).send({ status: false, message: "Invalid bookId" })

        //finding the book which user wants to delete
        const findBook = await bookModel.findById({ _id: params })
        if (!findBook) return res.status(404).send({ status: false, message: "No book find by params" })

        //Authorization-if the user doesn't created the book, then won't be able to delete it.
        else if (findBook.userId != req.userId) return res.status(401).send({ status: false, message: "Unauthorized access." })

        //Book is already deleted
        else if (findBook.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book has been already deleted." })
        } else {                        //if isDeleted:false, then change the isDeleted:true, and remove all the reviews of the book.
            let getData = await bookModel.findOneAndUpdate({ _id: { $in: findBook } }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true }).select({ _id: 1, title: 1, isDelete: 1, deletedAt: 1 });
            await reviewModel.updateMany({ bookId: params }, { isDeleted: true, deletedAt: new Date() })
            res.status(200).send({ status: true, message: "Success", data: getData });
        }
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = { createBook, getBook, getBookByParams, updateBookByParams, deleteBookByParams };
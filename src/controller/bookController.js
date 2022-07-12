const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator")
const { default: mongoose } = require("mongoose");
// const { findOneAndUpdate } = require("../models/bookModel");
//const ObjectId = mongoose.Types.ObjectId

const createBook = async function(req, res) {
    try {
        // body ------------------------------------------------------------------------------------------------>
        let body = req.body;



        const { userId, title, excerpt, category, subcategory, ISBN, releasedAt } = body
        // console.log(body)
        if (validator.isValidRequestBody.body)
            return res.status(400).send({ status: false, message: "Please provide data" });
        //title------------------------------------------------------------------------------------------->
        if (!validator.isValid(title))
            return res.status(400).send({ status: false, message: "Please provide title" });

        let titleCheck = await bookModel.findOne({ title: title })
        if (titleCheck)
            return res.status(400).send({ status: false, message: "Title already in used" })
                //excerpt------------------------------------------------------------->
        if (!validator.isValid(excerpt))
            return res.status(400).send({ status: false, message: "Please provide excerpt" });
        //userId--------------------------------------------------------------->
        if (!validator.isValid(userId))
            return res.status(400).send({ status: false, message: "Please provide userId" });


        // if (!validator.isValid(userId)) return res.status(400).send({ status: false, message: "Empty userId" });

        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })
        let userIdcheck = await userModel.findById(body.userId)
            //  console.log(userIdcheck)
        if (!userIdcheck)
            return res.send({ status: false, mesaage: "UserId not found" })

        //Authorization-if the user doesn't created the book, then won't be able to Update it.
        if (userId != req.userId) {
            return res.status(401).send({
                status: false,
                message: "Unauthorized access."
            })
        }
        //ISBN------------------------------------------------------------------->
        if (!ISBN)
            return res.status(400).send({ status: false, message: "Please provide ISBN" });

        if (!validator.isvalidISBN(ISBN))
            return res.status(400).send({ status: false, message: "Please provide valid ISBN" });
        //ISBN checking ---------------------------------------------------------->
        let ISBNCheck = await bookModel.findOne({ ISBN: body.ISBN })
        if (ISBNCheck)
            return res.status(400).send({ status: false, mesaage: "ISBN is already used" })
                //category----------------------------------------------------------------->
        if (!validator.isValid(category))
            return res.status(400).send({ status: false, message: "Please provide category" });
        //subcategory---------------------------------------------------------------->
        if (!validator.isValid(subcategory))
            return res.status(400).send({ status: false, mesaage: "Please provide subcategory" });
        //releasedAt--------------------------------------------------------------------->
        // if (!releasedAt)
        //   return res.status(400).send({ status: false, message: "Please provide releasedAt" });

        if (!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter releasedAt" })
        }
        if (!validator.isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter a valid releasedAt format - YYYY-MM-DD " })
        }


        const releasedDate = new Date().toLocaleDateString("af-ZA")
        body.releasedAt = releasedDate

        let createData = await bookModel.create(body);
        res.status(201).send({ status: true, message: "Success", data: createData });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, message: error.message });
    }
};

const getBook = async function(req, res) {
    try {
        const queryParams = req.query
        const {
            userId,
            category,
            subcategory
        } = queryParams

        //Validation for invalid userId in params
        if (userId) {
            if (!(userId.length == 24)) {
                return res.status(400).send({ status: false, message: "Invalid userId in params." })
            }
        }

        //Combinations of query params.
        if (userId || category || subcategory) {

            let obj = {};
            if (userId) {
                obj.userId = userId
            }
            if (category) {
                obj.category = category;
            }
            if (subcategory) {
                obj.subcategory = subcategory
            }
            obj.isDeleted = false

            //Searching books according to the request 
            const books = await bookModel.find(obj).select({
                    subcategory: 0,
                    ISBN: 0,
                    isDeleted: 0,
                    updatedAt: 0,
                    createdAt: 0,
                    __v: 0
                })
                .sort({
                    title: 1
                });
            const countBooks = books.length

            //If no found by the specific combinations revert error msg ~-> No books found.
            if (books == false) {
                return res.status(404).send({ status: false, message: "No books found" });
            } else {
                res.status(200).send({
                    status: true,
                    message: `${countBooks} books found.`,
                    data: books
                })
            }
        } else {
            return res.status(400).send({ status: false, message: "No filters applied." });
        }

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}



// const getBook = async function(req, res) {
//     try {
//         const data = req.query
//         const { userId, category, subcategory } = data
//         // console.log(data);


//         let obj = { isDeleted: false }

//         obj.userId = userId
//         if ((!validator.isValid(userId)) || (!validator.isValidObjectId(userId))) {
//             return res.status(400).send({ status: false, msg: "Please provide UserId." })
//         }

//         let userData = await userModel.findById(userId)
//         if (!userData) return res.status(404).send({ status: false, msg: "UserId not valid." })

//         if (validator.isValid(category)) { obj.category = category }
//         if (validator.isValid(subcategory)) { obj.subcategory = { $in: subcategory } }

//         let find = await bookModel.find(obj).select({ ISBN: 0, subcategory: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, _v: 0 }).sort({ title: 1 })
//         if (find.length == 0) return res.status(404).send(({ status: false, message: "no such book found" }))
//         res.status(200).send({ status: true, data: find })

//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send({ status: false, message: error.message });
//     }
// };

const getBookByParams = async function(req, res) {
    try {
        let bookid = req.params.bookId
            // if(!bookid){return res.status(400).send({status:false,messsage:"BookId must be provided"})}

        if (!mongoose.Types.ObjectId.isValid(bookid)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of bookId' }) }
        let getBookData = await bookModel.findById({ _id: bookid })
        if (!getBookData) { return res.status(404).send({ status: false, msg: "bookId  not found" }) }

        if (getBookData.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book has been already deleted." })
        }
        let getReviewdata = await reviewModel.find({ bookId: bookid, isDeleted: false })
        if (!getReviewdata) { return res.status(404).send({ status: false, msg: "Review data not present for this bookId." }) }

        Object.assign(getBookData._doc, { reviewsData: getReviewdata });
        res.status(200).send({ status: true, message: "Book List", data: getBookData });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, message: error.message });
    }
};

const updateBookByParams = async function(req, res) {
    try {
        let bookId = req.params.bookId;

        let userData = await bookModel.findById(bookId)
            // console.log(userId)

        if (!validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Invalid bookId." }) }
        // const checkBookId = await bookModel.findById(bookId)
        // if (!checkBookId)
        //     return res.status(404).send({ status: false, message: "book Id is not found" })



        //Authorization-if the user doesn't created the book, then won't be able to Update it.
        if (userData.userId != req.userId) { return res.status(401).send({ status: false, message: "Unauthorized access." }) }
        //=================================isdeleted check============================>
        if (userData.isDeleted === true)
            return res.status(404).send({ status: false, message: "Data is not found or might be deleted" })
                //===================================body ================================>
        let body = req.body;
        const { title, excerpt, ISBN, releasedAt } = body
        if (!validator.isValidRequestBody(body)) return res.status(400).send({ status: false, message: "Please provide data" });
        //<===============================title check======================================>
        if (!validator.isValid(title)) return res.status(400).send({ status: false, message: "Please provide title" });

        let checktitle = await bookModel.findOne({ title: title });
        if (checktitle) return res.status(400).send({ status: false, message: "Title Already Exits" });
        //<==================================excerpt check =====================================>

        if (!validator.isValid(excerpt)) return res.status(400).send({ status: false, message: "Please provide excerpt." });
        let checkexcerpt = await bookModel.findOne({ excerpt: excerpt });
        if (checkexcerpt) return res.status(400).send({ status: false, message: "excerpt Already Exits" });

        //<=====================================ISBN valid check ==================================>

        if (!validator.isValid(ISBN)) return res.status(400).send({ status: false, message: "Please provide ISBN." })
        if (!validator.isvalidISBN(ISBN)) return res.status(400).send({ status: false, message: "Please provide valid ISBN" });
        //================================ISBN db call for check unique=============================>

        let checkISBN = await bookModel.findOne({ ISBN: body.ISBN });
        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN Already Exits" });

        if (!validator.isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter releasedAt" })
        }
        if (!validator.isValidDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter a valid releasedAt format - YYYY-MM-DD " })
        }


        //==========================================================================================>
        // if (!validator.isValidName(body.excerpt) || !validator.isValidName(body.category) || !validator.isValidName(body.subcategory) || !validator.isValid(body.excerpt) || !validator.isValid(body.category) || !validator.isValid(body.subcategory)) {
        //   return res.status(400).send({ status: false, message: "Data should not contain Numbers in excerpt,category &subcategory" });
        // }

        let updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: { title, excerpt, ISBN, releasedAt } }, { releasedAt: new Date, new: true });
        res.status(200).send({ status: true, message: "Success", data: updateData });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, message: error.message });
    }
};





const deleteBookByParams = async function(req, res) {
    try {
        const params = req.params.bookId;
        // const body=req.decodedtoken
        // console.log(body)

        //validation for Invalid params.
        if (!validator.isValidObjectId(params)) {
            return res.status(400).send({ status: false, message: "Invalid bookId" })
        }

        //finding the book which user wants to delete
        const findBook = await bookModel.findById({ _id: params })
        if (!findBook) {
            return res.status(404).send({ status: false, message: "No book find by params" })

        }
        // 
        //Authorization-if the user doesn't created the book, then won't be able to delete it.
        else if (findBook.userId != req.userId) {
            return res.status(401).send({
                status: false,
                message: "Unauthorized access."
            })
        }


        //Book is already deleted
        else if (findBook.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book has been already deleted." })
        } else {


            //if isDeleted:false, then change the isDeleted:true, and remove all the reviews of the book.
            let getData = await bookModel.findOneAndUpdate({ _id: { $in: findBook } }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true }).select({ _id: 1, title: 1, isDelete: 1, deletedAt: 1 });

            await reviewModel.updateMany({ bookId: params }, { isDeleted: true, deletedAt: new Date() })

            res.status(200).send({ status: true, message: "Success", data: getData });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    createBook,
    getBook,
    getBookByParams,
    updateBookByParams,
    deleteBookByParams,
};
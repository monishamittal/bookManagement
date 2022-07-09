const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator")
const { default: mongoose } = require("mongoose");
//const ObjectId = mongoose.Types.ObjectId

const createBook = async function (req, res) {
  try {
    // body ------------------------------------------------------------------------------------------------>
    let body = req.body;
    const { userId, title, excerpt } = body
    // console.log(body)
    if (validator.isValidRequestBody.body)
      return res
        .status(400)
        .send({ status: false, message: "Please provide data" });

    if (!validator.isValid(userId)) return res.status(400).send({ status: false, message: "Empty userId" });
    if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })
    //title------------------------------------------------------------------------------------------->
    if (!title)
      return res
        .status(400)
        .send({ status: false, message: "Please provide title" });
    let titleCheck = await bookModel.findOne({ title: title })
    if (titleCheck)
      return res.status(400).send({ status: false, message: "Title already in used" })
    //excerpt------------------------------------------------------------->
    if (!excerpt)
      return res
        .status(400)
        .send({ status: false, message: "Please provide excerpt" });
    //userId--------------------------------------------------------------->
    if (!userId)
      return res
        .status(400)
        .send({ status: false, message: "Please proviede userId" });

    let userIdcheck = await userModel.findById(body.userId)
    //  console.log(userIdcheck)
    if (!userIdcheck)
      return res.send({ status: false, mesaage: "UserId not found" })

    //ISBN------------------------------------------------------------------->
    if (!body.ISBN)
      return res
        .status(400)
        .send({ status: false, message: "Please proviede ISBN" });
    //ISBN checking ---------------------------------------------------------->
    let ISBNCheck = await bookModel.findOne({ ISBN: body.ISBN })
    if (ISBNCheck)
      return res.status(400).send({ status: false, mesaage: "ISBN is already used" })
    //category----------------------------------------------------------------->
    if (!body.category)
      return res
        .status(400)
        .send({ status: false, message: "Please proviede category" });
    //subcategory---------------------------------------------------------------->
    if (!body.subcategory)
      return res
        .status(400)
        .send({ status: false, mesaage: "Please proviede subcategory" });
    //releasedAt--------------------------------------------------------------------->
    if (!body.releasedAt)
      return res
        .status(400)
        .send({ status: false, message: "Please proviede releasedAt" });



    let createData = await bookModel.create(body);
    res
      .status(201)
      .send({ status: true, message: "Success", data: createData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};


const getBook = async function (req, res) {
  try {
    const data = req.query
    const { userId, category, subcategory } = data

    let obj = { isDeleted: false }

    if (!validator.isValid(userId) && !validator.isValidObjectId(userId)) {
      obj.userId = userId
    }

    if (validator.isValid(category)) { obj.category = category }
    if (validator.isValid(subcategory)) { obj.subcategory = { $in: subcategory } }

    let find = await bookModel.find(obj).select({ ISBN: 0, subcategory: 0, isDeleted: 0, createdAt: 0, updatedAt: 0, _v: 0 }).sort({ title: 1 })
    if (find.length == 0) return res.status(404).send(({ status: false, message: "no such book found" }))
    res.status(200).send({ status: true, data: find })

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};

const getBookByParams = async function (req, res) {
  try {
    let bookid = req.params.bookId
    // if(!bookid){return res.status(400).send({status:false,messsage:"BookId must be provided"})}

    if (!mongoose.isValidObjectId(bookid)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of bookId' }) }
    let getBookData = await bookModel.findById({ _id: bookid })
    if (!getBookData) { return res.status(404).send({ status: false, msg: "Please enter valid bookId" }) }

    let getReviewdata = await reviewModel.find({ bookId: bookid, isDeleted: false })
    if (!getReviewdata) { return res.status(404).send({ status: false, msg: "Review data not present for this bookId." }) }

    let result = {
      getBook: getBookData,
      getReview: [getReviewdata],
    };

    res.status(200).send({ status: true, message: "Book List", data: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};

const updateBookByParams = async function (req, res) {
  try {
    let bookId = req.params.bookId;

    let userId = await bookModel.findById(bookId).select({ userId: 1 })

    //Authorization-if the user doesn't created the book, then won't be able to Update it.
    if (userId != req.userId) {
      return res.status(401).send({
        status: false,
        message: "Unauthorized access."
      })
    }
    let checkBookId = await bookModel.findById(bookId);
    if (!checkBookId)
      return res
        .status(404)
        .send({ status: false, message: "Data  not found" });
    if (checkBookId.isDeleted == true)
      return res.status(404).send({
        status: false,
        message: "Data not found and might be deleted",
      });
    //===================================body ================================>
    let body = req.body;
    if (!validator.isValidRequestBody(body))
      return res
        .status(400)
        .send({ status: false, message: "please provied data" });

    //<===============================title check======================================>
    let checktitle = await bookModel.findOne({ title: body.title });
    if (checktitle)
      return res
        .status(400)
        .send({ status: false, message: "Title Already Exits" });
    //<==================================excerpt check =====================================>
    let checkexcerpt = await bookModel.findOne({ excerpt: body.excerpt });
    if (checkexcerpt)
      return res
        .status(400)
        .send({ status: false, message: "excerpt Already Exits" });

    //<=====================================ISBN valid check ==================================>
    if (body.ISBN)
      if (!validator.isvalidISBN(body.ISBN))
        return res
          .status(400)
          .send({ status: false, message: "ISBN is invalid" });
    //================================ISBN db call for check unique=============================>
    let checkISBN = await bookModel.findOne({ ISBN: body.ISBN });
    if (checkISBN)
      return res
        .status(400)
        .send({ status: false, message: "ISBN Already Exits" });

    //==========================================================================================>
    if (!validator.isValidName(body.excerpt) || !validator.isValidName(body.category) || !validator.isValidName(body.subcategory) || !validator.isValid(body.excerpt) || !validator.isValid(body.category) || !validator.isValid(body.subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Data should not contain Numbers in excerpt,category &subcategory" });
    }



    let updateData = await bookModel.findByIdAndUpdate({ _id: bookId }, body, {
      new: true,
    });
    res
      .status(200)
      .send({ status: true, message: "Success", data: updateData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};


const deleteBookByParams = async function (req, res) {
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

const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator")
const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const createBook = async function (req, res) {
    try {
      // body ------------------------------------------------------------------------------------------------>
      let body = req.body;
      // console.log(body)
      if (validator.isValidRequestBody.body)
        return res
          .status(400)
          .send({ status: false, message: "please provided data" });
      //title------------------------------------------------------------------------------------------->
      if (!body.title)
        return res
          .status(400)
          .send({ status: false, message: "please provided title" });
         let titleCheck = await bookModel.findOne({title:body.title})
         if(titleCheck)
         return res.status(400).send({status:false,message:"title already in used"})
      //excerpt------------------------------------------------------------->
      if (!body.excerpt)
        return res
          .status(400)
          .send({ status: false, message: "please provided excerpt" });
      //userId--------------------------------------------------------------->
      if (!body.userId)
        return res
          .status(400)
          .send({ status: false, message: "please provieded userId" });
        
       let userIdcheck = await userModel.findById(body.userId)
      //  console.log(userIdcheck)
          if(!userIdcheck)
          return res.send({status:false,mesaage:"userId not found"})
  
      //ISBN------------------------------------------------------------------->
      if (!body.ISBN)
        return res
          .status(400)
          .send({ status: false, message: "please provieded ISBN" });
       //ISBN checking ---------------------------------------------------------->
          let ISBNCheck = await bookModel.findOne({ISBN:body.ISBN})
          if(ISBNCheck)
          return res.status(400).send({status:false,mesaage:"ISBN is already used"})
      //category----------------------------------------------------------------->
      if (!body.category)
        return res
          .status(400)
          .send({ status: false, message: "please provieded category" });
      //subcategory---------------------------------------------------------------->
      if (!body.subcategory)
        return res
          .status(400)
          .send({ status: false, mesaage: "please provieded subcategory" });
      //releasedAt--------------------------------------------------------------------->
      if (!body.releasedAt)
        return res
          .status(400)
          .send({ status: false, message: "please provieded releasedAt" });
        
        
  
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
    let getData = await bookModel.find({});
    res.status(200).send({ status: true, message: "Success", data: getData });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};

const getBookByParams = async function (req, res) {
  try {
    let bookid = req.params.bookId
    if(!bookid){return res.status(400).send({status:false,messsage:"BookId must be provided"})}
    
    if (!mongoose.isValidObjectId(bookid)) { return res.status(400).send({ status: false, msg: 'Please enter correct length of bookId' }) }
    let getBookData = await bookModel.findById({_id:bookid})
    if (!getBookData) {return res.status(404).send({status:false, msg: "Please enter valid bookId" })}

    let getReviewdata= await reviewModel.findById({_id:bookid})
    if(!getReviewdata){return res.status(404).send({status:false,msg:"Review data not present for this bookId."})}

    let result = {
        getBook:getBookData,
        getReview:[getReviewdata], 
      };
    
    res.status(200).send({ status: true, message: "Book List", data: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: false, message: error.message });
  }
};

const updateBookByParams = async function (req, res) {
  try {
    let body = req.body;
    let getData = await bookModel.findOneAndUpdate({});
    res.status(200).send({ status: true, message: "Success", data: getData });
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

//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");

//................................. Create Schema .........................//
const bookSchema = new mongoose.Schema(
  {
    
     
        title: {
            type:String,
            required:true,
            unique:true
        },
        excerpt: {
            type:String,
            required:true
        }, 
        userId: {
            type:ObjectId,
            required:true,
            ref:"USER"
        },
        ISBN: {
            type:String,
            required:true, 
            unique:true
        },
        category: {
            type:String,
            required:true
        },
        subcategory: [
            {
                type:String,
                required:true 
            }
        ],
        reviews: {
            type:Number, 
            default: 0,
            comment: Holds number of reviews of this book
        },
        deletedAt: {Date, when the document is deleted}, 
        isDeleted: {boolean, default: false},
        releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
      
  },
  { timestamps: true }
);

//........................................Export Schema..................................//
module.exports = mongoose.model("BOOK", bookSchema); //provides an interface to the database like CRUD operation

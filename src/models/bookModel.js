//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
//................................. Create Schema .........................//
const bookSchema = new mongoose.Schema(
  {
    
     
        title: {
            type:String,
            required:true,
            unique:true,
            trim:true,
        },
        excerpt: {
            type:String,
            required:true,
            trim:true,
        }, 
        userId: {
            type:ObjectId,
            required:true,
            ref:"User"
        },
        ISBN: {
            type:String,
            required:true, 
            unique:true,
            trim:true
        },
        category: {
            type:String,
            required:true,
            trim:true,
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
            // comment: Holds number of reviews of this book
        },
         
        isDeleted: {
            type:Boolean,
             default: false
            },
        releasedAt: {
            type:String,
           require:true,
           
        },
        deletedAt:{
            type:Date
            }
            
      
  },
  { timestamps: true }
);

//........................................Export Schema..................................//
module.exports = mongoose.model("Book", bookSchema); //provides an interface to the database like CRUD operation

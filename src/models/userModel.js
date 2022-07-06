//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");

//................................. Create Schema .........................//
const userSchema = new mongoose.Schema(
  {
    
        title: {
            type:String,
            require:true, 
            enum:[Mr, Mrs, Miss]
        },
        name: {
            type:String,
            required: true
        },
        phone: {
            type:String,
            required:true,
            unique:true
        },
        email: {
            type:String,
            required:true,
            unique:true
        }, 
        password: {
            type:String,
            required:true, 
        },
        address: {
          street: {
            type:String
        },
          city: {
            type:String
        },
          pincode: {
            type:String
        }
        },
 
      
  },
  { timestamps: true }
);

//........................................Export Schema..................................//
module.exports = mongoose.model("USER", userSchema); //provides an interface to the database like CRUD operation

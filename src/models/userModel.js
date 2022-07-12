//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");

//................................. Create Schema .........................//
const userSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      require: true,
      trim: true,
      enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 8,
      max: 15

    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      }
    },
  },
  { timestamps: true }
);

//........................................Export Schema..................................//
module.exports = mongoose.model("USER", userSchema);                                //provides an interface to the database like CRUD operation
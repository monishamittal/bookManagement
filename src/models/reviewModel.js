//.................................... Import Models for using in this module ....................//
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

//................................. Create Schema .........................//
const reviewSchema = new mongoose.Schema(
    {
        bookId: {
            type: ObjectId,
            require: true,
            ref: "Book",
        },
        reviewedBy: {
            type: String,
            require: true,
            trim: true,
            default: "Guest",

        },
        reviewedAt: {
            type: Date,
            require: true,

        },
        rating: {
            type: Number,
            require: true,
            default: null
        },
        review: {
            type: String,
            default: "optional"
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    }, { timestamps: true })

module.exports = mongoose.model("Review", reviewSchema)
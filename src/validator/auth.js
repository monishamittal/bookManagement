const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId


const Authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-auth-key"] || req.headers["x-auth-key"];
        if (!token)
            return res.status(400).send({ status: false, msg: "Token must be present" });
        jwt.verify(token, "FunctionUp-BookManagement", (error, response) => {
            if (response) { req.decodedtoken = response }
            if (error)
                return res.status(401).send({ status: false, msg: error.message });
            next();
        });
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};

module.exports = { Authentication }
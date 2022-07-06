const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");

const createBook = async function (req, res) {
  try {
    let body = req.body;
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
    let getData = await bookModel.find({});
    res.status(200).send({ status: true, message: "Success", data: getData });
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

const deleteBookByParams = async function (req, res) {
  try {
    let getData = await bookModel.find({});
    res.status(200).send({ status: true, message: "Success", data: getData });
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

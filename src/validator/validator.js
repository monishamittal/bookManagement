const mongoose = require('mongoose')


//Body validation
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0; // it checks, is there any key is available or not in request body
};

// Title validation
const isValidtitle = (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1

}


//Name Validation
const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z ]+$/
    return nameRegex.test(name)
}

//Email Validation 
const isValidEmail = function (email) {
    const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
    return emailRegex.test(email.toLowerCase())
}

//Mobile Validation
const isValidMobile = function (mobile) {
    const mobileRegex = /^[0-9]{10}$/
    return mobileRegex.test(mobile)
}

//password Validation
const isValidPassword = function (password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    return passwordRegex.test(password)
}

const isValidAddress = function(address) {
    if (typeof address === 'undefined' || address === null) return false
    if (Object.keys(address).length === 0) return false
    return true;
}
//it checks whether the string contain only space or not
// const isValidString = function(value) {
//     if (typeof value === 'undefined' || value === null) return false
//     if (typeof value === 'string' && value.trim().length === 0) return false 
     
//     return true;
// }



//Value Validation
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    // if (typeof value === Number && value.trim().length === 0) return false

    return true
}

//ObjectId validation
const isValidObjectId=function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

//Date validation
const isValidDate = function (Date) {
    return new Date();
  };

module.exports = { isValid, isValidName, isValidEmail, isValidMobile, isValidPassword,isValidObjectId,isValidRequestBody,isValid,isValidtitle,isValidDate,isValidAddress}//isValidString}
    // isValidStreet,isValidCity,isValidPincode }
 
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const validator = require("../validator/validator");
const jwt = require("jsonwebtoken");


const createUser = async function (req, res) {
    try {
        const requestBody = req.body;
        const { //Object destructuring
            title,
            name,
            phone,
            email,
            password,
            address
        } = requestBody;

        //Validation starts
        if (!validator.isValidRequestBody(requestBody)) { //to check the empty request body
            return res.status(400).send({ status: false, message: "Invalid request parameters,Empty body not accepted." })
        }

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "Title must be present" })
        };
        if (!validator.isValidtitle(title)) {
            return res.status(400).send({ status: false, message: `Title should be among Mr, Mrs or Miss` })
        }
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: "Name is required." })
        }
        if (!/^[a-zA-Z ]+$/.test(name))
         return res.status(400).send({ status: false, message: "Invalid name." })
        
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "Phone number is required" })
        }
        //validating phone number of 10 digits only by using RegEx. 
        if (!/^[6-9]{1}[0-9]{9}$/.test(phone))
        return res.status(400).send({ status: false, message: "Invalid Phone number." })

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "Email id is required" })
        }
         //validating email using RegEx.
         if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
         return res.status(400).send({ status: false, message: "Invalid Email id." })

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        //setting password's mandatory length in between 8 to 15 characters.
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Password criteria not fulfilled." })
        } 

        if(!validator.isValidAddress(address)){
            return res.status(400).send({ status: false, message: "Address cannot be empty if it is mentioned." })
        };

       

        //checking if the address key is present in the request body then it must have the following keys with their values, If not then address won't get stored in DB.
        if (address) { 
            
            if(typeof(address) != 'object'){
                return res.status(400).send({ status: false, message: "address must be in object." })
            }
            if (!validator.isValid(address.street)) {
                return res.status(400).send({ status: false, message: "Street address cannot be empty." })
            }

            if (!validator.isValid(address.city)) {
                return res.status(400).send({ status: false, message: "City cannot be empty." })
            }
            if (!validator.isValid(address.pincode)) {
                return res.status(400).send({ status: false, message: "Pincode cannot be empty." })
            }
             if (!/^[1-9]{6}$/.test(address.pincode))
                return res.status(400).send({ status: false, message: "Invalid pincode." })
        }
        //validation end.

        //searching phone in DB to maintain uniqueness.
        const verifyPhone = await userModel.findOne({ phone: phone })
        if (verifyPhone) {
            return res.status(400).send({ status: false, message: "Phone number already used" })
        }

         
        //searching email in DB to maintain uniqueness.
        const verifyEmail = await userModel.findOne({ email: email })
        if (verifyEmail) {
            return res.status(400).send({ status: false, message: "Email id is already used" })
        }

       
        //saving user data into DB.
        const userData = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "Successfully saved User data", data: userData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
// const createUser = async function (req, res) {
//   try {
//     let data = req.body;
//     // let phoneToString=parseInt(data.phone, 10);
//     const { title, name, phone, email, password, address } = data;

//     ///  Validation start

//     if (!validator.isValidRequestBody(data)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Empty data not accepted." });
//     }
//     if (!validator.isValid(title)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Empty title not accepted." });
//     }
//     if (!validator.isValid(name)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Empty name not accepted." });
//     }
//     if (!validator.isValid(phone)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Empty phone no. not accepted." });
//     }
//     if (!validator.isValid(email)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Empty email not accepted." });
//     }
//     if (!validator.isValid(password)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Empty password not accepted." });
//     }
//     if (!validator.isValid(address)) {
//       return res
//         .status(400)
//         .send({ status: false, message: "Empty address not accepted." });
//     }

    // if(typeof(address) != 'object'){
    //     return res.status(400).send({ status: false, message: "address must be in object." })
    // }

    // if(!validator.isValid(street)){ return res.status(400).send({status:false,message:"Empty street not accepted."})}
    // if(!validator.isValid(city)){ return res.status(400).send({status:false,message:"Empty address not accepted."})}
    // if(!validator.isValid(pincode)){ return res.status(400).send({status:false,message:"Empty address not accepted."})}

    // if (!validator.isValidStreet(address.street)) {
    //     return res.status(400).send({ status: false, message: "Invalid street address." })
    // }
    // if (!validator.validString(address.city)) {
    //     return res.status(400).send({ status: false, message: "Invalid City address." })
    // }
    // if (!validator.validString(address.pincode)) {
    //     return res.status(400).send({ status: false, message: "Invalid Pincode address." })
    // }

    // if (!validator.isValidtitle(title)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Title should be [from Mr,Miss,Mrs]" });
    // }
    // if (!validator.isValidName(name)) {
    //   return res.status(400).send({ status: false, message: "Invalid name" });
    // }
    // if (!validator.isValidMobile(phone)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Invalid phone no." });
    // }
    // if (!validator.isValidEmail(email)) {
    //   return res.status(400).send({ status: false, message: "Invalid email." });
    // }
    // if (!validator.isValidPassword(password)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Invalid password" });
    // }
    // if(!validator.isValidAddress(address)){ return res.status(400).send({status:false,message:"Invalid address"})}

    // let phoneNumber = await userModel.findOne({ phone });
    // if (phoneNumber) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Phone no. already exists" });
    // }

    // let emailId = await userModel.findOne({ email });
    // if (emailId) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Email already exists" });
    // }

    // let userData = await userModel.create(data);
    // return res
    //   .status(201)
    //   .send({
    //     status: true,
    //     message: "successfully created data",
    //     Data: userData,
    //   });
//    catch (err) {
//     return res.status(500).send({ status: false, message: err.message });
//   }



const loginUser = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    
    const user = await userModel.findOne({ email: email, password: password });
    if (!user) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Provided Email address or Password are incorrect",
        });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      "FunctionUp-BookManagement",
      { expiresIn: "10d" }
    );
    res.status(200).send({ status: true, data: { token: token } });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createUser, loginUser };

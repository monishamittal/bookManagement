const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const validator=require("../validator/validator")


const createUser= async function(req,res){

    try{
    let data=req.body
    const{title,name,phone,email,password,address}=data

    ///  Validation start

    if(!validator.isValidRequestBody(data)){ return res.status(400).send({status:false,msg:"Empty data not accepted."})}
    if(!validator.isValid(title)){ return res.status(400).send({status:false,msg:"Empty title not accepted."})}
    if(!validator.isValid(name)){ return res.status(400).send({status:false,msg:"Empty name not accepted."})}
    if(!validator.isValid(phone)){ return res.status(400).send({status:false,msg:"Empty phone no. not accepted."})}
    if(!validator.isValid(email)){ return res.status(400).send({status:false,msg:"Empty email not accepted."})}
    if(!validator.isValid(password)){ return res.status(400).send({status:false,msg:"Empty password not accepted."})}
    if(!validator.isValid(address)){ return res.status(400).send({status:false,msg:"Empty address not accepted."})}

    if(!validator.isValidtitle(title)){ return res.status(400).send({status:false,msg:"Title should be [from Mr,Miss,Mrs]"})}
    if(!validator.isValidName(name)){ return res.status(400).send({status:false,msg:"Invalid name"})}
    if(!validator.isValidMobile(phone)){ return res.status(400).send({status:false,msg:"Invalid phone no."})}
    if(!validator.isValidEmail(email)){ return res.status(400).send({status:false,msg:"Invalid email."})}
    if(!validator.isValidPassword(password)){ return res.status(400).send({status:false,msg:"Invalid password"})}
    // if(!validator.isValidAddress(address)){ return res.status(400).send({status:false,msg:"Invalid address"})}

    let phoneNumber= await userModel.findOne({phone})
        if (phoneNumber){return res.status(400).send({ status: false, msg: "Phone no. already exists" })}

        let emailId= await userModel.findOne({email})
        if (emailId){return res.status(400).send({ status: false, msg: "Email already exists" })}
    
        let userData= await userModel.create(data)
          return res.status(201).send({status:true,msg:"successfully created data",Data:userData})
    }
    catch(err){
         return res.status(500).send({status:false,msg:err.message})
    }

}  

module.exports={createUser}


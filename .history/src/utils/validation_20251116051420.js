const validator=require('validator');

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error ("Please enter a valid Email address");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("Pleae enter a strong password");
    }

}

module.exports={validateSignUpData};
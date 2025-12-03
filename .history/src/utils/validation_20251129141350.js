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

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","about","gender","skills","age","photoUrl"];
    const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
    return isEditAllowed;
}

const validatePassword=(password)=>{
    
  
if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password")
}

}

module.exports={validateSignUpData,
    validateEditProfileData,
    validatePassword

};
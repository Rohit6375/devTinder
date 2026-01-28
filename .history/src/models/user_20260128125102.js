
const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String

    },
    emailId:{
        type:String,
        required:true,
        unique: true,
        trim:true ,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email id is not valid "+value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is weak");
            }
        }
    },
    age:{
        type:Number,
        min:18,
        
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error ("Gender data is not valid");
            }
        }

    },
    photoUrl:{
        type:String,
        default:"https://thumbs.dreamstime.com/z/default-avatar-profile-icon-grey-photo-placeholder-illustrations-vectors-default-avatar-profile-icon-grey-photo-placeholder-99724602.jpg?ct=jpeg"
    },

    about:{
        type:String,
        default:"This bio is shy. Say hi."
    },
    skills:{
        type:[String],
    }


},
{
    timestamps:true,
}
);

userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
    return token;
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password;
    const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}


// const User=mongoose.model("User",userSchema);

// module.exports=User;

module.exports=mongoose.model("User",userSchema);
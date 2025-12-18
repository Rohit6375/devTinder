
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
                throw new Error ("");
            }
        }

    },
    photoUrl:{
        type:String,
        default:"https://media.istockphoto.com/id/https://rajenengg.com/wp-content/uploads/2020/05/nobody.jpg/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=1024x1024&w=is&k=20&c=er-yFBCv5wYO_curZ-MILgW0ECSjt0DDg5OlwpsAgZM="
    },

    about:{
        type:String,
        default:"i am a looser"
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
    const token=await jwt.sign({_id:user._id},"Rohit@7727",{expiresIn:'7d'});
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
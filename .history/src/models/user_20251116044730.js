
const mongoose=require('mongoose');
const validator=require('validator');

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
        unique:true,
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
        default:"https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=1024x1024&w=is&k=20&c=er-yFBCv5wYO_curZ-MILgW0ECSjt0DDg5OlwpsAgZM="
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

// const User=mongoose.model("User",userSchema);

// module.exports=User;

module.exports=mongoose.model("User",userSchema);
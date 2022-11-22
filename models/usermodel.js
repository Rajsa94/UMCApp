const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
       
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Image:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    }
  });

//   userSchema.pre("save", async function (next) {

//     if (this.isModified("password")) {
//         console.log(`this current password is ${this.password}`);
//         this.password = await bcrypt.hash(this.password, 10);
//         console.log(`the current password is ${this.password}`);
//         // this.cpassword = await bcrypt.hash(this.password, 10);
//     }

//     next();
// })

  const Register = mongoose.model('Register', userSchema);

  module.exports = Register;
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
    code:String,
    codeCounter: {
        type:Number,
        default:3
    },
    codeExpire: Date, //email e kod düştükten 20 saniye içerisinde kodu gir 
    isActive:{
        type:Boolean,
        default:false
    }
})
const User = new mongoose.model('User', userSchema);


module.exports = {
    User
}
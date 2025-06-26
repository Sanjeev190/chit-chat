const mongoose = require('mongoose')
const userModel=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true, match: [
        /@/,
        "Please fill a valid email address"
      ]},
    password:{type:String,required:true },
    picture:{
        type:String,
        default:
            "https://tse1.mm.bing.net/th?id=OIP.TNYeqRitq04PWbZLm-EITQHaEK&pid=Api&P=0&h=180"
    }
},{
    timestamps:true
})

const User=mongoose.model('User',userModel)
module.exports=User
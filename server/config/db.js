const mongoose= require('mongoose')
require ('dotenv').config()
const url=process.env.url

const connectDb=async()=>{
    try{
        const connect=await mongoose.connect(url)
        if(connect){
            console.log('sucessfully connected to the database')
        }
    }
    catch(err){
        console.log(err)
    }
}
module.exports=connectDb
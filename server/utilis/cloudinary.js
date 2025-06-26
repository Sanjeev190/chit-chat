const cloudinary=require('cloudinary').v2
const {CloudinaryStorage}=require('multer-storage-cloudinary')
const path = require('path');
require('dotenv').config()
// This part of the code is connecting the file to cloudinary
// by using cloud_name,api_key,api_secret

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


// this part hadles the storage part it has set the params that it can upload the picture 
// in this kind of formats
const storage=new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'uploads',
        allowed_formats:['jpg','png','jpeg','webp']
    }
})
// console.log(storage)
module.exports={cloudinary,storage}
const express = require('express')
const app = express()
require('dotenv').config()
const userMiddleware=require('../middleware/usermiddleware.js')
const multer=require('multer')
const{storage}=require('../utilis/cloudinary')// This part is defined somewhere in an api 
const upload=multer({storage})//This will handle the uplad of a file
const bcrypt = require('bcrypt')
const User = require('../Model/userModel')
const { Router } = require('express')
const jwt = require('jsonwebtoken')
const allUser=require('../controllers/getallUser')
const jwt_secret = process.env.jwt_secret
const router = Router()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// keep this function in a code it will help to debug th eother function as well

// const uploadMiddleware = (req, res, next) => {
//     upload.single('image')(req, res, function (err) {
//       if (err) {
//         console.error("🔥 Upload Error:", err);
//         return res.status(500).json({ message: "File upload failed", error: err.message });
//       }
//       next();
//     });
//   };

router.post('/signup', upload.single('image'),async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Please enter all the credentials"
        });
      }
  
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(400).json({
          message: "User already exists"
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 5);
      console.log("Received image file:", req.file);
      let picture = '';
      try {
        if (req.file) {
          picture = req.file.path||"";
          console.log("Image uploaded to Cloudinary:", picture);
        }
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
      
      console.log("Received image file2:", req.file);
  
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        picture
      });
  
      if (user) {
        const token = jwt.sign({ id: user._id }, jwt_secret);
  
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          token
        });
      }
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Error in signing up"
      });
    }
  });
  
router.post('/login',async(req,res)=>{
const {email,password}=req.body
try{
    const user=await User.findOne({
        email:email
    })
if(!user){
    res.status(400).json({
        message:"incorrect email and password"
    })
    return
}
const unhashedPassword=await bcrypt.compare(password,user.password)
if(!unhashedPassword){
    return res.status(400).json({
        message:"incorrect email and password"
    })
 }
 if(user.email&&unhashedPassword){
 const token=jwt.sign({id:user._id},jwt_secret)
 return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    token:token
  })
 }
}
catch(e){
    console.log(e)
    res.status(500).json({
        message:"errror in login"
    })
}
})

router.get('/',userMiddleware,allUser)
module.exports = router
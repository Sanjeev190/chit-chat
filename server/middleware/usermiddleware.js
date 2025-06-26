const jwt = require('jsonwebtoken')
const User = require('../Model/userModel')
require('dotenv').config()
const jwt_secret = process.env.jwt_secret

const userMiddleware = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
      
        try {
            const decodedtoken = jwt.verify(token, jwt_secret)
            // req.id=decodedtoken.id(thsi was just returning the id and it will just return the id)
            // the code below will help to get the user info from its id but doesnot return the password
            if (decodedtoken) {
                req.user = await User.findById(decodedtoken.id).select('-password')
                next()
            }
            else {
                return res.status(400).json({
                    message: "no any token passed in the log"
                })
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "error in authentictaion "
            })

        }

    }
}
module.exports = userMiddleware
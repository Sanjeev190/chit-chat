// this is the first time i am using the search queries 



const User = require('../Model/userModel')

const allUser = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {
                name: {
                    $regex: req.query.search, $options: 'i'
                }
            },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {}

    try {
        const users = await User.find({
            ...keyword,
            _id: { $ne: req.user._id } // exclude the logged-in user
        });

        return res.status(200).json({
            users
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            messgae: "error in finding user"
        })
    }

}




module.exports = allUser
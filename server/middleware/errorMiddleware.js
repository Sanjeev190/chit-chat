const notFound=(req,res,next)=>{
res.status(404).json({
    success:false,
    message:"Api not found"
})


}
const errorHandler=(err,req,res,next)=>{
console.log(err.stack)
res.status(500).json({
    success:false,
    message:'Internal server error'
})
}
module.exports={notFound,errorHandler}
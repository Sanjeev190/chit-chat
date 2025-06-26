const express=require('express')
const cors=require('cors')
const connectDb = require('./config/db')
require ('dotenv').config()
const path = require("path");

const app=express()
const{notFound,errorHandler}=require('./middleware/errorMiddleware')
const userRouter=require('./Routes/userRoutes')
const chatRoutes=require('./Routes/chatRoutes')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT=process.env.PORT
connectDb()
app.use("/user",userRouter)
app.use("/chats",chatRoutes)
// deployment code start














// deployment code end



app.use(notFound)
app.use(errorHandler)
app.use((err, req, res, next) => {
    console.error("🔥 Multer/Cloudinary error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  });
  

const server=app.listen(PORT,()=>{
    console.log(`port is running on ${PORT}`)
})
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
  credentials: true
}));

const io=require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:["http://localhost:3000","https://your-frontend-domain.com"],
     credentials: true, 
  }
})
io.on("connection",(socket)=>{  // when a user connect with teh chat this code gets fired up
console.log('user connected')

socket.on('setup',(userData)=>{  // this is initialized when the client sends their user data during socket initialization
  socket.join(userData._id)   //joins the personal room using user iD User Alice has _id = 123. 
     socket.emit('connected')   
     })                                 // When she logs in, we:
                                                   //Join her to room "123"
                                     //Later, when she gets a message, we can io.to("123").emit(..

  


socket.on('join chat',(roomId)=>{  // this triggered when initializing the chat it can be either group or personal
  socket.join(roomId) 
 console.log("User joined chat:", roomId);
})

socket.on('new message',(newMessage)=>{
  const chat=newMessage.chat
  if(!chat.users)return console.log('socket.chat.users not defined')
chat.users.forEach((user)=>{
  if(user._id===newMessage.sender._id)return
  socket.in(user._id).emit("message received",newMessage)
  console.log(newMessage)
})
})
// socket.on('typing',(roomId)=>{
//   socket.in(roomId).emit('typing')
// })
// socket.on("stop typing",(roomId)=>{
// socket.in(roomId).emit('stop typing')
// })
})
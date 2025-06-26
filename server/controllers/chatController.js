const Chat = require('../Model/chatModel')
const User = require('../Model/userModel')
const Message= require('../Model/messageModel')


const  accessChat = async (req, res) => {
    const { userId } = req.body //This part is triggered when i click one of the user to chat with 
    console.log()
    if (!userId) {
        console.log('UserId param is not sent with request')
        return res.status(400).json({
            message: 'no params sent'
        })
    }
    // after my friend Id was provided
    const isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]})
        .populate("users", "-password")
        .populate("latestMessage")
        .populate({
         path: "latestMessage.sender",
         select: "name email picture"
            // {sender:87326438,content:hi hello }
        })
    
    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        const chatData = {
            chatname: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const newchatData = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: newchatData._id })
            .populate('users','-password')


            res.status(200).json(fullChat)
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'error in creating a newChat'
            })
        }

    }
}


const fetchChats = async (req, res) => {
    try {
        const allChat = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
        .populate('users','-password')
            .populate('latestMessage')
            .populate({
         path: "latestMessage.sender",
         select: "name email picture"
            // {sender:87326438,content:hi hello }
        })
        .populate('groupAdmin', '-password')
        .sort({updatedAt:-1})

        return res.status(200).json(allChat)
    } catch (e) {
       console.error(e);
    return res.status(500).json({ message: 'Server error', error: e.message });
    }

} 

const fetchMessages=async(req,res)=>{
    try{
        const messages=await Message.find({chat:req.params.chatId})
        .populate('sender','name email picture')
        .populate('chat')
        res.status(200).json(messages)
    } catch(e){
        console.error(e)
          res.status(500).json({ message: "Failed to load messages" });
    }
}
const sendMessage=async(req,res)=>{
 const { content, chatId } = req.body;

if (!content || !chatId) {
  return res.status(400).json({ message: "Missing content or chatId" });
}

try {
  const newMessage = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  const fullMessage = await Message.findById(newMessage._id)
    .populate('sender', 'name email picture')
    .populate({
      path: 'chat',
      populate: {
        path: 'users',
        select: 'name email picture',
      },
    });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });

  res.status(201).json(fullMessage);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
}

}

const createGroupChat=async(req,res)=>{
    const {users,name}=req.body
    if(!users||!name){
        return res.status(400).json({
            message:'please fill all the fields'
        })
    }
let parsedUsers=typeof users==='string'?JSON.parse(users):users
if(parsedUsers.length<2){
    return res.status(400).json({
        message:"please select the user to create group"
    })
}
parsedUsers.push(req.user._id)
try{
    const groupChat=await Chat.create({
        chatname:name,
        isGroupChat:true,
        users:parsedUsers,
        groupAdmin:req.user._id
}) 
const fullGrouoChat=await Chat.findById(
    groupChat._id
    ).populate('users','-password')
    .populate('groupAdmin','-password')
 res.status(200).json([fullGrouoChat],
    
 )

}catch(e){
    console.log(e)
} 

}

const renamegroup=async(req,res)=>{
    const {name,id}=req.body
  try{  const chat= await Chat.findOneAndUpdate(
    {_id:id,isGroupChat:true},// thsi is the find argument
        {$set:{chatname:name}},//this is the argument what you wnat to update
        {new:true}
    ).populate('users','-password')
    .populate('groupAdmin','-password')
    if(chat){ 
        return res.status(200).json(chat)
    }else{
        return res.status(404).json({
            message:'chat not found'
        })
    }
  }catch(e){
    console.log(e)
    res.status(500).json({
        message:"internal server error"
    })
  }

}
const removeFromGroup=async(req,res)=>{
const {chatId,userId}=req.body
const chat=await Chat.findByIdAndUpdate(
    {_id:chatId}, //this is the criteria
{$pull:{users:userId}}, //this is what you want to do.
{new:true}).populate('users','-password')//
.populate('groupAdmin','-password')
if(chat){
    return res.status(200).json(chat)
}else{
    return res.status(403).json({
        message:'No user or chat found'
    })
}
}
// const addToGroup=async(req,res)=>{
//     const {chatId,userId}=req.body
//     const chat=await Chat.findByIdAndUpdate(
//         {_id:chatId},//this the find argument
//     {$push:{users:userId}},//this is the argument where we are pushing the users in an array
// {new:true}).populate('users','-password')
// .populate('groupAdmin','-password')
//     if(!chat){
//         return res.status(403).json({
//             message:"chat doesnot exist"
//         }) 
//     }else{
//         return res.status(200).json(chat)
//     }
// }

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // Fetch the chat first
    const chat = await Chat.findById(chatId);
   
    if (!chat) {
      return res.status(404).json({ message: "Chat does not exist" });
    }

    // Check if user already exists in the group
    const userAlreadyInGroup = chat.users.includes(userId);
    if (userAlreadyInGroup) {
      return res.status(400).json({ message: "User already exists in the group" });
    }

    // If not, add the user
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error adding user to group:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// this part of the code iam not using yet this wil be used to delete the chat
const deleteChat=async(req,res)=>{
    const{chatId}=req.body
if(!chatId){
return res.status(400).json({
    message:'please select the chat'
})
}
 try{
    const chat =await Chat.findByIdAndDelete(
      chatId
    )
    if(!chatId){
        return res.status(400).json({
            message:'chat not found'
        })
    }
    return res.status(200).json({
message:"chat has beeen deleted"
    })
}catch(e){
console.log(e)
}
}

module.exports = { accessChat,fetchMessages,sendMessage, fetchChats,createGroupChat,renamegroup,addToGroup,removeFromGroup,deleteChat }




//it is key mentoned in momgoose mode

//this is the item you want to get from thsat model becsue

//if we dont do it the only thing stored in it is object id and we are careatting a link
const express=require('express')
const app=express()
const router=express.Router()
const userMiddleware=require('../middleware/usermiddleware')
const {accessChat,fetchChats,createGroupChat,renamegroup,
    removeFromGroup,addToGroup,fetchMessages,sendMessage,deleteChat}=require('../controllers/chatController')
router.post('/',userMiddleware,accessChat)//this is to create a one to one chat
router.get('/',userMiddleware,fetchChats)// this route is fetching all th echats
router.get("/:chatId", userMiddleware, fetchMessages);//This will help to get the messages
router.post("/message", userMiddleware, sendMessage); // This route will handle the  sent messages from box
router.post('/group',userMiddleware,createGroupChat)// this route is creating a group caht
router.put('/rename',userMiddleware,renamegroup)// this route is renaming a chatGroup
router.put('/group',userMiddleware,removeFromGroup)//thie route is handling the the user to remove a user from chatGroup 

router.put('/groupadd',userMiddleware,addToGroup)
router.delete('/',userMiddleware,deleteChat)

// this route is handling the add to group

module.exports=router


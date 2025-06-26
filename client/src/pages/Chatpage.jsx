//    import {axios} from 'axios'
import { useNavigate } from "react-router-dom"
import {ChatState   } from "../Contextapi/ChatProvider"
import ChatBox from "../components/misscallneous/ChatBox"
import SideDrawers from "../components/misscallneous/SideDrawer"
import MyChats from "../components/misscallneous/MyChats"
import { useState ,useEffect} from "react"
const Chatpage=()=>{
  const navigate=useNavigate()
const {messages, setMessages,user,setUser,selectedChat,setSelectedChat,chats,setChats,socket}=ChatState()
useEffect(()=>{
if(!user){
  navigate('/')
}
},[])
console.log(user) 

  

    return <>
    <div className="w-full">
        <SideDrawers messages={messages}setMessages={setMessages} />
         </div>
       <div className="flex flex-col md:flex-row h-screen">
  {/* Left: MyChats (100% width on mobile, 20% width on md+) */}
  <div className="w-full md:w-1/5 border-b md:border-b-0 md:border-r h-1/2 md:h-[90vh] overflow-y-auto">
    <MyChats />
  </div>

  {/* Right: ChatBox (100% width on mobile, 80% on md+) */}
  <div className="w-full ml-0 mt-2 md:ml-4 md:w-4/5 md:mt-0 h-1/2 md:h-[90vh] overflow-y-auto">
    <ChatBox messages={messages}setMessages={setMessages} setSelectedChat={setSelectedChat} selectedChat={selectedChat} user={user} socket={socket}/>
  </div>
</div>


  
    </>
}
export default Chatpage
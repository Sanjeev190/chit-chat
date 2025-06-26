import { createContext,useContext, useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import { io } from "socket.io-client";

const ChatContext=createContext()
 const ChatProvider=({children})=>{
  const [notifications, setNotifications] = useState([]);

    const[user,setUser]=useState()
    const[selectedChat,setSelectedChat]=useState(null)
    const [socket, setSocket] = useState(null);
     const [chats,setChats]=useState([])
     const [messages, setMessages] = useState([]);
    const navigate=useNavigate()
    
    useEffect(()=>{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"))
       if(userInfo){
        setUser(userInfo)
        const newSocket=io("https://chit-chat-5a6h.onrender.com",{
            transports:["websocket"]  //extra code to  force up teh socket
        })
        setSocket(newSocket)
        newSocket.emit("setup",userInfo)
        return()=>newSocket.disconnect()
       } else{
        navigate('/')
        return
       }
       
        },[])
return(
    <ChatContext.Provider value={{notifications,setNotifications,messages, setMessages,user,setUser,selectedChat,setSelectedChat,chats,setChats,socket}}>
        {children}
    </ChatContext.Provider>
)
 }
export const ChatState=()=>{
    return useContext(ChatContext)
}
 
 export default ChatProvider
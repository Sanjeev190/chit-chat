import {useRef, useState, useEffect } from "react"
import { ChatState } from "../../Contextapi/ChatProvider"
//
const ChatBox = ({ messages,setMessages,setSelectedChat,selectedChat, user,socket }) => {
  const{notifications, setNotifications}=ChatState()
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showMessage,setShowMessage]=useState(false)
  const [search,setSearch]=useState()    //this is to hold teh search while doing add user
  const[searchResult,setSearchResult]=useState([]) //this is to hold the search result while adding a user
     const [selectedUsers,setSelectedUsers]=useState([])//this will store the selected user
  const[modalLoading,setModalLoading]=useState(false)
    const [isRemoveModalOpen,setIsRemoveModalOpen]=useState(false)
  const [isAddModalOpen,setIsAddModalOpen]=useState(false)
  const [isTyping,setisTyping]=useState(false) //this state will store whether you are typing or not
  const[typing,setTyping]=useState(false)//This is to show whether other person are typing or not 
  let timeout=useRef(null)
  const bottomRef=useRef()
const closeAddModal=()=>{
   setSearch('')
 setSearchResult([])
  setIsAddModalOpen(false)
  return
}






  const handleSearch=async()=>{
   if(!search.trim()){
    return 
   }
   try{
    setModalLoading(true)
    const res=await fetch(`https://chit-chat-5a6h.onrender.com/user?search=${search}`,{
      method:'GET',
      headers:{
        Authorization:`Bearer ${user.token}`
      }})
      const result=await res.json()
      if(res.ok){
        setSearchResult(result.users)
        setModalLoading(false)
      }

   }catch(e){
    console.log(e)
   }
  }

  const handleGroupAddUser=async(usertoAdd)=>{
console.log(`hey${user.name}`)
const exist=selectedChat.users.some((u)=>u.email==usertoAdd.email)
if(exist){
 
 alert( `${usertoAdd.name} already exist in the group`)
  setSearch('')
 setSearchResult([])
 return
}
console.log(selectedChat)

// if(selectedChat.users.include(usertoAdd._id))
try{
const res=await fetch(`https://chit-chat-5a6h.onrender.com/chats/groupadd`,{
  method:'PUT',
  headers:{
    "Content-Type":"application/json",
    Authorization:`Bearer ${user.token}`
  },
  body:JSON.stringify({
    chatId:selectedChat._id,
    userId:usertoAdd._id
  })
})
console.log('hello')
const result=await res.json()
console.log(`message is ${result.message}`)
if(res.ok){

  alert(`${usertoAdd.name} was added to the list`)
  setSelectedChat(result)
  setSearch('')
 setSearchResult([])
}
}catch(e){
  console.log(e)
}
 
}
const handleRemoveUser=async(usertoRemove)=>{
  console.log('you click a delete chat button')
try{
  const res =await fetch("https://chit-chat-5a6h.onrender.com/chats/group",{
    method:'PUT',
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${user.token}`
    },
    body:JSON.stringify({
      chatId:selectedChat._id,
      userId:usertoRemove._id
      })
     })
     const data=await res.json()
     setSelectedChat(data)

}catch(e){
  console.log(e)
}
   
}

const getSender = () => {
    return selectedChat?.users?.find((u) => u._id !== user._id)?.name || "Unknown";
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        setLoading(true);
        const res = await fetch(`https://chit-chat-5a6h.onrender.com/chats/${selectedChat._id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const result = await res.json();
        if (res.ok) {
          setMessages(result);
        } else {
          console.error(result);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  useEffect(()=>{
if(selectedChat && socket){
  socket.emit("join chat",selectedChat._id)
}
  },[selectedChat,socket])


  useEffect(()=>{
if(!socket)return
socket.on("message received",(newMsg)=>{

if (!selectedChat || selectedChat._id !== newMsg.chat._id) {
      setNotifications((prev) => [newMsg, ...prev]);
    }

if(!selectedChat||newMsg.chat._id !==selectedChat._id){
  console.log("message for another chat:",newMsg.content)
}else {
  setMessages((prev)=>[...prev,newMsg])
}
})
return()=>socket.off("message received")

  },[selectedChat,socket])

// this bottom code is to adjust the view of message when they display th emessage
useEffect(()=>{
if(bottomRef.current){
  bottomRef.current.scrollIntoView({behavior:"smooth"})
}
},[messages])

useEffect(()=>{
if(!socket)return
socket.on("typing",()=>setTyping(true))
socket.on("stop typing",()=>setTyping(false))
return()=>{
  socket.off('typing')
  socket.off('stop typing')
}

},[socket])

  const handleSendMessage = async () => {
    console.log('button clicked')
    if (!newMessage.trim()) return ;
    try {
      const res = await fetch("https://chit-chat-5a6h.onrender.com/chats/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat._id,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, result]);
         socket.emit('new message', result)
        setNewMessage("");
        
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!selectedChat) {
    return (
      <div className="ml- h-full flex items-center justify-center text-gray-500 bg-white">
        <p>Select a Chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1  h-full bg-white p-4 flex flex-col">
      {/* Chat Header */}
      <div className="pb-2 border-b flex text-md font-semibold">
        {selectedChat.isGroupChat ? selectedChat.chatname : getSender()}
        <img
 src={ selectedChat.isGroupChat?"https://thumbs.dreamstime.com/b/design-can-be-used-as-logo-icon-complement-to-group-chat-124906811.jpg"
    :selectedChat.users.find((u)=>u._id!==user._id)?.picture
    }
    alt="avatar"
    className="w-8 h-8 rounded-full ml-6"
    />
    {selectedChat.isGroupChat? <button onClick={()=>setIsRemoveModalOpen(true)}
      className="bg-red-400 text-white ml-5 font-bold px-3 py-1 rounded hover:bg-red-500">Remove User</button>:<></>}
      
      {selectedChat.isGroupChat&& <button onClick={()=>setIsAddModalOpen(true)}
      className="bg-red-600 text-white ml-5 font-bold px-3 py-1 rounded hover:bg-red-200">Add User</button>}</div>

{/* this section will help to get the add modal for the Add User  */}



{isAddModalOpen&&(<div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-bold mb-4">Add Users from Group</h2>

     <input
      type="text"
      placeholder="search users.."
      className="w-3/4 border rounded  p-2 mb-3"
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      
      />
      <button onClick={handleSearch} className="bg-blue-400 text-white py-2 px-2 hover:bg-blue-500 rounded-lg ml-5"
> Search</button>

        {<div>
        {modalLoading? <p>loading...</p> :(searchResult.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => handleGroupAddUser(user)}
          >
            <span>{user.name}</span><span className=" p-1 rounded hover:bg-gray-300 text-sm text-gray-500">Add User</span>
            </div>
        )))}
      </div> }






      <div className="flex justify-end mt-4">
        <button
          className="bg-gray-400 text-white px-4 py-2 hover:bg-blue-500 rounded"
          onClick={closeAddModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>

  )}


















      {/* this is the modal to display the remove user list */}
{isRemoveModalOpen&& (<div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-bold mb-4">Remove Users from Group</h2>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {selectedChat.users.map((user) => (
          <div
            key={user._id}
            className="flex justify-between hover:bg-blue-100 items-center p-2 border rounded"
          >
            <span>{user.name}</span>
            <button
              onClick={() => handleRemoveUser(user)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-gray-400 text-white px-4 py-2 hover:bg-blue-500 rounded"
          onClick={() => setIsRemoveModalOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>)}
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto my-4 pr-1 flex flex-col gap-2">
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`px-4 py-2 rounded-lg text-sm max-w-xs ${
                msg.sender._id === user._id
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        {/* {typing&&(
          <p className="text-gray-400 italic text-sm  self-start mb-2">Typing....</p>
        )} */}
        <div ref={bottomRef}/>
        
      </div>
  {typing&&(
          <p className="text-gray-400 italic text-sm  self-start mb-2">Typing....</p>
        )}
      {/* Message Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
            if(!socket||!socket.connected) return //No socket return it is just checking teh connection in socket
            if(!isTyping){
              setisTyping(true)
              socket.emit('typing', selectedChat._id)

            }
            if(timeout.current)clearTimeout(timeout.current)
              timeout.current=setTimeout(()=>{
            socket.emit("stop typing",selectedChat._id)
            setisTyping(false)
            },3000)








          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={() => {
  handleSendMessage();
  
}}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;


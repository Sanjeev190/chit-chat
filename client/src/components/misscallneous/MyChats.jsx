import { useState,useEffect } from "react"
import { ChatState } from "../../Contextapi/ChatProvider"
import { useNavigate } from "react-router-dom"
import ChatListItem from "../ListItem/ChatListItem"

const MyChats=()=>{
    
   const{notifications,setNotifications,user,chats,setChats,selectedChat,setSelectedChat}=ChatState()
   const[isModalOpen,setIsModalOpen]=useState(false)
   const [groupName,setGroupName]=useState() 
   const [search,setSearch]=useState()
   const [loading,setLoading]=useState(false)
   const [selectedUsers,setSelectedUsers]=useState([])
   const [searchResult,setSearchResult]=useState([])
const navigate=useNavigate()
const handleSelectChat = (chat) => {
  setSelectedChat(chat);

  // Clear notifications for this chat
  setNotifications((prev) =>
    prev.filter((msg) => msg.chat._id !== chat._id)
  );
};

const modalClose=()=>{
     setSearch('')
       setGroupName('')
      setSelectedUsers([])
       setSearchResult([])
       setIsModalOpen(false)
       return

}
   const handleAddUser=(user)=>{
    if(selectedUsers.find((u)=>u._id===user._id)) return
    setSelectedUsers([...selectedUsers,user])
   }
   const handleRemoveUser=(usertoremove)=>{
  setSelectedUsers(selectedUsers.filter((u)=>u._id!==usertoremove._id))
   }
   const handleSearch=async ()=>{
    if(!search.trim()) {
    return
    }
    try{
        setLoading(true)
        const res=await fetch(`http://localhost:5000/user?search=${search}`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        })
        const result=await res.json()
        if(res.ok){
            setSearchResult(result.users)
            console.log(searchResult)
           
        
setLoading(false)

        }
    } catch(e){
        console.log(e)
    }

   }
   const handleSubmitGroup=async()=>{
    console.log(selectedUsers.length)
    console.log(groupName)
    if(!groupName||selectedUsers.length<2){
     return  alert('plese enter the group name and select at leats 2 users') }
        try{
            const res= await fetch(`http://localhost:5000/chats/group`,{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${user.token}`
                },
                body:JSON.stringify({
                    name:groupName,
                    users:JSON.stringify(selectedUsers.map((u)=>u._id))
                })
            })
            const data=await res.json()

            if(res.ok){
              
            setChats((prev) => [...data, ...prev]); // since `data` is already an array ✅

            setIsModalOpen(false)
            setGroupName('')
            setSelectedChat(null)
            setSelectedUsers([])
            setSearch('')
            setSearchResult([])
            alert('sucessfully cretate group')
            navigate('/chat')}
        } catch(e){
            console.log(e)
            alert('failed too create a group')
        }
  

   }

   const fetchChats=async()=>{
    try{
        console.log(user.token)
        const res=await fetch("http://localhost:5000/chats",{
            method:'GET',
             headers: {
        Authorization:`Bearer ${user.token}`,
             }
        })
        const result=await res.json()
        console.log(typeof(result))
        if (res.ok){
            console.log(`fetched chats: ${result}`)
            setChats(result)
            console.log(chats)
            console.log(`after :${user.token}`)
        }else{
            console.error ("failed to fetched chats")
        }
    }catch(e)
    {console.error(e)}
   }
    useEffect(() => {
        
    fetchChats();
  }, []);
  

   return <>
  {isModalOpen &&  <div className="fixed inset-0 border-gray-200 bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white w-[90%] max-w-md rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-bold mb-4">Create Group Chat</h2>
      <input
      type="text"
      placeholder="Enter a group name"
      className="w-3/4 border rounded p-2 mb-3"
      value={groupName}
      onChange={(e)=>setGroupName(e.target.value)}
      />
      <input
      />
      <input
      type="text"
      placeholder="search users.."
      className="w-3/4 border rounded  p-2 mb-3"
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      
      />
      <button onClick={handleSearch} className="bg-blue-400 text-white py-2 px-2 hover:bg-blue-500 rounded-lg ml-5"
> Search</button>

      {/* shoiwng search Result */}
        <div>
        {loading? <p>loading...</p> :(searchResult.map((user) => (
          <div
            key={user._id}
            className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => handleAddUser(user)}
          >
            {user.name}
          </div>
        )))}
      </div>

      {/* show selected user */}
    <div className="flex flex-wrap gap-2 mt-3">
        {selectedUsers.map((u) => (
          <span
            key={u._id}
            className="bg-blue-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {u.name}
            <button onClick={() => handleRemoveUser(u)} className="text-red-500">×</button>
          </span>
        ))}
      </div>
 <div className="flex justify-end gap-1 mt-4">
      <button className="bg-blue-400 text-white  px-2 hover:bg-blue-500 rounded-lg ml-5"

     onClick={modalClose}
     > Close </button>
<button  onClick={handleSubmitGroup}className="bg-blue-400 text-white  px-2 hover:bg-blue-500 rounded-lg ml-5"
> Create</button>

</div>
      </div>
      </div>}


 <div className=' p-4 md: border-fsfsdfr h-full border-gray-200  bg-white'>
    <div className="flex  mb-4">
     <h2 className="text-lg font-semibold mb-4">MY-Chats</h2>
     <button className="bg-blue-400 text-white  px-2 hover:bg-blue-500 rounded-lg ml-5"
     onClick={()=>setIsModalOpen(true)}
     > Create Group </button>
     {/* chat will be rendered here later */}
</div>
<div className="space-y-3 max-h-[70vh] overflow-y-auto">
    {chats.length==0?(
    <p className="text-sm text-gray-500">No chats to show...</p>):(
      chats.map((chat) => (
  <ChatListItem key={chat._id} chat={chat} user={user} isSelected={selectedChat?._id===chat._id}
    onClick={()=>{
       
        handleSelectChat(chat);
     
    }
       
    }
  />
))
    )
}
</div>
     
 </div>
    </>
}
export default MyChats
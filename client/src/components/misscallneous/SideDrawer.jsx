import { useState } from "react"
import { FaSearch, FaBell } from 'react-icons/fa';
import { ChatState } from "../../Contextapi/ChatProvider";
import {useNavigate} from 'react-router-dom'
import Togglebar from "./togglebar";
import Drawer from './Drawer'
import UserListItem from "../ListItem/UserListItem";





const SideDrawers=({messages,setMessages})=>{
const[search,setSearch]=useState('')
const [searchResult,setSearchResult]=useState([])
const [loading,setLoading]=useState(false)
const [loadingChat,setLoadingChat]=useState()
 const [open, setOpen] = useState(false)
 const [drawer,setDrawer]=useState(false)
const navigate=useNavigate() 
const{user,chats,setChats,setSelectedChat,notifications, setNotifications}=ChatState()

const handleSearch=async()=>{
  if(!search.trim()){
    alert("Please Enter something in search")
    return
  }
  try{
  
  const res = await fetch(`http://localhost:5000/user?search=${search}`, {
    method: 'GET',
   headers: {
        Authorization: `Bearer ${user.token}`, // ✅ space added here
      },
  });
  const result = await res.json()
if(res.ok){
  // parse the JSON response
  console.log(result);
  console.log('hello');

  setSearchResult(result.users); // assuming backend returns { user: [...] }
  setLoading(false);
  
}else{
  console.log('mistake')
}
  
  }catch(e){
    console.log(e)
  }

}
const accessChat=async(userId)=>{
  try{
 const res=await fetch('http://localhost:5000/chats',{
  method:'POST',
  headers:{
    "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
  },
  body:JSON.stringify({ userId}),
    });
    const result=await res.json()
     console.log("Chat fetch result:", result); 
if(res.ok){
console.log('u done it')
if (!chats.find((c) => c._id === result._id)) {
      setChats((prev) => [result, ...prev]);
    }
setSelectedChat(result)
} else{
  console.error('failed to open the chat')
}
}catch(e){
    console.error(e)
  }

}
    return<>
    <div className=" flex justify-between py-2 bg-white px-4  border-b border-gray-200 shadow-sm">
      <div>
      <button onClick={()=>{
        
      }} className="flex items-center  py-2 cursor-pointer hover:bg-opacity-100">
<FaSearch/>
<span  onClick={()=>setDrawer(true)}className="hidden sm:inline text-sm font-medium px-2">Search User</span>
      </button>
      </div>
      <div className="text-xl py-1 items-center"> Chit-Chat</div>
      {/* text-lg font-bold text-blue-600 */}
      <div className="flex" >
      <div className="px-2 py-2">
        <FaBell className="cursor-pointer" />
        {notifications.length > 0 && (
    <span className="absolute top-0 right-11 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
      {notifications.length}
    </span>)}
  </div>
   <div className="relative"> 
    {/* if we give a classname relative any thing you wrap inside thatt div and give taht div a classname name absolute
     the following div will ap[ear in refernce to taht div] */}
      <img
        src={user?.picture || user?.name}
        alt="avatar"
        className="w-8 h-8 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
      />

   {open ? <Togglebar  /> : null}

    </div>
</div>

{drawer ?
<Drawer  isOpen={drawer} handleSearch={handleSearch} onClose={()=>setDrawer(false)}  >
<div> 
  <h1 className="tex-bold mb-4 text-center p">Search User</h1>
</div>
 <div>
  <input
    type="text"
    onChange={(e) =>setSearch(e.target.value) }
    placeholder="Type something..."
    className="px-6 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  />
  <button onClick={handleSearch}
    className="bg-blue-500 hover:bg-blue-600 ml-3 text-white px-4 py-1 rounded-lg text-sm transition"
  > 
    Go
  </button> 
  {loading ? (
  <div className="mt-4 text-sm text-gray-600 bg-yellow-50 border-l-4 border-yellow-400 px-4 py-2 rounded">
    Loading users...
  </div>
) : (
  <div className="mt-4 max-h-64 overflow-y-auto">
    {searchResult.length > 0 ? (
      searchResult.map((user) => (
        <UserListItem key={user._id} user={user} handleClick={() => accessChat(user._id)} />
      ))
    ) : (
      <p className="text-gray-500 text-sm mt-2">No users found.</p>
    )}
  </div>
)}
 </div>
</Drawer>:null}
        </div>
    </>
}
export default SideDrawers
import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import { ChatState } from "../../Contextapi/ChatProvider"
// import {useHistory} from 'react-router-dom'
function Login(){
const[email,setEmail]=useState()
const [password,setPassword]=useState()
const [show,setShow]=useState(false)
const navigate=useNavigate()
const {user,setUser}=ChatState()
const handlelogin=async(e)=>{
    e.preventDefault()
    // const formData=new FormData()

    // formData.append('email',email)
    // formData.append('password',password)
    try{
const res=await fetch('https://chit-chat-5a6h.onrender.com/user/login',{
    method:'POST',
     headers: {
    'Content-Type': 'application/json'
  },
     body: JSON.stringify({ email, password })
})
// need to work on this part of the code
const data = await res.json(); // <-- parse the response


if(res.ok){
   alert('login successful')
   localStorage.setItem("userInfo", JSON.stringify(data));
   setUser(data)
   navigate('/chat')

} else{
  console.error()
}}catch(e){
        console.error('Login error:', e);
    alert('Something went wrong');
    }

}
return(
   <div className="max-w-sm  mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handlelogin}className="space-y-5">
          
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input 
        type="email"
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <div className="flex">
        <input 
          type={show ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="button"
          onClick={() => setShow(prev => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 text-sm"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
    <button type="submit"
    className="w-full bg-blue-600 text-white font-semi-bold py-2 rounded-md hover:bg-blue-700 transition duartion-300 ">
     Log in 
    </button>
    
        </form>
    </div>
    
)}
export default Login
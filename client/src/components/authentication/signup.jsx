
import { useState } from "react"
import { useEffect } from "react"
import {useNavigate} from 'react-router-dom'
// import {useHistory} from 'react-router-dom'
import Chatpage from "../../pages/chatpage"
function Signup(){
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [password,setPassword]=useState()
    const [confirmpassword,setConfirmpassword]=useState()
    const [pic,setPic]=useState()
    const [show,setShow]=useState(false)
    const [confirmshow,setconfirmShow]=useState(false)
    // const history =useHistory()
    const navigate=useNavigate()
    useEffect(()=>{
        if(confirmpassword&&password===confirmpassword){
            setconfirmShow(true)
        }else {setconfirmShow(false)}
    },[password,confirmpassword])
    const handleSubmit =async(e)=>{
        e.preventDefault()
        const formData=new FormData()
        formData.append('name',name)
        formData.append('email',email)
        formData.append('password',password)
        if(pic){
            formData.append('image',pic)
        }
        for (let pair of formData.entries()) {
  console.log(`${pair[0]}:`, pair[1]);
}

        try{
            const res=await fetch('https://chit-chat-5a6h.onrender.com/user/signup',{
                method:'POST',
                body:formData
            })
            console.log("Raw response:", res);
            const data=await res.json()
            console.log(data)
            console.log(typeof(data.picture))
            if(res.ok && data.picture){
                setPic(data.picture.toString())
                localStorage.setItem('userInfo',JSON.stringify(data))
                
                alert('Signup successful')
                navigate('/chat')

              
            }else{
                console.log(data.message)
                alert(data.message)
            }
        }
        catch(e){
            console.log(e)
        }
    }
    return<>
    <div className="max-w-md w-full mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Create an Account</h2>

  <form onSubmit={handleSubmit} className="space-y-5">

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input 
        type="text"
        required
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

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

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
      <div className="flex">
        <input 
          type={'password'}
          onChange={(e) => setConfirmpassword(e.target.value)}
          className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-green-500 text-sm">
          {confirmshow ? '✅✅': ''}
        </span>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
      <input 
        type="file"
        accept="image/*"
        onChange={(e) => setPic(e.target.files[0])}
        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>

    <button 
      type="submit"
      className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300"
    >
      Sign Up
    </button>
  </form>
</div>
    </>
}

export default Signup
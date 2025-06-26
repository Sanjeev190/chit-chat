// import {axios } from 'axios'
import Login from "../components/authentication/login"
import Signup from "../components/authentication/signup"
import { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'

const Homepage=()=>{
const [activeTab,setActiveTab]=useState('')
const navigate=useNavigate()
useEffect(()=>{
const user=JSON.parse(localStorage.getItem('userInfo'))
if (user){
    navigate('/chat')
}
},[navigate])

    return( <div>
        <div className="">
            saddsadsad
        </div>
        <div className="bg-white border border-gray-200  p-4 mt-20 mb-5 ml-60 mr-60 text-center  shadow rounded-lg ">
         <h1 className="text-black text-4xl custom-font " >Chit-Chat </h1> 
        </div>
        <div className="bg-white border border-gray-200  p-4 mb-5 ml-60 mr-60 text-center  shadow rounded-lg ">
            <button onClick={()=>{setActiveTab('login')}} className={`p-3 w-1/2 rounded-lg ${ activeTab==='login'? 'bg-blue-500 text-white':'bg-amber-50 hover:text-white  hover:bg-blue-500'}`}>
                Login
                </button>
            <button onClick={()=>{setActiveTab('signup')}}className={`p-3 w-1/2 rounded-lg ${activeTab==='signup'?'bg-blue-500 text-white':'bg-amber-50 hover:text-white hover:bg-blue-500'}`}>
                Signup

            </button>
            <div>
                {activeTab==='login'?<Login/>:<Signup/>}
            </div>
        </div>
        </div>

            
       
    )
     
  
}
export default Homepage
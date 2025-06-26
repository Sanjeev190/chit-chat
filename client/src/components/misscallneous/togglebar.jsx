import {useNavigate} from 'react-router-dom'
import { useState } from 'react'
import ProfileModel from './ProfileModal'
import { ChatState } from "../../Contextapi/ChatProvider";
const Togglebar=()=>{
const navigate=useNavigate()
const{user,setUser}=ChatState()
const[showProfile,setshowProfile]=useState(false)
const closeProfile=()=>setshowProfile(false)
const openProfile=()=>setshowProfile(true)
    return<>
    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-32 z-50">
          <button onClick={openProfile} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
           My Profile
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              localStorage.removeItem("userInfo");
              setUser(null)
              navigate('/')
            }}
          >
            Logout
          </button>
          
        </div>
        <div>

        </div>
        {showProfile ? <ProfileModel user={user}  isOpen={showProfile}closeProfile={closeProfile}/>:null}
        </>
}
export default Togglebar
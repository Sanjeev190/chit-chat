 import { useState } from "react"
 
 import Modal from './Modal'
 
 
 
  
 const ProfileModel=({user,isOpen,closeProfile})=>{

return( <Modal isOpen={isOpen} onClose={closeProfile}>
      <div className="flex flex-col items-center text-center">
        <img
          src={user.picture}
          alt="avatar"
          className="w-24 h-24 rounded-full mb-4 shadow-md"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Name: {user.name}
        </h2>
        <p className="text-gray-600  font-semibold text-xl">  Email: {user.email}</p>
      </div>
  
</Modal> 


)}


export default ProfileModel
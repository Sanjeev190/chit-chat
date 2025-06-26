const ChatListItem=({user,chat,isSelected,onClick})=>{
    const getSender=()=>{
        return chat.users.find((u)=>u._id !==user._id)?.name ||'unknown'
    }
    
    return<div  className={`flex items-center p-3 rounded-lg cursor-pointer transition 
        ${isSelected?'bg-blue-100':"bg-gray-100 hover:bg-red-50"}`}
        onClick={onClick}
    >
<img
 src={ chat.isGroupChat?"https://thumbs.dreamstime.com/b/design-can-be-used-as-logo-icon-complement-to-group-chat-124906811.jpg"
    :chat.users.find((u)=>u._id!==user._id)?.picture
    }
    alt="avatar"
    className="w-10 h-10 rounded-full mr-3"
    />
    <div className="flex-1">
        <p className='font-semibold text-sm'>
            {chat.isGroupChat?chat.chatname:getSender()}
        </p>
        {chat.latestMessage&&(
            <p className="text-xs text-gray-600 truncate">
                <strong>{chat.latestMessage.sender.name}</strong>
                <strong>Message: </strong> {chat.latestMessage.content}

            </p>
           
        )}
    </div>
    </div>

}
export default ChatListItem
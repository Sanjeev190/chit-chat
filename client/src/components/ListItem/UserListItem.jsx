const UserListItem = ({ user, handleClick }) => {
 
    return (
    <div
      className="flex items-center p-3 mb-2 bg-gray-100 hover:bg-blue-100 rounded-lg cursor-pointer transition"
      onClick={handleClick}
    >
      <img
        src={user.picture}
        alt={user.name}
        className="w-10 h-10 rounded-full mr-4"
      />
      <div>
        <h4 className="font-semibold text-sm">{user.name}</h4>
        <p className="text-xs text-gray-600">{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;

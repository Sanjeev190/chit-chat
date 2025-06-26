const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative transition-all duration-300 ease-in-out">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white shadow transition duration-200"
        >
          ✕
        </button>

        {/* Dynamic content passed in from parent */}
        {children}
      </div>
    </div>
  );
};

export default Modal;

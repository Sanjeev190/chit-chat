const Drawer = ({ isOpen, onClose, children, position = 'right' }) => {
  if (!isOpen) return null;

  const positionClasses =
    position === 'left' ? 'right-0' : 'left-0';

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer panel */}
      <div
        className={`fixed top-0 ${positionClasses} h-full w-1/4 bg-white bg-opacity-90 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen
            ? 'translate-x-0'
            : position === 'right'
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-200 hover:bg-red-600 hover:text-white text-gray-700 transition"
          aria-label="Close Drawer"
        >
          ✕
        </button>

        {/* Content inside Drawer */}
        <div className="p-6 text-gray-800 overflow-y-auto">{children}</div>
      </div>
    </>
  );
};

export default Drawer;

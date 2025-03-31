// Custom Modal
import React from "react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  modalText: String;
  btn1?: String;
  btn2?: String;
}

export const CustomModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  modalText,
  btn1,
  btn2,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-xs z-100">
      <div className="bg-blue-950 w-80 rounded-md shadow-lg p-4">
        <div className="flex flex-col items-center py-2">
          <p className="text-sm text-center text-white">{modalText}</p>
          <div className="flex gap-2 mt-4">
            <button
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer text-xs"
              onClick={onClose}
            >
              {btn1 ? btn1 : "Decline"}
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer text-xs"
              onClick={onAccept}
            >
              {btn2 ? btn2 : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

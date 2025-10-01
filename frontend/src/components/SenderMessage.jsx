import React from 'react';
import { useSelector } from 'react-redux';


const SenderMessage = ({ message }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="flex justify-end">
      <div className="bg-blue-500 text-white rounded-2xl rounded-br-none px-4 py-2 max-w-[75%] sm:max-w-[60%] md:max-w-[50%] flex flex-col gap-2">
        {message.image && (
          <img
            src={message.image.url}
            alt="sent"
            className="rounded-lg max-h-60 object-cover"
          />
        )}
        {message.message && <p className="break-words">{message.message}</p>}
        <div className="flex justify-end">
          <img
            src={userData.user.profileImage.url}
            className="w-6 h-6 rounded-full object-cover"
            alt="sender"
          />
        </div>
      </div>
    </div>
  );
};


export default SenderMessage;

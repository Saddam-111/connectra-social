import React from 'react';

const ReceiverMessage = ({ message }) => {
  return (
    <div className="flex justify-start">
      <div className="bg-white shadow rounded-2xl rounded-bl-none px-4 py-2 max-w-[75%] sm:max-w-[60%] md:max-w-[50%] flex flex-col gap-2">
        {message.image && (
          <img
            src={message.image.url}
            alt="received"
            className="rounded-lg max-h-60 object-cover"
          />
        )}
        {message.message && (
          <p className="text-gray-800 break-words">{message.message}</p>
        )}
        {message?.sender?.profileImage?.url && (
          <div className="flex justify-start">
            <img
              src={message.sender.profileImage.url}
              className="w-6 h-6 rounded-full object-cover"
              alt="receiver"
            />
          </div>
        )}
      </div>
    </div>
  );
};


export default ReceiverMessage;

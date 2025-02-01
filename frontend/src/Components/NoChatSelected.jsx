import React from "react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
      <div className="text-center p-6">
        <img
          src="/images/no-chat-selected.png" // Apne assets folder me ek achhi image rakh lo
          alt="No Chat Selected"
          className="w-40 h-40 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold text-gray-300">
          No Chat Selected
        </h2>
        <p className="text-gray-400 mt-2 text-lg">
          Select a friend from the left sidebar to start chatting.
        </p>
        <p className="text-gray-500 mt-2">
          Connect and chat in real-time with your friends!
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;

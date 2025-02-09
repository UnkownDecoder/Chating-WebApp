import React from "react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="hidden md:flex w-full flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-300">No Chat Selected</h2>
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
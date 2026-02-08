import React, { useContext, useEffect, useState, useRef } from "react";
import dp from "../assets/dp.webp";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";

function MessageList({ selectedUser }) {
  const [inputData, setInputData] = useState("");
  const [sendMessage, setSendMessage] = useState(false);
  const [getMessages, setGetMessages] = useState([]);
  const { serverUrl } = useContext(authDataContext);
  const { handleGetProfile, userData } = useContext(userDataContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputData.trim() || !selectedUser?._id) return;

    setSendMessage(true);
    try {
      await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        { message: inputData },
        {
          headers: { user_id: userData._id },
          withCredentials: true,
        }
      );
      setInputData("");
      setSendMessage(false);
      await handlegetMessage();
    } catch (error) {
      console.log(error);
      setSendMessage(false);
    }
  };

  const handlegetMessage = async () => {
    if (!selectedUser?._id) return;

    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getMessage/${selectedUser._id}`,
        {
          headers: { user_id: userData._id },
          withCredentials: true,
        }
      );
      setGetMessages(result.data.conversation.message || []);
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedUser?._id) handlegetMessage();
  }, [selectedUser]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chat
      </div>
    );
  }

  return (
    <div className="w-full sm:w-4/5 h-full flex flex-col relative pt-28 sm:pt-30">
      {/* Header */}
      <div className="flex flex-col items-center justify-center p-4 pb-6 sm:pb-10">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={selectedUser.profileImage?.url || dp}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-center mt-2">
          <span className="font-bold text-gray-800 text-sm sm:text-base">
            {selectedUser.firstName} {selectedUser.lastName}
          </span>
          <button
            onClick={() => handleGetProfile(selectedUser.userName)}
            className="text-xs sm:text-sm text-white bg-black px-2 py-1 rounded mt-1"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 pb-28 sm:pb-32">
        {getMessages.map((msg) => {
          const isSender = msg.senderId === userData._id;
          const profilePic = isSender
            ? userData.profileImage?.url || dp
            : selectedUser.profileImage?.url || dp;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"}`}
            >
              {/* Receiver pic */}
              {!isSender && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={profilePic} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[70%] px-3 py-2 rounded-xl break-words text-sm sm:text-base ${
                  isSender ? "bg-green-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {msg.message}
              </div>

              {/* Sender pic */}
              {isSender && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={profilePic} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input */}
      <div className="fixed bottom-0 left-0 w-full px-4 py-3 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          {/* Input */}
          <input
            type="text"
            placeholder="Type a message..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border-2 border-gray-300 rounded-full px-4 py-3 outline-none text-sm sm:text-base focus:ring-2 focus:ring-green-500"
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={sendMessage}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition text-sm sm:text-base font-semibold"
          >
            {sendMessage ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageList;

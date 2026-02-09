import React, { useContext, useEffect, useState, useRef } from "react";
import dp from "../assets/dp.webp";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { IoArrowBack } from "react-icons/io5";

function MessageList({ selectedUser, setSelectedUser }) {
  const [inputData, setInputData] = useState("");
  const [sendMessage, setSendMessage] = useState(false);
  const [getMessages, setGetMessages] = useState([]);

  const { serverUrl } = useContext(authDataContext);
  const { handleGetProfile, userData } = useContext(userDataContext);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputData.trim() || !selectedUser?._id) return;

    setSendMessage(true);
    try {
      await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        { message: inputData },
        { headers: { user_id: userData._id }, withCredentials: true }
      );

      setInputData("");
      setSendMessage(false);
      await handlegetMessage();
    } catch (error) {
      console.log(error);
      setSendMessage(false);
    }
  };

  // Get messages
  const handlegetMessage = async () => {
    if (!selectedUser?._id) return;

    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getMessage/${selectedUser._id}`,
        { headers: { user_id: userData._id }, withCredentials: true }
      );

      const sortedMessages = (result.data.conversation.message || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setGetMessages(sortedMessages);
    } catch (error) {
      console.log(error);
    }
  };

  // Load messages when user changes
  useEffect(() => {
    if (selectedUser?._id) handlegetMessage();
  }, [selectedUser]);

  // Scroll to bottom on messages update
  useEffect(() => {
    scrollToBottom();
  }, [getMessages]);

  if (!selectedUser) return null;

  return (
    <div className="w-full sm:w-4/5 h-full flex flex-col relative pt-28">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 p-4 pb-6 sticky top-0 bg-white z-10">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={selectedUser.profileImage?.url || dp}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">
            {selectedUser.firstName} {selectedUser.lastName}
          </span>
          <button
            onClick={() => handleGetProfile(selectedUser.userName)}
            className="text-xs text-white bg-black px-2 py-1 rounded mt-1"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 pb-28">
        {getMessages.map((msg) => {
          const isSender = msg.senderId === userData._id;
          const profilePic = isSender
            ? userData.profileImage?.url || dp
            : selectedUser.profileImage?.url || dp;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={profilePic}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[70%] px-3 py-2 rounded-xl break-words ${
                  isSender ? "bg-green-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {msg.message}
              </div>

              {isSender && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={profilePic}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input with Back Button for small devices */}
      <div className="fixed bottom-0 left-0 w-full px-4 py-3 bg-white border-t">
        <div className="max-w-3xl mx-auto flex items-center gap-2 relative">
          {/* Back button inside input */}
          <button
            className="md:hidden absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-700"
            onClick={() => setSelectedUser(null)}
          >
            <IoArrowBack />
          </button>

          <input
            type="text"
            placeholder="Type a message..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border-2 rounded-full px-12 py-3 outline-none"
          />

          <button
            onClick={handleSendMessage}
            disabled={sendMessage}
            className="bg-green-500 text-white px-4 py-1 rounded-full"
          >
            {sendMessage ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageList;

import React, { useState } from "react";
import Nav from "../components/Nav";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";

export default function Message() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <Nav />
      <div className="flex flex-col md:flex-row min-h-screen overflow-hidden">
        
        {/* Small screen: Sidebar only when no user selected */}
        <div className={`md:hidden w-full ${selectedUser ? "hidden" : "block"}`}>
          <Sidebar setSelectedUser={setSelectedUser} />
        </div>

        {/* Large screen: Sidebar always visible */}
        <div className="hidden md:block md:w-80">
          <Sidebar setSelectedUser={setSelectedUser} />
        </div>

        {/* Chat / Message List */}
        <div className={`flex-1 ${selectedUser ? "block" : "hidden"} md:block`}>
          <MessageList selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        </div>

      </div>
    </>
  );
}

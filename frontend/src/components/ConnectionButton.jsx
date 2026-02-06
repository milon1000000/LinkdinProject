import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("https://linkdinproject.onrender.com", {
  withCredentials: true,
});

function ConnectionButton({ userId }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);
  const [status, setStatus] = useState("Connect");
  const navigate = useNavigate();

  // SEND CONNECTION
  const handleSendConnection = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/connection/sendConnection/${userId}`,
        {},
        { withCredentials: true }
      );
      // status socket / getStatus থেকে আসবে
    } catch (error) {
      console.log(error);
    }
  };

  // REMOVE CONNECTION
  const handleRemoveConnection = async () => {
    try {
      await axios.delete(
        `${serverUrl}/api/connection/removeConnection/${userId}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  // GET CONNECTION STATUS (Backend matched)
  const handleGetStatus = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection/getConnectionStatus/${userId}`,
        { withCredentials: true }
      );
      setStatus(result.data?.status || "Connect");
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
    if (!userData?._id) return;

    socket.emit("register", userData._id);
    handleGetStatus();

    const statusHandler = ({ updateUserId, newStatus }) => {
      if (updateUserId === userId) {
        setStatus(newStatus);
      }
    };

    socket.on("statusUpdate", statusHandler);

    return () => {
      socket.off("statusUpdate", statusHandler);
    };
  }, [userData?._id, userId]);

  const handleClick = async () => {
    if (status === "disconnect") {
      await handleRemoveConnection();
    } else if (status === "received") {
      navigate("/network");
    } else if (status === "pending") {
      return;
    } else {
      await handleSendConnection();
    }
  };

  // Button text purely backend-status driven
  const getButtonText = () => {
    if (status === "pending") return "Pending";
    if (status === "received") return "received";
    if (status === "disconnect") return "disconnect";
    return "Connect";
  };

  return (
    <button
      className="min-w-[120px] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff]"
      onClick={handleClick}
      disabled={status === "pending"}
    >
      {getButtonText()}
    </button>
  );
}

export default ConnectionButton;

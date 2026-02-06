import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
export let socket = io("https://linkedin-backend-fpwo.onrender.com");
import { useNavigate } from "react-router-dom";
export const userDataContext = createContext();
function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [profile, setProfile] = useState(null);
  const { serverUrl } = useContext(authDataContext);
  const [edit, setEdit] = useState(false);
  const[getUsersData,setGetUsersData]=useState([]);
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/getCurrentUser", {
        withCredentials: true,
      });
      // console.log(result.data)
      setUserData(result.data.user);
    } catch (error) {
      if (error.response) {
        // backend error
        console.log("Status:", error.response.status);
        console.log("Message:", error.response.data.message);
      } else {
        // network / server down
        console.log("Error:", error.message);
        setUserData(null);
      }
    }
  };

  const getPost = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/post/getPost", {
        withCredentials: true,
      });
      console.log(result.data);
      setPostData(result.data.post);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers=async(req,res)=>{
    try{
      const result=await axios.get(serverUrl+"/api/user/getUsers",{
        withCredentials:true
      });
      console.log(result.data);
      setGetUsersData(result.data.users)
    }catch(error){
      console.log(error)
    }
  }

  const handleGetProfile = async (userName) => {
    try {
      const result = await axios.get(
        serverUrl + `/api/user/getProfile/${userName}`,
        { withCredentials: true },
      );
      //  setUserData(result.data.user)
      setProfile(result.data.user);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getPost();
    getUsers()
  }, []);

  const value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    handleGetProfile,
    profile,
    setProfile,
    getUsersData,
    setGetUsersData,
    getUsers
  };
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;

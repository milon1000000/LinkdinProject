import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { MdOutlineCheckCircle } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";
import Nav from "../components/Nav";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

function Network() {
  const { serverUrl } = useContext(authDataContext);
  const[connections,setConnections]=useState([])
  const handleGetRequests = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/connection/getConnectionRequest`,
        { withCredentials: true }
      );
      setConnections(result.data.requests)
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptConnection=async(requestId)=>{
      try{
       const result=await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{},{withCredentials:true});
       setConnections(connections.filter((con) => con._id !== requestId));

      }catch(error){
        console.log(error)
      }
    }
  
    const handleRejectConnection=async(requestId)=>{
      try{
       const result=await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{},{withCredentials:true});
       setConnections(connections.filter((con)=>con._id !==requestId))
      }catch(error){
        console.log(error)
      }
    }

  useEffect(()=>{
    handleGetRequests()
  },[])

  return (
    <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[15px] lg:px-[20px] flex flex-col  gap-[40px]">
      <Nav />
     <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[20px] text-[22px] text-gray-600">
      Invitations {connections.length}
     </div>
     <div>
      {connections.length>0 &&<div className="w-full lg:max-w-[60%] mx-auto shadow-lg rounded-lg flex flex-col gap-[10px] lg:gap-[20px] min-h-[100px]">
      {connections.map((connection,index)=>(
        <div className="w-full min-h-[100px] flex justify-between items-center p-[20px]">
          {/* left */}
          <div className="w-full flex items-center justify-start gap-[10px]">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer flex items-center justify-center">
              <img src={connection.sender.profileImage.url ||dp} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="text-[19px] font-semibold text-gray-800">
              {`${connection.sender.firstName} ${connection.sender.lastName}`}
            </div>
          </div>

          {/* right */}
          <div className="flex justify-center items-center gap-[10px]">
          <button className="text-[#18c5ff] font-semibold">
            <MdOutlineCheckCircle className="w-[40px] h-[40px]" onClick={()=>handleAcceptConnection(connection._id)}/>
          </button>
          <button className="text-[#ff4218] font-semibold">
            <RxCrossCircled className="w-[36px] h-[36px]" onClick={()=>handleRejectConnection(connection._id)}/>
          </button>
          </div>

        </div>
      ))}
     </div>}
     </div>
    </div>
  );
}

export default Network;

import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { IoSearchSharp } from "react-icons/io5";


function Sidebar({setSelectedUser}) {
  const { getUsersData} = useContext(userDataContext);
  const [input, setInput] = useState("");
  const [activeSearch, setActiveSerch] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const { serverUrl } = useContext(authDataContext);


  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true },
      );
      // console.log(result.data);
      setSearchData(result.data.user);
      setActiveSerch(true)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleSearch();
    if(!input){
      setActiveSerch(false)
    }
  }, [input]);

  return (
    <div className="lg:w-75 md:w-75 w-full min-h-screen bg-blue-100 pt-24">
     <div className="p-2 mx-2 flex items-center relative">
  <input
    type="text"
    className="border-2 px-8 py-1 rounded-lg w-full"
    value={input}
    onChange={(e) => setInput(e.target.value)}
  placeholder="search users..."/>
  <IoSearchSharp className="w-5 h-5 absolute right-4 text-gray-500" />
</div>

     {!activeSearch &&(
      <div>
         {getUsersData.map((user) => (
        <div key={user._id} className="flex items-center gap-5 p-3" onClick={()=>setSelectedUser(user)}>
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" >
            <img
              src={user.profileImage.url || dp}
              alt=""
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="text-10 font-semibold">{`${user.firstName} ${user.lastName}`}</div>
        </div>
      ))}
      </div>
     )}


      {activeSearch &&(
        <div>
           {searchData.map((search) => (
        <div key={search._id} className="flex items-center gap-5 p-3" onClick={()=>setSelectedUser(search)}>
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={search.profileImage.url || dp}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-10 font-semibold">{`${search.firstName} ${search.lastName}`}</div>
        </div>
      ))}
        </div>
      )}
    </div>
  );
}

export default Sidebar;






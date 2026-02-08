import React, { useContext, useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { IoSearchSharp } from "react-icons/io5";

function Sidebar({ setSelectedUser }) {
  const { getUsersData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [input, setInput] = useState("");
  const [activeSearch, setActiveSearch] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const handleSearch = async () => {
    if (!input.trim()) {
      setActiveSearch(false);
      setSearchData([]);
      return;
    }

    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      setSearchData(result.data.user || []);
      setActiveSearch(true);
    } catch (error) {
      console.log(error);
      setActiveSearch(false);
      setSearchData([]);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [input]);

  const renderUser = (user) => (
    <div
      key={user._id}
      className="flex items-center gap-5 p-3 cursor-pointer hover:bg-green-300 rounded-lg"
      onClick={() => setSelectedUser(user)}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
        <img
          src={user?.profileImage?.url || dp}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-sm font-semibold">{`${user.firstName} ${user.lastName}`}</div>
    </div>
  );

  return (
    <div className="lg:w-72 md:w-72 w-full min-h-screen fixed bg-green-200 pt-24 overflow-y-auto">
      {/* Search Input */}
      <div className="p-2 mx-2 flex items-center relative">
        <input
          type="text"
          className="border-2 border-gray-300 px-8 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search users..."
        />
        <IoSearchSharp className="w-5 h-5 absolute right-4 text-gray-500" />
      </div>

      {/* User List */}
      <div className="mt-2">
        {!activeSearch &&
          getUsersData.map((user) => renderUser(user))
        }

        {activeSearch &&
          (searchData.length > 0
            ? searchData.map((user) => renderUser(user))
            : <div className="p-4 text-gray-500 text-sm">No users found.</div>
          )
        }
      </div>
    </div>
  );
}

export default Sidebar;

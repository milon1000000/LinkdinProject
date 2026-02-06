import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { TbMessage2Filled } from "react-icons/tb";
import { IoNotificationsSharp } from "react-icons/io5";
import logo2 from "../assets/logo2.png";
import dp from "../assets/dp.webp";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";

function Nav() {
  const [activeSearch, setActiveSerch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [searchUser, setSearchUser] = useState(false);
  const { userData, setUserData, handleGetProfile } =
    useContext(userDataContext);
  const [showPopup, setShowPopup] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${searchInput}`,
        { withCredentials: true },
      );
      // console.log(result.data);
      setSearchData(result.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (searchInput) {
      handleSearch();
    }
    if (searchInput !== "") {
      setSearchUser(true);
    } else {
      setSearchUser(false);
    }
  }, [searchInput]);

  return (
    <div className="w-full h-[80px] bg-[white] fixed top-0 left-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] md:p-0 z-[80]">
      {/* left side */}
      <div className="flex justify-center items-center gap-[10px]">
        <div
          onClick={() => {
            setActiveSerch(false);
            navigate("/");
          }}
        >
          <img src={logo2} alt="" className="w-[50px]" />
        </div>

        {/* {!activSearch &&} */}

        {!activeSearch && (
          <div>
            <IoSearchSharp
              className="w-[23px] h-[23px] lg:hidden"
              onClick={() => setActiveSerch(true)}
            />
          </div>
        )}

        {searchUser && (
          <div
            className="absolute top-[80px] h-[200px] left-0 
                w-[95%] 
                mx-[10px] 
                min-h-[100px] 
                shadow-lg bg-white 
                lg:left-[20px] lg:w-[700px] lg:mx-0 overflow-auto"
          >
            {searchData.map((sea) => (
              <div key={sea._id} className="flex flex-col justify-center gap-[10px] justify-start text-[20px] p-[10px]">
                <div
                  className="flex items-center gap-[10px]"
                  onClick={() => handleGetProfile(sea.userName)}
                >
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex flex-col items-center justify-center">
                    <img
                      src={sea.profileImage.url || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold">
                    {`${sea.firstName} ${sea.lastName}`}
                  </div>
                </div>
                <div className="pl-[40px] text-[18px]">
                  <div>{sea.headline}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <form
          className={`w-[190px] md:w-[350px] h-[40px] bg-[#f0efe7] flex items-center gap-[10px] px-[10px] py-[5px]  rounded-md ${
            activeSearch ? "flex" : "hidden"
          } lg:flex`}
        >
          <div>
            <IoSearchSharp className="w-[23px] h-[23px] text-gray-600" />
          </div>
          <input
            type="text"
            className="w-[80%] h-full bg-transparent outline-none border-0"
            placeholder="search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      {/* Right side */}

      <div className="flex justify-center items-center gap-[20px] relative">
        {showPopup && (
          <div className="w-[300px] min:h-[300px] bg-white shadow-lg absolute top-[75px] lg:right-0 md:right-0 right-[30px] rounded-lg flex flex-col items-center p-[20px] gap-[20px]">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
              <img
                src={userData.profileImage.url || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[19px] font-bold text-gray-700">
              {`${userData.firstName} ${userData.lastName}`}
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
              onClick={() => {
                (handleGetProfile(userData.userName), setShowPopup(false));
              }}
            >
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-700"></div>
            <div
              className="flex w-full items-center justify-start text-gray-600 gap-[10px]"
              onClick={() => navigate("/network")}
            >
              <FaUserFriends className="w-[23px] h-[23px] text-gray-600" />
              <div>My Networks</div>
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        <div
          className="flex flex-col justify-center items-center text-gray-600 hidden lg:flex"
          onClick={() => navigate("/")}
        >
          <IoMdHome className="w-[23px] h-[23px] text-gray-600" />
          <div>Home</div>
        </div>
        <div
          className="flex flex-col justify-center items-center text-gray-600 hidden lg:flex"
          onClick={() => navigate("/network")}
        >
          <FaUserFriends className="w-[23px] h-[23px] text-gray-600" />
          <div>My Networks</div>
        </div>
        <div
          className="flex flex-col justify-center items-center text-gray-600"
          onClick={() => navigate("/message")}
        >
          <TbMessage2Filled className="w-[23px] h-[23px] text-gray-600" />
          <div className="hidden md:block">Message</div>
        </div>

          <div
          className="flex flex-col justify-center items-center text-gray-600"
          onClick={() => navigate("/notification")}
        >
          <IoNotificationsSharp className="w-5.75 h-5.75 text-gray-600" />
          <div className="hidden md:block">Notifications</div>
        </div>
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
          <img
            src={userData.profileImage.url || dp}
            alt=""
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowPopup((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;

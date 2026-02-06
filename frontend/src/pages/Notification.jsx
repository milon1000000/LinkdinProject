
import { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { authDataContext } from "../context/AuthContext";
import { RxCrossCircled } from "react-icons/rx";
import dp from "../assets/dp.webp";
import moment from "moment";
import axios from "axios";

function Notification() {
  const { serverUrl } = useContext(authDataContext);
  const [notificationData, setNotificationData] = useState([]);

  const handleGetNotification = async () => {
    try {
      const result = await axios.get(
        serverUrl + "/api/notification/getNotifications",
        { withCredentials: true }
      );
      setNotificationData(result.data.notification);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClear = async () => {
    try {
      await axios.delete(
        `${serverUrl}/api/notification/clearAllNotifications`,
        { withCredentials: true }
      );
      await handleGetNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      await axios.delete(
        `${serverUrl}/api/notification/deleteNotifications/${id}`,
        { withCredentials: true }
      );
      await handleGetNotification();
    } catch (error) {
      console.log(error);
    }
  };

  function handleMessage(type) {
    if (type === "like") return "liked your post";
    if (type === "comment") return "commented on your post";
    return "Accept your connection";
  }

  useEffect(() => {
    handleGetNotification();
  }, []);

  return (
    <div className="w-screen h-[100vh] overflow-hidden bg-gray-100 pt-[100px] px-[15px] lg:px-[20px] flex flex-col gap-[40px]">
      <Nav />
      <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center justify-between p-[20px] text-[22px] text-gray-600">
        <div>Notification {notificationData.length}</div>
        {notificationData.length > 0 && (
          <div
            className="min-w-[100px] border-2 border-red-500 text-red-500 rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleClear}
          >
            <button>Clear</button>
          </div>
        )}
      </div>

      {notificationData.length > 0 && (
        <div className="w-full lg:max-w-[60%] mx-auto shadow-lg rounded-lg flex flex-col gap-[10px] lg:gap-[20px] h-[100vh] overflow-auto bg-white">
          {notificationData.map((noti) => (
            <div
              key={noti._id}
              className="flex justify-between items-start w-full"
            >
              {/* parent w-full added */}
              <div className="w-full">
                <div className="w-full min-h-[100px] flex items-center p-[20px]">
                  <div className="w-full flex items-center gap-[10px]">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                      <img
                        src={noti.relatedUser.profileImage.url || dp}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="text-[15px] font-semibold text-gray-800">
                      {noti.relatedUser.firstName}{" "}
                      {noti.relatedUser.lastName}
                    </div>
                    <div className="text-[14px] font-semibold text-gray-800">
                      {handleMessage(noti.type)}{" "}
                      {moment(noti.createdAt).fromNow()}
                    </div>
                  </div>
                </div>

                {noti.relatedPost && (
                  <div className="flex items-center gap-[10px] p-[20px] border-b-2 border-gray-300 w-full">
                    <div className="w-[80px] h-[50px]">
                      <img
                        src={noti.relatedPost.image.url}
                        alt=""
                        className="h-full"
                      />
                    </div>
                    <div>{noti.relatedPost.description}</div>
                  </div>
                )}
              </div>

              <div
                className="p-[20px] text-[20px] lg:text-[40px] cursor-pointer"
                onClick={() => handleDeleteOne(noti._id)}
              >
                <RxCrossCircled />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;

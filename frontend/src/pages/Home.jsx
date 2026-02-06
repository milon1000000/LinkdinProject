import React, { useContext, useEffect, useRef } from "react";
import Nav from "../components/Nav.jsx";
import dp from "../assets/dp.webp";
import { FiPlus } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { FiCamera } from "react-icons/fi";
import { HiPencil } from "react-icons/hi2";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { userDataContext } from "../context/UserContext.jsx";
import EditProfile from "../components/EditProfile.jsx";
import { useState } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import Post from "../components/Post.jsx";
function Home() {
  const {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    handleGetProfile,
  } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [uploadPost, setUploadPost] = useState(false);
  const [description, setDescription] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [posting, setPosting] = useState(false);
  const [suggestData, setSuggestData] = useState([]);

  const image = useRef();

  function handleImage(e) {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }



  const handlePost = async () => {
    setPosting(true);

    try {
      const formData = new FormData();

      // TRIM description (main fix)
      formData.append("description", description);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        serverUrl + "/api/post/createPost",
        formData,
        { withCredentials: true },
      );

      setPostData((prev) => [result.data.post, ...prev]);

      setDescription("");
      setFrontendImage("");
      setBackendImage("");
      setPosting(false);
      setUploadPost(false);
    } catch (error) {
      //backend validation error
      if (error.response?.status === 400) {
        setUploadPost(false);
        setPosting(false);
      }

      setPosting(false);
    }
  };

  const handleSuggestUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/suggestedUser`, {
        withCredentials: true,
      });
      // console.log(result);
      setSuggestData(result.data.suggestedUser);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleSuggestUser();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f0efe7] pt-25 flex flex-col lg:flex-row items-start justify-center gap-5 px-5 relative pb-12.5">
      {edit && <EditProfile />}
      <Nav />
      <div className="w-full lg:w-[25%] min-h-50 bg-[white] shadow-lg rounded-lg p-2.5 relative">
        <div
          className="w-full h-25 bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer"
          onClick={() => setEdit(true)}
        >
          <img src={userData.coverImage.url || null} alt="" className="w-full" />
          <FiCamera className="absolute right-5 top-5 w-6.25 h-6.25 text-white cursor-pointer" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[65px] left-[35px] cursor-pointer flex items-center justify-center">
          <img
            src={userData.profileImage.url || dp}
            alt=""
            className="w-full h-full object-cover"
            onClick={() => setEdit(true)}
          />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex items-center justify-center">
          <FiPlus className="text-white" onClick={() => setEdit(true)} />
        </div>
        <div className="mt-[30px] pl-[20px] font-semibold text-gray-700">
          <div className="text-[22px]">{`${userData.firstName} ${userData.lastName}`}</div>
          <div className="text-[18px] font-semibold">
            {userData.headline || ""}
          </div>
          <div className="text-[16px] font-semibold text-gray-600">
            {userData.location}
          </div>
        </div>

        <button
          className="w-[100%] h-[40px] rounded-full text-[#2dc0ff] border-2 my-[20px] flex items-center justify-center gap-[10px] cursor-pointer"
          onClick={() => setEdit(true)}
        >
          Edit Profile
          <HiPencil />
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={image}
        hidden
        onChange={handleImage}
      />

      {uploadPost && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-center">
            <div className="w-[90%] max-w-[500px] h-[600px] shadow-lg rounded-lg bg-white fixed  z-[200] p-[20px] flex flex-col justify-start items-start gap-[20px]">
              <div className="absolute right-[20px] top-[20px] cursor-pointer">
                <RxCross1
                  className="w-[25px] h-[25px] cursor-pointer text-gray-800 font-bold"
                  onClick={() => setUploadPost(false)}
                />
              </div>
              <div className="flex items-center justify-start gap-[10px]">
                <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
                  <img
                    src={userData.profileImage?.url || dp}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[22px]">
                  {`${userData.firstName} ${userData.lastName}`}
                </div>
              </div>
              <textarea
                className={`w-full ${
                  frontendImage ? "h-[200px]" : "h-[550px]"
                } border-none outline-none p-[10px] resize-none text-[19px]`}
                placeholder="what do you want to talk about..?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div
                className={`${
                  frontendImage
                    ? "w-full h-[300px] overflow-hidden flex justify-center items-center"
                    : ""
                }`}
              >
                <img
                  src={frontendImage || null}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full h-[200px] flex flex-col">
                <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-500">
                  <BsImage
                    className="w-[24px] h-[24px] text-gray-500"
                    onClick={() => image.current.click()}
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="w-[100px] h-[50px] mt-[40px] bg-[#2dc0ff] rounded-lg text-white text-[19px]"
                    onClick={handlePost}
                    disabled={posting}
                  >
                    {posting ? "posting..." : "post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="w-full lg:w-[50%] min-h-[120px] bg-[#f0efe7] shadow-lg flex flex-col gap-[20px]">
        <div className="w-full h-[120px] bg-white rounded-lg flex justify-start items-center gap-[10px] px-[20px]">
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex justify-center items-center cursor-pointer">
            <img
              src={userData.profileImage.url || dp}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="w-[80%] h-[60px] border-2 rounded-full border-gray-500 flex justify-start items-center px-[20px] hover:bg-gray-200 duration-200"
            onClick={() => setUploadPost(true)}
          >
            start post
          </button>
        </div>
        {/* {postData.map((postdata, index) => (
          <Post
            key={index}
            id={postdata._id}
            description={postdata.description}
            author={postdata.author}
            like={postdata.like}
            comment={postdata.comment}
            image={postdata.image}
            createdAt={postdata.createdAt}
            createdAtDate={postData.createdAtDate}
          />
        ))} */}
        {postData.map((postdata) => (
          <Post
            key={postdata._id}
            id={postdata._id}
            description={postdata.description}
            author={postdata.author}
            like={postdata.like}
            comment={postdata.comment}
            image={postdata.image}
            createdAt={postdata.createdAt}
            createdAtDate={postdata.createdAtDate}
          />
        ))}
      </div>

      <div className="w-full flex flex-col gap-2.5 lg:w-[25%] min-h-50 bg-[white] shadow-lg hidden lg:flex p-5">
        <h1 className="font-semibold pb-2.5">Suggested User</h1>

        {suggestData.map((su) => (
          <div
            key={su._id}
            className="flex gap-2.5 items-center hover:bg-gray-200 p-2.5 rounded-lg duration-100"
            onClick={() => handleGetProfile(su.userName)}
          >
           
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={su.profileImage?.url || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Headline column */}
            <div className="flex flex-col leading-tight">
              <div className="font-semibold text-[14px]">
                {su.firstName} {su.lastName}
              </div>
              
              <div className="text-[12px] text-gray-500">{su.headline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;

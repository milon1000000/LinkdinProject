import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import dp from "../assets/dp.webp";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import Post from "../components/Post.jsx";
import EditProfile from "../components/EditProfile.jsx";
import ConnectionButton from "../components/ConnectionButton.jsx";

function Profile() {
  const {
    userData,
    postData,
    profile,
    setUserData,
    edit,
    setEdit,
    setPostData,
  } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [profilePost, setProfilePost] = useState([]);

  const currentProfile = profile?._id ? profile : userData;

  

  
  useEffect(() => {
    if (postData.length > 0 && currentProfile?._id) {
      setProfilePost(
        postData.filter((post) => post.author._id === currentProfile._id)
      );
    }
  }, [postData, currentProfile]);

  if (!currentProfile) return null;

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px]">
      <Nav />
      <div className="w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]">
        {/* Cover & Profile */}
        <div className="relative bg-white pb-[40px] rounded shadow-lg">
          <div className="w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center">
            <img
              src={currentProfile.coverImage?.url || dp}
              alt=""
              className="w-full"
            />
          </div>
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden absolute top-[65px] left-[35px] flex items-center justify-center">
            <img
              src={currentProfile.profileImage?.url || dp}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-[30px] pl-[20px] font-semibold text-gray-700">
            <div className="text-[24px] font-bold">{`${currentProfile.firstName} ${currentProfile.lastName}`}</div>
            <div className="text-[18px] font-semibold">
              {currentProfile.headline || ""}
            </div>
            <div className="text-[16px] font-semibold text-gray-600">
              {currentProfile.location || ""}
            </div>
            <div className="text-[16px] font-semibold text-gray-600">{`${currentProfile.connection.length} connection`}</div>
          </div>
          {edit && <EditProfile />}
          {profile?._id == userData?._id && (
            <div
              className="w-[150px] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center ml-[16px] mt-[10px]"
              onClick={() => setEdit(true)}
            >
              <button>Edit Profile</button>
            </div>
          )}
          {profile?._id != userData?._id && (
            <div className="ml-[16px] mt-[10px]">
              <ConnectionButton userId={profile?._id}/>
            </div>
          )}
        </div>

        {/* Posts Count */}
        <div className="w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg">
          {`Post (${profilePost.length})`}
        </div>

        {/* Skills */}
        {currentProfile.skills?.length > 0 && (
          <div className="w-full min-h-[100px] bg-white flex flex-col gap-[10px] justify-center p-[20px] font-semibold rounded-lg">
            <div className="text-[22px] text-gray-600 pl-[15px]">Skills</div>
            <div className="flex flex-wrap justify-start items-center gap-[20px] text-gray-600 p-[20px]">
              {currentProfile.skills.map((skill, index) => (
                <div key={index} className="text-[20px]">
                  {skill}
                </div>
              ))}
            </div>
            {profile?._id ===userData._id &&<div
              className="w-[150px] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center ml-[16px] mt-[10px]"
              onClick={() => setEdit(true)}
            >
              <button>Add skills</button>
            </div>}
          </div>
        )}

        {/* Education */}
        {currentProfile.education?.length > 0 && (
          <div className="w-full bg-white flex flex-col gap-[20px] p-[20px] rounded-lg shadow-md">
            <div className="text-[22px] text-gray-600 pl-[5px] font-semibold">
              Education
            </div>
            {currentProfile.education.map((edu, index) => (
              <div
                key={index}
                className="w-full bg-gray-100 p-[15px] rounded shadow-sm flex flex-col gap-1"
              >
                <div className="text-[20px] font-semibold">
                  Collage: {edu.collage}
                </div>
                <div className="text-[18px]">Degree: {edu.degree}</div>
                <div className="text-[16px] text-gray-700">
                  FieldOfStudy: {edu.filedOfStudy}
                </div>
                 {profile?._id ===userData._id &&<div
              className="w-[150px] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center  mt-[10px]"
              onClick={() => setEdit(true)}
            >
              <button>Add Education</button>
            </div>}
              </div>
            ))}
           
          </div>
        )}

        {/* Experience */}
        {currentProfile.experience?.length > 0 && (
          <div className="w-full bg-white flex flex-col gap-[20px] p-[20px] rounded-lg shadow-md">
            <div className="text-[22px] text-gray-600 pl-[5px] font-semibold">
              Experience
            </div>
            {currentProfile.experience.map((ex, index) => (
              <div
                key={index}
                className="w-full bg-gray-100 p-[15px] rounded shadow-sm flex flex-col gap-1"
              >
                <div className="text-[20px] font-semibold">
                  Title: {ex.title}
                </div>
                <div className="text-[18px]">Company: {ex.company}</div>
                <div className="text-[16px] text-gray-700">
                  Description: {ex.description}
                </div>
                 {profile?._id ===userData._id &&<div
              className="w-[150px] h-[40px] border-2 rounded-full border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center  mt-[10px]"
              onClick={() => setEdit(true)}
            >
              <button>Add Experience</button>
            </div>}
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        {profilePost.map((post, index) => (
          <Post
            key={index}
            id={post._id}
            description={post.description}
            author={post.author}
            like={post.like}
            comment={post.comment}
            image={post.image}
            createdAt={post.createdAt}
            createdAtDate={post.createdAtDate}
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;

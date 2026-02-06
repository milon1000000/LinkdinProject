import React, { use, useContext, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from "../context/UserContext";
import dp from "../assets/dp.webp";
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { useRef } from "react";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";

function EditProfile() {
  const { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [headline, setHeadline] = useState(userData.headline || "");
  const [location, setLocation] = useState(userData.location || "");
  const [gender, setGender] = useState(userData.gender || "");
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkills, setNewSkills] = useState("");
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducations, setNewEducations] = useState({
    collage: "",
    degree: "",
    filedOfStudy: "",
  });
  const [experiences, setExperiences] = useState(userData.experience || []);
  const [newExperiences, setNewExperiences] = useState({
    title: "",
    company: "",
    description: "",
  });

  const [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage.url || dp
  );
  const [backendProfileImage, setBackendProfileImage] = useState(null);
  const [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage.url || null
  );
  const [backendCoverImage, setBackendCoverImage] = useState(null);
  const[saving,setSaving]=useState(false);

  const profileImage = useRef();
  const coverImage = useRef();

  function addSkill() {
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }

  function addEducation() {
    if (
      newEducations.collage &&
      newEducations.degree &&
      newEducations.filedOfStudy
    ) {
      setEducations([...educations, newEducations]);
    }
    setNewEducations({
      collage: "",
      degree: "",
      filedOfStudy: "",
    });
  }

  function addExperience() {
    if (
      newExperiences.title &&
      newExperiences.company &&
      newExperiences.description
    ) {
      setExperiences([...experiences, newExperiences]);
    }
    setNewExperiences({
      title: "",
      company: "",
      description: "",
    });
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  function removedEducation(education) {
    if (educations.includes(education)) {
      setEducations(educations.filter((e) => e !== education));
    }
  }

  function removedExperience(experience) {
    if (experiences.includes(experience)) {
      setExperiences(experiences.filter((ex) => ex !== experience));
    }
  }

  function handleProfileImage(e) {
    const file = e.target.files[0];
    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  }

  function handleCoverImage(e) {
    const file = e.target.files[0];
    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("userName", userName);
      formData.append("headline", headline);
      formData.append("location", location);
      formData.append("gender", gender);
      formData.append("skills", JSON.stringify(skills));
      formData.append("education", JSON.stringify(educations));
      formData.append("experience", JSON.stringify(experiences));

      if (backendProfileImage) {
        formData.append("profileImage", backendProfileImage);
      }
      if (backendCoverImage) {
        formData.append("coverImage", backendCoverImage);
      }

      const result = await axios.put(
        serverUrl + "/api/user/updateProfile",
        formData,
        { withCredentials: true });
        setUserData(result.data.user);
        setEdit(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
      setEdit(false)
    }
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 left-0 z-[100] flex justify-center items-center">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImage}
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImage}
      />

      <div className="w-full h-full bg-black absolute top-0  opacity-[0.5]"></div>
      <div className="w-[90%] max-w-[500px] h-[600px] bg-white z-[200] shadow-lg rounded-lg relative p-[10px] overflow-auto">
        <div className="absolute top-[20px] right-[20px]">
          <RxCross1
            className="w-[25px] h-[25px] font-bold text-gray-800"
            onClick={() => setEdit(false)}
          />
        </div>
        <div
          className="w-full h-[150px]  bg-gray-500 rounded-lg  mt-[40px] cursor-pointer overflow-hidden"
          onClick={() => coverImage.current.click()}
        >
          <img
            src={frontendCoverImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <FiCamera className="absolute right-[20px] top-[60px] w-[25px] h-[25px] text-white cursor-pointer" />
        </div>
        <div
          className="w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px] cursor-pointer"
          onClick={() => profileImage.current.click()}
        >
          <img
            src={frontendProfileImage}
            alt=""
            className="w-full h-full  object-cover"
          />
        </div>
        <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[90px] rounded-full flex items-center justify-center">
          <FiPlus
            className="text-white"
            onClick={() => profileImage.current.click()}
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-[20px] mt-[50px]">
          <input
            type="text"
            placeholder="firstName"
            className="w-full h-[50px] border-2 border-gray-600 rounded-lg px-[10px] py-[5px] outline-none text-[18px]"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="lastName"
            className="w-full h-[50px] border-2 border-gray-600 rounded-lg px-[10px] py-[5px] text-[18px] outline-none"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="userName"
            className="w-full h-[50px] border-2 border-gray-600 rounded-lg px-[10px] py-[5px] text-[18px] outline-none"
            value={userName}
            onChange={(e)=>setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="headline"
            className="w-full h-[50px] border-2 px-[10px] py-[5px] rounded-lg text-[18px] border-gray-600 outline-none"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <input
            type="text"
            placeholder="location"
            className="w-full h-[50px] border-2 border-gray-600 rounded-lg px-[10px] py-[5px] text-[18px] outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="gender (male/female/other)"
            className="w-full h-[50px] border-2 border-gray-600 rounded-lg px-[10px] py-[5px] text-[18px] outline-none"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />

          {/* skills */}
          <div className="w-full border-2 border-gray-600 p-[10px] flex flex-col gap-[10px]">
            <h1 className="text-[19px] font-semibold">Skills</h1>
            {skills && (
              <div className="flex flex-col gap-[10px]">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="w-full  h-[40px] border-[1px] border-gray-600 p-[10px] bg-gray-200 rounded-lg flex items-center justify-between"
                  >
                    {" "}
                    <span>{skill}</span>
                    <RxCross1
                      className="w-[20px] h-[20px] text-gray-600"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col items-start gap-[10px]">
              <input
                type="text"
                placeholder="add new skills"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-full border-2 border-gray-600 h-[50px] rounded-lg px-[10px] py-[5px] text-[16px] outline-none"
              />
              <button
                className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] cursor-pointer"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
          </div>

          {/* education */}
          <div className="w-full border-2 border-gray-600 p-[10px] p-[10px] gap-[10px]">
            <h1 className="text-[18px] font-bold mb-[10px] font-semibold">
              Educations
            </h1>
            {educations && (
              <div className="w-full flex flex-col gap-[10px]">
                {educations.map((education, index) => (
                  <div
                    key={index}
                    className="w-full bg-gray-200 border-[1px] border-gray-600 rounded-lg p-[10px] text-[18px] flex items-center justify-between"
                  >
                    <div>
                      <div>Collage:{education.collage}</div>
                      <div>Degree:{education.degree}</div>
                      <div>Field Of Study:{education.filedOfStudy}</div>
                    </div>
                    <RxCross1
                      className="text-gray-600 text-[20px]"
                      onClick={() => removedEducation(education)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="w-full flex flex-col items-start mt-[20px] gap-[10px]">
              <input
                type="text"
                value={newEducations.collage}
                onChange={(e) =>
                  setNewEducations({
                    ...newEducations,
                    collage: e.target.value,
                  })
                }
                placeholder="collage"
                className="w-full h-[40px] border-2 border-gray-600 text-[18px] rounded-lg px-[10px]"
              />

              <input
                type="text"
                value={newEducations.degree}
                onChange={(e) =>
                  setNewEducations({ ...newEducations, degree: e.target.value })
                }
                placeholder="degree"
                className="w-full h-[40px] border-2 border-gray-600 text-[18px] rounded-lg px-[10px]"
              />

              <input
                type="text"
                value={newEducations.filedOfStudy}
                onChange={(e) =>
                  setNewEducations({
                    ...newEducations,
                    filedOfStudy: e.target.value,
                  })
                }
                placeholder="field of study"
                className="w-full h-[40px] border-2 border-gray-600 text-[18px] rounded-lg px-[10px]"
              />

              <button
                onClick={addEducation}
                className="w-full h-[40px] border-2 border-[#2dc0ff] rounded-full text-[#2dc0ff] text-[20px] py"
              >
                Add
              </button>
            </div>
          </div>

          {/* experience */}

          <div className="w-full border-2 border-gray-600 p-[10px] gap-[10px]">
            <h1 className="text-[18px] font-semibold mb-[20px]">experience</h1>
            {experiences && (
              <div className="w-full flex flex-col gap-[10px]">
                {experiences.map((experience) => (
                  <div className="w-full  border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex items-center justify-between text-[18px]">
                    <div>
                      <div>Title:{experience.title}</div>
                      <div>Company:{experience.company}</div>
                      <div>Description:{experience.description}</div>
                    </div>
                    <RxCross1
                      className="text-[20px] text-gray-600"
                      onClick={() => removedExperience(experience)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col items-start gap-[10px] pb-[20px] mt-[20px]">
              <input
                type="text"
                placeholder="title"
                className="w-full h-[40px] border-2 border-gray-600 rounded-lg px-[10px] text-[18px]"
                value={newExperiences.title}
                onChange={(e) =>
                  setNewExperiences({
                    ...newExperiences,
                    title: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="company"
                className="w-full h-[40px] border-2 border-gray-600 rounded-lg px-[10px] text-[18px]"
                value={newExperiences.company}
                onChange={(e) =>
                  setNewExperiences({
                    ...newExperiences,
                    company: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="description"
                className="w-full h-[40px] border-2 border-gray-600 rounded-lg px-[10px] text-[18px]"
                value={newExperiences.description}
                onChange={(e) =>
                  setNewExperiences({
                    ...newExperiences,
                    description: e.target.value,
                  })
                }
              />
              <button
                className="w-full h-[40px] border-2 rounded-full text-[#2dc0ff] border-[#2dc0ff] text-[18px]"
                onClick={addExperience}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <button
          className="w-[100%] h-[50px] border-2 mt-[40px] rounded-full bg-[#24b2ff] text-white"
          onClick={() => handleSaveProfile()}
        disabled={saving} >
          {saving?"saving...":"Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default EditProfile;

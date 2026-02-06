import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
function Signup() {
  const[show,setShow]=useState(false);
  const{serverUrl}=useContext(authDataContext);
  const navigate=useNavigate();
  const[firstname,setFirstName]=useState("");
  const[lastname,setlastName]=useState("");
  const[username,setUserName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const{setUserData,getUsers}=useContext(userDataContext);


  const formData={
      firstName:firstname,
        lastName:lastname,
        userName:username,
        email:email,
        password:password
  };
 
  const handleSignUp=async(e)=>{
    e.preventDefault();
      setLoading(true)
    try{
      const result=await axios.post(serverUrl+"/api/auth/signup",formData
        ,{withCredentials:true});
      setLoading(false)
      setFirstName("");
      setlastName("");
      setUserName("");
      setEmail("");
      setPassword("");
      setErr("");
      setUserData(result.data.user);
      // setGetUsersData(result.data.users)
      getUsers()

      navigate("/");
    }catch(error){
      setLoading(false);
  if (error.response && error.response.data && error.response.data.message) {
    setErr(error.response.data.message);
  } else {
    setErr("Something went wrong");
  }
          }
  }


  return (
    <div className='w-full h-screen bg-[white] flex flex-col justify-start items-center gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="" />
      </div>
      <form  className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]' onSubmit={handleSignUp}>
      <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign Up</h1>
      <input name='firstName' autoComplete='given-name' type="text" placeholder='firstname' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={firstname} onChange={(e)=>setFirstName(e.target.value)}/>
      <input name='lastName' autoComplete='family-name' type="text" placeholder='lastname' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={lastname} onChange={(e)=>setlastName(e.target.value)}/>
      <input name="userName" autoComplete="username" type="text" placeholder='username' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={username} onChange={(e)=>setUserName(e.target.value)}/>
      <input name='email' autoComplete='email' type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
        <input name='password' autoComplete='new-password' type={show?"text":"password"} placeholder='password' required className='w-full h-full border-none border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={password} onChange={(e)=>setPassword(e.target.value)}/>
       <span className='absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer font-semibold' onClick={()=>setShow(prev=>!prev)}>{show?"hidden":"show"}</span>
      </div>
      {err && (<p className='text-center text-red-500 text-[18px] font-semibold'>*{err}</p>)}
      <button type='submit' className='w-[100%] h-[50px] bg-[#24b2ff] rounded-full text-white mt-[40px]' disabled={loading}>{loading?"loading...":"Sign Up"}</button>
      <p onClick={()=>navigate("/login")} className='text-center'>Already have an account? <span className='text-[#24b2ff] font-semibold cursor-pointer'>Sign in</span></p>
      </form>
    </div>
  )
}

export default Signup;






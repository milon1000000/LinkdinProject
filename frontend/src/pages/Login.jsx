import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const {setUserData,getUsers} = useContext(userDataContext);

  const formData = {
    email: email,
    password: password,
  };

  //  handleSignIn

  const handleSingIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/login", formData, {
        withCredentials: true,
      });
      console.log(result);
      setEmail("");
      setPassword("");
      setUserData(result.data.user);
      getUsers()
      setLoading(false);
      setErr("");
      navigate("/");
    } catch (error) {
      setLoading(false);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErr(error.response.data.message);
      } else {
        setErr("Something went wrong");
      }
    }
  };

  return (
    <div className="w-full h-screen bg-[white] flex flex-col justify-start items-center gap-[10px]">
      <div className="w-full h-20 flex items-center p-7.5 lg:p-8.75">
        <img src={logo} alt="" />
      </div>
      <form
        onSubmit={handleSingIn}
        className="w-[90%] max-w-[400px] h-[450px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px] rounded-md"
      >
        <h1 className="text-[30px] font-semibold mb-[30px] text-gray-800">
          Sign In
        </h1>
        <input
          type="email"
          placeholder="email"
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md px-[20px] py-[10px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="password"
            required
            className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-[20px] top-[10px] font-semibold text-[#24b2ff] text-[18px]"
          >
            {show ? "hidden" : "show"}
          </span>
        </div>

        {err && (
          <p className="text-center text-red-500 text-[18px] font-semibold">
            *{err}
          </p>
        )}

        <button
          type="submit"
          className="w-[100%] h-[50px] bg-[#24b2ff] rounded-full font-semibold text-white mt-[20px]"
          disabled={loading}
        >
          {loading ? "loading..." : "Sign In"}
        </button>
        <p onClick={() => navigate("/signup")} className="text-center">
          want to create a new account ?{" "}
          <span className="text-[#24b2ff] font-semibold cursor-pointer">
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;

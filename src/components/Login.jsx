import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const login = async (e) => {
    e.preventDefault(); // stop form reload
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data)); 
      setError(""); 
      navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error(err);
    }
  };
  const goToSignup=()=>{
    navigate('/signup')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={login}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(""); // clear error on typing
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(""); // clear error on typing
          }}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Login
        </button>
        <p className="text-center text-blue-500 cursor-pointer" onClick={goToSignup}>Didn't signed up?Go to SignUp</p>
      </form>
    </div>
  );
};

export default Login;

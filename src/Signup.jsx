import React, { useState } from "react";
import { BASE_URL } from "./utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "./utils/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
const navigate=useNavigate()
  const signup = async (e) => {
    e.preventDefault(); 
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, email, password, age, gender, about, photoUrl },
        { withCredentials: true }
      );

      console.log("Signup success:", res.data.data);
      dispatch(addUser(res.data.data)); 
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error(err);
    }
  };
  const goToLogin=()=>{
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={signup} 
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="First Name"
          className="w-full p-2 mb-3 border rounded-lg"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-2 mb-3 border rounded-lg"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          className="w-full p-2 mb-3 border rounded-lg"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          className="w-full p-2 mb-3 border rounded-lg"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Other</option>
        </select>

        <textarea
          placeholder="About yourself"
          rows="3"
          className="w-full p-2 mb-3 border rounded-lg"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        ></textarea>

        <input
          type="text"
          placeholder="Photo URL"
          className="w-full p-2 mb-3 border rounded-lg"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Signup
        </button>
        <p className="text-center text-blue-500 cursor-pointer" onClick={goToLogin}>Already Signed up? Go to Login</p>
      </form>
    </div>
  );
};

export default Signup;

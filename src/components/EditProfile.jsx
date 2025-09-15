import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  // ✅ Sync state when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
      setPhotoUrl(user.photoUrl || "");
    }
  }, [user]);

  const edit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      return setError("First name and Last name are required");
    }
    if (age && (age < 1 || age > 120)) {
      return setError("Please enter a valid age");
    }

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, about, photoUrl },
        { withCredentials: true }
      );

      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={edit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

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
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

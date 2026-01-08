import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const dispatch = useDispatch();
const navigate=useNavigate()
  const signup = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);
      let res;
      if (photoFile) {
        const form = new FormData();
        form.append("firstName", firstName);
        form.append("lastName", lastName);
        form.append("email", email);
        form.append("password", password);
        form.append("age", age);
        form.append("gender", gender);
        form.append("about", about);
        form.append("photo", photoFile);

        res = await axios.post(BASE_URL + "/signup", form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post(
          BASE_URL + "/signup",
          { firstName, lastName, email, password, age, gender, about, photoUrl },
          { withCredentials: true }
        );
      }

      console.log("Signup success:", res.data.data);
      dispatch(addUser(res.data.data)); 
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const goToLogin=()=>{
    navigate('/login')
  }

  useEffect(() => {
    // update preview when photoUrl (typed) changes and no file selected
    if (!photoFile) {
      setPreviewSrc(photoUrl || '');
    }
  }, [photoUrl, photoFile]);

  useEffect(() => {
    // when a file is selected, create an object URL and show preview
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      // revoke previous blob URL if any
      if (previewSrc && previewSrc.startsWith('blob:')) URL.revokeObjectURL(previewSrc);
      setPreviewSrc(url);
      return () => URL.revokeObjectURL(url);
    }

    // cleanup on unmount
    return () => {
      if (previewSrc && previewSrc.startsWith('blob:')) URL.revokeObjectURL(previewSrc);
    };
  }, [photoFile]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoUrl('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={signup} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">Create account</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" placeholder="First Name" className="p-2 border rounded-lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" className="p-2 border rounded-lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />

          <input type="email" placeholder="Email" className="p-2 border rounded-lg md:col-span-2" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div className="relative md:col-span-1">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="p-2 border rounded-lg w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-2 top-2 text-sm text-slate-500">{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          <input type="number" placeholder="Age" className="p-2 border rounded-lg" value={age} onChange={(e) => setAge(e.target.value)} />

          <select className="p-2 border rounded-lg" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Other</option>
          </select>

          <textarea placeholder="About yourself" rows="3" className="p-2 border rounded-lg md:col-span-2" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>

          <div className="md:col-span-2">
            <input type="text" placeholder="Photo URL" className="p-2 border rounded-lg w-full" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-center gap-3">
          <button type="submit" disabled={loading} className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-white ${loading ? 'bg-sky-400 cursor-wait' : 'bg-sky-600 hover:bg-sky-700'}`}>
            {loading ? (
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/><path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"/></svg>
            ) : null}
            Signup
          </button>

          <button type="button" onClick={goToLogin} className="text-sky-600 hover:underline">Already signed up? Log in</button>
        </div>
      </form>
    </div>
  );
};

export default Signup;

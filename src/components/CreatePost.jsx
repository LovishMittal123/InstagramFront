import { useDispatch, useSelector } from "react-redux";
import { addPosts } from "../utils/postSlice";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
const navigate=useNavigate()
  // ✅ get posts state
  const posts = useSelector((state) => state.post);

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        BASE_URL + "/posts",
        { caption, imageUrl },
        { withCredentials: true }
      );

      console.log("Post created:", res.data);
      setMessage("✅ Post created successfully!");
      setImageUrl("");
      setCaption("");

      // ✅ add new post at the top
      dispatch(addPosts([res.data.post, ...posts])); 
      navigate('/profile')
      
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handlePost}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Post</h2>

        {message && (
          <p className="text-center text-sm mb-3 text-green-600">{message}</p>
        )}

        <input
          type="text"
          placeholder="Photo Url"
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="What's on your mind?"
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

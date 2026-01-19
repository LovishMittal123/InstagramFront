import { useDispatch, useSelector } from "react-redux";
import { addPosts } from "../utils/postSlice";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [imageFile, setImageFile] = useState(null); // ✅ File from device
  const [preview, setPreview] = useState(null); // ✅ Preview image
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ get posts state
  const posts = useSelector((state) => state.post);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file)); // Preview for user
  };

  // Handle post submission
  const handlePost = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage("❌ Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("caption", caption);

      const res = await axios.post(`${BASE_URL}/posts`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created:", res.data);
      setMessage("✅ Post created successfully!");
      setImageFile(null);
      setCaption("");
      setPreview(null);

      // ✅ add new post at the top
      dispatch(addPosts([res.data.post, ...posts]));
      navigate("/profile");
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
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Post</h2>

        {message && (
          <p className="text-center text-sm mb-3 text-green-600">{message}</p>
        )}

        {/* ✅ Image file input */}
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          onChange={handleImageChange}
        />

        {/* ✅ Image preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full mb-3 rounded-lg"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}

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

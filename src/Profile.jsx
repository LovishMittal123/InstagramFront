import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./utils/constants";
import { addPosts, removePosts } from "./utils/postSlice";
import { Trash2 } from "lucide-react";
import { removeUser } from "./utils/userSlice";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const posts = useSelector((store) => store.post);
  const [show, setShow] = useState(null); // store ID instead of boolean
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToEdit=()=>{
    navigate('/editProfile')
  }
  const goOnPosts = () => {
    navigate("/createpost");
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(BASE_URL + "/posts/me", {
        withCredentials: true,
      });
      dispatch(addPosts(res.data));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      // delete from backend
      await axios.delete(`${BASE_URL}/posts/${id}`, {
        withCredentials: true,
      });

      // update redux store
      dispatch(removePosts(id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const handleLogout=async()=>{
    try {
      await axios.post(BASE_URL+'/logout',{},{withCredentials:true})
      dispatch(removeUser())
      navigate('/login')
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <div className="flex flex-col items-center mt-8 w-full px-4 md:w-3/4 lg:w-1/2 mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-xl mb-6 w-full border border-gray-200 shadow-sm">
        {/* Profile Image */}
        <img
          className="w-24 h-24 rounded-full object-cover border border-gray-300 shadow-sm"
          src={
            user?.photoUrl ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="profile"
        />

        {/* Name + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 transition cursor-pointer" onClick={goToEdit}>
              Edit profile
            </button>
            <button
              onClick={goOnPosts}
              className="bg-blue-500 px-4 py-2 rounded-xl text-white hover:bg-blue-600 transition cursor-pointer"
            >
              Create Post
            </button>
          </div>
        </div>
        <button className="bg-red-500 px-4 py-2 rounded-xl text-white hover:bg-red-600 transition cursor-pointer" onClick={handleLogout}>Logout</button>
      </div>

      {/* Posts Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((element) => (
          <div
            key={element._id}
            className="relative border border-gray-300 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Delete Button */}
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer z-10"
              onClick={() => handleDelete(element._id)}
            >
              <Trash2 />
            </button>

            {/* Post Image */}
            <img
              onClick={() =>
                setShow(show === element._id ? null : element._id)
              }
              className="w-full aspect-square object-cover cursor-pointer"
              src={element.imageUrl}
              alt="post"
            />

            {/* Post Details */}
            {show === element._id && (
              <div className="p-3">
                <p className="font-semibold">
                  {element.createdBy.firstName} {element.createdBy.lastName}
                </p>
                <p className="text-sm text-gray-700">{element.caption}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(element.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;

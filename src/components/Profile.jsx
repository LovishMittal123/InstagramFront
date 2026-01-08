import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addPosts, removePosts } from "../utils/postSlice";
import { Trash2 } from "lucide-react";
import { removeUser } from "../utils/userSlice";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const posts = useSelector((store) => store.post);
  const safePosts = Array.isArray(posts) ? posts : [];

  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToEdit = () => navigate("/editProfile");
  const goOnPosts = () => navigate("/createpost");

  // ✅ FIXED: dispatch only posts array
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/posts/me`, {
        withCredentials: true,
      });

      dispatch(addPosts(res.data)); // ✅ IMPORTANT
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/posts/${id}`, {
        withCredentials: true,
      });
      dispatch(removePosts(id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 w-full px-4 md:w-3/4 lg:w-2/3 mx-auto">
      {/* Profile Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl mb-8 w-full border border-gray-200 shadow-sm bg-white">
        <img
          className="w-28 h-28 rounded-full object-cover border border-gray-300 shadow-sm"
          src={
            user?.photoUrl ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="profile"
        />

        <div className="flex flex-col sm:flex-1 gap-3">
          <h1 className="text-2xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>

          <div className="flex flex-wrap gap-3">
            <button
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              onClick={goToEdit}
            >
              Edit Profile
            </button>

            <button
              onClick={goOnPosts}
              className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600 transition"
            >
              Create Post
            </button>

            <button
              className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <hr className="w-full border-gray-300 mb-6" />

      {/* Posts Grid */}
      {safePosts.length === 0 ? (
        <div className="text-gray-500 text-lg mt-6">No posts yet</div>
      ) : (
        <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safePosts.map((element) => (
            <div
              key={element._id}
              className="relative border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* Delete Button */}
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
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

              {/* Caption */}
              {show === element._id && (
                <div className="p-3 border-t border-gray-200 text-sm">
                  <p className="font-semibold">
                    {element.createdBy.firstName}{" "}
                    {element.createdBy.lastName}
                  </p>
                  <p>{element.caption}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(element.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

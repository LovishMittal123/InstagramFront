import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addPosts } from "../utils/postSlice";
import { addLike } from "../utils/likeSlice";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const dispatch = useDispatch();
  const postData = useSelector((store) => store.post);
  const posts=postData?postData:[]
  const connections = useSelector((store) => store.connection);
  const [likedPosts, setLikedPosts] = useState({});
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      });
      dispatch(addPosts(res.data));
    } catch (err) {
      console.error("Feed fetch error:", err);
    }
  };

  const fetchLike = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/posts/${id}/like`,
        {},
        { withCredentials: true }
      );

      dispatch(addLike({ postId: id, likes: res.data.likes }));

      setLikedPosts((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const goToSuggestion = () => {
    navigate("/suggestions");
  };

  // 👇 New function to handle navigating to a user's profile
  const goToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      {posts.length === 0 && (
        <p className="text-center text-gray-500">No posts to show</p>
      )}

      {connections.length === 0 && posts.length === 0 && (
        <button
          className="bg-blue-500 text-white p-2 rounded-xl cursor-pointer mx-auto block transition"
          onClick={goToSuggestion}
        >
          Go to Suggestion Page
        </button>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Post Header */}
          <div
            className="flex items-center gap-3 p-4 cursor-pointer"
            onClick={() => goToUserProfile(post.createdBy._id)}
          >
            <img
              src={post.createdBy.photoUrl}
              alt="profile"
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <p className="font-semibold">
                {post.createdBy.firstName} {post.createdBy.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="post"
              className="w-full max-h-[500px] object-contain border border-gray-200"
            />
          )}

          {/* Like Button */}
          <div className="flex items-center gap-3 px-5 py-2">
            <p
              className="text-4xl cursor-pointer select-none"
              onClick={() => fetchLike(post._id)}
            >
              {likedPosts[post._id] ? "❤️" : "♡"}
            </p>
            <span className="text-gray-600 text-sm">
              {post.likes?.length || 0} likes
            </span>
          </div>

          {/* Caption */}
          <div className="p-4 flex gap-2 items-center">
            <p
              className="font-semibold cursor-pointer"
              onClick={() => goToUserProfile(post.createdBy._id)}
            >
              {post.createdBy.firstName} {post.createdBy.lastName}
            </p>
            <p className="text-gray-800">{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;

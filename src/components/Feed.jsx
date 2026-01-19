import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addPosts } from "../utils/postSlice";
import { addLike } from "../utils/likeSlice";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const posts = useSelector((store) => store.post) || [];
  const connections = useSelector((store) => store.connection) || [];

  const [likedPosts, setLikedPosts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch feed posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      });

      dispatch(addPosts(res.data));
    } catch (err) {
      console.error("Feed fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Like / Unlike post
  const fetchLike = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/posts/${id}/like`,
        {},
        { withCredentials: true }
      );

      dispatch(addLike({ postId: id, likes: res.data.likes }));
      setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const goToSuggestion = () => navigate("/suggestions");
  const goToUserProfile = (userId) => navigate(`/profile/${userId}`);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading feed...</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts to show</p>
        {connections.length === 0 && (
          <button
            onClick={goToSuggestion}
            className="mt-4 inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-md shadow hover:bg-sky-700 transition"
          >
            Explore suggestions
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-6 px-4">
      {posts.map((post) => {
        const creator = post.createdBy || {};
        const dateObj = post.createdAt ? new Date(post.createdAt) : null;
        const showTime = dateObj && !isNaN(dateObj.getTime());
        const timeLabel = showTime
          ? dateObj.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
          : "";

        return (
          <article key={post._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <header className="flex items-center gap-3 p-4">
              <button
                onClick={() => goToUserProfile(creator._id)}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-slate-200">
                  <img
                    src={creator.photoUrl || "https://via.placeholder.com/150"}
                    alt={creator.firstName || "User"}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                  />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {creator.firstName} {creator.lastName}
                  </p>
                  {showTime && (
                    <p className="text-xs text-slate-500">{timeLabel}</p>
                  )}
                </div>
              </button>
            </header>

            {post.imageUrl && (
              <div className="bg-black/5">
                <img
                  src={post.imageUrl}
                  alt={post.caption || "post image"}
                  className="w-full max-h-[600px] object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/800x800?text=No+Image")
                  }
                />
              </div>
            )}

            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fetchLike(post._id)}
                    className={`p-2 rounded-full transition ${
                      likedPosts[post._id] ? "bg-red-100 text-red-500" : "hover:bg-slate-100"
                    }`}
                    aria-label="Like post"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        likedPosts[post._id] ? "fill-red-500 text-red-500" : "text-slate-700"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21s-7-4.35-9-7.5A5.5 5.5 0 0112 3a5.5 5.5 0 019 10.5C19 16.65 12 21 12 21z" />
                    </svg>
                  </button>
                  <span className="text-sm text-slate-600">
                    {post.likes?.length || 0} likes
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <button className="px-2 py-1 rounded hover:bg-slate-100">
                    Comment
                  </button>
                  <button className="px-2 py-1 rounded hover:bg-slate-100">
                    Share
                  </button>
                </div>
              </div>

              {post.caption && (
                <p className="mt-3 text-slate-900">
                  <span className="font-semibold mr-2">{creator.firstName}</span>
                  {post.caption}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Feed;

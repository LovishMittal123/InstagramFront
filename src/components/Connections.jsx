import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link, useNavigate } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const connections = useSelector((store) => store.connection) || [];
  const [loading, setLoading] = useState(true);

  // Fetch connections from backend
  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to user profile
  const goToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading connections...</p>;
  }

  if (!connections.length) {
    return <p className="text-center mt-10">No connections found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-100">
        My Connections
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {connections.map((user) => (
          <div
            key={user._id}
            className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            onClick={() => goToUserProfile(user._id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && goToUserProfile(user._id)}
          >
            {/* Profile Photo */}
            <div className="flex items-center justify-center w-24 h-24 rounded-full overflow-hidden ring-2 ring-sky-400 shadow-md mb-3">
              <img
                src={user.photoUrl || "https://via.placeholder.com/150"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/150")
                }
              />
            </div>

            {/* Name */}
            <p className="font-semibold text-lg text-slate-900 dark:text-slate-50 truncate w-full">
              {user.firstName} {user.lastName}
            </p>

            {/* Bio */}
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 w-full">
              {user.about || "No bio available"}
            </p>

            {/* Actions */}
            <div className="mt-4 w-full flex gap-3">
              <Link
                to={`/chat/${user._id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg shadow-sm transition">
                  Chat
                </button>
              </Link>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToUserProfile(user._id);
                }}
                className="w-1/2 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;

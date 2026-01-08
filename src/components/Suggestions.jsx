import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestions } from "../utils/suggestionsSlice";
import { useNavigate } from "react-router-dom";

const Suggestions = () => {
  const dispatch = useDispatch();
  const suggestions = useSelector((store) => store.suggestions);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/suggestions`, {
        withCredentials: true,
      });
      // ✅ Make sure we always dispatch an array
      dispatch(setSuggestions(Array.isArray(res.data.data) ? res.data.data : []));

    } catch (error) {
      console.error("Error fetching suggestions:", error);
      dispatch(setSuggestions([]));
    } finally {
      setLoading(false);
    }
  };

  const follow = async (toUserId) => {
    try {
      await axios.post(`${BASE_URL}/request/send/${toUserId}`, {}, { withCredentials: true });
      // Remove the followed user from suggestions safely
      dispatch(setSuggestions(Array.isArray(suggestions) ? suggestions.filter(u => u._id !== toUserId) : []));
    } catch (error) {
      console.error("Error sending follow request:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const navigate = useNavigate();

  const viewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  if (loading) {
    return <p className="text-center mt-6">Loading suggestions...</p>;
  }

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return <p className="text-center mt-6">No suggestions available.</p>;
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-100">Suggestions for you</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {suggestions?.map((user) => (
          <div
            key={user._id}
            className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg transition-transform duration-200"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && viewProfile(user._id)}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-sky-400 shadow-md mb-3">
              <img
                src={user.photoUrl || 'https://via.placeholder.com/150'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
              />
            </div>

            <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-50 truncate w-full">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 w-full">{user.about || 'No bio available'}</p>

            <div className="mt-4 w-full flex gap-3">
              <button
                onClick={() => follow(user._id)}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg shadow-sm transition"
                aria-label={`Follow ${user.firstName}`}
              >
                Follow
              </button>

              <button
                onClick={() => viewProfile(user._id)}
                className="w-1/2 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                aria-label={`View ${user.firstName} profile`}
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

export default Suggestions;

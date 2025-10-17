import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestions } from "../utils/suggestionsSlice";

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

  if (loading) {
    return <p className="text-center mt-6">Loading suggestions...</p>;
  }

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return <p className="text-center mt-6">No suggestions available.</p>;
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Suggestions for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map((user) => (
          <div
            key={user._id}
            className="flex flex-col items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <img
              src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt={user.firstName}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <h1 className="mt-3 text-lg font-medium text-gray-800 text-center">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-gray-600 text-center line-clamp-2 mt-1">
              {user.about || "No bio available"}
            </p>
            <button
              onClick={() => follow(user._id)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full cursor-pointer"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;

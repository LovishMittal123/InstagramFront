import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestions } from "../utils/suggestionsSlice";

const Suggestions = () => {
  const dispatch = useDispatch();
  const suggestions = useSelector((store) => store.suggestions);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/suggestions", {
        withCredentials: true,
      });
      console.log(res.data);
      dispatch(setSuggestions(res.data.data || []));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // ✅ Accepts toUserId so it works for each user
  const follow = async (toUserId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/send/${toUserId}`,
        {},
        { withCredentials: true }
      );
      console.log("Follow response:", res.data);

      // Optional: remove followed user from suggestions
      dispatch(
        setSuggestions(suggestions.filter((user) => user._id !== toUserId))
      );
    } catch (error) {
      console.error("Error sending follow request:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Suggestions for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map((element) => (
          <div
            key={element._id}
            className="flex flex-col items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition"
          >
            {/* Profile Image */}
            <img
              src={
                element.photoUrl ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt={element.firstName}
              className="w-20 h-20 rounded-full object-cover border"
            />

            {/* Name */}
            <h1 className="mt-3 text-lg font-medium text-gray-800 text-center">
              {element.firstName} {element.lastName}
            </h1>

            {/* About */}
            <p className="text-sm text-gray-600 text-center line-clamp-2 mt-1">
              {element.about || "No bio available"}
            </p>

            {/* Follow Button */}
            <button
              onClick={() => follow(element._id)} // ✅ pass userId
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

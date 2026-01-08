import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const fetchSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/allUsers`, {
        withCredentials: true,
      });

      // ✅ IMPORTANT: store only array
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSearch();
  }, []);

  // 🛡 Safety guard
  const safeUsers = Array.isArray(users) ? users : [];

  const searchedItems = safeUsers.filter((user) => {
    const fullSearch = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(fullSearch) ||
      user.lastName.toLowerCase().includes(fullSearch)
    );
  });

  const highlight = (text = "", q = "") => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <span key={i} className="bg-sky-100 text-sky-600 px-0.5 rounded">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-10">
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm px-3 py-2">
          <div className="mr-3 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search people by name..."
            className="flex-1 outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search users"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="ml-3 text-slate-500 hover:text-slate-700 px-2"
              aria-label="Clear search"
            >
              ×
            </button>
          ) : (
            <div className="ml-3 text-slate-300"> </div>
          )}
        </div>
      </div>

      {/* Results */}
      {search && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border max-h-72 overflow-y-auto z-40">
          {searchedItems.length > 0 ? (
            searchedItems.map((user) => (
              <Link
                to={`/profile/${user._id}`}
                key={user._id}
                className="flex items-center gap-3 py-3 px-4 hover:bg-sky-50 border-b last:border-b-0"
              >
                <img
                  src={user.photoUrl || 'https://via.placeholder.com/150'}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                />
                <div>
                  <p className="font-medium text-slate-800">
                    {highlight(`${user.firstName} ${user.lastName}`, search)}
                  </p>
                  {user.about && <p className="text-xs text-slate-500">{user.about}</p>}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-slate-500 text-center p-4">No Results Found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

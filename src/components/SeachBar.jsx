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
      setUsers(res.data.users);
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

  return (
    <div>
      {/* Search Input */}
      <div className="flex items-center gap-2 border rounded-full w-1/2 my-10 mx-auto">
        <input
          type="text"
          placeholder="Search..."
          className="outline-none flex-1 bg-transparent py-2 px-5"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" className="p-2">
          <Search className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Results */}
      {search && (
        <div className="w-1/2 mx-auto bg-white rounded-lg shadow p-3 max-h-60 overflow-y-auto">
          {searchedItems.length > 0 ? (
            searchedItems.map((user) => (
              <Link
                to={`/profile/${user._id}`}
                key={user._id}
                className="flex items-center gap-3 py-2 border-b last:border-b-0 hover:bg-gray-100 rounded px-2"
              >
                <img
                  src={user.photoUrl}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center">No Results Found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

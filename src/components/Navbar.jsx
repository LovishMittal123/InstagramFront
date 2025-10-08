import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // hamburger + close icons

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.request);
  const suggestions = useSelector((store) => store.suggestions);
  const connections = useSelector((store) => store.connection);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-[29px]"
              src="data:image/jpeg;base64,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" 
              alt="Logo"
            />
            <span className="font-bold text-xl">Instagram</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to='/search'>Search</Link>
            <Link to="/requests" className="relative">
              Requests
              {requests?.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </Link>

            <Link to="/suggestions" className="relative">
              Suggestions
              {suggestions?.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {suggestions.length}
                </span>
              )}
            </Link>

            <Link to="/connections" className="relative">
              Connections
              {connections?.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {connections.length}
                </span>
              )}
            </Link>

            {/* Profile Avatar */}
            {user ? (
              <Link to="/profile" className="flex items-center gap-2">
                <img
                  src={user?.photoUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium hidden sm:inline">
                  {user.firstName} {user.lastName}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-white shadow">
          <Link to="/requests" className="block relative">
            Requests
            {requests?.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </Link>

          <Link to="/suggestions" className="block relative">
            Suggestions
            {suggestions?.length > 0 && (
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {suggestions.length}
              </span>
            )}
          </Link>

          <Link to="/connections" className="block relative">
            Connections
            {connections?.length > 0 && (
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {connections.length}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/profile" className="flex items-center gap-2">
              <img
                src={user?.photoUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium">
                {user.firstName} {user.lastName}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

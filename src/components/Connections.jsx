import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link, useNavigate } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addConnection(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const goToUserProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">My Connections</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {connections.map((element) => (
          <div
            key={element._id}
            onClick={() => goToUserProfile(element._id)} // pass userId
            className="bg-white shadow rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition cursor-pointer"
          >
            <img
              src={element.photoUrl}
              alt="user"
              className="w-20 h-20 rounded-full object-cover mb-3 border"
            />
            <p className="font-medium text-lg">
              {element.firstName} {element.lastName}
            </p>
            <p className="text-sm text-gray-600 mt-1">{element.about}</p>
            <Link to={"/chat/" + element._id}>
              <button className="bg-blue-500 text-white px-10 py-2 mt-4 rounded-2xl cursor-pointer">
                Chat
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;

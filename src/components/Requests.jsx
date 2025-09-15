import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();
  const reviewRequests=async(status,requestId)=>{
    try {
        await axios.post(`${BASE_URL}/request/review/${status}/${requestId}`,null,{withCredentials:true})
        dispatch(removeRequests(requestId))
    } catch (error) {
        console.log(error);
        
    }
  }

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/requests/received`, {
        withCredentials: true,
      });
      console.log(res.data);
      dispatch(addRequest(res.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Connection Requests</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((element) => (
          <div
            key={element.fromUserId._id}
            className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center hover:shadow-md transition"
          >
            <img
              src={element.fromUserId.photoUrl}
              alt="user"
              className="w-20 h-20 rounded-full object-cover mb-3 border"
            />
            <p className="font-medium text-lg">
              {element.fromUserId.firstName} {element.fromUserId.lastName}
            </p>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>reviewRequests('accepted',element._id)} className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                Accept
              </button>
              <button onClick={()=>reviewRequests('rejected',element._id)} className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;

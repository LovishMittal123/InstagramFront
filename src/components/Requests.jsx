import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();

  const requests = useSelector((store) => store.request);
  const safeRequests = Array.isArray(requests) ? requests : [];
  const [loadingMap, setLoadingMap] = useState({});

  const reviewRequests = async (status, requestId) => {
    try {
      setLoadingMap((s) => ({ ...s, [requestId]: true }));
      await axios.post(`${BASE_URL}/request/review/${status}/${requestId}`, null, { withCredentials: true });
      dispatch(removeRequests(requestId));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMap((s) => ({ ...s, [requestId]: false }));
    }
  };

  // ✅ FIXED: dispatch only array
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/requests/received`, {
        withCredentials: true,
      });

      dispatch(addRequest(res.data)); 
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-100">Connection Requests</h2>

      {safeRequests.length === 0 ? (
        <p className="text-center text-slate-500">No requests</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeRequests.map((element) => {
            const from = element.fromUserId || {};
            const isLoading = !!loadingMap[element._id];
            return (
              <div
                key={element._id}
                className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg transition-transform duration-150"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-sky-400 shadow-md mb-3">
                  <img src={from.photoUrl || 'https://via.placeholder.com/150'} alt={`${from.firstName || 'User'}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                </div>

                <p className="font-semibold text-lg text-slate-900 dark:text-slate-50">
                  {from.firstName || 'Unknown'} {from.lastName || ''}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 w-full">{from.about || ''}</p>

                <div className="flex gap-3 mt-4 w-full">
                  <button
                    onClick={() => reviewRequests('accepted', element._id)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white shadow-sm transition ${isLoading ? 'bg-green-500/60 cursor-wait' : 'bg-green-500 hover:bg-green-600'}`}
                    aria-label={`Accept request from ${from.firstName || 'user'}`}
                  >
                    {isLoading ? (
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/><path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round"/></svg>
                    ) : null}
                    Accept
                  </button>

                  <button
                    onClick={() => reviewRequests('rejected', element._id)}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white shadow-sm transition ${isLoading ? 'bg-red-500/60 cursor-wait' : 'bg-red-500 hover:bg-red-600'}`}
                    aria-label={`Reject request from ${from.firstName || 'user'}`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;

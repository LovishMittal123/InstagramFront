import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
// Tailwind-only styles; removed external CSS

const Chat = () => {
  const { targetUserId } = useParams();
  const connections = useSelector((store) => store.connection);
  const user = useSelector((store) => store.user);

  const userId = user?._id;
  const firstName = user?.firstName;
  const targetUser = connections?.find((u) => u._id === targetUserId);

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    if (userId) {
      socketRef.current = createSocketConnection(userId);

      socketRef.current.on("receiveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  // Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/chat/${userId}/${targetUserId}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    if (userId && targetUserId) {
      fetchMessages();
    }
  }, [userId, targetUserId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!targetUser) return <div className="text-center p-4">User not found</div>;

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    const message = {
      id: Date.now() + Math.random(),
      firstName,
      text: newMessage,
      senderId: userId,
    };

    // Show message in sender UI immediately
    setMessages((prev) => [...prev, message]);

    // Emit to server
    socketRef.current.emit("sendMessage", {
      ...message,
      userId,
      targetUserId,
    });

    setNewMessage("");
  };

  return (
    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto rounded-xl shadow-2xl flex flex-col h-[90vh] overflow-hidden bg-gradient-to-b from-slate-900 via-[#071133] to-[#051025] text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-transparent">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white/90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <img
            className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 shadow-sm"
            src={targetUser.photoUrl}
            alt={targetUser.firstName}
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
          />
          <div className="truncate">
            <p className="text-white font-semibold leading-none">
              {targetUser.firstName} {targetUser.lastName}
            </p>
            <p className="text-sm text-white/80">Online</p>
          </div>
        </div>
        {/* header action buttons removed */}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-transparent">
        {messages.map((msg) => {
          const isMe = msg.senderId === userId;
          const dateObj = msg.timestamp
            ? new Date(msg.timestamp)
            : msg.id
            ? new Date(msg.id)
            : null;
          const showTime = dateObj && !isNaN(dateObj.getTime());
          const time = showTime
            ? dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;
          return (
            <div
              key={msg.id}
              className={`mb-4 flex items-end ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <img
                  className="w-9 h-9 rounded-full object-cover mr-3"
                  src={targetUser.photoUrl}
                  alt={msg.firstName}
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                />
              )}

              <div
                className={`relative max-w-[70%] px-4 py-3 rounded-2xl shadow-lg ${
                  isMe
                    ? "ml-3 bg-gradient-to-br from-sky-600 to-cyan-500 text-white self-end"
                    : "mr-3 bg-white/95 text-slate-900 self-start"
                }`}
              >
                {/* Tail */}
                <span
                  className={`hidden md:block absolute bottom-2 ${
                    isMe
                      ? "right-[-8px] rotate-45 w-3 h-3 bg-cyan-500"
                      : "left-[-8px] rotate-45 w-3 h-3 bg-white/95"
                  }`}
                />

                <div className="flex items-baseline gap-2">
                  <p
                    className={`text-sm font-semibold ${
                      isMe ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {msg.firstName}
                  </p>
                  {time && (
                    <span
                      className={`text-[11px] ${
                        isMe ? "text-white/80" : "text-slate-500"
                      }`}
                    >
                      {time}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 text-sm leading-relaxed whitespace-pre-wrap ${
                    isMe ? "text-white" : "text-slate-900"
                  }`}
                >
                  {msg.text}
                </p>
              </div>

              {isMe && (
                <img
                  className="w-9 h-9 rounded-full object-cover ml-3"
                  src={user?.photoUrl}
                  alt={user?.firstName}
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t bg-transparent">
        <div className="max-w-full flex items-center gap-3">
          <input
            className="flex-grow border border-slate-700/60 bg-transparent text-slate-100 py-3 px-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className={`ml-1 p-3 rounded-full shadow-md transition flex items-center justify-center ${
              newMessage.trim()
                ? "bg-sky-500 hover:bg-sky-600 text-white"
                : "bg-slate-700/40 text-slate-300 cursor-not-allowed opacity-60"
            }`}
            aria-label="Send"
            disabled={!newMessage.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

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
        const res = await axios.get(`${BASE_URL}/chat/${userId}/${targetUserId}`,{withCredentials:true});
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
    <div className="border border-gray-300 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto rounded-lg shadow-md flex flex-col h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <p className="font-semibold text-base sm:text-lg truncate mx-3">
          {targetUser.firstName} {targetUser.lastName}
        </p>
        <img
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
          src={targetUser.photoUrl}
          alt={targetUser.firstName}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm font-semibold">{msg.firstName}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center p-3 border-t">
        <input
          className="flex-grow border border-gray-300 py-2 px-4 rounded-2xl text-sm sm:text-base focus:outline-none"
          placeholder="Message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-2xl ml-2 hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

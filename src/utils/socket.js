import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  return io(BASE_URL, {
    withCredentials: true,  // ✅ must match backend
    transports: ["websocket"], // ✅ avoid polling if possible
  });
};

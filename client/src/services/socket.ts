import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const joinedOrders = new Set<string>();

export const initSocket = (opts: any = {}) => {
  if (socket) return socket;

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const socketUrl = apiBase.replace(/\/api\/?$/, "");

  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    ...opts,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
    // re-join any previously joined order rooms after reconnect
    try {
      joinedOrders.forEach((id) => {
        socket?.emit("joinOrder", id);
      });
    } catch (err) {
      console.error("Failed to re-join orders on connect:", err);
    }
  });

  socket.on("disconnect", (reason: any) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("error", (err: any) => {
    console.error("Socket error:", err);
  });

  return socket;
};

export const getSocket = () => socket;

export const joinOrder = (orderId: string) => {
  if (!socket) return;
  joinedOrders.add(orderId);
  socket.emit("joinOrder", orderId);
};

export const joinOrders = (orderIds: string[]) => {
  orderIds.forEach((id) => joinOrder(id));
};

export const leaveOrder = (orderId: string) => {
  if (!socket) return;
  joinedOrders.delete(orderId);
  socket.emit("leaveOrder", orderId);
};

export default initSocket;

export const on = (event: string, handler: (...args: any[]) => void) => {
  socket?.on(event, handler);
};

export const off = (event: string, handler: (...args: any[]) => void) => {
  socket?.off(event, handler);
};
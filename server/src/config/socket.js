import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.BASE_URL_CLIENT || 'http://localhost:5173' }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('joinOrder', (orderId) => {
      socket.join(orderId);
      console.log(`User joined room for order: ${orderId}`);
    });

    socket.on('leaveOrder', (orderId) => {
      socket.leave(orderId);
      console.log(`User left room for order: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => io;

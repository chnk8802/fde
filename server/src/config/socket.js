import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.BASE_URL_CLIENT }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinOrder', (orderId) => {
      socket.join(orderId);
      console.log(`User joined room for order: ${orderId}`);
    });
  });

  return io;
};

export const getIO = () => io;
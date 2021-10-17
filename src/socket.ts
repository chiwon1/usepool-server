import http from 'http';
import { Express } from 'express';
import { Socket, Server } from 'socket.io';

const webSocket = (server: http.Server, app: Express) => {
  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  app.set('io', io);

  io.on('connection', (socket: Socket) => {
    socket.on('join-room', async (roomid) => {
      await socket.join(roomid);
    });
  });
};

export default webSocket;

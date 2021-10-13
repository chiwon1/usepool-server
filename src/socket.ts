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

  // io.on('connect', (socket) => {
  //   console.log('connected');
  //   console.log('socket.nsp.name', socket.nsp.name);
  //
  //   socket.on('disconnect', () => {
  //     console.log('disconnect');
  //   });
  // });

  // const dynamicNsp = io.of(/^\/.+$/).on('connect', (socket) => {
  //   // const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'
  //
  //   console.log('socket.nsp.name', socket.nsp.name);
  //
  //   console.log('socket.id', socket.id);
  //
  //   socket.on('join', ({ id, ride }) => {
  //     console.log('join connected');
  //
  //     // socket.join(user.id);
  //   });
  //
  //   socket.on('disconnect', () => {
  //     console.log('disconnect');
  //   });
  // });
};

export default webSocket;

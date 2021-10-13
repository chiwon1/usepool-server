import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';

import ERROR from '../constants/error';
import ChatRoom from '../models/ChatRoom';
import { Server, Socket } from 'socket.io';

export const list: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
      next(createError(400, ERROR.INVALID_USER));
    }

    // TODO 2021/10/14 cw: to refactor with PromiseAll
    const listAsPassenger = await ChatRoom.find({ passenger: userId });
    await ChatRoom.populate(listAsPassenger, 'ride');
    await ChatRoom.populate(listAsPassenger, 'driver');
    await ChatRoom.populate(listAsPassenger, 'passenger');

    const listAsDriver = await ChatRoom.find({ driver: userId });
    await ChatRoom.populate(listAsDriver, 'ride');
    await ChatRoom.populate(listAsDriver, 'driver');
    await ChatRoom.populate(listAsDriver, 'passenger');

    const chatRoomList = [...listAsPassenger, ...listAsDriver];

    console.log('chatRoomList', chatRoomList);

    res.status(200).json({ result: 'success', chatRoomList });
  } catch (err) {
    next(err);
  }
};

export const join: RequestHandler = (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: chatRoomId } = req.params;

    if (!chatRoomId) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    if (!mongoose.isValidObjectId(userId)) {
      next(createError(400, ERROR.INVALID_USER));
    }

    const joinRoom = () => {
      const io: Server = req.app.get('io');

      io.on('connection', (socket: Socket) => {
        console.log('connected');

        socket.on('join-room', async (roomid) => {
          console.log('room joined');
          await socket.join(roomid);

          socket.on('chat', (chat: string) => {
            console.log('chat', chat);
          });

          io.to(roomid).emit('hello', 'world');

          socket.on('disconnect', () => {
            console.log('disconnect');
          });
        });
      });
    };

    joinRoom();

    res.status(200).json({ result: 'success', roomId: chatRoomId });
  } catch (err) {
    next(err);
  }
};

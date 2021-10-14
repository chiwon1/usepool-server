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

    if (!mongoose.isValidObjectId(chatRoomId)) {
      next(createError(400, ERROR.INVALID_CHAT_ROOM));
    }

    const joinRoom = () => {
      const io: Server = req.app.get('io');

      io.on('connection', (socket: Socket) => {
        console.log('connected');

        socket.on('join-room', (roomid) => {
          void socket.join(roomid);
        });
      });
    };

    joinRoom();

    res.status(200).json({ result: 'success' });
  } catch (err) {
    next(err);
  }
};

export const chatList: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: chatRoomId } = req.params;

    if (!chatRoomId) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    if (!mongoose.isValidObjectId(userId)) {
      next(createError(400, ERROR.INVALID_USER));
    }

    if (!mongoose.isValidObjectId(chatRoomId)) {
      next(createError(400, ERROR.INVALID_CHAT_ROOM));
    }

    const chatRoom = await ChatRoom.findOne({ _id: chatRoomId }).exec();

    if (!chatRoom) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    await ChatRoom.populate(chatRoom, 'chatList');

    res.status(200).json({ result: 'success', chatList: chatRoom.chatList });
  } catch (err) {
    next(err);
  }
};

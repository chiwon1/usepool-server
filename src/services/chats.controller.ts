import { RequestHandler } from 'express';
import User from '../models/User';
import Chat from '../models/Chat';
import ChatRoom from '../models/ChatRoom';
import createError from 'http-errors';
import ERROR from '../constants/error';

export const newChat: RequestHandler = async (req, res, next) => {
  try {
    console.log('incoming');
    const senderId = req.user._id;
    const { id: chatRoomId } = req.params;
    const sender = await User.findOne({ _id: senderId });

    const chat = new Chat({
      sender: senderId,
      senderNickname: sender!.nickname,
      senderProfilePicture: sender!.profilePicture,
      contents: req.body.contents,
    });

    await chat.save();

    const chatRoom = await ChatRoom.findOne({ _id: chatRoomId }).exec();

    if (!chatRoom) {
      throw createError(400, ERROR.INVALID_DATA);
    }

    chatRoom.chatList = [...chatRoom.chatList, chat._id];

    await chatRoom.save();

    const io = req.app.get('io');

    io.to(chatRoomId).emit('chat', chat);

    res.status(200).json({ result: 'success' });
  } catch (err) {
    console.log('err', err);
    next(err);
  }
};

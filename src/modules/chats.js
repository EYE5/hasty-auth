const mongoose = require('mongoose');
const mongo = require('../utils/mongo');
const chatSchema = require('../models/chat');
const userSchema = require('../models/user');
const transform = require('../utils/transforms');

async function getChats(req, res) {
  const { id, count, length } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });
    return;
  }

  await mongo.connect('us');

  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });

    return;
  }

  const chats = user.chats;

  res.status(200);
  res.json(chats);
  mongoose.disconnect();
}

async function createChat(req, res) {
  const { users } = req.body;

  if (!users || users.length <= 1) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });
    return;
  }

  await mongo.connect('us');

  const Chat = mongoose.model('Chat', chatSchema, 'chats');

  const chat = new Chat({ users });

  const newChat = await chat.save();

  const User = mongoose.model('User', userSchema, 'users');

  await User.updateMany(
    {
      _id: { $in: users.map(id => new mongoose.Types.ObjectId(id)) },
    },
    { $push: { chats: chat._id } }
  );

  res.status(200);
  res.json(newChat);

  mongoose.disconnect();
}

async function getChatUsers(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });
    return;
  }

  await mongo.connect('us');

  const Chat = mongoose.model('Chat', chatSchema, 'chats');

  const userIds = await Chat.findOne({ id: new mongoose.Types.ObjectId(id) });

  const User = mongoose.model('User', userSchema, 'users');

  let users = await User.find({
    _id: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) },
  });

  users = users.map(user => transform.userToPublic(user));

  res.status(200);
  res.json(users);

  mongoose.disconnect();
}

module.exports = {
  getChats,
  createChat,
  getChatUsers,
};

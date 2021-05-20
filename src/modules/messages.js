const mongoose = require('mongoose');
const mongo = require('../utils/mongo');
const userSchema = require('../models/user');
const messageSchema = require('../models/message');
const chatSchema = require('../models/chat');

async function getMessages(req, res) {
  const { id, count, offset, limit } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });
    return;
  }

  await mongo.connect('us');

  const Chat = mongoose.model('Chat', chatSchema, 'chats');

  const chat = Chat.findById(id);

  let messagesIds = chat.messages;

  if (offset && limit)
    messagesIds = messagesIds.sort((a, b) => b - a).slice(offset, limit);

  const Message = mongoose.model('Message', messageSchema, 'messages');

  const messages = Message.find({
    _id: { $in: messagesIds.map(id => new mongoose.Types.ObjectId(id)) },
  });

  if (count) {
    res.status(200);
    res.json({ messages, count: messages.length });
  } else {
    res.status(200);
    res.json({ messages });
  }

  mongoose.disconnect();
}

async function sendMessage(req, res) {
  const { id, message } = req.body;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });
    return;
  }

  await mongo.connect('us');

  //TODO Write send message logic
}

module.exports = {
  getMessages,
};

const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  users: { type: Array, default: [], ref: 'users' },
  messages: { type: Array, default: [], ref: 'messages' },
  avatar: Buffer,
});

module.exports = chatSchema;

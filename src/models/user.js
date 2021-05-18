const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  avatar: Buffer,
  lastOnline: { type: Date, default: Date.now },
  online: { type: Boolean, default: false },
  chats: { type: Array, default: [], ref: 'chats' },
  messages: { type: Array, default: [], ref: 'messages' },
});

module.exports = userSchema;

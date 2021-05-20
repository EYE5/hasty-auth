const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  userInfo: { type: String, default: '' },
  secret: String,
  secretType: Number,
  avatar: Buffer,
  lastOnline: { type: Date, default: Date.now() },
  online: { type: Boolean, default: false },
  chats: { type: Array, default: [], ref: 'Chat' },
  friends: { type: Array, default: [], ref: 'User' },
});

module.exports = userSchema;

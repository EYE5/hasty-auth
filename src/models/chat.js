const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  users: { type: Array, default: [], ref: 'User' },
  messages: { type: Array, default: [], ref: 'Message' },
  avatar: Buffer,
});

module.exports = chatSchema;

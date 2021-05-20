const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  name: { type: String, default: '' },
  users: { type: Array, default: [], ref: 'User' },
  messages: { type: Array, default: [], ref: 'Message' },
  avatar: Buffer,
});

module.exports = chatSchema;

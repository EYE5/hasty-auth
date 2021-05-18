const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  date: { type: Date, default: Date.now },
});

module.exports = messageSchema;

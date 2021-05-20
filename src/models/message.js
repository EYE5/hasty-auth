const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  text: { type: String, default: '' },
  media: { type: Array, default: [] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
});

module.exports = messageSchema;

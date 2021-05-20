const mongoose = require('mongoose');
const mongo = require('../utils/mongo');
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');

async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    res.json({ text: 'Invalid data', code: 1006 });
    return;
  }

  await mongo.connect('us');

  const User = mongoose.model('User', userSchema, 'users');

  const u = await User.findOne({ username: username });

  if (u) {
    res.status(400);
    res.json({ text: 'User already exists', code: 1001 });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username: username,
    password: hashedPassword,
    avatar: undefined,
  });

  await user.save();

  res.status(200);
  res.json({ text: 'Registration completed successfully', code: 1100 });

  mongoose.disconnect();
}

module.exports = register;

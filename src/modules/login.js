const mongoose = require('mongoose');
const mongo = require('../utils/mongo');
const userSchema = require('../models/user');
const bcrypt = require('bcrypt');
const tokens = require('../utils/tokens');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    res.json({ text: 'Invalid username or password', code: 1006 });
    return;
  }

  await mongo.connect('us');

  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });
    return;
  }

  const isIdentical = bcrypt.compareSync(password, user.password);

  if (isIdentical) {
    const accessToken = await tokens.createAccessToken(username);
    const refreshToken = await tokens.createRefreshToken(username);

    res.status(200);
    res.json({ accessToken, refreshToken, user });

    return;
  } else {
    res.status(400);
    res.json({ text: 'Invalid username or password', code: 1000 });

    return;
  }
}

module.exports = login;

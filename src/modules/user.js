const mongoose = require('mongoose');
const mongo = require('../utils/mongo');
const userSchema = require('../models/user');

// Bad practice, but it easy to use
const statusWatchers = {};

async function getUser(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }

  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });

    return;
  }

  res.status(200);
  res.json(user);
}

async function getUserFriends(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }

  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });

    return;
  }

  const friends = await User.find({
    _id: { $in: user.friends.map(item => new mongoose.Types.ObjectId(item)) },
  });

  res.status(200);
  res.json(friends);
}

async function getUserStatus(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }

  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });

    return;
  }

  res.status(200);
  res.json({ status: user.online ? user.online : user.lastOnline });
}

async function refreshUserStatus(req, res) {
  const { id } = req.query;

  console.log('asd');

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }
  console.log('asd');
  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { online: true, lastOnline: Date.now() }
  );

  console.log(user);

  if (statusWatchers[id]) clearTimeout(statusWatchers[id]);

  statusWatchers[id] = setTimeout(() => {
    User.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { online: true, lastOnline: Date.now() - 30000 }
    );
    delete statusWatchers[id];
  }, 30000);

  statusWatchers[id].clearTimeout();

  res.status(200);
  res.json(user);
}

module.exports = {
  getUser,
  getUserFriends,
  getUserStatus,
  refreshUserStatus,
};

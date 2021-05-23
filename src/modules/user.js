const mongoose = require('mongoose');
const mongo = require('../utils/mongo');
const userSchema = require('../models/user');
const chatSchema = require('../models/chat');
const transform = require('../utils/transforms');

// Bad practice, but it easy to use
const statusWatchers = new Map();

async function getUser(req, res) {
  const { id, remote } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }

  await mongo.connect('us');

  const User = mongoose.model('User', userSchema, 'users');

  let user = await User.findById(id);

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });

    return;
  }

  const Chat = mongoose.model('Chat', chatSchema, 'chats');

  const chats = await Chat.find({
    _id: { $in: user.chats.map(chat => new mongoose.Types.ObjectId(chat)) },
  });

  user.chats = chats;

  //very very bad practice
  // i think better to check user token for username
  if (remote) {
    user = transform.userToPublic(user);
  } else {
    user = transform.userToPrivate(user);
  }

  res.status(200);
  res.json(user);

  mongoose.disconnect();
}

async function getUserFriends(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }

  await mongo.connect('us');

  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });

    return;
  }

  let friends = await User.find({
    _id: { $in: user.friends.map(item => new mongoose.Types.ObjectId(item)) },
  });

  friends = friends.map(item => transform.userToPublic(item));

  res.status(200);
  res.json(friends);

  mongoose.disconnect();
}

async function getUserStatus(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }

  await mongo.connect('us');

  const User = mongoose.model('User', userSchema, 'users');

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    res.json({ text: 'User not found', code: 1005 });

    return;
  }

  res.status(200);
  res.json({ status: user.online ? user.online : user.lastOnline });

  mongoose.disconnect();
}

async function refreshUserStatus(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400);
    res.json({ text: 'Invalid input data', code: 1006 });

    return;
  }

  await mongo.connect('us');

  const User = mongoose.model('User', userSchema, 'users');

  await User.findByIdAndUpdate(id, {
    online: true,
    lastOnline: Date.now(),
  });

  if (statusWatchers.get(id)) {
    clearTimeout(statusWatchers.get(id));
    statusWatchers.delete(id);
  }

  statusWatchers.set(
    id,
    setTimeout(() => {
      User.findByIdAndUpdate(id, {
        online: true,
        lastOnline: Date.now() - 30000,
      });
      statusWatchers.delete(id);
    }, 30000)
  );

  res.status(200);
  res.json({ text: 'Status changed successfully', code: 2002 });

  mongoose.disconnect();
}

module.exports = {
  getUser,
  getUserFriends,
  getUserStatus,
  refreshUserStatus,
};

require('dotenv').config();

const MicroMQ = require('micromq');

const { login, register, user, chats } = require('./src/modules');

const app = new MicroMQ({
  name: 'auth',
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

app.post('/api/register', async (req, res) => {
  await register(req, res);
});

app.post('/api/login', async (req, res) => {
  await login(req, res);
});

app.get('/api/get_user', async (req, res) => {
  await user.getUser(req, res);
});

app.get('/api/get_friends', async (req, res) => {
  await user.getUserFriends(req, res);
});

app.get('/api/get_status', async (req, res) => {
  await user.getUserStatus(req, res);
});

app.get('/api/refresh_status', async (req, res) => {
  await user.refreshUserStatus(req, res);
});

app.get('/api/get_chats', async (req, res) => {
  await chats.getChats(req, res);
});

app.post('/api/create_chat', async (req, res) => {
  await chats.createChat(req, res);
});

app.get('/api/get_chat_users', async (req, res) => {
  await chats.getChatUsers(req, res);
});

app.start();

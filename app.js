require('dotenv').config();

const MicroMQ = require('micromq');

const { login, register } = require('./src/modules');

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

app.start();

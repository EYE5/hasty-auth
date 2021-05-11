require('dotenv').config();

const MicroMQ = require('micromq');

const app = new MicroMQ({
  name: 'auth',
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

app.get('/test', (req, res) => {
  console.log(req);

  res.json({ code: 200, text: 'Hello' });
});

app.start();

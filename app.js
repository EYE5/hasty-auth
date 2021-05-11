require('dotenv').config();

const MicroMQ = require('micromq');
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

client.set('test', 'test');

const getAsync = promisify(client.get).bind(client);

const get = async () => {
  let res = await getAsync('test');

  console.log(res);
};

get();

const app = new MicroMQ({
  name: 'auth',
  rabbit: {
    url: 'amqp://hasty:superhardpassword@localhost:5682',
  },
});

app.get('/login', (req, res) => {
  res.json({ code: 401, text: 'wrong auth' });
});

app.start();

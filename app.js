const MicroMQ = require('micromq');

const auth = new MicroMQ({
  name: 'auth',
  rabbit: {
    url: 'amqp://hasty:superhardpassword@localhost:5682',
  },
});

// создаем два эндпоинта /friends & /status на метод GET
auth.get(['/login'], async (req, res) => {
  // делегируем запрос в микросервис users
  await res.delegate('users');
});

auth.get('/login', (res, req) => {
  res.json({ code: 401, text: 'wrong auth' });
});

auth.start();

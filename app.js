const MicroMQ = require('micromq');

const app = new MicroMQ({
  name: 'auth',
});

// создаем два эндпоинта /friends & /status на метод GET
app.get(['/login'], async (req, res) => {
  // делегируем запрос в микросервис users
  await res.delegate('users');
});

app.get('/login', (res, req) => {
  res.json({ code: 401, text: 'wrong auth' });
});

app.start();

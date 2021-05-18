const { promisify } = require('util');
const redisClient = require('./redis-client');

async function get(key) {
  const get = promisify(redisClient.get).bind(redisClient);

  return get(key);
}

function select(database) {
  redisClient.select(database);
}

async function set(key, value) {
  const set = promisify(redisClient.set).bind(redisClient);

  await set(key, value);
}

function expire(key, value) {
  redisClient.EXPIRE(key, value);
}

module.exports = {
  get,
  select,
  set,
  expire,
};

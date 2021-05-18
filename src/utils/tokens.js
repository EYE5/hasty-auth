const jwt = require('jsonwebtoken');
const redis = require('./redisUtils/commands');
/**
 * Checks if access token is valid
 *
 * @param {String} token - access token
 */
async function checkAccessToken(token) {
  redis.select(0);

  const res = await redis.get(token);

  if (res) {
    try {
      jwt.verify(token, 'access');
    } catch (error) {
      console.log('Wrong access token. Error: ', error);
      return false;
    }

    return true;
  }

  return false;
}

/**
 * Checks if refresh token is valid
 *
 * @param {String} token - refresh token
 */
async function checkRefreshToken(token) {
  redis.select(1);

  const res = await redis.get(token);

  if (res) {
    try {
      jwt.verify(token, 'refresh');
    } catch (error) {
      console.log('Wrong refresh token. Error: ', error);
      return false;
    }

    return true;
  }

  return false;
}

/**
 *
 * @param {String} data
 * @returns {Promise<string>} access-token
 */
async function createAccessToken(data) {
  const accessToken = jwt.sign({ data }, 'access', { expiresIn: 1800 });

  redis.select(0);

  await redis.set(accessToken, data);

  redis.expire(accessToken, 1900);

  return accessToken;
}

/**
 *
 * @param {String} data
 * @returns {Promise<string>} refresh-token
 */
async function createRefreshToken(data) {
  const refreshToken = jwt.sign({ data }, 'refresh', { expiresIn: 432000 });

  redis.select(1);

  await redis.set(refreshToken, data);

  redis.expire(refreshToken, 432100);

  return refreshToken;
}

module.exports = {
  checkAccessToken,
  checkRefreshToken,
  createAccessToken,
  createRefreshToken,
};

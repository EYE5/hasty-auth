function userToPublic(user) {
  return {
    id: user._id,
    username: user.username,
    userInfo: user.userInfo,
    avatar: user.avatar,
    lastOnline: user.lastOnline,
    online: user.online,
  };
}

function userToPrivate(user) {
  return {
    id: user._id,
    username: user.username,
    userInfo: user.userInfo,
    avatar: user.avatar,
    friends: user.friends,
  };
}

module.exports = {
  userToPublic,
  userToPrivate,
};

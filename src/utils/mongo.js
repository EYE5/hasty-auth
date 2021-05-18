const mongoose = require('mongoose');

async function connect(dbName) {
  return await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName,
  });
}

module.exports = {
  connect,
};

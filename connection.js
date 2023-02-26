require('dotenv').config();
const mongoose = require('mongoose');
const debug = require('debug')('server');
exports.connect = async () => {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.DB_URL, (err) => {
    if (err) {
      debug(err.message);
      return;
    }
    debug('connected to database successfully');
  });
};

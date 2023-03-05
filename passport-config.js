const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const debug = require('debug')('database');
const users = require('./models/users-model');
const initializePassport = (passport) => {
  passport.use(
    new LocalStrategy({}, async (username, password, done) => {
      try {
        const user = await users.findOne({ username });
        if (!user) {
          debug('Username can`t found');
          return done(null, false, { message: 'Username can`t be found' });
        }
        bcrypt.compare(password, user.password, (err, success) => {
          if (err) throw err;
          if (!success) {
            debug('Passwords does not match');
            return done(null, false, { message: 'Passwords do not match' });
          }
          debug('Username found and passwords matches');
          return done(null, user);
        });
      } catch (error) {
        debug('An error occurred in authenticating user');
        debug(error.message);
        return done(error);
      }
    })
  );
};

module.exports = initializePassport;

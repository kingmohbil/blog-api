require('dotenv').config();
const debug = require('debug')('server');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');
const initializePassport = require('./passport-config');
const { connect } = require('./connection');
const signupRoute = require('./routes/signup-route');
const loginRoute = require('./routes/login-route');
const postsRoute = require('./routes/posts-route');
const server = express();
initializePassport(passport);

server.use(helmet());
server.use(compression());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());
server.use(passport.initialize());

server.use('/', signupRoute);
server.use('/', loginRoute);
server.use('/posts', postsRoute);
server.listen(process.env.PORT, () => {
  debug(`server listening on port ${process.env.PORT}...`);
});
connect();

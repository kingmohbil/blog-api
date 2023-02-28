require('dotenv').config();
const debug = require('debug')('server');
const express = require('express');
const cors = require('cors');
const { connect } = require('./connection');
const server = express();
const signupRoute = require('./routes/signup-route');

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

server.use('/', signupRoute);

server.listen(process.env.PORT, () => {
  debug(`server listening on port ${process.env.PORT}...`);
});
connect();

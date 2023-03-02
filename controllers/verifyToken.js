// loading our environment variables
require('dotenv').config();
// requiring jsonwebtoken for verifying
const jwt = require('jsonwebtoken');
exports.verifyToken = [
  // this middleware extracts the token form the headers
  (req, res, next) => {
    const bearerToken = req.headers['Authorization'];
    // checking for the existence of the token
    if (bearerToken == null)
      return res
        .status(403)
        .json({ errors: [{ msg: `Token wasn't found unauthorized` }] });
    // setting the token with the 'req' object
    req.token = bearerToken.split(' ')[1];
    // calling the next middleware
    next();
  },
];

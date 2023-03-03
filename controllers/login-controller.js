// loading environment variables
require('dotenv').config();
// requiring passport for authentication
const passport = require('passport');
// requiring jwt to create the token
const jwt = require('jsonwebtoken');
// requiring the `body` and `validationResult` for validation and sanitizing
const { body, validationResult } = require('express-validator');

exports.login = [
  // validating and sanitizing inputs
  body('username', 'username can`t be empty')
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage('username can`t exceed 30 characters')
    .escape(),
  body('password', 'password must be at least 8 characters long')
    .trim()
    .isLength({ min: 8 })
    .isLength({ max: 20 })
    .withMessage('password can`t exceed 20 characters')
    .escape(),
  // checking if there is any user inputs errors
  function (req, res, next) {
    const isValid = validationResult(req);
    if (!isValid.isEmpty())
      return res.status(400).json({ errors: isValid.array() });
    return next();
  },
  function (req, res) {
    // authenticating user before sending the token
    passport.authenticate(
      'local',
      { session: false },
      function (err, user, info) {
        if (err)
          return res.status(500).json({
            errors: [{ msg: err.message }],
          });
        if (!user) return res.status(400).json({ errors: [{ msg: info }] });
        if (user) {
          const token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET_KEY, {
            expiresIn: '2w',
          });
          return res
            .status(200)
            .json({ token, message: 'token created successfully' });
        }
      }
    )(req, res);
  },
];

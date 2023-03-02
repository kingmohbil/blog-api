require('dotenv').config();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.login = [
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
  (req, res, next) => {
    const isValid = validationResult(req);
    if (!isValid.isEmpty())
      return res.status(400).json({ userErrors: isValid.array() });
    return next();
  },
  (req, res) => {
    passport.authenticate(
      'local',
      { session: false },
      function (err, user, info) {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ userErrors: { msg: info } });
        if (user) {
          const token = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET_KEY);
          return res.status(200).json({ token });
        }
      }
    )(req, res);
  },
];

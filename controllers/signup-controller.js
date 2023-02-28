const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const debug = require('debug')('database');
const users = require('../models/users-model');
exports.createUser = [
  // validating and sanitizing the user input before creating a new user
  body('firstName', '* First name can`t be empty')
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage('* First name can`t exceed 30 characters')
    .escape(),
  body('lastName', '* Last name can`t be empty')
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage('* Last name can`t exceed 30 characters')
    .escape(),
  body('email', '* Email must be a valid email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .escape(),
  body('email').custom(async (email) => {
    const exist = await users.exists({ email });
    if (exist) throw new Error('* Email already exists');
    return true;
  }),
  body('username', '* Username can`t be empty')
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage('* Username can`t be empty')
    .escape(),
  body('username').custom(async (username) => {
    const exist = await users.exists({ username });
    if (exist) throw new Error('* Username already exists');
    return true;
  }),

  body('password', '* Password must be at least 8 characters')
    .trim()
    .isLength({ min: 8 })
    .isLength({ max: 30 })
    .withMessage('* Password can`t exceed 30 characters')
    .escape(),
  async (req, res) => {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      res.status(400);
      debug(isValid.array());
      return res.json({
        errors: isValid.array(),
        message: 'Can`t create user inputs are invalid',
      });
    }
    try {
      const { firstName, lastName, username, password, email } = req.body;
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) throw err;
        const user = await users.create({
          first_name: firstName,
          last_name: lastName,
          email,
          username,
          password: hashedPassword,
        });
        debug('User created successfully');
        res.status(201);
        return res.json({
          user,
          errors: [],
          message: 'User created successfully',
        });
      });
    } catch (error) {
      debug(error.message);
      res.status(500);
      return res.json({
        errors: [error.message],
        message: 'Error while creating the user',
      });
    }
  },
];

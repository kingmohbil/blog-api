// requiring the `body` and `validationResult` to validate the
// data before adding it to the database
const { body, validationResult } = require('express-validator');
// requiring `bcryptjs` to hash the password before storing it in the database
const bcrypt = require('bcryptjs');
// requiring the `debug` and sets the value to database for debugging the database operations
const debug = require('debug')('database');
// requiring the `users` model
const users = require('../models/users-model');
exports.createUser = [
  // validating and sanitizing the user input before creating a new user
  body('firstName', `first name can't be empty`)
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage(`first name can't exceed 30 characters`)
    .escape(),
  body('lastName', `last name can't be empty`)
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage(`last name can't exceed 30 characters`)
    .escape(),
  body('email', 'email must be a valid email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .escape(),
  body('email').custom(async (email) => {
    const exist = await users.exists({ email });
    if (exist) throw new Error(`${email} already exists`);
    return true;
  }),
  body('username', `username can't be empty`)
    .trim()
    .isLength({ min: 1 })
    .isLength({ max: 30 })
    .withMessage(`username can't be empty`)
    .escape(),
  body('username').custom(async (username) => {
    const exist = await users.exists({ username });
    if (exist) throw new Error(`${username} already exists`);
    return true;
  }),
  body('password', 'password must be at least 8 characters')
    .trim()
    .isLength({ min: 8 })
    .isLength({ max: 30 })
    .withMessage(`password can't exceed 30 characters`)
    .escape(),
  async (req, res) => {
    const isValid = validationResult(req);
    if (!isValid.isEmpty()) {
      return res.status(400).json({
        errors: isValid.array(),
        message: `can't create user inputs are invalid`,
      });
    }
    // destructuring the inputs from the request after the validation
    const { firstName, lastName, username, password, email } = req.body;
    // hashing the password
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await users.create({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password: hashedPassword,
      });
      debug('User created successfully');
      return res.status(201).json({
        message: 'user created successfully',
      });
    } catch (error) {
      debug(error.message);
      return res.status(500).json({
        errors: [{ msg: error.message }],
        message: 'error occurred while creating the user',
      });
    }
  },
];

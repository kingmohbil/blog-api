const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
    minlength: 1,
    maxlength: 30,
    required: true,
  },
  last_name: {
    type: String,
    minlength: 1,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    minlength: 1,
    maxlength: 30,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  posts: {
    type: [Schema.Types.ObjectId],
    ref: 'posts',
  },
});

userSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model('users', userSchema);

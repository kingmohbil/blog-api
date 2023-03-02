const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postsSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  title: {
    type: String,
    minlength: 1,
    maxlength: 80,
    required: true,
  },
  text: {
    type: String,
    minlength: 1,
    maxlength: 160,
    required: true,
  },
  comments: {
    type: [Schema.Types.ObjectId],
    ref: 'comments',
  },
  created_at: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },
});

module.exports = mongoose.model('posts', postsSchema);

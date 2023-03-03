const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'posts',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  text: {
    type: String,
    minlength: 1,
    maxlength: 160,
    required: true,
  },
  created_at: {
    type: Date,
    default: () => Date.now(),
    immutable: false,
  },
});

module.exports = mongoose.model('comments', commentsSchema);

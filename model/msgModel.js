const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  messageContents: [
    {
      sender: {
        type: String,
      },
      message: {
        type: String,
      },
      time: Date,
    },
  ],
});

const Message = new mongoose.model('Message', msgSchema);

module.exports = Message;

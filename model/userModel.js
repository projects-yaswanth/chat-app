const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'A user must contain Name'],
  },
  email: {
    type: String,
    required: [true, 'A user must contain a Password'],
    unique: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
    },
  },
  password: {
    type: String,
    required: [true, 'A user must contain a password'],
    minlength: 8,
    maxlength: 15,
  },
  friends: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    select: false,
  },
  friendmessagedoc: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Messages',
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

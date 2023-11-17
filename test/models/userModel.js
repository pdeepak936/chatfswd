const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  otp: Number,
  phoneNumber: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: "USER",
  },
  point: String,
  ip: String,
  os: String,
  referrerCode: {
    type: String,
    unique: true,
  },
  referredCode: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

const jwt = require('jsonwebtoken');

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

exports.verifyJwtToken = (token, next) => {
  try {
    const phoneNumber = jwt.verify(token, process.env.JWT_SECRET);
    return phoneNumber;
  } catch (err) {
    next(err);
  }
};

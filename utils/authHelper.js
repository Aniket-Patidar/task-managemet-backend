// utils/authHelper.js
const jwt = require('jsonwebtoken');

const generateJWTToken = (userId) => {
  return jwt.sign({ userId }, 'JWT_SECRET', { expiresIn: '1h' });
};

module.exports = { generateJWTToken };

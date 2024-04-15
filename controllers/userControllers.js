const catchAsyncError = require('../utils/catchAsyncError');
const { generateJWTToken } = require('../utils/authHelper');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/ErrorHandler');


const cloudinary = require('cloudinary').v2;
const path = require('path');
cloudinary.config({
  cloud_name: 'draw7t9sz',
  api_key: '329576791485659',
  api_secret: 'D3aHlPjygJhdbC6eozUCRpXD5CQ'
});

exports.jwtUser = catchAsyncError(async (req, res) => {
  const token = generateJWTToken(req.user._id);
  res.json({ token, user: req.user });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler('Email and password are required', 400));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler('Invalid email', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler('Invalid password', 401));
  }

  const token = generateJWTToken(user._id);
  res.json({ token, user });
});

exports.signupUser = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(new ErrorHandler('Username, email, and password are required', 400));
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler('User already exists', 400));
  }

  const newUser = new User({ username, email, password });

  await newUser.save();

  const token = generateJWTToken(newUser._id);

  res.status(201).json({ token, user: newUser });
});

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  try {
    req.user = null;
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(new ErrorHandler('Logout failed', 500));
  }
});

exports.uploadAvatar = catchAsyncError(async (req, res) => {
  const { _id: id } = req.user;

  const user = await User.findById(id).exec();

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;
    const modifiedName = `task-${Date.now()}${path.extname(file.name)}`;

    if (user.avatar.fileId !== '') {
      await cloudinary.uploader.destroy(user.avatar.fileId, (error, result) => {
        if (error) {
          console.error('Error deleting file from Cloudinary:', error);
        } else {
          console.log('File deleted successfully:', result);
        }
      });
    }
    const filepath = req.files.avatar;
    const myavatar = await cloudinary.uploader.upload(filepath.tempFilePath, {
      folder: "avaters",
    });

    user.avatar = {
      fileId: myavatar.public_id,
      url: myavatar.secure_url
    };

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: 'Profile Picture Updated Successfully!', user: user });
  } else {
    // Handle the case where req.files or req.files.resuma is undefined
    return next(new ErrorHandler("Find No Avatar"))
  }

});

exports.changePassword = catchAsyncError(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Check if oldPassword and newPassword are provided
    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler('Old password and new password are required', 400));
    }

    // Authenticate user
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    // Compare old password
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return next(new ErrorHandler('Invalid old password', 401));
    }

    // Update user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    next(new ErrorHandler('Password change failed', 500));
  }
})

exports.profileUpdated = catchAsyncError(async (req, res, next) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return next(new ErrorHandler('Username, email', 400));
  }
  const user = await User.findByIdAndUpdate(req.user.id, req.body);
  await user.save();

  res.json({ success: true, user })
});
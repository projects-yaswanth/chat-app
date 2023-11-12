const User = require('./../model/userModel');
const Message = require('./../model/msgModel');
const jwt = require('jsonwebtoken');

exports.getUser = async (req, res, next) => {
  try {
    const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

    const userData = await User.find(
      { _id: { $ne: decoded.id } },
      { name: 1, friends: 1, _id: 1 }
    );
    if (!userData) {
      throw new Error('Users is not found');
    }

    res.status(200).json({
      status: 'success',
      data: userData,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userData = await User.findById(req.params.id);
    if (!userData) {
      throw new Error('Users is not found');
    }

    res.status(200).json({
      status: 'success',
      data: userData,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      status: 'success',
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.addfriend = async (req, res, next) => {
  try {
    const user = await User.findById(req.body._id.toString(), '+friends');
    const userfriends = user.friends.map((doc) => doc.toString());
    if (userfriends.includes(req.params.id)) {
      return res.status(200).json({
        status: 'success',
        message: 'User is already in your friend list',
      });
    }

    const friend = await User.findById(req.params.id, '+friends');
    if (!friend) throw new Error('friend is not found, please check the name');
    const friendfriends = friend.friends.map((doc) => doc.toString());
    if (!friendfriends.includes(req.body._id.toString())) {
      friend.friends.push(user.id);
      await friend.save({ validateBeforeSave: false });
    }
    if (!userfriends.includes(req.params.id)) {
      user.friends.push(friend.id);
      await user.save({ validateBeforeSave: false });
    }
    const userMessage = await Message.find({ from: user.id, to: friend.id });
    const friendMessage = await Message.find({ from: friend.id, to: user.id });

    if (userMessage.length === 0 && friendMessage.length === 0) {
      const message = await Message.create({
        from: user.id,
        to: friend.id,
      });
      user.friendmessagedoc.push(message._id.toString());
      friend.friendmessagedoc.push(message._id.toString());
      await user.save({ validateBeforeSave: false });
      await friend.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getfriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.body._id).populate('friends');
    const friends = user.friends;
    res.status(200).json({
      status: 'success',
      data: friends,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }
};

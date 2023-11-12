const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('email or password is not specified');
    }

    const foundedUser = await User.findOne({ email });

    if (!foundedUser) throw new Error('User is not found , please sign up');

    const token = await jwt.sign(
      { id: foundedUser._id },
      process.env.JWT_SECRET
    );

    if (!token) throw new Error('token is not generated');

    const passwordCheckup = await bcrypt.compare(
      password,
      foundedUser.password
    );

    if (!passwordCheckup) throw new Error('email or password is wrong');

    res.cookie('jwt', token);

    res.status(200).json({
      status: 'success',
      token,
      data: foundedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    res.cookie('jwt', token);

    const passwordVerify = await jwt.verify(token, process.env.JWT_SECRET);
    if (!passwordVerify) throw new Error('user is deleted');
    const freshUser = await User.findById(passwordVerify.id);
    if (!freshUser) throw new Error('user is not found');
    req.body = freshUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'failed in protect',
      message: err.message,
    });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      status: 'sucess',

      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    const foundedUser = await User.findById(verified.id);

    if (foundedUser) {
      res.locals.jwtObj = verified;
      next();
    } else throw new Error('user is not found');
  } catch (err) {
    next();
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');

    req.headers.authorization = undefined;
    res.status(200).json({
      status: 'success',
      // message: req.cookies,
    });
  } catch (err) {
    console.log(err.message);
  }
};

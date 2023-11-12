const User = require('./../model/userModel');

const getUser = async (ref) => {
  let user = null;
  if (ref) {
    user = await User.findById(ref.id, '+friends').populate('friends');
  }
  return user;
};

exports.getOverview = async (req, res, next) => {
  const user = await getUser(res.locals.jwtObj);

  res.status(200).render('index', {
    title: 'Home',
    user,
  });
};

exports.addfriend = async (req, res, next) => {
  try {
    const user = await getUser(res.locals.jwtObj);

    res.status(200).render('addFriend', {
      title: 'Add Friends',
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = async (req, res, next) => {
  res.status(200).render('loginForm', {
    title: 'Login',
  });
};

exports.getSignup = async (req, res, next) => {
  res.status(200).render('signUpForm', {
    title: 'Login',
  });
};

exports.logout = async (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).redirect('/');
};

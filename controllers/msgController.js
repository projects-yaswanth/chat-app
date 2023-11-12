const Messages = require('./../model/msgModel');
const User = require('./../model/userModel');

const getUserAndFriend = async (userRef, friendRef) => {
  try {
    let user = null;
    if (userRef) {
      user = await User.findById(userRef.id, '+friends').populate('friends');
    }
    const userId = user._id.toString();

    const friend = user.friends.filter((doc) => doc.name === friendRef)[0];
    const friendId = friend._id.toString();

    const messages1 = await Messages.find({
      from: friendId,
      to: userId,
    });
    const messages2 = await Messages.find({
      from: userId,
      to: friendId,
    });

    const messages = messages1[0] || messages2[0];

    return { user, friend, messages, friendId, userId };
  } catch (err) {
    console.log(err.message);
  }
};

exports.getMsgs = async (req, res, next) => {
  try {
    const { user, friend, messages } = await getUserAndFriend(
      res.locals.jwtObj,
      req.params.name
    );

    res.status(200).render('chatPage', {
      title: 'chats',
      user,
      friend,
      messages: messages.messageContents,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.saveMsg = async (req, res, next) => {
  try {
    const { user, userId, friendId } = await getUserAndFriend(
      res.locals.jwtObj,
      req.params.name
    );


    const insertMsg =
      (await Messages.find({ from: userId, to: friendId }))[0] ||
      (await Messages.find({ from: friendId, to: userId }))[0];1

    insertMsg.messageContents.push({
      sender: user.name,
      message: req.body.message,
    });
    await insertMsg.save({ validateBeforeSave: false });

    res.status(201).json({
      status: 'success',
      msg: req.body.message,
      message: 'sent successful',
    });
  } catch (err) {
    res.status(200).json({
      stauts: 'failed',
      message: err.message,
    });
  }
};

const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("userId param is not available!");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (err) {
      res.status(400);
      throw new errors(err.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).send(chats);
  } catch (err) {
    res.status(400);
    throw new errors(err.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "please fill all the fields" });
  }
  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    res.status(400).send("A group must contain more than 2 members");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-pic")
      .populate("groupAdmin", "-pic");
    res.status(200).send(fullGroupChat);
  } catch (err) {
    res.status(400);
    throw new Error("Technical issue");
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Technical issue");
  } else {
    res.status(200).json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const removed = await Chat.findByIdAndUpdate(chatId, {
    $pull: { users: userId },
  },{new:true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if(!removed){
    res.status(404);
    throw new Error('Technical issue');
  }else{
    res.status(200).json(removed);
  }
});
const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const added = await Chat.findByIdAndUpdate(chatId, {
    $push: { users: userId },
  },{new:true})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if(!added){
    res.status(404);
    throw new Error('Technical issue');
  }else{
    res.status(200).json(added);
  }
});
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};

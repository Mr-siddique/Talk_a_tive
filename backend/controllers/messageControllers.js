const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
//requires message,chatId and sender(loggedin user)
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return res.status(400).send("Invalid data passed");
  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.json(message);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});
const allMessages = asyncHandler(async (req, res) => {
  try {
    //   console.log(req.params.chatId);
    const messages = await Message.find({chat:req.params.chatId})
      .populate("sender", "name pic email")
      .populate("chat");
    const s=new Set();
      // for(let i=0;i<messages.length;i++)s.add(messages[i].chat._id);
      // console.log(s.size,req.params.chatId);
    res.json(messages);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

module.exports = { sendMessage, allMessages };

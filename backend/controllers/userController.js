const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) throw new Error("All fields are required");
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists!");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to authenticate user");
  }
});
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    res.status(400);
    throw new Error("Register first");
  }
  const isCorrectPassword = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isCorrectPassword) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
  res.status(201).send({
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    pic: existingUser.pic,
    token: generateToken(existingUser._id),
  });
});

//api/user?search=query
const allUsers=asyncHandler(async(req,res)=>{
   const keyword=req.query.search?{
     $or:[
       {name:{$regex:req.query.search,$options:"i"}},
       {email:{$regex:req.query.search,$options:"i"}}
     ]
   }:{};
   const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
  //  console.log(users);
   res.send(users);
  //  console.log(keyword);
});
module.exports = { registerUser, authUser, allUsers };

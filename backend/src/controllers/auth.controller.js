const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookie = require('cookie-parser');
const authModel = require('../model/auth.model.js');
const AppError = require('../utils/error.utils.js')



async function register_controller(req,res,next) {
  try {
    const { firstname,lastname,email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return next(new AppError("All fields are required",401))
  }
  const isUserExists = await authModel.findOne({email});
  if (isUserExists) {
    return next(new AppError("User already Exists",200))
  }
  const hashPassword = await bcrypt.hash(password,12);
  
  const user = await authModel.create({
    firstname,lastname,email,
    password:hashPassword
  })
  
  user.password = undefined;
  
  
  const token = await jwt.sign({
    id:user._id,
    name:user.firstname,
    mail:user.email
  },process.env.JWT_SERECT)
  
  res.cookie("token",token);
  res.status(201).json({ 
    message:"User registered Successfully",
    user
  });
  } catch (err) {
    return next(new AppError(err.message,500));
    
  }
}

async function login_controller(req,res,next) {
  try {
    
    const { email , password } = req.body;
  
  if (!email || ! password) {
    return next(new AppError("All fields are required",401))
  }
  
  const userInfo = await authModel.findOne({email}).select("+password");
  
  if (!userInfo) {
    return next(new AppError("User not found",401));
  };
  
  const isPasswordValid = await bcrypt.compare(password,userInfo.password);
 
  if (!isPasswordValid) {
    return next(new AppError("Invalid Password",400));
  }
  
  userInfo.password = undefined;
  
  const token = await jwt.sign({
    id:userInfo._id,
    name:userInfo.firstname,
    mail:userInfo.email
  }, process.env.JWT_SERECT);
  
  res.cookie("token",token);
 // console.log(token);
  
  res.status(200).json({ 
    message:"Loged In Successfully",
    userInfo 
    
  });
  } catch (err) {
    return next(new AppError(err.message,500))
    
  }
}

const getMe = async (req,res,next) =>{
  res.status(200).json({ 
    message:"data fetched"
  });
}

module.exports = {
  register_controller,
  login_controller,
  getMe
}


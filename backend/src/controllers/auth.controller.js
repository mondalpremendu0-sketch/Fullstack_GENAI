const authModel = require('../model/auth.model.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const cookie = require('cookie-parser');




async function register_controller(req,res) {
  const { firstname,lastname,email, password } = req.body;
  const isUserExists = await authModel.findOne({email});
  if (isUserExists) {
   return  res.status(200).json({ message :"User already registered"});
  }
  const hashPassword = await bcrypt.hash(password,12);
  const user = await authModel.create({
    firstname,lastname,email,
    password:hashPassword
  })
  const token = await jwt.sign({
    id:user._id,
    name:user.firstname,
    mail:user.email
  },process.env.JWT_SERECT)
  res.cookie("token",token);
  res.status(201).json({ 
    message:"User registered Successfully",
    user,token
  });
}

async function login_controller(req,res) {
  const { email , password } = req.body;
  
  if (!email || ! password) {
    return res.status(400).json({ message:"All filelds are required" });
  }
  
  const userInfo = await authModel.findOne({email});
  
  if (!userInfo) {
    return res.status(400).json({ message:"Invalid email" });
  };
  
  const isPasswordValid = await bcrypt.compare(password,userInfo.password);
 
  if (!isPasswordValid) {
    return res.status(400).json({ message:"Invalid Password" });
  }
  
  const token = await jwt.sign({
    id:userInfo._id,
    name:userInfo.firstname,
    mail:userInfo.email
  }, process.env.JWT_SERECT);
  
  res.cookie("token",token);
  
  res.status(200).json({ message:"Loged In Successfully",userInfo,token });
}



module.exports = {
  register_controller,
  login_controller
}


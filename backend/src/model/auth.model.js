const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
  firstname:{
    type:String,
    required: [true,"First name is required"]
  },
  lastname:{
    type:String,
    required: [true,"Last name is required"]
  },
  email:{
    type:String,
    unique: [true,"This email is already taken"],
    required: [true,"Email is required"],
    match:[/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,"Email is invaild"]
  },
  password:{
    type:String,
    select:false,
    required: [true,"Password is required"],
    minLength:[6,"Password atleast 6 charector"]
  },
},{timestamps:true});

const authModel = mongoose.model("Fullstack_GenAi_user",authSchema);

module.exports = authModel;
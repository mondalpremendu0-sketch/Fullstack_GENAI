const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
  firstname:{
    type:String,
    unique: true,
    required: true
  },
  lastname:{
    type:String,
    unique: true,
    required: true
  },
  email:{
    type:String,
    unique: true,
    required: true
  },
  password:{
    type:String,
    required: true
  },
},{timestamps:true});

const authModel = mongoose.model("Fullstack_GenAi_user",authSchema);

module.exports = authModel;
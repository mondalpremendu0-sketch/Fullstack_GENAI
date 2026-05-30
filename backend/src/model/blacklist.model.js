const mongoose = require("mongoose");


const tokenBlacklistSchema = new mongoose.Schema({
  token:{
    type:String,
    required:[true,"Token is required for blacklisting"]
  }
},{timestamps:true})

const blackListModel = mongoose.model("Interview-AI_tokenBlackListing",tokenBlacklistSchema)


module.exports = blackListModel;
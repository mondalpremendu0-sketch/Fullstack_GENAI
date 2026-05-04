const mongoose = require("mongoose");


const tokenBlacklistSchema = new mongoose.Schema({
  token:{
    type:String,
    required:[true,"Token is required for blacklisting"]
  }
},{timestamps:true})

const blackListModel = mongoose.model("tokenBlackListing",tokenBlacklistSchema)


module.exports = blackListModel;
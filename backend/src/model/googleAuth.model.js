const mongoose = require("mongoose")

mongoose.set('strictQuery', false);



const googleUserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username must be unique"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email must be unique"],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please fill a valid email address"],
    },
    googleId:{
        type:String,
        required:[true,"Google ID is required"],
        unique:[true,"Google ID must be unique"]
    },
},{timestamps:true});


const googleModel = mongoose.model("interviewAi_googleUsers", googleUserSchema);

module.exports = googleModel;
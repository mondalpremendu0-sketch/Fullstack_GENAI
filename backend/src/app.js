//packages..
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const cors = require("cors");
const passport = require('passport');

//require from folder
const authRouter = require('./routes/auth.routes.js');
const interViewrouter = require('./routes/ai.routes.js');
const GoogleRouter = require('./routes/googleAuth.routes.js');
const errMiddleware = require('./middleware/error.middleware.js')
// 1. Require your passport configuration file early on
require('./config/passport.js'); 




const app = express();


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
  origin:"http://localhost:5173" || "http://localhost:5173/",
  methods:['GET','POST'],
  credentials:true
}));

// 2. Initialize passport
app.use(passport.initialize());
// app.use(passport.session()); // If you are using persistent login sessions
//routes
app.use("/api/auth",authRouter);
app.use("/api/interview",interViewrouter);
app.use("/api/googleAuth",GoogleRouter);

app.use((req,res) => {
  res.status(404).json({ message :"OOPS!! PAGE NOT FOUND"});
})

app.use(errMiddleware);



module.exports = app;




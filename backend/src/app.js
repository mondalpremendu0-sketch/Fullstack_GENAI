//packages..
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const cors = require("cors");
//require from folder
const authRouter = require('./routes/auth.routes.js');
const errMiddleware = require('./middleware/error.middleware.js')




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
//routes
app.use("/api/auth",authRouter);

app.use((req,res) => {
  res.status(404).json({ message :"OOPS!! PAGE NOT FOUND"});
})

app.use(errMiddleware);



module.exports = app;




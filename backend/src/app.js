//packages..
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const compression = require("compression");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

//require from folder
const authRouter = require("./routes/auth.routes.js");
const interViewrouter = require("./routes/ai.routes.js");
const GoogleRouter = require("./routes/googleAuth.routes.js");
const errMiddleware = require("./middleware/error.middleware.js");

// 1. Require  passport configuration file early on
require("./config/passport.js");

const app = express();

//middlewares

app.use(compression());
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', 1);
app.use((req, res, next) => {
    // Manually sanitize body and params, skipping the read-only query object
    if (req.body) {
        req.body = mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    }
    if (req.params) {
        req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    }
    next();
});
app.use(cookieParser());
app.use(morgan("dev"));


// 2. Initialize passport
app.use(passport.initialize());
// app.use(passport.session()); // If you are using persistent login sessions
//routes
app.use("/api/auth", authRouter);
app.use("/api/interview", interViewrouter);
app.use("/api/googleAuth", GoogleRouter);

app.use((req, res) => {
    res.status(404).json({ message: "OOPS!! PAGE NOT FOUND" });
});

app.use(errMiddleware);

module.exports = app;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const authModel = require("../model/auth.model.js");
const blackListModel = require("../model/blacklist.model.js");
const AppError = require("../utils/error.utils.js");

async function register_controller(req, res, next) {
    try {
        const { firstname, lastname, email, password } = req.body;
        //console.log(req.body);
        if (!firstname || !lastname || !email || !password) {
            return next(new AppError("All fields are required", 401));
        }
        const isUserExists = await authModel.findOne({ email });
        if (isUserExists) {
            return next(new AppError("User already Exists", 400));
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const user = await authModel.create({
            firstname,
            lastname,
            email,
            password: hashPassword
        });
        if (!user) {
            return next(new AppError("User could not created", 401));
        }
        user.password = undefined;

        const token = await jwt.sign(
            {
                id: user._id,
                name: user.firstname,
                mail: user.email
            },
            process.env.JWT_SERECT
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 5 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({
            success: true,
            message: "User registered Successfully",
            user: {
                firstname,
                lastname,
                email
            }
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

async function login_controller(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("All fields are required", 401));
    }
    try {
        const userInfo = await authModel.findOne({ email }).select("+password");

        if (!userInfo) {
            return next(new AppError("User not found/Invalid userId", 401));
        }
        if (!userInfo.password) {
            return next(
                new AppError(
                    "This account was created with Google. Please click 'Continue with Google' to log in.",
                    400
                )
            );
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            userInfo.password
        );

        if (!isPasswordValid) {
            return next(new AppError("Invalid Password", 400));
        }

        userInfo.password = undefined;

        const token = await jwt.sign(
            {
                id: userInfo._id,
                name: userInfo.firstname,
                mail: userInfo.email
            },
            process.env.JWT_SERECT
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 5 * 24 * 60 * 60 * 1000
        });
        //console.log(token);

        res.status(200).json({
            success: true,
            message: "Loged In Successfully",
            user: {
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
                email: userInfo.email
            }
        });
    } catch (err) {
        return next(new AppError(err.message, 500));
    }
}

async function getMe_controller(req, res, next) {
    if (!req.user) {
        return next(new AppError("Unauthorised!!", 400));
    }
    const userId = req.user.id;

    if (!userId) {
        return next(new AppError("User not found", 401));
    }

    const userInfo = await authModel
        .findById({ _id: userId })
        .select("-password");

    if (!userInfo) {
        return next(new AppError("User not found", 401));
    }

    res.status(200).json({
        success: true,
        message: "data fetched successfully",
        user: {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            email: userInfo.email
        }
    });
}

async function logout_controller(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        await blackListModel.create({ token });
    }
    res.clearCookie("token", undefined);
    res.status(200).json({
        success: true,
        message: "logout Successfully"
    });
}

module.exports = {
    register_controller,
    login_controller,
    getMe_controller,
    logout_controller
};

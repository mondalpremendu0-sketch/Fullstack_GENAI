const jwt = require("jsonwebtoken");

const AppError = require('../utils/error.utils.js')


const isLogedIn = async (req,res,next) => {
  try {
    const {token} = req.cookies;
   // const  token  = req.body;
    
    //console.log(req.body);
    if (!token) {
      return next(new AppError("Unauthorised!!",401))
    }
    
    const decode = await jwt.verify(token,process.env.JWT_SERECT);
    
    if (!decode) {
      return next(new AppError("Token not valid",401))
    }
    req.user = decode;
    next();
    
  } catch (err) {
    return next(new AppError(err.message,500))
    
  }
}

module.exports = isLogedIn;
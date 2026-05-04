class AppError extends Error {
  constructor(message,ststusCode) {
    super(message);
    
    this.ststusCode = ststusCode;
    
    Error.cpatureStackTrace(this,this.constructor);
  }
}

export default AppError;
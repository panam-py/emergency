const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
    CONFLICT: 409,
    FORBIDDEN: 403
}

class AppError extends Error {
    constructor(statusCode, message, isOperational) {
        super(message);
        Object.setPrototypeOf(this,new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational
        Error.captureStackTrace(this);
    }
}

//api Specific Errors
class APIError extends AppError {
    constructor(statusCode = STATUS_CODES.INTERNAL_ERROR, message ='Internal Server Error', isOperational = true){
        super(statusCode, message, isOperational);
    }
}

//400
class BadRequestError extends AppError {
    constructor(message = 'Bad request'){
        super(STATUS_CODES.BAD_REQUEST, message, true);
    }
}

//404
class NotFoundError extends AppError {
    constructor(message = 'Not Found'){
        super(STATUS_CODES.NOT_FOUND, message, true);
    }
}

//401
class UnauthorizedError extends AppError {
    constructor(message = 'Not authprized') {
        super(STATUS_CODES.UN_AUTHORISED, message, true)
    }
}

class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(STATUS_CODES.CONFLICT, message, true)
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(STATUS_CODES.FORBIDDEN, message, true)
    }
}

const errHandler = (err, req, res, next) => {
  if (err.name && err.name === 'JsonWebTokenError') {
    err.statusCode = 401
  }

//   if (err.isAxiosError) {
//     if (err.code === "ECONNREFUSED") {
//       err.statusCode = 503;
//       err.message = `${
//         err.request._options.path.split("/")[1]
//       } service unavailable.`;
//     }
//     if (err.response) {
//       err.statusCode = err.response.status;
//       err.message = err.response.data.message;
//     }
//   }
  
  console.log(err)
  return res.status(err.statusCode || 500).json({status: 'failed', message: err.message})
}


module.exports = {
    AppError,
    APIError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ConflictError,
    ForbiddenError,
    STATUS_CODES,
    errHandler
}
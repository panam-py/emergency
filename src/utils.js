const {connect} = require('mongoose');
const {DB_NAME, DB_URL, ACCESS_TOKEN_SECRET} = require('./config');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");
const {UnauthorizedError} = require('./exceptions');
const {Repo} = require('./repo');


const repo = new Repo();


const connectToDB = async () => {
   connect(DB_URL, {
    dbName: DB_NAME
   }).then(() => {
    console.log("DB CONNECTION SUCCESSFUL!");
   }).catch(err => {
    console.log(`An error occurred while connecting to the DB, ${err}`)
   });
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (hash, password) => {
    return bcrypt.compare(password, hash);
}

const requestProtector = () => {
    return async (req, res, next) => {
        try {
            const {authorization} = req.headers;

            if (!authorization) throw new UnauthorizedError(`No authorization headers passed`)
  
          const bearer = authorization.split(" ")[0]
          const token = authorization.split(" ")[1]
  
          if (!bearer || !token) throw new UnauthorizedError(`Token not passed in authorization headers`)
  
          if (bearer !== "Bearer") throw new UnauthorizedError(`Bearer not passed in authorization headers`)
  
          const decoded = JWT.verify(token, String(ACCESS_TOKEN_SECRET));

          const official = await repo.getOfficial(decoded.username);

          if (!official) throw new UnauthorizedError(`Unauthorized!`);

          req.official = official;
          
          next();
        } catch(err) {
           next(err);
        }
    }
}

// const objFilter = (obj) => {
//     const newObj = {}
//     for (let i = 0; i < Object.keys(obj).length; i++) {
//         if (FILTER_ATTRS.includes(obj[i])) newObj[i] = obj[i]
//     }
//     return newObj;
// };

module.exports = {
    connectToDB,
    hashPassword,
    requestProtector,
    comparePassword
    // objFilter
};
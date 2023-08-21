require('./envConfig');

const DB_URL = process.env.DB_URL;
const ENV = process.env.ENV;
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN


module.exports = {ENV, PORT, DB_URL, DB_NAME, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN};
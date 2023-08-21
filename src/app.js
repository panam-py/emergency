const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const { errHandler } = require('./exceptions');
const {panicRouter, authRouter} = require('./routes');
const {ENV} = require ('./config');


// Defining application
const app = express();

// Adding useful middlewares
if (ENV === "dev") app.use(morgan("dev"));
app.use(helmet()); // HTTP Header setter for added security
app.use(express.json()); // To parse the request bodies
app.use(express.urlencoded({extended: false})) // To parse incoming requests with URL-encided payloads
app.use(cors()); // For CORS
app.use(compression()); // Reducing json size or sumn

// Application routes
app.use("/api/v1/panic", panicRouter);
app.use("/api/v1/auth", authRouter);


app.all("*", function (req, res) {
    return res.sendStatus(404);
});

app.use(errHandler)

module.exports = app;

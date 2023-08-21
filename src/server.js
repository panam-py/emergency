const http = require('http');
const { connectToDB } = require('./utils');
const {PORT} = require('./config')
const app  = require('./app');


const startServer = async () => {

    await connectToDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
        console.log(`Initiating server`)
    }).on("listening", () => {
        console.log(`Server running on port ${PORT}`);
    }).on("error", (err) => {
        console.log(`An error occured on the server, ${err}`);
        process.exit();
    })
}

startServer();





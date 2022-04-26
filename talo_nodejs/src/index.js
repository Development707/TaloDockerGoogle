require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const db = require('./configs/databaseConfig');
const routes = require('./routers');
// Socket
const socketio = require('socket.io');
const socketApp = require('./app/socketApp');
// Middleware
const handleError = require('./middlewares/handleError');

// Create App
const port = process.env.PORT || 5000;
const app = express();
// Connect DB
db.connectDB();
// Config App
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
// Handle Error
app.use(handleError);
// Create server
const server = http.createServer(app);
const io = socketio(server);
socketApp(io);
routes(app, io);

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
// IO V.2 - For mobile
const port2 = process.env.PORT2 || 5001;
const sockerIoV2 = require('socket.io-v2');
const serverV2 = http.createServer(app);
const io2 = sockerIoV2(serverV2, {
    transports: ['websocket', 'jsonp-polling'],
});
socketApp(io2);
routes(app, io2);
serverV2.listen(port2, () => {
    console.log(`App listening at http://localhost:${port2}`);
});

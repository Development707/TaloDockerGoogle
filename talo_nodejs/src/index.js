require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const db = require('./configs/databaseConfig');
const routes = require('./routers');
// Socket
const socketio = require('socket.io');
const sockerIoV2 = require('socket.io-v2');
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

// IO V.4 - For Web
const io1 = socketio(server);
// IO V.2 - For Mobile
const io2 = sockerIoV2(server, {
    path: '/mobile/socket.io',
    transports: ['websocket', 'jsonp-polling'],
});
socketApp(io1);
socketApp(io2);
routes(app, io1, io2);

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

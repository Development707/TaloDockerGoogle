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
const port = 5001;
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
const io = socketio(server, { transports: ['websocket', 'jsonp-polling'] });
socketApp(io);
routes(app, io);

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

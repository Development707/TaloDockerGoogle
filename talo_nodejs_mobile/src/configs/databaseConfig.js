const chalk = require('chalk');
const mongoose = require('mongoose');
const { Notification } = require('../lib/Constants');

const DB = process.env.DATABASE_URL;

function connectDB() {
    mongoose
        .connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
        })
        .then((connect) => {
            console.info(
                chalk.green(Notification.DATABASE_CONNECT),
                connect.version
            );
        })
        .catch((error) => {
            console.error(
                chalk.bgRed(Notification.DATABASE_CONNECT_ERROR),
                error
            );
        });
}

module.exports = { connectDB };

const { createClient } = require('redis');
const { Notification } = require('../lib/Constants');
const chalk = require('chalk');

const client = createClient({
    url: process.env.REDIS_URL,
});

client
    .connect()
    .then(() => console.info(chalk.green(Notification.REDIS_CONNECT)))
    .catch((err) =>
        console.error(chalk.bgRed(Notification.REDIS_CONNECT_ERROR), err),
    );

const add = async (key, field, value) => {
    await client.hSet(key, field, JSON.stringify(value));
};
const get = async (key, field) => {
    return JSON.parse(await client.hGet(key, field));
};
const getAll = async (key) => {
    const data = await client.hVals(key);
    return data.map((value) => JSON.parse(value));
};
const remove = async (key, field) => {
    return await client.hDel(key, field);
};

const removeByKey = async (key) => {
    return await client.del(key);
};

const exists = async (key, field) => {
    return await client.hExists(key, field);
};

const cleanAll = async () => {
    await client.flushAll();
};

const sizeDb = async () => {
    return await client.DBSIZE();
};

module.exports = {
    sizeDb,
    add,
    get,
    getAll,
    remove,
    removeByKey,
    exists,
    cleanAll,
};

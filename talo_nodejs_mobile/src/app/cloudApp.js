const { Storage } = require('@google-cloud/storage');

const path = require('path');

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;

const storageGC = new Storage({
    keyFilename: path.join(__dirname, '../talo-key-google-cloud.json'),
    projectId: GOOGLE_CLOUD_PROJECT,
});

module.exports = { storageGC };

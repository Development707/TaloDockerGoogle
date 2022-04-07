const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { credential } = require('firebase-admin');
var serviceAccount = require('../talo-key-google-firebase.json');

const app = initializeApp({
    credential: credential.cert(serviceAccount),
});

const auth = getAuth(app);

module.exports = { auth };

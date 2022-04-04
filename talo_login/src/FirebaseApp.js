import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyD8PFw1STBXraClBaE2AQI88FeUnMQbNN0',
    authDomain: 'talo-342211.firebaseapp.com',
    projectId: 'talo-342211',
    storageBucket: 'talo-342211.appspot.com',
    messagingSenderId: '771338672762',
    appId: '1:771338672762:web:4a4df1ef21dd685dadb9c3',
    measurementId: 'G-V9DZSHHSMN',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;

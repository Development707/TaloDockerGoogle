import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyD8PFw1STBXraClBaE2AQI88FeUnMQbNN0',
    authDomain: 'talo-342211.firebaseapp.com',
    projectId: 'talo-342211',
    storageBucket: 'talo-342211.appspot.com',
    messagingSenderId: '771338672762',
    appId: '1:771338672762:web:e966779bde4a9022adb9c3',
    measurementId: 'G-BG6ZP344NV',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;

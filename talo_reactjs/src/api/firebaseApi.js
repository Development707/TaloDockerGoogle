import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/firebase/auth`;

const firebaseApi = {
    signInToken: (username, token) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return axios.post(`${API_URL}/email`, username, config);
    },
    confirmPhoneNumber: (phoneNumber, token) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        console.log('username', phoneNumber);
        console.log('token', token);

        return axios.post(`${API_URL}/phone`, phoneNumber, config);
    },
};

export default firebaseApi;

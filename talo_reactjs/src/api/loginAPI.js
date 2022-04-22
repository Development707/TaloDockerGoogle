import axiosClient from './axiosClient';

const API_URL = '/account';
const loginApi = {
    login: (username, password) => {
        const url = `${API_URL}/login`;
        return axiosClient.post(url, { username, password });
    },
    fetchUser: (username) => {
        const url = `${API_URL}/info/${username}`;
        return axiosClient.get(url);
    },
    registry: (name, username, password) => {
        const url = `${API_URL}/register`;

        return axiosClient.post(url, { name, username, password });
    },
    forgotOTP: (username) => {
        const url = `${API_URL}/reset-otp`;

        return axiosClient.post(url, { username });
    },
    confirmAccount: (username, otp) => {
        const url = `${API_URL}/verify-account`;
        return axiosClient.post(url, { username, otp });
    },
};

export default loginApi;

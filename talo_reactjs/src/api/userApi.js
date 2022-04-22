import axiosClient from './axiosClient';
const API_URL = 'users';

const userApi = {
    fetchUser: (username) => {
        return axiosClient.get(`${API_URL}/find/username/${username}`);
    },
    findId: (idUser) => {
        return axiosClient.get(`${API_URL}/find/id/${idUser}`);
    },
};

export default userApi;

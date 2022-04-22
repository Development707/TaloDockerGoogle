import axiosClient from './axiosClient';

const API_URL = '/users';
const adminApi = {
    getListUsersByUserName: (username, page, size) => {
        return axiosClient.get(`${API_URL}`, {
            params: {
                q: username,
                page,
                size,
            },
        });
    },
    updateIsDeleted: (id, isDeleted) => {
        return axiosClient.patch(`${API_URL}/${id}`, { isDeleted });
    },
};

export default adminApi;

import axiosClient from './axiosClient';

const API_URL = '/friend';
const friendApi = {
    // Friend send Me
    fetchListRequestFriend: () => {
        return axiosClient.get(`${API_URL}/requests`);
    },

    deleteRequestFriend: (userId) => {
        return axiosClient.delete(`${API_URL}/requests/${userId}`);
    },

    acceptRequestFriend: (userId) => {
        return axiosClient.post(`${API_URL}/requests`, { userId });
    },
    // manager Friend
    fetchFriends: (name) => {
        return axiosClient.get(`${API_URL}`, {
            params: {
                name,
            },
        });
    },
    deleteFriend: (userId) => {
        return axiosClient.delete(`${API_URL}/${userId}`);
    },

    // Me send Friend
    sendRequestFriend: (userId, message) => {
        return axiosClient.post(`${API_URL}/requests/me`, { userId, message });
    },
    fetchMyRequestFriend: () => {
        return axiosClient.get(`${API_URL}/requests/me?`);
    },
    deleteSentRequestFriend: (userId) => {
        return axiosClient.delete(`${API_URL}/requests/me/${userId}`);
    },

    fetchSuggestFriend: (page = 0, size = 10) => {
        return axiosClient.get(`${API_URL}/suggest`, {
            params: {
                page,
                size,
            },
        });
    },
};

export default friendApi;

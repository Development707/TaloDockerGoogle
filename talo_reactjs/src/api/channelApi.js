import axiosClient from './axiosClient';

const API_URL = '/channels';

const channelApi = {
    fetchChannel: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}`);
    },
    addChannel: (conversationId, name, description) => {
        return axiosClient.post(`${API_URL}/${conversationId}`, {
            name,
            description,
        });
    },
    renameChannel: (id, name, description) => {
        return axiosClient.put(`${API_URL}/${id}`, {
            name,
            description,
        });
    },
    deleteChannel: (channelId) => {
        return axiosClient.delete(`${API_URL}/${channelId}`);
    },
    getLastViewChannel: (channelId) => {
        return axiosClient.get(`${API_URL}/${channelId}/view-last`);
    },
};

export default channelApi;

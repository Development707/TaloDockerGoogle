import axiosClient from './axiosClient';

const API_URL = '/message/pin';

const pinMessageApi = {
    getPinMessages: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}`);
    },
    pinMessage: (messageId) => {
        return axiosClient.post(`${API_URL}/${messageId}`);
    },
    deletePinMessage: (messageId) => {
        return axiosClient.delete(`${API_URL}/${messageId}`);
    },
};

export default pinMessageApi;

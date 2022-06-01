import axiosClient from './axiosClient';

const API_URL = '/report';

const reportApi = {
    reportConversation: (title, conversationId) => {
        return axiosClient.post(`${API_URL}/conversation`, {
            title,
            conversationId,
        });
    },
    getReport: () => {
        return axiosClient.get(`${API_URL}`);
    },
    reportUser: (title, userId) => {
        return axiosClient.post(`${API_URL}/user`, {
            title,
            userId,
        });
    },
};

export default reportApi;

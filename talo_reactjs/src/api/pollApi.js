import axiosClient from './axiosClient';

const API_URL = '/message/polls';

const pollApi = {
    createPoll: (conversationId, question, options) => {
        return axiosClient.post(`${API_URL}/${conversationId}`, {
            question,
            options,
        });
    },
    deleteSelect: (messageId, options) => {
        return axiosClient.delete(`${API_URL}/${messageId}/choose`, options);
    },
    selectPoll: (messageId, options) => {
        return axiosClient.post(`${API_URL}/${messageId}/choose`, options);
    },
    addPoll: (messageId, options) => {
        return axiosClient.post(`${API_URL}/${messageId}/options`, options);
    },
    getVotes: (conversationId, page, size) => {
        return axiosClient.get(`${API_URL}/${conversationId}/`, {
            params: {
                page,
                size,
            },
        });
    },
};

export default pollApi;

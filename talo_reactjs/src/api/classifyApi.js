import axiosClient from './axiosClient';

const API_URL = '/classify';

const classifyApi = {
    getClassifies: () => {
        return axiosClient.get(`${API_URL}`);
    },

    addClassify: (name, color) => {
        return axiosClient.post(`${API_URL}`, {
            name,
            color,
        });
    },
    updateClassify: (id, name, color) => {
        return axiosClient.put(`${API_URL}`, {
            id,
            name,
            color,
        });
    },
    deleteClassify: (idClassify) => {
        return axiosClient.delete(`${API_URL}/${idClassify}`);
    },
    getConversationByClassify: (idClassify) => {
        return axiosClient.get(`${API_URL}/conversations/${idClassify}`);
    },
    addClassifyForConversation: (idClassify, idConversation) => {
        return axiosClient.post(
            `${API_URL}/conversations/${idClassify}/${idConversation}`
        );
    },
    deleteClassifyFromConversation: (idClassify, idConversation) => {
        return axiosClient.delete(
            `${API_URL}/conversations/${idClassify}/${idConversation}`
        );
    },
};

export default classifyApi;

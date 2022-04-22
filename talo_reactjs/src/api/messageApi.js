import axiosClient from './axiosClient';

const API_URL = '/message';

const messageApi = {
    fetchListMessages: (conversationId, page, size) => {
        return axiosClient.get(`${API_URL}/${conversationId}`, {
            params: {
                page,
                size,
            },
        });
    },

    sendTextMessage: (conversationId, message) => {
        return axiosClient.post(`${API_URL}/${conversationId}/text`, message);
    },

    sendFileThroughMessage: (file, conversationId, cb) => {
        const config = {
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                cb(percentCompleted);
            },
        };

        return axiosClient.post(
            `${API_URL}/${conversationId}/file`,
            file,
            config
        );
    },
    getMessageInChannel: (channelId, page, size) => {
        return axiosClient.get(`${API_URL}/channel/${channelId}`, {
            params: {
                page,
                size,
            },
        });
    },
    expressionReaction: (idMessage, type) => {
        return axiosClient.post(`${API_URL}/reacts/${idMessage}/${type}`);
    },
    undoMessage: (messageId) => {
        return axiosClient.delete(`${API_URL}/unsend/${messageId}`);
    },
    deleteMessageClientSide: (messageId) => {
        return axiosClient.delete(`${API_URL}/unsend/${messageId}/just-me`);
    },
};
export default messageApi;

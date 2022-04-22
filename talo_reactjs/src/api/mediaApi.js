import axiosClient from './axiosClient';

const API_URL = '/message';

const mediaApi = {
    getAllMedia: (
        conversationId,
        userIdSend,
        type = 'ALL',
        startTime,
        endTime
    ) => {
        return axiosClient.get(`${API_URL}/${conversationId}/files`, {
            params: {
                userIdSend,
                type,
                startTime,
                endTime,
            },
        });
    },
};

export default mediaApi;

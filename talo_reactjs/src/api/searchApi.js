import axiosClient from './axiosClient';

const API_URL = 'search';

const searchApi = {
    searchConversations: (q) => {
        return axiosClient.get(`${API_URL}/conversation`, {
            params: {
                q,
            },
        });
    },
};

export default searchApi;

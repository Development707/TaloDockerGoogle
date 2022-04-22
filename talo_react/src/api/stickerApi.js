import axiosClient from './axiosClient';

const API_URL = '/sticker';

const stickerApi = {
    fetchAllSticker: () => {
        return axiosClient.get(`${API_URL}`);
    },
    createSticker: (name, description) => {
        return axiosClient.post(`${API_URL}`, { name, description });
    },
    updateSticker: (id, name, description) => {
        return axiosClient.put(`${API_URL}/${id}`, { name, description });
    },
    deleteSticker: (id) => {
        return axiosClient.delete(`${API_URL}/${id}`);
    },
    addEmoji: (id, file) => {
        return axiosClient.post(`${API_URL}/${id}/emoji`, file);
    },
    deleteEmoji: (id, emoijName) => {
        return axiosClient.delete(`${API_URL}/${id}/emoji`, {
            params: {
                name: emoijName,
            },
        });
    },
};

export default stickerApi;

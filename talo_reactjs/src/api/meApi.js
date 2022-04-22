import axiosClient from './axiosClient';

const API_URL = '/profile';

const meApi = {
    fetchProfile: () => {
        return axiosClient.get(`${API_URL}`);
    },
    updateProfile: (name, dateOfBirth, gender) => {
        return axiosClient.put(`${API_URL}`, {
            name,
            dateOfBirth,
            gender,
        });
    },
    updateAvatar: (file) => {
        return axiosClient.patch(`${API_URL}/avatar`, file);
    },
    updateCoverPhoto: (file) => {
        return axiosClient.patch(`${API_URL}/cover-photo`, file);
    },
    changePasswod: (currentPassword, newPassword) => {
        return axiosClient.patch(`${API_URL}/change-password`, {
            currentPassword,
            newPassword,
        });
    },
    revokeToken: (password, key) => {
        return axiosClient.delete(`${API_URL}/logout-all`, {
            data: {
                password,
                key,
            },
        });
    },
};

export default meApi;

import axiosClient from './axiosClient';

const API_URL = '/profile/contacts';
const contactsApi = {
    fetchContacts: () => {
        return axiosClient.get(`${API_URL}`);
    },
};

export default contactsApi;

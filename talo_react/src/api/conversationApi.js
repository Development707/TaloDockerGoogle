import axiosClient from './axiosClient';

const API_URL = '/conversations';

const conversationApi = {
    //CRUD
    fetchListConversations: (name, type) => {
        return axiosClient.get(API_URL, {
            params: {
                name,
                type,
            },
        });
    },
    createConversationIndividual: (userId) => {
        return axiosClient.post(`${API_URL}/dual/${userId}`);
    },
    getConversationById: (id) => {
        return axiosClient.get(`${API_URL}/${id}`);
    },

    createGroup: (name, userIds) => {
        return axiosClient.post(`${API_URL}`, {
            name,
            userIds,
        });
    },
    createConverCloud: () => {
        return axiosClient.post(`${API_URL}/cloud`);
    },
    deleteConversation: (id) => {
        return axiosClient.delete(`${API_URL}/${id}`);
    },
    //Update Info
    changeNameConversation: (conversationId, name) => {
        return axiosClient.patch(`${API_URL}/${conversationId}/name`, {
            name,
        });
    },
    changeAvatarGroup: (conversationId, file) => {
        return axiosClient.patch(`${API_URL}/${conversationId}/avatar`, file);
    },
    changeNotifyConver: (conversationId, isNotify) => {
        return axiosClient.patch(`${API_URL}/${conversationId}/notify`, {
            isNotify,
        });
    },
    //join by link
    joinGroupFromLink: (conversationId) => {
        return axiosClient.post(`${API_URL}/${conversationId}/join-with-link`);
    },
    changeStatusForGroup: (conversationId, isStatus) => {
        return axiosClient.patch(
            `${API_URL}/${conversationId}/join-with-link`,
            { isStatus }
        );
    },
    //Members
    getMemberInConversation: (id) => {
        return axiosClient.get(`${API_URL}/${id}/members`);
    },
    addMembersToConver: (userIds, conversationId) => {
        return axiosClient.post(
            `${API_URL}/${conversationId}/members`,
            userIds
        );
    },
    leaveGroup: (conversationId) => {
        // console.log('API conversationId', conversationId);
        return axiosClient.delete(`${API_URL}/${conversationId}/members`);
    },
    deleteMember: (conversationId, userId) => {
        return axiosClient.delete(
            `${API_URL}/${conversationId}/members/${userId}`
        );
    },
    //managers
    addManagerInGroup: (coversationId, userIds) => {
        return axiosClient.post(
            `${API_URL}/${coversationId}/managers`,
            userIds
        );
    },
    deleteManager: (coversationId, userIds) => {
        return axiosClient.patch(
            `${API_URL}/${coversationId}/managers`,
            userIds
        );
    },
    //Other
    getSortInfoGroup: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}/short-info`);
    },
    getLastViewOfMembers: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}/view-last`);
    },
    deleteAllMessage: (conversationId) => {
        return axiosClient.delete(`${API_URL}/${conversationId}/messages`);
    },
};

export default conversationApi;

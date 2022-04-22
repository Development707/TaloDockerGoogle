import contactsApi from 'api/contactsApi';
import conversationApi from 'api/conversationApi';
import friendApi from 'api/friendApi';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const KEY = 'friend';

export const fetchListRequestFriend = createAsyncThunk(
    `${KEY}/fetchListRequestFriend`,
    async (params, thunkApi) => {
        const data = await friendApi.fetchListRequestFriend();
        return data;
    }
);

export const fetchFriends = createAsyncThunk(
    `${KEY}/fetchFriends`,
    async (params, thunkApi) => {
        const { name } = params;
        const data = await friendApi.fetchFriends(name);
        return data;
    }
);

export const fetchContacts = createAsyncThunk(
    `${KEY}/fetchContacts`,
    async (params, thunkApi) => {
        const data = await contactsApi.fetchContacts();
        return data;
    }
);

export const fetchListMyRequestFriend = createAsyncThunk(
    `${KEY}/fetchListMyRequestFriend`,
    async (params, thunkApi) => {
        const data = await friendApi.fetchMyRequestFriend();
        return data;
    }
);

export const fetchSuggestFriend = createAsyncThunk(
    `${KEY}/fetchSuggestFriend`,
    async (params, thunkApi) => {
        const data = await friendApi.fetchSuggestFriend();
        return data;
    }
);

export const fetchListGroup = createAsyncThunk(
    `${KEY}/fetchListGroup`,
    async (params, thunkApi) => {
        const { name, type } = params;
        const data = await conversationApi.fetchListConversations(name, type);
        return data;
    }
);

const friendSlice = createSlice({
    name: KEY,
    initialState: {
        isLoading: false,
        requestFriends: [],
        myRequestFriend: [],
        suggestFriends: [],
        friends: [],
        amountNotify: 0,
        contacts: [],
        groups: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setAmountNotify: (state, action) => {
            state.amountNotify = action.payload;
        },
        setNewFriend: (state, action) => {
            const newFriend = action.payload;
            state.friends = [newFriend, ...state.friends];
        },
        setMyRequestFriend: (state, action) => {
            state.myRequestFriend = state.myRequestFriend.filter(
                (item) => item.id !== action.payload
            );
        },
        setSendNewRequestFriend: (state, action) => {
            const sendNewRequestFriend = action.payload;
            state.requestFriends = [
                sendNewRequestFriend,
                ...state.requestFriends,
            ];
        },
        updateMyRequestFriend: (state, action) => {
            const id = action.payload;
            state.myRequestFriend = state.myRequestFriend.filter(
                (item) => item.id !== id
            );
        },
        updateRequestFriends: (state, action) => {
            const id = action.payload;
            state.requestFriends = state.requestFriends.filter(
                (item) => item.id !== id
            );
        },
        updateFriend: (state, action) => {
            const id = action.payload;
            state.friends = state.friends.filter((item) => item.id !== id);
        },
    },
    extraReducers: {
        [fetchListRequestFriend.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListRequestFriend.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFriends = action.payload;
            state.amountNotify = action.payload.length;
        },
        [fetchListRequestFriend.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchFriends.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchFriends.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.friends = action.payload;
        },
        [fetchFriends.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchContacts.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchContacts.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.contacts = action.payload;
        },
        [fetchContacts.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchListMyRequestFriend.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListMyRequestFriend.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.myRequestFriend = action.payload;
        },
        [fetchListMyRequestFriend.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchSuggestFriend.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchSuggestFriend.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.suggestFriends = action.payload;
        },
        [fetchSuggestFriend.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchListGroup.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListGroup.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.groups = action.payload;
        },
        [fetchListGroup.rejected]: (state, action) => {
            state.isLoading = false;
        },
    },
});

const { reducer, actions } = friendSlice;
export const {
    setLoading,
    setAmountNotify,
    setNewFriend,
    setMyRequestFriend,
    setSendNewRequestFriend,
    updateMyRequestFriend,
    updateRequestFriends,
    updateFriend,
} = actions;
export default reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import mediaApi from 'api/mediaApi';

const KEY = 'MEDIAFILE';

export const fetchAllMedia = createAsyncThunk(
    `${KEY}/fetchAllMedia`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const media = await mediaApi.getAllMedia(conversationId);
        return media;
    }
);
const mediaSlice = createSlice({
    name: KEY,
    initialState: {
        media: {},
    },
    reducers: {},
    extraReducers: {
        [fetchAllMedia.fulfilled]: (state, action) => {
            state.media = action.payload;
        },
    },
});

const { reducer, action } = mediaSlice;

export default reducer;

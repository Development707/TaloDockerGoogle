import { createSlice } from '@reduxjs/toolkit';

const KEY = 'account';

const accountSlice = createSlice({
    name: KEY,
    initialState: {
        isLoadingAccount: false,
    },
    reducers: {
        setLoadingAccount: (state, action) => {
            state.isLoadingAccount = action.payload;
        },
    },
});
const { reducer, actions } = accountSlice;
export const { setLoadingAccount } = actions;

export default reducer;

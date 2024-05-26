// searchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchParams: {
        title: '',
        categoryId: null,
        regionId: null,
    },
    isSearching: false,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchParams(state, action) {
            state.searchParams = { ...state.searchParams, ...action.payload };
        },
        setIsSearching(state, action) {
            state.isSearching = action.payload;
        },
    },
});

export const { setSearchParams, setIsSearching } = searchSlice.actions;
export default searchSlice.reducer;

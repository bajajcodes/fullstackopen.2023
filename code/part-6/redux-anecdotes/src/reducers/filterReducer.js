import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    search: ''
}

const filterSlice = createSlice({
    name: "filter",
    initialState: initialState,
    reducers: {
        searchFilterChange(state, action){
            state.search = action.payload
        }
    }
})

export default filterSlice.reducer;
export const {searchFilterChange} = filterSlice.actions;
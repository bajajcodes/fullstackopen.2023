import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

// let timerID = null;
//            if(timerID) clearTimeout(timerID);
//             timerID = setTimeout(() => {
//             }, 5000);

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification(_, action){
            return action.payload;
        },
        clearNotification(){
            return initialState;
        },
    }
})

export default notificationSlice.reducer;
export const {setNotification, clearNotification} = notificationSlice.actions;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: "",
    timerID: null
};


const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification(state, action){
            state.message =  action.payload;
        },
        clearNotification(){
            return initialState;
        },
        setTimer(state, action){
            state.timerID = action.payload
        },
        clearTimer(state, action){
            if(state.timerID){
                clearTimeout(state.timerID);
                state.timerID = null;
            }
        }
    }
})

export default notificationSlice.reducer;
export const {setNotification, clearNotification, setTimer, clearTimer} = notificationSlice.actions;
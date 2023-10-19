import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  timerID: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      state.message = action.payload;
    },
    clearNotification() {
      return initialState;
    },
    setTimer(state, action) {
      state.timerID = action.payload;
    },
    clearTimer(state) {
      if (state.timerID) {
        clearTimeout(state.timerID);
      }
      return initialState;
    },
  },
});

const notificationReducer = notificationSlice.reducer;
const { setNotification, clearNotification, setTimer, clearTimer } =
  notificationSlice.actions;

export default notificationReducer;
export const showNotification = (message, seconds = 5000) => {
  return async (dispatch) => {
    dispatch(clearTimer());
    dispatch(setNotification(message));
    const timerId = setTimeout(() => dispatch(clearNotification()), seconds);
    dispatch(setTimer(timerId));
  };
};

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../app/store";
import { $TSFIXME } from "../App";

export interface NotificationState {
  message: string;
  timerId?: ReturnType<typeof setTimeout>;
}

const initialState: NotificationState = {
  message: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    clearNotification() {
      return initialState;
    },
    setTimer(state, action: PayloadAction<number>) {
      state.timerId = action.payload;
    },
    clearTimer(state) {
      if (state.timerId) {
        clearTimeout(state.timerId);
      }
      return initialState;
    },
  },
});

const notificationReducer = notificationSlice.reducer;
const { setNotification, clearNotification, setTimer, clearTimer } =
  notificationSlice.actions;

export default notificationReducer;
// TODO: fix return type `here`
export function showNotification(
  message: NotificationState["message"],
  seconds: NotificationState["timerId"] = 5000
): $TSFIXME {
  return async (dispatch: AppDispatch) => {
    dispatch(clearTimer());
    dispatch(setNotification(message));
    const timerId = setTimeout(() => dispatch(clearNotification()), seconds);
    dispatch(setTimer(timerId));
  };
}

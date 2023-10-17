import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../reducers/notification.reducer";

const store = configureStore({
  reducer: { notification: notificationReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

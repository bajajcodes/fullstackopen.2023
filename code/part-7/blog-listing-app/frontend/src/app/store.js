import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../../../../../part-6/redux-anecdotes/src/reducers/notification.reducer";

export default configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

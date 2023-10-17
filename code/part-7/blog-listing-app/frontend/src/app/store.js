import { configureStrore } from "@reduxjs/toolkit";
import notificationReducer from "../../../../../part-6/redux-anecdotes/src/reducers/notification.reducer";

export default configureStrore({
  reduccer: {
    notification: notificationReducer,
  },
});

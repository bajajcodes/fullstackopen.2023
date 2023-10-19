import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "../../../../../part-6/redux-anecdotes/src/reducers/notification.reducer";
import blogsReducer from "../reducers/blogs.reducer";
import userReducer from "../reducers/user.reducer";

export default configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
});

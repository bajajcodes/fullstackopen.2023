import {configureStore} from "@reduxjs/toolkit";
import reducer from "./reducers/anecdoteReducer";
import filterReducer from "./reducers/filterReducer";
import notificationReducer from "./reducers/notification.reducer"

export default configureStore({
    reducer: {
        anecdotes: reducer,
        filter: filterReducer,
        notification: notificationReducer,
    }
})
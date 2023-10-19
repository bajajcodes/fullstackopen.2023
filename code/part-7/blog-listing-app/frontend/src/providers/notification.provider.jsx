import { useReducer } from "react";
import NotificationContext from "../contexts/notification.context";

const initialState = {
  message: "",
  timerID: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "setNotification":
      return {
        ...state,
        message: action.payload,
      };
    case "setTimerID":
      return {
        ...state,
        timerID: action.payload,
      };
    case "clearNotification":
    case "clearTimerId":
    default:
      return initialState;
  }
}

export default function NotificationContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  function setNotification(message, seconds = 5000) {
    if (state.timerID) {
      clearNotification();
    }
    dispatch({ type: "setNotification", payload: message });
    const timerID = setTimeout(() => clearNotification(), seconds);
    dispatch({ type: "setTimerID", payload: timerID });
  }

  function clearNotification() {
    dispatch({ type: "clearNotification" });
  }

  function getNotification() {
    return state.message;
  }

  return (
    <NotificationContext.Provider value={{ setNotification, getNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

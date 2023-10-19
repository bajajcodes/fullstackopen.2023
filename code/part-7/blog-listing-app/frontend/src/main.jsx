import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App.jsx";
import NotificationContextProvider from "./providers/notification.provider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider resetCSS>
      <NotificationContextProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </NotificationContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);

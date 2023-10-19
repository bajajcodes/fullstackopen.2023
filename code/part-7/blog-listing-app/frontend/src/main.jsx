import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App.jsx";
import NotificationContextProvider from "./providers/notification.provider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AuthContextProvider from "./providers/auth.provider";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider resetCSS>
      <QueryClientProvider client={client}>
        <>
          <AuthContextProvider>
            <NotificationContextProvider>
              <Provider store={store}>
                <App />
              </Provider>
            </NotificationContextProvider>
          </AuthContextProvider>
        </>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);

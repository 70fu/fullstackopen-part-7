import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import loggedUserReducer from "./reducers/loggedUserReducer";

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    loggedUser: loggedUserReducer,
  },
});

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </Provider>,
);

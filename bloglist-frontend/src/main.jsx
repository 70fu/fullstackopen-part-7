import ReactDOM from "react-dom/client";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import loggedUserReducer from "./reducers/loggedUserReducer";
import { BrowserRouter as Router } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const store = configureStore({
  reducer: {
    loggedUser: loggedUserReducer,
  },
});

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <MantineProvider defaultColorScheme="auto">
    <Notifications />
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </Provider>
  </MantineProvider>,
);

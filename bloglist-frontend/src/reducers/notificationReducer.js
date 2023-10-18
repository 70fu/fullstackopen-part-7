import { createSlice } from "@reduxjs/toolkit";

const NOTIFICATION_TIME = 5000;

const initialState = [];

const createNotification = (text, className) => {
  return {
    text: text,
    showUntil: Date.now() + NOTIFICATION_TIME,
    className: className,
  };
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action) {
      state.push(
        createNotification(action.payload.text, action.payload.className),
      );
    },
    updateNotifications(state, action) {
      //find first active notification
      const now = Date.now();
      const firstActiveIndex = state.findIndex(
        (notification) => now <= notification.showUntil,
      );
      if (firstActiveIndex === -1) {
        return [];
      } else {
        return state.slice(firstActiveIndex);
      }
    },
  },
});

export const { addNotification, updateNotifications } =
  notificationsSlice.actions;

function showNotification(text, className = "success") {
  return (dispatch) => {
    dispatch(addNotification({ text, className }));
    setTimeout(() => {
      dispatch(updateNotifications());
    }, NOTIFICATION_TIME + 10);
  };
}
export function showSuccessNotification(text) {
  return showNotification(text, "success");
}

export function showErrorNotification(text) {
  return showNotification(text, "error");
}

export default notificationsSlice.reducer;

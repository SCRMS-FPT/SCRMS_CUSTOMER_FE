import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Client as NotificationClient } from "@/API/NotificationApi";

const client = new NotificationClient();

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await client.getNotifications(
        undefined,
        undefined,
        page,
        limit
      );
      const sanitizedData = res.data.map((notification) => ({
        id: notification.id,
        title: notification.title,
        content: notification.content,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: new Date(notification.createdAt).toISOString(),
      }));
      return { data: sanitizedData || [], count: res.count || 0 };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to fetch notifications for Navbar
export const fetchNavbarNotifications = createAsyncThunk(
  "notifications/fetchNavbarNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await client.getNotifications(undefined, undefined, 1, 10);
      const sanitizedData = res.data.map((notification) => ({
        id: notification.id,
        title: notification.title,
        content: notification.content,
        type: notification.type,
        isRead: notification.isRead,
        createdAt: new Date(notification.createdAt).toISOString(),
      }));
      return sanitizedData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await client.readAllNotifications();
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to mark a single notification as read
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await client.readNotification(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    navbarNotifications: [],
    totalItems: 0,
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      const newNotification = action.payload;

      // Update navbar notifications
      state.navbarNotifications = [
        newNotification,
        ...state.navbarNotifications,
      ].slice(0, 10);

      // Update unread count
      state.unreadCount += 1;

      // Add to notifications only if on the first page
      if (state.currentPage === 1) {
        state.notifications = [newNotification, ...state.notifications].slice(
          0,
          10
        );
      }

      // Increment total items
      state.totalItems += 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Update the current page
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.totalItems = action.payload.count;
        // state.unreadCount = action.payload.data.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNavbarNotifications.fulfilled, (state, action) => {
        state.navbarNotifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.navbarNotifications = state.navbarNotifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0;
      })
      // Mark a single notification as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        );
        state.navbarNotifications = state.navbarNotifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        );
        state.unreadCount -= 1;
      });
  },
});

export const { addNotification, setCurrentPage } = notificationSlice.actions;
export default notificationSlice.reducer;

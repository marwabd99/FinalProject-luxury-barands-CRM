import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

// --- שליפת כל המשתמשים ---
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/users");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- הפיכת משתמש לאדמין או הסרת אדמין ---
export const toggleAdmin = createAsyncThunk(
  "users/toggleAdmin",
  async ({ userId, isAdmin }, { rejectWithValue }) => {
    try {
      const res = await apiClient.patch(`/users/${userId}/toggleAdmin`, {
        isAdmin,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- מחיקת משתמש ---
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      return userId; // מחזירים רק את ה-ID למחיקה מהסטייט
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetchUsers ---
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- toggleAdmin ---
      .addCase(toggleAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
      })
      .addCase(toggleAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- deleteUser ---
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;

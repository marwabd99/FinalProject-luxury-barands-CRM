import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      if (!res.data.isAdmin) {
        return rejectWithValue("גישה למערכת ניהול מותרת רק למנהלים");
      }
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { currentUser: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("userInfo");
    },
    setUserFromStorage: (state) => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) state.currentUser = userInfo;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;

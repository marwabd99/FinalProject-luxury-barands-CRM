import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

// Fetch all orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const res = await apiClient.get("/orders");
  return res.data;
});

// Toggle Paid
export const togglePaid = createAsyncThunk(
  "orders/togglePaid",
  async ({ orderId, isPaid }) => {
    const res = await apiClient.patch(`/orders/${orderId}/togglePaid`, {
      isPaid,
    });
    return res.data;
  }
);

// Toggle Shipped
export const toggleShipped = createAsyncThunk(
  "orders/toggleShipped",
  async ({ orderId, isShipped }) => {
    const res = await apiClient.patch(`/orders/${orderId}/toggleShipped`, {
      isShipped,
    });
    return res.data;
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: { orders: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(togglePaid.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index >= 0) state.orders[index] = action.payload;
      })
      .addCase(toggleShipped.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index >= 0) state.orders[index] = action.payload;
      });
  },
});

export default ordersSlice.reducer;

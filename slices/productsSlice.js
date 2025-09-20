import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

// הבאת כל המוצרים
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await apiClient.get("/products");
    return res.data;
  }
);

// הוספת מוצר חדש
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (product) => {
    const res = await apiClient.post("/products", product);
    return res.data;
  }
);

// עדכון מוצר
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const res = await apiClient.put(`/products/${id}`, productData);
    return res.data;
  }
);

// מחיקת מוצר
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId) => {
    await apiClient.delete(`/products/${productId}`);
    return productId;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export default productsSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import productsReducer from "./slices/productsSlice";
import ordersReducer from "./slices/ordersSlice";
import authReducer from "./slices/authSlice"; 

const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
});

export default store;

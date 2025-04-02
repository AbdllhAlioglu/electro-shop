import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderCreated: false,
  currentOrderId: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderCreatedSuccess(state, action) {
      console.log("orderCreatedSuccess reducer called with:", action.payload);
      state.orderCreated = true;
      state.currentOrderId = action.payload;
    },
    resetOrderCreated(state) {
      console.log("resetOrderCreated reducer called");
      state.orderCreated = false;
      state.currentOrderId = null;
    },
  },
});

export const { orderCreatedSuccess, resetOrderCreated } = orderSlice.actions;

export default orderSlice.reducer;

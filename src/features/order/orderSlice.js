import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: [],
  reducers: {
    createOrder: (state, action) => {
      // Add the new order to the state
      state.push(action.payload);
    },
  },
});

export const { createOrder } = orderSlice.actions;
export default orderSlice.reducer;

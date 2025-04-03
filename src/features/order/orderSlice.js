import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderCreated: false, // Yeni bir sipariş oluşturuldu mu?
  currentOrderId: null, // En son oluşturulan siparişin ID'si
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Sipariş başarıyla oluşturulduğunda çağrılır
    orderCreatedSuccess: (state, action) => {
      state.orderCreated = true;
      state.currentOrderId = action.payload;
    },
    // Toast bildirimi gösterildikten sonra state'i sıfırla
    resetOrderCreated: (state) => {
      state.orderCreated = false;
    },
  },
});

export const { orderCreatedSuccess, resetOrderCreated } = orderSlice.actions;

export default orderSlice.reducer;

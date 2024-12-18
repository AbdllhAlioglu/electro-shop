import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateNames(state, action) {
      state.userName = action.payload;
    },
    resetName(state) {
      state.userName = "";
    },
  },
});

export const { updateNames, resetName } = userSlice.actions;
export default userSlice.reducer;

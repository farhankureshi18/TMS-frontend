import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  userEmail: "",
  role: "",
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.fullName = action.payload.fullName;
      state.userEmail = action.payload.userEmail;
      state.role = action.payload.role;
      state._id = action.payload._id;
    },
    clearUser: (state) => {
      state.fullName = "";
      state.userEmail = "";
      state.role = "";
      state._id = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

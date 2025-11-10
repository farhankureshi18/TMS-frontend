import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import studentBatchReducer from "./studentBatchSlice";


const store = configureStore({
  reducer: {
    user: userReducer,
    studentBatch: studentBatchReducer,
  },
});

export default store;

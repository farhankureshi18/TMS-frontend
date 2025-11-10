import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  batches: [], 
};

export const studentBatchSlice = createSlice({
  name: "studentBatch",
  initialState,
  reducers: {
    setStudentBatches: (state, action) => {
      state.batches = action.payload;
    },
  },
});

export const { setStudentBatches } = studentBatchSlice.actions;
export default studentBatchSlice.reducer;

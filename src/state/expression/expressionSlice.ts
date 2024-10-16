// state/expression/expressionSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface ExpressionState {
  isExpressionActive: boolean;
}

const initialState: ExpressionState = {
  isExpressionActive: false
};

const expressionSlice = createSlice({
  name: 'expression',
  initialState,
  reducers: {
    toggleExpression: (state) => {
      state.isExpressionActive = !state.isExpressionActive;
    },
    setExpressionActive: (state, action) => {
      state.isExpressionActive = action.payload;
    }
  }
});

export const { toggleExpression, setExpressionActive } = expressionSlice.actions;
export default expressionSlice.reducer;
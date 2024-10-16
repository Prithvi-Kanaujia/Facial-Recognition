// state/expression/expressionSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AgeState {
    isAgeActive: boolean;
}

const initialState: AgeState = {
    isAgeActive: false
};

const ageSlice = createSlice({
    name: 'age',
    initialState,
    reducers: {
        toggleAge: (state) => {
            state.isAgeActive = !state.isAgeActive;
        },
        setAgeActive: (state, action) => {
            state.isAgeActive = action.payload;
        }
    }
});

export const { toggleAge, setAgeActive } = ageSlice.actions;
export default ageSlice.reducer;
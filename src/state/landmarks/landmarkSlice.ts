import { createSlice } from "@reduxjs/toolkit";

interface FeatureState {
    isFeatureActive: boolean;
  }
  
const initialState: FeatureState = {
    isFeatureActive: false,
};

const featureSlice = createSlice({
    name: 'feature',
    initialState,
    reducers: {
        toggleFeature: (state) => {
          state.isFeatureActive = !state.isFeatureActive;
        },
        setFeatureActive: (state, action) => {
          state.isFeatureActive = action.payload;
        }
      }
});

export const {toggleFeature, setFeatureActive} = featureSlice.actions
export default featureSlice.reducer
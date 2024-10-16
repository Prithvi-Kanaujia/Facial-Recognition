import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    activeTab: string;
}

const initialState: AppState = {
    activeTab: 'home',
};


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        }
    }
});

export const { setActiveTab } = appSlice.actions
export default appSlice.reducer
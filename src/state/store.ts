// import { createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './active_tab/tabSlice'
import ageReducer from './Age/ageSlice'
import expressionReducer from './expression/expressionSlice';
import featureReducer from './landmarks/landmarkSlice'
import { features } from 'process';


const Store = configureStore({
    reducer: {appReducer, expressionReducer, ageReducer, featureReducer}
  });

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
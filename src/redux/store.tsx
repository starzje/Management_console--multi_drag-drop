import { configureStore } from "@reduxjs/toolkit";
import gameSliceReducer from "./features/gameSlice"
import gameTypeSliceReducer from "./features/gameTypeSlice"
import multiSelectSliceReducer from "./features/multiSelectSlice"
import appStateSliceReducer from "./features/appStateSlice"
import modalSliceReducer from "./features/ModalControlSlice"

export const store = configureStore({
  reducer: {
    gameSlice: gameSliceReducer,
    gameTypeSlice: gameTypeSliceReducer,
    multiSelectSlice: multiSelectSliceReducer,
    appStateSlice: appStateSliceReducer,
    modalSlice: modalSliceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

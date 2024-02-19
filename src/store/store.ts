import { configureStore } from "@reduxjs/toolkit";

import { exchangeSlice } from "./slices/exchangeSlice";

export const store = configureStore({
  reducer: {
    [exchangeSlice.name]: exchangeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

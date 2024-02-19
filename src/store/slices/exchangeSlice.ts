import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  status: "init" | "loading" | "success" | "error";
  data: Record<string, string>;
  values: {
    from: string;
    to: string;
    rate: number;
  };
};

const initialState: InitialState = {
  status: "init",
  data: {},
  values: {
    from: "EUR",
    to: "USD",
    rate: 0,
  },
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<InitialState["data"]>) => {
      state.data = action.payload;
    },
    setValues: (state, action: PayloadAction<InitialState["values"]>) => {
      state.values = action.payload;
    },
    setStatus: (state, action: PayloadAction<InitialState["status"]>) => {
      state.status = action.payload;
    },
  },
});

const { actions: exchangeActions } = exchangeSlice;

export { exchangeActions, exchangeSlice };

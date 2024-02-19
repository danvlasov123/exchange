import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  status: "init" | "loading" | "success" | "error";
  exchange_rates: Record<string, string>;
  rate: {
    from_name: string;
    to_name: string;
    amount: number;
  };
};

const initialState: InitialState = {
  status: "init",
  exchange_rates: {},
  rate: {
    from_name: "KZT",
    to_name: "USD",
    amount: 0,
  },
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setExchangeRates: (
      state,
      action: PayloadAction<InitialState["exchange_rates"]>,
    ) => {
      state.exchange_rates = action.payload;
    },
    setRate: (state, action: PayloadAction<InitialState["rate"]>) => {
      state.rate = action.payload;
    },
    setStatus: (state, action: PayloadAction<InitialState["status"]>) => {
      state.status = action.payload;
    },
  },
});

const { actions: exchangeActions } = exchangeSlice;

export { exchangeActions, exchangeSlice };

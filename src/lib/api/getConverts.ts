import axios from "axios";

import { api_key, api_url } from "../../config/config";

const url = `${api_url}/currency/convert`;

export type DataCurrencyConvert = {
  base_currency_code: string;
  base_currency_name: string;
  amount: string;
  updated_date: string;
  rates: Record<string, Rates>;
  status: string;
};

export type Rates = {
  currency_name: string;
  rate: string;
  rate_for_amount: string;
};

export type ParamsConverts = {
  from: string;
  to: string;
};

export const getConverts = async (params?: ParamsConverts) => {
  try {
    const response = await axios.get<DataCurrencyConvert>(url, {
      params: {
        ...params,
        api_key,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

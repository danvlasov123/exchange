import axios from "axios";

import { api_key, api_url } from "../../config/config";

const url = `${api_url}/currency/list`;

export type DataCurrencyList = {
  currencies: Currencies;
  status: string;
};

export type Currencies = Record<string, string>;

export const getСurrencies = async () => {
  try {
    const response = await axios.get<DataCurrencyList>(url, {
      params: {
        api_key,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

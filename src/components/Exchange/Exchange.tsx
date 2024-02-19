import { useCallback, useEffect, useMemo, useState } from "react";
import { getConverts, getСurrencies } from "src/lib/api";

import { useAppSelector, useAppDispatch } from "src/hooks/hooks";

import { exchangeActions } from "src/store/slices/exchangeSlice";
import { ChangeIcon } from "src/components/icons";

import { ExchangeItem } from "./ExchangeItem";
import { Spinner } from "../Spinner/Spinner";

type Amount = {
  from: string;
  to: string;
};

const Exchange = () => {
  const dispatch = useAppDispatch();
  const { status, values } = useAppSelector((state) => state.exchange);

  const [amount, setAmount] = useState<Amount>({ from: "0", to: "0" });

  const updateCurrency = async (from: string, to: string) => {
    try {
      dispatch(exchangeActions.setStatus("loading"));

      const response = await getConverts({ from, to });

      dispatch(exchangeActions.setStatus("success"));

      if (response?.status === 200) {
        const rate = response.data.rates[to].rate ?? 0;

        dispatch(
          exchangeActions.setValues({
            to,
            from,
            rate: Number(rate),
          }),
        );

        return Number(rate);
      }
      return 1;
    } catch (error) {
      console.error(error);
      dispatch(exchangeActions.setStatus("error"));
      return 1;
    }
  };

  const handleChange = {
    from: useCallback(
      async (currency: string, value: string) => {
        let to = Number(value) * values.rate;

        if (currency !== values.from) {
          const rate = await updateCurrency(currency, values.to);

          to = Number(value) * rate;
        }

        setAmount({
          from: value,
          to: String(Number(to).toFixed(2)),
        });
      },
      [values],
    ),
    to: useCallback(
      async (currency: string, value: string) => {
        let from = Number(value) / values.rate;

        if (currency !== values.to) {
          const rate = await updateCurrency(values.from, currency);

          from = Number(value) / rate;
        }

        setAmount({
          from: String(Number(from).toFixed(2)),
          to: value,
        });
      },
      [values],
    ),
    swap: async function () {
      const updateValues = {
        ...values,
        from: values.to,
        to: values.from,
      };
      await updateCurrency(updateValues.from, updateValues.to);
      setAmount({ from: amount.to, to: amount.from });
    },
  };

  useEffect(() => {
    const initial = async () => {
      try {
        dispatch(exchangeActions.setStatus("loading"));

        const response = await getСurrencies();

        if (response?.status === 200) {
          dispatch(exchangeActions.setData(response.data.currencies));
        }

        await updateCurrency(values.from, values.to);
      } catch (error) {
        console.error(error);
        dispatch(exchangeActions.setStatus("error"));
      }
    };

    initial();
  }, []);

  if (status === "error") {
    return "error";
  }

  return (
    <div className="flex flex-col gap-[15px] rounded-[20px] bg-white p-5 shadow-[0px_4px_4px_0px_#0000000D]">
      <div>
        <ExchangeItem
          label="Amount"
          currency={values.from}
          onChange={handleChange.from}
          value={amount.from}
        />
        <div className="flex items-center py-[15px]">
          <hr className="w-full text-[#E7E7EE]" />
          <button
            disabled={status === "loading"}
            onClick={handleChange.swap}
            className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-blue hover:opacity-80 disabled:bg-lightGray"
          >
            {status === "loading" ? <Spinner /> : <ChangeIcon />}
          </button>
          <hr className="w-full text-[#E7E7EE]" />
        </div>
        <ExchangeItem
          label="Converted Amount"
          value={amount.to}
          currency={values.to}
          onChange={handleChange.to}
        />
      </div>
    </div>
  );
};

export { Exchange };

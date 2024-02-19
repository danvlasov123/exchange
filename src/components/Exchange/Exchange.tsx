import { useCallback, useEffect, useMemo, useState } from "react";
import { getConverts, getExchangeRates } from "src/lib/api";

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
  const { status, rate } = useAppSelector((state) => state.exchange);

  const [inputAmounts, setInputAmounts] = useState<Amount>({
    from: "0",
    to: "0",
  });

  const updateCurrency = async (from_name: string, to_name: string) => {
    try {
      dispatch(exchangeActions.setStatus("loading"));

      const response = await getConverts({ from: from_name, to: to_name });

      dispatch(exchangeActions.setStatus("success"));

      if (response?.status === 200) {
        const new_amount = response.data.rates[to_name].rate ?? 0;

        dispatch(
          exchangeActions.setRate({
            to_name,
            from_name,
            amount: Number(new_amount),
          }),
        );

        return Number(new_amount);
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
      async (new_name: string, quantity: string) => {
        let updated_quantity_to = Number(quantity) * rate.amount;

        if (new_name !== rate.from_name) {
          const new_amount = await updateCurrency(new_name, rate.to_name);

          updated_quantity_to = Number(quantity) * new_amount;
        }

        setInputAmounts({
          from: quantity,
          to: String(Number(updated_quantity_to).toFixed(2)),
        });
      },
      [rate],
    ),
    to: useCallback(
      async (new_name: string, quantity: string) => {
        let updated_quantity_from = Number(quantity) / rate.amount;

        if (new_name !== rate.to_name) {
          const new_amount = await updateCurrency(rate.from_name, new_name);

          updated_quantity_from = Number(quantity) / new_amount;
        }

        setInputAmounts({
          from: String(Number(updated_quantity_from).toFixed(2)),
          to: quantity,
        });
      },
      [rate],
    ),
    swap: async function () {
      const updatedRate = {
        ...rate,
        from_name: rate.to_name,
        to_name: rate.from_name,
      };
      await updateCurrency(updatedRate.from_name, updatedRate.to_name);
      setInputAmounts({ from: inputAmounts.to, to: inputAmounts.from });
    },
  };

  useEffect(() => {
    const initial = async () => {
      try {
        dispatch(exchangeActions.setStatus("loading"));

        const response = await getExchangeRates();

        if (response?.status === 200) {
          dispatch(exchangeActions.setExchangeRates(response.data.currencies));
        }

        await updateCurrency(rate.from_name, rate.to_name);
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
          name_rate={rate.from_name}
          onChange={handleChange.from}
          value={inputAmounts.from}
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
          name_rate={rate.to_name}
          onChange={handleChange.to}
          value={inputAmounts.to}
        />
      </div>
    </div>
  );
};

export { Exchange };

import { FC, memo } from "react";

import { ArrowBottomIcon } from "src/components/icons";

import { ModalChooseExchange } from "src/components/modals/ModalChooseExchange/ModalChooseExchange";

import { numberValidate } from "src/lib/validates";

import JSON_currency from "currency.json";

export type ExchangeItemProps = {
  name_rate: string;
  label?: string;
  value: string;
  onChange: (currency: string, value: string) => void;
};

const ExchangeItem: FC<ExchangeItemProps> = memo(
  ({ name_rate, onChange, label = "Amount", value }) => {
    const flag = JSON_currency.find((c) => c.code === name_rate);

    return (
      <div>
        <p className="text-[15px] leading-[17.58px] text-lightGray">{label}</p>

        <div className="mt-3.5 flex items-center gap-3.5">
          <div className="flex items-center gap-[13px]">
            <div className="h-[45px] w-[45px] overflow-hidden rounded-full bg-lightGray">
              {flag && <img src={flag.flag} className="h-full w-full" alt="" />}
            </div>
            <ModalChooseExchange
              onSelect={(name) => onChange(name, value)}
              trigger={
                <button className="flex items-center gap-2">
                  <p className="text-xl font-medium leading-[23.44px] text-blue">
                    {name_rate}
                  </p>
                  <ArrowBottomIcon />
                </button>
              }
            />
          </div>
          <div>
            <input
              value={numberValidate(value)}
              onChange={(event) => onChange(name_rate, event.target.value)}
              type="number"
              className="w-full rounded-[7px] bg-[#EFEFEF] px-3.5 py-[11px] text-right text-xl font-bold leading-[23.44px] text-[#3C3C3C] outline-none"
            />
          </div>
        </div>
      </div>
    );
  },
);

export { ExchangeItem };

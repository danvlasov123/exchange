import "@fontsource/roboto";
import "./index.css";

import { Exchange } from "src/components/Exchange/Exchange";
import { useAppSelector } from "./hooks/hooks";

const App = () => {
  const { rate, status } = useAppSelector((state) => state.exchange);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F6F6F6] px-4">
      <div className="w-full max-w-80">
        <h1 className="text-center text-[25px] font-bold leading-[29.3px] text-title">
          Currency Converter
        </h1>
        <p className="mt-2.5 text-center leading-[18.75px] text-gray">
          Check live rates, set rate alerts, receive notifications and more.
        </p>
        <div className="mt-10">
          <Exchange />
        </div>
        {status === "success" && (
          <div className="mt-[30px]">
            <h3 className="leading-[18.75px] text-[#A1A1A1]">
              Indicative Exchange Rate
            </h3>
            <p className="mt-[13px] text-lg font-medium leading-[21.09px] text-black">
              1 {rate.from_name} = {rate.amount} {rate.to_name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

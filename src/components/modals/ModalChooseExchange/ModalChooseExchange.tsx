import {
  FC,
  cloneElement,
  useState,
  ReactElement,
  Fragment,
  ChangeEvent,
  useMemo,
} from "react";

import { Modal } from "../Modal";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { useAppSelector } from "src/hooks/hooks";

type TypeSearchModal = {
  trigger: ReactElement;
  onSelect: (quoute: string) => void;
};

const ModalChooseExchange: FC<TypeSearchModal> = ({ trigger, onSelect }) => {
  const data = useAppSelector((state) => state.exchange.data);

  const currency = Object.keys(data);

  const currentData = currency.map((c) => {
    return {
      name: `${data[c]} (${c})`,
      code: c,
    };
  });

  const [open, setOpen] = useState(false);

  const [value, setValue] = useState<string>("");

  const handleToggle = () => setOpen((prev) => !prev);

  const ButtonTriggerModal = cloneElement(trigger, {
    onClick: () => handleToggle(),
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSelect = (code: string) => () => {
    handleToggle();
    onSelect(code);
  };

  const filteredData = useMemo(
    () =>
      currentData.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase()),
      ),
    [currentData, value],
  );

  return (
    <Fragment>
      {ButtonTriggerModal}
      <Modal open={open} onToggle={handleToggle}>
        <div className="relative">
          <MagnifyingGlassIcon className="text-slate-500 pointer-events-none absolute left-4 top-3.5 h-5 w-5" />
          <input
            value={value}
            autoFocus
            onChange={handleChange}
            placeholder="Поиск..."
            type="text"
            className="bg-transparent h-12 w-full border-0 pl-11 pr-4 outline-none focus:ring-0 sm:text-sm"
          />
        </div>
        <div className="max-h-96 overflow-hidden overflow-y-auto border-t border-[#F6F6F6] py-4">
          {filteredData.map((item, index) => (
            <button
              key={index}
              onClick={handleSelect(item.code)}
              className="w-full px-4 py-2 text-start hover:bg-[#F6F6F6]"
            >
              {item.name}
            </button>
          ))}
        </div>
      </Modal>
    </Fragment>
  );
};

export { ModalChooseExchange };

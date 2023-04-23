import * as React from "react";
import { useClickHandler } from "../../../hooks";

interface CheckboxProps {
  id: string;
  isSelected?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, isSelected }) => {
  const { handleClick } = useClickHandler({ forCheckbox: true });

  return (
    <input
      key={Math.random()}
      className={`checkbox__input`}
      id={id}
      type="checkbox"
      checked={id === isSelected}
      onClick={handleClick}
      readOnly
    />
  );
};

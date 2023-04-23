import * as React from "react";

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  btnClass: string;
  isDisabled?: boolean;
  toggleGameType?: number;
}

export const Button: React.FC<ButtonProps> = ({ btnClass, onClick, isDisabled, text }) => {
  return (
    <button disabled={isDisabled} onClick={onClick} className={btnClass}>
      {text}
    </button>
  );
};

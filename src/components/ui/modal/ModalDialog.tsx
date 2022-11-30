import * as React from "react";
import { useDispatch } from "react-redux";
import { dismissModal } from "../../../redux/features/ModalControlSlice";
import Button from "../Button";
import { ModalBase } from "./ModalBase";

export interface ModalDialogProps {
  children: React.ReactNode;
  onButtonClick: (ev: React.MouseEvent) => void;
  button1Label: string;
  button2Label?: string;
  showButton2?: boolean;
  dismissDisabled?: boolean;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  children,
  button1Label,
  onButtonClick,
  button2Label,
  showButton2 = true,
  dismissDisabled = false,
}) => {
  const dispatch = useDispatch();

  return (
    <ModalBase dismissDisabled={dismissDisabled}>
      <h2>{children}</h2>
      <div className="modal__box__buttons">
        <Button
          onClick={onButtonClick}
          text={button1Label}
          btnClass="modal__box__buttons--yes"
        />
        {showButton2 && button2Label !== undefined && (
          <Button
            onClick={() => dispatch(dismissModal())}
            text={button2Label}
            btnClass="modal__box__buttons--no"
          />
        )}
      </div>
    </ModalBase>
  );
};

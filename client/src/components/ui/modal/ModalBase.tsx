import * as React from "react";
import { useDispatch } from "react-redux";
import { dismissModal } from "../../../redux/features";
import { MdClose } from "react-icons/md";

export interface ModalBaseProps {
  dismissDisabled?: boolean;
  customCloseFn?: (() => void) | undefined;
  children: React.ReactNode;
}

export const ModalBase: React.FC<ModalBaseProps> = ({ children, dismissDisabled = false, customCloseFn }) => {
  const dispatch = useDispatch();

  const handleCloseModal = (customCloseFn: (() => void) | undefined) => {
    if (customCloseFn) {
      customCloseFn();
    } else {
      dispatch(dismissModal());
    }
  };

  return (
    <div
      role="presentation"
      className="modal-overlay"
      onClick={() => {
        if (!dismissDisabled) handleCloseModal(customCloseFn);
      }}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal">
        <button className="modal__close-icon" onClick={() => handleCloseModal(customCloseFn)}>
          <MdClose className="modal-close-icon" color="white" size="40px" />
        </button>

        <div className="modal__box">{children}</div>
      </div>
    </div>
  );
};

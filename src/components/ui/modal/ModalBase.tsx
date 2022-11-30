import * as React from "react";
import { useDispatch } from "react-redux";
import { dismissModal } from "../../../redux/features/ModalControlSlice";

export interface ModalBaseProps {
  dismissDisabled?: boolean
}

export const ModalBase: React.FC<ModalBaseProps> = ({ children, dismissDisabled = false }) => {

  const dispatch = useDispatch();

  return (
    <div className="modal-overlay" onClick={() => { if (!dismissDisabled) dispatch(dismissModal()); }}>
      <div onClick={(e) => e.stopPropagation()} className="modal">
        <div className="modal__box">
          {children}
        </div>
      </div>
    </div>
  );
}

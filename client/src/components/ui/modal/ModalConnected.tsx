import * as React from "react";
import { useSelector } from "react-redux";
import { modalSelector, ModalType } from "../../../redux/features";
import { ModalSave, ModalError, ModalDiscard, ModalSpinner, ModalImage, ModalNotification } from "../modal";

export const ModalConnected: React.FC = () => {
  const modalType = useSelector(modalSelector);

  return (
    <>
      {(() => {
        switch (modalType) {
          case ModalType.Error:
            return <ModalError />;
          case ModalType.Notification:
            return <ModalNotification />;
          case ModalType.Spinner:
            return <ModalSpinner />;
          case ModalType.DiscardDialog:
            return <ModalDiscard />;
          case ModalType.SaveDialog:
            return <ModalSave />;
          case ModalType.Image:
            return <ModalImage />;
          case ModalType.None:
            return null;
        }
      })()}
    </>
  );
};

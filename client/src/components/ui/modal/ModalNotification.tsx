import * as React from "react";
import { useDispatch } from "react-redux";
import { dismissModal } from "../../../redux/features";
import { ModalDialog } from "../modal";

export const ModalNotification: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <ModalDialog button1Label={"U redu"} onButtonClick={() => dispatch(dismissModal())}>
      Radnja uspješno izvršena
    </ModalDialog>
  );
};

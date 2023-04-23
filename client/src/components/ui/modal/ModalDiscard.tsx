import * as React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { discardChangesThunk } from "../../../redux/thunks";
import { ModalDialog } from "../modal";

export const ModalDiscard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const discardGamesClick = () => {
    gtag("event", "discard_click");
    dispatch(discardChangesThunk());
  };

  return (
    <ModalDialog button1Label="Odbaci" button2Label="Odustani" onButtonClick={discardGamesClick}>
      Jeste li sigurni da želite odbaciti promjene?
    </ModalDialog>
  );
};

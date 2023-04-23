import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialLoadingSelector, modalErrorTypeSelector, modalMessage } from "../../../redux/features";
import { AppDispatch } from "../../../redux/store";
import { fetchGamesThunk, discardChangesThunk, saveGamesThunk } from "../../../redux/thunks";
import { ModalDialog } from "../modal";

export const ModalError: React.FC = () => {
  const errorMessage = useSelector(modalMessage);
  const initialLoadingCompleted = useSelector(initialLoadingSelector);
  const modalErrorType = useSelector(modalErrorTypeSelector);
  const dispatch = useDispatch<AppDispatch>();

  const onClick = () => {
    /** ako je error nastao prilikom savea, koristi saveGamesThunk, u suprotnom koristi discard ili fetch thunk, ovisno o tom je li inicijalni load završen */
    modalErrorType === "save"
      ? dispatch(saveGamesThunk())
      : initialLoadingCompleted
      ? dispatch(discardChangesThunk())
      : dispatch(fetchGamesThunk());
  };

  return (
    <ModalDialog
      dismissDisabled={!initialLoadingCompleted}
      button1Label="Pokušaj ponovno"
      button2Label="Odustani"
      showButton2={initialLoadingCompleted}
      onButtonClick={onClick}
    >
      {errorMessage}
    </ModalDialog>
  );
};

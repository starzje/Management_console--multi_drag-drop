import * as React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { initialLoadingSelector } from "../../../redux/features/gameSlice";
import { modalErrorTypeSelector, modalMessage } from "../../../redux/features/ModalControlSlice";
import { AppDispatch } from "../../../redux/store";
import { discardChangesThunk } from "../../../redux/thunks/discardGamesThunk";
import { fetchGamesThunk } from "../../../redux/thunks/fetchGamesThunk";
import { saveGamesThunk } from "../../../redux/thunks/saveGamesThunk";
import { ModalDialog } from "./ModalDialog";

export interface ModalErrorProps { }

export const ModalError: React.FC<ModalErrorProps> = () => {
    const errorMessage = useSelector(modalMessage);
    const initialLoadingCompleted = useSelector(initialLoadingSelector);
    const modalErrorType = useSelector(modalErrorTypeSelector);
    const dispatch = useDispatch<AppDispatch>();

    const onClick = () => {
        /** ako je error nastao prilikom savea, koristi saveGamesThunk, u suprotnom koristi discard ili fetch thunk, ovisno o tom je li inicijalni load završen */
        modalErrorType === "save" ? dispatch(saveGamesThunk()) : (initialLoadingCompleted ? dispatch(discardChangesThunk()) : dispatch(fetchGamesThunk()))
    }

    return (
        <ModalDialog
            dismissDisabled={!initialLoadingCompleted}
            button1Label="Pokušaj ponovno"
            button2Label="Odustani"
            showButton2={initialLoadingCompleted}
            onButtonClick={onClick}>
            {errorMessage}
        </ModalDialog>
    );
}
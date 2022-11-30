import * as React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { discardChangesThunk } from "../../../redux/thunks/discardGamesThunk";
import { ModalDialog } from "./ModalDialog";

export interface ModalDiscardProps { }

export const ModalDiscard: React.FC<ModalDiscardProps> = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <ModalDialog
            button1Label="Odbaci"
            button2Label="Odustani"
            onButtonClick={() => dispatch(discardChangesThunk())}
        >
            Jeste li sigurni da želite odbaciti promjene?
        </ModalDialog>
    );
}
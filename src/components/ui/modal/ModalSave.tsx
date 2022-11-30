import * as React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { concatGamesForSQLProcedure } from "../../../helpers/concatGamesForSQLProcedure";
import { eIgreGamesSelector, liveCasinoGamesSelector } from "../../../redux/features/gameSlice";
import { AppDispatch } from "../../../redux/store";
import { saveGamesThunk } from "../../../redux/thunks/saveGamesThunk";
import { ModalDialog } from "./ModalDialog";


export const ModalSave: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const eIgre = useSelector(eIgreGamesSelector);
    const liveCasino = useSelector(liveCasinoGamesSelector);
    const { gamesXmlString } = concatGamesForSQLProcedure(eIgre, liveCasino)

    return (
        <ModalDialog
            button1Label="Spremi"
            button2Label="Odustani"
            onButtonClick={() => dispatch(saveGamesThunk(gamesXmlString))}
        >
            Jeste li sigurni da želite spremiti promjene?
        </ModalDialog>
    );
}
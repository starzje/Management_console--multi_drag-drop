import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { concatGamesForSQLProcedure } from "../../../helpers";
import { eIgreGamesSelector, liveCasinoGamesSelector } from "../../../redux/features";
import { AppDispatch } from "../../../redux/store";
import { saveGamesThunk } from "../../../redux/thunks";
import { ModalDialog } from "../modal";

export const ModalSave: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const eIgre = useSelector(eIgreGamesSelector);
  const liveCasino = useSelector(liveCasinoGamesSelector);
  const { gamesXmlString } = concatGamesForSQLProcedure(eIgre, liveCasino);

  const saveGamesClick = () => {
    gtag("event", "save_click");
    dispatch(saveGamesThunk(gamesXmlString));
  };

  return (
    <ModalDialog button1Label="Spremi" button2Label="Odustani" onButtonClick={saveGamesClick}>
      Jeste li sigurni da želite spremiti promjene?
    </ModalDialog>
  );
};

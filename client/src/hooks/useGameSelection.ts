import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toggleSelection, toggleSelectionInGroup, toggleMultiSelectionInGroup } from "../redux/features";
import { wasMultiSelectKeyUsed, wasToggleInSelectionGroupKeyUsed } from "../helpers";
import { Game } from "../types";

/**
 * React hook koji se brine o selektiranju igre s različitim tipkama i eventima. Koristi se samo unutar useClickHandler hooka
 * @property {function(React.MouseEvent | React.KeyboardEvent, string, Game[]): void} performClickAction - Selektira igru ovisno o click/keyboard eventu, i radi po tom šalje dobivene podatke u redux store da se selektira ispravna odabrana igra.
 * @returns {GameSelectionResult} Objekt koji sadrži performClickAction funkciju.
 */

export const useGameSelection = () => {
  const dispatch = useDispatch();

  const performClickAction = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent, selectedGameID: string, games: Game[]) => {
      if (wasToggleInSelectionGroupKeyUsed(event)) {
        dispatch(toggleSelectionInGroup({ gameId: selectedGameID }));
      } else if (wasMultiSelectKeyUsed(event)) {
        dispatch(toggleMultiSelectionInGroup({ gameId: selectedGameID, games }));
      } else {
        dispatch(toggleSelection({ gameId: selectedGameID }));
      }
    },
    [dispatch],
  );

  return { performClickAction };
};

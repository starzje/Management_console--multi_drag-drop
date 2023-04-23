import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DropResult } from "react-beautiful-dnd";
import {
  reorderGameList,
  reorderMultipleGames,
  somethingChanged,
  gamesSelector,
  lobbyTypeSelector,
} from "../redux/features";
import { didSomethingChangeSelector, selectMultipleGames } from "../redux/features";

import { Game } from "../types";

/**
 * React hook koji se brine o drag and drop funkcionalnostima.
 * @property {function(): void} onDragStart - Postavlja state ghosting na true kad drag započne.
 * @property {function(DropResult): void} onDragEnd - Kad je drag završio, šalje točan redoslijed igara u redux store i postavlja ghosting na false.
 * @property {boolean} isGhosting - Stanje koje prati jesu li igre u drag fazi.
 * @param {LobbyType} lobbyIsType - Tip igre (e.g., eIgre, liveCasino).
 * @param {Game[]} games - Array svih igara.
 * @param {Game[]} eIgre - Array igara koje su tipa Eigre.
 * @param {Game[]} liveCasino - Array igara koje su tipa liveCasino.
 * @returns {DragAndDropResult} Objekt koji sadržava onDragStart, onDragEnd, i isGhosting.
 */

export const useDragAndDrop = (games: Game[]) => {
  const lobbyIsType = useSelector(lobbyTypeSelector);
  const gamesBySelectedType = useSelector(gamesSelector);
  const dispatch = useDispatch();
  const somethingChangedInTheApp = useSelector(didSomethingChangeSelector);
  const selectedGames = useSelector(selectMultipleGames);
  const [isGhosting, setIsGhosting] = useState(false);

  const onDragStart = useCallback(() => {
    setIsGhosting(true);
  }, []);

  const handleSingleGameReorder = useCallback(
    (result: DropResult) => {
      dispatch(
        reorderGameList({
          game: gamesBySelectedType,
          endIndex: result.destination!.index,
          startIndex: result.source.index,
          dragTargetID: parseInt(result.draggableId),
          lobbyType: lobbyIsType,
        }),
      );
    },
    [dispatch, lobbyIsType, gamesBySelectedType],
  );

  const handleMultipleGamesReorder = useCallback(
    (result: DropResult) => {
      dispatch(
        reorderMultipleGames({
          games: games,
          startIndex: result.source.index,
          endIndex: result.destination!.index,
          selectedGameIds: selectedGames,
          lobbyType: lobbyIsType,
        }),
      );
    },
    [dispatch, lobbyIsType, games, selectedGames],
  );

  const onDragEnd = useCallback(
    (result: DropResult): void => {
      if (!result.destination) {
        return;
      }

      const isMultipleSelection = selectedGames.length >= 2;

      if (isMultipleSelection) {
        handleMultipleGamesReorder(result);
      } else {
        handleSingleGameReorder(result);
      }

      setIsGhosting(false);

      if (!somethingChangedInTheApp) {
        dispatch(somethingChanged());
      }
    },
    [somethingChangedInTheApp, handleSingleGameReorder, handleMultipleGamesReorder, dispatch, selectedGames.length],
  );

  return { onDragStart, onDragEnd, isGhosting };
};

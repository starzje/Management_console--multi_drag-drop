import * as React from "react";
import { useCallback, useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableStateSnapshot,
  DraggableProvided,
} from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import {
  didSomethingChangeSelector,
  somethingChanged,
} from "../../../redux/features/appStateSlice";
import {
  eIgreGamesSelector,
  gamesSelector,
  liveCasinoGamesSelector,
  reorderGameList,
  reorderMultipleGames,
} from "../../../redux/features/gameSlice";
import { lobbyTypeSelector } from "../../../redux/features/gameTypeSlice";
import {
  deselectAll,
  selectMultipleGames,
  toggleMultiSelectionInGroup,
  toggleSelection,
  toggleSelectionInGroup,
} from "../../../redux/features/multiSelectSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  wasMultiSelectKeyUsed,
  wasToggleInSelectionGroupKeyUsed,
} from "../../../helpers/wasKeyUsed";
import GameListElement from "../gameList/GameListElement";
import { LobbyType } from "../../../types/gameData";

const DraggableList = () => {
  const lobbyIsType = useSelector(lobbyTypeSelector);
  const somethingChangedInTheApp = useSelector(didSomethingChangeSelector);
  const selectMultiGames = useSelector(selectMultipleGames);
  const eIgre = useSelector(eIgreGamesSelector);
  const liveCasino = useSelector(liveCasinoGamesSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [isGhosting, setIsGhosting] = useState(false);

  const PRIMARY_BUTTON_NUMBER = 0;
  const games = useSelector(gamesSelector);

  //* deselektiraj oznacene igre ako se klikne bilo gdje drugdje s mišom */
  const onWindowClick = useCallback((e) => {
    if (e.defaultPrevented) {
      return;
    }
    dispatch(deselectAll());
  }, []);

  //* deselektiraj oznacene igre ako se klikne escape tipka */
  const onWindowKeyDown = useCallback((e) => {
    if (e.defaultPrevented) {
      return;
    }
    if (e.key === "Escape") {
      dispatch(deselectAll());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("click", onWindowClick);
    window.addEventListener("keydown", onWindowKeyDown);
    return () => {
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, [onWindowClick, onWindowKeyDown]);

  const handleClick = (event: React.MouseEvent) => {
    //* ako je kliknuto na toggle button, ignoriraj selektiranje
    if (
      (event.target as HTMLElement).parentElement?.className ===
      "list-item__toggle"
    ) {
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== PRIMARY_BUTTON_NUMBER) {
      return;
    }

    event.preventDefault();

    const selectedGameID = (event.currentTarget as HTMLInputElement).id;

    performClickAction(event, selectedGameID);
  };

  //* selektiranje jedne igre s klikom miša */
  const toggleSelect = (selectedGameID: string) => {
    dispatch(
      toggleSelection({
        gameId: selectedGameID,
      })
    );
  };

  //* selektiranje više igara s klikom miša + CTRL tipkom */
  const toggleSelectGroup = (selectedGameID: string) => {
    dispatch(
      toggleSelectionInGroup({
        gameId: selectedGameID,
      })
    );
  };

  //* selektiranje više igara s klikom miša + SHIFT tipkom */
  const toggleMultiSelectGroup = (
    event: React.MouseEvent | React.KeyboardEvent,
    selectedGameID: string
  ) => {
    dispatch(
      toggleMultiSelectionInGroup({
        gameId: selectedGameID,
        games: games,
      })
    );
  };

  const performClickAction = (
    event: React.MouseEvent | React.KeyboardEvent,
    selectedGameID: string
  ) => {
    //* ako se koristila tipka CTRL za select */
    if (wasToggleInSelectionGroupKeyUsed(event)) {
      toggleSelectGroup(selectedGameID);
      return;
    }
    //* ako se koristila tipka SHIFT za select */
    if (wasMultiSelectKeyUsed(event)) {
      toggleMultiSelectGroup(event, selectedGameID);
      return;
    }
    //* normalno selektiranje jedne igre */
    toggleSelect(selectedGameID);
  };

  const onDragStart = (result: DropResult): void => {
    setIsGhosting(true);
  };

  const onDragEnd = (result: DropResult): void => {
    //* Ako je drag završio na nepravilnom mjestu, poništi akciju*/
    if (!result.destination) {
      return;
    }
    //* Ako su selektirane više od dvije igre, koristi multi reorder dispatch*/
    if (selectMultiGames.length >= 2) {
      dispatch(
        reorderMultipleGames({
          games: games,
          startIndex: result.source.index,
          endIndex: result.destination.index,
          selectedGameIds: selectMultiGames,
          lobbyType: lobbyIsType,
        })
      );
    } else {
      //* Ako je selektirana samo jedna igra, koristi normalan reorder dispatch*/
      dispatch(
        reorderGameList({
          game: lobbyIsType === LobbyType.eIgre ? eIgre : liveCasino,
          endIndex: result.destination.index,
          startIndex: result.source.index,
          dragTargetID: parseInt(result.draggableId),
          lobbyType: lobbyIsType,
        })
      );
    }
    setIsGhosting(false);

    //* Kada drag završi, zabilježi da su nastale promjene u storeu ako već nisu zabilježene*/
    if (somethingChangedInTheApp) return;
    dispatch(somethingChanged());
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable droppableId="droppable">
        {(provided) => {
          return (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {games.map((item, index) => (
                <Draggable
                  key={item.gameID}
                  draggableId={item.gameID.toString()}
                  index={index}>
                  {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot
                  ) => {
                    return (
                      <GameListElement
                        isGhosting={isGhosting}
                        handleClick={handleClick}
                        provided={provided}
                        snapshot={snapshot}
                        item={item}
                        key={item.gameID}
                      />
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableList;

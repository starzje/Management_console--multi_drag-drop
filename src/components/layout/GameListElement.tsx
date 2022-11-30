import * as React from "react";
import { Toggle } from "../../ui/toggle/Toggle";
import { MdOutlineDragIndicator } from "react-icons/md";
import Checkbox from "../../ui/checkbox/Checkbox";
import { Game } from "../../../types/gameData";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { selectMultipleGames } from "../../../redux/features/multiSelectSlice";

interface GameListProps {
  item: Game;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  handleClick: React.MouseEventHandler;
  isGhosting: boolean;
}

const GameListElement = ({
  item,
  provided,
  snapshot,
  handleClick,
  isGhosting,
}: GameListProps) => {
  const selectMultiGames = useSelector(selectMultipleGames);

  const isSelected = selectMultiGames.find(
    (id) => id === (item?.gameID).toString()
  );

  return (
    <li
      onClick={handleClick}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      key={item?.gameID}
      id={(item?.gameID).toString()}
      className={`
      ${
        isSelected && isGhosting && !snapshot.isDragging
          ? "list-item--dragging"
          : null
      }
      ${isSelected ? "list-item--selected" : null}
      list-item
        `}>
      <div className="list-item__providers">
        <MdOutlineDragIndicator className="list-item__icon" />
        <div className="checkbox">
          <Checkbox id={item?.gameID.toString()} isSelected={isSelected} />
        </div>
        <div className="list-item__providers__name">{item?.providerName}</div>
      </div>
      <div className="list-item__details">
        <div className="list-item__details__name">{item?.gameName}</div>
        <Toggle id={item?.gameID.toString()} enabledGame={item?.gameEnabled} />
      </div>
    </li>
  );
};

export default GameListElement;

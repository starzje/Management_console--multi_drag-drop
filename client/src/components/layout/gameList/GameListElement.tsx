import * as React from "react";
import { MdOutlineDragIndicator } from "react-icons/md";
import { Checkbox, Toggle } from "../../ui";
import { Game } from "../../../types";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { selectMultipleGames, ModalType, showModal, didSomethingChangeSelector } from "../../../redux/features";
import { BiImageAdd } from "react-icons/bi";
import { getColor } from "../../../helpers";

interface GameListProps {
  item: Game;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  handleClick: React.MouseEventHandler;
  isGhosting: boolean;
}

export const GameListElement = ({ item, provided, snapshot, handleClick, isGhosting }: GameListProps) => {
  const dispatch = useDispatch();
  const somethingChanged = useSelector(didSomethingChangeSelector);
  const selectMultiGames = useSelector(selectMultipleGames);
  const isSelected = selectMultiGames.find((id) => id === (item?.gameID ?? "").toString());

  const handleUploadImage = (event: React.MouseEvent) => {
    /** ako je slika već selectana koristimo stopPropagation da je ne deselecta opet na još jedan klik, jer to radi bug prilikom otvaranja modala za upload image */
    if (isSelected) {
      event.stopPropagation();
    }
    dispatch(
      showModal({
        modalType: ModalType.Image,
      }),
    );
  };

  return (
    <div
      onClick={handleClick}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      key={item?.gameID}
      // eslint-disable-next-line
      id={(item?.gameID).toString()}
      className={`
      ${isSelected && isGhosting && !snapshot.isDragging ? "list-item--dragging" : null}
      ${isSelected ? "list-item--selected" : null}
      list-item
        `}
    >
      <div className="list-item__providers">
        <MdOutlineDragIndicator className="list-item__icon" />
        <div className="checkbox">
          <Checkbox id={item?.gameID.toString()} isSelected={isSelected} />
        </div>
        <div className="list-item__providers__name">{item?.providerName}</div>
      </div>
      <div className="list-item__details">
        <button className="list-item__details__icon" onClick={handleUploadImage}>
          <BiImageAdd className="" size={40} color={getColor(item, somethingChanged)} />
        </button>
        <div className="list-item__details__name">{item?.gameName}</div>

        <Toggle id={item?.gameID.toString()} enabledGame={item?.gameEnabled} />
      </div>
    </div>
  );
};

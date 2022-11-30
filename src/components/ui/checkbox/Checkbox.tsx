import * as React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { wasMultiSelectKeyUsed } from "../../../helpers/wasKeyUsed";
import { gamesSelector } from "../../../redux/features/gameSlice";
import { toggleMultiSelectionInGroup, toggleSelectionInGroup } from "../../../redux/features/multiSelectSlice";
interface CheckboxProps {
  id: string;
  isSelected?: string
}

const Checkbox: React.FC<CheckboxProps> = ({ id, isSelected }) => {

  const dispatch = useDispatch()
  const games = useSelector(gamesSelector)
  const PRIMARY_BUTTON_NUMBER = 0;

  const toggleMultiSelectGroup = (event: React.MouseEvent | React.KeyboardEvent, gameId: string) => {
    dispatch(toggleMultiSelectionInGroup({
      gameId: gameId,
      games: games
    }))
  }

  const handleClick = (event: React.MouseEvent) => {
    //* ako je kliknuto na toggle button, ignoriraj selektiranje
    if ((event.target as HTMLElement).parentElement?.className === "list-item__toggle") {
      return;
    }
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== PRIMARY_BUTTON_NUMBER) {
      return;
    }

    const selectedGameID = (event.currentTarget as HTMLInputElement).id;

    event.preventDefault();

    if (wasMultiSelectKeyUsed(event)) {
      toggleMultiSelectGroup(event, selectedGameID)
      return;
    }
    dispatch(toggleSelectionInGroup({
      gameId: selectedGameID
    }))
  };

  return (
    <input
      key={Math.random()}
      className={`checkbox__input`}
      id={id}
      type="checkbox"
      checked={id === isSelected}
      onClick={handleClick}
      readOnly
    />
  );
};

export default Checkbox;

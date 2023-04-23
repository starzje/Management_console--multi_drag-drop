import { useDispatch, useSelector } from "react-redux";
import { gamesSelector, toggleMultiSelectionInGroup, toggleSelectionInGroup } from "../redux/features";
import { wasMultiSelectKeyUsed } from "../helpers";
import { useGameSelection } from "./useGameSelection";

export interface UseClickHandlerOptions {
  forCheckbox: boolean;
}

type UseClickHandlerResult = {
  handleClick: (event: React.MouseEvent) => void;
};

/**
 * React hook koji se brine o click eventima koji su vezani za selektiranje igara pomoću checkboxa ili normalnim klikom. Radi u kombinaciji s useGameSelection hookom
 * @param {UseClickHandlerOptions} options - Objekt koji sadržava `forCheckbox` property, koji provjerava koristi li se hook za checkbox varijantu ili ne.
 * @returns {UseClickHandlerResult} Objekt koji sadržava handleClick funkciju.
 */

export const useClickHandler = ({ forCheckbox }: UseClickHandlerOptions): UseClickHandlerResult => {
  const dispatch = useDispatch();
  const games = useSelector(gamesSelector);
  const { performClickAction } = useGameSelection();

  const handleClick = (event: React.MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    const isToggleButton = targetElement.parentElement?.className === "list-item__toggle";
    const isPrimaryButton = event.button === 0;

    if (isToggleButton || event.defaultPrevented || !isPrimaryButton) {
      return;
    }

    const selectedGameID = (event.currentTarget as HTMLInputElement).id;
    event.preventDefault();

    if (forCheckbox) {
      gtag("event", "checkboxSelection"); // google analytics event za checkbox

      if (wasMultiSelectKeyUsed(event)) {
        dispatch(
          toggleMultiSelectionInGroup({
            gameId: selectedGameID,
            games: games,
          }),
        );
      } else {
        dispatch(
          toggleSelectionInGroup({
            gameId: selectedGameID,
          }),
        );
      }
    } else {
      gtag("event", "clickSelection"); // google analytics event za normalan klik
      performClickAction(event, selectedGameID, games);
    }
  };

  return { handleClick };
};

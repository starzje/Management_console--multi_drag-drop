import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  gamesSelector,
  toggleGame,
  didSomethingChangeSelector,
  somethingChanged,
  lobbyTypeSelector,
} from "../../../redux/features";

interface ToggleProps {
  enabledGame: number;
  id: string;
}

export const Toggle: React.FC<ToggleProps> = ({ enabledGame, id }) => {
  const dispatch = useDispatch();
  const somethingChangedInTheApp = useSelector(didSomethingChangeSelector);
  const games = useSelector(gamesSelector);
  const lobbyIsType = useSelector(lobbyTypeSelector);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gtag("event", "game_toggled");
    dispatch(
      toggleGame({
        games: games,
        targetGameID: parseInt(e.target.id),
        lobbyType: lobbyIsType,
      }),
    );

    /** ako je vec zabiljezena promjena u app, ne zovi ponovno dispatch za biljezenje promjene */
    if (somethingChangedInTheApp) return;
    dispatch(somethingChanged());
  };

  return (
    <label className="list-item__toggle">
      <input
        id={id}
        type="checkbox"
        checked={enabledGame === 1 ? true : false}
        onChange={handleChange}
        value={enabledGame}
      />
      <span></span>
      <a></a>
    </label>
  );
};

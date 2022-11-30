import * as React from "react";
import { useDispatch } from "react-redux";
import { gamesSelector, toggleGame } from "../../../redux/features/gameSlice";
import { useSelector } from "react-redux";
import { didSomethingChangeSelector, somethingChanged } from "../../../redux/features/appStateSlice";
import { lobbyTypeSelector } from "../../../redux/features/gameTypeSlice";


interface ToggleProps {
  enabledGame: number;
  id: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  enabledGame,
  id,
}) => {
  const dispatch = useDispatch();
  const somethingChangedInTheApp = useSelector(didSomethingChangeSelector)
  const games = useSelector(gamesSelector)
  const lobbyIsType = useSelector(lobbyTypeSelector)



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      toggleGame({
        games: games,
        targetGameID: parseInt(e.target.id),
        lobbyType: lobbyIsType
      })
    );

    /** ako je vec zabiljezena promjena u app, ne zovi ponovno dispatch za biljezenje promjene */
    if (somethingChangedInTheApp) return
    dispatch(
      somethingChanged()
    )
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

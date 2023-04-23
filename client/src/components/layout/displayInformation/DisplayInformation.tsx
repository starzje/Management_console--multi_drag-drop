import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deselectAll, selectAll, selectMultipleGames, gamesSelector } from "../../../redux/features";

export const DisplayInformation: React.FC = () => {
  const selectMultiGames = useSelector(selectMultipleGames);

  const games = useSelector(gamesSelector);
  const dispatch = useDispatch();

  const isChecked = games.length > 0 && selectMultiGames.length === games.length;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gtag("event", "checkboxSelection", {
      all_games_selected: true,
    });
    /** selektiraj sve igre na klik */
    dispatch(
      selectAll({
        games: games,
      }),
    );
    /** ako je checkbox već checkiran, onda deselektiraj sve igre */
    if (isChecked) {
      dispatch(deselectAll());
    }
  };

  return (
    <div className="display-information">
      <div className="display-information__providers">
        <input
          key={Math.random()}
          className={`checkbox__input`}
          id={"checkbox-select-all"}
          type="checkbox"
          checked={isChecked}
          onClick={onClick}
          readOnly
        />
        <h3>Providers</h3>
      </div>
      <div className="display-information__right">
        <h3>Game Name</h3>
      </div>
    </div>
  );
};

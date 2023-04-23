import { Game } from "../types";

/** vraća array game ID-ova od selektiranih igara */
export const selectMultipleGamesFn = (games: Game[], selectedGameIds: string[], lastSelectedGameId: string) => {
  const firstGameSelected = games.find((game) => game.gameID === parseInt(selectedGameIds[0])) as Game;
  const lastGameSelected = games.find((game) => game.gameID === parseInt(lastSelectedGameId)) as Game;
  const firstGameIndex = games.indexOf(firstGameSelected);
  const lastGameIndex = games.indexOf(lastGameSelected);
  if (firstGameIndex > lastGameIndex) {
    /** ako se selektira prema gore, koristim kopiju arraya jer reverse mutatea originalni array */
    const sliced = games.slice(lastGameIndex, firstGameIndex + 1).reverse() as Game[];
    return sliced.flatMap((game) => game.gameID.toString());
  } else {
    /** ako se selektira prema dolje */
    const sliced = games.slice(firstGameIndex, lastGameIndex + 1) as Game[];
    return sliced.flatMap((game) => game.gameID.toString());
  }
};

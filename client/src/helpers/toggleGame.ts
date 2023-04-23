import { Game } from "../types";

/** vraća trenutno kliknutu igru, array iznad te igre, array ispod te igre */
export const toggleGameFn = (games: Game[], targetGameID: number) => {
  const targetGameIndex = games.findIndex((game) => game.gameID === targetGameID);
  if (targetGameIndex === -1) {
    return games;
  }
  const gamesAboveTargetGame = games.slice(0, targetGameIndex);
  const gamesBelowTargetGame = games.slice(targetGameIndex + 1);

  const toggledTargetGame = {
    ...games[targetGameIndex],
    gameEnabled: games[targetGameIndex].gameEnabled === 1 ? 0 : 1,
  };

  return [...gamesAboveTargetGame, toggledTargetGame, ...gamesBelowTargetGame];
};

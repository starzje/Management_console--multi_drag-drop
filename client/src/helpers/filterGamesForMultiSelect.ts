import { Game } from "../types";

/** filtriramo igre da bi izdvojili u poseban array one koje su selektirane i one koje nisu selektirane  */
export const filterGames = (games: Game[], selectedGameIds: string[]) => {
  const { selectedGames, unselectedGames } = games.reduce(
    (acc, oneGame) => {
      const gameIsSelected = selectedGameIds.includes(oneGame.gameID.toString());
      return {
        selectedGames: gameIsSelected ? [...acc.selectedGames, oneGame] : acc.selectedGames,
        unselectedGames: gameIsSelected ? acc.unselectedGames : [...acc.unselectedGames, oneGame],
      };
    },
    { selectedGames: [], unselectedGames: [] } as { selectedGames: Game[]; unselectedGames: Game[] },
  );

  return { selectedGames, unselectedGames };
};

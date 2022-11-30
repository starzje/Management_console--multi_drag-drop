import { Game } from "../types/gameData";

/** filtriramo igre da bi izdvojili u poseban array one koje su selektirane i one koje nisu selektirane  */
export const filterGames = (games: Game[],  selectedGameIds: string[]) => {
    const { selectedGames, unselectedGames } = games.reduce(
        (acc, oneGame) => {
            const gameIsSelected = selectedGameIds.some(gameID => (oneGame.gameID).toString() === gameID);
            if(gameIsSelected) {
                // vrati novu vrijednost acc-a
                return({
                    selectedGames: [...acc.selectedGames, oneGame],
                    unselectedGames: acc.unselectedGames,
                })
            } else {
                // vrati novu vrijednost acc-a
                return({
                    selectedGames: acc.selectedGames,
                    unselectedGames: [...acc.unselectedGames, oneGame],
                })
            }
        },

        // inicijalna vrijednost acc
        { selectedGames: [], unselectedGames: [] } as { selectedGames: Game[], unselectedGames: Game[] }
    );

    return { selectedGames, unselectedGames }
}
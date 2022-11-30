import { Game } from "../types/gameData";

/** vraća trenutno kliknutu igru, array iznad te igre, array ispod te igre */
export const toggleGameFn = (games:Game[],  targetGameID: number) => {
    const kopijaArraya = [...games];
    const kopijaArraya2 = [...games];
    const targetGame = games.find((id) => id.gameID === targetGameID) as Game;
    const targetGameIndex = games.indexOf(targetGame, undefined);
    const gamesAboveTargetGame = kopijaArraya.splice(0, targetGameIndex) as Game[];
    const gamesBelowTargetGame = kopijaArraya2.splice(targetGameIndex + 1, kopijaArraya.length) as Game[];
    // return { gamesAboveTargetGame, gamesBelowTargetGame, targetGame }
    const gamesWithToggledGame = [...gamesAboveTargetGame,
      {
          ...targetGame,
          gameEnabled: targetGame.gameEnabled === 1 ? 0 : 1,
      },
      ...gamesBelowTargetGame]

      return gamesWithToggledGame as Game[]
  }


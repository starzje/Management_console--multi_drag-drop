import { Game } from "../types";

export const concatGamesForSQLProcedure = (eIgre: Game[], liveCasino: Game[]) => {
  const games = [...eIgre, ...liveCasino];
  const GamesXML = games.map((game: Game, index) => {
    const thumbAttribute = game.thumb ? `thumb="${game.thumb}"` : "";
    return `<Game gameID="${game.gameID}" gameEnabled="${game.gameEnabled}" lobbySortOrder="${index}" ${thumbAttribute} />`;
  });
  const gamesXmlString = `<GameList>${GamesXML.join("")}</GameList>`;
  return { gamesXmlString };
};

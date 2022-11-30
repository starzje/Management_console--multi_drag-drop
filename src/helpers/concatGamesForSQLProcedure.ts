import { Game } from "../types/gameData";

export const concatGamesForSQLProcedure = (eIgre:Game[], liveCasino:Game[]) => {
    const games = eIgre.concat(liveCasino);
    const GamesXML = games.map((game: Game, index) => {
      return `<Game gameID="${game.gameID}" gameEnabled="${game.gameEnabled}" lobbySortOrder="${index}" />`;
    });
    const gamesXmlString = "<GameList>" + GamesXML.join("") + "</GameList>";
    return {gamesXmlString}
}
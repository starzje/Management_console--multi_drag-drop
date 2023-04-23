import { mockGamesCasino, mockGamesEIgre } from "../../__mocks__/mockGameData";
import { Game } from "../../types";
import { concatGamesForSQLProcedure } from "../concatGamesForSQLProcedure";

describe("concatGamesForSQLProcedure", () => {
  it("should correctly concatenate and format eIgre and liveCasino games", () => {
    const eIgre: Game[] = mockGamesEIgre;

    const liveCasino: Game[] = mockGamesCasino;

    const expectedXmlString =
      '<GameList><Game gameID="1" gameEnabled="1" lobbySortOrder="0" thumb="test-thumb" /><Game gameID="2" gameEnabled="0" lobbySortOrder="1"  /><Game gameID="3" gameEnabled="1" lobbySortOrder="2"  /><Game gameID="4" gameEnabled="0" lobbySortOrder="3"  /><Game gameID="5" gameEnabled="1" lobbySortOrder="4"  /><Game gameID="6" gameEnabled="0" lobbySortOrder="5"  /><Game gameID="7" gameEnabled="1" lobbySortOrder="6"  /><Game gameID="8" gameEnabled="0" lobbySortOrder="7"  /></GameList>';
    const result = concatGamesForSQLProcedure(eIgre, liveCasino);
    expect(result.gamesXmlString).toEqual(expectedXmlString);
  });
});

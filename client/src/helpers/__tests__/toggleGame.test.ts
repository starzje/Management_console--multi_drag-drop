import { mockGamesEIgre } from "../../__mocks__/mockGameData";
import { toggleGameFn } from "../toggleGame";

describe("toggleGameFn", () => {
  it("should toggle gameEnabled for the target game", () => {
    const targetGameID = mockGamesEIgre[0].gameID;
    const expectedToggledGame = { ...mockGamesEIgre[0], gameEnabled: 0 };

    const toggledGames = toggleGameFn(mockGamesEIgre, targetGameID);

    expect(toggledGames[0]).toEqual(expectedToggledGame);
  });

  it("should not modify other games", () => {
    const targetGameID = mockGamesEIgre[0].gameID;
    const toggledGames = toggleGameFn(mockGamesEIgre, targetGameID);

    expect(toggledGames.slice(1)).toEqual(mockGamesEIgre.slice(1));
  });

  it("should return the original games array if the target game is not found", () => {
    const nonExistentGameID = -1;
    const toggledGames = toggleGameFn(mockGamesEIgre, nonExistentGameID);

    expect(toggledGames).toEqual(mockGamesEIgre);
  });
});

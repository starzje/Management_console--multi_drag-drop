import { mockGamesEIgre } from "../../__mocks__/mockGameData";
import { splitArray } from "../splitArrayIntoTwo";

describe("splitArray", () => {
  it("should split games array into games above and below drop target", () => {
    const selectedGames = [mockGamesEIgre[0], mockGamesEIgre[2]];
    const unselectedGames = [mockGamesEIgre[1], mockGamesEIgre[3]];

    const endIndex = 2;
    const startIndex = 0;

    const reorderedGames = splitArray(selectedGames, unselectedGames, endIndex, startIndex);

    expect(reorderedGames).toEqual([mockGamesEIgre[1], mockGamesEIgre[0], mockGamesEIgre[2], mockGamesEIgre[3]]);
  });

  it("should handle dragging selected games below unselected games", () => {
    const selectedGames = [mockGamesEIgre[0], mockGamesEIgre[1]];
    const unselectedGames = [mockGamesEIgre[2], mockGamesEIgre[3]];

    const endIndex = 3;
    const startIndex = 0;

    const reorderedGames = splitArray(selectedGames, unselectedGames, endIndex, startIndex);

    expect(reorderedGames).toEqual([mockGamesEIgre[2], mockGamesEIgre[3], mockGamesEIgre[0], mockGamesEIgre[1]]);
  });

  it("should handle dragging selected games above unselected games", () => {
    const selectedGames = [mockGamesEIgre[2], mockGamesEIgre[3]];
    const unselectedGames = [mockGamesEIgre[0], mockGamesEIgre[1]];

    const endIndex = 0;
    const startIndex = 2;

    const reorderedGames = splitArray(selectedGames, unselectedGames, endIndex, startIndex);

    expect(reorderedGames).toEqual([mockGamesEIgre[2], mockGamesEIgre[3], mockGamesEIgre[0], mockGamesEIgre[1]]);
  });
});

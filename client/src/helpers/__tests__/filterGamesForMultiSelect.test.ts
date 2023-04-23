import { mockGamesEIgre, mockGamesCasino } from "../../__mocks__/mockGameData";
import { Game } from "../../types";
import { filterGames } from "../filterGamesForMultiSelect";

describe("filterGames", () => {
  it("should correctly filter selected and unselected games", () => {
    const games: Game[] = [...mockGamesEIgre, ...mockGamesCasino];
    const selectedGameIds = ["1", "3", "6", "8"];

    const { selectedGames, unselectedGames } = filterGames(games, selectedGameIds);

    const expectedSelectedGames: Game[] = [
      mockGamesEIgre[0],
      mockGamesEIgre[2],
      mockGamesCasino[1],
      mockGamesCasino[3],
    ];

    const expectedUnselectedGames: Game[] = [
      mockGamesEIgre[1],
      mockGamesEIgre[3],
      mockGamesCasino[0],
      mockGamesCasino[2],
    ];

    expect(selectedGames).toEqual(expectedSelectedGames);
    expect(unselectedGames).toEqual(expectedUnselectedGames);
  });
});

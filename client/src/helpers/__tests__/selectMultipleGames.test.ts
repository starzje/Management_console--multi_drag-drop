import { mockGamesEIgre, mockGamesCasino } from "../../__mocks__/mockGameData";
import { Game } from "../../types";
import { selectMultipleGamesFn } from "../selectMultipleGames";

describe("selectMultipleGamesFn", () => {
  it("should return an empty array when no games are provided", () => {
    const games: Game[] = [];
    const selectedGameIds: string[] = [];
    const lastSelectedGameId = "1";

    const result = selectMultipleGamesFn(games, selectedGameIds, lastSelectedGameId);
    expect(result).toEqual([]);
  });

  it("should return an empty array when no game IDs are selected", () => {
    const games: Game[] = [...mockGamesEIgre, ...mockGamesCasino];
    const selectedGameIds: string[] = [];
    const lastSelectedGameId = "1";

    const result = selectMultipleGamesFn(games, selectedGameIds, lastSelectedGameId);
    expect(result).toEqual([]);
  });

  it("should return an array with a single game ID when only one game ID is selected", () => {
    const games: Game[] = [...mockGamesEIgre, ...mockGamesCasino];
    const selectedGameIds = ["1"];
    const lastSelectedGameId = "1";

    const result = selectMultipleGamesFn(games, selectedGameIds, lastSelectedGameId);
    expect(result).toEqual(["1"]);
  });

  it("should return an array of game IDs for selected games when selecting from top to bottom", () => {
    const games: Game[] = [...mockGamesEIgre, ...mockGamesCasino];
    const selectedGameIds = ["1"];
    const lastSelectedGameId = "4";

    const result = selectMultipleGamesFn(games, selectedGameIds, lastSelectedGameId);
    expect(result).toEqual(["1", "2", "3", "4"]);
  });

  it("should return an array of game IDs for selected games when selecting from bottom to top", () => {
    const games: Game[] = [...mockGamesEIgre, ...mockGamesCasino];
    const selectedGameIds = ["4"];
    const lastSelectedGameId = "1";

    const result = selectMultipleGamesFn(games, selectedGameIds, lastSelectedGameId);
    expect(result).toEqual(["4", "3", "2", "1"]);
  });
});

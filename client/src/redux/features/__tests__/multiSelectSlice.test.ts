import { Store } from "@reduxjs/toolkit";
import store, { RootState } from "../../store";
import multiSelectSliceReducer, {
  selectAll,
  deselectAll,
  toggleSelection,
  toggleSelectionInGroup,
  toggleMultiSelectionInGroup,
  selectMultipleGames,
} from "../multiSelectSlice";
import { mockGamesEIgre as games } from "../../../__mocks__/mockGameData";

describe("multiSelectSlice reducers", () => {
  it("should select all games when selectAll is called", () => {
    const newState = multiSelectSliceReducer([], selectAll({ games }));
    expect(newState.length).toEqual(games.length);
    expect(newState).toEqual(games.map((game) => game.gameID.toString()));
  });

  it("should deselect all games when deselectAll is called", () => {
    const newState = multiSelectSliceReducer([], deselectAll());
    expect(newState).toEqual([]);
  });

  it("should toggle selection when toggleSelection is called", () => {
    const gameId = games[0].gameID.toString();
    const newState = multiSelectSliceReducer([], toggleSelection({ gameId }));
    expect(newState).toEqual([gameId]);
  });

  it("should toggle selection in group when toggleSelectionInGroup is called", () => {
    const gameId = games[0].gameID.toString();
    const newState = multiSelectSliceReducer([], toggleSelectionInGroup({ gameId }));
    expect(newState).toEqual([gameId]);
  });

  it("should toggle multi selection in group when toggleMultiSelectionInGroup is called", () => {
    const gameId1 = games[0].gameID.toString();
    const gameId2 = games[1].gameID.toString();
    const newState = multiSelectSliceReducer([gameId1], toggleMultiSelectionInGroup({ games, gameId: gameId2 }));
    expect(newState).toEqual([gameId1, gameId2]);
  });
});

describe("multiSelectSlice selectors", () => {
  const testStore = store as Store<RootState>;

  it("should return the value of selected games", () => {
    const gameIds = games.map((game) => game.gameID.toString());
    testStore.dispatch(selectAll({ games }));
    const result = selectMultipleGames(testStore.getState());
    expect(result).toEqual(gameIds);
  });
});

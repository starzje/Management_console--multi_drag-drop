import { RootState } from "../../store";
import { configureStore } from "@reduxjs/toolkit";
import gameSlice, {
  eIgreGamesSelector,
  gamesSelector,
  initialLoadingSelector,
  liveCasinoGamesSelector,
  reorderGameList,
  reorderMultipleGames,
  selectGameById,
  selectGameImage,
  toggleGame,
  updateGameImage,
} from "../gameSlice";
import gameTypeSlice from "../gameTypeSlice";
import { LobbyType } from "../../../types";
import { mockGamesCasino, mockGamesEIgre } from "../../../__mocks__/mockGameData";

// Declare a variable to hold the test store instance.
let store: ReturnType<typeof configureStore>;

beforeEach(() => {
  store = configureStore({
    reducer: { gameSlice, gameTypeSlice },
    preloadedState: {
      gameSlice: { igre: mockGamesEIgre, casino: mockGamesCasino },
      gameTypeSlice: { lobby: LobbyType.eIgre },
    },
  });
});

describe("gameSlice reducers", () => {
  it("should toggle gameEnabled property", () => {
    store.dispatch(toggleGame({ targetGameID: 1, lobbyType: LobbyType.eIgre, games: mockGamesEIgre }));
    expect((store.getState() as RootState).gameSlice.igre[0].gameEnabled).toBe(0);
    store.dispatch(toggleGame({ targetGameID: 1, lobbyType: LobbyType.eIgre, games: mockGamesEIgre }));
    expect((store.getState() as RootState).gameSlice.igre[0].gameEnabled).toBe(1);
  });

  it("should move the game with ID 1 from index 0 to index 1", () => {
    store.dispatch(
      reorderGameList({
        game: mockGamesEIgre,
        endIndex: 1,
        startIndex: 0,
        dragTargetID: 1,
        lobbyType: LobbyType.eIgre,
      }),
    );
    expect((store.getState() as RootState).gameSlice.igre[0].gameID).toBe(2);
    expect((store.getState() as RootState).gameSlice.igre[1].gameID).toBe(1);
  });

  it("should move selected games (IDs 1 and 2) to the specified index (4) in the array", () => {
    const selectedGameIds = ["1", "2"];
    const endIndex = 4;
    const startIndex = 1;
    const lobbyType = LobbyType.eIgre;
    store.dispatch(
      reorderMultipleGames({
        selectedGameIds,
        endIndex,
        startIndex,
        lobbyType,
        games: mockGamesEIgre,
      }),
    );
    const stateGames = (store.getState() as RootState).gameSlice.igre;
    const selectedGames = mockGamesEIgre.filter((game) => selectedGameIds.includes(game.gameID.toString()));
    const unselectedGames = mockGamesEIgre.filter((game) => !selectedGameIds.includes(game.gameID.toString()));
    const expectedOrder = [...unselectedGames.slice(0, endIndex), ...selectedGames, ...unselectedGames.slice(endIndex)];

    expect(stateGames).toEqual(expectedOrder);
  });

  it("should update thumb property with new imageURL", () => {
    store.dispatch(updateGameImage({ gameID: 1, imageURL: "newThumb1" }));
    expect((store.getState() as RootState).gameSlice.igre[0].thumb).toBe("newThumb1");
  });
});

describe("gameSlice selectors", () => {
  it("should return eIgre games when using eIgreGamesSelector", () => {
    const eIgreGames = eIgreGamesSelector(store.getState() as RootState);
    expect(eIgreGames).toEqual(mockGamesEIgre);
  });

  it("should return live casino games when using liveCasinoGamesSelector", () => {
    const liveCasinoGames = liveCasinoGamesSelector(store.getState() as RootState);
    expect(liveCasinoGames).toEqual(mockGamesCasino);
  });

  it("should return the game with the specified ID when using selectGameById", () => {
    const game = selectGameById(store.getState() as RootState, 1);
    expect(game).toEqual(mockGamesEIgre[0]);
  });

  it("should return the image URL of the specified game when using selectGameImage", () => {
    const imageURL = selectGameImage(store.getState() as RootState, 1, LobbyType.eIgre);
    expect(imageURL).toEqual(mockGamesEIgre[0].thumb);
  });

  it("should return games based on lobbyType when using gamesSelector", () => {
    const eIgreGames = gamesSelector(store.getState() as RootState);
    expect(eIgreGames).toEqual(mockGamesEIgre);
  });

  it("should return a boolean indicating if initial loading is successful when using initialLoadingSelector", () => {
    const initialLoadingSuccess = initialLoadingSelector(store.getState() as RootState);
    expect(initialLoadingSuccess).toBe(true);
  });
});

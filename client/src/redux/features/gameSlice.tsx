import { createSelector, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { filterGames, splitArray, toggleGameFn } from "../../helpers";
import { Game, LobbyType } from "../../types";
import { RootState } from "../store";
import { discardChangesThunk, fetchGamesThunk } from "../thunks";

const initialState = {
  igre: [] as Game[],
  casino: [] as Game[],
};

const gameSlice = createSlice({
  name: "games",
  initialState: initialState,
  reducers: {
    toggleGame: (state, action: PayloadAction<{ targetGameID: number; lobbyType: LobbyType; games: Game[] }>) => {
      const { targetGameID, lobbyType } = action.payload;
      const currentGames = lobbyType === LobbyType.liveCasino ? state.casino : state.igre;

      const gamesWithToggledGame = toggleGameFn(currentGames, targetGameID);

      if (lobbyType === LobbyType.liveCasino) {
        state.casino = gamesWithToggledGame;
      } else {
        state.igre = gamesWithToggledGame;
      }
    },
    reorderGameList: (
      state,
      action: PayloadAction<{
        game: Game[];
        endIndex: number;
        startIndex: number;
        dragTargetID: number;
        lobbyType: LobbyType;
      }>,
    ) => {
      const {
        payload: { endIndex, startIndex, game, lobbyType },
      } = action;
      const gamesCopy = [...game] as Game[];
      const [removed] = gamesCopy.splice(startIndex, 1);
      gamesCopy.splice(endIndex, 0, removed);

      if (lobbyType === LobbyType.eIgre) {
        return {
          igre: [...gamesCopy],
          casino: [...state.casino],
        };
      } else {
        return {
          igre: [...state.igre],
          casino: [...gamesCopy],
        };
      }
    },
    reorderMultipleGames: (
      state,
      action: PayloadAction<{
        games: Game[];
        selectedGameIds: string[];
        endIndex: number;
        startIndex: number;
        lobbyType: LobbyType;
      }>,
    ) => {
      const {
        payload: { endIndex, startIndex, games, selectedGameIds, lobbyType },
      } = action;
      /**vraća array za selektirane igre i za ne selektirane igre */
      const { selectedGames, unselectedGames } = filterGames(games, selectedGameIds);
      /** vraća 2 arraya, prvi koji počinje iznad drag drop targeta, i drugi koji počinje ispod drag drop targeta */
      const reorderedGames = splitArray(selectedGames, unselectedGames, endIndex, startIndex);

      if (lobbyType === LobbyType.eIgre) {
        return {
          igre: [...reorderedGames],
          casino: [...state.casino],
        };
      } else {
        return {
          igre: [...state.igre],
          casino: [...reorderedGames],
        };
      }
    },
    updateGameImage: (state, action) => {
      const { gameID, imageURL } = action.payload;

      // Find the game and casino index with the provided gameID
      const gameIndex = state.igre.findIndex((game) => game.gameID === gameID);
      const casinoIndex = state.casino.findIndex((casino) => casino.gameID === gameID);

      if (gameIndex !== -1) {
        state.igre[gameIndex].thumb = imageURL;
      }

      if (casinoIndex !== -1) {
        state.casino[casinoIndex].thumb = imageURL;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(fetchGamesThunk.fulfilled, discardChangesThunk.fulfilled), (state, action) => {
      const games: Game[] = action.payload;
      /**sortira live casino igre po lobby sort orderu */
      const liveCasino = games.filter((game: Game) => game.lobbyType === LobbyType.liveCasino);
      const sortedliveCasino = liveCasino.sort(({ lobbySortOrder: a }, { lobbySortOrder: b }) => {
        return a > b ? 1 : a === b ? 0 : -1;
      });
      /**sortira e-igre po lobby sort orderu */
      const eIgre = games.filter((game: Game) => game.lobbyType === LobbyType.eIgre);
      const sortedEigre = eIgre.sort(({ lobbySortOrder: a }, { lobbySortOrder: b }) => {
        return a > b ? 1 : a === b ? 0 : -1;
      });
      return { igre: sortedEigre, casino: sortedliveCasino };
    });
  },
});

export const { toggleGame, reorderGameList, reorderMultipleGames, updateGameImage } = gameSlice.actions;
export default gameSlice.reducer;
export const eIgreGamesSelector = (state: RootState) => state.gameSlice.igre;
export const liveCasinoGamesSelector = (state: RootState) => state.gameSlice.casino;

export const selectGameById = (state: RootState, gameId: number) => {
  const game = state.gameSlice.igre.find((game) => game.gameID === gameId);
  if (game) {
    return game;
  }
  return state.gameSlice.casino.find((game) => game.gameID === gameId);
};

export const selectGameImage = (state: RootState, gameID: number, lobbyType: LobbyType): string | null => {
  const gameList = lobbyType === LobbyType.eIgre ? state.gameSlice.igre : state.gameSlice.casino;
  const game = gameList.find((game) => game.gameID === gameID);
  return game ? game.thumb ?? null : null;
};

//** selektiraj trenutno odabrani tip igre preko LobbyType-a */
export const gamesSelector = createSelector(
  (state: RootState) => state.gameTypeSlice.lobby,
  eIgreGamesSelector,
  liveCasinoGamesSelector,
  (lobbyType, eIgre, liveCasino) => {
    return (lobbyType === "e-igre" ? eIgre : liveCasino) as Game[];
  },
);

/** vraća boolean ovisno o tom je li initial loadnig uspješan */
export const initialLoadingSelector = createSelector(
  (state: RootState) => state.gameSlice.casino,
  eIgreGamesSelector,
  (casino, eIgre) => {
    return casino.length > 0 || eIgre.length > 0;
  },
);

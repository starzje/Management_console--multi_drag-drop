import { createSelector, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { filterGames } from "../../helpers/filterGamesForMultiSelect";
import { splitArray } from "../../helpers/splitArrayIntoTwo";
import { toggleGameFn } from "../../helpers/toggleGame";
import { Game, LobbyType } from "../../types/gameData";
import { RootState } from "../store";
import { discardChangesThunk } from "../thunks/discardGamesThunk";
import { fetchGamesThunk } from "../thunks/fetchGamesThunk";


const initialState = {
    igre: [] as Game[],
    casino: [] as Game[],
}

const gameSlice = createSlice({
    name: "games",
    initialState: initialState,
    reducers: {
        toggleGame: (state, action: PayloadAction<{ targetGameID: number, lobbyType: LobbyType, games: Game[] }>) => {
            const { targetGameID, lobbyType, games } = action.payload;
            /** vraća trenutno kliknutu igru, array igara koje su iznad te igre, array igara koje su ispod te igre */
            const gamesWithToggledGame = toggleGameFn(games, targetGameID)

            if (lobbyType === LobbyType.liveCasino) {
                return {
                    igre: [...state.igre],
                    casino: [...gamesWithToggledGame]
                }
            } else {
                return {
                    igre: [...gamesWithToggledGame],
                    casino: [...state.casino]
                }
            }
        },
        reorderGameList: (
            state,
            action: PayloadAction<{
                game: Game[],
                endIndex: number;
                startIndex: number;
                dragTargetID: number;
                lobbyType: LobbyType;
            }>
        ) => {
            const { payload: { endIndex, startIndex, game, lobbyType }, } = action;
            const gamesCopy = [...game] as Game[];
            const [removed] = gamesCopy.splice(startIndex, 1); gamesCopy.splice(endIndex, 0, removed);

            if (lobbyType === LobbyType.eIgre) {
                return {
                    igre: [...gamesCopy],
                    casino: [...state.casino]
                }
            } else {
                return {
                    igre: [...state.igre],
                    casino: [...gamesCopy]
                }
            }
        },
        reorderMultipleGames: (
            state,
            action: PayloadAction<{
                games: Game[],
                selectedGameIds: string[],
                endIndex: number,
                startIndex: number,
                lobbyType: LobbyType,
            }>
        ) => {

            const { payload: { endIndex, startIndex, games, selectedGameIds, lobbyType }, } = action;
            /**vraća array za selektirane igre i za ne selektirane igre */
            const { selectedGames, unselectedGames } = filterGames(games, selectedGameIds)
            /** vraća 2 arraya, prvi koji počinje iznad drag drop targeta, i drugi koji počinje ispod drag drop targeta */
            const reorderedGames = splitArray(selectedGames, unselectedGames, endIndex, startIndex)

            if (lobbyType === LobbyType.eIgre) {
                return {
                    igre: [...reorderedGames],
                    casino: [...state.casino]
                }
            } else {
                return {
                    igre: [...state.igre],
                    casino: [...reorderedGames]
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isAnyOf(fetchGamesThunk.fulfilled, discardChangesThunk.fulfilled), (state, action) => {
                const games: Game[] = action.payload
                /**sortira live casino igre po lobby sort orderu */
                const liveCasino = games.filter((game: Game) => game.lobbyType === LobbyType.liveCasino)
                const sortedliveCasino = liveCasino.sort(({ lobbySortOrder: a }, { lobbySortOrder: b }) => {
                    return a > b ? 1 : a === b ? 0 : -1
                });
                /**sortira e-igre po lobby sort orderu */
                const eIgre = games.filter((game: Game) => game.lobbyType === LobbyType.eIgre)
                const sortedEigre = eIgre.sort(({ lobbySortOrder: a }, { lobbySortOrder: b }) => {
                    return a > b ? 1 : a === b ? 0 : -1
                }
                );
                return { igre: sortedEigre, casino: sortedliveCasino };
            })
    }


});


export const { toggleGame, reorderGameList, reorderMultipleGames } = gameSlice.actions;
export default gameSlice.reducer;
export const eIgreGamesSelector = (state: RootState) => state.gameSlice.igre;
export const liveCasinoGamesSelector = (state: RootState) => state.gameSlice.casino
//** selektiraj trenutno odabrani tip igre preko LobbyType-a */
export const gamesSelector = createSelector((state: RootState) =>
    state.gameTypeSlice.lobby,
    eIgreGamesSelector,
    liveCasinoGamesSelector,
    (lobbyType, eIgre, liveCasino) => {
        return (lobbyType === "e-igre" ? eIgre : liveCasino) as Game[]
    })


/** vraća boolean ovisno o tom je li initial loadnig uspješan */
export const initialLoadingSelector = createSelector((state: RootState) =>
    state.gameSlice.casino,
    eIgreGamesSelector,
    (casino, eIgre) => {
        return (casino.length > 0 || eIgre.length > 0)
    }
)





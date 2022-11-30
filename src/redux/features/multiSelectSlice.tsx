import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { selectMultipleGamesFn } from "../../helpers/selectMultipleGames";
import { Game } from "../../types/gameData";
import { RootState } from "../store";

const initialState = [] as string[]

const multiSelectSlice = createSlice({
    name: "multiSelectSlice",
    initialState: initialState,
    reducers: {
        selectAll: (state, action: PayloadAction<{ games: Game[] }>) => {
            const { games } = action.payload;
            const allSelected = [games?.map((id) => id.gameID)].toString().split(',')
            return [...allSelected]
        },
        deselectAll: () => {
            return initialState
        },
        toggleSelection: (state, action: PayloadAction<{ gameId: string }>) => {
            const { gameId } = action.payload;
            const wasSelected = state.includes(gameId);
            const newGameIds = (() => {
                if (!wasSelected) {
                    return [gameId];
                }
                if (state.length > 1) {
                    return [gameId];
                }
                return [];
            })();
            return [...newGameIds];
        },
        toggleSelectionInGroup: (state, action: PayloadAction<{ gameId: string }>) => {
            /** multi selektiranje s CTRL tipkom */
            const { gameId } = action.payload;
            const index = state.indexOf(gameId);
            if (index === -1) {
                return ([...state, gameId]);
            }
            const shallow = [...state];
            shallow.splice(index, 1);
            return [...shallow];
        },
        toggleMultiSelectionInGroup: (state, action: PayloadAction<{ games: Game[], gameId: string }>) => {
            /** multi selektiranje sa SHIFT tipkom */
            const { gameId, games } = action.payload;
            /** vraća array game ID-ova od selektiranih igara */
            const arrayOfSelectedGameIds = selectMultipleGamesFn(games, state, gameId)
            return [...arrayOfSelectedGameIds]
        },
    },
}
);

export const { deselectAll, toggleSelection, toggleSelectionInGroup, toggleMultiSelectionInGroup, selectAll } = multiSelectSlice.actions;
export default multiSelectSlice.reducer;
export const selectMultipleGames = (state: RootState) => state.multiSelectSlice
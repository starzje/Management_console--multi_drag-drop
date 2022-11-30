import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { discardChangesThunk } from "../thunks/discardGamesThunk";
import { fetchGamesThunk } from "../thunks/fetchGamesThunk";
import { saveGamesThunk } from "../thunks/saveGamesThunk";


const initialState = {
    didSomethingChange: false,
}

const appStateSlice = createSlice({
    name: "appStateSlice",
    initialState: initialState,
    reducers: {
        somethingChanged: (state) => {
            state.didSomethingChange = true
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isAnyOf(saveGamesThunk.fulfilled, discardChangesThunk.fulfilled, fetchGamesThunk.fulfilled), (state) => {
                state.didSomethingChange = false
            })
    }
}
);

export const { somethingChanged } = appStateSlice.actions;
export default appStateSlice.reducer;
export const didSomethingChangeSelector = (state: RootState) => state.appStateSlice.didSomethingChange





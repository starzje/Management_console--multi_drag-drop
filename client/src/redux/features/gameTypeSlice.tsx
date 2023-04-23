import { createSlice } from "@reduxjs/toolkit";
import { LobbyType } from "../../types";
import { RootState } from "../store";

const initialState = {
  lobby: LobbyType.liveCasino,
};

const gameTypeSlice = createSlice({
  name: "gameTypeSlice",
  initialState: initialState,
  reducers: {
    changeLobbyType: (state) => {
      state.lobby === LobbyType.eIgre ? (state.lobby = LobbyType.liveCasino) : (state.lobby = LobbyType.eIgre);
    },
  },
});

export const { changeLobbyType } = gameTypeSlice.actions;
export default gameTypeSlice.reducer;
export const lobbyTypeSelector = (state: RootState) => state.gameTypeSlice.lobby;

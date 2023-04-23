import { createAsyncThunk } from "@reduxjs/toolkit";
import { Game, ThunkArgs, ThunkConfig } from "../../types";
import { fetchGamesPayloadCreator } from "./fetchGamesPayloadCreatorThunk";

export const fetchGamesThunk = createAsyncThunk<Array<Game>, ThunkArgs, ThunkConfig>(
  "fetchGames",
  fetchGamesPayloadCreator,
);

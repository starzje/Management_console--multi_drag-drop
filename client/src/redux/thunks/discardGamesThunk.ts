import { createAsyncThunk } from "@reduxjs/toolkit";
import { Game, ThunkArgs, ThunkConfig } from "../../types";
import { fetchGamesPayloadCreator } from "./fetchGamesPayloadCreatorThunk";

export const discardChangesThunk = createAsyncThunk<Array<Game>, ThunkArgs, ThunkConfig>(
  "discardChanges",
  fetchGamesPayloadCreator,
);

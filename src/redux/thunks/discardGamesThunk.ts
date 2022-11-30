import { createAsyncThunk } from "@reduxjs/toolkit";
import { Game } from "../../types/gameData";
import {  ThunkArgs, ThunkConfig } from "../../types/thunkTypes";
import { fetchGamesPayloadCreator } from "./fetchGamesPayloadCreatorThunk";

export const discardChangesThunk = createAsyncThunk<Array<Game>,ThunkArgs,ThunkConfig>("discardChanges", fetchGamesPayloadCreator);

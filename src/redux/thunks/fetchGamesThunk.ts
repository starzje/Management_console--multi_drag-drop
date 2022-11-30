import { createAsyncThunk } from "@reduxjs/toolkit";
import { Game } from "../../types/gameData";
import {  ThunkArgs, ThunkConfig } from "../../types/thunkTypes";
import { fetchGamesPayloadCreator } from "./fetchGamesPayloadCreatorThunk";

export const fetchGamesThunk = createAsyncThunk<Array<Game>,ThunkArgs,ThunkConfig>("fetchGames", fetchGamesPayloadCreator);
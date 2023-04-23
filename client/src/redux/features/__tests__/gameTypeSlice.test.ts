import { Store } from "@reduxjs/toolkit";
import store, { RootState } from "../../store";
import gameTypeSliceReducer, { changeLobbyType, lobbyTypeSelector } from "../gameTypeSlice";
import { LobbyType } from "../../../types";

describe("gameTypeSlice reducers", () => {
  it("should change lobby type when changeLobbyType is called", () => {
    const newState = gameTypeSliceReducer({ lobby: LobbyType.liveCasino }, changeLobbyType());
    expect(newState.lobby).toEqual(LobbyType.eIgre);

    const newState2 = gameTypeSliceReducer({ lobby: LobbyType.eIgre }, changeLobbyType());
    expect(newState2.lobby).toEqual(LobbyType.liveCasino);
  });
});

describe("gameTypeSlice selectors", () => {
  const testStore = store as Store<RootState>;

  it("should return the value of lobby type", () => {
    testStore.dispatch(changeLobbyType());
    const result = lobbyTypeSelector(testStore.getState());
    expect(result).toEqual(LobbyType.eIgre);

    testStore.dispatch(changeLobbyType());
    const result2 = lobbyTypeSelector(testStore.getState());
    expect(result2).toEqual(LobbyType.liveCasino);
  });
});

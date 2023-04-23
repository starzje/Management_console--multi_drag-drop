import { Store } from "@reduxjs/toolkit";
import store, { RootState } from "../../store";
import appStateSliceReducer, { somethingChanged, didSomethingChangeSelector } from "../appStateSlice";

describe("appStateSlice reducers", () => {
  it("should set didSomethingChange to true when somethingChanged is called", () => {
    const newState = appStateSliceReducer({ didSomethingChange: false }, somethingChanged());
    expect(newState.didSomethingChange).toEqual(true);
  });
});

describe("appStateSlice selectors", () => {
  it("should return the value of didSomethingChange", () => {
    const testStore = store as Store<RootState>;

    const initialState = didSomethingChangeSelector(testStore.getState());

    expect(initialState).toEqual(false);
    // Set the value of didSomethingChange to true
    testStore.dispatch(somethingChanged());

    // Retrieve the value of didSomethingChange using the selector
    const result = didSomethingChangeSelector(testStore.getState());

    expect(result).toEqual(true);
  });
});

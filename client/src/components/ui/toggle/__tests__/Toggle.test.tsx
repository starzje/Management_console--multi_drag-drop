import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { Toggle } from "../Toggle";
import {
  gamesSelector,
  toggleGame,
  didSomethingChangeSelector,
  lobbyTypeSelector,
  somethingChanged,
} from "../../../../redux/features";
import { LobbyType } from "../../../../types";
import { mockGamesEIgre } from "../../../../__mocks__/mockGameData";

jest.mock("react-redux");
jest.mock("../../../../redux/features");

global.gtag = jest.fn();

describe("Toggle", () => {
  const mockDispatch = jest.fn();
  const mockGamesSelector = jest.fn();
  const mockLobbyTypeSelector = jest.fn();
  const mockDidSomethingChangeSelector = jest.fn();
  mockGamesSelector.mockReturnValue(mockGamesEIgre);
  mockLobbyTypeSelector.mockReturnValue(LobbyType.eIgre);

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      if (selectorFn === gamesSelector) {
        return mockGamesSelector();
      } else if (selectorFn === lobbyTypeSelector) {
        return mockLobbyTypeSelector();
      } else if (selectorFn === didSomethingChangeSelector) {
        return mockDidSomethingChangeSelector();
      } else {
        return undefined;
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render with the correct props and dispatch toggleGame action when clicked", () => {
    mockDidSomethingChangeSelector.mockReturnValue(false); // set didSomethingChangeSelector to return false

    const { container } = render(<Toggle id="my-toggle" enabledGame={1} />);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeDefined();
    expect(checkbox.id).toBe("my-toggle");
    expect(checkbox.type).toBe("checkbox");
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);

    expect(mockDispatch).toHaveBeenCalledWith(
      toggleGame({
        games: mockGamesEIgre,
        targetGameID: 1,
        lobbyType: LobbyType.eIgre,
      }),
    );
    expect(mockDispatch).toHaveBeenCalledWith(somethingChanged());
    expect(global.gtag).toHaveBeenCalledWith("event", "game_toggled");
  });

  it("should not dispatch the somethingChanged action if somethingChangedInTheApp is already true", () => {
    mockDidSomethingChangeSelector.mockReturnValue(true);

    const { container } = render(<Toggle id="my-toggle" enabledGame={1} />);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeDefined();
    expect(checkbox.id).toBe("my-toggle");
    expect(checkbox.type).toBe("checkbox");
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);

    expect(mockDispatch).toHaveBeenCalledWith(
      toggleGame({
        games: mockGamesEIgre,
        targetGameID: 1,
        lobbyType: LobbyType.eIgre,
      }),
    );

    expect(mockDispatch).toHaveBeenCalledWith(somethingChanged());
    expect(global.gtag).toHaveBeenCalledWith("event", "game_toggled");
    expect(mockDidSomethingChangeSelector).toHaveBeenCalledTimes(1); // initial render
  });
});

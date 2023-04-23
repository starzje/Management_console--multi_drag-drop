import { renderHook, act } from "@testing-library/react";
import { useClickHandler } from "../useClickHandler";
import { useDispatch, useSelector } from "react-redux";
import { toggleMultiSelectionInGroup, toggleSelectionInGroup } from "../../redux/features";
import { useGameSelection } from "../useGameSelection";
import { wasMultiSelectKeyUsed } from "../../helpers";
import { mockGamesCasino, mockGamesEIgre } from "../../__mocks__/mockGameData";
import { Game } from "../../types";

global.gtag = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn(),
}));

jest.mock("../../redux/features", () => ({
  toggleMultiSelectionInGroup: jest.fn(),
  toggleSelectionInGroup: jest.fn(),
}));

jest.mock("../useGameSelection", () => ({
  useGameSelection: jest.fn(() => ({
    performClickAction: jest.fn(),
  })),
}));

jest.mock("../../helpers", () => ({
  wasMultiSelectKeyUsed: jest.fn(),
}));

describe("useClickHandler", () => {
  let dispatchMock: jest.Mock;
  let gamesMock: Game[];
  let performClickActionMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);
    gamesMock = [...mockGamesEIgre, ...mockGamesCasino];
    (useSelector as jest.Mock).mockReturnValue(gamesMock);
    performClickActionMock = jest.fn();
    (useGameSelection as jest.Mock).mockReturnValue({ performClickAction: performClickActionMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should not perform any action if it was clicked on list-item__toggle element", () => {
    const { result } = renderHook(() => useClickHandler({ forCheckbox: false }));
    const event = new MouseEvent("click", { bubbles: true }) as unknown as React.MouseEvent<Element, MouseEvent>;
    Object.defineProperty(event, "target", {
      writable: true,
      value: { parentElement: { className: "list-item__toggle" } },
    });
    Object.defineProperty(event, "currentTarget", { writable: true, value: { id: "1" } });

    act(() => {
      result.current.handleClick(event);
    });

    expect(performClickActionMock).not.toHaveBeenCalled();
  });

  it("should not perform any action if event default was prevented or button was not a primary button", () => {
    const { result } = renderHook(() => useClickHandler({ forCheckbox: false }));
    const event = new MouseEvent("click", { bubbles: true, button: 1 }) as unknown as React.MouseEvent<
      Element,
      MouseEvent
    >;
    Object.defineProperty(event, "currentTarget", { writable: true, value: { id: "1" } });
    Object.defineProperty(event, "target", { writable: true, value: { parentElement: { className: "" } } });

    act(() => {
      result.current.handleClick(event);
    });

    expect(performClickActionMock).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("should dispatch toggleMultiSelectionInGroup with games and gameId if forCheckbox is set to true and multiSelect key was used", () => {
    const { result } = renderHook(() => useClickHandler({ forCheckbox: true }));
    const event = new MouseEvent("click", { bubbles: true }) as unknown as React.MouseEvent<Element, MouseEvent>;
    Object.defineProperty(event, "currentTarget", { writable: true, value: { id: "1" } });
    Object.defineProperty(event, "target", { writable: true, value: { parentElement: { className: "" } } });

    (wasMultiSelectKeyUsed as jest.Mock).mockReturnValue(true);

    act(() => {
      result.current.handleClick(event);
    });

    expect(dispatchMock).toHaveBeenCalledWith(toggleMultiSelectionInGroup({ gameId: "1", games: gamesMock }));
  });

  it("should dispatch toggleMultiSelectionInGroup with gameId if forCheckbox set to true and multiSelect key was not used", () => {
    const { result } = renderHook(() => useClickHandler({ forCheckbox: true }));
    const event = new MouseEvent("click", { bubbles: true }) as unknown as React.MouseEvent<Element, MouseEvent>;
    Object.defineProperty(event, "target", { writable: true, value: { parentElement: { className: "" } } });
    Object.defineProperty(event, "currentTarget", { writable: true, value: { id: "1" } });
    (wasMultiSelectKeyUsed as jest.Mock).mockReturnValue(false);

    act(() => {
      result.current.handleClick(event);
    });

    expect(dispatchMock).toHaveBeenCalledWith(toggleSelectionInGroup({ gameId: "1" }));
  });

  it("should call performClickAction if forCheckbox is set to false", () => {
    const { result } = renderHook(() => useClickHandler({ forCheckbox: false }));
    const event = new MouseEvent("click", { bubbles: true }) as unknown as React.MouseEvent<Element, MouseEvent>;
    Object.defineProperty(event, "currentTarget", { writable: true, value: { id: "1" } });
    Object.defineProperty(event, "target", { writable: true, value: { parentElement: { className: "" } } });

    act(() => {
      result.current.handleClick(event);
    });

    expect(performClickActionMock).toHaveBeenCalledWith(event, "1", gamesMock);
  });
});

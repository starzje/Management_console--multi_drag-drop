import { renderHook, act } from "@testing-library/react";
import { useSelector } from "react-redux";
import { DropResult } from "react-beautiful-dnd";
import { useDragAndDrop } from "../useDragAndDrop";
import {
  didSomethingChangeSelector,
  gamesSelector,
  lobbyTypeSelector,
  selectMultipleGames,
} from "../../redux/features";
import { Game } from "../../types";
import { mockGamesCasino, mockGamesEIgre } from "../../__mocks__/mockGameData";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

describe("useDragAndDrop", () => {
  let gamesMock: Game[];

  beforeEach(() => {
    gamesMock = [...mockGamesCasino, ...mockGamesEIgre];
    (useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === lobbyTypeSelector) return "e-igre";
      if (selector === gamesSelector) return gamesMock;
      if (selector === didSomethingChangeSelector) return false;
      if (selector === selectMultipleGames) return [];
      return null;
    });
  });

  it("onDragStart should set ghosting variable to true, once drag ends (onDragEnd) it should be set back to false", () => {
    const { result } = renderHook(() => useDragAndDrop(gamesMock));

    expect(result.current.isGhosting).toBe(false);

    act(() => {
      result.current.onDragStart();
    });

    expect(result.current.isGhosting).toBe(true);

    const dropResult: DropResult = {
      source: { index: 0, droppableId: "2" },
      draggableId: "1",
      destination: { droppableId: "2", index: 0 },
      reason: "DROP",
      type: "DEFAULT",
      mode: "FLUID",
      combine: null,
    };

    act(() => {
      result.current.onDragEnd(dropResult);
    });

    expect(result.current.isGhosting).toBe(false);
  });

  it("onDragEnd: if result.destination is false, it should not do anything, if length of games is 2 or larger it should call handleMultipleGamesReorder, otherwise it should handleSingleGameReorder", () => {
    const dispatchMock = jest.fn();
    const { result } = renderHook(() => useDragAndDrop(mockGamesCasino));
    result.current.onDragEnd({
      source: { index: 0, droppableId: "2" },
      draggableId: "1",
      destination: null,
      reason: "DROP",
      type: "DEFAULT",
      mode: "FLUID",
      combine: null,
    });
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});

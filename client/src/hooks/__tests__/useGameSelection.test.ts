import { renderHook } from "@testing-library/react";
import { useGameSelection } from "../useGameSelection";
import { wasToggleInSelectionGroupKeyUsed, wasMultiSelectKeyUsed } from "../../helpers";
import { useDispatch } from "react-redux";
import { toggleSelection, toggleSelectionInGroup, toggleMultiSelectionInGroup } from "../../redux/features";
import { mockGamesEIgre } from "../../__mocks__/mockGameData";

jest.mock("../../helpers");
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

const dispatch = jest.fn();

const games = mockGamesEIgre;

describe("useGameSelection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches toggleSelectionInGroup when toggleInSelectionGroup key was used", () => {
    (wasToggleInSelectionGroupKeyUsed as jest.Mock).mockReturnValue(true);
    (useDispatch as jest.Mock).mockReturnValue(dispatch);
    const { result } = renderHook(() => useGameSelection());

    result.current.performClickAction({} as React.MouseEvent, "1", []);
    expect(dispatch).toHaveBeenCalledWith(toggleSelectionInGroup({ gameId: "1" }));
    expect(dispatch).not.toHaveBeenCalledWith(toggleSelection({ gameId: "1" }));
    expect(dispatch).not.toHaveBeenCalledWith(toggleMultiSelectionInGroup({ gameId: "1", games }));
  });
  it("dispatches toggleMultiSelectionInGroup when MultiSelect key was used", () => {
    (wasToggleInSelectionGroupKeyUsed as jest.Mock).mockReturnValue(false);
    (wasMultiSelectKeyUsed as jest.Mock).mockReturnValue(true);
    (useDispatch as jest.Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useGameSelection());

    const games = mockGamesEIgre;
    result.current.performClickAction({} as React.MouseEvent, "1", games);

    expect(dispatch).toHaveBeenCalledWith(toggleMultiSelectionInGroup({ gameId: "1", games }));
    expect(dispatch).not.toHaveBeenCalledWith(toggleSelectionInGroup({ gameId: "1" }));
    expect(dispatch).not.toHaveBeenCalledWith(toggleSelection({ gameId: "1" }));
  });
  it("dispatches toggleSelection when neither selection key were used", () => {
    (wasToggleInSelectionGroupKeyUsed as jest.Mock).mockReturnValue(false);
    (wasMultiSelectKeyUsed as jest.Mock).mockReturnValue(false);
    (useDispatch as jest.Mock).mockReturnValue(dispatch);

    const { result } = renderHook(() => useGameSelection());

    const games = mockGamesEIgre;
    result.current.performClickAction({} as React.MouseEvent, "1", games);

    expect(dispatch).toHaveBeenCalledWith(toggleSelection({ gameId: "1" }));
    expect(dispatch).not.toHaveBeenCalledWith(toggleMultiSelectionInGroup({ gameId: "1", games }));
    expect(dispatch).not.toHaveBeenCalledWith(toggleSelectionInGroup({ gameId: "1" }));
  });
});

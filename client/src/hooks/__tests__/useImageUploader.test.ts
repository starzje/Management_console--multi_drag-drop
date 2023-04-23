import { renderHook, act, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useImageUploader } from "../../hooks/useImageUploader";
import { LobbyType } from "../../types";
import { RootState } from "../../redux/store";
import { mockGamesCasino, mockGamesEIgre } from "../../__mocks__/mockGameData";
import { ModalType } from "../../redux/features";
import React from "react";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("useImageUploader", () => {
  const dispatch = jest.fn();
  (useDispatch as jest.Mock).mockImplementation(() => dispatch);

  const mockState: RootState = {
    gameSlice: {
      igre: mockGamesEIgre,
      casino: mockGamesCasino,
    },
    gameTypeSlice: {
      lobby: LobbyType.eIgre,
    },
    multiSelectSlice: [mockGamesEIgre[0].gameID.toString()],
    appStateSlice: {
      didSomethingChange: false,
    },
    modalSlice: {
      modalType: ModalType.Image,
      errorType: null,
    },
  };

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set loading to true when image upload begins, and set loading to false when image upload is done", async () => {
    const { result } = renderHook(() => useImageUploader());

    expect(result.current.loading).toBe(false);

    const fakeFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const inputChangeEvent = {
      target: {
        files: [fakeFile],
      },
    };

    act(() => {
      result.current.handleImageChange(inputChangeEvent as any);
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should update the image in the redux store after successful upload", async () => {
    const { result } = renderHook(() => useImageUploader());

    const fakeFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const inputChangeEvent = {
      target: {
        files: [fakeFile],
      },
    };

    await act(async () => {
      await result.current.handleImageChange(inputChangeEvent as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "games/updateGameImage",
        payload: expect.objectContaining({
          gameID: parseInt(mockState.multiSelectSlice[0], 10),
          lobbyType: mockState.gameTypeSlice.lobby,
          imageURL: expect.any(String),
        }),
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "appStateSlice/somethingChanged" }));
  });

  it("should close the modal and reset isImageUploaded state", () => {
    const { result } = renderHook(() => useImageUploader());

    act(() => {
      result.current.handleCloseModal();
    });

    expect(result.current.isImageUploaded).toBe(false);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "modalSlice/dismissModal" }));
  });
});

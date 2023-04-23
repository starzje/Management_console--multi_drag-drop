import { renderHook } from "@testing-library/react";
import { useSelector } from "react-redux";
import { useImageDisplay } from "../../hooks/useImageDisplay";
import { mockGamesEIgre } from "../../__mocks__/mockGameData";
import { RootState } from "../../redux/store";
import { LobbyType } from "../../types";
import { ModalType } from "../../redux/features";
import { mockGamesCasino } from "../../__mocks__/mockGameData";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("useImageDisplay", () => {
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

  it("should set the URL of the image to its .thumb property if it exists", () => {
    const { result } = renderHook(() => useImageDisplay());

    expect(result.current.imageUrl).toBe(mockGamesEIgre[0].thumb);
  });

  it("should set the URL of the image to the provided URL if .thumb property doesn't exist", () => {
    const gameWithoutThumb = { ...mockGamesEIgre[1], thumb: undefined };
    mockState.gameSlice.igre = [gameWithoutThumb];
    mockState.multiSelectSlice = [gameWithoutThumb.gameID.toString()];

    const { result } = renderHook(() => useImageDisplay());

    const expectedUrl = `http://web5.localhost:3000/e-igre/thumbs/${gameWithoutThumb.gameProviderWebName}/${gameWithoutThumb.webName}.jpg`;
    expect(result.current.imageUrl).toBe(expectedUrl);
  });

  it("should set the URL of the image to the placeholder image if game doesn't exist or doesn't have gameProviderWebName and webName properties", () => {
    mockState.gameSlice.igre = [];
    const { result } = renderHook(() => useImageDisplay());

    expect(result.current.imageUrl).toBe("test-file-stub");
  });
});

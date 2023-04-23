import { renderHook, act } from "@testing-library/react";
import { useWindowEvents } from "../useWindowEvents";
import { useDispatch } from "react-redux";
import { deselectAll } from "../../redux/features";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(() => jest.fn()),
}));

jest.mock("../../redux/features", () => ({
  deselectAll: jest.fn(),
}));

describe("useWindowEventsHelper", () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);
    renderHook(() => useWindowEvents());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should call dispatch with deselectAll action on window click event if default is not prevented", () => {
    act(() => {
      const event = new MouseEvent("click", { bubbles: true });
      Object.defineProperty(event, "defaultPrevented", { value: false });
      window.dispatchEvent(event);
    });

    expect(dispatchMock).toHaveBeenCalled();
    expect(deselectAll).toHaveBeenCalled();
  });
  it("should not call dispatch with deselectAll action on window click event if default is prevented", () => {
    act(() => {
      const event = new MouseEvent("click", { bubbles: true });
      Object.defineProperty(event, "defaultPrevented", { value: true });
      window.dispatchEvent(event);
    });
    expect(dispatchMock).not.toHaveBeenCalled();
    expect(deselectAll).not.toHaveBeenCalled();
  });

  it("should call dispatch with deselectAll action on window Escape keydown event", () => {
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" });
      window.dispatchEvent(event);
    });

    expect(dispatchMock).toHaveBeenCalled();
    expect(deselectAll).toHaveBeenCalled();
  });

  it("should not call dispatch with deselectAll action on window non-Escape keydown event", () => {
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      window.dispatchEvent(event);
    });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(deselectAll).not.toHaveBeenCalled();
  });
});

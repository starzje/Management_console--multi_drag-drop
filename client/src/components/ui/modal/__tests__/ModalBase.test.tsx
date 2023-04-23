import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { ModalBase } from "../ModalBase";
import "@testing-library/jest-dom/extend-expect";
import { dismissModal } from "../../../../redux/features";
import { renderWithReduxStore } from "../__testUtils__/reduxTestWrapper";

jest.mock("../../../../redux/features", () => ({
  dismissModal: jest.fn(() => ({ type: "DISMISS_MODAL" })),
}));

describe("ModalBase component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithReduxStore(<ModalBase>Modal content</ModalBase>);
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("handles close button click", () => {
    renderWithReduxStore(<ModalBase>Modal content</ModalBase>);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(dismissModal).toHaveBeenCalled();
  });

  it("handles custom close function", () => {
    const customCloseFn = jest.fn();
    renderWithReduxStore(<ModalBase customCloseFn={customCloseFn}>Modal content</ModalBase>);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(customCloseFn).toHaveBeenCalled();
    expect(dismissModal).not.toHaveBeenCalled();
  });

  it("handles overlay click", () => {
    renderWithReduxStore(<ModalBase>Modal content</ModalBase>);
    const overlay = screen.getByRole("presentation");
    fireEvent.click(overlay);
    expect(dismissModal).toHaveBeenCalled();
  });

  it("doesn't dismiss modal on overlay click when dismissDisabled is true", () => {
    renderWithReduxStore(<ModalBase dismissDisabled>Modal content</ModalBase>);
    const overlay = screen.getByRole("presentation");
    fireEvent.click(overlay);
    expect(dismissModal).not.toHaveBeenCalled();
  });

  it("doesn't propagate click event inside the modal", () => {
    renderWithReduxStore(<ModalBase>Modal content</ModalBase>);
    const modal = screen.getByText("Modal content");
    fireEvent.click(modal);
    expect(dismissModal).not.toHaveBeenCalled();
  });
});

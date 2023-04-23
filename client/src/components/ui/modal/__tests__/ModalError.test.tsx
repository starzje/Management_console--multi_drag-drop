// ModalError.test.tsx
import * as React from "react";
import { screen, cleanup } from "@testing-library/react";
import { ModalError } from "../ModalError";
import { useSelector } from "react-redux";
import { renderWithReduxStore } from "../__testUtils__/reduxTestWrapper";

import "@testing-library/jest-dom/extend-expect";
import { ModalType, initialLoadingSelector, modalMessage, modalSelector } from "../../../../redux/features";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

describe("ModalError component", () => {
  const errorMessage = "Sample error message";
  const initialLoadingCompleted = true;
  const modalErrorType = ModalType.Error;

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === modalMessage) {
        return errorMessage;
      }
      if (selector === initialLoadingSelector) {
        return initialLoadingCompleted;
      }
      if (selector === modalSelector) {
        return modalErrorType;
      }
      return null;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders error message and buttons", () => {
    renderWithReduxStore(<ModalError />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Pokušaj ponovno")).toBeInTheDocument();
    expect(screen.getByText("Odustani")).toBeInTheDocument();
  });
});

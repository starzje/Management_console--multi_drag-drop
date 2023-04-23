// ModalConnected.test.tsx

import * as React from "react";
import { screen } from "@testing-library/react";
import { ModalConnected } from "../ModalConnected";
import { useSelector } from "react-redux";
import { ModalType } from "../../../../redux/features";
import { renderWithReduxStore } from "../__testUtils__/reduxTestWrapper";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));

describe("ModalConnected component", () => {
  it("renders ModalError based on modal type", () => {
    (useSelector as jest.Mock).mockReturnValue(ModalType.Error);

    renderWithReduxStore(<ModalConnected />);

    expect(screen.getByText("Pokušaj ponovno")).toBeInTheDocument();
    expect(screen.getByText("Odustani")).toBeInTheDocument();
  });
  it("renders ModalDiscard based on modal type", () => {
    (useSelector as jest.Mock).mockReturnValue(ModalType.DiscardDialog);

    renderWithReduxStore(<ModalConnected />);

    expect(screen.getByText("Jeste li sigurni da želite odbaciti promjene?")).toBeInTheDocument();
  });
  it("renders ModalImage based on modal type", () => {
    (useSelector as jest.Mock).mockReturnValue(ModalType.Image);

    renderWithReduxStore(<ModalConnected />);

    expect(screen.getByText("Odaberi novu sliku")).toBeInTheDocument();
  });
  it("renders ModalNotification based on modal type", () => {
    (useSelector as jest.Mock).mockReturnValue(ModalType.Notification);

    renderWithReduxStore(<ModalConnected />);

    expect(screen.getByText("Radnja uspješno izvršena")).toBeInTheDocument();
  });
  it("renders ModalSave based on modal type", () => {
    (useSelector as jest.Mock).mockReturnValue(ModalType.SaveDialog);

    renderWithReduxStore(<ModalConnected />);

    expect(screen.getByText("Jeste li sigurni da želite spremiti promjene?")).toBeInTheDocument();
  });
  it("renders ModalSpinner based on modal type", () => {
    (useSelector as jest.Mock).mockReturnValue(ModalType.Spinner);

    renderWithReduxStore(<ModalConnected />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });
  it("doesnt render anything if modal type is none", () => {
    (useSelector as jest.Mock).mockReturnValue(ModalType.None);

    renderWithReduxStore(<ModalConnected />);

    expect(screen.queryByText("Pokušaj ponovno")).not.toBeInTheDocument();
    expect(screen.queryByText("Odustani")).not.toBeInTheDocument();
    expect(screen.queryByText("Jeste li sigurni da želite odbaciti promjene?")).not.toBeInTheDocument();
    expect(screen.queryByText("Odaberi novu sliku")).not.toBeInTheDocument();
    expect(screen.queryByText("Radnja uspješno izvršena")).not.toBeInTheDocument();
    expect(screen.queryByText("Jeste li sigurni da želite spremiti promjene?")).not.toBeInTheDocument();
    expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
  });
});

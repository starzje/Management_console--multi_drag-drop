// ModalDialog.test.tsx
import * as React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithReduxStore } from "../__testUtils__/reduxTestWrapper";
import { ModalDialog } from "../ModalDialog";
import "@testing-library/jest-dom/extend-expect";

describe("ModalDialog component", () => {
  const button1Label = "Button 1";
  const button2Label = "Button 2";
  const onButtonClick = jest.fn();
  const children = "Sample Content";

  it("renders children, button labels, and calls onButtonClick when button is clicked", () => {
    renderWithReduxStore(
      <ModalDialog button1Label={button1Label} button2Label={button2Label} onButtonClick={onButtonClick}>
        {children}
      </ModalDialog>,
    );

    expect(screen.getByText(children)).toBeInTheDocument();
    expect(screen.getByText(button1Label)).toBeInTheDocument();
    expect(screen.getByText(button2Label)).toBeInTheDocument();

    const button1 = screen.getByText(button1Label);
    fireEvent.click(button1);
    const button2 = screen.getByText(button2Label);
    fireEvent.click(button2);

    expect(onButtonClick).toHaveBeenCalled();
  });

  it("renders only one button when showButton2 is set to false", () => {
    renderWithReduxStore(
      <ModalDialog
        button1Label={button1Label}
        button2Label={button2Label}
        showButton2={false}
        onButtonClick={onButtonClick}
      >
        {children}
      </ModalDialog>,
    );

    expect(screen.getByText(children)).toBeInTheDocument();
    expect(screen.getByText(button1Label)).toBeInTheDocument();
    expect(screen.queryByText(button2Label)).not.toBeInTheDocument();
  });
});

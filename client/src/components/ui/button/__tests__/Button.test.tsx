import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Button } from "../Button";
import "@testing-library/jest-dom/extend-expect";

describe("Button", () => {
  it("should render with text and class", () => {
    const { getByText, container } = render(<Button btnClass="my-btn-class" text="Click me" onClick={() => {}} />);

    const button = getByText("Click me");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("my-btn-class");
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should disable the button if `isDisabled` prop is passed", () => {
    const { getByText } = render(
      <Button btnClass="my-btn-class" text="Click me" onClick={() => {}} isDisabled={true} />,
    );

    const button = getByText("Click me");
    expect(button).toBeDisabled();
  });

  it("should call the `onClick` prop when clicked", () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Button btnClass="my-btn-class" text="Click me" onClick={handleClick} />);

    const button = getByText("Click me");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

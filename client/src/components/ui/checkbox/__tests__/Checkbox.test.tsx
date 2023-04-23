import * as React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Checkbox } from "../Checkbox";
import { useClickHandler } from "../../../../hooks";

jest.mock("../../../../hooks");

describe("Checkbox", () => {
  const mockHandleClick = jest.fn();
  (useClickHandler as jest.Mock).mockReturnValue({ handleClick: mockHandleClick });

  it("should render a checkbox with the given id and isSelected prop", () => {
    const { container } = render(<Checkbox id="my-checkbox" isSelected="my-checkbox" />);

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox.id).toBe("my-checkbox");
    expect(checkbox.checked).toBe(true);
  });

  it("should call the handleClick function when clicked", () => {
    const { container } = render(<Checkbox id="my-checkbox" />);
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    fireEvent.click(checkbox);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it("should set the checkbox as checked if the id and isSelected prop match", () => {
    const { container } = render(<Checkbox id="my-checkbox" isSelected="my-checkbox" />);
    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
  });
});
